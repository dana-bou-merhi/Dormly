import { useState } from "react";
import { Zap, Wifi, Dumbbell, ShieldCheck, ChefHat, Bus, BookOpen, ArrowRight, CheckCircle2, Sparkles, Users, TrendingDown, Minus,} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Badge }    from "../ui/badge";
import { Separator} from "../ui/separator";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "../ui/tooltip";
import SmartDormlyBanner from "../SmartDormlyBanner";


const packages = [
  {
    id: "essential",
    tier: "Essential",
    emoji: "🏠",
    tagline: "Cover the basics, stress-free",
    monthlyAdd: 0,
    listings: 18,
    savingsPct: null,
    popular: false,
    cardClass: "border-2 border-gray-100 hover:border-teal-200",
    activeClass: "border-2 border-slate-400 shadow-xl",
    headerClass: "bg-white",
    accentText: "text-slate-600",
    badgeVariant: "secondary",       
    btnClass: "variant-outline border-teal-600 text-teal-600 hover:bg-teal-50",
    saveBadgeClass: "",
    perks: [
      { icon: Zap,         label: "24/7 Electricity backup", note: "Generator included on all floors",  color: "text-teal-600"    },
      { icon: Wifi,        label: "High-speed WiFi",          note: "50 Mbps dedicated fibre line",      color: "text-blue-500"   },
      { icon: ShieldCheck, label: "Secure building access",   note: "24h security guard + CCTV system",  color: "text-indigo-500" },
    ],
  },
  {
    id: "student",
    tier: "Student",
    emoji: "🎓",
    tagline: "Everything a student actually needs",
    monthlyAdd: 40,
    listings: 11,
    savingsPct: 25,
    popular: true,
    cardClass: "border-2 border-gray-100 hover:border-teal-300",
    activeClass: "border-2 border-teal-500 shadow-xl shadow-teal-100",
    headerClass: "bg-gradient-to-br from-teal-50 to-white",
    accentText: "text-teal-600",
    badgeVariant: "default",
    btnClass: "bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20",
    saveBadgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50",
    perks: [
      { icon: Zap,         label: "24/7 Electricity backup", note: "Generator included on all floors",   color: "text-teal-600"   },
      { icon: Wifi,        label: "High-speed WiFi",          note: "100 Mbps dedicated fibre line",      color: "text-blue-500"  },
      { icon: Dumbbell,    label: "Gym access",               note: "Building gym open 6am–11pm daily",   color: "text-violet-500"},
      { icon: ShieldCheck, label: "Laundry service",          note: "2× per week, pickup & delivery",     color: "text-cyan-500"  },
      { icon: ShieldCheck, label: "Secure building access",   note: "24h security guard + CCTV system",   color: "text-indigo-500"},
    ],
  },
  {
    id: "premium",
    tier: "Premium",
    emoji: "✨",
    tagline: "Full experience, zero compromises",
    monthlyAdd: 90,
    listings: 6,
    savingsPct: 40,
    popular: false,
    cardClass: "border-2 border-gray-100 hover:border-amber-200",
    activeClass: "border-2 border-amber-400 shadow-xl shadow-amber-100",
    headerClass: "bg-gradient-to-br from-amber-50 to-white",
    accentText: "text-amber-600",
    badgeVariant: "outline",
    btnClass: "bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-400/20",
    saveBadgeClass: "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-50",
    perks: [
      { icon: Zap,         label: "24/7 Electricity + Solar", note: "Generator + rooftop solar panels",   color: "text-teal-600"    },
      { icon: Wifi,        label: "200 Mbps WiFi",             note: "Ultra-fast dedicated fibre",         color: "text-blue-500"   },
      { icon: Dumbbell,    label: "Gym + Pool access",         note: "Full fitness centre, no time limit", color: "text-violet-500" },
      { icon: ShieldCheck, label: "Unlimited laundry",         note: "Daily door-to-door pickup",          color: "text-cyan-500"   },
      { icon: ChefHat,     label: "Meal plan option",          note: "Breakfast & dinner, 7 days/week",    color: "text-orange-500" },
      { icon: Bus,         label: "University shuttle",        note: "AUB / LAU / LIU daily routes",       color: "text-emerald-500"},
      { icon: BookOpen,    label: "Study room access",         note: "Private pods, bookable 24/7",        color: "text-indigo-500" },
    ],
  },
];



