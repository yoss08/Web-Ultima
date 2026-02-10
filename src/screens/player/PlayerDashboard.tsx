import { motion } from "motion/react";
import { Trophy, Calendar, Droplet, Clock, ChevronRight, PlayCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useAuth } from "../../services/AuthContext";


const performanceData = [
  { day: "Mon", rating: 1200 }, { day: "Tue", rating: 1250 },
  { day: "Wed", rating: 1230 }, { day: "Thu", rating: 1300 },
  { day: "Fri", rating: 1350 }, { day: "Sat", rating: 1420 },
  { day: "Sun", rating: 1400 },
];

export function PlayerDashboard() {
  const { user } = useAuth();

  return (
    <div className="p-8 space-y-8">
      {/* Header Dynamique */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="font-['Playfair_Display',serif] font-bold text-[32px] text-white dark:text-[#0A0E1A]">
            Welcome back, {user?.fullName || "Player"}!
          </h1>
          <p className="font-['Poppins',sans-serif] text-white/60 dark:text-[#0A0E1A]/60">
            {user?.email} • Level 4 Player
          </p>
        </motion.div>
        <button className="bg-[#39FF14] text-black font-bold px-6 py-3 rounded-[12px] flex items-center gap-2 shadow-[0_0_20px_rgba(57,255,20,0.3)]">
          <Calendar size={20} /> Book a Court
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Trophy, label: "Win Rate", value: "68%", color: "#39FF14" },
          { icon: Calendar, label: "Next Match", value: "Today, 4 PM", color: "#00E5FF" },
          { icon: Droplet, label: "Hydration", value: "85%", color: "#39FF14" }
        ].map((stat, i) => (
          <motion.div key={i} className="bg-white/5 dark:bg-[#0A0E1A]/5 border border-white/10 p-6 rounded-[24px]">
            <stat.icon className="mb-4" size={24} color={stat.color} />
            <p className="text-white/60 dark:text-[#0A0E1A]/60 text-sm">{stat.label}</p>
            <h3 className="text-2xl font-bold text-white dark:text-[#0A0E1A]">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Performance Chart */}
      <div className="bg-white/5 dark:bg-[#0A0E1A]/5 border border-white/10 rounded-[24px] p-6">
        <h2 className="text-white dark:text-[#0A0E1A] font-semibold mb-6">Performance Rating</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#39FF14" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#39FF14" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="day" stroke="#ffffff40" />
              <YAxis stroke="#ffffff40" />
              <Tooltip contentStyle={{ backgroundColor: '#111', border: 'none' }} />
              <Area type="monotone" dataKey="rating" stroke="#39FF14" fillOpacity={1} fill="url(#colorRating)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}