import { useState } from 'react';
import { Heart, MapPin, Wifi, Shield, Camera, Mail, School, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/Input.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ChatbotButton from '@/components/ChatbotButton.jsx';

const SAVED_DORMS = [
  {
    id: 1,
    title: 'Beirut Central Heights',
    location: 'Hamra, Beirut',
    price: 450,
    image: '/images/dorm5.jpg',
    verified: true,
    amenities: ['Verified', 'Free Wifi'],
  },
  {
    id: 2,
    title: 'Byblos Student Res.',
    location: 'Jbeil, Byblos',
    price: 320,
    image: '/images/dorm2.jpg',
    verified: true,
    amenities: ['Verified', 'Full AC'],
  },
];

export default function UserProfile() {
  const [formData, setFormData] = useState({
    fullName: 'Sarah Mansour',
    phoneNumber: '+961 71 823 456',
    university: 'Lebanese University (UL)',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    alert('Changes saved successfully!');
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar - Profile Card */}
          <aside className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              {/* Top accent bar */}
              <div className="h-2 bg-teal-600"></div>

              <div className="p-8 text-center">
                {/* Profile Picture */}
                <div className="relative inline-block mb-6">
                  <img
                    alt="Sarah Mansour"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md mx-auto"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
                  />
                  <button
                    className="absolute bottom-0 right-0 p-2 bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-700 transition-transform hover:scale-110"
                    aria-label="Change profile picture"
                  >
                    <Camera size={16} />
                  </button>
                </div>

                {/* Profile Info */}
                <h2 className="text-2xl font-bold text-slate-900 mb-1">Sarah Mansour</h2>
                <p className="text-slate-500 text-sm mb-6">Student ID: #20234921</p>

                {/* Contact Details */}
                <div className="space-y-4 text-left border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                      <Mail size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Email Address</p>
                      <p className="text-sm font-medium text-slate-900">sarah.mansour@ul.edu.lb</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                      <School size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">University</p>
                      <p className="text-sm font-medium text-slate-900">Lebanese University (UL)</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="outline"
                  className="w-full mt-8 border-2 border-teal-600 text-teal-600 hover:bg-teal-50 font-semibold py-2.5 rounded-xl"
                >
                  Edit Public Profile
                </Button>
              </div>
            </div>
          </aside>

          {/* Right Column - Settings & Saved Dorms */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Account Settings Section */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">Account Settings</h3>
              </div>

              <form onSubmit={handleSaveChanges} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-slate-600 mb-2 block">Full Name</label>
                  <Input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    id="fullName"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-600 mb-2 block">Phone Number</label>
                  <Input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    id="phoneNumber"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-slate-600 mb-2 block">Current University</label>
                  <select
                    name="university"
                    value={formData.university}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all bg-white text-sm"
                  >
                    <option>Lebanese University (UL)</option>
                    <option>American University of Beirut (AUB)</option>
                    <option>Saint Joseph University (USJ)</option>
                    <option>Lebanese American University (LAU)</option>
                  </select>
                </div>

                <div className="flex items-center gap-4 md:col-span-2 pt-4">
                  <Button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-2.5 rounded-xl font-semibold shadow-lg shadow-teal-600/20"
                  >
                    Save Changes
                  </Button>
                  <button
                    type="reset"
                    className="text-slate-500 hover:text-slate-900 font-medium text-sm px-4 py-2"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </section>

            {/* Saved Dorms Section */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">My Saved Dorms</h3>
                <a href="/listings" className="text-teal-600 text-sm font-semibold hover:underline flex items-center gap-1">
                  View All <ChevronRight size={16} />
                </a>
              </div>

              <div className="divide-y divide-slate-100">
                {SAVED_DORMS.map((dorm) => (
                  <article
                    key={dorm.id}
                    className="p-6 flex flex-col sm:flex-row gap-6 hover:bg-slate-50/50 transition-colors"
                  >
                    {/* Dorm Image */}
                    <div className="w-full sm:w-32 h-24 rounded-xl overflow-hidden shrink-0">
                      <img
                        alt={dorm.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                        src={dorm.image}
                      />
                    </div>

                    {/* Dorm Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-slate-900">{dorm.title}</h4>
                          <p className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                            <MapPin size={14} className="text-teal-600" /> {dorm.location}
                          </p>
                        </div>
                        <p className="text-teal-600 font-bold">
                          ${dorm.price}
                          <span className="text-xs text-slate-400 font-normal">/mo</span>
                        </p>
                      </div>

                      {/* Amenities & Actions */}
                      <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
                        <div className="flex gap-4">
                          {dorm.amenities.map((amenity, idx) => (
                            <span key={idx} className="flex items-center gap-1 text-xs font-medium text-slate-500">
                              {amenity === 'Verified' && <Shield size={14} className="text-teal-600" />}
                              {amenity === 'Free Wifi' && <Wifi size={14} className="text-teal-600" />}
                              {amenity === 'Full AC' && <span className="text-teal-600">❄️</span>}
                              {amenity}
                            </span>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <button
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            aria-label="Remove from favorites"
                          >
                            <Heart size={18} fill="currentColor" />
                          </button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="px-4 py-1.5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold rounded-lg"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
      <ChatbotButton />
    </div>
  );
}
