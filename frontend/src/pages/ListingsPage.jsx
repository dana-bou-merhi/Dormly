import { useState, useMemo } from 'react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ChatbotButton from '@/components/ChatbotButton.jsx';
import ListingCard from '@/components/ListingCards';
import { Button } from '@/components/ui/button.jsx';
import { ChevronDown } from 'lucide-react';

const ALL_LISTINGS = [
  {
    id: 1,
    title: 'Single Apartment LAU',
    location: '500m to LAU, Hamra District',
    image: '/images/Dorm4.jpg',
    rating: 5,
    reviews: 12,
    price: 250,
    priceUnit: 'month',
    amenities: ['24/7 Elec', 'WiFi'],
    university: 'LAU',
    roomType: 'Single Room',
    essentials: ['24/7 Electricity', 'High-speed WiFi'],
    rank:1,
  },
  {
    id: 2,
    title: 'Shared Room near AUB',
    location: '200m to AUB, Bliss Street',
    image: '/images/dorm2.jpg',
    rating: 4,
    reviews: 8,
    price: 180,
    priceUnit: 'month',
    amenities: ['WiFi'],
    university: 'AUB',
    roomType: 'Shared Room',
    essentials: ['High-speed WiFi'],
    rank: 2,
    availability: "soon",
    availableDate: "Aug 1",
    dormlyScore: 8.9,
    powerScore: 8.4,
    powerHours: 18,
    priceTrend: "up",
    priceTrendPct: 3,
  },
  {
    id: 3,
    title: 'Studio near USJ',
    location: '300m to USJ, Achrafieh',
    image: '/images/dorm3.jpg',
    rating: 5,
    reviews: 15,
    price: 220,
    priceUnit: 'month',
    amenities: ['24/7 Elec', 'WiFi'],
    university: 'USJ',
    roomType: 'Single Room',
    essentials: ['24/7 Electricity', 'High-speed WiFi', 'Solar Power'],
    
  },
  {
    id: 4,
    title: 'Luxury Apartment Downtown',
    location: '100m to Downtown, Beirut',
    image: '/images/dorm1.avif',
    rating: 5,
    reviews: 25,
    price: 450,
    priceUnit: 'month',
    amenities: ['24/7 Elec', 'WiFi', 'Furnished'],
    university: 'AUB',
    roomType: 'Single Room',
    essentials: ['24/7 Electricity', 'High-speed WiFi'],
  },
  {
    id: 5,
    title: 'Single Room Near Verdun',
    location: '400m to Verdun, Beirut',
    image: '/images/dorm5.jpg',
    rating: 4,
    reviews: 10,
    price: 160,
    priceUnit: 'month',
    amenities: ['WiFi'],
    university: 'LAU',
    roomType: 'Shared Room',
    essentials: ['High-speed WiFi'],
     priceTrend: "down",
    priceTrendPct: 1,
  },
  {
    id: 6,
    title: 'Modern Studio Gemmayze',
    location: '250m to Gemmayze, Beirut',
    image: '/images/dorm6.jpg',
    rating: 5,
    reviews: 18,
    price: 280,
    priceUnit: 'month',
    amenities: ['24/7 Elec', 'WiFi','Furnished'],
    university: 'USJ',
    roomType: 'Single Room',
    essentials: ['24/7 Electricity', 'High-speed WiFi'],
  },
  {
    id: 7,
    title: 'Shared Apartment Hamra',
    location: '150m to Hamra, Beirut',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=400&fit=crop',
    rating: 4,
    reviews: 9,
    price: 140,
    priceUnit: 'month',
    amenities: ['WiFi'],
    university: 'LAU',
    roomType: 'Shared Apartment',
    essentials: ['High-speed WiFi'],
     priceTrend: "up",
    priceTrendPct: 2,
  },
  {
    id: 8,
    title: 'Premium Single Room AUB',
    location: '50m to AUB, Bliss Street',
    image: '/images/dorm2.jpg',
    rating: 5,
    reviews: 30,
    price: 350,
    priceUnit: 'month',
    amenities: ['24/7 Elec', 'WiFi', 'Furnished'],
    university: 'AUB',
    roomType: 'Single Room',
    essentials: ['24/7 Electricity', 'High-speed WiFi', 'Solar Power'],
  },
];

