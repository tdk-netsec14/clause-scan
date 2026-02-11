import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RefreshCw, Loader2, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import DisclaimerBanner from '../components/DisclaimerBanner';
import ContractHealthScore from '../components/ContractHealthScore';
import RedFlagPanel from '../components/RedFlagPanel';
import RiskSummaryBanner from '../components/RiskSummaryBanner';
import LawBookReviewPanel from '../components/LawBookReviewPanel';
import MissingClausesPanel from '../components/MissingClausesPanel';
import LoopholePanel from '../components/LoopholePanel';
import SummaryPanel from '../components/SummaryPanel';
import NegotiationPanel from '../components/NegotiationPanel';
import FilterBar from '../components/FilterBar';
import ClauseCard from '../components/ClauseCard';
import ChatBox from '../components/ChatBox';
import LoadingAnalysis from '../components/LoadingAnalysis';

const POLL = ['uploaded', 'extracting', 'extracted', 'analyzing'];

const AnalysisPage = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const analysisStartRef = useRef(false);
  const [filters, setFilters] = useState({ risk: 'all', type: 'All', favorability: 'all' });

  const fetchDoc = useCallback(async () => {
    try {
      const { data } = await api.get(`/api/documents/${docId}`);
      setDoc(data);
      if (data.status === 'analyzed') toast.success('Analysis complete!', { id: 'done' });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [docId]);

  useEffect(() => { fetchDoc(); }, [fetchDoc]);
  useEffect(() => {
    if (!doc || !POLL.includes(doc.status)) return;
    const i = setInterval(fetchDoc, 3000); return () => clearInterval(i);
  }, [doc, fetchDoc]);

  useEffect(() => {
    if (!doc || doc.status !== 'extracted' || analysisStartRef.current) return;

    const startAnalysis = async () => {
      analysisStartRef.current = true;
      try {
        await api.post(`/api/analysis/${docId}`);
        setDoc((previous) => (previous ? { ...previous, status: 'analyzing' } : previous));
        toast.success('Reading your contract now...');
      } catch (err) {
        analysisStartRef.current = false;
        toast.error(err.error || 'Could not start analysis');
      }
    };

    startAnalysis();
  }, [doc, docId]);

  const handleRetry = async () => {
    setRetrying(true);
    try { await api.post(`/api/analysis/${docId}`); setDoc(p => ({ ...p, status: 'analyzing', errorMessage: null })); toast.success('Retrying...'); }
    catch (err) { toast.error('Retry failed'); }
    finally { setRetrying(false); }
  };

  const filtered = useMemo(() => {
    if (!doc?.clauses) return [];
    let c = [...doc.clauses];
    if (filters.risk !== 'all') { if (filters.risk === 'low') c = c.filter(x => x.riskScore <= 2); else c = c.filter(x => x.riskScore === parseInt(filters.risk)); }
    if (filters.type !== 'All') c = c.filter(x => x.type === filters.type);
    if (filters.favorability !== 'all') c = c.filter(x => x.favorability === filters.favorability);
    return c.sort((a, b) => b.riskScore - a.riskScore);
  }, [doc?.clauses, filters]);

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  if (!doc) return <div className="min-h-[60vh] bg-gray-50 flex items-center justify-center"><div className="text-center"><p className="text-gray-500">Contract not found</p><button onClick={() => navigate('/dashboard')} className="mt-4 text-indigo-600 font-semibold hover:underline">Back to Dashboard</button></div></div>;
  if (POLL.includes(doc.status)) return <LoadingAnalysis />;

  if (doc.status === 'error') return (
    <div className="min-h-[60vh] bg-cream flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Analysis Failed</h2>
        <p className="text-sm text-gray-500 mb-6">{doc.errorMessage || 'An error occurred during analysis.'}</p>
        <button onClick={handleRetry} disabled={retrying} className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-6 py-2.5 rounded-xl font-semibold inline-flex items-center gap-2">
          {retrying ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}{retrying ? 'Retrying...' : 'Try Again'}
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-16">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto px-6 lg:px-10">
        <button onClick={() => navigate('/dashboard')} className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-indigo-600 mb-8 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <div className="space-y-6">
          <DisclaimerBanner />
          {/* Top Grid: Health Score + Red Flags */}
          <div className="grid lg:grid-cols-2 gap-6">
            <ContractHealthScore healthScore={doc.healthScore} />
            <RedFlagPanel redFlags={doc.redFlags} />
          </div>
          <RiskSummaryBanner document={doc} />
          <LawBookReviewPanel lawReview={doc.lawReview} />
          <div className="grid lg:grid-cols-2 gap-6">
            <MissingClausesPanel missingClauses={doc.missingClauses} />
            <LoopholePanel loopholes={doc.loopholes} />
          </div>
          <SummaryPanel summary={doc.summary} />
          <NegotiationPanel negotiationPoints={doc.negotiationPoints} documentId={doc._id} />
          {doc.clauses?.length > 0 && (
            <>
              <FilterBar filters={filters} onFilterChange={(k, v) => setFilters(p => ({ ...p, [k]: v }))} totalCount={doc.clauses.length} filteredCount={filtered.length} />
              <div className="space-y-3">
                {filtered.map(c => <ClauseCard key={c.id} clause={c} />)}
                {filtered.length === 0 && <div className="text-center py-8 text-gray-400 text-sm">No clauses match your filters.</div>}
              </div>
            </>
          )}
          <ChatBox documentId={doc._id} />
        </div>
      </motion.div>
    </div>
  );
};

export default AnalysisPage;
