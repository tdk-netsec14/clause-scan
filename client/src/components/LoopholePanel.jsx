import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, Lightbulb } from 'lucide-react';

const LoopholePanel = ({ loopholes }) => {
  if (!loopholes || loopholes.length === 0) return null;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="bg-white shadow-sm border border-orange-200 border-l-4 border-l-orange-500 rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h3 className="font-serif text-xl font-bold text-navy-900 leading-tight">Loopholes Detected</h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">Ambiguous language that could be exploited</p>
        </div>
      </div>
      
      <div className="space-y-6 border-l-2 border-orange-200 pl-4 py-1 ml-2">
        {loopholes.map((l, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="relative"
          >
            {/* Dot indicator on the border */}
            <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2 border-orange-400" />
            
            <h4 className="text-base font-bold text-navy-900 mb-1.5">{l.heading}</h4>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">{l.description}</p>
            
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-red-50 rounded-xl p-3 flex items-start gap-2.5 border border-red-100/50">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-900 leading-relaxed">
                  <strong className="font-semibold text-red-950">Risk:</strong> {l.risk}
                </p>
              </div>
              <div className="bg-green-50 rounded-xl p-3 flex items-start gap-2.5 border border-green-100/50">
                <Lightbulb className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-900 leading-relaxed">
                  <strong className="font-semibold text-green-950">Fix:</strong> {l.suggestion}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default LoopholePanel;
