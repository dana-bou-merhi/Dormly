import { useState, useEffect } from "react";
import {
  Heart,
  MapPin,
  Star,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setUser } from "@/redux/authSlice";
import { toast } from "sonner";

// Use the correct API URL from environment or default to localhost:8000
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/* ================= Avail Badge ================= */
function AvailBadge({ status, date }) {
  const config = {
    now: {
      label: "Available Now",
      cls: "bg-emerald-500 text-white",
      dot: "bg-emerald-300 animate-ping"
    },
    soon: {
      label: date ? `Soon – ${date}` : "Available Soon",
      cls: "bg-amber-400 text-white",
      dot: "bg-amber-200 animate-ping"
    },
    full: {
      label: "Fully Booked",
      cls: "bg-red-500 text-white",
      dot: null
    }
  };

  const c = config[status] ?? config.now;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${c.cls}`}
    >
      {c.dot && (
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${c.dot}`}
          />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white/80" />
        </span>
      )}
      {c.label}
    </span>
  );
}

/* ================= Rank Badge ================= */
function RankBadge({ rank }) {
  const medals = {
    1: { icon: "🥇", cls: "bg-amber-400 text-white" },
    2: { icon: "🥈", cls: "bg-slate-400 text-white" },
    3: { icon: "🥉", cls: "bg-orange-700 text-white" }
  };

  const m = medals[rank];

  if (!m) {
    return (
      <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded bg-slate-700/80 text-white">
        #{rank}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded ${m.cls}`}
    >
      {m.icon} #{rank}
    </span>
  );
}

/* ================= Price Trend ================= */
function PriceTrend({ direction, pct }) {
  if (!direction) return null;

  const isDown = direction === "down";

  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[10px] font-semibold ${
        isDown ? "text-emerald-600" : "text-red-500"
      }`}
    >
      {isDown ? (
        <TrendingDown className="w-3 h-3" />
      ) : (
        <TrendingUp className="w-3 h-3" />
      )}
      {isDown ? "▼" : "▲"} {pct}% vs last month
    </span>
  );
}

/* ================= Dormly Score ================= */
function DormlyScore({ score }) {
  const color =
    score >= 9
      ? "text-emerald-600 bg-emerald-50 border-emerald-200"
      : score >= 8
      ? "text-teal-600 bg-teal-50 border-teal-200"
      : "text-amber-600 bg-amber-50 border-amber-200";

  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${color}`}
    >
      <ShieldCheck className="w-3 h-3" />
      {score}/10
    </span>
  );
}

/* ================= Amenity Badge ================= */
function AmenityBadge({ amenity }) {
  const cfg = {
    "24/7 Elec": {
      bg: "bg-yellow-50 border-yellow-200",
      text: "text-yellow-700",
      icon: "⚡"
    },
    WiFi: {
      bg: "bg-blue-50 border-blue-200",
      text: "text-blue-700",
      icon: "📶"
    },
    Guarded: {
      bg: "bg-slate-50 border-slate-200",
      text: "text-slate-600",
      icon: "🛡️"
    },
    Furnished: {
      bg: "bg-green-50 border-green-200",
      text: "text-green-700",
      icon: "🛋️"
    },
    Cleaning: {
      bg: "bg-purple-50 border-purple-200",
      text: "text-purple-700",
      icon: "🧹"
    },
    AC: {
      bg: "bg-cyan-50 border-cyan-200",
      text: "text-cyan-700",
      icon: "❄️"
    }
  };

  const c =
    cfg[amenity] ?? {
      bg: "bg-gray-50 border-gray-200",
      text: "text-gray-600",
      icon: "✓"
    };

  return (
    <span
      className={`px-2 py-0.5 ${c.bg} ${c.text} border text-[10px] font-bold rounded flex items-center gap-1`}
    >
      <span>{c.icon}</span>
      {amenity}
    </span>
  );
}

