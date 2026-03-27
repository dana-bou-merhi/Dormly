import { useState, useMemo, useEffect } from 'react';
import { Heart, ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ChatbotButton from '@/components/ChatbotButton.jsx';
import { Link, useNavigate } from 'react-router-dom';
import FavoriteListCard from '@/components/FavoriteListCard.jsx';
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setUser } from "@/redux/authSlice";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sortBy, setSortBy] = useState('saved');
  const [filterType, setFilterType] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if not logged in
  useEffect(() => { 
    if (!user) navigate('/login'); 
  }, [user, navigate]);

  // Guard: wait until favorites exist
  const favorites = useMemo(() => user?.favorites || [], [user]);

  const handleRemove = async (propertyId) => {
    if (!propertyId) return; // skip if ID missing
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/user/favorites/${propertyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        dispatch(setUser(data.user));
        toast.success("Removed from favorites");
      }
    } catch (error) {
      toast.error("Failed to remove favorite");
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let list = [...favorites];
    if (filterType !== 'all') {
      list = list.filter(d => (d.type || '').toLowerCase().replace(/ /g, '-') === filterType);
    }
    switch (sortBy) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating': list.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      default: list.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
    }
    return list;
  }, [favorites, sortBy, filterType]);

  if (!user) return null; // don't render until user exists

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <Link to="/" className="w-9 h-9 rounded-xl border border-slate-200 bg-white shadow-sm flex items-center justify-center text-slate-500 hover:text-teal-600">
            <ChevronLeft size={18} />
          </Link>
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

        {isLoading && (
          <div className="flex justify-center mb-4">
            <Loader2 className="animate-spin text-teal-600" size={24} />
          </div>
        )}

        {favorites.length === 0 ? <EmptyState /> : (
          <div className="flex flex-col gap-4">
            {filtered.map((dorm, index) =>
              dorm._id ? (
                <FavoriteListCard
                  key={dorm._id}
                  dorm={dorm}
                  onRemove={handleRemove}
                />
              ) : null
            )}
          </div>
        )}
      </main>
      <Footer />
      <ChatbotButton />
    </div>
  );
}