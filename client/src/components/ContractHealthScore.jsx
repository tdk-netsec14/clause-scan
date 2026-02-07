import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getGradeColor } from '../utils/riskColors';

const RADIUS = 80;
const ARC_LENGTH = Math.PI * RADIUS; // 251.327

const ContractHealthScore = ({ healthScore }) => {
  const [animatedPct, setAnimatedPct] = useState(0);

  useEffect(() => {
    if (!healthScore) return;
    const timer = setTimeout(() => setAnimatedPct(healthScore.percentage), 300);
    return () => clearTimeout(timer);
  }, [healthScore]);

  if (!healthScore) return null;
  const { grade, percentage, label } = healthScore;
  const offset = ARC_LENGTH - (animatedPct / 100) * ARC_LENGTH;
  const gradeStroke = grade === 'A' ? '#16a34a' : grade === 'B' ? '#0d9488' : grade === 'C' ? '#d97706' : grade === 'D' ? '#ea580c' : '#dc2626';
  
  // Adjusted text color classes based on grade
  const gradeTextClass = grade === 'A' ? 'text-green-600' : grade === 'B' ? 'text-teal-600' : grade === 'C' ? 'text-amber-600' : grade === 'D' ? 'text-orange-600' : 'text-red-600';
  const gradeBgClass = grade === 'A' ? 'bg-green-50' : grade === 'B' ? 'bg-teal-50' : grade === 'C' ? 'bg-amber-50' : grade === 'D' ? 'bg-orange-50' : 'bg-red-50';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white shadow-sm border border-gray-100 p-6 rounded-2xl flex flex-col items-center"
    >
      <h3 className="font-serif text-xl font-bold text-navy-900 mb-6 text-center w-full">Contract Health Score</h3>
      
      <div className="relative w-[200px] h-[110px] flex justify-center mb-4">
        {/* Semi-circle Gauge SVG */}
        <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
          {/* Background Arc */}
          <path 
            d="M 20 100 A 80 80 0 0 1 180 100" 
            fill="none" 
            stroke="#F3F4F6" 
            strokeWidth="12" 
            strokeLinecap="round" 
          />
          {/* Foreground Arc */}
          <motion.path 
            d="M 20 100 A 80 80 0 0 1 180 100" 
            fill="none" 
            stroke={gradeStroke} 
            strokeWidth="12" 
            strokeLinecap="round" 
            strokeDasharray={ARC_LENGTH} 
            animate={{ strokeDashoffset: offset }}
            initial={{ strokeDashoffset: ARC_LENGTH }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        
        {/* Inside Gauge Text */}
        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pb-2">
          <span className={`font-serif text-5xl font-extrabold ${gradeTextClass} leading-none mb-1`}>{grade}</span>
          <span className="text-sm font-medium text-gray-500">{percentage}/100</span>
        </div>
      </div>
      
      <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${gradeTextClass} ${gradeBgClass}`}>
        {label}
      </span>
    </motion.div>
  );
};

export default ContractHealthScore;
