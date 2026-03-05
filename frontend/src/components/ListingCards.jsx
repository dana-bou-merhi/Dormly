import { useState } from "react";
import { Heart, MapPin, Star, Zap, TrendingDown, TrendingUp, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge.jsx";


function AvailBadge({ status, date }) {
  const config = {
    now:  { label: "Available Now",   cls: "bg-emerald-500 text-white",   dot: "bg-emerald-300 animate-ping" },
    soon: { label: date ?? "Available Soon", cls: "bg-amber-400 text-white",    dot: "bg-amber-200 animate-ping" },
    full: { label: "Fully Booked",    cls: "bg-red-500 text-white",       dot: null },
  };
  const c = config[status] ?? config.now;

  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${c.cls}`}>
      {c.dot && (
        <span className="relative flex h-1.5 w-1.5">
          <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${c.dot}`} />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white/80" />
        </span>
      )}
      {c.label}
    </span>
  );
}


function RankBadge({ rank }) {
  const medals = { 1: { icon: "🥇", cls: "bg-amber-400 text-white" },
                   2: { icon: "🥈", cls: "bg-slate-400 text-white" },
                   3: { icon: "🥉", cls: "bg-orange-700 text-white" } };
  const m = medals[rank];
  if (!m) return (
    <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded bg-slate-700/80 text-white backdrop-blur-sm">
      #{rank}
    </span>
  );
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded ${m.cls}`}>
      {m.icon} #{rank}
    </span>
  );
}


function PriceTrend({ direction, pct }) {
  if (!direction) return null;
  const isDown = direction === "down";
  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold ${isDown ? "text-emerald-600" : "text-red-500"}`}>
      {isDown ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
      {isDown ? "▼" : "▲"} {pct}% vs last month
    </span>
  );
}


