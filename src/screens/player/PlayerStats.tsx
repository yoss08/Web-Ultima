import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy, TrendingUp, Activity, Calendar, Target, Clock,
  ArrowRight, Loader2, BarChart3, MapPin, Zap
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, AreaChart, Area
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
        totalPoints: data.reduce((acc, m) => acc + (m.score_player1 || 0), 0),
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

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-accent" /></div>;

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-700 pb-20 px-4 sm:px-6 lg:px-8">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 text-accent font-black text-[10px] uppercase tracking-[4px] mb-3 font-['Poppins']">
            <Activity size={14} className="fill-accent" />
            <span>Athletic Analytical Framework</span>
          </div>
          <h1 className="font-['Playfair_Display',serif] text-3xl md:text-5xl font-black text-foreground leading-none mb-4 tracking-tighter">My <span className="text-accent underline decoration-4 underline-offset-8">Statistics</span></h1>
          <p className="text-muted-foreground font-['Poppins'] text-lg">Your complete performance overview and growth tracking.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 font-['Poppins']">
           <Link to="/dashboard/player/matches" className="h-12 px-6 rounded-2xl bg-accent text-accent-foreground flex items-center gap-2 text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent/20">
             Explore Matches <ArrowRight size={14} />
           </Link>
        </div>
      </header>

      {/* CAREER STATS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 font-['Poppins']">
        {[
          { icon: Activity, label: "Matches", value: career.total, color: "var(--theme-accent)" },
          { icon: Trophy, label: "Wins", value: career.wins, color: "var(--theme-accent)" },
          { icon: Target, label: "Losses", value: career.losses, color: "#F43F5E" },
          { icon: TrendingUp, label: "Win %", value: `${career.winRate}%`, color: "var(--theme-accent)" },
          { icon: BarChart3, label: "Points", value: career.totalPoints, color: "var(--theme-accent)" },
          { icon: Clock, label: "Hours", value: career.totalHours, color: "var(--theme-accent)" },
          { icon: MapPin, label: "Fav Court", value: career.favoriteCourt, color: "var(--theme-accent)" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-card p-6 rounded-[32px] border border-border group hover:border-accent/40 transition-all shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-accent/5 blur-[30px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl shadow-inner" style={{ backgroundColor: `${color}15` }}>
                <Icon size={16} style={{ color }} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[2px] opacity-40">{label}</span>
            </div>
            <p className="text-2xl font-black truncate group-hover:text-accent transition-colors tracking-tight">{value}</p>
          </div>
        ))}
      </div>

      {/* CHARTS SECTION */}
      <div className="grid md:grid-cols-2 gap-8 font-['Poppins']">
        {/* Win Rate Over Time */}
        <div className="bg-card p-8 rounded-[40px] border border-border shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-accent/5 blur-[60px] rounded-full -translate-y-1/2 -translate-x-1/2" />
          <h3 className="text-lg font-black mb-8 flex items-center gap-3 uppercase tracking-widest leading-none">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <TrendingUp size={16} className="text-accent" />
            </div>
            Win Velocity
          </h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={winRateOverTime}>
                <defs>
                  <linearGradient id="colorWinRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--theme-accent)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--theme-accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="5 5" stroke="var(--theme-border)" opacity={0.3} vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "var(--theme-muted-foreground)", fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis domain={[0, 100]} tick={{ fill: "var(--theme-muted-foreground)", fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: "24px", border: "1px solid var(--theme-border)", fontSize: 12, fontWeight: 700, backgroundColor: "rgba(18,18,18,0.9)", backdropFilter: "blur(10px)", color: "var(--theme-foreground)", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.5)" }} 
                  itemStyle={{ color: "var(--theme-accent)" }}
                />
                <Area type="monotone" dataKey="winRate" stroke="var(--theme-accent)" strokeWidth={4} fillOpacity={1} fill="url(#colorWinRate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Matches Per Month */}
        <div className="bg-card p-8 rounded-[40px] border border-border shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <h3 className="text-lg font-black mb-8 flex items-center gap-3 uppercase tracking-widest leading-none">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Calendar size={16} className="text-accent" />
            </div>
            Engagement Volume
          </h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={matchesPerMonth}>
                <CartesianGrid strokeDasharray="5 5" stroke="var(--theme-border)" opacity={0.3} vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "var(--theme-muted-foreground)", fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: "var(--theme-muted-foreground)", fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: "24px", border: "1px solid var(--theme-border)", fontSize: 12, fontWeight: 700, backgroundColor: "rgba(18,18,18,0.9)", backdropFilter: "blur(10px)", color: "var(--theme-foreground)", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.5)" }} 
                  cursor={{ fill: 'var(--theme-muted)', opacity: 0.1 }}
                />
                <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={24}>
                  {matchesPerMonth.map((_, i) => <Cell key={i} fill="var(--theme-accent)" className="transition-all hover:opacity-80" />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* MATCH HISTORY DATA TABLE */}
      <div className="bg-card rounded-[48px] border border-border mt-10 shadow-3xl overflow-hidden font-['Poppins']">
        <div className="p-10 border-b border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-black tracking-tight font-['Playfair_Display']">Historical Performance</h3>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-40 px-1">Raw Match Data Feed</p>
          </div>
          <div className="flex gap-4 flex-wrap">
            <div className="relative group">
              <select
                value={filters.result}
                onChange={(e) => setFilters((p) => ({ ...p, result: e.target.value }))}
                className="h-12 pl-6 pr-10 bg-muted rounded-[20px] border border-border text-xs font-black uppercase tracking-widest outline-none appearance-none cursor-pointer focus:ring-2 ring-accent/30 transition-all text-foreground"
              >
                <option value="all">Results: All</option>
                <option value="win">Results: Wins</option>
                <option value="loss">Results: Losses</option>
              </select>
            </div>
            <div className="relative group">
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters((p) => ({ ...p, dateRange: e.target.value }))}
                className="h-12 pl-6 pr-10 bg-muted rounded-[20px] border border-border text-xs font-black uppercase tracking-widest outline-none appearance-none cursor-pointer focus:ring-2 ring-accent/30 transition-all text-foreground"
              >
                <option value="all">Era: All Time</option>
                <option value="30d">Era: 30 Days</option>
                <option value="90d">Era: 90 Days</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30">
                <th className="py-6 px-10 text-[10px] font-black uppercase tracking-[3px] opacity-40">Timeline</th>
                <th className="py-6 px-6 text-[10px] font-black uppercase tracking-[3px] opacity-40">Core Arena</th>
                <th className="py-6 px-6 text-[10px] font-black uppercase tracking-[3px] opacity-40">Final Analytics</th>
                <th className="py-6 px-6 text-[10px] font-black uppercase tracking-[3px] opacity-40">Execution Status</th>
                <th className="py-6 px-10 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.slice().reverse().map((m) => (
                <tr key={m.id} className="hover:bg-accent/[0.02] transition-colors group">
                  <td className="py-6 px-10 font-black text-xs opacity-60 font-mono tracking-tighter">{new Date(m.booking_date).toLocaleDateString()}</td>
                  <td className="py-6 px-6 font-bold text-sm text-foreground">{m.courts?.name || "ULTIMA Main"}</td>
                  <td className="py-6 px-6 font-black text-lg tracking-tighter">{m.score || "— : —"}</td>
                  <td className="py-6 px-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[1px] border shadow-sm ${
                      m.result === "Win"
                        ? "bg-accent/10 text-accent border-accent/20"
                        : m.result === "Loss"
                        ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                        : "bg-muted text-muted-foreground border-border"
                    }`}>
                      {m.result || "TBD"}
                    </span>
                  </td>
                  <td className="py-6 px-10 text-right">
                    <Link 
                      to={`/dashboard/player/matches`} 
                      className="inline-flex items-center gap-2 text-accent opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 font-black text-[10px] uppercase tracking-widest"
                    >
                      Audit Session <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-32 opacity-20">
               <Zap className="mx-auto mb-4" size={48} />
               <p className="text-sm font-black uppercase tracking-[3px]">No matching records found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
