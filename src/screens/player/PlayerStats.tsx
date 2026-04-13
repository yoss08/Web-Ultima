import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy, TrendingUp, Activity, Calendar, Target, Clock,
  ArrowRight, Loader2, BarChart3, MapPin
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { Link } from "react-router";
import { supabase } from "../../config/supabase";
import { useAuth } from "../../services/AuthContext";

export function PlayerStats() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<any[]>([]);
  const [filters, setFilters] = useState({ result: "all", dateRange: "all" });

  const [career, setCareer] = useState({
    total: 0, wins: 0, losses: 0, winRate: 0,
    totalPoints: 0, totalHours: 0, favoriteCourt: "—",
  });
  const [winRateOverTime, setWinRateOverTime] = useState<any[]>([]);
  const [matchesPerMonth, setMatchesPerMonth] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    fetchStats();
  }, [user]);

  async function fetchStats() {
    try {
      const { data: matchData, error } = await supabase
        .from("matches")
        .select("*, booking:bookings(booking_date, duration, courts(name))")
        .or(`player1_id.eq.${user!.id},player2_id.eq.${user!.id}`)
        .order('created_at', { ascending: true });

      if (error || !matchData) return;

      // Transform and flatten for easier processing
      const data = matchData.map(m => ({
        ...m,
        booking_date: m.booking?.booking_date,
        duration_hours: m.booking?.duration || 1,
        court_name: m.booking?.courts?.name || "Unknown",
        result: m.winner_id === user!.id ? "Win" : m.winner_id ? "Loss" : "TBD"
      }));

      setMatches(data);

      // Career stats
      const wins = data.filter((m) => m.result === "Win").length;
      const losses = data.filter((m) => m.result === "Loss").length;
      const courtCounts: Record<string, number> = {};
      data.forEach((m) => {
        courtCounts[m.court_name] = (courtCounts[m.court_name] || 0) + 1;
      });
      const fav = Object.entries(courtCounts).sort((a, b) => b[1] - a[1])[0];

      setCareer({
        total: data.length,
        wins,
        losses,
        winRate: data.length > 0 ? Math.round((wins / data.length) * 100) : 0,
        totalPoints: data.reduce((acc, m) => acc + (m.score_player1 || 0), 0), // Assuming score format or just count points
        totalHours: data.reduce((acc, m) => acc + (m.duration_hours || 1), 0),
        favoriteCourt: fav ? fav[0] : "—",
      });

      // Win rate over time (by month)
      const monthlyWins: Record<string, { wins: number; total: number }> = {};
      data.forEach((m) => {
        if (!m.booking_date) return;
        const month = new Date(m.booking_date).toLocaleDateString("en", { month: "short", year: "2-digit" });
        if (!monthlyWins[month]) monthlyWins[month] = { wins: 0, total: 0 };
        monthlyWins[month].total++;
        if (m.result === "Win") monthlyWins[month].wins++;
      });
      setWinRateOverTime(
        Object.entries(monthlyWins).map(([month, d]) => ({
          month,
          winRate: Math.round((d.wins / d.total) * 100),
        }))
      );

      // Matches per month
      const monthly: Record<string, number> = {};
      data.forEach((m) => {
        if (!m.booking_date) return;
        const month = new Date(m.booking_date).toLocaleDateString("en", { month: "short" });
        monthly[month] = (monthly[month] || 0) + 1;
      });
      setMatchesPerMonth(
        Object.entries(monthly).map(([month, count]) => ({ month, count }))
      );
    } finally {
      setLoading(false);
    }
  }

  // Apply filters
  const filtered = matches.filter((m) => {
    if (filters.result !== "all" && m.result?.toLowerCase() !== filters.result) return false;
    if (filters.dateRange !== "all") {
      const d = new Date(m.booking_date);
      const now = new Date();
      if (filters.dateRange === "30d" && now.getTime() - d.getTime() > 30 * 86400000) return false;
      if (filters.dateRange === "90d" && now.getTime() - d.getTime() > 90 * 86400000) return false;
    }
    return true;
  });

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#39FF14]" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <header>
        <h1 className="font-['Playfair_Display',serif] text-2xl md:text-4xl font-black dark:text-white mb-2">
          My <span className="text-[#00E5FF]">Statistics</span>
        </h1>
        <p className="text-[#0A0E1A]/60 dark:text-white/60 font-['Poppins']">Your complete performance overview.</p>
      </header>

      {/* Career Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {[
          { icon: Activity, label: "Matches", value: career.total, color: "#39FF14" },
          { icon: Trophy, label: "Wins", value: career.wins, color: "#39FF14" },
          { icon: Target, label: "Losses", value: career.losses, color: "#FF4D4D" },
          { icon: TrendingUp, label: "Win %", value: `${career.winRate}%`, color: "#00E5FF" },
          { icon: BarChart3, label: "Points", value: career.totalPoints, color: "#FFD700" },
          { icon: Clock, label: "Hours", value: career.totalHours, color: "#00E5FF" },
          { icon: MapPin, label: "Fav Court", value: career.favoriteCourt, color: "#39FF14" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white dark:bg-white/5 p-4 rounded-[20px] border border-gray-200 dark:border-white/10 group hover:border-[#00E5FF]/40 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${color}15` }}>
                <Icon size={14} style={{ color }} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-50">{label}</span>
            </div>
            <p className="text-xl font-black truncate group-hover:text-[#00E5FF] transition-colors">{value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Win Rate Over Time */}
        <div className="bg-white dark:bg-white/5 p-6 rounded-[28px] border border-gray-200 dark:border-white/10">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-[#39FF14]" /> Win Rate Over Time
          </h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={winRateOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#88888820" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#888", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: "#888", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "16px", border: "none", fontSize: 12 }} />
                <Line type="monotone" dataKey="winRate" stroke="#00E5FF" strokeWidth={3} dot={{ r: 4, fill: "#00E5FF" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Matches Per Month */}
        <div className="bg-white dark:bg-white/5 p-6 rounded-[28px] border border-gray-200 dark:border-white/10">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-[#00E5FF]" /> Matches Per Month
          </h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={matchesPerMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#88888820" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#888", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#888", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "16px", border: "none", fontSize: 12 }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={30}>
                  {matchesPerMonth.map((_, i) => <Cell key={i} fill="#00E5FF" />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Match History with Filters */}
      <div className="bg-white dark:bg-white/5 p-6 rounded-[28px] border border-gray-200 dark:border-white/10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <h3 className="text-xl font-bold">Match History</h3>
          <div className="flex gap-3 flex-wrap">
            <select
              value={filters.result}
              onChange={(e) => setFilters((p) => ({ ...p, result: e.target.value }))}
              className="h-10 px-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-bold outline-none"
            >
              <option value="all">All Results</option>
              <option value="win">Wins</option>
              <option value="loss">Losses</option>
            </select>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters((p) => ({ ...p, dateRange: e.target.value }))}
              className="h-10 px-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-bold outline-none"
            >
              <option value="all">All Time</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/10">
                <th className="py-3 text-xs font-bold uppercase tracking-wider opacity-40">Date</th>
                <th className="py-3 text-xs font-bold uppercase tracking-wider opacity-40">Court</th>
                <th className="py-3 text-xs font-bold uppercase tracking-wider opacity-40">Score</th>
                <th className="py-3 text-xs font-bold uppercase tracking-wider opacity-40">Result</th>
                <th className="py-3 text-xs font-bold uppercase tracking-wider opacity-40"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {filtered.slice().reverse().map((m) => (
                <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 font-mono text-xs opacity-60">{new Date(m.booking_date).toLocaleDateString()}</td>
                  <td className="py-3">{m.courts?.name || "—"}</td>
                  <td className="py-3 font-mono">{m.score || "— : —"}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                      m.result === "Win"
                        ? "bg-[#00E5FF]/10 text-[#00E5FF]"
                        : m.result === "Loss"
                        ? "bg-red-500/10 text-red-500"
                        : "bg-gray-100 dark:bg-white/5 opacity-40"
                    }`}>
                      {m.result || "TBD"}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <Link to={`/dashboard/player/matches/${m.id}`} className="text-[#00E5FF] hover:underline text-xs font-bold flex items-center gap-1 justify-end">
                      Details <ArrowRight size={12} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center py-10 opacity-30 text-sm">No matches found with current filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}
