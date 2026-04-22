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
  UserPlus,
  Plus,
  X,
  Check,
  Users,
  Trash2
} from "lucide-react";
import { adminService } from "../../services/adminService";
import { useAuth } from "../../services/AuthContext";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";

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
  
  // Modal state
  const [unassignedCoaches, setUnassignedCoaches] = useState<Coach[]>([]);
  const [unassignedSearch, setUnassignedSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssigning, setIsAssigning] = useState<string | null>(null);

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

  const fetchUnassignedCoaches = async () => {
    try {
      const data = await adminService.getUnassignedCoaches();
      setUnassignedCoaches(data ?? []);
    } catch (error: any) {
      toast.error("Failed to load unassigned coaches");
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, [clubId]);

  const handleAssignCoach = async (coachId: string) => {
    setIsAssigning(coachId);
    try {
      await adminService.assignCoachToClub(coachId);
      toast.success("Coach assigned successfully!");
      setIsModalOpen(false); // Close modal on success
      fetchCoaches();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsAssigning(null);
    }
  };

  const handleUnassignCoach = async (coachId: string) => {
    if (!window.confirm("Are you sure you want to remove this coach from your club?")) return;
    try {
      await adminService.unassignCoachFromClub(coachId);
      toast.success("Coach removed from club");
      fetchCoaches();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const filteredCoaches = coaches.filter(
    (c) =>
      c.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUnassigned = unassignedCoaches.filter(
    (c) =>
      c.full_name?.toLowerCase().includes(unassignedSearch.toLowerCase()) ||
      c.email?.toLowerCase().includes(unassignedSearch.toLowerCase())
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
            <span className="flex items-center gap-1.5 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-[10px] font-bold text-accent font-['Poppins'] uppercase tracking-wider">
              Management
            </span>
          </div>
          <p className="text-muted-foreground text-sm font-['Poppins'] mt-1">
            Coaching staff registered at your club.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Dialog open={isModalOpen} onOpenChange={(open) => {
            setIsModalOpen(open);
            if (open) fetchUnassignedCoaches();
          }}>
            <DialogTrigger asChild>
              <button className="h-12 px-6 bg-accent text-accent-foreground rounded-xl font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-accent/20 font-['Poppins']">
                <UserPlus size={18} /> Add Coach
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-card border border-border rounded-[32px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold font-['Playfair_Display']">Add New Coach</DialogTitle>
              </DialogHeader>
              
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={16} />
                <input
                  type="text"
                  placeholder="Search coaches..."
                  className="w-full h-11 pl-10 pr-4 bg-muted border border-transparent focus:border-accent/50 rounded-xl text-sm outline-none transition-all font-['Poppins']"
                  value={unassignedSearch}
                  onChange={(e) => setUnassignedSearch(e.target.value)}
                />
              </div>

              <div className="space-y-3 mt-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {filteredUnassigned.length === 0 ? (
                  <div className="text-center py-10">
                    <Users size={32} className="mx-auto text-muted-foreground/20 mb-2" />
                    <p className="text-sm text-muted-foreground font-['Poppins']">
                      {unassignedSearch ? "No coaches match your search" : "No unassigned coaches found"}
                    </p>
                  </div>
                ) : (
                  filteredUnassigned.map((coach) => (
                    <div key={coach.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-2xl border border-transparent hover:border-accent/30 transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-bold text-sm">
                          {coach.full_name[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-sm font-['Poppins']">{coach.full_name}</p>
                          <p className="text-[10px] text-muted-foreground font-['Poppins'] uppercase tracking-tight">{coach.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAssignCoach(coach.id)}
                        disabled={isAssigning === coach.id}
                        className="h-9 px-4 bg-accent/10 text-accent rounded-xl text-[10px] font-bold hover:bg-accent hover:text-accent-foreground transition-all flex items-center gap-2 uppercase tracking-widest"
                      >
                        {isAssigning === coach.id ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                        Assign
                      </button>
                    </div>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>

          <button
            onClick={fetchCoaches}
            className="p-3 bg-card border border-border rounded-xl text-foreground hover:bg-muted/80 transition-all shadow-sm"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
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
                  {["Coach", "Contact", "Specialization", "Joined", "Actions"].map((h) => (
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
                    <td className="px-8 py-6">
                      <button
                        onClick={() => handleUnassignCoach(coach.id)}
                        className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Remove from club"
                      >
                        <Trash2 size={18} />
                      </button>
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
