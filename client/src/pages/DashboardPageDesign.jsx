import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2,
  Upload,
  FileText,
  Filter,
  Trash2,
  FolderOpen,
  Settings,
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { getGradeColor, getGradeBg } from '../utils/riskColors';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

const STATUS_CONFIG = {
  uploaded: { label: 'Uploading', color: 'text-gray-500', bg: 'bg-gray-100', dot: 'bg-gray-400' },
  extracting: { label: 'Reading', color: 'text-indigo-600', bg: 'bg-indigo-50', dot: 'bg-indigo-500 animate-pulse' },
  extracted: { label: 'Ready', color: 'text-indigo-600', bg: 'bg-indigo-50', dot: 'bg-indigo-500' },
  analyzing: { label: 'Analyzing', color: 'text-amber-700', bg: 'bg-amber-100', dot: 'bg-amber-500 animate-pulse' },
  analyzed: { label: 'Complete', color: 'text-green-700', bg: 'bg-green-100', dot: 'bg-green-500' },
  error: { label: 'Failed', color: 'text-red-700', bg: 'bg-red-100', dot: 'bg-red-500' },
};

const DashboardPageDesign = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const fetchDocuments = useCallback(async () => {
    try {
      const { data } = await api.get('/api/documents');
      setDocuments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    if (!documents.some((document) => !['analyzed', 'error'].includes(document.status))) return;
    const interval = setInterval(fetchDocuments, 3000);
    return () => clearInterval(interval);
  }, [documents, fetchDocuments]);

  const handleDelete = async () => {
    if (!deleteModal) return;
    setIsDeleting(true);
    try {
      await api.delete(`/api/documents/${deleteModal._id}`);
      setDocuments(documents.filter((document) => document._id !== deleteModal._id));
      toast.success('Contract removed');
    } catch (error) {
      toast.error('Delete failed');
    } finally {
      setIsDeleting(false);
      setDeleteModal(null);
    }
  };

  const analyzedDocs = documents.filter((document) => document.status === 'analyzed');
  const totalAnalyzed = analyzedDocs.length;
  const avgGrade = totalAnalyzed > 0
    ? analyzedDocs.reduce((sum, document) => sum + (document.healthScore?.percentage || 0), 0) / totalAnalyzed
    : 0;
  const avgLetter = avgGrade >= 90 ? 'A' : avgGrade >= 75 ? 'B' : avgGrade >= 60 ? 'C' : avgGrade >= 45 ? 'D' : 'F';
  const criticalCount = analyzedDocs.filter((document) => ['F', 'D'].includes(document.healthScore?.grade)).length;

  const formatDate = (value) => new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const displayGrade = totalAnalyzed > 0 ? avgLetter : '–';

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f5ef] text-black">
      {/* Dot-grid texture */}
      <div className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-transparent to-transparent pointer-events-none" />

      {/* ─── SIDEBAR ─── */}
      <Sidebar />

      {/* ─── MAIN CONTENT ─── */}
      <main className="relative z-10 min-h-screen lg:pl-[212px]">
        <div className="mx-auto max-w-[1120px] px-5 py-10 lg:px-8 lg:py-12">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">

            {/* ── Header ── */}
            <div className="flex flex-col gap-4 border-b border-[#e5e7eb] pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="font-serif text-[38px] font-semibold tracking-[-0.03em] text-black sm:text-[42px]">My Contracts</h1>
                <p className="mt-2 text-[15px] text-[#52525b]">Manage and analyze your legal documents with AI precision.</p>
              </div>
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 self-start rounded bg-[#4F46E5] px-5 py-3 text-[13px] font-semibold text-white shadow-[0_8px_18px_rgba(79,70,229,0.26)] transition-transform hover:-translate-y-0.5"
              >
                <Upload className="h-4 w-4" />
                Upload Document
              </Link>
            </div>

            {/* ── Stats Row ── */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Total Contracts */}
              <div className="rounded-2xl bg-[#081126] p-6 text-white shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
                <div className="flex items-start justify-between">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-white/70">Total Contracts</p>
                  <FolderOpen className="h-5 w-5 text-white/60" />
                </div>
                <div className="mt-6 text-[48px] font-semibold leading-none tracking-[-0.05em]">{documents.length}</div>
              </div>

              {/* Avg Health Grade */}
              <div className="rounded-2xl bg-[#f2cf69] p-6 text-[#6f5200] shadow-[0_1px_0_rgba(255,255,255,0.18)_inset]">
                <div className="flex items-start justify-between">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-[#7a5d00]">Avg Health Grade</p>
                  <Settings className="h-5 w-5 text-[#7a5d00]/60" />
                </div>
                <div className="mt-6 flex items-end gap-2">
                  <div className="font-serif text-[48px] font-bold leading-none">{displayGrade}</div>
                  {totalAnalyzed > 0 && <div className="pb-1.5 text-[14px] text-[#7a5d00]/70">stable</div>}
                </div>
              </div>

              {/* Critical Risks */}
              <div className="rounded-2xl bg-[#ffd2cf] p-6 text-[#b11212] shadow-[0_1px_0_rgba(255,255,255,0.18)_inset] sm:col-span-2 lg:col-span-1">
                <div className="flex items-start justify-between">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-[#a81616]">Critical Risks</p>
                  <div className="rounded-full border border-[#a81616]/30 p-1">
                    <span className="block h-3 w-3 rounded-full border border-[#a81616]" />
                  </div>
                </div>
                <div className="mt-6 font-serif text-[48px] font-semibold leading-none tracking-[-0.05em]">{criticalCount}</div>
              </div>
            </div>

            {/* ── Document List ── */}
            <div>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-serif text-[24px] font-semibold tracking-[-0.02em] text-black">Recent Documents</h2>
                <button className="inline-flex items-center gap-2 text-[14px] text-black/60 transition-colors hover:text-black cursor-default" title="Filters coming soon">
                  <Filter className="h-4 w-4" />
                  Filter
                </button>
              </div>

              {isLoading ? (
                <div className="rounded-3xl border border-[#ece7eb] bg-white py-20 text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#4F46E5]" />
                </div>
              ) : documents.length === 0 ? (
                /* Empty State */
                <div className="rounded-3xl border border-dashed border-[#e6e1e5] bg-white px-6 py-16 shadow-[0_1px_0_rgba(0,0,0,0.02)] sm:px-10">
                  <div className="mx-auto flex w-full max-w-[600px] flex-col items-center text-center">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eef1ff] text-[#4F46E5]">
                      <Upload className="h-7 w-7" />
                    </div>
                    <h3 className="font-serif text-[26px] font-semibold tracking-[-0.02em] text-black">No Contracts Analyzed Yet</h3>
                    <p className="mt-3 max-w-[460px] text-[15px] leading-7 text-[#52525b]">
                      Upload your first legal document to let ClauseScan identify risks, extract key terms, and generate a health grade.
                    </p>
                    <Link
                      to="/upload"
                      className="mt-6 rounded border border-[#d4d4d8] bg-white px-8 py-3 text-[13px] font-medium text-black shadow-[0_1px_0_rgba(0,0,0,0.03)] transition-colors hover:bg-gray-50"
                    >
                      Select a file from device
                    </Link>
                    <p className="mt-4 text-[12px] text-[#9ca3af]">Supported formats: PDF, DOCX, TXT, JPG, JPEG (Max 20MB)</p>
                  </div>
                </div>
              ) : (
                /* Document Cards */
                <div className="space-y-3">
                  {documents.map((document, index) => {
                    const status = STATUS_CONFIG[document.status] || STATUS_CONFIG.uploaded;
                    return (
                      <motion.div
                        key={document._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                        className="flex flex-col gap-4 rounded-2xl border border-[#ece7eb] bg-white px-5 py-4 shadow-[0_1px_0_rgba(0,0,0,0.02)] transition-shadow hover:shadow-md md:flex-row md:items-center md:justify-between"
                      >
                        {/* File Info */}
                        <div className="flex min-w-0 flex-1 items-center gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eef1ff] text-[#4F46E5]">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-[15px] font-medium text-black" title={document.originalName}>{document.originalName}</p>
                            <p className="mt-0.5 text-[13px] text-[#6b7280]">{document.pageCount ? `${document.pageCount} pages · ` : ''}uploaded {formatDate(document.createdAt)}</p>
                          </div>
                        </div>

                        {/* Status + Grade */}
                        <div className="flex items-center gap-3 shrink-0">
                          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${status.bg} ${status.color}`}>
                            <span className={`h-2 w-2 rounded-full ${status.dot}`} />
                            {status.label}
                          </span>
                          {document.status === 'analyzed' && document.healthScore && (
                            <div className="flex items-center gap-2">
                              <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${getGradeColor(document.healthScore.grade)} ${getGradeBg(document.healthScore.grade)}`}>
                                {document.healthScore.grade}
                              </span>
                              <span className="text-sm text-[#6b7280]">{document.healthScore.score} / 100</span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 shrink-0">
                          {document.status === 'analyzed' && (
                            <button
                              onClick={() => navigate(`/analysis/${document._id}`)}
                              className="rounded-md border border-[#4F46E5] px-4 py-2 text-sm font-medium text-[#4F46E5] transition-colors hover:bg-[#f2f0ff]"
                            >
                              View Analysis
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteModal(document)}
                            className="rounded-md p-2 text-[#9ca3af] transition-colors hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

          </motion.div>
        </div>
      </main>

      {/* ─── DELETE MODAL ─── */}
      <AnimatePresence>
        {deleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 backdrop-blur-sm"
            onClick={() => !isDeleting && setDeleteModal(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.18)]"
            >
              <h3 className="font-serif text-[22px] font-semibold text-black">Delete Contract?</h3>
              <p className="mt-3 text-sm text-[#52525b]">
                "<span className="font-medium text-black">{deleteModal.originalName}</span>" will be permanently removed.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setDeleteModal(null)}
                  disabled={isDeleting}
                  className="flex-1 rounded-md border border-[#e5e7eb] px-4 py-3 text-sm font-medium text-[#52525b] transition-colors hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 rounded-md bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardPageDesign;
