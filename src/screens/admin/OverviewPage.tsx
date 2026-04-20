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
} from "lucide-react";
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
    setLoading(true);
    try {
      const [clubStats, clubCourts] = await Promise.all([
        clubId ? adminService.getClubStats(clubId) : Promise.resolve(null),
        clubId ? adminService.getClubCourts(clubId) : Promise.resolve([]),
      ]);

      if (clubStats) {
        setStats({
          pendingBookings: clubStats.pendingBookings ?? 0,
          confirmedToday: clubStats.confirmedToday ?? 0,
          totalCourts: clubStats.totalCourts ?? 0,
          availableCourts: clubStats.availableCourts ?? 0,
          maintenanceCourts: clubStats.maintenanceCourts ?? 0,
        });
      }
      setCourts(clubCourts ?? []);
    } catch {
      // Silently fail — show zeroes
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [clubId]);

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
    </div>
  );
}
