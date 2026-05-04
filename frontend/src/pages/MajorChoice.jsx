import React, { useState } from 'react';
import { GraduationCap, Check, ChevronRight } from 'lucide-react';

const MajorChoice = ({ onSelect }) => {
  const [selected, setSelected] = useState('');
  
  const majors = [
    { id: 'cce', name: 'Engineering & CCE' },
    { id: 'cs', name: 'Computer Science' },
    { id: 'medical', name: 'Medical & Health' },
    { id: 'business', name: 'Business & Finance' },
    { id: 'arts', name: 'Arts & Design' },
    { id: 'other', name: 'Other Programs' },
  ];

  return (
    <div className="bg-white rounded-2xl w-full max-w-110 shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-300">
      {/* Header */}
      <div className="p-8 pb-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal-50 text-teal-600 mb-4">
          <GraduationCap size={24} />
        </div>
        <h2 className="text-xl font-semibold text-slate-900">Personalize your experience</h2>
        <p className="text-slate-500 text-sm mt-2">
          Select your major to help us suggest dorms with the best amenities for your studies.
        </p>
      </div>

      {/* Major List */}
      <div className="px-8 pb-2">
        <div className="space-y-2">
          {majors.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelected(m.id)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 group ${
                selected === m.id 
                  ? 'border-teal-600 bg-teal-50/30 text-teal-700' 
                  : 'border-slate-100 hover:border-teal-200 hover:bg-slate-50 text-slate-600'
              }`}
            >
              <span className="text-sm font-medium">{m.name}</span>
              {selected === m.id ? (
                <Check size={16} className="text-teal-600" />
              ) : (
                <ChevronRight size={16} className="text-slate-300 group-hover:text-teal-400 transition-colors" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="p-8 pt-4 flex flex-col gap-3">
        <button
          type="button"
          disabled={!selected}
          onClick={() => onSelect(selected)}
          className="w-full bg-[#007B83] hover:bg-[#00666d] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold text-sm transition-all shadow-sm active:scale-[0.98]"
        >
          Continue to Dashboard
        </button>
        <button
          type="button"
          onClick={() => onSelect('skip')}
          className="w-full text-slate-400 hover:text-slate-600 text-xs font-medium transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default MajorChoice;