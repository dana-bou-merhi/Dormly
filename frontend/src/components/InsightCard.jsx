import React from 'react'

const InsightCard = ({ icon: Icon, label, value, sub, color }) => {
  return (
    <div className={`flex items-center gap-3 bg-white rounded-xl px-4 py-3 border mb-2 ${color.border} shadow-sm`}>
      <div className={`p-2 rounded-lg ${color.bg}`}>
        <Icon className={`w-4 h-4 ${color.icon}`} />
      </div>
      <div>
        <p className="text-lg font-extrabold text-gray-900 leading-none">{value}</p>
        <p className="text-[10px] text-gray-500 font-medium mt-0.5">{label}</p>
        {sub && <p className={`text-[10px] font-semibold ${color.icon} mt-0.5`}>{sub}</p>}
      </div>
    </div>
  )
}


export default InsightCard