import { useState } from 'react';
import { Calendar, MessageCircle, Send, Phone, Star, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';


export default function PropertyCostSidebar({ price, baseRent, utilities, availableFrom, landlord, propertyId }) {
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [message, setMessage] = useState('');
  const {user} = useSelector(store =>store.auth);
  //const canContact = user && user._id !== landlord?.user?._id;
  const isLoggedIn = !!user;
const isOwner = user?._id === landlord?.user?._id;
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const navigate = useNavigate();

  const handleSendMessage = async () => {
  if (!message.trim()) return;

  try {
    const res = await axios.post(`${API_URL}/api/messages/send/message`,  {  propertyId, landlordId: landlord.user._id, content: message, },
      {
        withCredentials: true, 
      }
    );
    const data = res.data;

    setMessage('');
    setShowMessageBox(false);
    
    if (data.success) {
    toast.success(data.message || 'Message sent to landlord Frontend!');
    }

  } catch (error) {
    console.error(error.response?.data || error.message);
    toast.error(data.message ||'Failed to send message. Try again.');
  }
};


      

  return (
    <aside className="space-y-6">
      {/* Price Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm  top-24">
        <div className="mb-6">
          <div className="flex items-end gap-1">
            <span className="text-3xl font-bold text-teal-600">${price}</span>
            <span className="text-gray-400 text-sm mb-1">/month</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Total Rent for Long Stay</p>
        </div>

        <div className="space-y-3 text-sm mb-6">
          <div className="flex justify-between items-center text-gray-600">
            <span>Base Rent</span>
            <span className="font-semibold">${baseRent}</span>
          </div>
          <div className="flex justify-between items-center text-gray-600 pb-3 border-b border-gray-100">
            <span>Utility Estimates (water, electricity, wifi)</span>
            <span className="font-semibold">${utilities}</span>
          </div>
          <div className="flex justify-between items-center font-bold text-gray-800 pt-1">
            <span>Total Estimated</span>
            <span>${price}</span>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-teal-600 font-medium text-sm">
            <Calendar size={16} /> Available from:
          </div>
          <span className="text-sm font-bold text-gray-800">{availableFrom}</span>
        </div>
        
        {!showMessageBox && (
          <Button onClick={() => { 
            if (!isLoggedIn) {
                toast.error("Please log in to be able to contact the landlord");
                navigate('/login');
                return;
              }
              if (isOwner) {
                toast.error("You cannot contact your own listing");
                return;
              }
              setShowMessageBox(true);
            }} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-teal-600/20 mb-6 flex items-center justify-center gap-2" >
            <MessageCircle size={18} />
            Contact Landlord
          </Button>
        )}

        {isLoggedIn && !isOwner && showMessageBox && (
          <div className="space-y-3 mb-6">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message to the landlord..."
              className="w-full p-3 border border-gray-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 outline-none resize-none"
              rows="4"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSendMessage}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <Send size={16} />
                Send
              </Button>
              <Button
                onClick={() => setShowMessageBox(false)}
                variant="outline"
                className="flex-1 py-2 rounded-lg"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <img 
            src={landlord?.user?.profilePicture ||'/images/user.jpeg'}
            alt={landlord?.user?.username || 'Unknown'}
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <span className="font-bold text-sm text-gray-900">{landlord?.user?.username || 'Unknown'}</span>
              {landlord?.verified && <Star size={12} className="fill-teal-600 text-teal-600" />}
            </div>
            <p className="text-[10px] text-gray-400">Verified Landlord</p>
          </div>
          <div className="text-[10px] text-gray-400 flex items-center gap-1">
            <Phone size={12} /> Response time {landlord?.responseTime || '<2hrs'}
          </div>
        </div>
      </div>

      {/* Safety Alert */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
        <ShieldAlert size={20} className="text-blue-400 mt-1 shrink-0" />
        <div>
          <h4 className="font-bold text-blue-900 text-xs uppercase mb-1">Dormly Safety</h4>
          <p className="text-xs text-blue-800/70 leading-relaxed">
            Always tour the property and verify utilities before making any payment.
          </p>
        </div>
      </div>
    </aside>
  );
}