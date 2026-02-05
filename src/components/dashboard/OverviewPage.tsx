import { motion } from "motion/react";
import {
  Activity,
  Grid3X3,
  Calendar,
  Droplet,
  TrendingUp,
  Users,
  Clock,
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

const summaryCards = [
  {
    icon: Activity,
    label: "Active Matches",
    value: "8",
    change: "+2 from yesterday",
    color: "#39FF14",
  },
  {
    icon: Grid3X3,
    label: "Available Courts",
    value: "4 / 12",
    change: "66% occupancy",
    color: "#00E5FF",
  },
  {
    icon: Calendar,
    label: "Today's Matches",
    value: "24",
    change: "+3 scheduled",
    color: "#39FF14",
  },
  {
    icon: Droplet,
    label: "Hydration Usage",
    value: "342L",
    change: "18% above average",
    color: "#00E5FF",
  },
];

const liveMatches = [
  {
    court: "Court 1",
    teams: "Rodriguez / Silva vs. Martinez / Lopez",
    score: "6-3, 4-2",
    time: "32 min",
    status: "live",
  },
  {
    court: "Court 3",
    teams: "Anderson / White vs. Taylor / Brown",
    score: "5-4, 0-0",
    time: "28 min",
    status: "live",
  },
  {
    court: "Court 5",
    teams: "Garcia / Perez vs. Wilson / Davis",
    score: "2-1, 1-1",
    time: "15 min",
    status: "live",
  },
];

const weeklyData = [
  { day: "Mon", matches: 18 },
  { day: "Tue", matches: 22 },
  { day: "Wed", matches: 20 },
  { day: "Thu", matches: 25 },
  { day: "Fri", matches: 28 },
  { day: "Sat", matches: 35 },
  { day: "Sun", matches: 32 },
];

const peakHoursData = [
  { hour: "6am", usage: 5 },
  { hour: "9am", usage: 15 },
  { hour: "12pm", usage: 45 },
  { hour: "3pm", usage: 65 },
  { hour: "6pm", usage: 95 },
  { hour: "9pm", usage: 70 },
  { hour: "12am", usage: 20 },
];

export function OverviewPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1
          className="font-['Playfair_Display',serif] font-bold text-[36px] lg:text-[42px] text-white dark:text-[#0A0E1A] mb-2"
          style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
        >
          Overview
        </h1>
        <p className="font-['Poppins',sans-serif] text-[16px] text-white/60 dark:text-[#0A0E1A]/60">
          Monitor your facility performance at a glance
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-black/80 dark:bg-white/90 backdrop-blur-xl border border-white/10 dark:border-[#0A0E1A]/10 rounded-[20px] p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-[12px] flex items-center justify-center"
                  style={{ backgroundColor: `${card.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: card.color }} />
                </div>
              </div>
              <h3 className="font-['Poppins',sans-serif] text-[14px] text-white/60 dark:text-[#0A0E1A]/60 mb-1">
                {card.label}
              </h3>
              <p className="font-['Poppins',sans-serif] font-bold text-[28px] text-white dark:text-[#0A0E1A] mb-2">
                {card.value}
              </p>
              <p className="font-['Poppins',sans-serif] text-[12px] text-white/40 dark:text-[#0A0E1A]/40">
                {card.change}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Live Matches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-black/80 dark:bg-white/90 backdrop-blur-xl border border-white/10 dark:border-[#0A0E1A]/10 rounded-[20px] p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-['Poppins',sans-serif] font-semibold text-[20px] text-white dark:text-[#0A0E1A]">
              Live Matches
            </h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse"></span>
              <span className="font-['Poppins',sans-serif] text-[14px] text-[#39FF14]">
                {liveMatches.length} active
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {liveMatches.map((match, index) => (
              <div
                key={index}
                className="bg-white/5 dark:bg-[#0A0E1A]/5 border border-white/10 dark:border-[#0A0E1A]/10 rounded-[12px] p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-['Poppins',sans-serif] font-semibold text-[14px] text-[#39FF14]">
                        {match.court}
                      </span>
                      <span className="px-2 py-0.5 bg-[#39FF14]/10 border border-[#39FF14] rounded-full font-['Poppins',sans-serif] text-[10px] text-[#39FF14] uppercase font-semibold">
                        Live
                      </span>
                    </div>
                    <p className="font-['Poppins',sans-serif] text-[13px] text-white/60 dark:text-[#0A0E1A]/60">
                      {match.teams}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-['Poppins',sans-serif] font-bold text-[16px] text-white dark:text-[#0A0E1A]">
                      {match.score}
                    </p>
                    <div className="flex items-center gap-1 justify-end mt-1">
                      <Clock className="w-3 h-3 text-white/40 dark:text-[#0A0E1A]/40" />
                      <span className="font-['Poppins',sans-serif] text-[12px] text-white/40 dark:text-[#0A0E1A]/40">
                        {match.time}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-black/80 dark:bg-white/90 backdrop-blur-xl border border-white/10 dark:border-[#0A0E1A]/10 rounded-[20px] p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-['Poppins',sans-serif] font-semibold text-[20px] text-white dark:text-[#0A0E1A]">
              Weekly Activity
            </h2>
            <TrendingUp className="w-5 h-5 text-[#39FF14]" />
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis
                dataKey="day"
                stroke="#ffffff40"
                style={{
                  fontSize: "12px",
                  fontFamily: "Poppins, sans-serif",
                }}
              />
              <YAxis
                stroke="#ffffff40"
                style={{
                  fontSize: "12px",
                  fontFamily: "Poppins, sans-serif",
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#000",
                  border: "1px solid #ffffff20",
                  borderRadius: "8px",
                  fontFamily: "Poppins, sans-serif",
                }}
              />
              <Bar dataKey="matches" fill="#39FF14" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Peak Hours Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-black/80 dark:bg-white/90 backdrop-blur-xl border border-white/10 dark:border-[#0A0E1A]/10 rounded-[20px] p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-['Poppins',sans-serif] font-semibold text-[20px] text-white dark:text-[#0A0E1A] mb-1">
              Peak Hours Analysis
            </h2>
            <p className="font-['Poppins',sans-serif] text-[14px] text-white/60 dark:text-[#0A0E1A]/60">
              Court usage throughout the day
            </p>
          </div>
          <Users className="w-6 h-6 text-[#00E5FF]" />
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={peakHoursData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis
              dataKey="hour"
              stroke="#ffffff40"
              style={{
                fontSize: "12px",
                fontFamily: "Poppins, sans-serif",
              }}
            />
            <YAxis
              stroke="#ffffff40"
              style={{
                fontSize: "12px",
                fontFamily: "Poppins, sans-serif",
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#000",
                border: "1px solid #ffffff20",
                borderRadius: "8px",
                fontFamily: "Poppins, sans-serif",
              }}
            />
            <Line
              type="monotone"
              dataKey="usage"
              stroke="#00E5FF"
              strokeWidth={3}
              dot={{ fill: "#00E5FF", r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
