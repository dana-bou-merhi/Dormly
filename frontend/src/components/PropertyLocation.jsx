import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';

export default function PropertyLocation({ nearbyAmenities }) {
  return (
    <section>
      <h3 className="text-xl font-bold text-gray-900 mb-6">Location and Nearby</h3>

      <div className="relative w-full h-64 rounded-xl overflow-hidden mb-6 group">
        <img
          src="/images/maps.png"
          alt="Map"
          className="w-full h-full object-cover brightness-90"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white p-2 rounded-full shadow-lg animate-bounce">
            <MapPin size={32} className="text-red-500" />
          </div>
        </div>
        
      </div>

      <div className="space-y-4">
        <p className="text-xs font-bold uppercase text-gray-500 mb-2">Nearby Amenities</p>
        {nearbyAmenities.map((amenity, idx) => (
          <div key={idx} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0">
            <span className="text-gray-700 font-medium">{amenity.name}</span>
            <Badge variant="secondary" className="bg-teal-50 text-teal-700 text-xs">
              👣 {amenity.distance}
            </Badge>
          </div>
        ))}
      </div>
    </section>
  );
}