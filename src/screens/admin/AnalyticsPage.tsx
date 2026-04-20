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
  PieChart as PieChartIcon,
  FileSpreadsheet
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

// CSV export utility
function downloadCSV(data: Record<string, any>[], filename: string) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map(row => headers.map(h => {
      const val = row[h];
      return typeof val === "string" && val.includes(",") ? `"${val}"` : val ?? "";
    }).join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function AnalyticsPage() {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [data, setData] = useState({
    monthlyRevenue: [],
    courtUsage: [],
    memberGrowth: [],
    matchDistribution: []
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching analytics:", error);
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const handleExportCSV = async (type: string) => {
    setExporting(true);
    try {
      if (type === "bookings") {
        const { data } = await supabase.from("bookings").select("id, user_id, court_id, booking_date, start_time, end_time, status, result, score, created_at");
        if (data) downloadCSV(data, "bookings_report");
      } else if (type === "players") {
        const { data } = await supabase.from("profiles").select("id, full_name, email, phone, role, created_at");
        if (data) downloadCSV(data, "players_report");
      } else if (type === "courts") {
        const { data } = await supabase.from("courts").select("id, name, type, status, surface, capacity, pricing_peak, pricing_offpeak");
        if (data) downloadCSV(data, "courts_report");
      }
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(false);
    }
  };

  const chartStroke = "currentColor opacity-10";
  const textStroke = "currentColor opacity-50";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header avec Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground font-['Playfair_Display']">Analytics & Reports</h1>
          <p className="text-muted-foreground text-sm font-['Poppins']">Deep dive into club performance and usage patterns.</p>
        </div>
        
        <div className="flex gap-3 flex-wrap font-['Poppins']">
          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl text-foreground text-sm font-semibold">
            <Filter size={18} /> Filter Period
          </button>
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-xl text-sm font-bold hover:scale-105 transition-transform shadow-lg shadow-accent/20">
              {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={18} />} Export
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
              <button onClick={() => handleExportCSV("bookings")} className="w-full text-left px-4 py-3 text-sm font-bold hover:bg-muted flex items-center gap-2 text-foreground">
                <FileSpreadsheet size={14} className="text-accent" /> Bookings CSV
              </button>
              <button onClick={() => handleExportCSV("players")} className="w-full text-left px-4 py-3 text-sm font-bold hover:bg-muted flex items-center gap-2 text-foreground">
                <FileSpreadsheet size={14} className="text-accent" /> Players CSV
              </button>
              <button onClick={() => handleExportCSV("courts")} className="w-full text-left px-4 py-3 text-sm font-bold hover:bg-muted flex items-center gap-2 text-foreground">
                <FileSpreadsheet size={14} className="text-accent" /> Courts CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Graphique 1: Revenus ou Activité Mensuelle */}
        <div className="bg-card border border-border rounded-[32px] p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2 font-['Playfair_Display']">
            <TrendingUp size={20} className="text-accent" /> Monthly Activity
          </h3>
          <div className="h-[300px] w-full flex items-center justify-center font-['Poppins']">
            {loading ? (
              <Loader2 className="animate-spin text-gray-400" />
            ) : data.monthlyRevenue.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartStroke} vertical={false} />
                  <XAxis dataKey="month" stroke="currentColor" className="text-muted-foreground/50" />
                  <YAxis stroke="currentColor" className="text-muted-foreground/50" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-border)', borderRadius: '12px', color: 'var(--theme-foreground)' }}
                  />
                  <Line type="monotone" dataKey="value" stroke="var(--theme-accent)" strokeWidth={3} dot={{ fill: "var(--theme-accent)", r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-sm italic">No activity recorded for this period.</p>
            )}
          </div>
        </div>

        {/* Graphique 2: Utilisation des Courts */}
        <div className="bg-card border border-border rounded-[32px] p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2 font-['Playfair_Display']">
            <BarChart3 size={20} className="text-accent" /> Court Usage %
          </h3>
          <div className="h-[300px] w-full flex items-center justify-center font-['Poppins']">
            {loading ? (
              <Loader2 className="animate-spin text-gray-400" />
            ) : data.courtUsage.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.courtUsage}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartStroke} vertical={false} />
                  <XAxis dataKey="name" stroke="currentColor" className="text-muted-foreground/50" />
                  <YAxis stroke="currentColor" className="text-muted-foreground/50" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-border)', borderRadius: '12px', color: 'var(--theme-foreground)' }}
                    cursor={{ fill: 'var(--theme-muted)', opacity: 0.1 }}
                  />
                  <Bar dataKey="usage" fill="var(--theme-accent)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-sm italic">Waiting for booking data to analyze usage.</p>
            )}
          </div>
        </div>

        {/* Graphique 3: Distribution par type de match */}
        <div className="bg-card border border-border rounded-[32px] p-6 sm:p-8 lg:col-span-2 shadow-sm font-['Poppins']">
          <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2 font-['Playfair_Display']">
            <PieChartIcon size={20} className="text-accent" /> Member Segment Distribution
          </h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            {loading ? (
              <Loader2 className="animate-spin text-gray-400" />
            ) : (
              <div className="text-center font-['Poppins']">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-accent" />
                </div>
                <p className="text-muted-foreground text-sm">Analyze your member database growth and categories here.</p>
                <button className="mt-4 text-accent text-sm font-bold underline hover:text-accent/80 transition-colors">Generate Member Report</button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}