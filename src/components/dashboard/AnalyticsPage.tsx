import { motion } from "motion/react";
import {
  TrendingUp,
  Users,
  Clock,
  Calendar,
  Download,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useTheme } from "../../styles/useTheme";

const monthlyData = [
  { month: "Jan", matches: 420, revenue: 8400 },
  { month: "Feb", matches: 450, revenue: 9000 },
  { month: "Mar", matches: 480, revenue: 9600 },
  { month: "Apr", matches: 510, revenue: 10200 },
  { month: "May", matches: 560, revenue: 11200 },
  { month: "Jun", matches: 590, revenue: 11800 },
];

const courtUsageData = [
  { name: "Court 1", usage: 95 },
  { name: "Court 2", usage: 88 },
  { name: "Court 3", usage: 92 },
  { name: "Court 4", usage: 78 },
  { name: "Court 5", usage: 85 },
  { name: "Court 6", usage: 72 },
  { name: "Court 7", usage: 90 },
  { name: "Court 8", usage: 86 },
];

const peakHoursData = [
  { name: "Morning", value: 25, color: "#39FF14" },
  { name: "Afternoon", value: 45, color: "#00E5FF" },
  { name: "Evening", value: 30, color: "#FF6B00" },
];

const kpis = [
  { icon: BarChart3, label: "Total Matches", value: "2,610", change: "+12.5%", trend: "up" },
  { icon: Users, label: "Active Players", value: "1,284", change: "+8.3%", trend: "up" },
  { icon: Clock, label: "Avg. Match Time", value: "48 min", change: "-3.2%", trend: "down" },
  { icon: Calendar, label: "Bookings", value: "3,142", change: "+15.7%", trend: "up" },
];

export function AnalyticsPage() {
  const { isDark } = useTheme();
  const chartStroke = isDark ? "rgba(255,255,255,0.1)" : "rgba(10,14,26,0.1)";
  const textStroke = isDark ? "rgba(255,255,255,0.4)" : "rgba(10,14,26,0.4)";

  const tooltipStyle = {
    backgroundColor: isDark ? "#000" : "#fff",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(10,14,26,0.1)"}`,
    borderRadius: "12px",
    fontFamily: "Poppins, sans-serif",
    fontSize: "12px",
    color: isDark ? "#fff" : "#0A0E1A"
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Playfair_Display',serif] font-bold text-[36px] lg:text-[42px] text-[#0A0E1A] dark:text-white mb-2">
            Analytics & Stats
          </h1>
          <p className="font-['Poppins',sans-serif] text-[16px] text-[#0A0E1A]/60 dark:text-white/60">
            Insights and performance metrics for your facility
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 px-6 h-12 bg-[#0A0E1A]/5 dark:bg-white/5 hover:bg-[#0A0E1A]/10 dark:hover:bg-white/10 border border-[#0A0E1A]/10 dark:border-white/20 rounded-[12px] transition-all font-['Poppins',sans-serif] text-[14px] font-semibold text-[#0A0E1A] dark:text-white">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-black/80 backdrop-blur-xl border border-[#0A0E1A]/10 dark:border-white/10 rounded-[20px] p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-[12px] bg-[#39FF14]/10 border border-[#39FF14]/20 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[#39FF14]" />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${kpi.trend === "up" ? "bg-[#39FF14]/10 text-[#39FF14]" : "bg-red-500/10 text-red-500"}`}>
                  <TrendingUp className={`w-3 h-3 ${kpi.trend === "down" ? "rotate-180" : ""}`} />
                  <span className="font-['Poppins',sans-serif] text-[12px] font-bold">{kpi.change}</span>
                </div>
              </div>
              <h3 className="font-['Poppins',sans-serif] text-[14px] text-[#0A0E1A]/60 dark:text-white/60 mb-1">{kpi.label}</h3>
              <p className="font-['Poppins',sans-serif] font-bold text-[28px] text-[#0A0E1A] dark:text-white">{kpi.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-black/80 backdrop-blur-xl border border-[#0A0E1A]/10 dark:border-white/10 rounded-[20px] p-6"
        >
          <h2 className="font-['Poppins',sans-serif] font-semibold text-[20px] text-[#0A0E1A] dark:text-white mb-6">Monthly Performance</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartStroke} />
              <XAxis dataKey="month" stroke={textStroke} style={{ fontSize: "12px", fontFamily: "Poppins" }} />
              <YAxis yAxisId="left" stroke={textStroke} style={{ fontSize: "12px", fontFamily: "Poppins" }} />
              <YAxis yAxisId="right" orientation="right" stroke={textStroke} style={{ fontSize: "12px", fontFamily: "Poppins" }} />
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: isDark ? "#fff" : "#0A0E1A" }} />
              <Legend iconType="circle" />
              <Line yAxisId="left" type="monotone" dataKey="matches" stroke="#39FF14" strokeWidth={3} dot={{ fill: "#39FF14", r: 4 }} name="Matches" />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#00E5FF" strokeWidth={3} dot={{ fill: "#00E5FF", r: 4 }} name="Revenue ($)" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Peak Hours Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white dark:bg-black/80 backdrop-blur-xl border border-[#0A0E1A]/10 dark:border-white/10 rounded-[20px] p-6"
        >
          <h2 className="font-['Poppins',sans-serif] font-semibold text-[20px] text-[#0A0E1A] dark:text-white mb-6">Peak Hours</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={peakHoursData} cx="50%" cy="50%" labelLine={false} outerRadius={80} dataKey="value" 
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}>
                {peakHoursData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Court Usage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-white dark:bg-black/80 backdrop-blur-xl border border-[#0A0E1A]/10 dark:border-white/10 rounded-[20px] p-6"
      >
        <h2 className="font-['Poppins',sans-serif] font-semibold text-[20px] text-[#0A0E1A] dark:text-white mb-6">Court Usage Statistics</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={courtUsageData}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartStroke} />
            <XAxis dataKey="name" stroke={textStroke} style={{ fontSize: "12px", fontFamily: "Poppins" }} />
            <YAxis stroke={textStroke} style={{ fontSize: "12px", fontFamily: "Poppins" }} />
            <Tooltip contentStyle={tooltipStyle} cursor={{fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}} />
            <Bar dataKey="usage" fill="#39FF14" radius={[6, 6, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}