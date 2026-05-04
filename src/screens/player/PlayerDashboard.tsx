import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PlayerSchedule } from "./playerSchedule";
import {
  TrendingUp, Clock, CheckCircle2, MessageSquare, BarChart3, Star, Loader2, XCircle, History,
  Shield, Heart, HandMetal, AlertCircle, Zap, Target,Calendar, Trophy, Activity, Plus, ArrowRight, Droplet, 
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Link } from "react-router";
import { supabase } from "../../config/supabase";
import { useAuth } from "../../services/AuthContext";
import { useSocket } from "../../hooks/useSocket";
import { toast } from "react-hot-toast";
import { MOCK_MATCHES, MOCK_FEEDBACKS, MOCK_USER_ID, MOCK_STATS, MOCK_BOOKINGS, MOCK_TOURNAMENTS } from "../../utils/mockData";

const CACHE_KEY = "ultima_player_dashboard_cache";

export function PlayerDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [stats, setStats] = useState({ winRate: 0, totalMatches: 0, wins: 0, performanceScore: 0, rank: "" });
  const [skillData, setSkillData] = useState([
    { subject: 'Speed', score: 0 }, { subject: 'Power', score: 0 },
    { subject: 'Technique', score: 0 }, { subject: 'Stamina', score: 0 }, { subject: 'Mental', score: 0 },
  ]);

  // --- Offline Support Logic ---
  useEffect(() => {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      setActivities(parsed.activities || []);
      setFeedbacks(parsed.feedbacks || []);
      setStats(parsed.stats || { winRate: 0, totalMatches: 0, wins: 0 });
      setSkillData(parsed.skillData || []);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user?.id) return;

      try {
        const USE_MOCK_DATA = true; // SET THIS TO FALSE TO USE REAL DATABASE DATA

        let matchData: any[] | null = null;
        let fbData: any[] | null = null;
        let bookingData: any[] | null = null;
        let tournamentData: any[] | null = null;

        if (USE_MOCK_DATA) {
          matchData = MOCK_MATCHES.map(m => ({ 
            ...m, 
            winner_id: m.winner_id === MOCK_USER_ID ? user.id : m.winner_id 
          }));
          fbData = MOCK_FEEDBACKS;
          bookingData = MOCK_BOOKINGS;
          tournamentData = MOCK_TOURNAMENTS.filter(t => t.userRegistration);
          
          setStats({
            totalMatches: MOCK_STATS.sessions,
            wins: MOCK_STATS.wins,
            winRate: MOCK_STATS.winRate,
            performanceScore: MOCK_STATS.performanceScore,
            rank: MOCK_STATS.rank
          });

          await new Promise(r => setTimeout(r, 500));
        } else {
          const { data: mData } = await supabase
            .from('matches')
            .select('*, booking:bookings(booking_date, time_slot, courts(name))')
            .or(`player1_id.eq.${user.id},player2_id.eq.${user.id}`)
            .order('created_at', { ascending: false });
          matchData = mData;

          const { data: fData } = await supabase
            .from('coach_feedbacks')
            .select('*')
            .eq('student_id', user.id)
            .order('created_at', { ascending: false });
          fbData = fData;

          const { data: bData } = await supabase
            .from('bookings')
            .select('*, courts(name)')
            .eq('user_id', user.id)
            .order('booking_date', { ascending: false });
          bookingData = bData;

          const { data: tData } = await supabase
            .from('tournament_registrations')
            .select('*, tournament:tournaments(*, clubs(name))')
            .eq('player_id', user.id);
          tournamentData = tData;
        }

        const allActivities: any[] = [];

        if (matchData) {
          allActivities.push(...matchData.map(m => ({
            id: m.id,
            type: 'match',
            title: m.match_type === 'training' ? 'Training Session' : 'Padel Match',
            subtitle: m.match_type === 'training' ? `With ${m.player2?.full_name}` : `Against ${m.player2?.full_name}`,
            date: m.booking?.booking_date,
            score: m.score,
            winner_id: m.winner_id,
            court_name: m.booking?.courts?.name
          })));

          const wins = matchData.filter(m => m.winner_id === user.id).length;
          setStats(prev => ({
            ...prev,
            totalMatches: matchData!.length,
            wins: wins,
            winRate: matchData!.length > 0 ? Math.round((wins / matchData!.length) * 100) : 0
          }));
        }

        if (bookingData) {
          // Filter out bookings that already have matches associated if necessary, 
          // but for recent activity it's often better to just show unique events.
          // For now, let's include non-match bookings.
          const matchBookingIds = new Set(matchData?.map(m => m.booking_id));
          const standaloneBookings = bookingData.filter(b => !matchBookingIds.has(b.id));
          
          allActivities.push(...standaloneBookings.map(b => ({
            id: b.id,
            type: 'booking',
            title: 'Court Booking',
            subtitle: b.courts?.name || 'Court Reservation',
            date: b.booking_date,
            time: b.time_slot,
            status: b.status
          })));
        }

        if (tournamentData) {
          allActivities.push(...tournamentData.map(t => {
            const tournament = t.tournament || t;
            return {
              id: t.id,
              type: 'tournament',
              title: tournament.title,
              subtitle: tournament.clubs?.name || 'Tournament Entry',
              date: tournament.start_date,
              status: t.status || t.userRegistration?.status || 'registered'
            };
          }));
        }

        // Sort activities by date (descending)
        allActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setActivities(allActivities.slice(0, 5));

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

        // Save to Cache
        localStorage.setItem(CACHE_KEY, JSON.stringify({ activities: allActivities.slice(0, 5), feedbacks: fbData?.slice(0, 2), stats, skillData }));
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

  if (loading && activities.length === 0) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-accent" /></div>;

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
          {/* Performance Score Card (New) */}
          <div className="bg-card p-8 rounded-[32px] border border-border shadow-sm flex items-center gap-6 group hover:border-accent/50 transition-all">
            <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
               <Activity size={40} className="text-accent" />
            </div>
            <div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Performance Score</p>
              <h2 className="text-6xl font-black text-foreground tracking-tighter">{stats.performanceScore}</h2>
              <p className="text-accent font-bold mt-1 flex items-center gap-2">
                <Trophy size={16} />
                {stats.rank}
              </p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            <StatCard icon={TrendingUp} label="Win Rate" value={`${stats.winRate}%`} color="#CCFF00" />
            <StatCard icon={History} label="Sessions" value={stats.totalMatches} color="#CCFF00" />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-['Poppins']">
            <QuickActionButton to="/dashboard/matches" icon={BarChart3} label="My Stats" color="#CCFF00" />
            <QuickActionButton to="/dashboard/competitions" icon={Trophy} label="Tournaments" color="#C084FC" />
            <QuickActionButton to="/dashboard/matches" icon={History} label="Match History" color="var(--theme-accent)" />
            <QuickActionButton to="/dashboard/courts" icon={Plus} label="Book Court" color="#CCFF00" />
          </div>

          {/* Core Performance Section (Integrated from Stats) */}
          <section className="bg-card p-8 rounded-[32px] border border-border shadow-sm">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black uppercase tracking-[3px] opacity-60">Core Performance</h3>
             </div>
             <div className="flex justify-around items-center gap-4 flex-wrap">
                <CircularProgress label="Win Rate" value={stats.winRate} icon={<Trophy size={14} />} color="#CCFF00" />
                <CircularProgress label="Serves" value={85} icon={<Zap size={14} />} color="#FFD700" />
                <CircularProgress label="Smashes" value={65} icon={<Target size={14} />} color="#CCFF00" />
             </div>
          </section>

          {/* Technical Specs Mini-Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <MiniMetricCard label="Volley" value="92%" icon={<HandMetal size={18} />} color="#C084FC" />
             <MiniMetricCard label="Defense" value="65%" icon={<Shield size={18} />} color="#22D3EE" />
             <MiniMetricCard label="Agility" value="88%" icon={<Zap size={18} />} color="#FACC15" />
             <MiniMetricCard label="Stamina" value="70%" icon={<Heart size={18} />} color="#F43F5E" />
          </div>

          {/* Recent Activity */}
          <section className="bg-card p-6 sm:p-8 rounded-[32px] border border-border shadow-sm">
            <div className="flex items-center justify-between mb-6 font-['Playfair_Display']">
              <h3 className="text-xl font-bold">Recent Activity</h3>
              <div className="flex gap-4">
                 {/* Optional: Add Filter/View All if needed */}
              </div>
            </div>
            
            <div className="space-y-4">
              {activities.length > 0 ? activities.map((activity) => {
                const dateLabel = activity.date ? new Date(activity.date).toLocaleDateString([], { month: 'short', day: 'numeric' }) : '—';
                const isToday = activity.date && new Date(activity.date).toDateString() === new Date().toDateString();
                const isYesterday = activity.date && new Date(activity.date).toDateString() === new Date(Date.now() - 86400000).toDateString();
                const timeLabel = isToday ? "Today" : isYesterday ? "Yesterday" : dateLabel;

                let icon = <Activity size={18} />;
                let iconBg = "bg-accent/10";
                let iconColor = "text-accent";

                if (activity.type === 'tournament') {
                  icon = <Trophy size={18} />;
                  iconBg = "bg-purple-500/10";
                  iconColor = "text-purple-500";
                } else if (activity.type === 'booking') {
                  icon = <Calendar size={18} />;
                  iconBg = "bg-blue-500/10";
                  iconColor = "text-blue-500";
                } else if (activity.type === 'match') {
                  const isWin = activity.winner_id === user?.id;
                  icon = isWin ? <Trophy size={18} /> : <Activity size={18} />;
                  iconBg = isWin ? "bg-accent/10" : "bg-gray-500/10";
                  iconColor = isWin ? "text-accent" : "text-gray-500";
                }

                return (
                  <div key={`${activity.type}-${activity.id}`} className="p-4 bg-muted/20 border border-border/50 rounded-2xl flex items-center justify-between group hover:bg-muted/30 transition-all hover:border-accent/30">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center ${iconColor} shrink-0 group-hover:scale-110 transition-transform`}>
                        {icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-foreground font-['Poppins'] line-clamp-1">
                            {activity.title}
                          </p>
                          {activity.type === 'match' && activity.score && (
                            <span className="text-[10px] font-black bg-accent/20 text-accent px-1.5 py-0.5 rounded uppercase">
                              Match
                            </span>
                          )}
                          {activity.type === 'tournament' && (
                             <span className="text-[10px] font-black bg-purple-500/20 text-purple-500 px-1.5 py-0.5 rounded uppercase">
                               Tournament
                             </span>
                          )}
                          {activity.type === 'booking' && (
                             <span className="text-[10px] font-black bg-blue-500/20 text-blue-500 px-1.5 py-0.5 rounded uppercase">
                               Booking
                             </span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground font-medium line-clamp-1">
                          {activity.subtitle} {activity.time ? `• ${activity.time}` : ''}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right shrink-0">
                      {activity.type === 'match' ? (
                        <p className={`font-mono text-sm font-black ${activity.winner_id === user?.id ? 'text-accent' : 'text-foreground'}`}>
                          {activity.score || '-- : --'}
                        </p>
                      ) : (
                        <p className="text-[11px] font-bold text-foreground uppercase tracking-tight">
                          {activity.status || 'Scheduled'}
                        </p>
                      )}
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter mt-0.5 opacity-60">
                        {timeLabel}
                      </p>
                    </div>
                  </div>
                );
              }) : (
                <div className="py-10 text-center text-muted-foreground opacity-50">
                  <p className="text-sm italic">No recent activity to show.</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-6 border-t border-border/50">
               <Link to="/dashboard/matches" className="w-full bg-muted/30 hover:bg-muted/50 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-colors">
                  View Full History <ArrowRight size={16} />
               </Link>
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
        </div>
       
      </div>
    </div>
  );
}

function QuickActionButton({ to, icon: Icon, label, color }: { to: string; icon: any; label: string; color: string }) {
  return (
    <Link to={to} className="bg-card p-4 rounded-2xl border border-border flex flex-col items-center gap-2 hover:border-accent/50 transition-all group shadow-sm">
      <div className="p-2 rounded-xl bg-muted group-hover:scale-110 transition-transform">
        <Icon size={20} style={{ color }} />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground">{label}</span>
    </Link>
  );
}

function CircularProgress({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3 group">
       <div className="relative w-20 h-20 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
             <circle 
               cx="40" cy="40" r={radius} 
               fill="transparent" 
               stroke="currentColor" strokeWidth="4" className="text-muted/10"
             />
             <motion.circle 
               cx="40" cy="40" r={radius} 
               fill="transparent" 
               stroke={color} strokeWidth="6" strokeLinecap="round"
               initial={{ strokeDashoffset: circumference }}
               animate={{ strokeDashoffset: offset }}
               transition={{ duration: 1.5, ease: "easeOut" }}
               strokeDasharray={circumference}
             />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
             <div className="text-muted-foreground/40 mb-0.5 group-hover:scale-110 transition-transform">
                {icon}
             </div>
             <span className="text-sm font-black">{value}%</span>
          </div>
       </div>
       <span className="text-[9px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">{label}</span>
    </div>
  );
}

function MiniMetricCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-card p-4 rounded-2xl border border-border flex items-center gap-3 group hover:border-accent/30 transition-all">
       <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform" style={{ color }}>
          {icon}
       </div>
       <div>
          <p className="text-sm font-black leading-none">{value}</p>
          <p className="text-[8px] font-black uppercase tracking-widest opacity-30 mt-1">{label}</p>
       </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-card p-6 rounded-[32px] border border-border shadow-sm group hover:border-accent/30 transition-all overflow-hidden relative">
      <div className="absolute top-0 right-0 w-12 h-12 bg-accent/5 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-xl bg-accent/10">
          <Icon size={16} className="text-accent" />
        </div>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-3xl font-black text-foreground group-hover:text-accent transition-colors">{value}</p>
    </div>
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