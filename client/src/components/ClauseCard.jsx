import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Scale, AlertTriangle, Lightbulb, ShieldAlert, BookOpen } from 'lucide-react';
import { getRiskConfig, getFavorabilityConfig } from '../utils/riskColors';

const ClauseCard = ({ clause }) => {
  const [open, setOpen] = useState(false);
  const risk = getRiskConfig(clause.riskScore);
  const fav = getFavorabilityConfig(clause.favorability);
  
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 border-l-4 ${risk.border} overflow-hidden shadow-sm transition-shadow hover:shadow-md`}>
      <button 
        onClick={() => setOpen(!open)} 
        className="w-full text-left p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors" 
        aria-expanded={open}
      >
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${risk.color} ${risk.bg}`}>
          {risk.label}
        </span>
        
        <span className="flex-1 text-[15px] font-bold text-navy-900 truncate">
          {clause.heading}
        </span>
        
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
            {(clause.type || 'other').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </span>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${fav.color} ${fav.bg}`}>
            {fav.label}
          </span>
        </div>
        
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            transition={{ duration: 0.3 }} 
            className="overflow-hidden border-t border-gray-100"
          >
            <div className="p-5 space-y-4 bg-white">
              
              {/* Original Text */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100/50">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5" /> Original Text
                </p>
                <p className="text-sm text-gray-700 leading-relaxed font-medium">{clause.text}</p>
              </div>
              
              {/* Risk Analysis */}
              <div className={`${risk.bg} rounded-xl p-4 border ${risk.border}`}>
                <p className={`text-xs font-bold ${risk.color} uppercase tracking-wider mb-2 flex items-center gap-1.5`}>
                  <AlertTriangle className="w-3.5 h-3.5" /> Risk Analysis
                </p>
                <p className={`text-sm ${risk.color.replace('600', '900')} leading-relaxed font-medium`}>
                  {clause.riskReason}
                </p>
              </div>
              
              {/* Suggested Revision */}
              {clause.suggestedRevision && (
                <div className="bg-green-50 rounded-xl p-4 border border-green-100/50">
                  <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5" /> Suggested Revision
                  </p>
                  <p className="text-sm text-green-900 leading-relaxed font-medium">{clause.suggestedRevision}</p>
                </div>
              )}
              
              {/* Loophole */}
              {clause.loophole && (
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-100/50">
                  <p className="text-xs font-bold text-orange-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" /> Loophole Warning
                  </p>
                  <p className="text-sm text-orange-900 leading-relaxed font-medium">{clause.loophole}</p>
                </div>
              )}
              
              {/* Jurisdiction Note */}
              {clause.jurisdictionWarning && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100/50">
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Jurisdiction Note</p>
                  <p className="text-sm text-blue-900 leading-relaxed font-medium">{clause.jurisdictionWarning}</p>
                </div>
              )}
              
              {/* Law References */}
              {clause.lawReferences && clause.lawReferences.length > 0 && (
                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100/50">
                  <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> Law Book Match
                  </p>
                  <div className="space-y-3">
                    {clause.lawReferences.map((reference, index) => (
                      <div key={`${reference.source}-${reference.section}-${index}`} className="bg-white rounded-lg p-3 border border-indigo-100">
                        <p className="text-sm font-bold text-indigo-900">{reference.source}</p>
                        <p className="text-xs font-medium text-indigo-600 mt-0.5">{reference.section}</p>
                        {reference.relevance && <p className="text-sm text-gray-700 mt-2 leading-relaxed">{reference.relevance}</p>}
                        {reference.note && <p className="text-xs text-gray-500 mt-1.5 italic">{reference.note}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClauseCard;
