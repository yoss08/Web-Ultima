import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Users,
  CalendarCheck,
  ShieldCheck,
  TrendingUp,
  Crown,
  RefreshCw,
  ArrowRight,
  Zap,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router";
import { superAdminService } from "../../services/superAdminService";
import { toast } from "react-hot-toast";

interface PlatformStats {
  totalClubs: number;
  totalUsers: number;
  totalBookings: number;
  activeAdmins: number;
  pendingBookings: number;
  totalCoaches: number;
}

export function SuperAdminDashboard() {
  const [stats, setStats] = useState<PlatformStats>({
    totalClubs: 0,
    totalUsers: 0,
    totalBookings: 0,
    activeAdmins: 0,
    pendingBookings: 0,
    totalCoaches: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await superAdminService.getPlatformStats();
      setStats(data);
    } catch {
      // Graceful fallback — stats remain 0
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    {
      icon: Building2,
      label: "Total Clubs",
      value: stats.totalClubs,
      color: "var(--theme-accent)",
      link: "/dashboard/superadmin/clubs",
      desc: "Active clubs on platform",
    },
    {
      icon: Users,
      label: "Total Users",
      value: stats.totalUsers,
      color: "#818cf8",
      link: "/dashboard/superadmin/users",
      desc: "Players, coaches & admins",
    },
    {
      icon: CalendarCheck,
      label: "Total Bookings",
      value: stats.totalBookings,
      color: "#34d399",
      link: "/dashboard/superadmin/bookings",
      desc: "Across all clubs",
    },
    {
      icon: ShieldCheck,
      label: "Active Admins",
      value: stats.activeAdmins,
      color: "#f59e0b",
      link: "/dashboard/superadmin/admins",
      desc: "Business owners",
    },
  ];

  const quickActions = [
    {
      icon: UserPlus,
      label: "Create Admin Account",
      desc: "Assign a business owner to a club",
      link: "/dashboard/superadmin/admins",
      accent: true,
    },
    {
      icon: Building2,
      label: "Add New Club",
      desc: "Register a club on the platform",
      link: "/dashboard/superadmin/clubs",
      accent: false,
    },
    {
      icon: Zap,
      label: "Manage Matches",
      desc: "Start live matches & competitions",
      link: "/dashboard/superadmin/matches",
      accent: false,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-accent/10 border border-accent/20">
            <Crown size={28} className="text-accent" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground font-['Playfair_Display']">
              Super Admin
            </h1>
            <p className="text-muted-foreground text-sm font-['Poppins'] mt-1">
              Full platform control — clubs, users, bookings & competitions.
            </p>
          </div>
        </div>
        <button
          onClick={fetchStats}
          className="p-3 bg-card border border-border rounded-xl text-foreground hover:bg-muted/80 transition-all self-start"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link
              to={card.link}
              className="block bg-card border border-border rounded-[28px] p-6 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className="p-3 rounded-2xl"
                  style={{ backgroundColor: `${card.color}18` }}
                >
                  <card.icon size={22} style={{ color: card.color }} />
                </div>
                <ArrowRight
                  size={16}
                  className="text-muted-foreground/40 group-hover:text-accent group-hover:translate-x-1 transition-all"
                />
              </div>
              <p className="text-3xl font-bold text-foreground font-['Playfair_Display']">
                {loading ? (
                  <span className="inline-block w-10 h-7 bg-muted rounded animate-pulse" />
                ) : (
                  card.value
                )}
              </p>
              <p className="text-sm font-bold text-foreground mt-1 font-['Poppins']">
                {card.label}
              </p>
              <p className="text-xs text-muted-foreground font-['Poppins'] mt-0.5">
                {card.desc}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions + Pending Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-card border border-border rounded-[32px] p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-6 font-['Playfair_Display']">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.link}
                className={`p-5 rounded-[20px] border transition-all group hover:scale-[1.02] ${
                  action.accent
                    ? "bg-accent text-accent-foreground border-accent shadow-lg shadow-accent/20 hover:shadow-accent/30"
                    : "bg-muted/40 border-border hover:border-accent/30 hover:bg-muted"
                }`}
              >
                <action.icon
                  size={22}
                  className={`mb-3 ${action.accent ? "text-accent-foreground" : "text-accent"}`}
                />
                <p
                  className={`text-sm font-bold leading-tight font-['Poppins'] ${
                    action.accent ? "text-accent-foreground" : "text-foreground"
                  }`}
                >
                  {action.label}
                </p>
                <p
                  className={`text-xs mt-1 font-['Poppins'] ${
                    action.accent ? "text-accent-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {action.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Pending Bookings Alert */}
        <div className="bg-card border border-border rounded-[32px] p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest font-['Poppins']">
                Pending
              </h2>
            </div>
            <p className="text-5xl font-bold text-foreground font-['Playfair_Display'] mt-2">
              {loading ? (
                <span className="inline-block w-12 h-10 bg-muted rounded animate-pulse" />
              ) : (
                stats.pendingBookings
              )}
            </p>
            <p className="text-sm text-muted-foreground font-['Poppins'] mt-1">
              Booking requests awaiting admin review across all clubs
            </p>
          </div>
          <Link
            to="/dashboard/superadmin/bookings"
            className="mt-6 flex items-center gap-2 text-sm font-bold text-accent hover:underline font-['Poppins']"
          >
            View all bookings <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Platform Overview Table */}
      <div className="bg-card border border-border rounded-[32px] p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground font-['Playfair_Display']">
            Role Distribution
          </h2>
          <Link
            to="/dashboard/superadmin/users"
            className="text-sm font-bold text-accent hover:underline font-['Poppins']"
          >
            Manage all users →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Players", value: stats.totalUsers, color: "#34d399" },
            { label: "Coaches", value: stats.totalCoaches, color: "#818cf8" },
            { label: "Admins", value: stats.activeAdmins, color: "#f59e0b" },
            { label: "Clubs", value: stats.totalClubs, color: "var(--theme-accent)" },
          ].map((item) => (
            <div
              key={item.label}
              className="p-4 rounded-2xl bg-muted/40 border border-border text-center"
            >
              <p
                className="text-2xl font-bold font-['Playfair_Display']"
                style={{ color: item.color }}
              >
                {loading ? "—" : item.value}
              </p>
              <p className="text-xs text-muted-foreground font-['Poppins'] mt-1 font-medium uppercase tracking-wider">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
