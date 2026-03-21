import { useState, useMemo, useEffect } from 'react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ChatbotButton from '@/components/ChatbotButton.jsx';
import ListingCard from '@/components/ListingCards';
import { Button } from '@/components/ui/button.jsx';
import { ChevronDown, Loader2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function ListingsPage() {
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filters, setFilters]         = useState({
    location: 'All',
    roomTypes: [],
    minPrice: '',
    maxPrice: '',
    amenities: [],
    status: '',
  });
  const [sortBy, setSortBy] = useState('Recommended');

  
  useEffect(() => {
    const fetch_ = async () => {
      try {
        setLoading(true);
        const res  = await fetch(`${API_URL}/api/properties?limit=100`);
        const data = await res.json();
        if (data.success) setAllListings(data.properties);
      } catch (err) {
        console.error('Failed to fetch listings', err);
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, []);


  const filteredListings = useMemo(() => {
    return allListings.filter(l => {
      if (filters.location !== 'All' && !l.location?.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.roomTypes.length > 0 && !filters.roomTypes.includes(l.type)) return false;
      if (filters.status && l.status !== filters.status) return false;
      const min = filters.minPrice ? parseInt(filters.minPrice) : 0;
      const max = filters.maxPrice ? parseInt(filters.maxPrice) : Infinity;
      if (l.price < min || l.price > max) return false;
      if (filters.amenities.length > 0) {
        const has = filters.amenities.every(a => l.amenities?.includes(a) || l.amenityLabels?.includes(a));
        if (!has) return false;
      }
      return true;
    });
  }, [allListings, filters]);


  const sortedListings = useMemo(() => {
    const sorted = [...filteredListings];
    switch (sortBy) {
      case 'Price: Low to High':  return sorted.sort((a, b) => a.price - b.price);
      case 'Price: High to Low':  return sorted.sort((a, b) => b.price - a.price);
      case 'Highest Rated':       return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'Dormly Score':        return sorted.sort((a, b) => (b.dormlyScore || 0) - (a.dormlyScore || 0));
      default:                    return sorted.sort((a, b) => (a.rank || 999) - (b.rank || 999));
    }
  }, [filteredListings, sortBy]);

  const handleResetFilters = () => setFilters({ location: 'All', roomTypes: [], minPrice: '', maxPrice: '', amenities: [], status: '' });

  const toggleArr = (key, val) =>
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(val) ? prev[key].filter(x => x !== val) : [...prev[key], val],
    }));

  // Derive unique locations from data
  const locations = ['All', ...new Set(allListings.map(l => l.location?.split(',')[0]).filter(Boolean))];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 lg:px-10 py-8 flex flex-col lg:flex-row gap-8 grow w-full">

        {/* ── Sidebar Filters ── */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-7 sticky top-8">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
              <h2 className="font-bold text-lg text-teal-600">Filters</h2>
              <button onClick={handleResetFilters} className="text-xs font-semibold text-slate-400 hover:text-teal-600 transition">
                Reset All
              </button>
            </div>

            {/* Location */}
            <section>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Location</label>
              <select
                value={filters.location}
                onChange={e => setFilters(prev => ({ ...prev, location: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm p-2.5 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                {locations.map(l => <option key={l}>{l}</option>)}
              </select>
            </section>

            {/* Status */}
            <section>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Availability</label>
              <select
                value={filters.status}
                onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm p-2.5 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">All</option>
                <option value="Available Now">Available Now</option>
                <option value="Coming Soon">Coming Soon</option>
                <option value="Full">Full</option>
              </select>
            </section>

            {/* Room Type */}
            <section>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Room Type</label>
              <div className="space-y-2.5">
                {['Single Studio', 'Single Room', 'Double Shared Room', 'Apartment', 'Luxury Apartment', 'Modern Studio'].map(type => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.roomTypes.includes(type)}
                      onChange={() => toggleArr('roomTypes', type)}
                      className="w-4 h-4 rounded text-teal-600 border-slate-300 focus:ring-teal-500/20"
                    />
                    <span className="text-sm text-slate-600 group-hover:text-teal-600 transition-colors">{type}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Price Range */}
            <section>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Price Range (USD)</label>
              <div className="flex items-center gap-2">
                <div className="relative w-full">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                  <input type="number" placeholder="Min" value={filters.minPrice} onChange={e => setFilters(p => ({ ...p, minPrice: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm py-2 pl-6 pr-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                </div>
                <div className="relative w-full">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                  <input type="number" placeholder="Max" value={filters.maxPrice} onChange={e => setFilters(p => ({ ...p, maxPrice: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm py-2 pl-6 pr-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                </div>
              </div>
            </section>

            {/* Amenities */}
            <section>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Amenities</label>
              <div className="space-y-2.5">
                {['Free Wi-Fi', 'AC Units', 'Generator 24/7', 'Security Cameras', 'Laundry Room', 'Elevator'].map(a => (
                  <label key={a} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={filters.amenities.includes(a)} onChange={() => toggleArr('amenities', a)}
                      className="w-4 h-4 rounded text-teal-600 border-slate-300 focus:ring-teal-500/20" />
                    <span className="text-sm text-slate-600 group-hover:text-teal-600 transition-colors">{a}</span>
                  </label>
                ))}
              </div>
            </section>
          </div>
        </aside>

        {/* ── Listings ── */}
        <section className="flex-1">
          <header className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4 border-b border-slate-100 pb-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Verified Dorms</h1>
              <p className="text-teal-600 text-sm mt-1 font-medium">
                {loading ? 'Loading...' : `Showing ${sortedListings.length} properties`}
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide whitespace-nowrap">Sort By:</label>
              <div className="relative">
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg text-sm py-2 pl-3 pr-8 focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none cursor-pointer">
                  <option>Recommended</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Highest Rated</option>
                  <option>Dormly Score</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </header>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 size={36} className="animate-spin text-teal-600" />
              <p className="text-teal-600 font-medium">Fetching the best dorms for you…</p>
            </div>
          ) : sortedListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedListings.map(listing => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <h3 className="text-xl font-bold text-slate-900 mb-2">No listings found</h3>
              <p className="text-slate-500 mb-6">Try adjusting your filters or check back later.</p>
              <Button onClick={handleResetFilters} className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded-lg">
                Reset Filters
              </Button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
