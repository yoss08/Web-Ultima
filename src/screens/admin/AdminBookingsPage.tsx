import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  MapPin,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { adminService } from "../../services/adminService";
import { useAuth } from "../../services/AuthContext";
import { toast } from "react-hot-toast";

interface Booking {
  id: string | number;
  player_id: string;
  court_id: string | number;
  start_time: string;
  end_time: string;
  status: "pending" | "confirmed" | "cancelled";
  profiles?: { full_name: string };
  courts?: { name: string };
  match?: Match | null;
}

interface Match {
  id: string | number;
  booking_id: string | number;
  status: string;
}

const STATUS_TABS = ["all", "pending", "confirmed", "cancelled"] as const;

export function AdminBookingsPage() {
  const { user } = useAuth();
  const clubId = user?.club_id;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<(typeof STATUS_TABS)[number]>("pending");

  const fetchBookings = async () => {
    if (!clubId) return;
    try {
      setLoading(true);
      const data = await adminService.getClubBookings(clubId);
      setBookings(data ?? []);
      // Fetch matches and link to bookings
      const matchesData = await adminService.getClubMatches(clubId);
      setMatches(matchesData ?? []);
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
    const matchesTab = activeTab === "all" || b.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const pendingCount = bookings.filter((b) => b.status === "pending").length;

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
            const count = tab === "all" ? bookings.length : bookings.filter((b) => b.status === tab).length;
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
                          <span className="font-bold text-foreground text-sm font-['Poppins']">
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
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                            booking.status === "confirmed"
                              ? "bg-emerald-400/10 text-emerald-400"
                              : booking.status === "cancelled"
                              ? "bg-red-500/10 text-red-500"
                              : "bg-yellow-500/10 text-yellow-500"
                          }`}
                        >
                          {booking.status}
                        </span>
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
                        {booking.status === "confirmed" && (
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
    </div>
  );
}
