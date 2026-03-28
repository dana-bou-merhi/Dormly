import { useState } from "react";
import { MapPin, Search, Users, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DataStrips from "./DataStrips";
 
const POPULAR_SEARCHES = [
  { label: "Near AUB",      icon: "🎓" },
  { label: "Near LAU",      icon: "🏛️" },
  { label: "Hamra Studios", icon: "🏠" },
  { label: "Shared Rooms",  icon: "👥" },
  { label: "Female-Only",   icon: "🔒" },
];
 
export default function HeroSection() {
  const [location, setLocation] = useState("");
  const [type, setType]         = useState("all");
  const navigate = useNavigate();
 
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location.trim()) params.set("search", location.trim());
    if (type !== "all")  params.set("type", type);
    navigate(`/listings?${params.toString()}`);
  };
 
  const handlePopular = (label) => {
    setLocation(label);
    const params = new URLSearchParams({ search: label });
    navigate(`/listings?${params.toString()}`);
  };
 
  return (
    <>
      <DataStrips />
      <section className="relative pt-10 pb-25 lg:pb-40 bg-linear-to-b from-gray-50 to-white overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img src="/images/Homepage2.png" alt="Students studying" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-b from-teal-900/10 to-teal-900/30 mix-blend-multiply" />
        </div>
 
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 text-center">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 bg-teal-900/80 backdrop-blur-sm text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 shadow">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            LIVE DATA · 847 ACTIVE LISTINGS
          </div>
 
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 mb-6 leading-tight">
            Find Safe, Affordable{" "}
            <span className="text-teal-600">Student Housing</span> in Lebanon
          </h1>
 
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
            Connect with verified landlords near AUB, LAU, and other major universities.
            Transparent pricing, no hidden fees.
          </p>
 
          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="mt-12 max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
          >
            {/* Location input */}
            <div className="md:col-span-5 text-left">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="w-5 h-5 text-teal-500" />
                </div>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Near AUB, Hamra"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500 transition"
                />
              </div>
            </div>
 
            {/* Type select */}
            <div className="md:col-span-5 text-left">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                Type
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users size={18} className="text-teal-500" />
                </div>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500 transition appearance-none"
                >
                  <option value="all">All Types</option>
                  <option value="Single Room">Single Room</option>
                  <option value="Single Studio">Single Studio</option>
                  <option value="Double Shared Room">Shared Room</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Luxury Apartment">Luxury Apartment</option>
                  <option value="Modern Studio">Modern Studio</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
 
            {/* Search button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg transition shadow-lg shadow-teal-600/30 flex justify-center items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Search
              </button>
            </div>
 
            {/* Popular searches */}
            <div className="md:col-span-12 pt-3 border-t border-gray-100">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0">
                  <TrendingUp size={12} className="text-teal-500" />
                  Trending
                </span>
                {POPULAR_SEARCHES.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => handlePopular(s.label)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-teal-50 hover:text-teal-700 border border-gray-200 hover:border-teal-200 px-3 py-1.5 rounded-full transition-all duration-150"
                  >
                    <span>{s.icon}</span>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
 
        {/* Wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none transform rotate-180">
          <svg className="relative block w-full h-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#FFFFFF" />
          </svg>
        </div>
      </section>
    </>
  );
}