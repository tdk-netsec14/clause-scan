import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingAnalysis = () => {
  const [loadingText, setLoadingText] = useState('Extracting document structure...');
  const [progress, setProgress] = useState(0);

  const loadingStates = [
    'Extracting document structure...',
    'Identifying key clauses...',
    'Scanning for hidden loopholes...',
    'Evaluating risk factors...',
    'Cross-referencing with Indian Law...',
    'Generating health score...',
    'Finalizing analysis report...'
  ];

  useEffect(() => {
    // Cycle through text states
    let stateIndex = 0;
    const textInterval = setInterval(() => {
      stateIndex = (stateIndex + 1) % loadingStates.length;
      setLoadingText(loadingStates[stateIndex]);
    }, 2500);

    // Simulate progress bar filling
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev; // Hold at 95% until actually done
        const increment = Math.random() * 15;
        return Math.min(prev + increment, 95);
      });
    }, 800);

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#0f1b3c] overflow-hidden text-white flex items-center justify-center">
      {/* Background texture */}
      <div className="absolute inset-0 bg-dot-grid opacity-20 pointer-events-none" />

      {/* Decorative gradient glowing orb */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4F46E5] rounded-full blur-[120px] opacity-30 pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center w-full max-w-md">
        
        {/* Animated Logo Container */}
        <div className="relative mb-10">
          {/* Outer Pulsing Rings */}
          <motion.div
            animate={{ scale: [1, 1.4], opacity: [0.8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border-2 border-[#C9A84C]"
          />
          <motion.div
            animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
            transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border border-[#C9A84C]"
          />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative flex h-32 w-32 items-center justify-center rounded-full bg-[#1a2b5e] border-2 border-[#C9A84C] shadow-[0_0_40px_rgba(201,168,76,0.3)] overflow-hidden"
          >
            {/* Inner Scanning Line Effect */}
            <motion.div 
              animate={{ top: ['-20%', '120%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 w-full h-8 bg-gradient-to-b from-transparent via-[#C9A84C]/40 to-transparent blur-sm"
            />
            
            <svg viewBox="0 0 64 64" className="h-14 w-14 text-[#C9A84C] relative z-10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M32 12v40" />
              <path d="M16 26h32" />
              <path d="M22 26l4 12h-8l4-12Z" />
              <path d="M42 26l4 12h-8l4-12Z" />
              <path d="M24 52h16" />
              <path d="M32 16l-8 4" />
              <path d="M32 16l8 4" />
            </svg>
          </motion.div>
        </div>

        <h2 className="font-serif text-[28px] font-bold text-white mb-2">Analyzing Document</h2>
        
        {/* Dynamic Loading Text */}
        <div className="h-6 mb-12">
          <AnimatePresence mode="wait">
            <motion.p
              key={loadingText}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-[16px] text-[#C9A84C] font-medium"
            >
              {loadingText}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full">
          <div className="flex items-center justify-between text-[14px] text-white/70 mb-3 font-medium px-1">
            <span>Analysis Progress</span>
            <span className="tabular-nums">{Math.round(progress)}%</span>
          </div>
          
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10 backdrop-blur-sm">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#4F46E5] to-[#C9A84C] rounded-full relative"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Progress bar shimmer effect */}
              <motion.div 
                className="absolute top-0 bottom-0 left-0 w-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
        </div>

        {/* Bottom Status Indicator */}
        <div className="mt-16 flex items-center justify-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10">
          <motion.div 
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]" 
          />
          <span className="text-[12px] text-white/60 tracking-wider uppercase font-semibold">ClauseScan AI Engine Active</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnalysis;
