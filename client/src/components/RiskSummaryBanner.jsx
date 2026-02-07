import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, FileText } from 'lucide-react';

const RiskSummaryBanner = ({ document: doc }) => {
  if (!doc || !doc.clauses) return null;
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  doc.clauses.forEach(c => { const s = c.riskScore || 1; if (counts[s] !== undefined) counts[s]++; });
  const total = doc.clauses.length;

  const bars = [
    { label: 'Critical', count: counts[5], color: 'bg-red-500', textColor: 'text-red-600' },
    { label: 'High', count: counts[4], color: 'bg-orange-500', textColor: 'text-orange-600' },
    { label: 'Medium', count: counts[3], color: 'bg-amber-500', textColor: 'text-amber-600' },
    { label: 'Low', count: counts[2], color: 'bg-green-400', textColor: 'text-green-600' },
    { label: 'Safe', count: counts[1], color: 'bg-green-500', textColor: 'text-green-600' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center flex-shrink-0">
          <BarChart3 className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <p className="font-serif text-lg font-bold text-navy-900 truncate" title={doc.originalName}>
            {doc.originalName.length > 35 ? doc.originalName.substring(0, 35) + '...' : doc.originalName}
          </p>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
            <FileText className="w-4 h-4" />
            <span>{doc.pageCount || '–'} pages • {total} clauses analyzed</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {bars.filter(b => b.count > 0).map(b => (
          <div key={b.label} className="flex items-center gap-4">
            <span className={`text-sm font-semibold w-16 ${b.textColor}`}>{b.label}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <motion.div 
                className={`h-full rounded-full ${b.color}`} 
                initial={{ width: 0 }} 
                animate={{ width: `${total > 0 ? (b.count / total) * 100 : 0}%` }} 
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }} 
              />
            </div>
            <span className="text-sm text-gray-600 font-medium w-6 text-right">{b.count}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default RiskSummaryBanner;
