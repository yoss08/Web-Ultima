import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Download,
  BarChart3,
  Loader2,
  PieChart as PieChartIcon,
  FileSpreadsheet,
  CalendarDays,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useTheme } from "../../styles/useTheme";
import { supabase } from "../../config/supabase";
import { useAuth } from "../../services/AuthContext";

// ─── CSV export utility ──────────────────────────────────────────
function downloadCSV(data: Record<string, any>[], filename: string) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((h) => {
          const val = row[h];
          return typeof val === "string" && val.includes(",")
            ? `"${val}"`
            : (val ?? "");
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

// ─── Period options ──────────────────────────────────────────────
const PERIODS = [
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
  { label: "365 days", days: 365 },
];

const ROLE_COLORS: Record<string, string> = {
  player: "var(--theme-accent)",
  admin: "#f59e0b",
  coach: "#818cf8",
  super_admin: "#f43f5e",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#34d399",
  cancelled: "#f87171",
};

// ─── Main component ──────────────────────────────────────────────
export function AnalyticsPage() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const role = (
    user?.role ??
    user?.user_metadata?.account_type ??
    user?.user_metadata?.accountType ??
    "admin"
  ).toLowerCase();

  const [periodDays, setPeriodDays] = useState(90);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const [monthlyActivity, setMonthlyActivity] = useState<
    { month: string; bookings: number }[]
  >([]);
  const [courtUsage, setCourtUsage] = useState<
    { name: string; bookings: number }[]
  >([]);
  const [memberSegments, setMemberSegments] = useState<
    { name: string; value: number }[]
  >([]);
  const [statusDist, setStatusDist] = useState<
    { status: string; count: number }[]
  >([]);
  const [summaryStats, setSummaryStats] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    totalMembers: 0,
  });

  // ── Fetch all analytics data ─────────────────────────────────
  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const since = new Date(
        Date.now() - periodDays * 24 * 60 * 60 * 1000
      ).toISOString();

      // Build club filter for non-super-admins
      const isSuperAdmin = role === "super_admin";
      const clubId = user?.club_id;

      // ── 1. All bookings in period ────────────────────────────
      let bookingsQuery = supabase
        .from("bookings")
        .select("id, booking_date, status, court_id, courts(name)")
        .gte("booking_date", since.split("T")[0]);

      if (!isSuperAdmin && clubId) {
        bookingsQuery = bookingsQuery.eq("club_id", clubId);
      }

      const { data: bookingsRaw } = await bookingsQuery;
      const bookings = bookingsRaw ?? [];

      // ── 2. Monthly activity ──────────────────────────────────
      const monthMap: Record<string, number> = {};
      bookings.forEach((b) => {
        if (!b.booking_date) return;
        const d = new Date(b.booking_date);
        const key = d.toLocaleString("default", {
          month: "short",
          year: "2-digit",
        });
        monthMap[key] = (monthMap[key] ?? 0) + 1;
      });

      // Sort chronologically
      const sortedMonths = Object.entries(monthMap)
        .map(([month, bookings]) => ({ month, bookings }))
        .sort((a, b) => {
          const [ma, ya] = a.month.split(" ");
          const [mb, yb] = b.month.split(" ");
          return (
            new Date(`${ma} 20${ya}`).getTime() -
            new Date(`${mb} 20${yb}`).getTime()
          );
        });
      setMonthlyActivity(sortedMonths);

      // ── 3. Court usage ───────────────────────────────────────
      const courtMap: Record<string, number> = {};
      bookings.forEach((b) => {
        const name =
          (Array.isArray(b.courts) ? b.courts[0] : b.courts)?.name ??
          `Court ${b.court_id}`;
        courtMap[name] = (courtMap[name] ?? 0) + 1;
      });

      const courtData = Object.entries(courtMap)
        .map(([name, bookings]) => ({ name, bookings }))
        .sort((a, b) => b.bookings - a.bookings)
        .slice(0, 8);
      setCourtUsage(courtData);

      // ── 4. Status distribution ───────────────────────────────
      const statMap: Record<string, number> = {};
      bookings.forEach((b) => {
        const s = b.status ?? "unknown";
        statMap[s] = (statMap[s] ?? 0) + 1;
      });

      setStatusDist(
        Object.entries(statMap).map(([status, count]) => ({ status, count }))
      );

      // ── 5. Summary stats ─────────────────────────────────────
      setSummaryStats({
        totalBookings: bookings.length,
        confirmedBookings: bookings.filter((b) => b.status === "confirmed")
          .length,
        cancelledBookings: bookings.filter((b) => b.status === "cancelled")
          .length,
        totalMembers: 0, // filled below
      });

      // ── 6. Member segments ───────────────────────────────────
      let profilesQuery = supabase
        .from("profiles")
        .select("id, role");

      if (!isSuperAdmin && clubId) {
        profilesQuery = profilesQuery.eq("club_id", clubId);
      }

      const { data: profilesRaw } = await profilesQuery;
      const profiles = profilesRaw ?? [];

      const roleMap: Record<string, number> = {};
      profiles.forEach((p) => {
        const r = p.role ?? "player";
        roleMap[r] = (roleMap[r] ?? 0) + 1;
      });

      setMemberSegments(
        Object.entries(roleMap).map(([name, value]) => ({ name, value }))
      );

      setSummaryStats((prev) => ({ ...prev, totalMembers: profiles.length }));
    } catch (err) {
      console.error("Analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [periodDays, role, user?.club_id]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // ── CSV Exports ──────────────────────────────────────────────
  const handleExportCSV = async (type: string) => {
    setExporting(true);
    try {
      if (type === "bookings") {
        const { data } = await supabase
          .from("bookings")
          .select(
            "id, user_id, court_id, booking_date, time_slot, status, created_at"
          );
        if (data) downloadCSV(data, "bookings_report");
      } else if (type === "players") {
        const { data } = await supabase
          .from("profiles")
          .select("id, full_name, phone, role, created_at");
        if (data) downloadCSV(data, "players_report");
      } else if (type === "courts") {
        const { data } = await supabase
          .from("courts")
          .select("id, name, type, status, surface, capacity");
        if (data) downloadCSV(data, "courts_report");
      }
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(false);
    }
  };

  // ── Chart theme helpers ──────────────────────────────────────
  const tooltipStyle = {
    backgroundColor: "var(--theme-card)",
    border: "1px solid var(--theme-border)",
    borderRadius: "12px",
    color: "var(--theme-foreground)",
    fontFamily: "Poppins, sans-serif",
    fontSize: "12px",
  };

  const axisColor = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.25)";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground font-['Playfair_Display']">
            Analytics &amp; Reports
          </h1>
          <p className="text-muted-foreground text-sm font-['Poppins'] mt-1">
            Platform-wide performance insights and data exports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Period filter */}
          <div className="flex items-center gap-1 bg-card border border-border rounded-2xl p-1">
            {PERIODS.map((p) => (
              <button
                key={p.days}
                onClick={() => setPeriodDays(p.days)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all font-['Poppins'] ${
                  periodDays === p.days
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Refresh */}
          <button
            onClick={fetchAnalytics}
            className="p-2.5 bg-card border border-border rounded-xl text-foreground hover:bg-muted/80 transition-all"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>

          {/* Export dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-accent text-accent-foreground rounded-xl text-sm font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-accent/20 font-['Poppins']">
              {exporting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Download size={16} />
              )}
              Export
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
              {[
                { key: "bookings", label: "Bookings CSV" },
                { key: "players", label: "Players CSV" },
                { key: "courts", label: "Courts CSV" },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleExportCSV(item.key)}
                  className="w-full text-left px-4 py-3 text-sm font-bold hover:bg-muted flex items-center gap-2 text-foreground font-['Poppins']"
                >
                  <FileSpreadsheet size={14} className="text-accent" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: CalendarDays,
            label: "Total Bookings",
            value: summaryStats.totalBookings,
            color: "var(--theme-accent)",
          },
          {
            icon: CheckCircle2,
            label: "Confirmed",
            value: summaryStats.confirmedBookings,
            color: "#34d399",
          },
          {
            icon: XCircle,
            label: "Cancelled",
            value: summaryStats.cancelledBookings,
            color: "#f87171",
          },
          {
            icon: Users,
            label: "Total Members",
            value: summaryStats.totalMembers,
            color: "#818cf8",
          },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-card border border-border rounded-[24px] p-5"
          >
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3"
              style={{ backgroundColor: `${card.color}18` }}
            >
              <card.icon size={20} style={{ color: card.color }} />
            </div>
            <p
              className="text-3xl font-bold font-['Playfair_Display']"
              style={{ color: card.color }}
            >
              {loading ? (
                <span className="inline-block w-10 h-7 bg-muted rounded animate-pulse" />
              ) : (
                card.value
              )}
            </p>
            <p className="text-xs text-muted-foreground font-['Poppins'] mt-1 font-semibold uppercase tracking-wider">
              {card.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Activity */}
        <div className="bg-card border border-border rounded-[32px] p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2 font-['Playfair_Display']">
            <TrendingUp size={20} className="text-accent" />
            Monthly Bookings
          </h3>
          <div className="h-[280px] w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-accent" size={32} />
              </div>
            ) : monthlyActivity.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyActivity}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={axisColor}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    stroke={axisColor}
                    tick={{
                      fill: "currentColor",
                      fontSize: 11,
                      fontFamily: "Poppins",
                    }}
                  />
                  <YAxis
                    stroke={axisColor}
                    tick={{
                      fill: "currentColor",
                      fontSize: 11,
                      fontFamily: "Poppins",
                    }}
                    allowDecimals={false}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke="var(--theme-accent)"
                    strokeWidth={3}
                    dot={{ fill: "var(--theme-accent)", r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground text-sm italic font-['Poppins']">
                  No booking activity in this period.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Court Usage */}
        <div className="bg-card border border-border rounded-[32px] p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2 font-['Playfair_Display']">
            <BarChart3 size={20} className="text-accent" />
            Court Usage
          </h3>
          <div className="h-[280px] w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-accent" size={32} />
              </div>
            ) : courtUsage.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courtUsage}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={axisColor}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke={axisColor}
                    tick={{
                      fill: "currentColor",
                      fontSize: 11,
                      fontFamily: "Poppins",
                    }}
                  />
                  <YAxis
                    stroke={axisColor}
                    tick={{
                      fill: "currentColor",
                      fontSize: 11,
                      fontFamily: "Poppins",
                    }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    cursor={{ fill: "var(--theme-muted)", opacity: 0.15 }}
                  />
                  <Bar
                    dataKey="bookings"
                    fill="var(--theme-accent)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground text-sm italic font-['Poppins']">
                  No booking data available for this period.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Member Segments Pie */}
        <div className="bg-card border border-border rounded-[32px] p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2 font-['Playfair_Display']">
            <PieChartIcon size={20} className="text-accent" />
            Member Segments
          </h3>
          <div className="h-[280px] w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-accent" size={32} />
              </div>
            ) : memberSegments.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={memberSegments}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={50}
                    paddingAngle={3}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {memberSegments.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={
                          ROLE_COLORS[entry.name] ?? "var(--theme-accent)"
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend
                    formatter={(value) => (
                      <span
                        style={{
                          fontFamily: "Poppins",
                          fontSize: 12,
                          textTransform: "capitalize",
                        }}
                      >
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground text-sm italic font-['Poppins']">
                  No member data available.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Booking Status Distribution */}
        <div className="bg-card border border-border rounded-[32px] p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2 font-['Playfair_Display']">
            <CalendarDays size={20} className="text-accent" />
            Booking Status Breakdown
          </h3>
          <div className="h-[280px] w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-accent" size={32} />
              </div>
            ) : statusDist.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusDist} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={axisColor}
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    stroke={axisColor}
                    tick={{
                      fill: "currentColor",
                      fontSize: 11,
                      fontFamily: "Poppins",
                    }}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="status"
                    stroke={axisColor}
                    tick={{ fill: "currentColor", fontSize: 11, fontFamily: "Poppins" }}
                    tickFormatter={(v: string) =>
                      v.charAt(0).toUpperCase() + v.slice(1)
                    }
                    width={80}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    cursor={{ fill: "var(--theme-muted)", opacity: 0.15 }}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {statusDist.map((entry) => (
                      <Cell
                        key={entry.status}
                        fill={
                          STATUS_COLORS[entry.status] ?? "var(--theme-accent)"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground text-sm italic font-['Poppins']">
                  No status data available.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}