import { Home, Calendar, Armchair } from 'lucide-react';

export default function PropertyInfoCard({ type, status, furnishing }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="border border-gray-200 rounded-xl p-6 flex items-center gap-4 bg-white hover:shadow-md transition">
        <Home size={24} className="text-teal-600" />
        <div>
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wide">Type</p>
          <p className="font-semibold text-gray-900 mt-1">{type}</p>
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl p-6 flex items-center gap-4 bg-white hover:shadow-md transition">
        <Calendar size={24} className="text-teal-600" />
        <div>
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wide">Status</p>
          <p className="font-semibold text-green-600 mt-1">{status}</p>
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl p-6 flex items-center gap-4 bg-white hover:shadow-md transition">
        <Armchair size={24} className="text-teal-600" />
        <div>
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wide">Furnishing</p>
          <p className="font-semibold text-gray-900 mt-1">{furnishing}</p>
        </div>
      </div>
    </div>
  );
}