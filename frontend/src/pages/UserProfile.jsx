import { useState } from 'react';
import { Pencil, X, Check, User, Lock, Mail, Phone, School,ArrowDown, Camera, BookOpen, MessageCircle, ChevronRight, Clock, CheckCheck, XCircle, Home,} from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ChatbotButton from '@/components/ChatbotButton.jsx';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';


const MOCK_INQUIRIES = [
  {
    id: 1,
    propertyId: 3,
    propertyTitle: 'Hamra Student Studio',
    propertyLocation: 'Hamra Street, Beirut',
    propertyImage: '/images/Dorm4.jpg',
    price: 300,
    lastMessage: 'Hi, is the unit still available for March? I am a student at LAU.',
    sentAt: '2025-03-01',
    status: 'replied', // 'pending' | 'replied' | 'closed'
  },
  {
    id: 2,
    propertyId: 1,
    propertyTitle: 'Beirut Central Heights',
    propertyLocation: 'Hamra, Beirut',
    propertyImage: '/images/dorm5.jpg',
    price: 450,
    lastMessage: 'I would like to schedule a viewing this weekend if possible.',
    sentAt: '2025-02-28',
    status: 'pending',
  },
  {
    id: 3,
    propertyId: 4,
    propertyTitle: 'Achrafieh Modern Flat',
    propertyLocation: 'Achrafieh, Beirut',
    propertyImage: '/images/outsideDorm.jpg',
    price: 520,
    lastMessage: 'Thank you for the information. I will get back to you soon.',
    sentAt: '2025-02-20',
    status: 'closed',
  },
];

const UNIVERSITIES = [
  'American University of Beirut (AUB)',
  'Lebanese American University (LAU)',
  'Lebanese University (UL)',
  'Saint Joseph University (USJ)',
  'Notre Dame University (NDU)',
  'Other',
];


function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
        <Icon size={15} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-900 truncate">{value || <span className="text-slate-400 italic">Not set</span>}</p>
      </div>
    </div>
  );
}


const INQUIRY_STATUS = {
  pending: {
    label: 'Pending',
    icon: Clock,
    cls: 'bg-amber-50 text-amber-700 border-amber-100',
    dot: 'bg-amber-400',
  },
  replied: {
    label: 'Replied',
    icon: CheckCheck,
    cls: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    dot: 'bg-emerald-400',
  },
  closed: {
    label: 'Closed',
    icon: XCircle,
    cls: 'bg-slate-100 text-slate-500 border-slate-200',
    dot: 'bg-slate-400',
  },
};


