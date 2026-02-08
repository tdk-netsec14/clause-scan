import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

const LawBookReviewPanel = ({ lawReview }) => {
  if (!lawReview || (!lawReview.overview && (!lawReview.findings || lawReview.findings.length === 0))) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-sm border border-indigo-200 border-l-4 border-l-indigo-600 rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="font-serif text-xl font-bold text-navy-900 leading-tight">Law Book Review</h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">How your contract lines up with Indian contract law</p>
        </div>
      </div>

      <div className="space-y-6">
        {lawReview.overview && (
          <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
            <p className="text-sm text-indigo-900 leading-relaxed font-medium">{lawReview.overview}</p>
          </div>
        )}

        {lawReview.matchedActs && lawReview.matchedActs.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {lawReview.matchedActs.map((act) => (
              <span key={act} className="px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
                {act}
              </span>
            ))}
          </div>
        )}

        {lawReview.findings && lawReview.findings.length > 0 && (
          <div className="space-y-3">
            {lawReview.findings.map((finding, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4"
              >
                <span className="w-6 h-6 bg-white border border-indigo-200 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-indigo-600 mt-0.5">
                  {index + 1}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed font-medium">{finding}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LawBookReviewPanel;