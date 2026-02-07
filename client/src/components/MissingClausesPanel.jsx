import React from 'react';
import { motion } from 'framer-motion';
import { FileWarning } from 'lucide-react';

const IMP = {
  critical: { color: 'text-red-700', bg: 'bg-red-50', dot: 'bg-red-500', label: 'Critical' },
  high: { color: 'text-orange-700', bg: 'bg-orange-50', dot: 'bg-orange-500', label: 'High' },
  medium: { color: 'text-amber-700', bg: 'bg-amber-50', dot: 'bg-amber-500', label: 'Medium' }
};

const MissingClausesPanel = ({ missingClauses }) => {
  if (!missingClauses || missingClauses.length === 0) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="bg-white shadow-sm border border-amber-200 border-l-4 border-l-amber-500 rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
          <FileWarning className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h3 className="font-serif text-xl font-bold text-navy-900 leading-tight">Missing Protections</h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">Important clauses your contract is missing</p>
        </div>
      </div>
      
      <div className="space-y-5 border-l-2 border-amber-200 pl-4 py-1 ml-2">
        {missingClauses.map((c, i) => {
          const s = IMP[c.importance] || IMP.medium;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="relative"
            >
              {/* Dot indicator on the border */}
              <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2 border-amber-400" />
              
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${s.color} ${s.bg}`}>
                  {s.label}
                </span>
                <h4 className="text-base font-bold text-navy-900">{c.clauseType}</h4>
              </div>
              
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                {c.explanation}
              </p>
              
              <div className="bg-amber-50 rounded-xl p-3 border border-amber-100/50 text-sm">
                <p className="text-amber-900 leading-relaxed">
                  <strong className="font-semibold text-amber-950">Action:</strong> {c.recommendation}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default MissingClausesPanel;
