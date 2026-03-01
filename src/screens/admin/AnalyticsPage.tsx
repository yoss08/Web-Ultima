import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Clock,
  Calendar,
  Download,
  BarChart3,
  Loader2,
  Filter,
  PieChart as PieChartIcon
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
import { supabase } from "../../config/supabase";

export function AnalyticsPage() {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    monthlyRevenue: [],
    courtUsage: [],
    memberGrowth: [],
    matchDistribution: []
  });

  useEffect(() => {
    // Simulation du chargement des données réelles
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        // Ici, vous ferez vos appels Supabase :
        // const { data: revenue } = await supabase.rpc('get_monthly_revenue');
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching analytics:", error);
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const chartStroke = isDark ? "#ffffff10" : "#0A0E1A10";
  const textStroke = isDark ? "#ffffff60" : "#0A0E1A60";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header avec Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold dark:text-white font-['Playfair_Display']">Analytics & Reports</h1>
          <p className="text-gray-500">Deep dive into club performance and usage patterns.</p>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl dark:text-white text-sm font-semibold">
            <Filter size={18} /> Filter Period
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#39FF14] text-black rounded-xl text-sm font-bold hover:scale-105 transition-transform">
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Graphique 1: Revenus ou Activité Mensuelle */}
        <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[32px] p-8">
          <h3 className="text-lg font-bold dark:text-white mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-[#39FF14]" /> Monthly Activity
          </h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            {loading ? (
              <Loader2 className="animate-spin text-gray-400" />
            ) : data.monthlyRevenue.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartStroke} vertical={false} />
                  <XAxis dataKey="month" stroke={textStroke} />
                  <YAxis stroke={textStroke} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#39FF14" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-sm italic">No activity recorded for this period.</p>
            )}
          </div>
        </div>

        {/* Graphique 2: Utilisation des Courts */}
        <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[32px] p-8">
          <h3 className="text-lg font-bold dark:text-white mb-6 flex items-center gap-2">
            <BarChart3 size={20} className="text-[#00E5FF]" /> Court Usage %
          </h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            {loading ? (
              <Loader2 className="animate-spin text-gray-400" />
            ) : data.courtUsage.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.courtUsage}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartStroke} vertical={false} />
                  <XAxis dataKey="name" stroke={textStroke} />
                  <YAxis stroke={textStroke} />
                  <Tooltip />
                  <Bar dataKey="usage" fill="#00E5FF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-sm italic">Waiting for booking data to analyze usage.</p>
            )}
          </div>
        </div>

        {/* Graphique 3: Distribution par type de match */}
        <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[32px] p-8 lg:col-span-2">
          <h3 className="text-lg font-bold dark:text-white mb-6 flex items-center gap-2">
            <PieChartIcon size={20} className="text-purple-400" /> Member Segment Distribution
          </h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            {loading ? (
              <Loader2 className="animate-spin text-gray-400" />
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-purple-500" />
                </div>
                <p className="text-gray-500 text-sm">Analyze your member database growth and categories here.</p>
                <button className="mt-4 text-[#39FF14] text-sm font-bold underline">Generate Member Report</button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}