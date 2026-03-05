import { useState } from 'react';
import {GraduationCap, Home, LayoutDashboard, Building2, BarChart3, Settings, LogOut, Edit2, Trash2, ChevronLeft, ChevronRight, Plus, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card } from '@/components/ui/card.jsx';
import { Link } from 'react-router-dom';

const ADMIN_LISTINGS = [
  {
    id: 1,
    title: 'Beirut Central Heights',
    location: 'Hamra, Beirut',
    price: 450,
    image: '/images/dorm1.avif',
  },
  {
    id: 2,
    title: 'Byblos Student Res.',
    location: 'Jbeil, Byblos',
    price: 320,
    image: '/images/dorm2.jpg',
  },
  {
    id: 3,
    title: 'Tripoli North Garden',
    location: 'Dam & Farez, Tripoli',
    price: 250,
    image: '/images/dorm3.jpg',
  },
  {
    id: 4,
    title: 'Ashrafieh Elite Living',
    location: 'Sassine, Beirut',
    price: 550,
    image: '/images/Dorm4.jpg',
  },
];

const STAT_CARDS = [
  {
    label: 'Total Listings',
    value: '1,284',
    icon: Building2,
    bgColor: 'bg-teal-50',
    iconColor: 'text-teal-600',
  },
  {
    label: 'Verified Safe',
    value: '942',
    icon: BarChart3,
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    label: 'Pending Review',
    value: '58',
    icon: LayoutDashboard,
    bgColor: 'bg-slate-100',
    iconColor: 'text-slate-600',
  },
];

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [adminUser] = useState({
    name: 'J. Khalil',
    role: 'Senior Admin',
    avatar: '/images/landlord.jpg',
  });

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Admin Dorm Management</h1>
                <p className="text-sm text-slate-500">Centralized platform for Lebanese university student housing.</p>
              </div>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-md shadow-teal-600/10">
                <Plus size={18} />
                <Link to="/admin/add-property" className="text-white">
                <span className="font-semibold">Add New Property</span>
                </Link>
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STAT_CARDS.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <Card key={idx} className="p-6 border-slate-200">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center ${stat.iconColor}`}>
                        <Icon size={24} />
                      </div>
                      <div>
                        <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Listings Table */}
            <Card className="border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-white">
                <h2 className="text-lg font-bold text-slate-900">Listed Dorms</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Property Title</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Monthly Price</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ADMIN_LISTINGS.map((listing) => (
                      <tr key={listing.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                              <img className="w-full h-full object-cover" alt={listing.title} src={listing.image} />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{listing.title}</p>
                              <p className="text-xs text-slate-500">ID: DRM-{listing.id}921</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            <MapPin size={16} className="text-teal-600" />
                            <span className="text-sm">{listing.location}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-teal-600">${listing.price}</span>
                          <span className="text-xs text-slate-500">/mo</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-teal-600 hover:bg-teal-50 rounded-full transition-colors" title="Edit">
                              <Link to='/admin/add-property'> <Edit2 size={18} /> </Link> 
                            </button>
                            <button className="p-2 text-rose-500 hover:bg-rose-50 rounded-full transition-colors" title="Delete">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                <p className="text-sm text-slate-500">
                  Showing <span className="font-semibold text-slate-900">1</span> to <span className="font-semibold text-slate-900">4</span> of{' '}
                  <span className="font-semibold text-slate-900">124</span> results
                </p>
                <div className="flex gap-1">
                  <button className="p-2 border border-slate-200 rounded-lg hover:bg-white transition-colors disabled:opacity-30" disabled>
                    <ChevronLeft size={18} />
                  </button>
                  <button className="px-3 py-1 bg-teal-600 text-white rounded-lg font-medium">1</button>
                  <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-white transition-colors">2</button>
                  <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-white transition-colors">3</button>
                  <button className="p-2 border border-slate-200 rounded-lg hover:bg-white transition-colors">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </Card>
          </div>
        );

      case 'listings':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Manage Listings</h1>
              <p className="text-sm text-slate-500">View, edit, and manage all property listings.</p>
            </div>
            <Card className="p-8 border-slate-200 text-center">
              <Building2 size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-600">Listings management interface coming soon...</p>
            </Card>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
              <p className="text-sm text-slate-500">View detailed reports and analytics about your listings.</p>
            </div>
            <Card className="p-8 border-slate-200 text-center">
              <BarChart3 size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-600">Reports interface coming soon...</p>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col fixed h-full z-20">
        {/* Logo */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white shadow-lg">
              <span className="text-lg font-bold"><GraduationCap /></span>
            </div>
          <span className="text-xl font-bold tracking-tight text-teal-600">DORMLY</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentPage === 'dashboard'
                ? 'bg-teal-50 text-teal-600 border-r-4 border-teal-600'
                : 'text-slate-500 hover:bg-slate-50 hover:text-teal-600'
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentPage('listings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentPage === 'listings'
                ? 'bg-teal-50 text-teal-600 border-r-4 border-teal-600'
                : 'text-slate-500 hover:bg-slate-50 hover:text-teal-600'
            }`}
          >
            <Building2 size={20} />
            <span className="font-medium">Listings</span>
          </button>

          <a
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-teal-600 rounded-lg transition-colors group"
          >
            <Home size={20} />
            <span className="font-medium">Home</span>
          </a>

          <button
            onClick={() => setCurrentPage('reports')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentPage === 'reports'
                ? 'bg-teal-50 text-teal-600 border-r-4 border-teal-600'
                : 'text-slate-500 hover:bg-slate-50 hover:text-teal-600'
            }`}
          >
            <BarChart3 size={20} />
            <span className="font-medium">Reports</span>
          </button>
        </nav>

        {/* User Profile */}
        <div className="p-4 mt-auto border-t border-slate-100">
          <div className="flex items-center gap-3 p-2">
            <img className="w-10 h-10 rounded-full object-cover border border-slate-200" alt={adminUser.name} src={adminUser.avatar} />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate">{adminUser.name}</p>
              <p className="text-xs text-slate-500 truncate">{adminUser.role}</p>
            </div>
                <button className="text-slate-400 hover:text-red-600 transition-colors" title="Logout">
                <LogOut size={16} />
                </button>

          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">

        {/* Content */}
        <div className="p-4 lg:p-8 grow">{renderContent()}</div>
      </main>
    </div>
  );
}
