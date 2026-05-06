import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Mail,
  Calendar,
  Loader2,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  Star,
  Plus,
  Trash2,
  Lock,
  UserPlus,
  Dumbbell,
  ShieldAlert,
} from "lucide-react";
import { adminService } from "../../services/adminService";
import { useAuth } from "../../services/AuthContext";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "../../components/ui/dialog";
import { confirmDialog } from "../../components/ui/ConfirmDialog";

interface Member {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  avatar_url?: string;
  role: string;
}

export function AdminPlayersPage() {
  const { user } = useAuth();
  const clubId = user?.club_id;

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'player' | 'coach'>('all');

  // Modal state for assigning coaches
  const [unassignedCoaches, setUnassignedCoaches] = useState<Member[]>([]);
  const [unassignedSearch, setUnassignedSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssigning, setIsAssigning] = useState<string | null>(null);

  const fetchMembers = async () => {
    if (!clubId) return;
    try {
      setLoading(true);
      const data = await adminService.getStaffAndPlayers(clubId);
      setMembers((data as any) ?? []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnassignedCoaches = async () => {
    try {
      const data = await adminService.getUnassignedCoaches();
      setUnassignedCoaches((data as any) ?? []);
    } catch (error: any) {
      toast.error("Failed to load unassigned coaches");
    }
  };

  const handleAssignCoach = async (coachId: string) => {
    setIsAssigning(coachId);
    try {
      await adminService.assignCoachToClub(coachId);
      toast.success("Coach assigned successfully!");
      setIsModalOpen(false);
      fetchMembers();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsAssigning(null);
    }
  };

  const handleUnassignCoach = async (coachId: string) => {
    const ok = await confirmDialog({ 
      title: "Remove Coach", 
      message: "Are you sure you want to remove this coach from your club?", 
      confirmLabel: "Remove", 
      variant: "danger" 
    });
    if (!ok) return;
    try {
      await adminService.unassignCoachFromClub(coachId);
      toast.success("Coach removed from club");
      fetchMembers();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [clubId]);

  const filteredMembers = members.filter(
    (m) =>
      (roleFilter === 'all' || m.role === roleFilter) &&
      (m.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Sort: Admins first, then Coaches, then Players
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    const roleOrder: Record<string, number> = { admin: 0, coach: 1, player: 2 };
    return (roleOrder[a.role] ?? 99) - (roleOrder[b.role] ?? 99);
  });

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
              Staff & Players
            </h1>
          </div>
          <p className="text-muted-foreground text-sm font-['Poppins'] mt-1">
            Manage your club administrators and registered players.
          </p>
        </div>
        <button
          onClick={fetchMembers}
          className="p-3 bg-card border border-border rounded-xl text-foreground hover:bg-muted/80 transition-all shadow-sm self-start"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full h-14 pl-12 pr-4 bg-card border border-border rounded-2xl text-foreground outline-none focus:border-accent transition-all shadow-sm font-['Poppins']"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex bg-card border border-border rounded-2xl p-1 h-14 shadow-sm">
          {(['all', 'player', 'coach', 'admin'] as const).map((filterValue) => (
            <button
              key={filterValue}
              onClick={() => setRoleFilter(filterValue)}
              className={`px-6 py-2 rounded-xl text-xs font-bold capitalize transition-all font-['Poppins'] ${
                roleFilter === filterValue
                  ? 'bg-accent text-black shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {filterValue === 'admin' ? 'Admin' : filterValue === 'coach' ? 'Coach' : filterValue === 'player' ? 'Player' : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center font-['Poppins']">
            <Loader2 className="animate-spin text-accent w-10 h-10 mb-4" />
            <p className="text-muted-foreground">Loading members...</p>
          </div>
        ) : sortedMembers.length === 0 ? (
          <div className="p-20 text-center font-['Poppins']">
            <Users size={44} className="text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground italic">No members found.</p>
          </div>
        ) : (
          <>
            {/* Mobile View */}
            <div className="p-4 space-y-4 sm:hidden">
              {sortedMembers.map((member) => (
                <div key={member.id} className="bg-card border border-border/50 rounded-[28px] p-5 space-y-4 shadow-sm hover:border-accent/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg border group-hover:scale-105 transition-transform ${
                      member.role === 'admin' 
                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                        : 'bg-accent/10 text-accent border-accent/20'
                    }`}>
                      {member.full_name?.[0]?.toUpperCase() || <Users size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-base font-['Poppins']">
                        {member.full_name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {member.role === 'admin' ? (
                          <div className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">
                            <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest font-['Poppins']">
                              Admin
                            </span>
                          </div>
                        ) : member.role === 'coach' ? (
                          <div className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20">
                            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest font-['Poppins']">
                              Coach
                            </span>
                          </div>
                        ) : (
                          <div className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest font-['Poppins']">
                              Player
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/20">
                    <button className="w-9 h-9 flex items-center justify-center text-red-400 bg-red-400/5 hover:bg-red-400/10 rounded-lg transition-all border border-red-400/10">
                      <Lock size={16} />
                    </button>
                    <button className="w-9 h-9 flex items-center justify-center text-lime-400 bg-lime-400/5 hover:bg-lime-400/10 rounded-lg transition-all border border-lime-400/10">
                      <Search size={16} />
                    </button>
                    {member.role === 'coach' ? (
                      <button 
                        onClick={() => handleUnassignCoach(member.id)}
                        className="w-9 h-9 flex items-center justify-center text-red-500 bg-red-500/5 hover:bg-red-500/10 rounded-lg transition-all border border-red-500/10"
                      >
                        <Trash2 size={16} />
                      </button>
                    ) : (
                      <button className="w-9 h-9 flex items-center justify-center text-red-500 bg-red-500/5 hover:bg-red-500/10 rounded-lg transition-all border border-red-500/10">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    {["Member", "Role", "Contact", "Joined", "Actions"].map((h) => (
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
                  {sortedMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-base border ${
                            member.role === 'admin' 
                              ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' 
                              : member.role === 'coach'
                              ? 'bg-indigo-500/10 text-indigo-400 border-indigo-400/20'
                              : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          }`}>
                            {member.full_name?.[0]?.toUpperCase() || <Users size={20} />}
                          </div>
                          <div>
                            <p className="font-bold text-foreground font-['Poppins']">
                              {member.full_name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {member.role === 'admin' ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500">
                            <Star size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-widest font-['Poppins']">Admin</span>
                          </div>
                        ) : member.role === 'coach' ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
                            <Dumbbell size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-widest font-['Poppins']">Coach</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                            <ShieldCheck size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-widest font-['Poppins']">Player</span>
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-['Poppins']">
                          <Mail size={14} className="text-muted-foreground/60" />
                          {member.email}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-['Poppins']">
                          <Calendar size={14} />
                          {new Date(member.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          {member.role === 'coach' ? (
                            <button 
                              onClick={() => handleUnassignCoach(member.id)}
                              className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                              title="Remove Coach"
                            >
                              <Trash2 size={18} />
                            </button>
                          ) : (
                            <button className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Assign Coach Floating Button */}
      <Dialog open={isModalOpen} onOpenChange={(open) => {
        setIsModalOpen(open);
        if (open) fetchUnassignedCoaches();
      }}>
        <DialogTrigger asChild>
          <button className="fixed bottom-8 right-8 h-12 px-6 bg-accent text-black rounded-xl font-bold flex items-center gap-2 hover:scale-[1.05] active:scale-95 transition-all shadow-lg shadow-accent/20 font-['Poppins'] z-50">
            <UserPlus size={20} strokeWidth={2.5} />
            <span className="text-sm tracking-tight">Assign Coach</span>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-card border border-border rounded-[32px] p-0 overflow-hidden">
          <div className="p-8 bg-muted/30 border-b border-border">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold font-['Playfair_Display']">Assign New Coach</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground font-['Poppins'] mt-1">
                Search and add coaches to your club
              </DialogDescription>
            </DialogHeader>
            
            <div className="relative mt-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
              <input
                type="text"
                placeholder="Search coaches by name or email..."
                className="w-full h-12 pl-12 pr-4 bg-background border border-border focus:border-lime-500/50 rounded-xl text-sm outline-none transition-all font-['Poppins']"
                value={unassignedSearch}
                onChange={(e) => setUnassignedSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {filteredUnassigned.length === 0 ? (
              <div className="text-center py-12">
                <Users size={48} className="mx-auto text-muted-foreground/10 mb-4" />
                <p className="text-sm text-muted-foreground font-['Poppins']">
                  {unassignedSearch ? "No coaches match your search" : "No unassigned coaches available"}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredUnassigned.map((coach) => (
                  <div key={coach.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border border-transparent hover:border-lime-500/30 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-base">
                        {coach.full_name[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-sm font-['Poppins']">{coach.full_name}</p>
                        <p className="text-[11px] text-muted-foreground font-['Poppins'] truncate max-w-[150px]">{coach.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAssignCoach(coach.id)}
                      disabled={isAssigning === coach.id}
                      className="h-10 px-5 bg-accent text-black rounded-xl text-xs font-bold hover:opacity-90 transition-all flex items-center gap-2 uppercase tracking-tight"
                    >
                      {isAssigning === coach.id ? <Loader2 size={14} className="animate-spin" /> : "Add"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

