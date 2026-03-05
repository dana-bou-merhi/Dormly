import React from 'react';

export default function HowItWorksCard({ 
  stepNumber, 
  icon: Icon, 
  title, 
  description, 
  badgeColor = 'teal' 
}) {
  // Color mapping for badge and icon backgrounds
  const colorMap = {
    teal: {
      badge: 'bg-teal-700',
      icon: 'bg-teal-600',
      card: 'bg-teal-50 border-teal-100'
    },
    yellow: {
      badge: 'bg-yellow-400',
      icon: 'bg-yellow-400',
      card: 'bg-teal-50 border-teal-100'
    }
  };

  const colors = colorMap[badgeColor] || colorMap.teal;

  return (
    <div className={`relative ${colors.card} rounded-2xl p-8 border`}>
      
      <div className={`absolute -top-5 -left-5 w-10 h-10 ${colors.badge} text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md z-10`}>
        {stepNumber}
      </div>

     
      <div className={`w-12 h-12 ${colors.icon} rounded-lg flex items-center justify-center text-white mb-6`}>
        <Icon className="w-6 h-6" />
      </div>

     
      <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">
        {title}
      </h3>

     
      <p className="text-gray-600 text-sm">
        {description}
      </p>
    </div>
  );
}