// Row with Tooltip 
function PerkRow({ icon: Icon, label, note, color }) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <li className="flex items-center gap-2.5 py-1 cursor-default group">
          
            <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-100 shrink-0 group-hover:border-gray-200 transition-colors">
              <Icon className={`w-3.5 h-3.5 ${color}`} />
            </div>
            
            <span className="flex-1 text-[13px] font-semibold text-gray-800 leading-snug">
              {label}
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          </li>
        </TooltipTrigger>
        
        <TooltipContent side="right" className="text-xs max-w-45">
          {note}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}



export default function StudentPackages() {
  const [activeId, setActiveId]     = useState("student");
  

  return (
    <section className="py-7 md:py-10 bg-linear-to-b from-teal-50/50 via-white to-white relative overflow-hidden">

     
      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{ background: "radial-gradient(circle at 12% 60%, #ccfbf1 0%, transparent 40%), radial-gradient(circle at 88% 10%, #f0fdfa 0%, transparent 35%)" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="text-center mb-10">
          
          <Badge variant="outline" className="bg-teal-50 text-teal-600 border-teal-200 uppercase tracking-widest text-[10px] font-bold px-3 py-1 mb-3">
            Student Packages
          </Badge>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-3 mt-1">
            Everything bundled.{" "}
            <span className="text-teal-600">Nothing to worry about.</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base leading-relaxed">
            Pick a package that matches your lifestyle — housing essentials with
            verified perks. No hidden fees, no separate negotiations.
          </p>
        </div>

        {/* ── Package Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          {packages.map((pkg) => {
            const isActive = activeId === pkg.id;
            return (
              
              <Card key={pkg.id} onClick={() => setActiveId(pkg.id)}
                className={`
                  relative cursor-pointer flex flex-col overflow-hidden
                  transition-all duration-300 rounded-2xl
                  ${isActive ? pkg.activeClass : pkg.cardClass}
                  ${isActive ? "scale-[1.02]" : "hover:shadow-md"}
                `}
              >
                
                {pkg.popular && (
                  <div className="absolute top-0 right-0 z-10 bg-teal-600 text-white text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-bl-xl flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> Most Popular
                  </div>
                )}

               
                <CardHeader className={`px-5 pt-3 pb-3 ${pkg.headerClass}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-3xl block mb-1">{pkg.emoji}</span>
                      <h3 className="text-[17px] font-extrabold text-gray-900 leading-tight">
                        {pkg.tier}
                      </h3>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">{pkg.tagline}</p>
                    </div>

                    {/* Price */}
                    <div className="text-right pt-1">
                      {pkg.monthlyAdd > 0 ? (
                        <>
                          <span className="text-[10px] text-gray-400 block">from</span>
                          <span className={`text-2xl font-extrabold ${pkg.accentText}`}>
                            +${pkg.monthlyAdd}
                          </span>
                          <span className="text-xs text-gray-400">/mo</span>
                        </>
                      ) : (
                        
                        <Badge variant="secondary" className="text-xs font-bold mt-1">
                          Included
                        </Badge>
                      )}
                    </div>
                  </div>

                  
                  {pkg.savingsPct && (
                    <Badge variant="outline"  className={`w-fit text-[10px] font-bold gap-1 ${pkg.saveBadgeClass}`} >
                      <TrendingDown className="w-3 h-3" />
                      Save ~{pkg.savingsPct}% vs booking separately
                    </Badge>
                  )}
                </CardHeader>

                
                <Separator />

                
                <CardContent className="px-5 py-1.5 flex-1">
                  <ul className="divide-y divide-gray-50">
                    {pkg.perks.map((perk) => (
                      <PerkRow key={perk.label} {...perk} />
                    ))}
                  </ul>
                </CardContent>

                
                <Separator />

                
                <CardFooter className="px-5 py-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Users className="w-3.5 h-3.5" />
                    <span>
                      <strong className="text-gray-700">{pkg.listings}</strong> listings available
                    </span>
                  </div>

                  <Button  asChild size="sm"   className={`text-xs font-bold rounded-lg ${pkg.btnClass}`}variant={pkg.id === "essential" ? "outline" : "default"}   >
                    <Link to={`/listings?package=${pkg.id}`}>
                      Browse {pkg.tier} →
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>



      </div>
      <SmartDormlyBanner/>
    </section>
  );
}