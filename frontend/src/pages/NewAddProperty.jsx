import { useState, useRef } from 'react';
import { ChevronRight, Plus, Trash2, MapPin, Zap, AlertCircle, Lightbulb, Home, GraduationCap, Loader2, ImagePlus, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card } from '@/components/ui/card.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import { useSelector } from 'react-redux';

const API = import.meta.env.VITE_API_URL;

const AMENITY_OPTIONS = [
    'WiFi', 'AC Units', '24/7 Elec', 'Cleaning', 'Laundry Room',
    'Security Cameras', 'Elevator', 'Rooftop Access', 'Parking',
    'Gym Access', 'Laundry Service', 'Secure Building Access',
    'Meal Plan Options', 'University Shuttle', 'Study Room Access',
];
const TYPE_OPTIONS    = ['Single Studio', 'Single Room', 'Double Shared Room', 'Apartment', 'Luxury Apartment', 'Modern Studio'];
const STATUS_OPTIONS  = ['Available Now', 'Coming Soon', 'Full'];
const FURNISH_OPTIONS = ['Fully Furnished', 'Semi Furnished', 'Unfurnished'];
const CITY_OPTIONS    = ['Beirut (Hamra)', 'Beirut (Achrafieh)', 'Byblos (Jbeil)', 'Tripoli', 'Sidon (Saida)', 'Jounieh', 'Zahle','Other'];

const PACKAGE_OPTIONS = [
    {
        id: 'Essential',
        label: 'Essential',
        desc: 'Basic listing with standard visibility',
        color: 'border-slate-300 bg-slate-50',
        activeColor: 'border-teal-500 bg-teal-50',
        badge: 'bg-slate-100 text-slate-600',
    },
    {
        id: 'Student',
        label: 'Student',
        desc: 'Enhanced visibility on student searches',
        color: 'border-slate-300 bg-slate-50',
        activeColor: 'border-blue-500 bg-blue-50',
        badge: 'bg-blue-100 text-blue-700',
    },
    {
        id: 'Premium',
        label: 'Premium',
        desc: 'Top placement & featured badge',
        color: 'border-slate-300 bg-slate-50',
        activeColor: 'border-amber-500 bg-amber-50',
        badge: 'bg-amber-100 text-amber-700',
    },
];

