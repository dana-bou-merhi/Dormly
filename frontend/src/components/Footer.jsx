import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, Clock } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    setEmail('');
  };

  return (
    <footer className="bg-teal-50 pt-9 pb-8 border-t border-teal-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-8 text-center md:text-left">
       
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" className="text-3xl font-bold text-teal-600 mb-6 block">
              Dormly
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-xs">
              Connecting Lebanese university students with safe, verified, and affordable housing. Transparent pricing, trusted landlords, and complete peace of mind.
            </p>
            <div className="flex space-x-6">
              <Link to="#" className="text-gray-400 hover:text-teal-600 transition-all transform hover:scale-110">
                <Facebook size={24} />
              </Link>
              <Link to="#" className="text-gray-400 hover:text-teal-600 transition-all transform hover:scale-110">
                <Instagram size={24} />
              </Link>
              <Link to="#" className="text-gray-400 hover:text-teal-600 transition-all transform hover:scale-110">
                <Twitter size={24} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-bold text-gray-900 mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-4 text-sm text-gray-500 font-medium">
              <li>
                <Link to="/" className="hover:text-teal-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/listings" className="hover:text-teal-600 transition-colors">
                  Listings
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-teal-600 transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-teal-600 transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-bold text-gray-900 mb-6 text-lg">Contact Us</h4>
            <ul className="space-y-4 text-sm text-gray-500 font-medium">
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <MapPin size={18} className="text-teal-600" />
                Beirut, Lebanon
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <Mail size={18} className="text-teal-600" />
                info@dormly.com
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <Phone size={18} className="text-teal-600" />
                +961 01 771 935
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <Clock size={18} className="text-teal-600" />
                Mon - Fri, 9 AM - 6 PM
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-bold text-gray-900 mb-6 text-lg">Newsletter</h4>
            <p className="text-gray-500 text-sm mb-4">Stay updated with new listings.</p>
            <form onSubmit={handleNewsletterSubmit} className="w-full max-w-xs">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-teal-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-sm"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-4 bg-teal-600 text-white rounded-md text-xs font-bold hover:bg-teal-700 transition-colors"
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="border-t border-teal-200/60 pt-5 text-center">
          <p className="text-gray-400 text-sm font-medium">&copy; 2026 Dormly. All rights reserved. Built for students in Lebanon.</p>
        </div>
      </div>
    </footer>
  );
}
