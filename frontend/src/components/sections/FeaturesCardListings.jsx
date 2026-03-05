import { useState } from "react";
import { ArrowRight, TrendingDown, Zap, Clock, AlertCircle, Trophy, DollarSign, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import ListingCard from "../ListingCards";
import { Link } from "react-router-dom";
import InsightCard from "../InsightCard";

const listings = [
  {
    id: 1,
    title: "Single Apartment LAU",
    location: "500m to LAU, Hamra District",
    image: "/images/Dorm4.jpg",
    rating: 5,
    reviews: 12,
    price: 250,
    priceUnit: "month",
    amenities: ["24/7 Elec", "WiFi", "Guarded"],
    rank: 1,
    availability: "now",
    dormlyScore: 9.4,
    powerScore: 8.4,
    powerHours: 12,
    priceTrend: "down",
    priceTrendPct: 5,
  },
  {
    id: 2,
    title: "Single Apartment AUB",
    location: "200m to AUB, Bliss Street",
    image: "/images/dorm2.jpg",
    rating: 4,
    reviews: 8,
    price: 300,
    priceUnit: "month",
    amenities: ["24/7 Elec", "Furnished"],
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
    title: "Double Shared Room",
    location: "1km to LAU, Qoreitem",
    image: "/images/dorm3.jpg",
    rating: 5,
    reviews: 24,
    price: 180,
    priceUnit: "bed",
    amenities: ["24/7 Elec", "WiFi"],
    rank: 3,
    availability: "full",
    dormlyScore: 9.1,
    powerScore: 9.6,
    powerHours: 22,
    priceTrend: "down",
    priceTrendPct: 2,
  },
  {
    id: 4,
    title: "Luxury Apartment Downtown",
    location: "100m to Downtown, Beirut",
    image: "/images/dorm1.avif",
    rating: 5,
    reviews: 25,
    price: 450,
    priceUnit: "month",
    amenities: ["24/7 Elec", "WiFi", "Furnished"],
    rank: 4,
    availability: "now",
    dormlyScore: 8.7,
    powerScore: 8.8,
    powerHours: 20,
    priceTrend: "up",
    priceTrendPct: 1,
  },
  {
    id: 5,
    title: "Single Room Near Verdun",
    location: "400m to Verdun, Beirut",
    image: "/images/dorm6.jpg",
    rating: 4,
    reviews: 10,
    price: 160,
    priceUnit: "month",
    amenities: ["WiFi"],
    rank: 5,
    availability: "now",
    dormlyScore: 8.2,
    powerScore: 7.2,
    powerHours: 16,
    priceTrend: "down",
    priceTrendPct: 8,
  },
  {
    id: 6,
    title: "Modern Studio Saida",
    location: "250m to LIU, Saida",
    image: "/images/dorm5.jpg",
    rating: 5,
    reviews: 18,
    price: 280,
    priceUnit: "month",
    amenities: ["24/7 Elec", "WiFi", "Furnished"],
    rank: 6,
    availability: "soon",
    availableDate: "Sep 1",
    dormlyScore: 8.7,
    powerScore: 8.8,
    powerHours: 20,
    priceTrend: "up",
    priceTrendPct: 2,
  },
];

const SORT_OPTIONS = [
  { key: "score",     label: "Top Scored",   Icon: Trophy       },
  { key: "price_asc", label: "Best Price",   Icon: DollarSign   },
  { key: "rating",    label: "Top Rated",    Icon: BarChart2    },
  { key: "power",     label: "Best Power",   Icon: Zap          },
  { key: "newest",    label: "Newest",       Icon: Clock        },
];

function sortListings(list, key) {
  const clone = [...list];
  switch (key) {
    case "score":     return clone.sort((a, b) => b.dormlyScore - a.dormlyScore);
    case "price_asc": return clone.sort((a, b) => a.price - b.price);
    case "rating":    return clone.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    case "power":     return clone.sort((a, b) => (b.powerScore ?? 0) - (a.powerScore ?? 0));
    case "newest":    return clone.sort((a, b) => b.id - a.id);
    default:          return clone;
  }
}



export default function FeaturesCardListings() {
  const [sortKey, setSortKey] = useState("score");
  const sorted = sortListings(listings, sortKey);

  // ── Computed insights ──
  const availableNow = listings.filter(l => l.availability === "now").length;
  const avgScore = (listings.reduce((s, l) => s + l.dormlyScore, 0) / listings.length).toFixed(1);
  const lowestPrice = Math.min(...listings.map(l => l.price));
  const priceDrops = listings.filter(l => l.priceTrend === "down").length;

  return (
    <section className="py-5 md:py-10 bg-linear-to-b from-white via-teal-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="text-center mb-8">
          <span className="inline-block bg-teal-50 pb-1 text-teal-600 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 border border-teal-100">
            Featured Student Housing
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-3">
            Featured Student Housing
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base">
            All verified, data-scored, and student-approved — updated in real time.
          </p>
        </div>

        {/* ── Data Insights Bar ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <InsightCard
            icon={AlertCircle} label="Available Right Now" value={`${availableNow} listings`}
            sub="Move in today" color={{ bg: "bg-emerald-50", icon: "text-emerald-600", border: "border-emerald-100" }}
          />
          <InsightCard
            icon={BarChart2} label="Avg. Dormly Score" value={avgScore}
            sub="Out of 10.0" color={{ bg: "bg-teal-50", icon: "text-teal-600", border: "border-teal-100" }}
          />
          <InsightCard
            icon={DollarSign} label="Starting From" value={`$${lowestPrice}`}
            sub="Per month" color={{ bg: "bg-blue-50", icon: "text-blue-600", border: "border-blue-100" }}
          />
          <InsightCard
            icon={TrendingDown} label="Price Drops" value={`${priceDrops} listings`}
            sub="Lower than last month" color={{ bg: "bg-amber-50", icon: "text-amber-600", border: "border-amber-100" }}
          />
        </div>

        {/* ── Sort bar ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <p className="text-sm text-gray-500">
            Showing <strong className="text-gray-800">{sorted.length} listings</strong>
          </p>
          <div className="flex flex-wrap gap-2">
            {SORT_OPTIONS.map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setSortKey(key)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                  sortKey === key
                    ? "bg-teal-600 text-white border-teal-600 shadow-sm shadow-teal-200"
                    : "bg-white text-gray-500 border-gray-200 hover:border-teal-400 hover:text-teal-600"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Cards grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {sorted.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
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



/* old design before data driven
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import ListingCard from "../ListingCards";
import { Link } from "react-router-dom";
const listings = [
  {
    id: 1,
    title: "Single Apartment LAU",
    location: "500m to LAU, Hamra District",
    image: "/images/Dorm4.jpg",
    rating: 5,
    reviews: 12,
    price: 250,
    priceUnit: "month",
    amenities: ["24/7 Elec", "WiFi", "Guarded"],
  },
  {
    id: 2,
    title: "Single Apartment AUB",
    location: "200m to AUB, Bliss Street",
    image: "/images/dorm2.jpg",
    rating: 4,
    reviews: 8,
    price: 300,
    priceUnit: "month",
    amenities: ["24/7 Elec", "Furnished"],
  },
  {
    id: 3,
    title: "Double Shared Room",
    location: "1km to LAU, Qoreitem",
    image: "/images/dorm3.jpg",
    rating: 5,
    reviews: 24,
    price: 180,
    priceUnit: "bed",
    amenities: ["24/7 Elec", "WiFi"],
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
    image: '/images/dorm6.jpg',
    rating: 4,
    reviews: 10,
    price: 160,
    priceUnit: 'month',
    amenities: ['WiFi'],
    university: 'LAU',
    roomType: 'Shared Room',
    essentials: ['High-speed WiFi'],
  },
  {
    id: 6,
    title: 'Modern Studio  Saida',
    location: '250m to LIU, Saida',
    image: '/images/dorm5.jpg',
    rating: 5,
    reviews: 18,
    price: 280,
    priceUnit: 'month',
    amenities: ['24/7 Elec', 'WiFi','Furnished'],
    university: 'USJ',
    roomType: 'Single Room',
    essentials: ['24/7 Electricity', 'High-speed WiFi'],
  }
];

export default function FeaturesCardListings() {
  return (
    <section className="py-5 md:py-15 bg-linear-to-b from-white via-teal-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
            Featured Student Housing
          </h2>
          <p className="text-lg text-gray-600">
            Explore our top-rated dorms and apartments near major universities.
          </p>
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>

        
        <div className="text-center">
          <Button variant="outline"  className="inline-flex items-center text-teal-600 font-semibold
           border border-teal-600 px-6 py-2 rounded-full hover:bg-teal-50 transition">
            
           <Link to="/listings" className="flex items-center"> View All Listings</Link>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}*/
