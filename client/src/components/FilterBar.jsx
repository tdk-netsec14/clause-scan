import React from 'react';
import { Filter } from 'lucide-react';

const RISK_FILTERS = [
  { label: 'All', value: 'all' }, 
  { label: 'Critical', value: '5' },
  { label: 'High', value: '4' }, 
  { label: 'Medium', value: '3' }, 
  { label: 'Low/Safe', value: 'low' }
];

const TYPE_OPTIONS = [
  'All', 'termination', 'payment', 'liability', 'arbitration', 
  'confidentiality', 'indemnification', 'governing_law', 'intellectual_property', 'other'
];

const FAV_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Favors Me', value: 'favors_you' },
  { label: 'Neutral', value: 'neutral' },
  { label: 'Favors Other', value: 'favors_other_party' }
];

const FilterBar = ({ filters, onFilterChange, totalCount, filteredCount }) => (
  <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-4 flex flex-col md:flex-row md:items-center gap-4 justify-between">
    {/* Left side: Icon, Title, and Counter */}
    <div className="flex items-center gap-3 shrink-0">
      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
        <Filter className="w-4 h-4 text-gray-500" />
      </div>
      <div>
        <span className="text-sm font-bold text-navy-900 block">Filter Clauses</span>
        <span className="text-xs text-gray-400 font-medium">Showing {filteredCount} of {totalCount}</span>
      </div>
    </div>

    {/* Center: Risk Level Pills */}
    <div className="flex flex-wrap gap-2 md:justify-center flex-1">
      {RISK_FILTERS.map(f => (
        <button 
          key={f.value} 
          onClick={() => onFilterChange('risk', f.value)}
          className={`px-4 py-2 text-xs font-bold rounded-full transition-colors ${
            filters.risk === f.value 
              ? 'bg-navy-900 text-white shadow-sm' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>

    {/* Right: Dropdowns */}
    <div className="flex flex-col sm:flex-row gap-3 shrink-0">
      <select 
        value={filters.type} 
        onChange={e => onFilterChange('type', e.target.value)}
        className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none cursor-pointer"
      >
        {TYPE_OPTIONS.map(t => (
          <option key={t} value={t}>
            {t === 'All' ? 'All Types' : t.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}
          </option>
        ))}
      </select>
      
      <select 
        value={filters.favorability} 
        onChange={e => onFilterChange('favorability', e.target.value)}
        className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none cursor-pointer"
      >
        {FAV_OPTIONS.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  </div>
);

export default FilterBar;
