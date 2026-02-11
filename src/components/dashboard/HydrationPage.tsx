import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Droplet,
  Activity,
  CheckCircle,
  TrendingUp,
  Plus,
  History,
  RefreshCw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "../../styles/useTheme";
import { toast } from "react-hot-toast";

const machines = [
  { id: 1, name: "ALMUS Station 1", location: "Main Court Area", status: "active", waterLevel: 92, dailyUsage: 142, totalDispensed: "1,840L" },
];

export function HydrationPage() {
  const { isDark } = useTheme();

  // --- ÉTATS ---
  const [goal] = useState(2500);
  const [consumed, setConsumed] = useState(0);
  const [history, setHistory] = useState<{ time: string; amount: number }[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<Record<string, number>>({});

  // --- LOGIQUE DE CHARGEMENT ---
  useEffect(() => {
    const saved = localStorage.getItem("my_hydration_v2");
    const today = new Date().toDateString();
    
    if (saved) {
      const parsed = JSON.parse(saved);
      // Charger la consommation du jour
      if (parsed.currentDate === today) {
        setConsumed(parsed.consumed || 0);
        setHistory(parsed.history || []);
      }
      // Charger les stats de la semaine
      setWeeklyStats(parsed.weeklyStats || {});
    }
  }, []);

  // --- SAUVEGARDE ET MISE À JOUR DE LA SEMAINE ---
  useEffect(() => {
    const today = new Date().toDateString();
    const dayName = new Date().toLocaleDateString('en-US', { weekday: 'short' });

    const updatedWeekly = { 
      ...weeklyStats, 
      [dayName]: consumed // Met à jour le jour actuel dans le graphique
    };

    localStorage.setItem("my_hydration_v2", JSON.stringify({
      currentDate: today,
      consumed,
      history,
      weeklyStats: updatedWeekly
    }));

    setWeeklyStats(updatedWeekly);
  }, [consumed, history]);

  const addWater = (amount: number) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setConsumed(prev => prev + amount);
    setHistory(prev => [{ time: now, amount }, ...prev].slice(0, 5));
    toast.success(`+${amount}ml logged`, { icon: '💧' });
  };

  const resetProgress = () => {
    if (confirm("Reset today's progress? (Weekly stats will be updated with 0)")) {
      setConsumed(0);
      setHistory([]);
    }
  };

  // --- PRÉPARATION DES DONNÉES DU GRAPHIQUE ---
  const chartData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map(day => ({
      day,
      usage: weeklyStats[day] || 0
    }));
  }, [weeklyStats]);

  // --- STYLES GRAPHIQUES ---
  const chartGridColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(10,14,26,0.05)";
  const chartAxisColor = isDark ? "rgba(255,255,255,0.4)" : "rgba(10,14,26,0.4)";

  const stats = [
    { icon: Droplet, label: "My Intake", value: `${consumed}ml`, change: `Goal: ${goal}ml` },
    { icon: Activity, label: "Station Status", value: "Online", change: "Station 1 Active" },
    { icon: TrendingUp, label: "Weekly Progress", value: `${Math.round(chartData.reduce((acc, curr) => acc + curr.usage, 0)/1000)}L`, change: "This week" },
    { icon: CheckCircle, label: "Water Quality", value: "Optimal", change: "System OK" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-['Playfair_Display',serif] font-bold text-[36px] lg:text-[42px] dark:text-white">Hydration Tracker</h1>
          <p className="font-['Poppins'] opacity-60">Personal intake & Almus Station monitoring.</p>
        </div>
        <button onClick={resetProgress} className="p-3 rounded-full hover:bg-red-500/10 text-red-500 transition-all">
          <RefreshCw size={20} />
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[24px] p-6 shadow-sm">
            <stat.icon className="w-6 h-6 text-[#00E5FF] mb-4" />
            <h3 className="text-xs opacity-50 uppercase font-bold tracking-wider mb-1">{stat.label}</h3>
            <p className="text-2xl font-bold dark:text-white">{stat.value}</p>
            <p className="text-[10px] opacity-40 mt-1 font-medium">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Tracker & Log */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[32px] p-10 flex flex-col items-center">
            <div className="relative w-56 h-56 rounded-full border-8 border-[#00E5FF]/10 flex items-center justify-center overflow-hidden mb-10">
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${Math.min((consumed/goal)*100, 100)}%` }}
                className="absolute bottom-0 w-full bg-gradient-to-t from-[#00E5FF]/40 to-[#00E5FF]/10"
                transition={{ type: "spring", bounce: 0, duration: 1 }}
              />
              <div className="relative z-10 text-center">
                <span className="text-5xl font-black dark:text-white">{Math.round((consumed/goal)*100)}%</span>
                <p className="text-[10px] font-bold opacity-50 uppercase tracking-[2px] mt-1">{consumed}ML / {goal}ML</p>
              </div>
            </div>

            <div className="flex gap-4">
              {[250, 500, 750].map(amount => (
                <button
                  key={amount}
                  onClick={() => addWater(amount)}
                  className="px-8 py-4 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 hover:bg-[#00E5FF] hover:text-black transition-all font-bold flex flex-col items-center group"
                >
                  <Plus size={18} className="mb-1 group-hover:scale-125 transition-transform" />
                  {amount}ml
                </button>
              ))}
            </div>
          </div>

          {/* WEEK TRACKER CHART */}
          <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[32px] p-8">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-[#00E5FF]" /> Weekly Intake Tracker
            </h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridColor} />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    stroke={chartAxisColor} 
                    style={{ fontSize: "12px", fontFamily: "Poppins" }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    stroke={chartAxisColor} 
                    style={{ fontSize: "12px", fontFamily: "Poppins" }} 
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0, 229, 255, 0.05)' }}
                    contentStyle={{ 
                      backgroundColor: isDark ? "#0A0E1A" : "#fff", 
                      border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#eee"}`,
                      borderRadius: "12px",
                      fontSize: "12px"
                    }} 
                  />
                  <Bar 
                    dataKey="usage" 
                    fill="#00E5FF" 
                    radius={[10, 10, 0, 0]} 
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right: History & Station */}
        <div className="space-y-6">
          {/* Station 1 Card */}
          <div className="bg-[#39FF14]/5 border border-[#39FF14]/20 rounded-[24px] p-6 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold dark:text-white">Station 1</h3>
                <span className="bg-[#39FF14] text-black text-[9px] font-black px-2 py-0.5 rounded-full">ACTIVE</span>
              </div>
              <p className="text-xs opacity-50 mb-4">{machines[0].location}</p>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Water Level</span>
                <span className="text-[#39FF14]">{machines[0].waterLevel}%</span>
              </div>
              <div className="h-1.5 bg-[#39FF14]/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#39FF14]" style={{ width: `${machines[0].waterLevel}%` }} />
              </div>
            </div>
          </div>

          {/* History */}
          <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[24px] p-6">
            <h3 className="font-bold text-xs uppercase tracking-widest opacity-40 mb-4 flex items-center gap-2">
              <History size={14} /> Today's Logs
            </h3>
            <div className="space-y-3">
              <AnimatePresence>
                {history.length === 0 ? (
                  <p className="text-[11px] opacity-30 italic">No logs recorded yet.</p>
                ) : (
                  history.map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex justify-between items-center p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent hover:border-[#00E5FF]/20 transition-all"
                    >
                      <span className="text-[10px] font-bold opacity-40">{item.time}</span>
                      <span className="text-sm font-bold text-[#00E5FF]">+{item.amount}ml</span>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}