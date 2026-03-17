import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from './redux/authSlice';
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Home from './pages/Home'
import ListingsPage from './pages/ListingsPage'
import PropertyDetails from './pages/PropertyDetails';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminPage'
import AddProperty from './pages/AddProperty'
import DormlyAi from './pages/DormlyAi'
import ChatbotButton from './components/ChatbotButton'
import { Toaster } from './components/ui/sonner'
import FavoriteDorms from './pages/FavoriteDorms'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

function App() {
  const dispatch = useDispatch();

  // Rehydrate user from session on page load
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch(`${API}/user/me`, { credentials: 'include' });
        const data = await res.json();
        if (data.success) dispatch(setUser(data.user));
      } catch {
        // Not logged in — that's fine
      }
    };
    fetchMe();
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route path="/"                        element={<Home />} />
        <Route path="/signup"                  element={<SignUp />} />
        <Route path="/login"                   element={<Login />} />
        <Route path="/listings"                element={<ListingsPage />} />
        <Route path="/property/:id"            element={<PropertyDetails />} />
        <Route path="/profile"                 element={<UserProfile />} />
        <Route path="/admin"                   element={<AdminDashboard />} />
        <Route path="/admin/add-property"      element={<AddProperty />} />
        <Route path="/admin/edit-property/:id" element={<AddProperty />} />
        <Route path="/dormly-ai"               element={<DormlyAi />} />
        <Route path="/favorite"                element={<FavoriteDorms />} />
      </Routes>
      <ChatbotButton />
      <Toaster />
    </>
  )
}

export default App
