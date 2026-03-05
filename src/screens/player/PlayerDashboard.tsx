import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PlayerSchedule } from "./playerSchedule";
import { 
  Calendar, Trophy, Activity, Plus, ArrowRight, Droplet, 
  TrendingUp, Clock, CheckCircle2, MessageSquare, BarChart3, Star, Loader2, XCircle, History
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Link } from "react-router";
import { supabase } from "../../config/supabase";
import { useAuth } from "../../services/AuthContext";

const CACHE_KEY = "ultima_player_dashboard_cache";

export function PlayerDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [stats, setStats] = useState({ winRate: 0, totalMatches: 0, wins: 0 });
  const [skillData, setSkillData] = useState([
    { subject: 'Speed', score: 0 }, { subject: 'Power', score: 0 },
    { subject: 'Technique', score: 0 }, { subject: 'Stamina', score: 0 }, { subject: 'Mental', score: 0 },
  ]);

  // --- Offline Support Logic ---
  useEffect(() => {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      setMatches(parsed.matches || []);
      setStats(parsed.stats || { winRate: 0, totalMatches: 0, wins: 0 });
      setSkillData(parsed.skillData || []);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user?.id) return;

      try {
        const { data: matchData } = await supabase
          .from('bookings')
          .select('*, courts(name)')
          .eq('user_id', user.id)
          .order('booking_date', { ascending: false });

        const { data: fbData } = await supabase
          .from('coach_feedbacks')
          .select('*')
          .eq('student_id', user.id)
          .order('created_at', { ascending: false });

        if (matchData) {
          const wins = matchData.filter(m => m.result === 'Win').length;
          const newStats = {
            totalMatches: matchData.length,
            wins: wins,
            winRate: matchData.length > 0 ? Math.round((wins / matchData.length) * 100) : 0
          };
          setMatches(matchData.slice(0, 3));
          setStats(newStats);
        }

        if (fbData && fbData[0]) {
          const latest = fbData[0];
          const newSkills = [
            { subject: 'Speed', score: latest.speed || 0 },
            { subject: 'Power', score: latest.power || 0 },
            { subject: 'Technique', score: latest.technique || 0 },
            { subject: 'Stamina', score: latest.stamina || 0 },
            { subject: 'Mental', score: latest.mental || 0 },
          ];
          setSkillData(newSkills);
          setFeedbacks(fbData.slice(0, 2));
        }

        // Save to Cache for Offline Support
        localStorage.setItem(CACHE_KEY, JSON.stringify({ matches: matchData?.slice(0, 3), stats, skillData }));
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [user]);

  if (loading && matches.length === 0) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#39FF14]" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black dark:text-white leading-none mb-4">
            Hello, {user?.user_metadata?.full_name?.split(' ')[0] || "Player"}! 👋
          </h1>
          <p className="text-[#0A0E1A]/60 dark:text-white/60 font-['Poppins']">
            Here's your activity overview.
          </p>

        </div>
        <Link to="/dashboard/courts" className="bg-[#39FF14] text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-[#39FF14]/20">
          <Plus size={20} /> Book a Court
        </Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Trophy} label="Win Rate" value={`${stats.winRate}%`} color="#39FF14" />
            <StatCard icon={CheckCircle2} label="Wins" value={stats.wins} color="#39FF14" />
            <StatCard icon={XCircle} label="Losses" value={stats.totalMatches - stats.wins} color="#FF4D4D" />
            <StatCard icon={Calendar} label="Upcoming" value={matches.filter(m => new Date(m.booking_date) >= new Date()).length} color="#00E5FF" />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionButton to="/dashboard/matches" icon={BarChart3} label="My Stats" color="#39FF14" />
            <QuickActionButton to="/dashboard/competitions" icon={Trophy} label="Tournaments" color="#FFD700" />
            <QuickActionButton to="/dashboard/matches" icon={History} label="Match History" color="#00E5FF" />
            <QuickActionButton to="/dashboard/courts" icon={Plus} label="Book Court" color="#39FF14" />
          </div>

          {/* Skill Distribution */}
          <section className="bg-white dark:bg-white/5 p-8 rounded-[32px] border border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="text-[#39FF14]" size={20} />
              <h3 className="text-xl font-bold">Skill Breakdown</h3>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                  <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fill: '#888888', fontSize: 12 }} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip cursor={{ fill: '#39FF14', opacity: 0.05 }} contentStyle={{ borderRadius: '16px', border: 'none' }} />
                  <Bar dataKey="score" radius={[8, 8, 0, 0]} barSize={40}>
                    {skillData.map((e, i) => <Cell key={i} fill="#39FF14" />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Recent History */}
          <section className="bg-white dark:bg-white/5 p-8 rounded-[32px] border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Recent Matches</h3>
              <Link to="/dashboard/matches" className="text-[#39FF14] text-sm font-bold flex items-center gap-1 hover:underline">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <tbody className="divide-y divide-white/5">
                  {matches.map((m) => (
                    <tr key={m.id}>
                      <td className="py-4"><span className={`font-bold ${m.result === 'Win' ? 'text-[#39FF14]' : 'text-red-500'}`}>{m.result || 'TBD'}</span></td>
                      <td className="py-4 text-sm opacity-80">{m.courts?.name}</td>
                      <td className="py-4 font-mono text-sm">{m.score || '-- : --'}</td>
                      <td className="py-4 text-right opacity-40 text-xs">{new Date(m.booking_date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <PlayerSchedule />
          
          <div className="bg-white dark:bg-white/5 p-6 rounded-[32px] border border-gray-200 dark:border-white/10">
            <h3 className="font-bold flex items-center gap-2 mb-4"><MessageSquare size={18} className="text-[#39FF14]" /> Coach Tips</h3>
            {feedbacks.length > 0 ? feedbacks.map((f, i) => (
              <div key={i} className="mb-3 p-3 bg-gray-50 dark:bg-white/5 rounded-xl border-l-2 border-[#39FF14]">
                <p className="text-xs italic">"{f.content}"</p>
              </div>
            )) : <p className="text-xs opacity-40">No tips yet. Keep practicing!</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <QuickLink to="/dashboard/hydration" icon={Droplet} label="Water" color="#00E5FF" />
            <QuickLink to="/dashboard/profile" icon={Star} label="Profile" color="#39FF14" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="bg-white dark:bg-white/5 p-4 sm:p-5 rounded-[24px] border border-gray-200 dark:border-white/10">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}15` }}><Icon size={16} style={{ color }} /></div>
        <span className="text-xs opacity-50 font-medium uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function QuickActionButton({ to, icon: Icon, label, color }: any) {
  return (
    <Link to={to} className="bg-white dark:bg-white/5 p-4 rounded-[24px] border border-gray-100 dark:border-white/10 hover:border-[#39FF14]/50 transition-all group flex flex-col items-center gap-2 overflow-hidden relative">
       <div className="absolute top-0 right-0 w-12 h-12 bg-white/5 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2" />
       <div className="p-3 rounded-xl bg-gray-50 dark:bg-black/20 group-hover:scale-110 transition-transform">
         <Icon size={20} style={{ color }} />
       </div>
       <span className="text-[10px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100">{label}</span>
    </Link>
  );
}

function QuickLink({ to, icon: Icon, label, color }: any) {
  return (
    <Link to={to} className="flex flex-col items-center p-4 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-[#39FF14] transition-all group">
      <Icon size={20} style={{ color }} className="mb-2 group-hover:scale-110 transition-transform" />
      <span className="text-xs font-bold">{label}</span>
    </Link>
  );
}