/* ================= Stars ================= */
function Stars({ rating = 0 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

/* ================= Main Card ================= */
export default function ListingCard({ listing }) {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [isFavoritedLocal, setIsFavoritedLocal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if this property is in user's favorites
  useEffect(() => {
    if (user && user.favorites) {
      const isFav = user.favorites.some(fav => 
        (typeof fav === 'string' && fav === listing._id) || 
        (fav && typeof fav === 'object' && fav._id === listing._id)
      );
      setIsFavoritedLocal(isFav);
    }
  }, [user, listing._id]);

  const {
    _id,
    title,
    location,
    image,
    images,
    rating,
    reviews,
    price,
    priceUnit,
    amenities = [],
    rank,
    status,
    availableFrom,
    dormlyScore = 8.0,
    priceTrend,
    priceTrendPct
  } = listing;

  /* ===== Safe Image ===== */
  const imageSrc =
    images?.[0] ||
    image ||
    "/images/default.png";

  /* ===== Normalize Status ===== */
  const normalizeStatus = (status) => {
    if (!status) return "now";

    const s = status.toLowerCase();

    if (s.includes("now")) return "now";
    if (s.includes("soon")) return "soon";
    if (s.includes("full")) return "full";

    return "now";
  };

  const normalizedStatus = normalizeStatus(status);

  /* ===== Handle Favorite Toggle ===== */
  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is logged in
    if (!user) {
      toast.error("Please log in to save favorites");
      return;
    }

    setIsLoading(true);
    try {
      // The correct API path based on server.js and user.routes.js is:
      // app.use('/api/user', userRoute) + router.put("/favorites/:propertyId")
      const response = await fetch(`${API_URL}/api/user/favorites/${_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      // Handle non-JSON response (e.g., 404 HTML page)
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response received:", text.substring(0, 100));
        throw new Error(`Server returned non-JSON response (${response.status})`);
      }

      const data = await response.json();

      if (data.success) {
        // Update Redux store with new user data
        dispatch(setUser(data.user));
        
        // Show toast notification
        if (!isFavoritedLocal) {
          toast.success("Added to favorites!");
        } else {
          toast.success("Removed from favorites");
        }
      } else {
        toast.error(data.message || "Failed to update favorite");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorite. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col">
      
      {/* Image */}
      <div className="relative h-52 overflow-hidden shrink-0">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        <div className="absolute top-3 left-3">
          <AvailBadge status={normalizedStatus} date={availableFrom} />
        </div>

        {rank && (
          <div className="absolute top-3 right-12">
            <RankBadge rank={rank} />
          </div>
        )}

        <button
          onClick={handleFavoriteToggle}
          disabled={isLoading}
          className="absolute top-2.5 right-3 bg-white/90 hover:bg-white p-1.5 rounded-full text-gray-400 hover:text-red-500 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Heart
            className={`w-4 h-4 transition-all ${
              isFavoritedLocal ? "fill-red-500 text-red-500" : ""
            }`}
          />
        </button>

        <div className="absolute bottom-3 left-3">
          <DormlyScore score={dormlyScore} />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">

        <h3 className="text-base font-bold text-gray-900 mb-1">
          {title}
        </h3>

        <div className="flex items-center text-gray-500 text-xs mb-2.5">
          <MapPin className="w-3.5 h-3.5 mr-1.5 text-teal-500" />
          {location}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Stars rating={rating} />
          <span className="text-xs text-gray-400">
            ({reviews} reviews)
          </span>
        </div>

        <div className="flex gap-1.5 flex-wrap mb-4">
          {amenities?.map((a) => (
            <AmenityBadge key={a} amenity={a} />
          ))}
        </div>

        <div className="flex-1" />

        <div className="border-t border-gray-100 pt-3.5 flex items-end justify-between">

          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-teal-700">
                ${price}
              </span>
              <span className="text-xs text-gray-400">
                /{priceUnit}
              </span>
            </div>

            <PriceTrend
              direction={priceTrend}
              pct={priceTrendPct}
            />
          </div>

          <Button
            asChild
            disabled={normalizedStatus === "full"}
            className={`text-sm font-semibold px-3 py-2 rounded-lg ${
              normalizedStatus === "full"
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700 text-white"
            }`}
          >
            {normalizedStatus === "full" ? (
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                Join Waitlist
              </span>
            ) : (
              <Link to={`/property/${_id}`}>
                View Details →
              </Link>
            )}
          </Button>

        </div>
      </div>
    </article>
  );
}