function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

 
function InquiryCard({ inquiry }) {
  const s = INQUIRY_STATUS[inquiry.status] ?? INQUIRY_STATUS.pending;
  const StatusIcon = s.icon;

  return (
    <article className="group flex gap-4 p-5 hover:bg-slate-50/60 transition-colors border-b border-slate-100 last:border-0">

      {/* Property image */}
      <div className="w-20 h-16 rounded-xl overflow-hidden shrink-0">
        <img
          src={inquiry.propertyImage}
          alt={inquiry.propertyTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-0.5">
          {/* Title + location */}
          <div className="min-w-0">
            <h4 className="font-bold text-slate-900 text-sm truncate">{inquiry.propertyTitle}</h4>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <Home size={10} className="text-teal-500 shrink-0" />
              {inquiry.propertyLocation}
              <span className="text-slate-300 mx-1">·</span>
              <span className="text-teal-600 font-semibold">${inquiry.price}/mo</span>
            </p>
          </div>

          {/* Status badge */}
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${s.cls}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {s.label}
          </span>
        </div>

        {/* Message snippet */}
        <p className="text-xs text-slate-500 mt-1.5 line-clamp-1 italic">
          "{inquiry.lastMessage}"
        </p>

        {/* Footer: date + actions */}
        <div className="flex items-center justify-between mt-2.5 flex-wrap gap-2">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Clock size={10} /> Sent {formatDate(inquiry.sentAt)}
          </span>

          <div className="flex items-center gap-2">
            <Link to={`/property/${inquiry.propertyId}`}>
              <button className="text-[11px] font-semibold text-slate-600 hover:text-teal-600 transition-colors">
                View Property
              </button>
            </Link>
            <span className="text-slate-200">·</span>
            <Link to={`/messages/${inquiry.id}`}>
              <button className="text-[11px] font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 transition-colors">
                <MessageCircle size={11} /> View Conversation
              </button>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [inquiries] = useState(MOCK_INQUIRIES);
  const {user} = useSelector(store =>store.auth);
  const dispatch = useDispatch();

 
  const [profile, setProfile] = useState({
    username:    user?.username,
    email:       user?.email,
    phone:       user?.phone ||'+961...',
    university:  user?.uni || 'Lebanese University (UL)',
    bio:         user?.bio || '',
    role:        user?.role,
    profilePicture:     user?.profilePicture|| '/images/user.jpeg',
  });

  // Draft state — only committed on Save
  const [draft, setDraft] = useState({ ...profile });

  const handleEdit = () => {
    setDraft({ ...profile });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraft({ ...profile });
    setIsEditing(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setProfile({ ...draft });
    setIsEditing(false);
  };


  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setDraft((prev) => ({ ...prev, profilePicture: objectUrl }));
    // Also update profile.avatar preview immediately so the sidebar reflects it
    setProfile((prev) => ({ ...prev, profilePicture: objectUrl }));
  };

  const pendingCount = inquiries.filter((i) => i.status === 'pending').length;
  const repliedCount = inquiries.filter((i) => i.status === 'replied').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

         
          <aside className="lg:col-span-4 space-y-5">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              {/* Teal accent bar */}
              <div className="h-1.5 bg-teal-600" />

              <div className="p-7 text-center">
                {/* Avatar */}
                <div className="relative inline-block mb-5">
                  <img
                    src={profile.profilePicture}
                    alt={profile.username}
                    className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md mx-auto"
                  />
                  {/* Camera only visible in edit mode */}
                  {isEditing && (
                    <label   htmlFor="profilePicture-upload"  className="absolute bottom-0 right-0 p-2 bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-700 transition cursor-pointer"  aria-label="Change profile picture"  >
                      <Camera size={15} />
                      <input
                        id="profilePicture-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  )}
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-0.5">{profile.username}</h2>
                <span className="inline-block text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full mb-5">
                  {profile.role}
                </span>

                {/* Read-only info rows */}
                <div className="text-left mt-2">
                  <InfoRow icon={Mail}     label="Email"       value={profile.email} />
                  <InfoRow icon={Phone}    label="Phone"       value={profile.phone} />
                  <InfoRow icon={School}   label="University"  value={profile.university} />
                  {profile.bio && (
                    <InfoRow icon={BookOpen} label="Bio" value={profile.bio} />
                  )}
                </div>

                {/* Edit / Cancel toggle */}
                {!isEditing ? (
                  <Button
                    onClick={handleEdit}
                    variant="outline"
                    className="w-full mt-6 border-2 border-teal-600 text-teal-600 hover:bg-teal-50 font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2"
                  >
                    <Pencil size={15} /> Edit Profile
                  </Button>
                ) : (
                  <button
                    onClick={handleCancel}
                    className="w-full mt-6 border-2 border-slate-200 text-slate-500 hover:bg-slate-50 font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm transition"
                  >
                    <X size={15} /> Cancel Editing
                  </button>
                )}
              </div>
            </div>

            {inquiries.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Inquiries</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-lg font-bold text-slate-900">{inquiries.length}</p>
                    <p className="text-[10px] text-slate-400 font-medium">Total</p>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-amber-50 border border-amber-100">
                    <p className="text-lg font-bold text-amber-600">{pendingCount}</p>
                    <p className="text-[10px] text-amber-500 font-medium">Pending</p>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-emerald-50 border border-emerald-100">
                    <p className="text-lg font-bold text-emerald-600">{repliedCount}</p>
                    <p className="text-[10px] text-emerald-500 font-medium">Replied</p>
                  </div>
                </div>
              </div>
            )}

          </aside>

         
          <div className="lg:col-span-8 space-y-8">

            
            {isEditing && (
              <section className="bg-white rounded-2xl shadow-sm border border-teal-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-teal-50/40 flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Pencil size={15} className="text-teal-600" /> Edit Profile
                  </h3>
                  <span className="text-xs text-slate-400">Changes save when you click Save</span>
                </div>

                <form onSubmit={handleSave} className="p-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Full Name</label>
                      <input
                        type="text"
                        value={draft.username}
                        onChange={(e) => setDraft({ ...draft, username: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition text-sm"
                      />
                    </div>

                    
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Phone Number</label>
                      <input
                        type="tel"
                        value={draft.phone}
                        onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                        placeholder="+961 XX XXX XXX"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition text-sm"
                      />
                    </div>

                    {/* University */}
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">University</label>
                      <div className="relative">
                        <select
                          value={draft.university}
                          onChange={(e) => setDraft({ ...draft, university: e.target.value })}
                          className="w-full px-4 py-2.5 pr-9 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition text-sm bg-white appearance-none"
                        >
                          <option value="">Select your university</option>
                          {UNIVERSITIES.map((u) => <option key={u}>{u}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                          <ArrowDown className="w-5 h-5 text-teal-600" /> 
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                        Bio <span className="normal-case font-normal text-slate-400">(optional)</span>
                      </label>
                      <textarea
                        value={draft.bio}
                        onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                        placeholder="Tell landlords a bit about yourself..."
                        rows={3}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition text-sm resize-none"
                      />
                    </div>
                  </div>

                  {/* Email — read-only, shown for context */}
                  <div className="bg-slate-50 rounded-xl px-4 py-3 flex items-center gap-3">
                    <Mail size={15} className="text-slate-400 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email (cannot be changed)</p>
                      <p className="text-sm text-slate-600">{profile.email}</p>
                    </div>
                  </div>

                  
                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      type="submit"
                      className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-2.5 rounded-xl font-semibold shadow-lg shadow-teal-600/20 flex items-center gap-2"
                    >
                      <Check size={15} /> Save Changes
                    </Button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="text-slate-500 hover:text-slate-800 font-medium text-sm px-4 py-2 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </section>
            )}
             {/* Inquiry Section */}

            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle size={16} className="text-teal-600" />
                  <h3 className="text-base font-bold text-slate-900">My Inquiries</h3>
                  {inquiries.length > 0 && (
                    <span className="text-[11px] font-bold text-teal-700 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-full">
                      {inquiries.length}
                    </span>
                  )}
                </div>
              </div>

              {inquiries.length === 0 ? (
                <div className="p-10 text-center">
                  <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-3">
                    <MessageCircle size={24} className="text-teal-300" />
                  </div>
                  <p className="text-sm font-semibold text-slate-600 mb-1">No inquiries yet</p>
                  <p className="text-xs text-slate-400 mb-4">
                    When you contact a landlord, your messages will appear here.
                  </p>
                  <Link to="/listings">
                    <Button className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-5 py-2 rounded-xl shadow-md shadow-teal-600/20">
                      Browse Listings
                    </Button>
                  </Link>
                </div>
              ) : (
                <div>
                  {inquiries.map((inquiry) => (
                    <InquiryCard key={inquiry.id} inquiry={inquiry} />
                  ))}
                </div>
              )}
            </section>

          </div>
        </div>
      </main>

      <Footer />
      <ChatbotButton />
    </div>
  );
}