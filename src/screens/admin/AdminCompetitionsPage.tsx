import { useState, useEffect } from "react";
import { 
  Trophy, 
  Plus, 
  Search, 
  Calendar, 
  Users, 
  ChevronRight,
  Loader2,
  RefreshCw,
  Zap,
  Layout
} from "lucide-react";
import { toast } from "react-hot-toast";

interface Competition {
  id: string | number;
  name: string;
  type: string;
  start_date: string;
  end_date: string;
  status: string;
  participants_count?: number;
}

export function AdminCompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/competitions');
      if (!response.ok) throw new Error("Failed to fetch competitions");
      const data = await response.json();
      setCompetitions(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold dark:text-white font-['Playfair_Display']">Competitions</h1>
          <p className="text-gray-500">Create tournaments and manage championship brackets.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchCompetitions}
            className="p-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl dark:text-white hover:bg-gray-50 transition-all"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button className="flex items-center gap-2 px-6 bg-[#39FF14] text-black font-bold rounded-xl hover:scale-105 transition-transform">
            <Plus size={20} /> Create New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-64 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[32px] animate-pulse" />
          ))
        ) : competitions.length === 0 ? (
          <div className="col-span-full py-20 bg-white dark:bg-white/5 border-2 border-dashed border-gray-100 dark:border-white/10 rounded-[32px] text-center">
            <Trophy size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold dark:text-white">No active competitions</h3>
            <p className="text-gray-500 mt-2 text-sm">Launch your first tournament to see it here.</p>
          </div>
        ) : (
          competitions.map((comp) => (
            <div key={comp.id} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[32px] p-6 group hover:border-[#39FF14]/30 transition-all shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 rounded-2xl bg-[#39FF14]/10 text-[#39FF14]">
                    <Trophy size={24} />
                  </div>
                  <span className="text-[10px] font-bold uppercase py-1 px-3 bg-yellow-500/10 text-yellow-500 rounded-full">
                    {comp.status}
                  </span>
                </div>

                <h3 className="text-xl font-bold dark:text-white mb-2">{comp.name}</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Layout size={14} /> {comp.type}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={14} /> {new Date(comp.start_date).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-white/10">
                   <div className="flex items-center gap-2 text-sm font-bold dark:text-white">
                      <Users size={16} className="text-[#39FF14]" />
                      {comp.participants_count || 0} Registered
                   </div>
                   <button className="p-2 rounded-xl bg-gray-50 dark:bg-white/5 group-hover:bg-[#39FF14] group-hover:text-black transition-all">
                      <ChevronRight size={20} />
                   </button>
                </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
