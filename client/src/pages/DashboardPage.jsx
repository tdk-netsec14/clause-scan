import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Eye, Loader2, Upload, AlertTriangle, CheckCircle2, Clock, Shield, TrendingUp, LayoutDashboard, History, FileText, LogOut, FileSearch } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { getGradeColor, getGradeBg } from '../utils/riskColors';
import { useAuth } from '../context/AuthContext';

const STATUS_CONFIG = {
  uploaded: { label: 'Uploading', color: 'text-gray-500', bg: 'bg-gray-100', dot: 'bg-gray-400' },
  extracting: { label: 'Reading', color: 'text-indigo-600', bg: 'bg-indigo-50', dot: 'bg-indigo-500 animate-pulse' },
  extracted: { label: 'Ready', color: 'text-indigo-600', bg: 'bg-indigo-50', dot: 'bg-indigo-500' },
  analyzing: { label: 'Analyzing', color: 'text-amber-700', bg: 'bg-amber-100', dot: 'bg-amber-500 animate-pulse' },
  analyzed: { label: 'Complete', color: 'text-green-700', bg: 'bg-green-100', dot: 'bg-green-500' },
  error: { label: 'Failed', color: 'text-red-700', bg: 'bg-red-100', dot: 'bg-red-500' }
};

const DashboardPage = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const fetchDocuments = useCallback(async () => {
    try { const { data } = await api.get('/api/documents'); setDocuments(data); }
    catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { fetchDocuments(); }, [fetchDocuments]);

  useEffect(() => {
    if (!documents.some(d => !['analyzed', 'error'].includes(d.status))) return;
    const interval = setInterval(fetchDocuments, 3000);
    return () => clearInterval(interval);
  }, [documents, fetchDocuments]);

  const handleDelete = async () => {
    if (!deleteModal) return;
    setIsDeleting(true);
    try {
      await api.delete(`/api/documents/${deleteModal._id}`);
      setDocuments(documents.filter(d => d._id !== deleteModal._id));
      toast.success('Contract removed');
    } catch (err) { toast.error('Delete failed'); }
    finally { setIsDeleting(false); setDeleteModal(null); }
  };

  const analyzedDocs = documents.filter(d => d.status === 'analyzed');
  const totalAnalyzed = analyzedDocs.length;
  const avgGrade = totalAnalyzed > 0
    ? analyzedDocs.reduce((s, d) => s + (d.healthScore?.percentage || 0), 0) / totalAnalyzed : 0;
  const avgLetter = avgGrade >= 90 ? 'A' : avgGrade >= 75 ? 'B' : avgGrade >= 60 ? 'C' : avgGrade >= 45 ? 'D' : 'F';
  const criticalCount = analyzedDocs.filter(d => ['F','D'].includes(d.healthScore?.grade)).length;

  return (
    <div className="bg-gray-50 min-h-screen flex pt-20">
      
      {/* LEFT SIDEBAR (Desktop Only) */}
      <aside className="hidden lg:flex flex-col w-64 bg-navy-900 fixed top-20 bottom-0 left-0 overflow-y-auto">
        <div className="flex-1 py-8 px-4 space-y-2">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gold-500/10 border-l-4 border-gold-500 text-gold-500 font-medium">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link to="/upload" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-gray-200 hover:bg-navy-800 transition-colors font-medium border-l-4 border-transparent">
            <Upload className="w-5 h-5" />
            Upload Contract
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-gray-200 hover:bg-navy-800 transition-colors font-medium border-l-4 border-transparent">
            <History className="w-5 h-5" />
            History
          </button>
        </div>

        <div className="p-6 border-t border-navy-800">
          <div className="mb-4">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 lg:ml-64 p-6 lg:p-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy-900">My Contracts</h1>
            <Link to="/upload" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-colors">
              <Upload className="w-4 h-4" /> Upload New Contract
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-indigo-600">
              <p className="text-sm text-gray-500 font-medium mb-1">Total Analyzed</p>
              <p className="text-3xl font-bold text-navy-950">{totalAnalyzed}</p>
            </div>
            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-gold-500">
              <p className="text-sm text-gray-500 font-medium mb-1">Average Health Grade</p>
              {totalAnalyzed > 0 ? (
                <p className={`text-3xl font-bold ${getGradeColor(avgLetter)}`}>{avgLetter}</p>
              ) : (
                <p className="text-3xl font-bold text-gray-300">–</p>
              )}
                const fetchDocuments = useCallback(async () => {
                  try {
                  const fetchDocuments = useCallback(async () => {
                    try {
                      const { data } = await api.get('/api/documents');
                      setDocuments(data);
                    } catch (error) {
                      console.error(error);
                    } finally {
                      setIsLoading(false);
                    }
                  } finally {
                    setIsLoading(false);
                  }
              <p className="text-3xl font-bold text-red-600">{criticalCount}</p>
            </div>
          </div>

          {/* Document List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
          ) : documents.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <FileSearch className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-1">No contracts analyzed yet</h3>
              <p className="text-gray-400 text-sm mb-6">Upload your first contract to get started</p>
              <Link to="/upload" className="inline-flex bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors">
                Upload Contract
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc, index) => {
                const s = STATUS_CONFIG[doc.status] || STATUS_CONFIG.uploaded;
                return (
                  <motion.div
                    key={doc._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    {/* Left */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-navy-950 truncate" title={doc.originalName}>
                          {doc.originalName.length > 40 ? doc.originalName.substring(0, 40) + '...' : doc.originalName}
                        </p>
                        <p className="text-sm text-gray-400 mt-0.5">
                          {doc.pageCount ? `${doc.pageCount} pages • ` : ''}uploaded {new Date(doc.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    {/* Center */}
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${s.bg} ${s.color}`}>
                        <span className={`w-2 h-2 rounded-full ${s.dot}`}></span>
                        {s.label}
                      </span>
                      {doc.status === 'analyzed' && doc.healthScore && (
                        <div className="flex items-center gap-2">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${getGradeColor(doc.healthScore.grade)} ${getGradeBg(doc.healthScore.grade)}`}>
                            {doc.healthScore.grade}
                          </span>
                          <span className="text-sm text-gray-500">{doc.healthScore.score} / 100</span>
                        </div>
                      )}
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-3 shrink-0">
                      {doc.status === 'analyzed' && (
                        <button onClick={() => navigate(`/analysis/${doc._id}`)} className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
                          View Analysis
                        </button>
                      )}
                      <button onClick={() => setDeleteModal(doc)} className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </main>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-navy-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => !isDeleting && setDeleteModal(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={e => e.stopPropagation()}>
              <h3 className="font-serif text-xl font-bold text-navy-900 mb-2">Delete Contract?</h3>
              <p className="text-sm text-gray-500 mb-6">"<span className="text-gray-700 font-medium">{deleteModal.originalName}</span>" will be permanently removed.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteModal(null)} disabled={isDeleting} className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 py-2.5 rounded-xl text-sm font-medium transition-colors">Cancel</button>
                <button onClick={handleDelete} disabled={isDeleting} className="flex-1 bg-red-600 text-white py-2.5 rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors text-sm font-semibold flex items-center justify-center gap-2">
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}{isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardPage;
