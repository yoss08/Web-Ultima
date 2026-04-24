import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Grid3X3,
  Calendar,
  RefreshCw,
  Zap,
  CheckCircle,
  Wrench,
  AlertCircle,
  Clock,
  Users,
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  Loader2,
  MapPin,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { supabase } from "../../config/supabase";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { adminService } from "../../services/adminService";
import { useAuth } from "../../services/AuthContext";
import { Link } from "react-router";

interface CourtStatus {
  id: string;
  name: string;
  status: "available" | "occupied" | "maintenance";
  type: string;
}

interface ClubStats {
  pendingBookings: number;
  confirmedToday: number;
  totalCourts: number;
  availableCourts: number;
  maintenanceCourts: number;
}

export function OverviewPage() {
  const { user } = useAuth();
  const clubId = user?.club_id;

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ClubStats>({
    pendingBookings: 0,
    confirmedToday: 0,
    totalCourts: 0,
    availableCourts: 0,
    maintenanceCourts: 0,
  });
  const [courts, setCourts] = useState<CourtStatus[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [actionLoading, setActionLoading] = useState<string | number | null>(null);
  const [peakHoursData] = useState([
    { hour: "08:00", usage: 20 },
    { hour: "10:00", usage: 45 },
    { hour: "12:00", usage: 30 },
    { hour: "14:00", usage: 60 },
    { hour: "16:00", usage: 85 },
    { hour: "18:00", usage: 90 },
    { hour: "20:00", usage: 40 },
  ]);

  const fetchDashboardData = async () => {
    if (!clubId) return;
    setLoading(true);
    try {
      // 1. Fetch Courts
      const { data: clubCourts, error: courtsError } = await supabase
        .from('courts')
        .select('*')
        .eq('club_id', clubId);
      
      if (courtsError) throw courtsError;
      setCourts(clubCourts || []);

      // 2. Fetch Bookings (for pending list and stats)
      const bookingSelect = '*, profiles(full_name), courts(name)';
      let clubBookings = null;
      const { data: clubBookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(bookingSelect)
        .eq('club_id', clubId);

      if (bookingsError) {
        console.warn('Bookings relation select failed, retrying without relations', bookingsError);
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('bookings')
          .select('*')
          .eq('club_id', clubId);
        if (fallbackError) throw fallbackError;
        clubBookings = fallbackData || [];
      } else {
        clubBookings = clubBookingsData || [];
      }

      const pending = (clubBookings || []).filter(b => b.status === 'pending');
      setPendingRequests(pending);

      // 3. Calculate Stats
      const confirmedToday = (clubBookings || []).filter(b => {
        if (b.status !== 'confirmed' && b.status !== 'accepted') return false;
        const today = new Date().toISOString().split('T')[0];
        return b.booking_date === today;
      }).length;

      const available = (clubCourts || []).filter(c => c.status === 'available').length;
      const maintenance = (clubCourts || []).filter(c => c.status === 'maintenance').length;

      setStats({
        pendingBookings: pending.length,
        confirmedToday,
        totalCourts: clubCourts?.length || 0,
        availableCourts: available,
        maintenanceCourts: maintenance,
      });

    } catch (err: any) {
      console.error("Dashboard data error:", err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [clubId]);

  const handleAccept = async (id: string | number) => {
    setActionLoading(id);
    try {
      await adminService.acceptBooking(id);
      toast.success("Booking accepted ✓");
      fetchDashboardData();
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
      fetchDashboardData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  if (!clubId) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertCircle size={48} className="text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold text-foreground font-['Playfair_Display']">
          No Club Assigned
        </h2>
        <p className="text-muted-foreground text-sm mt-2 font-['Poppins']">
          Contact your Super Admin to get your club assigned.
        </p>
      </div>
    );
  }

  const summaryCards = [
    {
      icon: ClipboardCheck,
      label: "Pending Requests",
      value: stats.pendingBookings,
      color: "#f59e0b",
      link: "/dashboard/admin/bookings",
      urgent: stats.pendingBookings > 0,
    },
    {
      icon: Calendar,
      label: "Confirmed Today",
      value: stats.confirmedToday,
      color: "var(--theme-accent)",
      link: "/dashboard/admin/bookings",
      urgent: false,
    },
    {
      icon: Grid3X3,
      label: "Courts Available",
      value: `${stats.availableCourts}/${stats.totalCourts}`,
      color: "#34d399",
      link: "/dashboard/courts",
      urgent: false,
    },
    {
      icon: Wrench,
      label: "In Maintenance",
      value: stats.maintenanceCourts,
      color: "#f87171",
      link: "/dashboard/courts",
      urgent: stats.maintenanceCourts > 0,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Maintenance Banner */}
      {stats.maintenanceCourts > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3"
        >
          <div className="w-9 h-9 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Wrench size={18} className="text-red-500" />
          </div>
          <div>
            <p className="text-red-500 font-bold text-sm font-['Poppins']">Maintenance Alert</p>
            <p className="text-red-500/60 text-xs font-['Poppins']">
              {stats.maintenanceCourts} court{stats.maintenanceCourts > 1 ? "s are" : " is"}{" "}
              currently offline.
            </p>
          </div>
        </motion.div>
      )}

      {/* Pending Booking Banner */}
      {stats.pendingBookings > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-2xl flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <ClipboardCheck size={18} className="text-yellow-500" />
            </div>
            <div>
              <p className="text-yellow-500 font-bold text-sm font-['Poppins']">
                {stats.pendingBookings} pending booking request
                {stats.pendingBookings > 1 ? "s" : ""} await your review
              </p>
            </div>
          </div>
          <Link
            to="/dashboard/admin/bookings"
            className="text-xs font-bold text-yellow-500 underline font-['Poppins'] whitespace-nowrap"
          >
            Review now →
          </Link>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground font-['Playfair_Display']">
            Club Overview
          </h1>
          <p className="text-muted-foreground text-sm mt-1 font-['Poppins']">
            Your club at a glance — courts, bookings & activity.
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="p-3 bg-card border border-border rounded-xl text-foreground hover:bg-muted/80 transition-colors"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {summaryCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <Link
              to={card.link}
              className={`block bg-card p-6 rounded-[28px] border shadow-sm hover:scale-[1.02] transition-all ${
                card.urgent ? "border-yellow-500/30 ring-1 ring-yellow-500/10" : "border-border"
              }`}
            >
              <div
                className="p-3 rounded-2xl w-fit mb-4"
                style={{ backgroundColor: `${card.color}18` }}
              >
                <card.icon size={22} style={{ color: card.color }} />
              </div>
              <h3 className="text-3xl font-bold text-foreground font-['Playfair_Display']">
                {loading ? "..." : card.value}
              </h3>
              <p className="text-sm text-muted-foreground font-medium font-['Poppins'] mt-1">
                {card.label}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Courts Status */}
        <div className="lg:col-span-1 bg-card border border-border rounded-[32px] p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2 font-['Playfair_Display']">
            <Grid3X3 size={18} className="text-accent" /> Court Status
          </h2>

          {courts.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground text-sm font-['Poppins']">
                No courts configured yet.
              </p>
              <Link
                to="/dashboard/courts"
                className="text-xs text-accent font-bold mt-2 block hover:underline font-['Poppins']"
              >
                Add courts →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {courts.map((court) => {
                const statusMap = {
                  available: {
                    icon: CheckCircle,
                    color: "text-emerald-400",
                    bg: "bg-emerald-400/10",
                    label: "Available",
                  },
                  "occupied": {
                    icon: Zap,
                    color: "text-accent",
                    bg: "bg-accent/10",
                    label: "In Use",
                  },
                  maintenance: {
                    icon: Wrench,
                    color: "text-red-400",
                    bg: "bg-red-400/10",
                    label: "Maintenance",
                  },
                };
                const s = statusMap[court.status] ?? statusMap["available"];
                const SIcon = s.icon;
                return (
                  <div
                    key={court.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-border"
                  >
                    <div>
                      <p className="font-bold text-sm text-foreground font-['Poppins']">
                        {court.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-['Poppins']">
                        {court.type}
                      </p>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${s.bg}`}
                    >
                      <SIcon size={12} className={s.color} />
                      <span className={`text-[10px] font-bold ${s.color} font-['Poppins']`}>
                        {s.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Peak Hours Analysis */}
        <div className="lg:col-span-2 bg-card border border-border rounded-[32px] p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-foreground font-['Playfair_Display']">
              Peak Hours Analysis
            </h2>
            <Users className="text-accent" size={18} />
          </div>
          <div className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={peakHoursData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="currentColor"
                  vertical={false}
                  opacity={0.1}
                  className="text-muted-foreground"
                />
                <XAxis
                  dataKey="hour"
                  stroke="currentColor"
                  className="text-muted-foreground/50"
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  stroke="currentColor"
                  className="text-muted-foreground/50"
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--theme-card)",
                    border: "1px solid var(--theme-border)",
                    borderRadius: "12px",
                    color: "var(--theme-foreground)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="usage"
                  stroke="var(--theme-accent)"
                  strokeWidth={3}
                  dot={{ fill: "var(--theme-accent)", stroke: "var(--theme-accent)", r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Pending Actions Section */}
      <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground font-['Playfair_Display'] flex items-center gap-2">
            <ClipboardCheck size={24} className="text-yellow-500" />
            Pending Booking Requests
          </h2>
          <Link 
            to="/dashboard/admin/bookings" 
            className="text-xs font-bold text-accent uppercase tracking-widest hover:underline"
          >
            Manage All
          </Link>
        </div>

        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-accent w-10 h-10 mb-4" />
            <p className="text-muted-foreground font-medium font-['Poppins']">Loading requests...</p>
          </div>
        ) : pendingRequests.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-16 h-16 bg-emerald-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-emerald-400" />
            </div>
            <p className="text-muted-foreground font-medium font-['Poppins']">All caught up! No pending requests.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="px-8 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-['Poppins']">Player</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-['Poppins']">Court</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-['Poppins']">Time</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-['Poppins'] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {pendingRequests.slice(0, 5).map((req) => (
                  <tr key={req.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
                          {req.profiles?.full_name?.[0] || 'U'}
                        </div>
                        <span className="font-bold text-foreground font-['Poppins']">{req.profiles?.full_name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-muted-foreground font-['Poppins']">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-accent" />
                        {req.courts?.name || '—'}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm text-foreground font-semibold font-['Poppins']">
                        {req.booking_date}
                      </div>
                      <div className="text-xs text-muted-foreground font-['Poppins']">
                        {req.time_slot}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => handleAccept(req.id)}
                          disabled={actionLoading === req.id}
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-400/10 text-emerald-400 rounded-xl hover:bg-emerald-400 hover:text-white transition-all text-xs font-bold font-['Poppins'] disabled:opacity-50"
                        >
                          {actionLoading === req.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                          Accept
                        </button>
                        <button 
                          onClick={() => handleReject(req.id)}
                          disabled={actionLoading === req.id}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all text-xs font-bold font-['Poppins'] disabled:opacity-50"
                        >
                          <XCircle size={16} />
                          Decline
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
    </div>
  );
}
