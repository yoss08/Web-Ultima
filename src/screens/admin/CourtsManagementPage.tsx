import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  AlertCircle, 
  Wrench, 
  Plus, 
  Loader2, 
  RefreshCw,
  Trash2
} from "lucide-react";
import { supabase } from "../../config/supabase"; 
import { Link } from "react-router";
import { toast } from "react-hot-toast";

type CourtStatus = "available" | "in-use" | "maintenance";

interface Court {
  id: string | number;
  name: string;
  status: CourtStatus;
  type: string;
  current_match?: string;
}

export function CourtsManagementPage() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Récupération des données réelles
  const fetchCourts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courts')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setCourts(data || []);
    } catch (error: any) {
      toast.error("Error fetching courts: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourts();
  }, []);

  // 2. Action Admin : Changer le statut (Maintenance / Available)
  const toggleMaintenance = async (courtId: string | number, currentStatus: CourtStatus) => {
    const newStatus = currentStatus === "maintenance" ? "available" : "maintenance";
    
    try {
      const { error } = await supabase
        .from('courts')
        .update({ status: newStatus })
        .eq('id', courtId);

      if (error) throw error;
      
      // Mise à jour locale de l'état
      setCourts(courts.map(c => c.id === courtId ? { ...c, status: newStatus } : c));
      toast.success(`Court set to ${newStatus}`);
    } catch (error: any) {
      toast.error("Failed to update status");
    }
  };

  const getStatusConfig = (status: CourtStatus) => {
    switch (status) {
      case "available":
        return { color: "#39FF14", icon: CheckCircle, label: "Available", bg: "bg-[#39FF14]/10" };
      case "in-use":
        return { color: "#00E5FF", icon: AlertCircle, label: "In Use", bg: "bg-[#00E5FF]/10" };
      case "maintenance":
        return { color: "#FF3B30", icon: Wrench, label: "Maintenance", bg: "bg-[#FF3B30]/10" };
      default:
        return { color: "#999", icon: AlertCircle, label: "Unknown", bg: "bg-gray-500/10" };
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header avec bouton d'ajout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold dark:text-white font-['Playfair_Display']">Courts Management</h1>
          <p className="text-gray-500">Real-time status and maintenance control.</p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={fetchCourts}
            className="p-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl dark:text-white hover:bg-gray-50 transition-all"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <Link 
            to="/dashboard/admin/courts-config" 
            className="flex items-center gap-2 px-6 bg-[#39FF14] text-black font-bold rounded-xl hover:scale-105 transition-transform"
          >
            <Plus size={20} /> Add Court
          </Link>
        </div>
      </div>

      {/* Grid des Courts */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-[#39FF14] animate-spin mb-4" />
          <p className="text-gray-500">Loading your infrastructure...</p>
        </div>
      ) : courts.length === 0 ? (
        <div className="bg-white dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[32px] p-20 text-center">
          <h2 className="text-xl font-bold dark:text-white">No courts configured</h2>
          <p className="text-gray-500 mt-2">Click "Add Court" to initialize your tennis club facilities.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courts.map((court) => {
            const config = getStatusConfig(court.status);
            const Icon = config.icon;

            return (
              <motion.div
                key={court.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[28px] p-6 relative overflow-hidden group shadow-sm hover:shadow-xl transition-all"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold dark:text-white group-hover:text-[#39FF14] transition-colors">
                      {court.name}
                    </h3>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">{court.type}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${config.bg}`}>
                    <Icon size={20} style={{ color: config.color }} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }}></span>
                    <span className="text-sm font-bold dark:text-white uppercase tracking-tighter">
                      {config.label}
                    </span>
                  </div>

                  {court.status === "in-use" ? (
                    <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-500/10">
                      <p className="text-[10px] text-blue-500 font-bold uppercase">Current Match</p>
                      <p className="text-sm dark:text-white font-medium truncate">{court.current_match || "No data"}</p>
                    </div>
                  ) : (
                    <div className="h-[52px] flex items-center">
                       <p className="text-sm text-gray-500 italic">
                         {court.status === "maintenance" ? "Under technical review" : "Available for booking"}
                       </p>
                    </div>
                  )}
                </div>

                {/* --- ACTIONS ADMIN --- */}
                <div className="mt-6 pt-6 border-t border-gray-50 dark:border-white/5 flex gap-2">
                  <button 
                    onClick={() => toggleMaintenance(court.id, court.status)}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
                      court.status === "maintenance" 
                      ? "bg-[#39FF14] text-black" 
                      : "bg-gray-100 dark:bg-white/10 dark:text-white hover:bg-red-500 hover:text-white"
                    }`}
                  >
                    {court.status === "maintenance" ? "End Maintenance" : "Set Maintenance"}
                  </button>
                  <button className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}