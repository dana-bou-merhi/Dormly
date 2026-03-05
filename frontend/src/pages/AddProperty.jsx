import { useState } from 'react';
import { ChevronRight, Plus, Trash2, MapPin, Zap, AlertCircle, Lightbulb, Home, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card } from '@/components/ui/card.jsx';
import { useNavigate } from 'react-router-dom';
//import { useLocation } from 'wouter';

export default function AddProperty() {
  //const [, setLocation] = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    address: '',
    baseRent: '',
    securityDeposit: '',
    mapImage: '',
    amenities: ['Free Wi-Fi', 'AC Units', 'Generator 24/7', 'Security Cameras'],
    proximities: [
      { name: 'LAU Beirut Campus', distance: '5 min walk' },
      { name: 'AUB Main Gate', distance: '12 min walk' },
    ],
  });

const [images, setImages] = useState([
    '/images/dorm3.jpg',
    '/images/kitchen.jpg',
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map(file => URL.createObjectURL(file));
    setImages([...images, ...newImages]);
  };

  const handleMapImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const mapImage = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, mapImage }));
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleAddProximity = () => {
    setFormData((prev) => ({
      ...prev,
      proximities: [...prev.proximities, { name: '', distance: '' }],
    }));
  };

  const handleRemoveProximity = (index) => {
    setFormData((prev) => ({
      ...prev,
      proximities: prev.proximities.filter((_, i) => i !== index),
    }));
  };

  const handleProximityChange = (index, field, value) => {
    setFormData((prev) => {
      const newProximities = [...prev.proximities];
      newProximities[index][field] = value;
      return { ...prev, proximities: newProximities };
    });
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePublish = () => {
    alert('Property published successfully!');
    //setLocation('/admin');
  };


  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-teal-600 text-white p-1.5 rounded-lg">
                 <span className="text-lg font-bold"><GraduationCap /></span>
              </div>
              <span className="text-xl font-bold tracking-tight text-teal-600">Dormly Admin Dashboard</span>
            </div>
            <button onClick={() => navigate('/admin')} className="text-slate-500 hover:text-teal-600 transition-colors">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <button onClick={() => navigate('/admin')} className="hover:text-teal-600 transition-colors">
            Admin
          </button>
          <ChevronRight size={16} />
          <button onClick={() => navigate('/admin')} className="hover:text-teal-600 transition-colors">
            Listed Dorms
          </button>
          <ChevronRight size={16} />
          <span className="text-teal-600 font-medium">Add New Property</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Add New Dorm Property</h1>
            <p className="text-slate-500 mt-1">Fill in the details below to list a new student residence.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => navigate('/admin')} variant="outline"  className="px-5 py-2.5 rounded-lg border border-teal-600 text-teal-600 hover:bg-teal-50">
              Cancel
            </Button>
            <Button onClick={handlePublish} className="px-5 py-2.5 rounded-lg bg-teal-600 text-white hover:bg-teal-700 font-medium shadow-sm">
              Publish Property
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-8 space-y-8">
            {/* General Information */}
            <Card className="border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                <Home size={20} className="text-teal-600" />
                <h2 className="text-lg font-semibold text-slate-900">General Information</h2>
              </div>
              <div className="p-6 space-y-6">
                {/* Image Upload */}
               {/* Image Upload */}
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Property Images</label>
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="border-2 border-dashed border-teal-300 rounded-xl p-8 text-center hover:border-teal-600 transition-colors bg-teal-50/30">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mb-3">
                          <Plus size={24} />
                        </div>
                        <p className="text-slate-900 font-medium">Click to upload or drag and drop</p>
                        <p className="text-slate-500 text-xs mt-1">PNG, JPG or WEBP up to 10MB each. Max 10 images.</p>
                      </div>
                    </div>
                  </label>
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-slate-200">
                        <img className="w-full h-full object-cover" alt="Dorm" src={img} />
                        <button onClick={() => handleRemoveImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    {[...Array(Math.max(0, 4 - images.length))].map((_, idx) => (
                      <div key={`empty-${idx}`} className="aspect-video rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300">
                        <Plus size={24} />
                      </div>
                    ))}
                  </div>
                </div>


                {/* Title & Description */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Property Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g. Skyline Residence Hamra"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">About Property</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe the residence, management, and atmosphere..."
                      rows="4"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Location & Proximity */}
            <Card className="border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                <MapPin size={20} className="text-teal-600" />
                <h2 className="text-lg font-semibold text-slate-900">Location & Proximity</h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">City / Area *</label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                    >
                      <option>Select City</option>
                      <option>Beirut (Hamra)</option>
                      <option>Beirut (Achrafieh)</option>
                      <option>Byblos (Jbeil)</option>
                      <option>Tripoli</option>
                      <option>Sidon (Saida)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street, Building, Floor"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Proximity List */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Nearby Institutions & Landmarks</label>
                  <div className="space-y-3">
                    {formData.proximities.map((proximity, idx) => (
                      <div key={idx} className="flex gap-3 items-center">
                        <input
                          type="text"
                          value={proximity.name}
                          onChange={(e) => handleProximityChange(idx, 'name', e.target.value)}
                          placeholder="e.g. LAU Beirut Campus"
                          className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none text-sm transition-all"
                        />
                        <input
                          type="text"
                          value={proximity.distance}
                          onChange={(e) => handleProximityChange(idx, 'distance', e.target.value)}
                          placeholder="e.g. 5 min walk"
                          className="w-32 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none text-sm transition-all"
                        />
                        <button onClick={() => handleRemoveProximity(idx)} className="text-red-500 hover:text-red-700 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={handleAddProximity}
                      className="flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors text-sm font-medium"
                    >
                      <Plus size={18} />
                      Add Proximity
                    </button>
                  </div>
                </div>

                {/* Map Preview */}
               {/* Map Location Upload */}
            
                    {/* Map Location Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Property Location on Map</label>
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMapImageUpload}
                      className="hidden"
                    />
                    <div className="border-2 border-dashed border-teal-300 rounded-xl p-8 text-center hover:border-teal-600 transition-colors bg-teal-50/30">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mb-3">
                          <MapPin size={24} />
                        </div>
                        <p className="text-slate-900 font-medium">Click to upload map screenshot</p>
                        <p className="text-slate-500 text-xs mt-1">Upload a screenshot or image showing the dorm location on a map</p>
                      </div>
                    </div>
                  </label>
                  {formData.mapImage && (
                    <div className="h-48 mt-4 rounded-xl overflow-hidden border border-slate-200">
                      <img className="w-full h-full object-cover" alt="Map Location" src={formData.mapImage} />
                    </div>
                  )}
                </div>

              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Pricing & Utilities */}
            <Card className="border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                <Zap size={20} className="text-teal-600" />
                <h2 className="text-lg font-semibold text-slate-900">Pricing & Utilities</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Base Rent (Monthly) *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                    <input
                      type="number"
                      name="baseRent"
                      value={formData.baseRent}
                      onChange={handleInputChange}
                      placeholder="450"
                      className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Security Deposit</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                    <input
                      type="number"
                      name="securityDeposit"
                      value={formData.securityDeposit}
                      onChange={handleInputChange}
                      placeholder="One month rent"
                      className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <label className="block text-sm font-medium text-slate-700 mb-4">Included Amenities</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {['Free Wi-Fi', 'AC Units', 'Generator 24/7', 'Daily Cleaning', 'Laundry Room', 'Security Cameras'].map((amenity) => (
                      <label key={amenity} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                          className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                        />
                        <span className="text-sm text-slate-600 group-hover:text-teal-600 transition-colors">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Status Card */}
            <Card className="border-slate-200 p-6 space-y-4">
              <h3 className="font-semibold text-slate-900">Listing Status</h3>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <AlertCircle size={20} className="text-amber-600" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Ready to Publish</p>
                  <p className="text-xs text-amber-700/70">Complete all required fields to publish.</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Created by:</span>
                  <span className="font-medium">Admin Mike</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Last updated:</span>
                  <span className="font-medium text-slate-400 italic">Just now</span>
                </div>
              </div>
            </Card>

            {/* Pro Tip */}
            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200">
              <div className="flex gap-3">
                <Lightbulb size={18} className="text-teal-600 shrink-0 mt-0.5" />
                <p className="text-xs text-teal-700 font-medium leading-relaxed">
                  Pro-tip: Dorms with high-quality photos of common areas and clear proximity to universities get 40% more student leads.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
