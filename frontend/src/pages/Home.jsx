import { useState } from 'react';
import { Link } from 'wouter';
import { Heart, Star, MapPin, Zap, DollarSign, Users } from 'lucide-react';
import Header from '../components/Header';
//import Footer from '../components';
import HeroSection from '@/components/sections/HeroSection';
import HowItWorksSection from '@/components/sections/HowItWorks';
import DormlyFeatures from '@/components/sections/DormlyFeatures';
import Footer from '@/components/Footer';
import ChatbotButton from '@/components/ChatbotButton';
import FeaturesCardListings from '@/components/sections/FeaturesCardListings';
import StudentPackages from '@/components/sections/StudentPackages';
export default function Home() {


  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="grow">
        <HeroSection />
        <DormlyFeatures/>
        <FeaturesCardListings/>
        <StudentPackages/>
        <HowItWorksSection/>
        
       
      </main>
    <Footer/>
     <ChatbotButton/>
    </div>
  );
}