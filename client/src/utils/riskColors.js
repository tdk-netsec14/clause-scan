// Risk color utility — maps risk scores, grades, and favorability to Tailwind classes
const RISK_CONFIG = {
  1: { label: 'Safe', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  2: { label: 'Low', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  3: { label: 'Medium', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  4: { label: 'High', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  5: { label: 'Critical', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
};

const GRADE_COLORS = {
  'A': 'text-green-600',
  'B': 'text-teal-600',
  'C': 'text-amber-600',
  'D': 'text-orange-600',
  'F': 'text-red-600'
};

const GRADE_BG = {
  'A': 'bg-green-50',
  'B': 'bg-teal-50',
  'C': 'bg-amber-50',
  'D': 'bg-orange-50',
  'F': 'bg-red-50'
};

const FAVORABILITY_CONFIG = {
  'favors_you': { label: 'Favors You', color: 'text-green-600', bg: 'bg-green-50' },
  'neutral': { label: 'Neutral', color: 'text-gray-500', bg: 'bg-gray-50' },
  'favors_other_party': { label: 'Favors Other Party', color: 'text-red-600', bg: 'bg-red-50' }
};

export const getRiskConfig = (score) => RISK_CONFIG[score] || RISK_CONFIG[1];
export const getRiskLabel = (score) => (RISK_CONFIG[score] || RISK_CONFIG[1]).label;
export const getRiskColor = (score) => (RISK_CONFIG[score] || RISK_CONFIG[1]).color;
export const getRiskBg = (score) => (RISK_CONFIG[score] || RISK_CONFIG[1]).bg;
export const getRiskBorder = (score) => (RISK_CONFIG[score] || RISK_CONFIG[1]).border;
export const getGradeColor = (grade) => GRADE_COLORS[grade] || 'text-gray-500';
export const getGradeBg = (grade) => GRADE_BG[grade] || 'bg-gray-50';
export const getFavorabilityConfig = (fav) => FAVORABILITY_CONFIG[fav] || FAVORABILITY_CONFIG['neutral'];
