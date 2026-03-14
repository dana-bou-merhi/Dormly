import { useState, useMemo } from 'react';
import { Heart, BookOpen, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ChatbotButton from '@/components/ChatbotButton.jsx';
import { Link } from 'react-router-dom';
import FavoriteListCard from '@/components/FavoriteListCard.jsx';


// const [favorites, setFavorites] = useState([]);
// useEffect(() => { fetch('/api/favorites').then(r => r.json()).then(setFavorites); }, []);
const MOCK_FAVORITES = [
  {
    id: 1,
    title: 'Beirut Central Heights',
    location: 'Hamra, Beirut',
    distance: '5 min from AUB',
    price: 450,
    rating: 4.8,
    reviews: 12,
    type: 'Studio',
    status: 'Available',
    image: '/images/dorm5.jpg',
    amenities: ['Verified', 'Free Wifi', 'AC'],
    savedAt: '2025-02-10',
  },
  {
    id: 2,
    title: 'Byblos Student Res.',
    location: 'Jbeil, Byblos',
    distance: '8 min from NDU',
    price: 320,
    rating: 4.5,
    reviews: 8,
    type: 'Shared Room',
    status: 'Available',
    image: '/images/dorm2.jpg',
    amenities: ['Verified', 'AC'],
    savedAt: '2025-02-14',
  },
  {
    id: 3,
    title: 'Hamra Student Studio',
    location: 'Hamra Street, Beirut',
    distance: '5 min from LAU',
    price: 300,
    rating: 4.9,
    reviews: 21,
    type: 'Studio',
    status: 'Filling Fast',
    image: '/images/Dorm4.jpg',
    amenities: ['Verified', 'Free Wifi', 'AC', 'Solar'],
    savedAt: '2025-03-01',
  },
  {
    id: 4,
    title: 'Achrafieh Modern Flat',
    location: 'Achrafieh, Beirut',
    distance: '10 min from USJ',
    price: 520,
    rating: 4.6,
    reviews: 5,
    type: 'Private Room',
    status: 'Available',
    image: '/images/outsideDorm.jpg',
    amenities: ['Free Wifi', 'AC'],
    savedAt: '2025-03-05',
  },
];





function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center">
      <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center mb-5">
        <Heart size={32} className="text-rose-300 fill-rose-200" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">No saved dorms yet</h3>
      <p className="text-sm text-slate-400 max-w-xs mb-6">
        Tap the heart icon on any listing to save it here for easy access.
      </p>
      <Link to="/listings">
        <Button className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-teal-600/20">
          Browse Listings
        </Button>
      </Link>
    </div>
  );
}


export default function FavoritesPage() {
  const [favorites,  setFavorites]  = useState(MOCK_FAVORITES);
  const [sortBy,     setSortBy]     = useState('saved');
  const [filterType, setFilterType] = useState('all');

  const handleRemove = (id) =>
    setFavorites((prev) => prev.filter((d) => d.id !== id));

  const filtered = useMemo(() => {
    let list = [...favorites];
    if (filterType !== 'all')
      list = list.filter((d) => d.type.toLowerCase().replace(/ /g, '-') === filterType);
    switch (sortBy) {
      case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating':     list.sort((a, b) => b.rating - a.rating); break;
      default:           list.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
    }
    return list;
  }, [favorites, sortBy, filterType]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

     
        <div className="flex items-center gap-3 mb-8 flex-wrap">

          {/* Back arrow */}
          <Link
            to="/"
            aria-label="Back to home"
            className="w-9 h-9 rounded-xl border border-slate-200 bg-white shadow-sm flex items-center justify-center text-slate-500 hover:text-teal-600 hover:border-teal-200 hover:shadow-md transition-all duration-150 shrink-0"
          >
            <ChevronLeft size={18} />
          </Link>

          {/* Heart icon + title + count */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
              <Heart size={15} className="text-rose-500 fill-rose-500" />
            </div>
            <h1 className="text-lg font-bold text-slate-900 whitespace-nowrap">Saved Dorms</h1>
            {favorites.length > 0 && (
              <span className="text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-0.5 rounded-full">
                {favorites.length}
              </span>
            )}
          </div>

          {/* Filters pushed to right */}
          {favorites.length > 0 && (
            <div className="flex items-center gap-2 ml-auto shrink-0">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-36 text-sm rounded-xl border-slate-200 bg-white h-9 text-slate-600">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="shared-room">Shared Room</SelectItem>
                  <SelectItem value="private-room">Private Room</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-42 text-sm rounded-xl border-slate-200 bg-white h-9 text-slate-600">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saved">Recently Saved</SelectItem>
                  <SelectItem value="price-asc">Price: Low → High</SelectItem>
                  <SelectItem value="price-desc">Price: High → Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Content */}
        {favorites.length === 0 ? (
          <EmptyState />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <BookOpen size={30} className="text-slate-300 mb-3" />
            <p className="text-sm font-semibold text-slate-500">No results match your filters.</p>
            <button
              onClick={() => setFilterType('all')}
              className="mt-2 text-teal-600 text-sm font-semibold hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((dorm) => (
              <FavoriteListCard key={dorm.id} dorm={dorm} onRemove={handleRemove} />
            ))}
          </div>
        )}

      </main>

      <Footer />
      <ChatbotButton />
    </div>
  );
}