import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '@/redux/authSlice';
import MajorChoice from './MajorChoice';
 
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const LINKEDIN_CLIENT_ID = import.meta.env.VITE_LINKEDIN_CLIENT_ID || '';
const LINKEDIN_REDIRECT_URI = import.meta.env.VITE_LINKEDIN_REDIRECT_URI || 'http://localhost:5173/auth/linkedin/callback';
 
export default function Login() {
  const [formData, setFormData]   = useState({ email: '', password: '' });
  const [error, setError]         = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate     = useNavigate();
  const dispatch     = useDispatch();
  const { loading }  = useSelector(store => store.auth);
  const [searchParams] = useSearchParams();
  const [showMajorModal, setShowMajorModal] = useState(false);
 
  // Handle LinkedIn callback code in URL 
  useEffect(() => {
    const code  = searchParams.get('code');
    const state = searchParams.get('state');
 
    if (code && state === 'linkedin_oauth') {
      handleLinkedInCallback(code);
    }
  }, [searchParams]);
 
  // Load Google Identity Services script 
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initGoogle;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);
 
  const initGoogle = () => {
    if (!window.google || !GOOGLE_CLIENT_ID) return;
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCredential,
    });
  };
 
  // ── Google credential handler ─────────────────────────────────────────────
  const handleGoogleCredential = async (response) => {
    setGoogleLoading(true);
    try {
      
      const res  = await axios.post(`${API_URL}/api/user/auth/google`, { credential: response.credential }, { withCredentials: true });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
       // navigate(res.data.user.role === 'admin' ? '/admin' : '/');
       // new modification
        const role  = res.data.user?.role;
      const major = res.data.user?.major;

      if (role === 'student' && !major) {
        setShowMajorModal(true); 
      } else {
        navigate(role === 'admin' ? '/admin' : '/');
      }

      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Google sign-in failed.');
    } finally {
      setGoogleLoading(false);
    }
  };
 
  const handleGoogleClick = () => {
    if (!GOOGLE_CLIENT_ID) { toast.error('Google sign-in is not configured yet.'); return; }
    if (!window.google) { toast.error('Google script not loaded. Please refresh.'); return; }
    window.google.accounts.id.prompt();
  };
 
  // ── LinkedIn OAuth ────────────────────────────────────────────────────────
  const handleLinkedInClick = () => {
    if (!LINKEDIN_CLIENT_ID) { toast.error('LinkedIn sign-in is not configured yet.'); return; }
    const params = new URLSearchParams({
      response_type: 'code',
      client_id:     LINKEDIN_CLIENT_ID,
      redirect_uri:  LINKEDIN_REDIRECT_URI,
      scope:         'openid profile email',
      state:         'linkedin_oauth',
    });
    window.location.href = `https://www.linkedin.com/oauth/v2/authorization?${params}`;
  };
 
  const handleLinkedInCallback = async (code) => {
    dispatch(setLoading(true));
    try {
      const url = `${API_URL}/api/user/auth/linkedin`;
console.log("FINAL URL:", url);
      const res = await axios.post(`${API_URL}/api/user/auth/linkedin`, { code, redirectUri: LINKEDIN_REDIRECT_URI }, { withCredentials: true });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        //navigate(res.data.user.role === 'admin' ? '/admin' : '/');
        
        const role  = res.data.user?.role;
      const major = res.data.user?.major;

      if (role === 'student' && !major) {
        setShowMajorModal(true); // ← show modal
      } else {
        navigate(role === 'admin' ? '/admin' : '/');
      }


      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'LinkedIn sign-in failed.');
    } finally {
      dispatch(setLoading(false));
    }
  };
 
  // Email/password login 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      dispatch(setLoading(true));
      const response = await axios.post(`${API_URL}/api/user/login`, formData, { withCredentials: true });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        dispatch(setUser(response.data.user));
        toast.success(response.data.message);
       // navigate(response.data.user?.role === 'admin' ? '/admin' : '/');

       // new changes for modal 
        const role  = response.data.user?.role;
       const major = response.data.user?.major;

  // only show modal for students who haven't set a major yet
  if (role === 'student' && !major) {
    setShowMajorModal(true);
  } else {
    navigate(role === 'admin' ? '/admin' : '/');
  }


      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleMajorSelect = async (selectedMajor) => {
  if (selectedMajor !== 'skip') {
    try {
      await axios.post(  `${API_URL}/api/user/major`, { major: selectedMajor },  { withCredentials: true } );
    } catch {
      toast.error("Couldn't save major, you can set it later in profile settings.");
    }
  }
  setShowMajorModal(false);
  navigate('/');
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
                {error && <p className="mt-4 text-red-500 text-xs bg-red-50 p-2 rounded">{error}</p>}
              </header>
 
              <form onSubmit={handleSubmit} className="space-y-5">
                <Input label="Email Address" id="email" type="email" placeholder="name@university.edu.lb"
                  icon={Mail} required value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
 
                <Input label="Password" id="password" type="password" placeholder="••••••••"
                  icon={Lock} required value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
 
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-teal-600 border-gray-300 focus:ring-teal-500" />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                </div>
 
                <Button type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-6 rounded-xl shadow-lg shadow-teal-600/20 transition-all active:scale-95 flex items-center justify-center gap-2 group">
                  {loading
                    ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" /> Please Wait</>
                    : <>Login To Dormly <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                  }
                </Button>
              </form>
 
              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
                <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  <span className="px-4 bg-white">Or continue with</span>
                </div>
              </div>
 
              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleGoogleClick}
                  disabled={googleLoading}
                  className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-sm font-medium text-gray-700 disabled:opacity-60"
                >
                  {googleLoading
                    ? <Loader2 size={18} className="animate-spin text-gray-400" />
                    : <img src="/images/Google icon.png" alt="Google" className="w-5 h-5" />
                  }
                  Google
                </button>
                <button
                  onClick={handleLinkedInClick}
                  className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-sm font-medium text-gray-700"
                >
                  <img src="/images/linkedin logo.png" alt="LinkedIn" className="w-5 h-5" />
                  LinkedIn
                </button>
              </div>
 
              <p className="text-center text-sm text-gray-600 mt-8">
                Don't have an account?{' '}
                <Link to="/signup" className="text-teal-600 hover:text-teal-700 font-semibold">Sign up here</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      {showMajorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <MajorChoice onSelect={handleMajorSelect} />
        </div>
      )}

    </div>
  );
}