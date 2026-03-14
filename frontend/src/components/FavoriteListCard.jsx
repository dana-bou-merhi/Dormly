import { Heart, MapPin, Wifi, Shield, Snowflake, Zap, Star, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Link } from 'react-router-dom';


const AMENITY_ICONS = {
  Verified:    { icon: Shield,    color: 'text-teal-600' },
  'Free Wifi': { icon: Wifi,      color: 'text-teal-600' },
  AC:          { icon: Snowflake, color: 'text-teal-600' },
  Solar:       { icon: Zap,       color: 'text-amber-500' },
};


const STATUS_STYLE = {
  'Available':    'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Filling Fast': 'bg-amber-50 text-amber-700 border-amber-100',
  'Unavailable':  'bg-red-50 text-red-600 border-red-100',
};


function ratingLabel(rating) {
  if (rating >= 4.8) return 'Excellent';
  if (rating >= 4.5) return 'Very Good';
  if (rating >= 4.0) return 'Good';
  if (rating >= 3.5) return 'Decent';
  return 'Fair';
}


function StarRating({ rating, reviews }) {
  const full  = Math.floor(rating);
  const half  = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: full }).map((_, i) => (
          <Star key={`f${i}`} size={12} className="fill-amber-400 text-amber-400" />
        ))}
        {half && (
          <span className="relative inline-block w-3 h-3">
            <Star size={12} className="text-slate-200 fill-slate-200 absolute inset-0" />
            <span className="absolute inset-0 overflow-hidden w-1/2">
              <Star size={12} className="fill-amber-400 text-amber-400" />
            </span>
          </span>
        )}
        {Array.from({ length: empty }).map((_, i) => (
          <Star key={`e${i}`} size={12} className="text-slate-200 fill-slate-200" />
        ))}
      </div>
      <span className="text-xs font-bold text-slate-700">{ratingLabel(rating)}</span>
      <span className="text-slate-300 text-xs">·</span>
      <span className="text-xs text-slate-400">{reviews} reviews</span>
    </div>
  );
}


export default function FavoriteListCard({ dorm, onRemove }) {
  return (
    <article className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-teal-100 transition-all duration-200 flex overflow-hidden">

      {/* Image */}
      <div className="relative w-36 sm:w-52 shrink-0 overflow-hidden">
        <img
          src={dorm.image}
          alt={dorm.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className={`absolute bottom-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLE[dorm.status] ?? STATUS_STYLE['Available']}`}>
          {dorm.status}
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
        <div>
          {/* Title + heart */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-slate-900 leading-snug">{dorm.title}</h3>
            <button
              onClick={() => onRemove(dorm.id)}
              aria-label="Remove from favorites"
              className="shrink-0 p-1.5 rounded-full hover:bg-rose-50 transition-colors group/heart"
            >
              <Heart
                size={18}
                className="fill-rose-500 text-rose-500 group-hover/heart:scale-110 transition-transform"
              />
            </button>
          </div>

          {/* Location */}
          <p className="flex items-center gap-1 text-slate-500 text-xs mb-2">
            <MapPin size={11} className="text-teal-500 shrink-0" />
            {dorm.location}
            {dorm.distance && (
              <>
                <span className="text-slate-300 mx-1">·</span>
                <span className="text-slate-400">{dorm.distance}</span>
              </>
            )}
          </p>

          {/* Star rating */}
          <StarRating rating={dorm.rating} reviews={dorm.reviews} />

          {/* Type pill + amenities */}
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className="text-[11px] text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-100 font-medium">
              {dorm.type}
            </span>
            {dorm.amenities.map((a) => {
              const cfg = AMENITY_ICONS[a];
              if (!cfg) return null;
              const Icon = cfg.icon;
              return (
                <span key={a} className={`flex items-center gap-1 text-[11px] font-medium ${cfg.color}`}>
                  <Icon size={11} /> {a}
                </span>
              );
            })}
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
          <p className="text-teal-600 font-bold text-lg leading-none">
            ${dorm.price}
            <span className="text-xs text-slate-400 font-normal ml-0.5">/mo</span>
          </p>
          <Link to={`/property/${dorm.id}`}>
            <Button className="bg-slate-900 hover:bg-teal-600 text-white text-xs font-bold px-5 py-2 rounded-xl transition-colors duration-200 flex items-center gap-1.5">
              View Listing <ArrowUpRight size={13} />
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}