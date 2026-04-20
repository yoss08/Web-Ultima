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
          <h1 className="text-4xl font-bold text-foreground font-['Playfair_Display']">Competitions</h1>
          <p className="text-muted-foreground">Create tournaments and manage championship brackets.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchCompetitions}
            className="p-3 bg-card border border-border rounded-xl text-foreground hover:bg-muted/80 transition-all"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button className="flex items-center gap-2 px-6 bg-accent text-accent-foreground font-bold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-accent/20">
            <Plus size={20} /> Create New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-64 bg-card border border-border rounded-[32px] animate-pulse" />
          ))
        ) : competitions.length === 0 ? (
          <div className="col-span-full py-20 bg-card border-2 border-dashed border-border rounded-[32px] text-center">
            <Trophy size={48} className="text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground">No active competitions</h3>
            <p className="text-muted-foreground mt-2 text-sm font-['Poppins']">Launch your first tournament to see it here.</p>
          </div>
        ) : (
          competitions.map((comp) => (
            <div key={comp.id} className="bg-card border border-border rounded-[32px] p-6 group hover:border-accent/30 transition-all shadow-sm">
                <div className="flex justify-between items-start mb-6 font-['Poppins']">
                  <div className="p-3 rounded-2xl bg-accent/10">
                    <Trophy size={24} className="text-accent" />
                  </div>
                  <span className="text-[10px] font-bold uppercase py-1 px-3 bg-accent/10 text-accent rounded-full">
                    {comp.status}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2">{comp.name}</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-['Poppins']">
                    <Layout size={14} /> {comp.type}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-['Poppins']">
                    <Calendar size={14} /> {new Date(comp.start_date).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-border/50">
                   <div className="flex items-center gap-2 text-sm font-bold text-foreground font-['Poppins']">
                      <Users size={16} className="text-accent" />
                      {comp.participants_count || 0} Registered
                   </div>
                   <button className="p-2 rounded-xl bg-muted group-hover:bg-accent group-hover:text-accent-foreground transition-all">
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
