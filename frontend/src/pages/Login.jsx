import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
//import Footer from '@/components/Footer';
import { Input } from '../components/Input';
import { Button } from '@/components/ui/button';


export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in with:", formData);
  };

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-gray-50 to-gray-100 font-sans">
      <Header />

      <main className="grow flex items-center justify-center px-4 py-12">
        <section className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="p-8 sm:p-10">
              
              <header className="text-center mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back</h1>
                <p className="text-gray-500 text-sm">Log in to your Dormly account.</p>
              </header>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input 
                  label="Email Address"
                  id="email"
                  type="email"
                  placeholder="name@university.edu.lb"
                  icon={Mail}
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />

                <Input 
                  label="Password"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  icon={Lock}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-teal-600 border-gray-300 focus:ring-teal-500" />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-teal-600 hover:text-teal-700 font-medium">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-6 rounded-xl shadow-lg shadow-teal-600/20 transition-all active:scale-95 flex items-center justify-center gap-2 group"
                >
                  <span>Login to Dormly</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>

              {/* line */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  <span className="px-4 bg-white">Social Login</span>
                </div>
              </div>

            {/* Social Login */}
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-sm font-medium text-gray-700">
                  <img src="/images/Google icon.png" alt="Google" className="w-5 h-5" />
                  Google
                </button>
                <button className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-sm font-medium text-gray-700">
                  <img src="/images/linkedin logo.png" alt="LinkedIn" className="w-5 h-5" />
                  LinkedIn
                </button>
              </div>

              <p className="text-center text-sm text-gray-600 mt-8">
                Don't have an account?{' '}
                <Link to="/signup" className="text-teal-600 hover:text-teal-700 font-semibold">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
        
    </div>
  );
}