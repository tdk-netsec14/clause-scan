import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Flag } from 'lucide-react';

const RedFlagPanel = ({ redFlags }) => {
  if (!redFlags || redFlags.length === 0) return null;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-sm border border-red-200 border-l-4 border-l-red-600 rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h3 className="font-serif text-xl font-bold text-navy-900 leading-tight">Critical Red Flags</h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">Top risks identified</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {redFlags.map((flag, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-3 bg-red-50 rounded-xl p-4 border border-red-100"
          >
            <Flag className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-[15px] text-red-900 leading-relaxed font-medium">{flag}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RedFlagPanel;
