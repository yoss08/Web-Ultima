import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Grid3X3,
  Calendar,
  Droplet,
  Users,
  RefreshCw,
  Zap,
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
import { supabase } from "../../config/supabase";

export function OverviewPage() {
  const [loading, setLoading] = useState(true);
  
  // États pour les compteurs réels
  const [stats, setStats] = useState({
    activeMatches: 0,
    availableCourts: "0/0",
    totalMatchesToday: 0,
    hydrationTotal: "0L"
  });

  // État pour les graphiques
  const [peakHoursData, setPeakHoursData] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Note: Ces appels seront branchés sur vos tables réelles (matches, courts, bookings)
      // Exemple de structure de récupération :
      // const { count: matchCount } = await supabase.from('matches').select('*', { count: 'exact', head: true }).eq('status', 'live');
      
      // Simulation d'une attente réseau
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const summaryCards = [
    { icon: Activity, label: "Active Matches", value: stats.activeMatches, color: "#39FF14" },
    { icon: Grid3X3, label: "Available Courts", value: stats.availableCourts, color: "#00E5FF" },
    { icon: Calendar, label: "Today's Matches", value: stats.totalMatchesToday, color: "#39FF14" },
    { icon: Droplet, label: "Hydration Usage", value: stats.hydrationTotal, color: "#00E5FF" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold dark:text-white font-['Playfair_Display']">Club Overview</h1>
          <p className="text-gray-500">Real-time club performance and activity.</p>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="p-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl dark:text-white"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-white/5 p-6 rounded-[28px] border border-gray-100 dark:border-white/10 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl" style={{ backgroundColor: `${card.color}15` }}>
                <card.icon size={24} style={{ color: card.color }} />
              </div>
            </div>
            <h3 className="text-3xl font-bold dark:text-white">{loading ? "..." : card.value}</h3>
            <p className="text-sm text-gray-500 font-medium">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Matches Feed (Vide par défaut) */}
        <div className="lg:col-span-1 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[32px] p-6">
          <h2 className="text-xl font-bold dark:text-white mb-6 flex items-center gap-2">
            <Zap size={20} className="text-[#39FF14]" /> Live Feed
          </h2>
          
          {liveMatches.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500 text-sm">No live matches in progress.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Le map des matchs réels ira ici */}
            </div>
          )}
        </div>

        {/* Peak Hours Chart (Vide par défaut) */}
        <div className="lg:col-span-2 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[32px] p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold dark:text-white">Peak Hours Analysis</h2>
            <Users className="text-[#00E5FF]" size={20} />
          </div>

          <div className="h-[250px] w-full flex items-center justify-center border border-dashed border-gray-100 dark:border-white/10 rounded-2xl">
            {peakHoursData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={peakHoursData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="hour" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Line type="monotone" dataKey="usage" stroke="#00E5FF" strokeWidth={3} dot={{ fill: "#00E5FF" }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-sm italic tracking-widest uppercase">Waiting for usage data...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}