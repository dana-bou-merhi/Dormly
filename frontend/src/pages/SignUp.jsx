import React, { useState } from 'react';
import { Eye, EyeOff, Menu, X } from 'lucide-react';
//import signupimg from '../assets/Signupimage.png';
import { User, Mail, Lock,  CheckCircle2, Award, DollarSign, Zap } from 'lucide-react';
import { GraduationCap } from "lucide-react";
import { Input } from '@/components/Input';
import { Checkbox } from '@/components/ui/checkbox.jsx';
import { Button } from '@/components/ui/button.jsx';


const SignUp = () => {
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    agreedToTerms: false
  });

  const handleRoleChange = (newRole) => {
    setRole(newRole);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', { ...formData, role });
  };

  return (
    <div className="h-screen overflow-hidden flex">
      
         <aside className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-linear-to-br from-teal-700 to-teal-900 items-center justify-center p-12">
          <img 
            alt="Students studying together" 
            className="absolute inset-0 object-cover w-full h-full opacity-30 mix-blend-overlay" 
            src="/images/signUp.png"
          />
          
          <div className="relative z-10 max-w-lg text-white">
            {/* Logo Header */}
            <header className="mb-12 flex items-center gap-3">
              <div className="bg-white p-3 rounded-lg shadow-lg">
                <GraduationCap className="text-teal-700 w-6 h-6" />
              </div>
              <span className="text-4xl font-bold tracking-tight">Dormly</span>
            </header>
            
            {/* Main Heading */}
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Start your journey to safe & affordable living.
            </h1>
            <p className="text-xl text-teal-50 mb-8 leading-relaxed">
              Join Lebanon's most trusted student housing platform. Verified listings, transparent pricing, and 24/7 power assurance.
            </p>
            
            {/* Features List */}
            <ul className="space-y-6">
              <li className="flex items-center gap-4">
                <div className="bg-white/20 p-2 rounded-full">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg">Verified Landlords & Dorms</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="bg-white/20 p-2 rounded-full">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg">No Hidden Utility Fees</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="bg-white/20 p-2 rounded-full">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg">Confirmed Generator Schedules</span>
              </li>
            </ul>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-teal-900/80 to-transparent"></div>
        </aside>

     
      <section className="flex-1 flex items-center justify-center p-6 md:p-10 lg:p-12 bg-slate-100">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <header className="lg:hidden mb-8 flex items-center gap-2">
            <div className="bg-[#007B83]/10 p-2 rounded-xl">
              <svg className="w-6 h-6 text-[#007B83]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
                <path d="M12 13.18L5 9.64V17h14v-7.36l-7-3.82z"/>
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#007B83]">Dormly</span>
          </header>

          <header className="mb-7">
            <h2 className="text-2xl font-bold text-slate-900">Create an account</h2>
            <p className="text-slate-500 mt-1">Join thousands of students finding their perfect dorm.</p>
          </header>

          {/* Role */}
          <div className="bg-white p-1.5 rounded-xl mb-6 flex shadow-sm  ">
            <button 
              type="button"
              className={`flex-1 py-2.5 px-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                role === 'student' 
                  ? 'bg-[#007B83] text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              onClick={() => handleRoleChange('student')}
            >
              I'm a Student
            </button>
            <button 
              type="button"
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                role === 'landlord' 
                  ? 'bg-[#007B83] text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              onClick={() => handleRoleChange('landlord')}
            >
              I'm a Landlord
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            
            <Input label="Full Name"  icon={User}   id="fullName"  name="fullName"  type="text" placeholder="John Doe"
              value={formData.fullName}  onChange={handleInputChange} required  
              />
              
              
              <Input
                label="Email Address"
                icon={Mail}
                id="email"
                name="email"
                type="email"
                placeholder={role === 'student' ? 'name@university.edu.lb' : 'landlord@example.com'}
                value={formData.email}
                onChange={handleInputChange}
                required
              />

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 rounded-xl transition-all text-sm outline-none"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            

            {/* Terms Checkbox using shadcn/ui */}
              <div className="flex items-start gap-3 py-1">
                <Checkbox id="terms"  checked={formData.agreedToTerms}  
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreedToTerms: checked }))}  className="mt-1"/>
                <label className="text-xs text-slate-500 dark:text-slate-400 leading-tight cursor-pointer" htmlFor="terms">
                  By creating an account, I agree to Dormly's{' '}
                  <a className="text-teal-600 hover:underline font-semibold" href="#">
                    Terms of Service
                  </a>
                  {' '}and{' '}
                  <a className="text-teal-600 hover:underline font-semibold" href="#">
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>

             <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold 
             py-6 rounded-xl shadow-lg shadow-teal-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0" >
                Create Account
              </Button>

          </form>

          
          <div className="mt-6 pt-6 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <a className="text-[#007B83] font-semibold hover:underline" href="/login">
                Log In
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignUp;