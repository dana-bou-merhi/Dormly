import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, MapPin, Edit2, Trash2, RefreshCw, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card } from "@/components/ui/card.jsx";
import axios from "axios";
import Header from "@/components/Header";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
// Simple status badge
function StatusBadge({ status }) {
  const config = {
    "Available Now": "bg-emerald-500 text-white",
    "Coming Soon": "bg-amber-400 text-white",
    Full: "bg-red-500 text-white",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config[status] || "bg-gray-400 text-white"}`}>
      {status}
    </span>
  );
}

export default function LandlordListingsPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listSearch, setListSearch] = useState("");
  const [listStatus, setListStatus] = useState("");
  const [deletingId, setDeletingId] = useState(null);
const [alertOpen, setAlertOpen] = useState(false);
const [selectedId, setSelectedId] = useState(null);

  const API = import.meta.env.VITE_API_URL;

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/properties/landlord/listings`, { withCredentials: true });
      setProperties(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const filtered = properties.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(listSearch.toLowerCase()) ||
      p.location.toLowerCase().includes(listSearch.toLowerCase());
    const matchStatus = listStatus ? p.status === listStatus : true;
    return matchSearch && matchStatus;
  });

  const confirmDeleteProperty = (id) => {
  setSelectedId(id);
  setAlertOpen(true);
};

    const handleDeleteProperty = async (id) => {
    if (!selectedId) return;
    setDeletingId(selectedId);

    try {
        const res = await axios.delete(`${API}/api/properties/${selectedId}`, {
        withCredentials: true,
        });

        if (res.data.success) {
        toast.success("Property deleted.");
        fetchListings(); // refresh the list after deletion
        } else {
        toast.error(res.data.message || "Delete failed.");
        }
    } catch (err) {
        toast.error("Server error.");
        console.error(err);
    } finally {
        setDeletingId(null);
        setSelectedId(null);
        setAlertOpen(false);
    }
    };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 lg:px-10 py-8 space-y-6">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Listings</h1>
            <p className="text-sm text-slate-500">{filtered.length} properties</p>
          </div>

          <Button className="bg-teal-600 hover:bg-teal-700 text-white gap-2">
            <Plus size={18} />
            <Link to="/new-prop" className="text-white font-semibold">Add Property</Link>
          </Button>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title or location…"
              value={listSearch}
              onChange={(e) => setListSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <select
            value={listStatus}
            onChange={(e) => setListStatus(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          >
            <option value="">All Statuses</option>
            <option value="Available Now">Available Now</option>
            <option value="Coming Soon">Coming Soon</option>
            <option value="Full">Full</option>
          </select>
        </div>

        {/* Listings Table */}
        <Card className="border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <RefreshCw size={24} className="animate-spin mx-auto mb-3" />
              Loading properties…
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Building2 size={40} className="mx-auto mb-3 opacity-30" />
              No properties found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Property</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Location</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Price</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-right uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                            {p.image ? <img src={p.image} className="w-full h-full object-cover" /> : <Building2 className="m-auto mt-3 text-slate-400" />}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-slate-900">{p.title}</p>
                            <p className="text-xs text-slate-400">{p.type || "N/A"}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-teal-600" />
                          {p.location}
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
                        <div className="flex justify-end gap-2">
                          <Link to={`/landlord/edit-property/${p._id}`} className="p-2 text-teal-600 hover:bg-teal-50 rounded-full transition-colors">
                            <Edit2 size={16} />
                          </Link>
                          <button    onClick={() => confirmDeleteProperty(p._id)} disabled={deletingId === p._id} className="p-2 text-rose-500 hover:bg-rose-50 rounded-full transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Delete Property</AlertDialogTitle>
                <AlertDialogDescription>
                    Are you sure you want to delete this property? This action cannot be undone.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                    onClick={handleDeleteProperty}
                    className="bg-red-500 hover:bg-red-600 text-white"
                >
                    Delete
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

      </main>
    </div>
  );
}