import { useState } from 'react';
import { ChevronRight, Plus, Trash2, MapPin, Zap, AlertCircle, Lightbulb, Home, GraduationCap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card } from '@/components/ui/card.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const AMENITY_OPTIONS = ['Free Wi-Fi', 'AC Units', 'Generator 24/7', 'Daily Cleaning', 'Laundry Room', 'Security Cameras', 'Elevator', 'Rooftop Access', 'Parking'];
const TYPE_OPTIONS    = ['Single Studio', 'Single Room', 'Double Shared Room', 'Apartment', 'Luxury Apartment', 'Modern Studio'];
const STATUS_OPTIONS  = ['Available Now', 'Coming Soon', 'Full'];
const FURNISH_OPTIONS = ['Fully Furnished', 'Semi Furnished', 'Unfurnished'];
const CITY_OPTIONS    = ['Beirut (Hamra)', 'Beirut (Achrafieh)', 'Byblos (Jbeil)', 'Tripoli', 'Sidon (Saida)', 'Jounieh'];

export default function AddProperty() {
    const navigate   = useNavigate();
    const { id }     = useParams();
    const isEditing  = Boolean(id);

    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData]     = useState({
        title:        '',
        description:  '',
        type:         '',
        status:       'Available Now',
        furnishing:   '',
        location:     '',
        distance:     '',
        price:        '',
        baseRent:     '',
        utilities:    '',
        image:        '',
        amenities:    [],
        amenityLabels:[],
        nearbyAmenities: [{ name: '', distance: '' }],
    });

    const handle = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleAmenity = (amenity) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity],
            amenityLabels: prev.amenities.includes(amenity)
                ? prev.amenityLabels.filter(a => a !== amenity)
                : [...prev.amenityLabels, amenity],
        }));
    };

    const addNearby = () => setFormData(prev => ({
        ...prev,
        nearbyAmenities: [...prev.nearbyAmenities, { name: '', distance: '' }],
    }));

    const removeNearby = (i) => setFormData(prev => ({
        ...prev,
        nearbyAmenities: prev.nearbyAmenities.filter((_, idx) => idx !== i),
    }));

    const updateNearby = (i, field, value) => setFormData(prev => {
        const updated = [...prev.nearbyAmenities];
        updated[i] = { ...updated[i], [field]: value };
        return { ...prev, nearbyAmenities: updated };
    });

    const handleSubmit = async () => {
        if (!formData.title || !formData.price || !formData.location) {
            toast.error('Title, price, and location are required.');
            return;
        }

        setSubmitting(true);
        try {
            const method = isEditing ? 'PUT' : 'POST';
            const url    = isEditing ? `${API}/properties/${id}` : `${API}/properties`;

            const payload = {
                ...formData,
                price:    Number(formData.price),
                baseRent: Number(formData.baseRent) || undefined,
                utilities: Number(formData.utilities) || undefined,
                nearbyAmenities: formData.nearbyAmenities.filter(n => n.name.trim()),
            };

            const res  = await fetch(url, {
                method,
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (data.success) {
                toast.success(isEditing ? 'Property updated!' : 'Property published!');
                navigate('/admin');
            } else {
                toast.error(data.message || 'Failed to save property.');
            }
        } catch (err) {
            toast.error('Server error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-teal-600 text-white p-1.5 rounded-lg">
                                <GraduationCap size={20} />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-teal-600">Dormly Admin</span>
                        </div>
                        <button onClick={() => navigate('/admin')} className="text-slate-500 hover:text-teal-600 transition-colors flex items-center gap-1 text-sm">
                            Back to Dashboard <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                    <button onClick={() => navigate('/admin')} className="hover:text-teal-600">Admin</button>
                    <ChevronRight size={14} />
                    <span className="text-teal-600 font-medium">{isEditing ? 'Edit Property' : 'Add New Property'}</span>
                </nav>

                {/* Page title + actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">{isEditing ? 'Edit Property' : 'Add New Dorm Property'}</h1>
                        <p className="text-slate-500 mt-1">Fill in the details below to {isEditing ? 'update' : 'list'} a student residence.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button onClick={() => navigate('/admin')} variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={submitting} className="bg-teal-600 hover:bg-teal-700 text-white gap-2">
                            {submitting && <Loader2 size={16} className="animate-spin" />}
                            {isEditing ? 'Save Changes' : 'Publish Property'}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* General Info */}
                        <Card className="border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                                <Home size={20} className="text-teal-600" />
                                <h2 className="text-lg font-semibold text-slate-900">General Information</h2>
                            </div>
                            <div className="p-6 space-y-5">
                                {/* Cover Image URL */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Cover Image URL</label>
                                    <input
                                        type="text"
                                        name="image"
                                        value={formData.image}
                                        onChange={handle}
                                        placeholder="https://example.com/dorm.jpg"
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all text-sm"
                                    />
                                    {formData.image && (
                                        <div className="mt-3 h-40 rounded-xl overflow-hidden border border-slate-200">
                                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
                                        </div>
                                    )}
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Property Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handle}
                                        placeholder="e.g. Skyline Residence Hamra"
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">About Property</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handle}
                                        placeholder="Describe the residence, management, and atmosphere..."
                                        rows="4"
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all resize-none text-sm"
                                    />
                                </div>

                                {/* Type + Furnishing */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Property Type</label>
                                        <select name="type" value={formData.type} onChange={handle} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none bg-white text-sm">
                                            <option value="">Select Type</option>
                                            {TYPE_OPTIONS.map(o => <option key={o}>{o}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Furnishing</label>
                                        <select name="furnishing" value={formData.furnishing} onChange={handle} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none bg-white text-sm">
                                            <option value="">Select Furnishing</option>
                                            {FURNISH_OPTIONS.map(o => <option key={o}>{o}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Location */}
                        <Card className="border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                                <MapPin size={20} className="text-teal-600" />
                                <h2 className="text-lg font-semibold text-slate-900">Location & Proximity</h2>
                            </div>
                            <div className="p-6 space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">City / Area *</label>
                                        <select name="location" value={formData.location} onChange={handle} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none bg-white text-sm">
                                            <option value="">Select City</option>
                                            {CITY_OPTIONS.map(o => <option key={o}>{o}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Distance to Campus</label>
                                        <input type="text" name="distance" value={formData.distance} onChange={handle} placeholder="e.g. 5 min walk" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none text-sm" />
                                    </div>
                                </div>

                                {/* Nearby */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-3">Nearby Institutions & Landmarks</label>
                                    <div className="space-y-3">
                                        {formData.nearbyAmenities.map((n, i) => (
                                            <div key={i} className="flex gap-3 items-center">
                                                <input type="text" value={n.name} onChange={e => updateNearby(i, 'name', e.target.value)} placeholder="e.g. LAU Beirut Campus" className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none text-sm" />
                                                <input type="text" value={n.distance} onChange={e => updateNearby(i, 'distance', e.target.value)} placeholder="e.g. 5 min walk" className="w-32 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none text-sm" />
                                                <button onClick={() => removeNearby(i)} className="text-rose-400 hover:text-rose-600 transition-colors"><Trash2 size={16} /></button>
                                            </div>
                                        ))}
                                        <button onClick={addNearby} className="flex items-center gap-2 text-teal-600 hover:text-teal-700 text-sm font-medium">
                                            <Plus size={16} /> Add Landmark
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Pricing */}
                        <Card className="border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                                <Zap size={20} className="text-teal-600" />
                                <h2 className="text-lg font-semibold text-slate-900">Pricing & Status</h2>
                            </div>
                            <div className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Monthly Price (USD) *</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                                        <input type="number" name="price" value={formData.price} onChange={handle} placeholder="450" className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Base Rent</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                                        <input type="number" name="baseRent" value={formData.baseRent} onChange={handle} placeholder="400" className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Utilities</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                                        <input type="number" name="utilities" value={formData.utilities} onChange={handle} placeholder="50" className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Availability Status</label>
                                    <select name="status" value={formData.status} onChange={handle} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none bg-white text-sm">
                                        {STATUS_OPTIONS.map(o => <option key={o}>{o}</option>)}
                                    </select>
                                </div>

                                {/* Amenities */}
                                <div className="pt-4 border-t border-slate-100">
                                    <label className="block text-sm font-medium text-slate-700 mb-3">Amenities</label>
                                    <div className="space-y-2.5">
                                        {AMENITY_OPTIONS.map(a => (
                                            <label key={a} className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.amenities.includes(a)}
                                                    onChange={() => toggleAmenity(a)}
                                                    className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                                                />
                                                <span className="text-sm text-slate-600 group-hover:text-teal-600 transition-colors">{a}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Status indicator */}
                        <Card className="border-slate-200 p-5 space-y-3">
                            <h3 className="font-semibold text-slate-900 text-sm">Listing Status</h3>
                            <div className={`flex items-center gap-3 p-3 rounded-lg border ${
                                formData.title && formData.price && formData.location
                                    ? 'bg-emerald-50 border-emerald-200'
                                    : 'bg-amber-50 border-amber-200'
                            }`}>
                                <AlertCircle size={18} className={formData.title && formData.price && formData.location ? 'text-emerald-600' : 'text-amber-600'} />
                                <p className={`text-sm font-medium ${formData.title && formData.price && formData.location ? 'text-emerald-800' : 'text-amber-800'}`}>
                                    {formData.title && formData.price && formData.location ? 'Ready to publish' : 'Complete required fields'}
                                </p>
                            </div>
                        </Card>

                        {/* Tip */}
                        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 flex gap-3">
                            <Lightbulb size={18} className="text-teal-600 shrink-0 mt-0.5" />
                            <p className="text-xs text-teal-700 font-medium leading-relaxed">
                                Dorms with clear proximity info and amenity details get 40% more student leads.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
