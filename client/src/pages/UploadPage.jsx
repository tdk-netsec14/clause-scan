import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2, CheckCircle, Shield, AlertCircle, Lock, FileText, Zap } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const formatSize = (b) => b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(1) + ' MB';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const onDrop = useCallback((accepted, rejected) => {
    setError('');
    if (rejected.length > 0) {
      const e = rejected[0].errors[0];
      setError(e?.code === 'file-too-large' ? 'File must be under 10MB' : e?.code === 'file-invalid-type' ? 'Only PDF files accepted' : e?.message || 'Invalid file');
      return;
    }
    if (accepted.length > 0) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, maxSize: MAX_FILE_SIZE, multiple: false
  });

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true); setProgress(0);
    const fd = new FormData(); fd.append('file', file);
    try {
      const { data } = await api.post('/api/documents/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / e.total))
      });
      toast.success('Upload complete. Analyzing...');
      navigate(`/analysis/${data.documentId}`);
    } catch (err) { setUploading(false); setProgress(0); toast.error(err.error || 'Upload failed'); }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12 flex flex-col items-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg px-6">
        
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy-900 mb-3">Upload Your Contract</h1>
          <p className="text-gray-500">Secure, private, and analyzed in under 60 seconds</p>
          
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
              <Lock className="w-3.5 h-3.5" /> 256-bit encrypted
            </span>
            <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
              <FileText className="w-3.5 h-3.5" /> PDF only
            </span>
            <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
              <Zap className="w-3.5 h-3.5" /> 60 sec analysis
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {!file && !error ? (
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed m-6 rounded-2xl p-16 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50'
              }`}
            >
              <input {...getInputProps()} />
              <Shield className="w-12 h-12 text-indigo-300 mx-auto mb-4" />
              <p className="font-semibold text-navy-950 text-lg">Drag your contract here</p>
              <p className="text-gray-400 text-sm mt-1">or click to browse files</p>
              <p className="text-gray-300 text-xs mt-4">PDF files only • Maximum 10MB</p>
            </div>
          ) : file ? (
            <div className="p-8 text-center bg-green-50/50">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="font-medium text-green-700 text-lg truncate px-4" title={file.name}>{file.name}</p>
              <p className="text-gray-400 text-sm mt-1 mb-6">{formatSize(file.size)}</p>
              {!uploading && (
                <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-indigo-600 font-medium text-sm hover:underline">
                  Change file
                </button>
              )}
            </div>
          ) : (
            <div className="p-12 text-center bg-red-50/50">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="font-medium text-red-600 text-base mb-4">{error}</p>
              <button onClick={() => setError('')} className="text-indigo-600 font-medium text-sm hover:underline">
                Try another file
              </button>
            </div>
          )}

          <div className="px-6 pb-6 pt-2">
            <button 
              onClick={handleUpload} 
              disabled={!file || uploading} 
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl flex justify-center items-center gap-2 transition-colors"
            >
              {uploading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Uploading... {progress}%</>
              ) : (
                <>{file ? 'Analyze Contract' : 'Select a File First'} <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
            
            {uploading && (
              <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <motion.div 
                  className="bg-indigo-600 h-full" 
                  initial={{ width: 0 }} 
                  animate={{ width: `${progress}%` }} 
                  transition={{ ease: "easeOut" }} 
                />
              </div>
            )}
            
            <div className="flex items-center justify-center gap-1.5 mt-6">
              <Lock className="w-3.5 h-3.5 text-gray-400" />
              <p className="text-xs text-gray-400">Your contract is processed securely and never shared with third parties.</p>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default UploadPage;
