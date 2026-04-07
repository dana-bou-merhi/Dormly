// This page handles the LinkedIn OAuth redirect
// LinkedIn sends the user back to /auth/linkedin/callback?code=...&state=...
// We pass the code to Login which handles it via useSearchParams
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser, setLoading } from '@/redux/authSlice';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const LINKEDIN_REDIRECT_URI = import.meta.env.VITE_LINKEDIN_REDIRECT_URI || 'http://localhost:5173/auth/linkedin/callback';

export default function LinkedInCallback() {
  const [searchParams] = useSearchParams();
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  useEffect(() => {
    const code  = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      toast.error('LinkedIn sign-in was cancelled.');
      navigate('/login');
      return;
    }

    if (!code || state !== 'linkedin_oauth') {
      navigate('/login');
      return;
    }

    const authenticate = async () => {
      dispatch(setLoading(true));
      try {
        const res = await fetch(`${API_URL}/api/user/auth/linkedin`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, redirectUri: LINKEDIN_REDIRECT_URI }),
        });
        const data = await res.json();
        if (data.success) {
          dispatch(setUser(data.user));
          toast.success(data.message);
          navigate(data.user.role === 'admin' ? '/admin' : '/');
        } else {
          toast.error(data.message || 'LinkedIn sign-in failed.');
          navigate('/login');
        }
      } catch {
        toast.error('LinkedIn sign-in failed. Please try again.');
        navigate('/login');
      } finally {
        dispatch(setLoading(false));
      }
    };

    authenticate();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 size={40} className="animate-spin text-teal-600 mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Signing you in with LinkedIn…</p>
      </div>
    </div>
  );
}
