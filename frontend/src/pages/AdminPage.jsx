import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    GraduationCap, Home, LayoutDashboard, Building2, BarChart3,
    LogOut, Edit2, Trash2, ChevronLeft, ChevronRight, Plus,
    MapPin, Users, Search, RefreshCw, AlertTriangle, CheckCircle,
    Clock, TrendingUp, Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card } from '@/components/ui/card.jsx';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { selectUser, selectIsAdmin, clearUser } from '../redux/authSlice';
import { setUser } from '../redux/authSlice';

const API = import.meta.env.VITE_API_URL;

// ─── Reusable stat card ───────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, bgColor, iconColor, sub }) {
    return (
        <Card className="p-6 border-slate-200">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center ${iconColor}`}>
                    <Icon size={24} />
                </div>
                <div>
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{label}</p>
                    <h3 className="text-2xl font-bold text-slate-900">{value ?? '—'}</h3>
                    {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
                </div>
            </div>
        </Card>
    );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
    const map = {
        'Available Now': 'bg-emerald-100 text-emerald-700',
        'Coming Soon':   'bg-amber-100 text-amber-700',
        'Full':          'bg-rose-100 text-rose-700',
    };
    return (
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${map[status] || 'bg-slate-100 text-slate-600'}`}>
            {status}
        </span>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
    const user     = useSelector(selectUser);
    const isAdmin  = useSelector(selectIsAdmin);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [currentPage, setCurrentPage]     = useState('dashboard');
    const [stats, setStats]                 = useState(null);
    const [properties, setProperties]       = useState([]);
    const [users, setUsers]                 = useState([]);
    const [loading, setLoading]             = useState(false);
    const [deletingId, setDeletingId]       = useState(null);

    // Listings pagination + search
    const [listPage, setListPage]           = useState(1);
    const [listTotal, setListTotal]         = useState(0);
    const [listTotalPages, setListTotalPages] = useState(1);
    const [listSearch, setListSearch]       = useState('');
    const [listStatus, setListStatus]       = useState('');
    const LIMIT = 8;

    // Users pagination + search
    const [userPage, setUserPage]           = useState(1);
    const [userTotal, setUserTotal]         = useState(0);
    const [userTotalPages, setUserTotalPages] = useState(1);
    const [userSearch, setUserSearch]       = useState('');
    const [userRole, setUserRole]           = useState('');

    // ── Guard: redirect non-admins ────────────────────────────────────────────
    useEffect(() => {
        if (user !== undefined && !isAdmin) {
            toast.error('Admin access required.');
            navigate('/');
        }
    }, [user, isAdmin, navigate]);

    // ── Fetch dashboard stats ─────────────────────────────────────────────────
    const fetchStats = useCallback(async () => {
        try {
            const res = await fetch(`${API}/api/admin/stats`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) setStats(data.stats);
        } catch (err) {
            console.error('Stats fetch failed', err);
        }
    }, []);

    // ── Fetch properties ──────────────────────────────────────────────────────
    const fetchProperties = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: listPage, limit: LIMIT,
                ...(listSearch && { search: listSearch }),
                ...(listStatus && { status: listStatus }),
            });
            const res = await fetch(`${API}/api/properties?${params}`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) {
                setProperties(data.properties);
                setListTotal(data.total);
                setListTotalPages(data.totalPages);
            }
        } catch (err) {
            toast.error('Failed to load properties.');
        } finally {
            setLoading(false);
        }
    }, [listPage, listSearch, listStatus]);

    // ── Fetch users ───────────────────────────────────────────────────────────
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: userPage, limit: LIMIT,
                ...(userSearch && { search: userSearch }),
                ...(userRole && { role: userRole }),
            });
            const res = await fetch(`${API}/api/admin/users?${params}`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) {
                setUsers(data.users);
                setUserTotal(data.total);
                setUserTotalPages(data.totalPages);
            }
        } catch (err) {
            toast.error('Failed to load users.');
        } finally {
            setLoading(false);
        }
    }, [userPage, userSearch, userRole]);

    useEffect(() => { fetchStats(); }, [fetchStats]);
    useEffect(() => {
        if (currentPage === 'listings') fetchProperties();
    }, [currentPage, fetchProperties]);
    useEffect(() => {
        if (currentPage === 'users') fetchUsers();
    }, [currentPage, fetchUsers]);

    // ── Delete property ───────────────────────────────────────────────────────
    const handleDeleteProperty = async (id) => {
        if (!window.confirm('Delete this property? This cannot be undone.')) return;
        setDeletingId(id);
        try {
            const res = await fetch(`${API}/api/properties/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Property deleted.');
                fetchProperties();
                fetchStats();
            } else {
                toast.error(data.message || 'Delete failed.');
            }
        } catch {
            toast.error('Server error.');
        } finally {
            setDeletingId(null);
        }
    };

    // ── Delete user ───────────────────────────────────────────────────────────
    const handleDeleteUser = async (id) => {
        if (!window.confirm('Delete this user? This cannot be undone.')) return;
        setDeletingId(id);
        try {
            const res = await fetch(`${API}/api/admin/users/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await res.json();
            if (data.success) {
                toast.success('User deleted.');
                fetchUsers();
                fetchStats();
            } else {
                toast.error(data.message || 'Delete failed.');
            }
        } catch {
            toast.error('Server error.');
        } finally {
            setDeletingId(null);
        }
    };

    // ── Update user role ──────────────────────────────────────────────────────
    const handleRoleChange = async (userId, newRole) => {
        try {
            const res = await fetch(`${API}/api/admin/users/${userId}/role`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Role updated.');
                fetchUsers();
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error('Server error.');
        }
    };

    // ── Logout ────────────────────────────────────────────────────────────────
    const handleLogout = async () => {
        await fetch(`${API}/api/user/logout`, { credentials: 'include' });
        dispatch(clearUser());
        navigate('/login');
    };

    // ── Pagination component ──────────────────────────────────────────────────
    const Pagination = ({ page, totalPages, onPage }) => (
        <div className="flex gap-1">
            <button
                onClick={() => onPage(page - 1)}
                disabled={page === 1}
                className="p-2 border border-slate-200 rounded-lg hover:bg-white transition-colors disabled:opacity-30"
            >
                <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(n => (
                <button
                    key={n}
                    onClick={() => onPage(n)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        page === n ? 'bg-teal-600 text-white' : 'border border-slate-200 hover:bg-white'
                    }`}
                >
                    {n}
                </button>
            ))}
            <button
                onClick={() => onPage(page + 1)}
                disabled={page === totalPages}
                className="p-2 border border-slate-200 rounded-lg hover:bg-white transition-colors disabled:opacity-30"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );

    // ─── PAGES ────────────────────────────────────────────────────────────────
    const renderContent = () => {
        switch (currentPage) {

            // ── Dashboard Overview ───────────────────────────────────────────
            case 'dashboard':
                return (
                    <div className="space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                                <p className="text-sm text-slate-500">Centralized platform for Dormly management.</p>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    onClick={fetchStats}
                                    variant="outline"
                                    className="border-slate-200 text-slate-600 hover:bg-slate-50 gap-2"
                                >
                                    <RefreshCw size={16} /> Refresh
                                </Button>
                                <Button className="bg-teal-600 hover:bg-teal-700 text-white gap-2">
                                    <Plus size={18} />
                                    <Link to="/admin/add-property" className="text-white font-semibold">
                                        Add Property
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                            <StatCard label="Total Properties"   value={stats?.properties?.total}       icon={Building2}    bgColor="bg-teal-50"   iconColor="text-teal-600"   sub={`+${stats?.properties?.newThisMonth ?? 0} this month`} />
                            <StatCard label="Available Now"      value={stats?.properties?.available}   icon={CheckCircle}  bgColor="bg-emerald-50" iconColor="text-emerald-600" />
                            <StatCard label="Coming Soon"        value={stats?.properties?.comingSoon}  icon={Clock}        bgColor="bg-amber-50"  iconColor="text-amber-600"  />
                            <StatCard label="Full / Occupied"    value={stats?.properties?.full}        icon={TrendingUp}   bgColor="bg-rose-50"   iconColor="text-rose-600"   />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                            <StatCard label="Total Users"        value={stats?.users?.total}            icon={Users}        bgColor="bg-indigo-50" iconColor="text-indigo-600"  sub={`+${stats?.users?.newThisMonth ?? 0} this month`} />
                            <StatCard label="Students"           value={stats?.users?.students}         icon={GraduationCap} bgColor="bg-sky-50"   iconColor="text-sky-600"    />
                            <StatCard label="Admins"             value={stats?.users?.admins}           icon={Shield}       bgColor="bg-slate-100" iconColor="text-slate-600"  />
                        </div>

                        {/* Recent Listings */}
                        {stats?.recentProperties?.length > 0 && (
                            <Card className="border-slate-200 overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                                    <h2 className="text-base font-bold text-slate-900">Recent Listings</h2>
                                    <button
                                        onClick={() => setCurrentPage('listings')}
                                        className="text-sm text-teal-600 hover:underline"
                                    >
                                        View all →
                                    </button>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {stats.recentProperties.map(p => (
                                        <div key={p._id} className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50 transition-colors">
                                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                                                {p.image
                                                    ? <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                                                    : <Building2 size={20} className="m-auto mt-2.5 text-slate-400" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm text-slate-900 truncate">{p.title}</p>
                                                <p className="text-xs text-slate-500">{p.location}</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="font-bold text-teal-600 text-sm">${p.price}<span className="text-xs font-normal text-slate-400">/mo</span></p>
                                                <StatusBadge status={p.status} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {/* Recent Users */}
                        {stats?.recentUsers?.length > 0 && (
                            <Card className="border-slate-200 overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                                    <h2 className="text-base font-bold text-slate-900">Recent Users</h2>
                                    <button
                                        onClick={() => setCurrentPage('users')}
                                        className="text-sm text-teal-600 hover:underline"
                                    >
                                        View all →
                                    </button>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {stats.recentUsers.map(u => (
                                        <div key={u._id} className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50 transition-colors">
                                            <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm shrink-0">
                                                {u.username?.[0]?.toUpperCase() || '?'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm text-slate-900">{u.username}</p>
                                                <p className="text-xs text-slate-500">{u.email}</p>
                                            </div>
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                                                u.role === 'admin' ? 'bg-indigo-100 text-indigo-700'
                                                : u.role === 'landlord' ? 'bg-amber-100 text-amber-700'
                                                : 'bg-sky-100 text-sky-700'
                                            }`}>{u.role}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}
                    </div>
                );

            // ── Listings Management ──────────────────────────────────────────
            case 'listings':
                return (
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Manage Listings</h1>
                                <p className="text-sm text-slate-500">{listTotal} properties total</p>
                            </div>
                            <Button className="bg-teal-600 hover:bg-teal-700 text-white gap-2">
                                <Plus size={18} />
                                <Link to="/admin/add-property" className="text-white font-semibold">Add Property</Link>
                            </Button>
                        </div>

                        {/* Search + Filter Bar */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by title or location…"
                                    value={listSearch}
                                    onChange={e => { setListSearch(e.target.value); setListPage(1); }}
                                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                />
                            </div>
                            <select
                                value={listStatus}
                                onChange={e => { setListStatus(e.target.value); setListPage(1); }}
                                className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
                            >
                                <option value="">All Statuses</option>
                                <option value="Available Now">Available Now</option>
                                <option value="Coming Soon">Coming Soon</option>
                                <option value="Full">Full</option>
                            </select>
                        </div>

                        <Card className="border-slate-200 overflow-hidden">
                            {loading ? (
                                <div className="p-12 text-center text-slate-400">
                                    <RefreshCw size={24} className="animate-spin mx-auto mb-3" />
                                    Loading properties…
                                </div>
                            ) : properties.length === 0 ? (
                                <div className="p-12 text-center text-slate-400">
                                    <Building2 size={40} className="mx-auto mb-3 opacity-30" />
                                    No properties found.
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50 border-b border-slate-100">
                                                <tr>
                                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Property</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {properties.map(p => (
                                                    <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-11 h-11 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                                                                    {p.image
                                                                        ? <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                                                                        : <Building2 size={18} className="m-auto mt-3 text-slate-400" />}
                                                                </div>
                                                                <div>
                                                                    <p className="font-semibold text-sm text-slate-900">{p.title}</p>
                                                                    <p className="text-xs text-slate-400">{p.type || 'N/A'}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-1.5 text-slate-600">
                                                                <MapPin size={14} className="text-teal-600 shrink-0" />
                                                                <span className="text-sm">{p.location}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="font-bold text-teal-600">${p.price}</span>
                                                            <span className="text-xs text-slate-400">/mo</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <StatusBadge status={p.status} />
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex items-center justify-end gap-1">
                                                                <Link
                                                                    to={`/admin/edit-property/${p._id}`}
                                                                    className="p-2 text-teal-600 hover:bg-teal-50 rounded-full transition-colors"
                                                                    title="Edit"
                                                                >
                                                                    <Edit2 size={16} />
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleDeleteProperty(p._id)}
                                                                    disabled={deletingId === p._id}
                                                                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-full transition-colors disabled:opacity-40"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                                        <p className="text-sm text-slate-500">
                                            Showing <span className="font-semibold text-slate-900">{(listPage - 1) * LIMIT + 1}</span>–
                                            <span className="font-semibold text-slate-900">{Math.min(listPage * LIMIT, listTotal)}</span> of{' '}
                                            <span className="font-semibold text-slate-900">{listTotal}</span>
                                        </p>
                                        <Pagination page={listPage} totalPages={listTotalPages} onPage={setListPage} />
                                    </div>
                                </>
                            )}
                        </Card>
                    </div>
                );

            // ── Users Management ─────────────────────────────────────────────
            case 'users':
                return (
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Manage Users</h1>
                            <p className="text-sm text-slate-500">{userTotal} users registered</p>
                        </div>

                        {/* Search + Filter */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name or email…"
                                    value={userSearch}
                                    onChange={e => { setUserSearch(e.target.value); setUserPage(1); }}
                                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                />
                            </div>
                            <select
                                value={userRole}
                                onChange={e => { setUserRole(e.target.value); setUserPage(1); }}
                                className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
                            >
                                <option value="">All Roles</option>
                                <option value="student">Students</option>
                                <option value="landlord">Landlords</option>
                                <option value="admin">Admins</option>
                            </select>
                        </div>

                        <Card className="border-slate-200 overflow-hidden">
                            {loading ? (
                                <div className="p-12 text-center text-slate-400">
                                    <RefreshCw size={24} className="animate-spin mx-auto mb-3" />
                                    Loading users…
                                </div>
                            ) : users.length === 0 ? (
                                <div className="p-12 text-center text-slate-400">
                                    <Users size={40} className="mx-auto mb-3 opacity-30" />
                                    No users found.
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50 border-b border-slate-100">
                                                <tr>
                                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Joined</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {users.map(u => (
                                                    <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm shrink-0">
                                                                    {u.username?.[0]?.toUpperCase() || '?'}
                                                                </div>
                                                                <p className="font-semibold text-sm text-slate-900">{u.username}</p>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-slate-600">{u.email}</td>
                                                        <td className="px-6 py-4">
                                                            <select
                                                                value={u.role}
                                                                onChange={e => handleRoleChange(u._id, e.target.value)}
                                                                className="text-xs font-semibold px-2 py-1 rounded-full border-0 bg-transparent focus:outline-none focus:ring-2 focus:ring-teal-500/30 cursor-pointer capitalize"
                                                                style={{ color: u.role === 'admin' ? '#4f46e5' : u.role === 'landlord' ? '#d97706' : '#0284c7' }}
                                                            >
                                                                <option value="student">student</option>
                                                                <option value="landlord">landlord</option>
                                                                <option value="admin">admin</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-slate-500">
                                                            {new Date(u.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button
                                                                onClick={() => handleDeleteUser(u._id)}
                                                                disabled={deletingId === u._id || u._id === user?._id}
                                                                className="p-2 text-rose-500 hover:bg-rose-50 rounded-full transition-colors disabled:opacity-30"
                                                                title={u._id === user?._id ? "Can't delete yourself" : "Delete user"}
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                                        <p className="text-sm text-slate-500">
                                            Showing <span className="font-semibold text-slate-900">{(userPage - 1) * LIMIT + 1}</span>–
                                            <span className="font-semibold text-slate-900">{Math.min(userPage * LIMIT, userTotal)}</span> of{' '}
                                            <span className="font-semibold text-slate-900">{userTotal}</span>
                                        </p>
                                        <Pagination page={userPage} totalPages={userTotalPages} onPage={setUserPage} />
                                    </div>
                                </>
                            )}
                        </Card>
                    </div>
                );

            default:
                return null;
        }
    };

    // ─── SIDEBAR + LAYOUT ─────────────────────────────────────────────────────
    const navItems = [
        { key: 'dashboard', label: 'Dashboard',   icon: LayoutDashboard },
        { key: 'listings',  label: 'Listings',     icon: Building2 },
        { key: 'users',     label: 'Users',        icon: Users },
    ];

    return (
        <div className="min-h-screen flex bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col fixed h-full z-20">
                <div className="p-6 flex items-center gap-3 border-b border-slate-100">
                    <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                        <GraduationCap size={22} />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-teal-600">DORMLY</span>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1">
                    {navItems.map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => setCurrentPage(key)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                currentPage === key
                                    ? 'bg-teal-50 text-teal-600 border-r-4 border-teal-600 font-semibold'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-teal-600'
                            }`}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{label}</span>
                        </button>
                    ))}
                    <a
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-teal-600 rounded-lg transition-colors"
                    >
                        <Home size={20} />
                        <span className="font-medium">Back to Site</span>
                    </a>
                </nav>

                <div className="p-4 mt-auto border-t border-slate-100">
                    <div className="flex items-center gap-3 p-2">
                        <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {user?.username?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-semibold truncate">{user?.username || 'Admin'}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-slate-400 hover:text-red-600 transition-colors"
                            title="Logout"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 min-h-screen">
                <div className="p-4 lg:p-8">{renderContent()}</div>
            </main>
        </div>
    );
}
