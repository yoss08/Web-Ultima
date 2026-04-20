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
import { useSocket } from "../../hooks/useSocket";
import { toast } from "react-hot-toast";

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
        // Fetch matches from the dedicated matches table
        const { data: matchData } = await supabase
          .from('matches')
          .select('*, booking:bookings(booking_date, time_slot, courts(name))')
          .or(`player1_id.eq.${user.id},player2_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        const { data: fbData } = await supabase
          .from('coach_feedbacks')
          .select('*')
          .eq('student_id', user.id)
          .order('created_at', { ascending: false });

        if (matchData) {
          const wins = matchData.filter(m => m.winner_id === user.id).length;
          const newStats = {
            totalMatches: matchData.length,
            wins: wins,
            winRate: matchData.length > 0 ? Math.round((wins / matchData.length) * 100) : 0
          };
          
          // Flatten data for the UI
          const transformedMatches = matchData.map(m => ({
            ...m,
            courts: m.booking?.courts,
            booking_date: m.booking?.booking_date,
            time_slot: m.booking?.time_slot
          }));

          setMatches(transformedMatches.slice(0, 3));
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

  // Real-time notifications listener
  const { socket } = useSocket();
  useEffect(() => {
    socket.on('receive-feedback-notification', (data) => {
      toast.success(data.message, {
        duration: 5000,
        position: 'top-right',
        icon: '🎾'
      });
      // Optionally refresh data
      // fetchDashboardData(); 
    });

    return () => {
      socket.off('receive-feedback-notification');
    };
  }, [socket]);

  if (loading && matches.length === 0) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-accent" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-black text-foreground leading-none mb-4">
            Hello, {user?.user_metadata?.full_name?.split(' ')[0] || "Player"}! 👋
          </h1>
          <p className="text-muted-foreground font-['Poppins']">
            Here's your activity overview.
          </p>

        </div>
        <Link to="/dashboard/courts" className="bg-accent text-accent-foreground px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-accent/20 font-['Poppins']">
          <Plus size={20} /> Book a Court
        </Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Trophy} label="Win Rate" value={`${stats.winRate}%`} color="#CCFF00" />
            <StatCard icon={CheckCircle2} label="Wins" value={stats.wins} color="#CCFF00" />
            <StatCard icon={XCircle} label="Losses" value={stats.totalMatches - stats.wins} color="#F43F5E" />
            <StatCard icon={Calendar} label="Upcoming" value={matches.filter(m => new Date(m.booking_date) >= new Date()).length} color="#CCFF00" />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-['Poppins']">
            <QuickActionButton to="/dashboard/matches" icon={BarChart3} label="My Stats" color="#CCFF00" />
            <QuickActionButton to="/dashboard/competitions" icon={Trophy} label="Tournaments" color="#C084FC" />
            <QuickActionButton to="/dashboard/matches" icon={History} label="Match History" color="var(--theme-accent)" />
            <QuickActionButton to="/dashboard/courts" icon={Plus} label="Book Court" color="#CCFF00" />
          </div>

          {/* Skill Distribution */}
          <section className="bg-card p-8 rounded-[32px] border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-6 font-['Playfair_Display']">
              <BarChart3 className="text-accent" size={20} />
              <h3 className="text-xl font-bold">Skill Breakdown</h3>
            </div>
            <div className="h-[250px] w-full font-['Poppins']">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--theme-border)" opacity={0.2} />
                  <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fill: 'var(--theme-foreground)', fontSize: 10, fontWeight: 700 }} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip cursor={{ fill: 'var(--theme-accent)', opacity: 0.05 }} contentStyle={{ borderRadius: '16px', border: '1px solid var(--theme-border)', backgroundColor: 'var(--theme-card)', color: 'var(--theme-foreground)', fontWeight: 'bold' }} />
                  <Bar dataKey="score" radius={[8, 8, 0, 0]} barSize={40}>
                    {skillData.map((e, i) => <Cell key={i} fill="var(--theme-accent)" />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Recent History */}
          <section className="bg-card p-8 rounded-[32px] border border-border shadow-sm">
            <div className="flex items-center justify-between mb-6 font-['Playfair_Display']">
              <h3 className="text-xl font-bold">Recent Matches</h3>
              <Link to="/dashboard/matches" className="text-accent text-sm font-bold flex items-center gap-1 hover:underline font-['Poppins']">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-['Poppins']">
                <tbody className="divide-y divide-border/50">
                  {matches.map((m) => (
                    <tr key={m.id}>
                      <td className="py-4">
                        <span className={`font-bold ${
                          m.winner_id === user?.id ? 'text-accent' : 
                          m.winner_id && m.winner_id !== '00000000-0000-0000-0000-000000000000' ? 'text-red-500' : 
                          'text-gray-400'
                        }`}>
                          {m.winner_id === user?.id ? 'Win' : m.winner_id ? 'Loss' : 'TBD'}
                        </span>
                      </td>
                      <td className="py-4 text-sm opacity-80">{m.booking?.courts?.name || '—'}</td>
                      <td className="py-4 font-mono text-sm">{m.score || '-- : --'}</td>
                      <td className="py-4 text-right opacity-40 text-xs">
                        {m.booking?.booking_date ? new Date(m.booking.booking_date).toLocaleDateString() : '—'}
                      </td>
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
          
          <div className="bg-card p-6 rounded-[32px] border border-border shadow-sm font-['Poppins']">
            <h3 className="font-bold flex items-center gap-2 mb-4 font-['Playfair_Display'] text-lg"><MessageSquare size={18} className="text-accent" /> Coach Tips</h3>
            {feedbacks.length > 0 ? feedbacks.map((f, i) => (
              <div key={i} className="mb-3 p-3 bg-muted/30 rounded-xl border-l-2 border-accent">
                <p className="text-xs italic">"{f.content}"</p>
              </div>
            )) : <p className="text-xs opacity-40">No tips yet. Keep practicing!</p>}
          </div>

          <div className="grid grid-cols-2 gap-3 font-['Poppins']">
            <QuickLink to="/dashboard/hydration" icon={Droplet} label="Water" color="var(--theme-accent)" />
            <QuickLink to="/dashboard/profile" icon={Star} label="Profile" color="#CCFF00" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="bg-card p-4 sm:p-5 rounded-[24px] border border-border font-['Poppins'] shadow-sm hover:border-accent/30 transition-all">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-accent/10"><Icon size={14} className="text-accent" /></div>
        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-black text-foreground">{value}</p>
    </div>
  );
}

function QuickActionButton({ to, icon: Icon, label, color }: any) {
  return (
    <Link to={to} className="bg-card p-4 rounded-[24px] border border-border hover:border-accent/50 transition-all group flex flex-col items-center gap-2 overflow-hidden relative shadow-sm">
       <div className="absolute top-0 right-0 w-12 h-12 bg-accent/5 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2" />
       <div className="p-3 rounded-xl bg-muted group-hover:scale-110 transition-transform">
         <Icon size={20} style={{ color }} />
       </div>
       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
    </Link>
  );
}

function QuickLink({ to, icon: Icon, label, color }: any) {
  return (
    <Link to={to} className="flex flex-col items-center p-4 bg-card rounded-2xl border border-border hover:border-accent transition-all group shadow-sm">
      <Icon size={20} style={{ color }} className="mb-2 group-hover:scale-110 transition-transform" />
      <span className="text-xs font-bold text-foreground">{label}</span>
    </Link>
  );
}