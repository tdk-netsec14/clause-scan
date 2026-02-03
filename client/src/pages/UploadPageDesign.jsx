import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Loader2,
  CheckCircle,
  Shield,
  AlertCircle,
  Lock,
  FileText,
  ScanSearch,
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const formatSize = (bytes) => (bytes < 1024 ? `${bytes} B` : bytes < 1048576 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1048576).toFixed(1)} MB`);

const UploadPageDesign = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const onDrop = useCallback((accepted, rejected) => {
    setError('');
    if (rejected.length > 0) {
      const rejection = rejected[0].errors[0];
      setError(rejection?.code === 'file-too-large' ? 'File must be under 50MB' : rejection?.code === 'file-invalid-type' ? 'Only PDF, DOCX, TXT, JPG, and JPEG files are accepted' : rejection?.message || 'Invalid file');
      return;
    }
    if (accepted.length > 0) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'], 'text/plain': ['.txt'], 'image/jpeg': ['.jpg', '.jpeg'] },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await api.post('/api/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => setProgress(Math.round((event.loaded * 100) / event.total)),
      });
      toast.success('Upload complete. Analyzing...');
      navigate(`/analysis/${data.documentId}`);
    } catch (uploadError) {
      setUploading(false);
      setProgress(0);
      toast.error(uploadError.error || 'Upload failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf8fc] text-black">
      {/* Background texture */}
      <div className="fixed inset-0 bg-dot-grid opacity-30 pointer-events-none" />

      {/* ─── SIDEBAR ─── */}
      <Sidebar />

      {/* ─── MAIN CONTENT ─── */}
      <div className="relative z-10 lg:ml-[212px]">
        <main className="mx-auto flex min-h-screen max-w-[1080px] flex-col px-5 pb-10 pt-14 lg:px-8 lg:pt-20">
          {/* ── Hero Section ── */}
          <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto w-full max-w-[760px] text-center"
        >
          <h1 className="font-serif text-[40px] font-semibold tracking-[-0.03em] text-black sm:text-[52px]">
            Secure Document Analysis
          </h1>
          <p className="mx-auto mt-4 max-w-[620px] text-[16px] leading-7 text-[#52525b]">
            Upload your legal documents for AI-powered review. We support contracts, compliance filings, and MSME agreements.
          </p>

          {/* Feature chips */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[12px] text-[#6b7280]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f3f4f6] px-3 py-1.5 font-medium">
              <Lock className="h-3.5 w-3.5" /> Encrypted
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f3f4f6] px-3 py-1.5 font-medium">
              <FileText className="h-3.5 w-3.5" /> PDF, DOCX, TXT, JPG
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f3f4f6] px-3 py-1.5 font-medium">
              <ScanSearch className="h-3.5 w-3.5" /> Fast analysis
            </span>
          </div>
        </motion.section>

        {/* ── Upload Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-10 w-full max-w-[720px] rounded-lg border border-dashed border-[#d6d6db] bg-white px-5 py-6 shadow-[0_1px_0_rgba(0,0,0,0.02)] sm:px-6 sm:py-8"
        >
          {/* Dropzone / File Preview / Error */}
          {!file && !error ? (
            <div
              {...getRootProps()}
              className={`flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-lg px-6 text-center transition-all duration-200 ${
                isDragActive
                  ? 'bg-[#eef1ff] border-2 border-dashed border-[#4F46E5]/40'
                  : 'bg-white hover:bg-[#f9f9fc]'
              }`}
            >
              <input {...getInputProps()} />
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#dde4ff] text-[#0f1b3c]">
                <Shield className="h-7 w-7" />
              </div>
              <h2 className="font-serif text-[24px] font-semibold text-black">Drag & Drop your files here</h2>
              <p className="mt-2 text-[15px] text-[#52525b]">or click to browse your computer</p>
              <p className="mt-6 text-[12px] leading-5 text-[#9ca3af]">
                Supported formats: PDF, DOCX, TXT, JPG, JPEG · Max file size: 50MB
                <br />
                All uploads are encrypted and strictly confidential.
              </p>
            </div>
          ) : file ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg px-6 text-center bg-green-50/40">
              <CheckCircle className="mb-4 h-14 w-14 text-[#059669]" />
              <p className="max-w-[540px] truncate px-4 text-[18px] font-medium text-[#166534]" title={file.name}>
                {file.name}
              </p>
              <p className="mt-1.5 text-[13px] text-[#6b7280]">{formatSize(file.size)}</p>
              {!uploading && (
                <button
                  onClick={(event) => { event.stopPropagation(); setFile(null); }}
                  className="mt-5 text-[13px] font-medium text-[#4F46E5] hover:underline transition-colors"
                >
                  Change file
                </button>
              )}
            </div>
          ) : (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg px-6 text-center bg-red-50/40">
              <AlertCircle className="mb-4 h-14 w-14 text-[#ef4444]" />
              <p className="text-[15px] font-medium text-[#b91c1c]">{error}</p>
              <button
                onClick={() => setError('')}
                className="mt-4 text-[13px] font-medium text-[#4F46E5] hover:underline transition-colors"
              >
                Try another file
              </button>
            </div>
          )}

          {/* Action Area */}
          <div className="px-1 pb-1 pt-4">
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full rounded-lg bg-[#0f1b3c] py-4 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-[#1a2b52] disabled:cursor-not-allowed disabled:bg-[#d4d4d8] disabled:text-[#6b7280]"
            >
              {uploading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" /> Uploading... {progress}%
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  {file ? 'Analyze Document' : 'Select a File First'}
                  <ArrowRight className="h-5 w-5" />
                </span>
              )}
            </button>

            {/* Progress bar */}
            {uploading && (
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#e5e7eb]">
                <motion.div
                  className="h-full rounded-full bg-[#0f1b3c]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut' }}
                />
              </div>
            )}

            {/* Security notice */}
            <div className="mt-6 flex items-center justify-center gap-2 text-[12px] text-[#9ca3af]">
              <Lock className="h-3.5 w-3.5" />
              Your contract is processed securely and never shared with third parties.
            </div>

            {/* Step indicator */}
            <div className="mt-10 flex items-center justify-center gap-3 text-[12px]">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0f1b3c] text-white font-semibold text-[11px]">
                1
              </div>
              <span className="font-medium text-black">Upload</span>
              <div className="h-px w-10 bg-[#e5e7eb]" />
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#d4d4d8] bg-white text-[#a1a1aa] font-semibold text-[11px]">
                2
              </div>
              <span className="text-[#a1a1aa]">Analyze</span>
              <div className="h-px w-10 bg-[#e5e7eb]" />
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#d4d4d8] bg-white text-[#a1a1aa] font-semibold text-[11px]">
                3
              </div>
              <span className="text-[#a1a1aa]">Review</span>
            </div>
          </div>
        </motion.div>

        {/* ── Footer ── */}
        <footer className="mx-auto mt-auto w-full max-w-[1080px] border-t border-[#e5e7eb] px-1 py-8 mt-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-serif text-[22px] font-semibold text-black">ClauseScan</div>
              <p className="mt-1 text-[12px] text-[#52525b]">© {new Date().getFullYear()} ClauseScan India. Empowering MSMEs.</p>
            </div>
            <div className="flex flex-wrap gap-5 text-[13px] text-[#6b7280]">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </footer>
        </main>
      </div>
    </div>
  );
};

export default UploadPageDesign;
