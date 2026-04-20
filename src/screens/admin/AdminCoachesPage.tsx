import { useState, useEffect } from "react";
import {
  Dumbbell,
  Search,
  Mail,
  Calendar,
  Loader2,
  RefreshCw,
  AlertCircle,
  Lock,
} from "lucide-react";
import { adminService } from "../../services/adminService";
import { useAuth } from "../../services/AuthContext";
import { toast } from "react-hot-toast";

interface Coach {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  specialization?: string;
  avatar_url?: string;
}

export function AdminCoachesPage() {
  const { user } = useAuth();
  const clubId = user?.club_id;

  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCoaches = async () => {
    if (!clubId) return;
    try {
      setLoading(true);
      const data = await adminService.getClubCoaches(clubId);
      setCoaches(data ?? []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, [clubId]);

  const filteredCoaches = coaches.filter(
    (c) =>
      c.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!clubId) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertCircle size={48} className="text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold text-foreground font-['Playfair_Display']">No Club Assigned</h2>
        <p className="text-muted-foreground text-sm mt-2 font-['Poppins']">
          Contact your Super Admin to assign you to a club.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground font-['Playfair_Display']">
              Coaches
            </h1>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-muted border border-border rounded-full text-xs font-bold text-muted-foreground font-['Poppins']">
              <Lock size={11} /> Read-only
            </span>
          </div>
          <p className="text-muted-foreground text-sm font-['Poppins'] mt-1">
            Coaching staff registered at your club.
          </p>
        </div>
        <button
          onClick={fetchCoaches}
          className="p-3 bg-card border border-border rounded-xl text-foreground hover:bg-muted/80 transition-all self-start"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={20}
        />
        <input
          type="text"
          placeholder="Search by name or email..."
          className="w-full h-14 pl-12 pr-4 bg-card border border-border rounded-2xl text-foreground outline-none focus:border-accent transition-all font-['Poppins']"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center font-['Poppins']">
            <Loader2 className="animate-spin text-accent w-10 h-10 mb-4" />
            <p className="text-muted-foreground">Loading coaches...</p>
          </div>
        ) : filteredCoaches.length === 0 ? (
          <div className="p-20 text-center font-['Poppins']">
            <Dumbbell size={44} className="text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground italic">No coaches found for your club.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  {["Coach", "Contact", "Specialization", "Joined"].map((h) => (
                    <th
                      key={h}
                      className="px-8 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-['Poppins']"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredCoaches.map((coach) => (
                  <tr key={coach.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-indigo-400/10 flex items-center justify-center text-indigo-400 font-bold text-base border border-indigo-400/20">
                          {coach.full_name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-foreground font-['Poppins']">
                            {coach.full_name}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Dumbbell size={11} className="text-indigo-400" />
                            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-tight font-['Poppins']">
                              Coach
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground font-['Poppins']">
                        <Mail size={14} className="text-muted-foreground/60" />
                        {coach.email}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm text-muted-foreground font-['Poppins']">
                        {coach.specialization ?? "General"}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground font-['Poppins']">
                        <Calendar size={14} />
                        {new Date(coach.created_at).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