export default function NewAddProperty() {
    const navigate   = useNavigate();
    const { id }     = useParams();
    const isEditing  = Boolean(id);
    const fileInputRef = useRef(null);

    const [submitting, setSubmitting] = useState(false);
    const [imageFiles, setImageFiles] = useState([]);   // File objects
    const [imagePreviews, setImagePreviews] = useState([]); 
    const {user} = useSelector(store =>store.auth);

    const [formData, setFormData] = useState({
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
        packageType:  '',
        amenities:    [],
        amenityLabels:[],
         reviews: 0,           
        availableFrom: '',    
        rank: 0,  
        rating:0,            
        dormlyScore: 8,       
        priceUnit: 'month', 
        responseTime: '',
        nearbyAmenities: [{ name: '', distance: '' }],
    });

     const handle = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    
    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        setImageFiles(prev => [...prev, ...files]);

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = ev => setImagePreviews(prev => [...prev, ev.target.result]);
            reader.readAsDataURL(file);
        });

        e.target.value = '';
    };

    const removeImage = (index) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

   
    const toggleAmenity = (amenity) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity) ? prev.amenities.filter(a => a !== amenity) : [...prev.amenities, amenity],
            amenityLabels: prev.amenityLabels.includes(amenity) ? prev.amenityLabels.filter(a => a !== amenity) : [...prev.amenityLabels, amenity],
        }));
    };

    const addNearby    = () => setFormData(prev => ({ ...prev, nearbyAmenities: [...prev.nearbyAmenities, { name: '', distance: '' }] }));
    const removeNearby = (i) => setFormData(prev => ({ ...prev, nearbyAmenities: prev.nearbyAmenities.filter((_, idx) => idx !== i) }));
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
            //const method = isEditing ? 'PUT' : 'POST';
            //  const url = isEditing ? ${API}/api/properties/${id} : ${API}/api/properties;
            const body = new FormData();

            imageFiles.forEach(file => body.append('images', file));

            body.append('title', formData.title);
            body.append('description', formData.description);
            body.append('type', formData.type);
            body.append('status', formData.status);
            body.append('furnishing', formData.furnishing);
            body.append('location', formData.location);
            body.append('distance', formData.distance);
            body.append('price', formData.price);
            body.append('baseRent', formData.baseRent);
            body.append('utilities', formData.utilities);
            body.append('packageType', formData.packageType);
            body.append('reviews', formData.reviews || 0);
            body.append('rank', formData.rank || 0);
            body.append('dormlyScore', formData.dormlyScore || 8);
            body.append('priceUnit', formData.priceUnit || 'month');
            body.append('availableFrom', formData.availableFrom || '');
            body.append('responseTime', formData.responseTime || '');
            body.append('rating', formData.rating || 0);
            body.append('amenities', JSON.stringify(formData.amenities));
            body.append('amenityLabels', JSON.stringify(formData.amenityLabels));
            body.append('nearbyAmenities', JSON.stringify(
                formData.nearbyAmenities.filter(n => n.name.trim())
            ));

            const res = await axios.post(`${API}/api/properties/addproperty`, body, {withCredentials: true})
    
            const data = res.data;

            if (data.success) {
                toast.success(isEditing ? 'Property updated!' : 'Property published!');
               // navigate('/');
               navigate(getRolePath(user?.role))
            } else toast.error(data.message || 'Failed to save property.');

        } catch (err) {
            //toast.error('Server error. Please try again.');
            console.error(err.response?.data || err.message); 
        toast.error(err.response?.data?.message || 'Server error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const isReady = formData.title && formData.price && formData.location;

    const getRolePath = (role) => {
    if (role === "admin") return "/admin";
    if (role === "landlord") return "/landlord/listing";
    // fallback
    return "/";
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
                            <span className="text-xl font-bold tracking-tight text-teal-600">Dormly Add Property</span>
                        </div>
                        <button onClick={() => navigate(getRolePath(user?.role))} className="text-slate-500 hover:text-teal-600 transition-colors flex items-center gap-1 text-sm">
                            Back to Dashboard <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                    <button onClick={() => navigate(getRolePath(user?.role))} className="hover:text-teal-600">{user?.role}</button>
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
                        <Button onClick={() => navigate(getRolePath(user?.role))} variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={submitting} className="bg-teal-600 hover:bg-teal-700 text-white gap-2">
                            {submitting && <Loader2 size={16} className="animate-spin" />}
                            {isEditing ? 'Save Changes' : 'Publish Property'}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* ── Main Form ── */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* General Info */}
                        <Card className="border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                                <Home size={20} className="text-teal-600" />
                                <h2 className="text-lg font-semibold text-slate-900">General Information</h2>
                            </div>
                            <div className="p-6 space-y-5">

                                {/* ── Multi-image upload ── */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Property Images
                                        <span className="ml-1 text-xs text-slate-400 font-normal">(first image = main cover)</span>
                                    </label>

                                    {/* Drop / click zone */}
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 hover:border-teal-400 hover:bg-teal-50/30 rounded-xl py-8 transition-all text-slate-400 hover:text-teal-600"
                                    >
                                        <ImagePlus size={28} />
                                        <span className="text-sm font-medium">Click to upload images</span>
                                        <span className="text-xs">PNG, JPG, WEBP — multiple allowed</span>
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleImageSelect}
                                    />

                                    {/* Preview grid */}
                                    {imagePreviews.length > 0 && (
                                        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
                                            {imagePreviews.map((src, i) => (
                                                <div key={i} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square">
                                                    <img src={src} alt={`preview-${i}`} className="w-full h-full object-cover" />

                                                    {/* Main badge on first image */}
                                                    {i === 0 && (
                                                        <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-teal-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow">
                                                            <Star size={9} fill="white" /> Main
                                                        </div>
                                                    )}

                                                    {/* Remove button */}
                                                    <button type="button"  onClick={() => removeImage(i)}  className="absolute top-1.5 right-1.5 bg-white/90 hover:bg-rose-500 hover:text-white text-slate-600 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-all shadow" >
                                                        <X size={13} />
                                                    </button>
                                                </div>
                                            ))}

                                            {/* Add-more tile */}
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-teal-400 hover:bg-teal-50/30 flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-teal-600 transition-all"
                                            >
                                                <Plus size={20} />
                                                <span className="text-[10px] font-medium">Add more</span>
                                            </button>
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

                                 {/* Reviews and Score */}
                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5"> 

                                <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Total Reviews</label>
                                <input
                                    type="number"
                                    name="reviews"
                                    value={formData.reviews || 0}
                                    onChange={handle}
                                    placeholder="0"
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none text-sm"
                                />
                                </div>

                                {/* Dormly Score */}
                                <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Dormly Score</label>
                                <input  type="number"  name="dormlyScore"   value={formData.dormlyScore || 8}   min={0}    max={10}  onChange={handle}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none text-sm"  />
                                </div>

                                </div>

                                 {/* Rank and Rating */}
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                                     {/* Rank */}
                                <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Rank</label>
                                <input   type="number"
                                    name="rank"
                                    value={formData.rank || 0}
                                    min={1}
                                    max={10}
                                    onChange={handle}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none text-sm"  />
                                </div>

                                 {/* Rating */}
                                <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Rating</label>
                                <input
                                    type="number"
                                    name="rating"
                                    value={formData.rating || 0}
                                    min={1}
                                    max={5}
                                    onChange={handle}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none text-sm"
                                />
                                </div>


                                </div>

                                {/* ── Package Type ── */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-3">Package Type</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {PACKAGE_OPTIONS.map(pkg => {
                                            const active = formData.packageType === pkg.id;
                                            return (
                                                <button
                                                    key={pkg.id}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, packageType: pkg.id }))}
                                                    className={`relative flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 text-center transition-all ${active ? pkg.activeColor : 'border-slate-200 bg-white hover:border-slate-300'}`}
                                                >
                                                    {active && (
                                                        <span className={`absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${pkg.badge}`}>
                                                            ✓
                                                        </span>
                                                    )}
                                                    <span className={`text-sm font-semibold ${active ? 'text-slate-800' : 'text-slate-600'}`}>{pkg.label}</span>
                                                    <span className="text-[11px] text-slate-400 leading-tight">{pkg.desc}</span>
                                                </button>
                                            );
                                        })}
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

                                <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Available From</label>
                                <input
                                    type="text"
                                    name="availableFrom"
                                    value={formData.availableFrom || ''}
                                    onChange={handle}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none text-sm"
                                />
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

                    {/* ── Sidebar ── */}
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

                                {/* Price Unit */}
                                <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Price Unit</label>
                                <select
                                    name="priceUnit"
                                    value={formData.priceUnit || 'month'}
                                    onChange={handle}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none bg-white text-sm"
                                >
                                    <option value="month">Month</option>
                                    <option value="week">Week</option>
                                    <option value="bed">Bed</option>
                                </select>
                                </div>

                                <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Landlord Response Time</label>
                                <input
                                    type="text"
                                    name="responseTime"
                                    value={formData.responseTime || ''}
                                    onChange={handle}
                                    placeholder="e.g. 1-2 hours"
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none text-sm"
                                />
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
                                isReady ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
                            }`}>
                                <AlertCircle size={18} className={isReady ? 'text-emerald-600' : 'text-amber-600'} />
                                <p className={`text-sm font-medium ${isReady ? 'text-emerald-800' : 'text-amber-800'}`}>
                                    {isReady ? 'Ready to publish' : 'Complete required fields'}
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