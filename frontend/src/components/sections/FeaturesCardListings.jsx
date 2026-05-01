import { useEffect, useState } from "react";
import { ArrowRight, TrendingDown, Zap, Clock, AlertCircle, Trophy, DollarSign, BarChart2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import ListingCard from "../ListingCards";
import { Link } from "react-router-dom";
import InsightCard from "../InsightCard";
import axios from "axios";

const SORT_OPTIONS = [
  { key: "ranking",   label: "Top Ranked",   Icon: Trophy      },
  { key: "price_asc", label: "Best Price",   Icon: DollarSign  },
  { key: "score",     label: "Dormly Score", Icon: BarChart2   },
  { key: "available", label: "Available",    Icon: Clock       },
];

function sortListings(list, key) {
  if (!list || !Array.isArray(list)) return [];
  const clone = [...list];
  switch (key) {
    case "ranking":   return clone.sort((a, b) => (a.rank || 999) - (b.rank || 999));
    case "price_asc": return clone.sort((a, b) => a.price - b.price);
    case "score":     return clone.sort((a, b) => (b.dormlyScore || 0) - (a.dormlyScore || 0) || (b.rating || 0) - (a.rating || 0));
    case "available": return clone.filter(a => a.status === "Available Now");
    default:          return clone;
  }
}

export default function FeaturesCardListings() {
  const [sortKey, setSortKey]     = useState("ranking");
  const [listings, setListings]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [userMajor, setUserMajor] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch properties and current user in parallel
        const [propsRes, userRes] = await Promise.allSettled([
          axios.get(`${API_URL}/api/properties`, { withCredentials: true }),
          axios.get(`${API_URL}/api/user/me`,    { withCredentials: true }),
        ]);

        if (propsRes.status === "fulfilled") {
          setListings(propsRes.value.data.properties || []);
        }

        if (userRes.status === "fulfilled") {
          setUserMajor(userRes.value.data.user?.major || null);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  // Split into suggested (matchScore > 0) and general (matchScore === 0 or undefined)
  const suggestedListings = listings.filter(l => l.matchScore > 0);
  const generalListings   = listings.filter(l => !l.matchScore || l.matchScore === 0);

  // Apply sort within each section
  const sortedSuggested = sortListings(suggestedListings, sortKey);
  const sortedGeneral   = sortListings(generalListings,   sortKey);

  const availableNow = listings.filter(l => l.status === "Available Now").length;
  const avgScore     = listings.length > 0
    ? (listings.reduce((s, l) => s + (l.dormlyScore || 0), 0) / listings.length).toFixed(1)
    : "0.0";
  const lowestPrice  = listings.length > 0 ? Math.min(...listings.map(l => l.price || 0)) : 0;
  const priceDrops   = listings.filter(l => l.priceTrend === "down").length;

  const MAJOR_LABELS = {
    cce:     'CCE / Engineering',
    cs:      'Computer Science',
    medical: 'Medical & Health',
    business:'Business & Finance',
    arts:    'Arts & Design',
    other:   'Your Program',
  };

  if (loading) {
    return (
      <div className="py-20 text-center flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        <p className="text-teal-600 font-medium">Fetching the best dorms for you...</p>
      </div>
    );
  }

  return (
    <section className="py-5 md:py-10 bg-linear-to-b from-white via-teal-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="text-center mb-8">
          <span className="inline-block bg-teal-50 text-teal-600 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 border border-teal-100">
            Featured Student Housing
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-3">
            Top Rated Accommodations
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base">
            All verified, data-scored, and student-approved — updated in real time.
          </p>
        </div>

        {/* ── Data Insights Bar ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <InsightCard icon={AlertCircle} label="Available Right Now" value={`${availableNow} listings`}
            sub="Move in today" color={{ bg: "bg-emerald-50", icon: "text-emerald-600", border: "border-emerald-100" }} />
          <InsightCard icon={BarChart2}   label="Avg. Dormly Score"   value={avgScore}
            sub="Out of 10.0"  color={{ bg: "bg-teal-50",    icon: "text-teal-600",    border: "border-teal-100"    }} />
          <InsightCard icon={DollarSign}  label="Starting From"       value={`$${lowestPrice}`}
            sub="Per month"    color={{ bg: "bg-blue-50",    icon: "text-blue-600",    border: "border-blue-100"    }} />
          <InsightCard icon={TrendingDown} label="Price Drops"        value={`${priceDrops} listings`}
            sub="Lower than last month" color={{ bg: "bg-amber-50", icon: "text-amber-600", border: "border-amber-100" }} />
        </div>

        {/* ── Sort bar ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <p className="text-sm text-gray-500">
            Showing <strong className="text-gray-800">{listings.length} listings</strong>
          </p>
          <div className="flex flex-wrap gap-2">
            {SORT_OPTIONS.map(({ key, label, Icon }) => (
              <button key={key} onClick={() => setSortKey(key)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                  sortKey === key
                    ? "bg-teal-600 text-white border-teal-600 shadow-sm shadow-teal-200"
                    : "bg-white text-gray-500 border-gray-200 hover:border-teal-400 hover:text-teal-600"
                }`}>
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── SUGGESTED SECTION (only if user has a major and there are matches) ── */}
        {userMajor && sortedSuggested.length > 0 && (
          <div className="mb-12">

            {/* Section header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-2 bg-teal-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                Best match for {MAJOR_LABELS[userMajor] || 'your major'}
              </div>
              <div className="flex-1 h-px bg-teal-100" />
              <span className="text-xs text-teal-600 font-medium whitespace-nowrap">
                {sortedSuggested.length} recommended
              </span>
            </div>

            {/* Subtle teal background to visually group this section */}
            <div className="bg-teal-50/60 border border-teal-100 rounded-2xl p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedSuggested.map((listing) => (
                  <div key={listing._id} className="relative">
                    <ListingCard listing={listing} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── GENERAL SECTION ── */}
        <div className="mb-10">

          {/* Section header — only show divider label if suggested section is visible */}
          {userMajor && sortedSuggested.length > 0 && (
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-full">
                <BarChart2 className="w-3.5 h-3.5" />
                All other listings
              </div>
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                {sortedGeneral.length} listings
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedGeneral.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="text-center">
          <Button variant="outline"
            className="inline-flex items-center text-teal-600 font-semibold border border-teal-600 px-6 py-2 rounded-full hover:bg-teal-50 transition"
            asChild>
            <Link to="/listings" className="flex items-center gap-2">
              View All Listings <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

      </div>
    </section>
  );
}