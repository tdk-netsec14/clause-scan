import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DisclaimerBanner = () => (
  <div className="bg-gold-100 border-l-4 border-gold-500 rounded-xl p-4 flex items-start gap-3 shadow-sm">
    <div className="flex-shrink-0 mt-0.5">
      <AlertTriangle className="w-5 h-5 text-gold-600" />
    </div>
    <div>
      <p className="text-sm font-medium text-amber-900">
        For informational purposes only — not legal advice. Consult a qualified Indian lawyer before signing.
      </p>
    </div>
  </div>
);

export default DisclaimerBanner;