function DormlyScore({ score }) {
  const color = score >= 9 ? "text-emerald-600 bg-emerald-50 border-emerald-200"
              : score >= 8 ? "text-teal-600 bg-teal-50 border-teal-200"
              : "text-amber-600 bg-amber-50 border-amber-200";
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${color}`}>
      <ShieldCheck className="w-3 h-3" />
      {score}/10
    </span>
  );
}


function AmenityBadge({ amenity }) {
  const cfg = {
    "24/7 Elec": { bg: "bg-yellow-50 border-yellow-200", text: "text-yellow-700", icon: "⚡" },
    WiFi:        { bg: "bg-blue-50 border-blue-200",     text: "text-blue-700",   icon: "📶" },
    Guarded:     { bg: "bg-slate-50 border-slate-200",   text: "text-slate-600",  icon: "🛡️" },
    Furnished:   { bg: "bg-green-50 border-green-200",   text: "text-green-700",  icon: "🛋️" },
  };
  const c = cfg[amenity] ?? { bg: "bg-gray-50 border-gray-200", text: "text-gray-600", icon: "✓" };
  return (
    <span className={`px-2 py-0.5 ${c.bg} ${c.text} border text-[10px] font-bold rounded flex items-center gap-1`}>
      <span>{c.icon}</span>{amenity}
    </span>
  );
}

//  Stars
function Stars({ rating }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i < rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
      ))}
    </div>
  );
}



export default function ListingCard({ listing }) {
  const [isFavorited, setIsFavorited] = useState(false);

  const {id, title, location, image, rating, reviews, price, priceUnit, amenities = [],
    // NEW data fields
    rank,
    availability = "now",   // "now" | "soon" | "full"
    availableDate,           
    dormlyScore = 8.0,
    priceTrend,              // "up" | "down"
    priceTrendPct,           // number
  } = listing;

  return (
    <article className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col">

      {/* ── Image ── */}
      <div className="relative h-52 overflow-hidden shrink-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />

        {/* Top-left: availability */}
        <div className="absolute top-3 left-3 z-10">
          <AvailBadge status={availability} date={availableDate} />
        </div>

        {/* Top-right: rank */}
        {rank && (
          <div className="absolute top-3 right-12 z-10">
            <RankBadge rank={rank} />
          </div>
        )}

        
        <button onClick={() => setIsFavorited(!isFavorited)}  className="absolute top-2.5 right-3 z-10 bg-white/90
         hover:bg-white p-1.5 rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm" >
          <Heart className={`w-4 h-4 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
        </button>

        {/* Bottom-left: dormly score */}
        <div className="absolute bottom-3 left-3 z-10">
          <DormlyScore score={dormlyScore} />
        </div>
      </div>

     
      <div className="p-5 flex flex-col flex-1 gap-0">

       
        <h3 className="text-base font-heading font-bold text-gray-900 mb-1 leading-snug">
          {title}
        </h3>

        
        <div className="flex items-center text-gray-500 text-xs mb-2.5">
          <MapPin className="w-3.5 h-3.5 mr-1.5 text-teal-500 shrink-0" />
          {location}
        </div>

        
        <div className="flex items-center gap-2 mb-3">
          <Stars rating={rating} />
          <span className="text-xs text-gray-400">({reviews} reviews)</span>
        </div>


       
        <div className="flex gap-1.5 flex-wrap mb-4">
          {amenities.map((a) => <AmenityBadge key={a} amenity={a} />)}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        
        <div className="border-t border-gray-100 pt-3.5 flex items-end justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-teal-700">${price}</span>
              <span className="text-xs text-gray-400">/{priceUnit}</span>
            </div>
            <PriceTrend direction={priceTrend} pct={priceTrendPct} />
          </div>

          <Button
            asChild
            disabled={availability === "full"}
            className={`text-sm font-semibold px-3 py-2 rounded-lg transition-all ${
              availability === "full"
                ? "bg-gray-200 text-gray-400 cursor-not-allowed hover:bg-gray-200"
                : "bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20"
            }`}
          >
            {availability === "full" ? (
              <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Join Waitlist</span>
            ) : (
              <Link to={`/property/${id}`}>View Details →</Link>
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}


/*import { useState } from "react";
import { Heart, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Link } from "react-router-dom";

export default function ListingCard({ listing }) {
  const [isFavorited, setIsFavorited] = useState(false);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const renderAmenityBadge = (amenity) => {
    const amenityConfig = {
      "24/7 Elec": { bg: "bg-yellow-100", text: "text-yellow-700", icon: "⚡" },
      WiFi: { bg: "bg-blue-100", text: "text-blue-700", icon: "📶" },
      Guarded: { bg: "bg-gray-100", text: "text-gray-600", icon: "🛡️" },
      Furnished: { bg: "bg-green-100", text: "text-green-700", icon: "🛋️" },
    };

    const config = amenityConfig[amenity] || {
      bg: "bg-gray-100",
      text: "text-gray-600",
      icon: "✓",
    };

    return (
      <span
        key={amenity}
        className={`px-2 py-1 ${config.bg} ${config.text} text-[10px] font-bold rounded uppercase flex items-center gap-1`}
      >
        <span>{config.icon}</span>
        {amenity}
      </span>
    );
  };

  return (
    <article className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden group">
      
      <div className="relative h-60 overflow-hidden">
        <img  src={listing.image}   alt={listing.title}   className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        <button onClick={() => setIsFavorited(!isFavorited)}
          className="absolute top-4 right-4 bg-white/90 p-2 rounded-full text-gray-400 hover:text-red-500 transition shadow-sm"   >
          <Heart
            className={`w-5 h-5 ${isFavorited ? "fill-red-500 text-red-500" : ""}`}
          />
        </button>
      </div>

      
      <div className="p-6">
        
        <h3 className="text-lg font-heading font-bold text-gray-900 mb-1">
          {listing.title}
        </h3>

        
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin className="w-4 h-4 mr-2 text-teal-600" />
          {listing.location}
        </div>

       
        <div className="flex items-center mb-4">
          <div className="flex gap-0.5">{renderStars(listing.rating)}</div>
          <span className="text-xs text-gray-400 ml-2">({listing.reviews} Reviews)</span>
        </div>

       
        <div className="flex gap-2 mb-6 flex-wrap">
          {listing.amenities.map((amenity) => renderAmenityBadge(amenity))}
        </div>

       
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <div>
            <span className="text-2xl font-bold text-teal-700">${listing.price}</span>
            <span className="text-xs text-gray-400">/{listing.priceUnit}</span>
          </div>
          <Button className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold py-3 px-4 rounded-lg transition">
            <Link to={`/property/${listing.id}`} className="text-white">
              View Details
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}*/