export default function ListingsPage() {
  const [filters, setFilters] = useState({
    university: 'All Universities',
    roomTypes: [],
    minPrice: '',
    maxPrice: '',
    essentials: [],
  });

  const [sortBy, setSortBy] = useState('Recommended');

  
  const filteredListings = useMemo(() => {
    return ALL_LISTINGS.filter((listing) => {
      // University filter
      if (filters.university !== 'All Universities') {
        const universityMap = {
          'AUB (Hamra)': 'AUB',
          'LAU (Beirut)': 'LAU',
          'USJ (Achrafieh)': 'USJ',
        };
        if (listing.university !== universityMap[filters.university]) {
          return false;
        }
      }

      
      if (filters.roomTypes.length > 0 && !filters.roomTypes.includes(listing.roomType)) {
        return false;
      }

      // Price filter
      const minPrice = filters.minPrice ? parseInt(filters.minPrice) : 0;
      const maxPrice = filters.maxPrice ? parseInt(filters.maxPrice) : Infinity;
      if (listing.price < minPrice || listing.price > maxPrice) {
        return false;
      }

      
      if (filters.essentials.length > 0) {
        const hasAllEssentials = filters.essentials.every((essential) =>
          listing.essentials.includes(essential)
        );
        if (!hasAllEssentials) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  
  const sortedListings = useMemo(() => {
    const sorted = [...filteredListings];
    switch (sortBy) {
      case 'Price: Low to High':
        return sorted.sort((a, b) => a.price - b.price);
      case 'Price: High to Low':
        return sorted.sort((a, b) => b.price - a.price);
      case 'Highest Rated':
        return sorted.sort((a, b) => b.rating - a.rating);
      default:
        return sorted;
    }
  }, [filteredListings, sortBy]);

  const handleRoomTypeChange = (roomType) => {
    setFilters((prev) => ({
      ...prev,
      roomTypes: prev.roomTypes.includes(roomType)
        ? prev.roomTypes.filter((t) => t !== roomType)
        : [...prev.roomTypes, roomType],
    }));
  };

  const handleEssentialChange = (essential) => {
    setFilters((prev) => ({
      ...prev,
      essentials: prev.essentials.includes(essential)
        ? prev.essentials.filter((e) => e !== essential)
        : [...prev.essentials, essential],
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      university: 'All Universities',
      roomTypes: [],
      minPrice: '',
      maxPrice: '',
      essentials: [],
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 lg:px-10 py-8 flex flex-col lg:flex-row gap-8 grow w-full">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-8 sticky top-8">
            
            {/* Filter Header */}
            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
              <h2 className="font-bold text-lg text-teal-600">Filters</h2>
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-slate-400 hover:text-teal-600 transition"
              >
                Reset All
              </button>
            </div>

            
            <section>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                University / Area
              </label>
              <select
                value={filters.university}
                onChange={(e) => setFilters((prev) => ({ ...prev, university: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm p-2.5 focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer"
              >
                <option>All Universities</option>
                <option>AUB (Hamra)</option>
                <option>LAU (Beirut)</option>
                <option>USJ (Achrafieh)</option>
              </select>
            </section>

           
            <section>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Room Type
              </label>
              <div className="space-y-3">
                {['Single Room', 'Shared Room', 'Shared Apartment'].map((type) => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.roomTypes.includes(type)}
                      onChange={() => handleRoomTypeChange(type)}
                      className="w-4 h-4 rounded text-teal-600 border-slate-300 focus:ring-teal-500/20 cursor-pointer"
                    />
                    <span className="text-sm text-slate-600 group-hover:text-teal-600 transition-colors">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            {/* Price Range Filter */}
            <section>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Price Range (USD)
              </label>
              <div className="flex items-center gap-2">
                <div className="relative w-full">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => setFilters((prev) => ({ ...prev, minPrice: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm py-2 pl-6 pr-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div className="relative w-full">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm py-2 pl-6 pr-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
            </section>

            {/* Essentials Filter */}
            <section>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Essentials
              </label>
              <div className="space-y-3">
                {['24/7 Electricity', 'High-speed WiFi', 'Solar Power'].map((essential) => (
                  <label key={essential} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.essentials.includes(essential)}
                      onChange={() => handleEssentialChange(essential)}
                      className="w-4 h-4 rounded text-teal-600 border-slate-300 focus:ring-teal-500/20 cursor-pointer"
                    />
                    <span className="text-sm text-slate-600 group-hover:text-teal-600 transition-colors">
                      {essential}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            {/* Apply Filters Button */}
            <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-teal-600/20 transition duration-200">
              Apply Filters
            </Button>
          </div>
        </aside>

       
        <section className="flex-1">
          
          {/* Header with Sorting */}
          <header className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4 border-b border-slate-100 pb-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Verified Dorms in Beirut
              </h1>
              <p className="text-teal-600 text-sm mt-1 font-medium">
                Showing {sortedListings.length} properties ready for move-in
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide whitespace-nowrap">
                Sort By:
              </label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg text-sm py-2 pl-3 pr-8 focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer appearance-none"
                >
                  <option>Recommended</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Highest Rated</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </header>

          {/* Listings Grid */}
          {sortedListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {sortedListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-900 mb-2">No listings found</h3>
                <p className="text-slate-600 mb-6">Try adjusting your filters to find more options</p>
                <Button
                  onClick={handleResetFilters}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded-lg transition"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
      {/*<ChatbotButton />*/}
      
    </div>
  );
}
