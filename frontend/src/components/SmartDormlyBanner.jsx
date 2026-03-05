import React from 'react'
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Bot } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';

const VARIABLES = [
  "Price vs. budget", "Distance to campus", "Power reliability score",
  "Landlord rating", "Verified reviews", "Filling speed",
  "Solar/generator availability", "Amenities match", "Lease flexibility",
  "Neighborhood safety index", "Internet quality", "Noise level",
  "Natural light", "Previous tenant satisfaction",
];

const HOW_IT_WORKS = [
  { step: "01", title: "Set your preferences", desc: "University, budget, minimum power score, and max distance from campus." },
  { step: "02", title: "We run the algorithm", desc: "14 variables ranked in real-time: price, power reliability, landlord score, reviews, distance, and more." },
  { step: "03", title: "Get your personal ranked list", desc: "Every listing is scored just for you — sorted by your priorities, not ours." },
];

const SmartDormlyBanner = () => {
    const [open, setOpen] = useState(false);
  return (
    <>
      {/* Banner — contained card matching screenshot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  py-6">
        <div
          className="relative w-full rounded-2xl overflow-hidden flex flex-col sm:flex-row items-center justify-between
           gap-6 px-8 sm:px-12 py-6 bg-teal-600"
      
        >
          {/* Subtle dot grid texture */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Left: text */}
          <div className="relative z-10 flex-1 max-w-lg">
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug mb-3">
              🤖 Dormly AI – Let Data Find Your Dorm
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Tell us your university, budget, minimum power score, and distance preferences.
              Our algorithm ranks every listing personally for you across 14 variables.
            </p>
          </div>

          {/* Right: buttons */}
          <div className="relative z-10 flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => setOpen(true)}
              className="px-6 py-3 rounded-lg border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition"
            >
              How It Works
            </button>
           <Link to="/dormly-ai" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white text-teal-700 hover:bg-teal-50 font-bold text-sm transition shadow-lg shadow-teal-900/40">
              <Bot size={18} />
              Try Dormly AI →
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl text-teal-800">
              🤖 How Smart Match Works
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-sm">
              A transparent look at how we rank listings personally for you.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 space-y-5">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="flex gap-4 items-start">
                <div className="w-9 h-9 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0 text-teal-600 font-bold text-xs">
                  {step.step}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{step.title}</p>
                  <p className="text-gray-500 text-sm mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              All 14 Variables
            </p>
            <div className="flex flex-wrap gap-2">
              {VARIABLES.map((v) => (
                <Badge key={v} variant="secondary" className="text-xs bg-teal-50 text-teal-700 border border-teal-200">
                  {v}
                </Badge>
              ))}
            </div>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="mt-4 w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
          >
            Try Dormly AI <ArrowRight className="w-4 h-4" />
          </button>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SmartDormlyBanner