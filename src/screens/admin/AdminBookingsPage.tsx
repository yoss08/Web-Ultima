import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  MapPin,
  Search,
  Filter,
  Zap,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { supabase } from "../../config/supabase";
import { adminService } from "../../services/adminService";
import { useAuth } from "../../services/AuthContext";
import { toast } from "react-hot-toast";

interface Booking {
  id: string | number;
  player_id: string;
  court_id: string | number;
  start_time: string;
  end_time: string;
  status: "pending" | "accepted" | "declined" | "confirmed" | "cancelled";
  profiles?: { full_name: string };
  courts?: { name: string };
  match?: Match | null;
}

interface Match {
  id: string | number;
  booking_id: string | number;
  status: string;
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-500",
    accepted: "bg-emerald-500",
    confirmed: "bg-emerald-500",
    declined: "bg-red-500",
    cancelled: "bg-red-500",
  };
  return (
    <div className={`w-2.5 h-2.5 rounded-full ${colors[status] || "bg-gray-400"} ring-2 ring-background`} />
  );
}

const STATUS_TABS = ["all", "pending", "confirmed", "declined", "cancelled"] as const;

// 'confirmed' and 'accepted' are the same — normalize for display
function normalizeStatus(status: string) {
  if (status === "accepted") return "confirmed";
  if (status === "declined") return "declined";
  return status;
}

