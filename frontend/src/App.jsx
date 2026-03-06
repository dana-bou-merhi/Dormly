import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Home from './pages/Home'
import { Routes, Route } from 'react-router-dom';
import ListingsPage from './pages/ListingsPage'
import PropertyDetails from './pages/PropertyDetails';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminPage'
import AddProperty from './pages/AddProperty'
import DormlyAi from './pages/DormlyAi'
import ChatbotButton from './components/ChatbotButton'
import { Toaster } from './components/ui/sonner'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/listings" element={<ListingsPage />} />
          <Route path={"/property/:id"} element={<PropertyDetails />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/add-property" element={<AddProperty />} />
          <Route path='/dormly-ai' element={<DormlyAi/>} />
      </Routes>
      <Toaster/>
    </>
  )
}

export default App
