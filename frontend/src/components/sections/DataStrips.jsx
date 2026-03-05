import React from 'react'


const stripItems = [
  { label: "Achrafieh", price: "$320/mo", trend: "down", pct: "1.1%" },
  { label: "Badaro", price: "$270/mo", trend: "up", pct: "0.8%" },
  { label: "Zarif", price: "$245/mo", trend: "up", pct: "2.4%" },
  { label: "Hamra", price: "$295/mo", trend: "up", pct: "3.2%" },
  { label: "Verdun", price: "$310/mo", trend: "down", pct: "0.5%" },
  { label: "Ras Beirut", price: "$280/mo", trend: "up", pct: "1.7%" },
  { label: "Avg Power Score", value: "8.3/10", badge: "⚡", trending: true },
  { label: "Active Listings", value: "847", badge: "🏠", note: "+22 today" },
  { label: "Filling Fast", value: "47 units", badge: "🔴", note: "under 48h" },
];

const DataStrips = () => {
  return (
     <div className="relative w-full bg-teal-900 text-white overflow-hidden" style={{ height: "36px" }}>
      <div
        className="flex items-center gap-8 whitespace-nowrap absolute top-0 left-0 h-full"
        style={{
          animation: "marquee 35s linear infinite",
        }}
      >
        {[...stripItems, ...stripItems].map((item, i) => (
          <span key={i} className="flex items-center gap-2 text-xs font-medium px-1">
            {item.badge && <span>{item.badge}</span>}
            <span className="text-teal-300 font-semibold">{item.label}</span>
            {item.price && (
              <>
                <span className="text-white">{item.price}</span>
                <span className={item.trend === "up" ? "text-emerald-400" : "text-red-400"}>
                  {item.trend === "up" ? "▲" : "▼"} {item.pct}
                </span>
              </>
            )}
            {item.value && (
              <>
                <span className="text-white font-bold">{item.value}</span>
                {item.note && <span className="text-teal-400 text-xs">— {item.note}</span>}
              </>
            )}
            <span className="text-teal-700 select-none">·</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}

export default DataStrips