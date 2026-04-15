import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  MapPin, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw
} from "lucide-react";
import { toast } from "react-hot-toast";

interface Booking {
  id: string | number;
  player_id: string;
  court_id: string | number;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  profiles?: { full_name: string };
  courts?: { name: string };
}

export function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/bookings');
      if (!response.ok) throw new Error("Failed to fetch bookings");
      const data = await response.json();
      setBookings(data || []);
    } catch (error: any) {
      toast.error("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id: string | number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) throw new Error("Update failed");
      toast.success(`Booking ${newStatus}`);
      fetchBookings();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const deleteBooking = async (id: string | number) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error("Cancellation failed");
      toast.success("Booking cancelled");
      fetchBookings();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.profiles?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.courts?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold dark:text-white font-['Playfair_Display']">Bookings Management</h1>
          <p className="text-gray-500 text-sm">Overview of all court reservations and schedules.</p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={fetchBookings}
            className="p-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl dark:text-white hover:bg-gray-50 transition-all"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 bg-[#00E5FF] text-black font-bold rounded-xl hover:scale-105 transition-transform"
          >
            <Plus size={20} /> New Booking
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text"
            placeholder="Search by player or court..."
            className="w-full h-12 pl-12 pr-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl dark:text-white outline-none focus:border-[#00E5FF] transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl dark:text-white font-semibold">
          <Filter size={18} /> Filters
        </button>
      </div>

      {/* Bookings Table/List */}
      <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[32px] overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-[#39FF14] w-10 h-10 mb-4" />
            <p className="text-gray-500 font-medium">Synchronizing reservations...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-20 text-center">
            <p className="text-gray-500 italic">No bookings found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10">
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Player</th>
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Court</th>
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Schedule</th>
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="group hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 sm:px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold">
                          {booking.profiles?.full_name?.[0] || <User size={18} />}
                        </div>
                        <span className="font-bold dark:text-white truncate max-w-[100px] sm:max-w-none">{booking.profiles?.full_name || "Unknown"}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-8 py-6">
                      <div className="flex items-center gap-2 dark:text-gray-300">
                        <MapPin size={16} className="text-[#39FF14]" />
                        <span className="font-medium">{booking.courts?.name || "Unassigned"}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm dark:text-white font-semibold whitespace-nowrap">
                          <CalendarIcon size={14} className="text-gray-400" />
                          {new Date(booking.start_time).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 whitespace-nowrap">
                          <Clock size={14} />
                          {new Date(booking.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                          {new Date(booking.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                        booking.status === 'confirmed' ? 'bg-[#00E5FF]/10 text-[#00E5FF]' :
                        booking.status === 'cancelled' ? 'bg-red-500/10 text-red-500' :
                        'bg-yellow-500/10 text-yellow-500'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {booking.status !== 'confirmed' && (
                          <button 
                            onClick={() => handleStatusChange(booking.id, 'confirmed')}
                            className="p-2 bg-[#00E5FF]/10 rounded-lg hover:bg-[#00E5FF] group/btn transition-all"
                            title="Confirm"
                          >
                            <CheckCircle2 size={18} className="text-[#39FF14] group-hover/btn:text-black" />
                          </button>
                        )}
                        <button 
                          onClick={() => deleteBooking(booking.id)}
                          className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                          title="Cancel"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal Placeholder */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-[#0A0E1A] border border-gray-100 dark:border-white/10 w-full max-w-lg rounded-[32px] p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold dark:text-white">New Booking Override</h2>
                <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-white">
                  <XCircle size={24} />
                </button>
              </div>

              <div className="space-y-6">
                 <p className="text-gray-500 text-sm">This form would allow admins to manually insert bookings into the schedule, bypassing credit checks if necessary.</p>
                 {/* Simplified form for now */}
                 <div className="p-10 border-2 border-dashed border-gray-100 dark:border-white/10 rounded-2xl text-center">
                    <p className="text-gray-400">Booking Creation Form UI</p>
                    <button className="mt-4 px-6 py-2 bg-[#00E5FF] text-black font-bold rounded-xl" onClick={() => setShowAddModal(false)}>
                      Close Preview
                    </button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
