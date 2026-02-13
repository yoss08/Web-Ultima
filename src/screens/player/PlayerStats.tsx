import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Target, Zap, Activity, Award, Loader2, Star, MessageSquare, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { supabase } from "../../config/supabase";
import { useAuth } from "../../services/AuthContext";

export function PlayerStats() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [stats, setStats] = useState({
    winRate: 0,
    totalMatches: 0,
    wins: 0,
    hoursPlayed: 0
  });

  // Données de compétences (Vides par défaut ou simulation si nécessaire)
  const [skillData, setSkillData] = useState([
    { subject: 'Speed', score: 0 },
    { subject: 'Power', score: 0 },
    { subject: 'Technique', score: 0 },
    { subject: 'Stamina', score: 0 },
    { subject: 'Mental', score: 0 },
  ]);
  
  useEffect(() => {
  async function fetchLatestSkills() {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from('coach_feedbacks')
      .select('*')
      .eq('student_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1) // On prend seulement le plus récent
      .single();

    if (data && !error) {
      // On met à jour l'histogramme avec les vraies notes du coach
      setSkillData([
        { subject: 'Speed', score: data.speed },
        { subject: 'Power', score: data.power },
        { subject: 'Technique', score: data.technique },
        { subject: 'Stamina', score: data.stamina },
        { subject: 'Mental', score: data.mental },
      ]);
      // On peut aussi stocker le message du coach
      setFeedbacks([data]); 
    }
  }
  fetchLatestSkills();
}, [user]);

  useEffect(() => {
    async function fetchAllPlayerData() {
      if (!user?.id) return;

      try {
        // 1. Récupérer les stats réelles (Matchs)
        const { data: matches } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'confirmed');

        if (matches && matches.length > 0) {
          const total = matches.length;
          const wins = matches.filter(m => m.result === 'Win').length;
          setStats({
            totalMatches: total,
            wins: wins,
            winRate: Math.round((wins / total) * 100),
            hoursPlayed: total * 1.5
          });

          // Simulation de skills basée sur l'activité réelle (à remplacer par une table skills si elle existe)
          setSkillData([
            { subject: 'Speed', score: 65 },
            { subject: 'Power', score: 45 },
            { subject: 'Technique', score: 70 },
            { subject: 'Stamina', score: 55 },
            { subject: 'Mental', score: 80 },
          ]);
        }

        // 2. Récupérer les Feedbacks du coach
        const { data: fbData } = await supabase
          .from('coach_feedbacks')
          .select('*')
          .eq('player_id', user.id)
          .order('date', { ascending: false });

        setFeedbacks(fbData || []);

      } catch (err) {
        console.error("Error fetching player data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAllPlayerData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="animate-spin text-[#39FF14]" size={40} />
        <p className="text-gray-500 font-medium">Loading your performance data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold dark:text-white">Performance Analytics</h1>
        <p className="text-gray-500">Real-time track of your tennis evolution</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* STATS CARDS (En haut) */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard label="Win Rate" value={stats.totalMatches > 0 ? `${stats.winRate}%` : "0%"} icon={Target} color="#39FF14" subtitle={stats.totalMatches > 0 ? `${stats.wins} victories` : "No matches yet"} />
          <StatCard label="Total Matches" value={stats.totalMatches.toString()} icon={Zap} color="#00E5FF" subtitle="Recorded confirmed bookings" />
          <StatCard label="Hours on Court" value={`${stats.hoursPlayed}h`} icon={Activity} color="#FF3D00" subtitle="Total training time" />
          <StatCard label="Rank Status" value={stats.totalMatches > 5 ? "Amateur" : "Newbie"} icon={Award} color="#FFD700" subtitle="Based on match history" />
        </div>

        {/* COACH FEEDBACK SECTION */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-white/5 p-6 rounded-[32px] border border-gray-200 dark:border-white/10"
        >
          <h2 className="font-bold flex items-center gap-2 text-lg mb-6 dark:text-white">
            <MessageSquare className="text-[#39FF14]" size={20} />
            Coach Feedback
          </h2>

          <div className="space-y-4">
            {feedbacks.length === 0 ? (
              <div className="text-center py-10 opacity-40">
                <Star size={32} className="mx-auto mb-2" />
                <p className="text-sm italic">No feedback from your coach yet.</p>
              </div>
            ) : (
              feedbacks.map((fb, idx) => (
                <div key={idx} className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border-l-4 border-[#39FF14]">
                   <p className="text-xs font-bold opacity-50 mb-1">{new Date(fb.date).toLocaleDateString()}</p>
                   <p className="text-sm italic dark:text-gray-200">"{fb.content}"</p>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* SKILL ANALYSIS HISTOGRAMME (Tout en bas) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-white/5 p-8 rounded-[32px] border border-gray-200 dark:border-white/10"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-2xl bg-[#39FF14]/10">
            <BarChart3 className="text-[#39FF14]" size={24} />
          </div>
          <div>
            <h2 className="font-bold text-xl dark:text-white">Skill Distribution</h2>
            <p className="text-sm text-gray-500">Technical breakdown of your current level</p>
          </div>
        </div>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={skillData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
              <XAxis 
                dataKey="subject" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#888888', fontSize: 12, fontWeight: 500 }} 
              />
              <YAxis hide domain={[0, 100]} />
              <Tooltip 
                cursor={{ fill: '#39FF14', opacity: 0.05 }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="score" radius={[8, 8, 0, 0]} barSize={50}>
                {skillData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.score > 0 ? '#39FF14' : '#88888820'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, subtitle }: any) {
  return (
    <div className="bg-white dark:bg-white/5 p-6 rounded-[32px] border border-gray-200 dark:border-white/10 flex items-center gap-4 transition-all hover:border-[#39FF14]/30">
      <div className="p-4 rounded-2xl" style={{ backgroundColor: `${color}15` }}>
        <Icon color={color} size={28} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-0.5">{label}</p>
        <p className="text-2xl font-bold dark:text-white leading-none">{value}</p>
        <p className="text-[11px] font-bold mt-1.5 opacity-40 uppercase tracking-wider">{subtitle}</p>
      </div>
    </div>
  );
}