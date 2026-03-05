import { useState } from 'react';
import { Heart, MapPin, Star, Wifi, Zap, Snowflake, Home, Armchair, ArrowUp,MessageCircle,Send, Sparkles, Calendar, Phone, ShieldAlert, Images } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ChatbotButton from '@/components/ChatbotButton.jsx';
import { Link } from 'react-router-dom';
import DormsImagesGallery from '@/components/DormsImagesGallery';
import PropertyInfoCard from '@/components/PropertyInfoCard';
import PropertyCostSidebar from '@/components/PropertyCostSidebar';
import PropertyLocation from '@/components/PropertyLocation';

const PROPERTY_DATA = {
  id: 1,
  title: 'Hamra Student Studio',
  price: 300,
  baseRent: 250,
  utilities: 50,
  location: 'Hamra Street, Beirut, Lebanon',
  distance: '5 min from LAU',
  rating: 4.8,
  reviews: 12,
  type: 'Single Studio',
  status: 'Available Now',
  furnishing: 'Fully Furnished',
  availableFrom: '1 March, 2026',
  description: 'Modern and secure studio located in the heart of Hamra. Designed specifically for university students, this studio offers a quiet study environment with all the essentials. Just a 5-minute walk to AUB and 8 minutes to LAU. The building features 24/7 security and a dedicated study lounge for residents.',
  images: [
    '/images/Dorm4.jpg',
    '/images/kitchen.jpg',
    '/images/citting room.jpg',
    '/images/bathroom.jpg',
    '/images/outsideDorm.jpg',
  ],
  amenities: [
    { icon: Zap, label: '24/7 Solar Panel 10A' },
    { icon: Wifi, label: 'Fiber WiFi' },
    { icon: Snowflake, label: 'Air Conditioning' },
    { icon: Home, label: 'Private Balcony' },
    { icon: ArrowUp, label: 'High Speed Elevator' },
    { icon: Sparkles, label: 'Weekly cleaning' },
  ],
  nearbyAmenities: [
    { name: 'American University of Beirut', distance: '5 min Walk' },
    { name: 'Hamra Pharmacy', distance: '2 min Walk' },
    { name: 'Supermarket', distance: '5 min Walk' },
    { name: 'Public Transport Hub', distance: '5 min Walk' },
  ],
  landlord: {
    name: 'John',
    verified: true,
    responseTime: '< 2hrs',
    avatar: '/images/landlord.jpg',
  },
  studentReviews: [
    {
      id: 1,
      author: 'Sara Mansour',
      rating: 5,
      text: 'Modern and secure studio located in the heart of Hamra. Designed specifically for university students, this studio offers a quiet study environment with all the essentials.',
      avatar: '/images/student.jpg',
    },
  ],
};

export default function PropertyDetails() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showMessageBox, setShowMessageBox] = useState(false);
const [message, setMessage] = useState('');


  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'fill-teal-600 text-teal-600' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
       <DormsImagesGallery images={PROPERTY_DATA.images} selectedImage={selectedImage} setSelectedImage={setSelectedImage} />


        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
         
          <div className="lg:col-span-2 space-y-10">
            
           
            <div className="border-b border-gray-100 pb-3">
              <div className="flex gap-2 text-xs font-bold tracking-wide text-teal-600 mb-3">
                <Badge variant="secondary" className="bg-teal-50 text-teal-700">Verified Safe</Badge>
                <span className="text-gray-500 px-2 py-2">{PROPERTY_DATA.distance}</span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">{PROPERTY_DATA.title}</h1>

              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center text-gray-500 text-sm">
                  <MapPin size={18} className="text-teal-600 mr-2" />
                  <span>{PROPERTY_DATA.location}</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">{renderStars(Math.floor(PROPERTY_DATA.rating))}</div>
                  <span className="font-bold text-teal-600 text-lg">{PROPERTY_DATA.rating}</span>
                  <span className="text-gray-400 text-sm">({PROPERTY_DATA.reviews} reviews)</span>
                </div>
              </div>
            </div>

            
            <PropertyInfoCard
              type={PROPERTY_DATA.type}
              status={PROPERTY_DATA.status}
              furnishing={PROPERTY_DATA.furnishing}
            />

            
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-4">About this Property</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{PROPERTY_DATA.description}</p>
            </section>

            {/* Amenities Section */}
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6">
                {PROPERTY_DATA.amenities.map((amenity, idx) => {
                  const IconComponent = amenity.icon;
                  return (
                    <div key={idx} className="flex items-center gap-3 text-sm text-gray-600">
                      <IconComponent size={20} className="text-teal-600 shrink-0" />
                      <span>{amenity.label}</span>
                    </div>
                  );
                })}
              </div>
            </section>

          
           <PropertyLocation nearbyAmenities={PROPERTY_DATA.nearbyAmenities} />

            {/* Reviews Section */}
            <section className="pt-6 border-t border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Student Reviews</h3>

              <div className="space-y-5">
                {PROPERTY_DATA.studentReviews.map((review) => (
                  <div key={review.id} className="pb-5 border-b border-gray-100 last:border-0">
                    <div className="flex items-start gap-4">
                      <Link to="/profile"> 
                      <img
                        src={review.avatar}
                        alt={review.author}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                      /> </Link>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm text-gray-900 mb-2">{review.author}</h4>
                        <div className="flex gap-0.5 mb-2">{renderStars(review.rating)}</div>
                        <p className="text-sm text-gray-600 italic">"{review.text}"</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

         
          
          <PropertyCostSidebar price={PROPERTY_DATA.price} baseRent={PROPERTY_DATA.baseRent} utilities={PROPERTY_DATA.utilities} 
          availableFrom={PROPERTY_DATA.availableFrom} landlord={PROPERTY_DATA.landlord} />
        </div>
      </main>

      <Footer />
      <ChatbotButton />
    </div>
  );
}
