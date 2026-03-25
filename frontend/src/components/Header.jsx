import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { GraduationCap, ChevronDown, LogOut, User, Heart, Home, Plus  } from "lucide-react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setUser } from "@/redux/authSlice";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,AlertDialogTitle, AlertDialogTrigger,} from "@/components/ui/alert-dialog";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const {user} = useSelector(store =>store.auth);
     const API_URL = import.meta.env.VITE_API_URL;
     const dispatch = useDispatch();
     const navigate = useNavigate();


  const handleLogout= async(e)=> {
    try {
      const res = await axios.get(`${API_URL}/api/user/logout`, {withCredentials: true});
      if(res.data.success){
        navigate('/login');
        dispatch(setUser(null));
        toast.success(res.data.message);

      }
    } catch (error) {

      console.log(error)
      toast.error(error)
      
    }

  }

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

            {user ? (
              <>
                <Link to="/favorite" className="text-gray-600 font-medium hover:text-teal-600 transition">
                  Favorites
                </Link>

                {/* User Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 cursor-pointer group outline-none">
                    
                      <div className="text-right hidden lg:block">
                        <p className="text-sm  text-slate-800 leading-tight">
                          {user.username}
                        </p>
                        <p className="text-xs text-teal-600 font-medium">
                          {user.role}
                        </p>
                      </div>

                      {/* Avatar with online dot */}
                      <div className="relative">
                        <img
                          src={user.profilePicture || "/images/user.jpeg"}
                          alt="Profile"
                          className="w-9 h-9 rounded-full border-2 border-teal-200 group-hover:border-teal-500 transition-all object-cover"
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                      </div>

                      
                      <ChevronDown
                        size={16}
                        className="text-slate-400 group-hover:text-teal-600 transition group-data-[state=open]:rotate-180 duration-200"
                      />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-48 mt-2 shadow-lg rounded-xl border border-slate-100">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                        <User size={15} className="text-teal-600" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link to="/favorite" className="flex items-center gap-2 cursor-pointer">
                        <Heart size={15} className="text-teal-600" />
                        <span>Favorites</span>
                      </Link>
                    </DropdownMenuItem>

                    {user?.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center gap-2 cursor-pointer">
                        <GraduationCap size={15} className="text-teal-600" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                    {user?.role === "landlord" && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/new-prop" className="flex items-center gap-2 cursor-pointer">
                            <Plus size={15} className="text-teal-600" />
                            <span>Add Property</span>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link to="/landlord/listing" className="flex items-center gap-2 cursor-pointer">
                            <Home size={15} className="text-teal-600" />
                            <span>My Properties</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem  onSelect={(e) => e.preventDefault()} // prevents dropdown from closing before dialog opens
                          className="flex items-center gap-2 cursor-pointer text-red-500 focus:text-red-600 focus:bg-red-50">
                          <LogOut size={15} />
                          <span>Log Out</span>
                        </DropdownMenuItem>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                          <AlertDialogDescription>
                            You will be signed out of your account.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction  onClick={handleLogout}  className="bg-red-500 hover:bg-red-600 text-white"  >
                            Log Out
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/signup" className="text-gray-600 font-medium hover:text-teal-600 transition">
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="bg-teal-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-teal-700 transition shadow-lg shadow-teal-600/20"
                >
                  Login
                </Link>
              </>
            )}

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
