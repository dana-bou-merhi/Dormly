import React from 'react';

export const Input = ({ label, icon: Icon, id, ...props }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide ml-1" htmlFor={id}>
      {label}
    </label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />}
      <input
        {...props}
        id={id}
        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 rounded-xl transition-all text-sm outline-none"
      />
    </div>
  </div>
);