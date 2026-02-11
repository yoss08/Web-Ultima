import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Target, Zap, Activity, Award, Loader2 } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";
import { supabase } from "../../config/supabase";
import { useAuth } from "../../services/AuthContext";

export function PlayerStats() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    winRate: 0,
    totalMatches: 0,
    wins: 0,
    hoursPlayed: 0
  });

  useEffect(() => {
    async function fetchRealStats() {
      if (!user) return;

      try {
        // Récupérer tous les matchs de l'utilisateur
        const { data: matches, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'confirmed'); // On ne compte que les réservations valides

        if (error) throw error;

        if (matches) {
          const total = matches.length;
          const wins = matches.filter(m => m.result === 'Win').length;
          const rate = total > 0 ? Math.round((wins / total) * 100) : 0;
          
          // Simulation d'heures (1h par booking)
          const hours = total * 1; 

          setStats({
            winRate: rate,
            totalMatches: total,
            wins: wins,
            hoursPlayed: hours
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRealStats();
  }, [user]);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#39FF14]" size={40} />
      </div>
    );
  }

  const skillData = [
    { subject: 'Experience', A: Math.min(stats.totalMatches * 10, 150), fullMark: 150 },
    { subject: 'Win Ratio', A: (stats.winRate / 100) * 150, fullMark: 150 },
    { subject: 'Dedication', A: Math.min(stats.hoursPlayed * 5, 150), fullMark: 150 },
    { subject: 'Performance', A: stats.winRate > 50 ? 120 : 80, fullMark: 150 },
    { subject: 'Consistency', A: 100, fullMark: 150 },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header>
        <h1 className="font-['Playfair_Display'] font-bold text-3xl dark:text-white">Your Real-Time Stats</h1>
        <p className="text-[#0A0E1A]/60 dark:text-white/60">Data synced directly from your court activity.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Chart Dynamique */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-white/5 p-6 rounded-[24px] border border-gray-200 dark:border-white/10 flex flex-col items-center"
        >
          <h2 className="font-bold mb-4 self-start">Skill Analysis</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillData}>
                <PolarGrid stroke="#88888840" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#888888', fontSize: 12 }} />
                <Radar name="Player" dataKey="A" stroke="#39FF14" fill="#39FF14" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Cartes Automatiques */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard label="Win Rate" value={`${stats.winRate}%`} icon={Target} color="#39FF14" subtitle={`${stats.wins} victories`} />
          <StatCard label="Total Matches" value={stats.totalMatches.toString()} icon={Zap} color="#00E5FF" subtitle="Recorded bookings" />
          <StatCard label="Hours on Court" value={`${stats.hoursPlayed}h`} icon={Activity} color="#FF3D00" subtitle="Training time" />
          <StatCard label="Rank Status" value={stats.totalMatches > 5 ? "Amateur" : "Newbie"} icon={Award} color="#FFD700" subtitle="Based on activity" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, subtitle }: any) {
  return (
    <div className="bg-white dark:bg-white/5 p-6 rounded-[24px] border border-gray-200 dark:border-white/10 flex items-center gap-4">
      <div className="p-4 rounded-2xl" style={{ backgroundColor: `${color}15` }}>
        <Icon color={color} size={28} />
      </div>
      <div>
        <p className="text-sm opacity-60 font-['Poppins']">{label}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
        <p className="text-[10px] text-[#39FF14] font-bold uppercase">{subtitle}</p>
      </div>
    </div>
  );
}