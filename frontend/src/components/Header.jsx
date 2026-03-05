import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { GraduationCap } from "lucide-react";
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm transition-all duration-300 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="shrink-0 flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white shadow-lg">
              <span className="text-lg font-bold"><GraduationCap /></span>
            </div>
            <span className="text-2xl font-bold text-teal-600 tracking-tight">
              Dormly
            </span>
          </Link>

          
          <nav className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-gray-600 font-medium hover:text-teal-600 transition">
              Home
            </Link>

            <Link to="/listings" className="text-gray-600 font-medium hover:text-teal-600 transition">
              Listings
            </Link>

          {/*   <Link to="/admin" className="text-gray-600 font-medium hover:text-teal-600 transition">
              Admin Dashboard
            </Link>
            */}

            <Link to="/signup" className="text-gray-600 font-medium hover:text-teal-600 transition">
              Sign Up
            </Link>

            <Link to="/login" className="bg-teal-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-teal-700 transition shadow-lg shadow-teal-600/20">
              Login
            </Link>
          </nav>

          {/* Mobile Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-gray-900 focus:outline-none">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block text-gray-600 font-medium hover:text-teal-600 transition py-2">
              Home
            </Link>

            <Link to="/listings" className="block text-gray-600 font-medium hover:text-teal-600 transition py-2">
              Listings
            </Link>

            <Link to="/signup" className="block text-gray-600 font-medium hover:text-teal-600 transition py-2">
              Sign Up
            </Link>

            <Link to="/login" className="block bg-teal-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-teal-700 transition text-center">
              Login
            </Link>
          </nav>
        )}

      </div>
    </header>
  );
}
