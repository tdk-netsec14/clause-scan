import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Languages } from 'lucide-react';

const TypewriterText = ({ text, speed = 12 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    setIsFinished(false);
    if (!text) return;

    const intervalId = setInterval(() => {
      index += 4; // faster reveal
      if (index >= text.length) {
        setDisplayedText(text);
        setIsFinished(true);
        clearInterval(intervalId);
      } else {
        setDisplayedText(text.slice(0, index));
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return (
    <>
      {displayedText}
      {!isFinished && <span className="inline-block w-1.5 h-4 ml-0.5 bg-indigo-600 animate-pulse align-middle rounded-sm"></span>}
    </>
  );
};

const SummaryPanel = ({ summary }) => {
  const [language, setLanguage] = useState('english');
  if (!summary) return null;
  
  const textToShow = language === 'english' 
    ? summary.english 
    : (summary.hindi || 'Hindi translation not available.');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden"
    >
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-navy-900 leading-tight">Executive Summary</h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5">Plain language explanation</p>
            </div>
          </div>
          
          <div className="flex bg-gray-100 rounded-xl p-1 shrink-0">
            {[
              { key: 'english', label: 'English', icon: null },
              { key: 'hindi', label: 'हिंदी', icon: Languages }
            ].map(lang => (
              <button 
                key={lang.key} 
                onClick={() => setLanguage(lang.key)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${language === lang.key ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {lang.icon && <lang.icon className="w-3.5 h-3.5" />}
                {lang.label}
              </button>
            ))}
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div 
            key={language} 
            initial={{ opacity: 0, y: 5 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -5 }} 
            transition={{ duration: 0.2 }}
            className="bg-gray-50 rounded-xl p-5 border border-gray-100"
          >
            <p className="text-[15px] text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
              <TypewriterText text={textToShow} />
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SummaryPanel;
