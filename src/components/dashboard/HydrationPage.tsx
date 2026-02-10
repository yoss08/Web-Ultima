import { motion } from "motion/react";
import {
  Droplet,
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Wrench,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "../../styles/useTheme"; // Import du hook de thème

const machines = [
  { id: 1, name: "ALMUS Station 1", location: "Court Area A", status: "active", waterLevel: 85, dailyUsage: 142, totalDispensed: "1,840L" },
  { id: 2, name: "ALMUS Station 2", location: "Court Area B", status: "active", waterLevel: 45, dailyUsage: 98, totalDispensed: "1,520L" },
  { id: 3, name: "ALMUS Station 3", location: "Lobby", status: "warning", waterLevel: 15, dailyUsage: 76, totalDispensed: "980L" },
  { id: 4, name: "ALMUS Station 4", location: "Training Area", status: "maintenance", waterLevel: 0, dailyUsage: 0, totalDispensed: "2,240L" },
];

const weeklyUsageData = [
  { day: "Mon", usage: 320 }, { day: "Tue", usage: 340 }, { day: "Wed", usage: 310 },
  { day: "Thu", usage: 380 }, { day: "Fri", usage: 420 }, { day: "Sat", usage: 480 }, { day: "Sun", usage: 450 },
];

const hourlyUsageData = [
  { hour: "6am", usage: 12 }, { hour: "9am", usage: 28 }, { hour: "12pm", usage: 65 },
  { hour: "3pm", usage: 85 }, { hour: "6pm", usage: 110 }, { hour: "9pm", usage: 75 },
];

const stats = [
  { icon: Droplet, label: "Total Usage Today", value: "342L", change: "+18%" },
  { icon: Activity, label: "Active Stations", value: "2 / 4", change: "50%" },
  { icon: TrendingUp, label: "Avg. Daily Usage", value: "385L", change: "+12%" },
  { icon: AlertTriangle, label: "Alerts", value: "1", change: "Low water" },
];

export function HydrationPage() {
  const { isDark } = useTheme();

  // Variables dynamiques pour les graphiques
  const chartGridColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(10,14,26,0.1)";
  const chartAxisColor = isDark ? "rgba(255,255,255,0.4)" : "rgba(10,14,26,0.4)";
  const tooltipBg = isDark ? "#000" : "#fff";
  const tooltipBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(10,14,26,0.1)";

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return { icon: CheckCircle, color: "#39FF14", bg: "bg-[#39FF14]/10", border: "border-[#39FF14]/30", text: "text-[#39FF14]", label: "Active" };
      case "warning":
        return { icon: AlertTriangle, color: "#FFD700", bg: "bg-[#FFD700]/10", border: "border-[#FFD700]/30", text: "text-[#FFD700]", label: "Low Water" };
      case "maintenance":
        return { icon: Wrench, color: "#FF6B00", bg: "bg-[#FF6B00]/10", border: "border-[#FF6B00]/30", text: "text-[#FF6B00]", label: "Maintenance" };
      default:
        return { icon: CheckCircle, color: "#39FF14", bg: "bg-[#39FF14]/10", border: "border-[#39FF14]/30", text: "text-[#39FF14]", label: "Active" };
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-['Playfair_Display',serif] font-bold text-[36px] lg:text-[42px] text-[#0A0E1A] dark:text-white mb-2">
          Hydration — ALMUS
        </h1>
        <p className="font-['Poppins',sans-serif] text-[16px] text-[#0A0E1A]/60 dark:text-white/60">
          Monitor your smart hydration stations
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-black/80 backdrop-blur-xl border border-[#0A0E1A]/10 dark:border-white/10 rounded-[20px] p-6 shadow-sm"
            >
              <div className="w-12 h-12 rounded-[12px] bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-[#00E5FF]" />
              </div>
              <h3 className="font-['Poppins',sans-serif] text-[14px] text-[#0A0E1A]/60 dark:text-white/60 mb-1">{stat.label}</h3>
              <p className="font-['Poppins',sans-serif] font-bold text-[28px] text-[#0A0E1A] dark:text-white mb-2">{stat.value}</p>
              <p className="font-['Poppins',sans-serif] text-[12px] text-[#0A0E1A]/40 dark:text-white/40">{stat.change}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Machines Status */}
      <div className="grid lg:grid-cols-2 gap-6">
        {machines.map((machine, index) => {
          const statusConfig = getStatusConfig(machine.status);
          const StatusIcon = statusConfig.icon;

          return (
            <motion.div
              key={machine.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className={`bg-white dark:bg-black/80 backdrop-blur-xl border ${statusConfig.border} dark:border-white/10 rounded-[20px] p-6 shadow-sm`}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="font-['Poppins',sans-serif] font-bold text-[18px] text-[#0A0E1A] dark:text-white mb-1">{machine.name}</h3>
                  <p className="font-['Poppins',sans-serif] text-[14px] text-[#0A0E1A]/60 dark:text-white/60">{machine.location}</p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 ${statusConfig.bg} border border-current rounded-full`}>
                  <StatusIcon className="w-4 h-4" style={{ color: statusConfig.color }} />
                  <span className={`font-['Poppins',sans-serif] text-[10px] font-bold ${statusConfig.text} uppercase tracking-wider`}>
                    {statusConfig.label}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-['Poppins',sans-serif] text-[14px] text-[#0A0E1A]/60 dark:text-white/60">Water Level</span>
                  <span className="font-['Poppins',sans-serif] text-[14px] font-bold text-[#0A0E1A] dark:text-white">{machine.waterLevel}%</span>
                </div>
                <div className="h-2.5 bg-[#0A0E1A]/5 dark:bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${machine.waterLevel}%` }}
                    className={`h-full rounded-full ${machine.waterLevel > 50 ? "bg-[#00E5FF]" : machine.waterLevel > 20 ? "bg-[#FFD700]" : "bg-red-500"}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-['Poppins',sans-serif] text-[12px] text-[#0A0E1A]/60 dark:text-white/60 mb-1">Daily Usage</p>
                  <p className="font-['Poppins',sans-serif] font-bold text-[18px] text-[#0A0E1A] dark:text-white">{machine.dailyUsage}L</p>
                </div>
                <div>
                  <p className="font-['Poppins',sans-serif] text-[12px] text-[#0A0E1A]/60 dark:text-white/60 mb-1">Total Dispensed</p>
                  <p className="font-['Poppins',sans-serif] font-bold text-[18px] text-[#0A0E1A] dark:text-white">{machine.totalDispensed}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="bg-white dark:bg-black/80 backdrop-blur-xl border border-[#0A0E1A]/10 dark:border-white/10 rounded-[20px] p-6 shadow-sm"
        >
          <h2 className="font-['Poppins',sans-serif] font-semibold text-[20px] text-[#0A0E1A] dark:text-white mb-6">Weekly Usage</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyUsageData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
              <XAxis dataKey="day" stroke={chartAxisColor} style={{ fontSize: "12px", fontFamily: "Poppins" }} />
              <YAxis stroke={chartAxisColor} style={{ fontSize: "12px", fontFamily: "Poppins" }} />
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: "8px", color: isDark ? "#fff" : "#000" }} />
              <Bar dataKey="usage" fill="#00E5FF" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
          className="bg-white dark:bg-black/80 backdrop-blur-xl border border-[#0A0E1A]/10 dark:border-white/10 rounded-[20px] p-6 shadow-sm"
        >
          <h2 className="font-['Poppins',sans-serif] font-semibold text-[20px] text-[#0A0E1A] dark:text-white mb-6">Today's Hourly Usage</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={hourlyUsageData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
              <XAxis dataKey="hour" stroke={chartAxisColor} style={{ fontSize: "12px", fontFamily: "Poppins" }} />
              <YAxis stroke={chartAxisColor} style={{ fontSize: "12px", fontFamily: "Poppins" }} />
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: "8px" }} />
              <Line type="monotone" dataKey="usage" stroke="#00E5FF" strokeWidth={3} dot={{ fill: "#00E5FF", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}