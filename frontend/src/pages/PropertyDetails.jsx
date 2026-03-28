import { useEffect, useState } from 'react';
import { Heart, MapPin, Star, Wifi, Zap, Snowflake, Home, ArrowUp,MessageCircle,Send, Sparkles, Calendar, Phone, ShieldAlert,  Dumbbell, Coffee, Shield, Truck, BookOpen, Car } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ChatbotButton from '@/components/ChatbotButton.jsx';
import { Link, useParams } from 'react-router-dom';
import DormsImagesGallery from '@/components/DormsImagesGallery';
import PropertyInfoCard from '@/components/PropertyInfoCard';
import PropertyCostSidebar from '@/components/PropertyCostSidebar';
import PropertyLocation from '@/components/PropertyLocation';
import axios from 'axios';

const PROPERTY_DATA = {
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

// to add anemity icons 
const AMENITY_ICONS = {
  "WiFi": Wifi,
  "AC Units": Snowflake,
  "24/7 Elec": Zap,
  "Cleaning": Sparkles,
  "Laundry Room": MapPin,
  "Security Cameras": Shield,
  "Elevator": ArrowUp,
  "Rooftop Access": Car,
  "Parking": Car,
  "Gym Access": Dumbbell,
  "Laundry Service": MapPin,
  "Secure Building Access": Shield,
  "Meal Plan Options": Coffee,
  "University Shuttle": Truck,
  "Study Room Access": BookOpen,
};


export default function PropertyDetails() {
   const { id } = useParams();
   const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [message, setMessage] = useState('');
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

 useEffect(() => {
  const fetchPropertDetails = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/properties/${id}`);
      const data = res.data;

      if (data.success) {
        setProperty(data.property);

        console.log("PROPERTY:", data.property);
        console.log("IMAGES:", data.property.images);
        console.log("IMAGE:", data.property.image);
      } else {
        setError(data.message || "Property not found");
      }

    } catch (error) {
      setError("Failed to fetch property");
    } finally {
      setLoading(false);
    }
  };

  fetchPropertDetails();
}, [id]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'fill-teal-600 text-teal-600' : 'text-gray-300'}
      />
    ));
  };


     if (loading) return <div className="text-center py-20">Loading property...</div>;
  if (error) return <div className="text-center py-20 text-red-600">{error}</div>;

  return (
    
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        
       <DormsImagesGallery
  images={
    property.images && property.images.length > 0
      ? property.images
      : property.image
      ? [property.image]
      : []
  }
  selectedImage={selectedImage}
  setSelectedImage={setSelectedImage}
/>


        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
         
          <div className="lg:col-span-2 space-y-10">
            
           
            <div className="border-b border-gray-100 pb-3">
              <div className="flex gap-2 text-xs font-bold tracking-wide text-teal-600 mb-3">
                <Badge variant="secondary" className="bg-teal-50 text-teal-700">Verified Safe</Badge>
                 
                <span className="text-gray-500 px-2 py-2">{property.distance}</span>

                 {property.package && property.package !== 'Essential' && (
                      <Badge className={property.package === 'Premium' 
                          ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                          : 'bg-blue-100 text-blue-700 border border-blue-200'}>
                          {property.package === 'Premium' ? '⭐ Premium Listing' : '🎓 Student Pick'}
                      </Badge>
                  )}

              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>

              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center text-gray-500 text-sm">
                  <MapPin size={18} className="text-teal-600 mr-2" />
                  <span>{property.location}</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">{renderStars(Math.floor(property.rating))}</div>
                  <span className="font-bold text-teal-600 text-lg">{property.rating}</span>
                  <span className="text-gray-400 text-sm">({property.reviews} reviews)</span>
                </div>
              </div>
            </div>

            
            <PropertyInfoCard
              type={property.type}
              status={property.status}
              furnishing={property.furnishing}
            />

            
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-4">About this Property</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{property.description}</p>
            </section>

            {/* Amenities Section */}
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6">
                {property.amenityLabels.map((amenityName, idx) => {
                  const IconComponent = AMENITY_ICONS[amenityName]; // get icon from mapping
                  return (
                    <div key={idx} className="flex items-center gap-3 text-sm text-gray-600">
                      {IconComponent && <IconComponent size={20} className="text-teal-600 shrink-0" />}
                      <span>{amenityName}</span> {/* display the name */}
                    </div>
                  );
                })}
              </div>
            </section>

          
           <PropertyLocation nearbyAmenities={property.nearbyAmenities} />

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

         
          
          <PropertyCostSidebar price={property.price} baseRent={property.baseRent} utilities={property.utilities} 
          availableFrom={property.availableFrom} landlord={property.landlord} />
        </div>
      </main>

      <Footer />
      <ChatbotButton />
    </div>
  );
}
