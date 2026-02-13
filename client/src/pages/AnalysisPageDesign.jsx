import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RefreshCw,
  Loader2,
  ArrowLeft,
  FileText,
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

// All functional analysis components
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

const AnalysisPageDesign = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
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
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [docId]);

  useEffect(() => {
    fetchDoc();
  }, [fetchDoc]);

  useEffect(() => {
    if (!doc || !POLL.includes(doc.status)) return;
    const interval = setInterval(fetchDoc, 3000);
    return () => clearInterval(interval);
  }, [doc, fetchDoc]);

  useEffect(() => {
    if (!doc || doc.status !== 'extracted' || analysisStartRef.current) return;

    const startAnalysis = async () => {
      analysisStartRef.current = true;
      try {
        await api.post(`/api/analysis/${docId}`);
        setDoc((previous) => (previous ? { ...previous, status: 'analyzing' } : previous));
        toast.success('Reading your contract now...');
      } catch (error) {
        analysisStartRef.current = false;
        toast.error(error.error || 'Could not start analysis');
      }
    };

    startAnalysis();
  }, [doc, docId]);

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await api.post(`/api/analysis/${docId}`);
      setDoc((previous) => ({ ...previous, status: 'analyzing', errorMessage: null }));
      toast.success('Retrying...');
    } catch (error) {
      toast.error('Retry failed');
    } finally {
      setRetrying(false);
    }
  };

  const filtered = useMemo(() => {
    if (!doc?.clauses) return [];
    let c = [...doc.clauses];
    if (filters.risk !== 'all') {
      if (filters.risk === 'low') c = c.filter(x => x.riskScore <= 2);
      else c = c.filter(x => x.riskScore === parseInt(filters.risk));
    }
    if (filters.type !== 'All') c = c.filter(x => x.type === filters.type);
    if (filters.favorability !== 'all') c = c.filter(x => x.favorability === filters.favorability);
    return c.sort((a, b) => b.riskScore - a.riskScore);
  }, [doc?.clauses, filters]);

  // ── Loading / Error / Not Found States ──
  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbf8fc] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#4F46E5]" />
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="min-h-[60vh] bg-[#fbf8fc] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#52525b]">Contract not found</p>
          <button onClick={() => navigate('/dashboard')} className="mt-4 text-[#4F46E5] font-semibold hover:underline">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (POLL.includes(doc.status)) return <LoadingAnalysis />;

  if (doc.status === 'error') {
    return (
      <div className="min-h-[60vh] bg-[#fbf8fc] flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
          <h2 className="font-serif text-xl font-bold text-black mb-2">Analysis Failed</h2>
          <p className="text-sm text-[#52525b] mb-6">{doc.errorMessage || 'An error occurred during analysis.'}</p>
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="border border-[#4F46E5] text-[#4F46E5] hover:bg-[#eef2ff] px-6 py-2.5 rounded-xl font-semibold inline-flex items-center gap-2 transition-colors"
          >
            {retrying ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {retrying ? 'Retrying...' : 'Try Again'}
          </button>
        </motion.div>
      </div>
    );
  }

  const titleDate = doc.createdAt
    ? new Date(doc.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  // ── Main Analysis View ──
  return (
    <div className="min-h-screen bg-[#fbf8fc] text-black">
      {/* Dot-grid texture */}
      <div className="fixed inset-0 bg-dot-grid opacity-30 pointer-events-none" />

      {/* ─── SIDEBAR ─── */}
      <Sidebar />

      {/* ─── MAIN CONTENT ─── */}
      <div className="relative z-10 lg:ml-[212px]">
        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-[1120px] px-5 py-8 lg:px-8 lg:py-10"
        >
          {/* ── Back + Title ── */}
          <div className="border-b border-[#e5e7eb] pb-6 mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#6b7280] hover:text-black transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </button>
            <h1 className="font-serif text-[32px] sm:text-[40px] font-semibold leading-tight tracking-[-0.03em] text-black">
              {doc.originalName || 'Contract Analysis'}
            </h1>
            <p className="mt-2 text-[15px] text-[#52525b]">
              {titleDate && `Analyzed on ${titleDate}`}
              {doc.pageCount ? ` · ${doc.pageCount} pages` : ''}
            </p>
          </div>

          {/* ── Analysis Sections (Full-Width, Generous Spacing) ── */}
          <div className="space-y-8">

            {/* 1. Disclaimer */}
            <DisclaimerBanner />

            {/* 2. Health Score — full width */}
            <ContractHealthScore healthScore={doc.healthScore} />

            {/* 3. Red Flags — full width */}
            <RedFlagPanel redFlags={doc.redFlags} />

            {/* 4. Risk Summary — full width */}
            <RiskSummaryBanner document={doc} />

            {/* 5. Law Book Review — full width */}
            <LawBookReviewPanel lawReview={doc.lawReview} />

            {/* 6. Missing Clauses + Loopholes — side by side on desktop */}
            <div className="grid gap-6 lg:grid-cols-2">
              <MissingClausesPanel missingClauses={doc.missingClauses} />
              <LoopholePanel loopholes={doc.loopholes} />
            </div>

            {/* 7. Executive Summary — full width */}
            <SummaryPanel summary={doc.summary} />

            {/* 8. Negotiation Checklist — full width */}
            <NegotiationPanel negotiationPoints={doc.negotiationPoints} documentId={doc._id} />

            {/* 9. Clause Breakdown — full width */}
            {doc.clauses?.length > 0 && (
              <div className="space-y-4">
                <FilterBar
                  filters={filters}
                  onFilterChange={(k, v) => setFilters(p => ({ ...p, [k]: v }))}
                  totalCount={doc.clauses.length}
                  filteredCount={filtered.length}
                />
                <div className="space-y-3">
                  {filtered.map(c => (
                    <ClauseCard key={c.id} clause={c} />
                  ))}
                  {filtered.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">No clauses match your filters.</div>
                  )}
                </div>
              </div>
            )}

            {/* ChatBox manages its own floating state globally */}
          </div>
        </motion.main>
      </div>

      <ChatBox documentId={doc._id} />
    </div>
  );
};

export default AnalysisPageDesign;