export function AdminBookingsPage() {
  const { user } = useAuth();
  const clubId = user?.club_id;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("pending");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const fetchBookings = async () => {
    if (!clubId) return;
    try {
      setLoading(true);
      
      // Fetch bookings from Supabase
      const { data, error } = await supabase
        .from('bookings')
        .select('*, profiles(full_name), courts(name)')
        .eq('club_id', clubId);
      
      if (error) throw error;

      // Transform data (same as backend does)
      const transformedData = (data || []).map(booking => {
        if (booking.booking_date && booking.time_slot) {
          const [start, end] = booking.time_slot.split(' - ');
          return {
            ...booking,
            start_time: `${booking.booking_date}T${start}:00`,
            end_time: `${booking.booking_date}T${end}:00`
          };
        }
        return booking;
      });

      setBookings(transformedData);

      // Fetch matches from Supabase
      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select('*')
        .eq('club_id', clubId);

      if (matchesError) throw matchesError;
      setMatches(matchesData || []);

    } catch (error: any) {
      toast.error("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  // Link matches to bookings
  useEffect(() => {
    if (matches.length && bookings.length) {
      setBookings((prev) =>
        prev.map((b) => ({
          ...b,
          match: matches.find((m) => String(m.booking_id) === String(b.id)) || null,
        }))
      );
    }
    // eslint-disable-next-line
  }, [matches]);
  // Start match from booking
  const handleStartMatch = async (booking: Booking) => {
    try {
      setActionLoading(booking.id);
      await adminService.createMatch({
        booking_id: booking.id,
        player1_id: booking.player_id,
        court_id: booking.court_id,
        status: 'live',
        start_time: booking.start_time,
        end_time: booking.end_time,
      });
      toast.success("Match started!");
      fetchBookings();
    } catch (error: any) {
      toast.error("Could not start match");
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [clubId]);

  const handleAccept = async (id: string | number) => {
    setActionLoading(id);
    try {
      await adminService.acceptBooking(id);
      toast.success("Booking accepted ✓");
      fetchBookings();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string | number) => {
    setActionLoading(id);
    try {
      await adminService.rejectBooking(id);
      toast.success("Booking rejected");
      fetchBookings();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.courts?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const normalized = normalizeStatus(b.status);
    const matchesTab = activeTab === "all" || normalized === activeTab;
    return matchesSearch && matchesTab;
  });

  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const nextPendingBooking = bookings.find((b) => b.status === "pending") || null;
  const nextPendingLoading = nextPendingBooking ? actionLoading === nextPendingBooking.id : false;
  const tabCount = (tab: string) =>
    tab === "all"
      ? bookings.length
      : bookings.filter((b) => normalizeStatus(b.status) === tab).length;

  if (!clubId) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertCircle size={48} className="text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold text-foreground font-['Playfair_Display']">
          No Club Assigned
        </h2>
        <p className="text-muted-foreground text-sm mt-2 font-['Poppins']">
          Your account is not assigned to a club yet. Please contact your Super Admin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground font-['Playfair_Display']">
            Booking Requests
          </h1>
          <p className="text-muted-foreground text-sm font-['Poppins'] mt-1">
            Accept or reject player booking requests for your club.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {pendingCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              <span className="text-sm font-bold text-yellow-500 font-['Poppins']">
                {pendingCount} pending
              </span>
            </div>
          )}
          <button
            onClick={fetchBookings}
            className="p-3 bg-card border border-border rounded-xl text-foreground hover:bg-muted/80 transition-all"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Status Tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-xl">
          {STATUS_TABS.map((tab) => {
            const count = tabCount(tab);
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all font-['Poppins'] capitalize ${
                  activeTab === tab
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      tab === "pending"
                        ? "bg-yellow-500/20 text-yellow-500"
                        : "bg-muted-foreground/20 text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by player or court..."
            className="w-full h-11 pl-11 pr-4 bg-card border border-border rounded-xl text-foreground outline-none focus:border-accent transition-all font-['Poppins'] text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {pendingCount > 0 && nextPendingBooking && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-[32px] p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-yellow-700 font-bold font-['Poppins']">
                Pending booking summary
              </p>
              <h2 className="text-xl font-bold text-foreground mt-2 font-['Playfair_Display']">
                {pendingCount} request{pendingCount > 1 ? "s" : ""} waiting for review
              </h2>
              <p className="text-sm text-muted-foreground mt-2 font-['Poppins']">
                Review the next pending booking request and decide whether to accept or decline it directly from the requests page.
              </p>
            </div>
            <div className="rounded-3xl bg-card border border-border p-4 w-full lg:w-auto">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-bold font-['Poppins']">
                Next Request
              </p>
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold font-['Poppins']">Player</p>
                  <p className="font-bold text-foreground font-['Poppins']">{nextPendingBooking.profiles?.full_name || "Unknown"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold font-['Poppins']">Court</p>
                  <p className="font-bold text-foreground font-['Poppins']">{nextPendingBooking.courts?.name || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold font-['Poppins']">Schedule</p>
                  <p className="font-bold text-foreground font-['Poppins']">
                    {nextPendingBooking.booking_date || "—"} • {nextPendingBooking.time_slot || "—"}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleAccept(nextPendingBooking.id)}
                  disabled={nextPendingLoading}
                  className={`flex-1 px-4 py-3 rounded-2xl transition-all font-bold font-['Poppins'] ${nextPendingLoading ? 'opacity-50 cursor-not-allowed bg-emerald-400/10 text-emerald-400' : 'bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400 hover:text-white'}`}
                >
                  {nextPendingLoading ? 'Processing…' : 'Accept'}
                </button>
                <button
                  onClick={() => handleReject(nextPendingBooking.id)}
                  disabled={nextPendingLoading}
                  className={`flex-1 px-4 py-3 rounded-2xl transition-all font-bold font-['Poppins'] ${nextPendingLoading ? 'opacity-50 cursor-not-allowed bg-red-500/10 text-red-500' : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'}`}
                >
                  {nextPendingLoading ? 'Processing…' : 'Decline'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bookings List */}
      <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center font-['Poppins']">
            <Loader2 className="animate-spin text-accent w-10 h-10 mb-4" />
            <p className="text-muted-foreground font-medium">Loading bookings...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-20 text-center font-['Poppins']">
            <CalendarIcon size={44} className="text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">
              {activeTab === "pending"
                ? "No pending booking requests. 🎉"
                : "No bookings found for this filter."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  {["Player", "Court", "Schedule", "Status", "Actions"].map((h, i) => (
                    <th
                      key={h}
                      className={`px-6 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-['Poppins'] ${
                        i === 4 ? "text-right" : ""
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map((booking) => {
                  const isPending = booking.status === "pending";
                  const isActing = actionLoading === booking.id;
                  return (
                    <tr key={booking.id} className="group hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm">
                            {booking.profiles?.full_name?.[0] ?? <User size={16} />}
                          </div>
                           <span className="font-bold text-foreground text-sm font-['Poppins'] hover:text-accent cursor-pointer" onClick={() => setSelectedBooking(booking)}>
                            {booking.profiles?.full_name ?? "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-['Poppins']">
                          <MapPin size={14} className="text-accent" />
                          {booking.courts?.name ?? "—"}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-1 font-['Poppins']">
                          <div className="flex items-center gap-2 text-sm text-foreground font-semibold whitespace-nowrap">
                            <CalendarIcon size={13} className="text-muted-foreground/60" />
                            {new Date(booking.start_time).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock size={12} />
                            {new Date(booking.start_time).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            –{" "}
                            {new Date(booking.end_time).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </td>
                       <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <StatusDot status={booking.status} />
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                              normalizeStatus(booking.status) === "confirmed"
                                ? "bg-emerald-400/10 text-emerald-400"
                                : normalizeStatus(booking.status) === "cancelled" || normalizeStatus(booking.status) === "declined"
                                ? "bg-red-500/10 text-red-500"
                                : "bg-yellow-500/10 text-yellow-500"
                            }`}
                          >
                             {normalizeStatus(booking.status) === "confirmed" ? "Accepted" : normalizeStatus(booking.status) === "cancelled" ? "Declined" : booking.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        {isPending && (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleAccept(booking.id)}
                              disabled={isActing}
                              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-400/10 text-emerald-400 rounded-xl hover:bg-emerald-400 hover:text-white transition-all text-xs font-bold font-['Poppins'] disabled:opacity-50"
                            >
                              {isActing ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <CheckCircle2 size={14} />
                              )}
                              Accept
                            </button>
                            <button
                              onClick={() => handleReject(booking.id)}
                              disabled={isActing}
                              className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all text-xs font-bold font-['Poppins'] disabled:opacity-50"
                            >
                              <XCircle size={14} />
                              Reject
                            </button>
                          </div>
                        )}
                        {(booking.status === "confirmed" || booking.status === "accepted") && (
                          <div className="flex justify-end gap-2">
                            {booking.match ? (
                              <span className="px-3 py-2 bg-blue-400/10 text-blue-400 rounded-xl text-xs font-bold font-['Poppins']">Match started</span>
                            ) : (
                              <button
                                onClick={() => handleStartMatch(booking)}
                                disabled={isActing}
                                className="flex items-center gap-1.5 px-3 py-2 bg-blue-400/10 text-blue-400 rounded-xl hover:bg-blue-400 hover:text-white transition-all text-xs font-bold font-['Poppins'] disabled:opacity-50"
                              >
                                {isActing ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                                Start Match
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Summary Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border w-full max-w-md rounded-[32px] p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-accent" />
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground font-['Playfair_Display']">Booking Summary</h2>
                <button onClick={() => setSelectedBooking(null)} className="text-muted-foreground hover:text-foreground">
                  <XCircle size={24} />
                </button>
              </div>
              
              <div className="space-y-6 font-['Poppins']">
                <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl border border-border">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
                    {selectedBooking.profiles?.full_name?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Player</p>
                    <p className="font-bold text-foreground">{selectedBooking.profiles?.full_name || 'Unknown'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/30 rounded-2xl border border-border">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Court</p>
                    <div className="flex items-center gap-2 text-foreground font-bold">
                      <MapPin size={14} className="text-accent" />
                      {selectedBooking.courts?.name}
                    </div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-2xl border border-border">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Status</p>
                    <div className="flex items-center gap-2 text-foreground font-bold capitalize">
                      <StatusDot status={selectedBooking.status} />
                      {selectedBooking.status}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted/30 rounded-2xl border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarIcon size={14} /> Date
                    </div>
                    <p className="font-bold text-foreground">{new Date(selectedBooking.start_time).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock size={14} /> Time Slot
                    </div>
                    <p className="font-bold text-foreground">
                      {new Date(selectedBooking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(selectedBooking.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  {selectedBooking.status === 'pending' ? (
                    <div className="flex gap-3">
                      <button 
                        onClick={() => { handleAccept(selectedBooking.id); setSelectedBooking(null); }}
                        className="flex-1 py-4 bg-accent text-accent-foreground rounded-2xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={18} /> Accept
                      </button>
                      <button 
                        onClick={() => { handleReject(selectedBooking.id); setSelectedBooking(null); }}
                        className="flex-1 py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        <XCircle size={18} /> Decline
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setSelectedBooking(null)}
                      className="w-full py-4 bg-muted text-foreground rounded-2xl font-bold hover:bg-muted/80 transition-all"
                    >
                      Close Summary
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
