import React from 'react';
import { Search, Home, Key, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import HowItWorksCard from '../HowItWorksCard';
import { Link } from 'react-router-dom';


export default function HowItWorks() {
 
  const steps = [
    {
      stepNumber: 1,
      icon: Search,
      title: 'Search & Filter',
      description: 'Browse listings by location, price, and amenities. Use our smart filters to find exactly what fits your needs.',
      badgeColor: 'teal'
    },
    {
      stepNumber: 2,
      icon: Home,
      title: 'Explore Details',
      description: 'Check detailed photos, power specs, and landlord verification status. No surprises upon arrival.',
      badgeColor: 'teal'
    },
    {
      stepNumber: 3,
      icon: Key,
      title: 'Connect & Move In',
      description: 'Contact the verified landlord directly, sign your lease, and move into your new safe home.',
      badgeColor: 'teal'
    }
  ];

  return (
    <section className="py-5 md:py-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
            How Dormly Works
          </h2>
          <p className="text-lg text-gray-600">
            Finding your perfect housing is simple and transparent. Just 3 easy steps.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              {/* Card */}
              <HowItWorksCard
                stepNumber={step.stepNumber}
                icon={step.icon}
                title={step.title}
                description={step.description}
                badgeColor={step.badgeColor}
              />

              {/* Chevron Divider (hidden on mobile, shown between cards on desktop) */}
              {index < steps.length - 1 && (
                <div 
                  className="hidden md:block absolute top-1/2 -translate-y-1/2 text-gray-300"
                  style={{ left: `calc(${(index + 1) * 33.33}% - 12px)` }}
                >
                  <ChevronRight className="w-6 h-6" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        
        <div className="text-center mt-8 mb-2.5">
          <Button className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-5 rounded-lg transition shadow-lg shadow-teal-600/30">
           <Link to='/signup'>Get Started Today </Link> 
          </Button>
        </div>
      </div>
    </section>
  );
}
