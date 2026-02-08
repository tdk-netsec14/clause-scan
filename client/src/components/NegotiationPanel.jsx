import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Loader2, CheckCircle, CheckSquare } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const NegotiationPanel = ({ negotiationPoints, documentId }) => {
  const [downloading, setDownloading] = React.useState(false);
  const blobUrlRef = useRef(null);

  // Cleanup blob URL on unmount to prevent memory leak
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        window.URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, []);

  if (!negotiationPoints || negotiationPoints.length === 0) return null;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const r = await api.get(`/api/documents/${documentId}/report`, { responseType: 'blob' });
      // Revoke previous blob URL if any
      if (blobUrlRef.current) {
        window.URL.revokeObjectURL(blobUrlRef.current);
      }
      const url = window.URL.createObjectURL(new Blob([r.data]));
      blobUrlRef.current = url;
      const a = document.createElement('a'); a.href = url; a.setAttribute('download', 'ClauseScan_Report.pdf');
      document.body.appendChild(a); a.click(); a.remove();
      toast.success('Report downloaded!');
    } catch (err) { toast.error('Download failed'); }
    finally { setDownloading(false); }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="bg-white shadow-sm border border-indigo-200 border-l-4 border-l-indigo-600 rounded-2xl p-6 flex flex-col h-full"
    >
      <div className="flex items-center gap-3 mb-5 shrink-0">
        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
          <CheckCircle className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="font-serif text-xl font-bold text-navy-900 leading-tight">Negotiation Checklist</h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">Changes to request before signing</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto mb-6 pr-2">
        <div className="space-y-1">
          {negotiationPoints.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0"
            >
              <CheckSquare className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700 leading-relaxed font-medium">{p}</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="shrink-0 pt-2">
        <button 
          onClick={handleDownload} 
          disabled={downloading}
          className="w-full py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {downloading ? <><Loader2 className="w-5 h-5 animate-spin" /> Preparing...</> : <><Download className="w-5 h-5" /> Download Full Report (PDF)</>}
        </button>
      </div>
    </motion.div>
  );
};

export default NegotiationPanel;
