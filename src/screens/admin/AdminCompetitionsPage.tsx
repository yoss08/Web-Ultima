import { useState, useEffect } from "react";
import { 
  Trophy, 
  Plus, 
  Calendar, 
  Users, 
  ChevronRight,
  Loader2,
  RefreshCw,
  Layout,
  Check,
  Edit2,
  Trash2,
  AlertCircle,
  DollarSign,
  Target,
  Clock,
  X
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { toast } from "react-hot-toast";
import { useAuth } from "../../services/AuthContext";
import { 
  getTournaments, 
  createTournament, 
  updateTournament, 
  deleteTournament,
  getTournamentStats,
  type Tournament 
} from "../../services/tournamentService";

export function AdminCompetitionsPage() {
  const { user } = useAuth();

  const clubId = user?.club_id ?? user?.user_metadata?.club_id ?? null;

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [stats, setStats] = useState<{ [key: string]: any }>({});
  
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Open" as const,
    skill_level: "All" as const,
    start_date: "",
    end_date: "",
    registration_deadline: "",
    max_players: 32,
    prize_pool: "$0",
    entry_fee: 0,
    competition_type: "Open",
    rules_text: "",
  });

  const fetchTournaments = async () => {
    if (!clubId) return;
    try {
      setLoading(true);
      const data = await getTournaments({ clubId });
      setTournaments(data);
      
      // Fetch stats for each tournament
      const newStats: { [key: string]: any } = {};
      for (const t of data) {
        try {
          newStats[t.id] = await getTournamentStats(t.id);
        } catch (err) {
          console.error(`Failed to fetch stats for tournament ${t.id}`, err);
        }
      }
      setStats(newStats);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch tournaments");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.start_date || !form.end_date) {
      return toast.error("Please fill all required fields");
    }
    if (!clubId) {
      return toast.error("No club associated with your account. Contact support.");
    }

    try {
      setIsSaving(true);
      const tournamentData = {
        ...form,
        club_id: clubId,
        current_players: 0,
      };
      
      if (editingId) {
        await updateTournament(editingId, tournamentData);
        toast.success("Tournament updated successfully!");
      } else {
        await createTournament(tournamentData);
        toast.success("Tournament created successfully!");
      }
      
      setShowModal(false);
      setEditingId(null);
      resetForm();
      fetchTournaments();
    } catch (error: any) {
      toast.error(error.message || "Failed to save tournament");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (tournament: Tournament) => {
    setForm({
      title: tournament.title,
      description: tournament.description || "",
      status: tournament.status,
      skill_level: tournament.skill_level,
      start_date: tournament.start_date,
      end_date: tournament.end_date || "",
      registration_deadline: tournament.registration_deadline || "",
      max_players: tournament.max_players,
      prize_pool: tournament.prize_pool || "$0",
      entry_fee: tournament.entry_fee || 0,
      competition_type: tournament.competition_type || "Open",
      rules_text: tournament.rules_text || "",
    });
    setEditingId(tournament.id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tournament?")) return;
    
    try {
      await deleteTournament(id);
      toast.success("Tournament deleted successfully");
      fetchTournaments();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete tournament");
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      status: "Open",
      skill_level: "All",
      start_date: "",
      end_date: "",
      registration_deadline: "",
      max_players: 32,
      prize_pool: "$0",
      entry_fee: 0,
      competition_type: "Open",
      rules_text: "",
    });
  };

  useEffect(() => {
    fetchTournaments();
  }, [clubId]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground font-['Playfair_Display']">Tournaments</h1>
          <p className="text-muted-foreground">Create and manage tournaments for your club.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchTournaments}
            className="p-3 bg-card border border-border rounded-xl text-foreground hover:bg-muted/80 transition-all"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <Dialog open={showModal} onOpenChange={(open) => {
            setShowModal(open);
            if (!open) {
              setEditingId(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <button
                disabled={!clubId}
                title={!clubId ? "No club linked to your account" : undefined}
                className="flex items-center gap-2 px-6 h-12 bg-accent text-accent-foreground font-bold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Plus size={20} /> Create Tournament
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold font-['Playfair_Display']">
                  {editingId ? "Edit Tournament" : "New Tournament"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 mt-4 font-['Poppins']">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Spring Open Championship"
                    className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Description</label>
                  <textarea
                    placeholder="Tournament description..."
                    className="w-full h-24 bg-muted border border-border rounded-xl px-4 py-3 text-foreground outline-none focus:border-accent transition-all resize-none"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Start Date *</label>
                    <input
                      type="date"
                      required
                      className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all"
                      value={form.start_date}
                      onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">End Date *</label>
                    <input
                      type="date"
                      required
                      className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all"
                      value={form.end_date}
                      onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Registration Deadline</label>
                  <input
                    type="datetime-local"
                    className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all"
                    value={form.registration_deadline}
                    onChange={(e) => setForm({ ...form, registration_deadline: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Status</label>
                    <select
                      className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all"
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    >
                      <option value="Open">Open</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Finished">Finished</option>
                      <option value="Invite Only">Invite Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Skill Level</label>
                    <select
                      className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all"
                      value={form.skill_level}
                      onChange={(e) => setForm({ ...form, skill_level: e.target.value as any })}
                    >
                      <option value="All">All</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Max Players</label>
                    <input
                      type="number"
                      min="2"
                      max="1000"
                      className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all"
                      value={form.max_players}
                      onChange={(e) => setForm({ ...form, max_players: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Competition Type</label>
                    <input
                      type="text"
                      placeholder="e.g., Open, Invitational"
                      className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all"
                      value={form.competition_type}
                      onChange={(e) => setForm({ ...form, competition_type: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Prize Pool</label>
                    <input
                      type="text"
                      placeholder="e.g., $5000"
                      className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all"
                      value={form.prize_pool}
                      onChange={(e) => setForm({ ...form, prize_pool: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Entry Fee ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all"
                      value={form.entry_fee}
                      onChange={(e) => setForm({ ...form, entry_fee: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Tournament Rules</label>
                  <textarea
                    placeholder="Tournament rules and guidelines..."
                    className="w-full h-24 bg-muted border border-border rounded-xl px-4 py-3 text-foreground outline-none focus:border-accent transition-all resize-none"
                    value={form.rules_text}
                    onChange={(e) => setForm({ ...form, rules_text: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full h-14 bg-accent text-accent-foreground font-bold rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-accent/20 disabled:opacity-60"
                >
                  {isSaving ? <Loader2 className="animate-spin" /> : <Check size={20} />}
                  {editingId ? "Update Tournament" : "Create Tournament"}
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* No club warning */}
      {!clubId && !loading && (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl text-yellow-600 text-sm font-['Poppins'] font-medium flex items-center gap-2">
          <AlertCircle size={16} />
          Your admin account is not linked to a club yet. Contact a Super Admin to assign your club.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-80 bg-card border border-border rounded-[32px] animate-pulse" />
          ))
        ) : tournaments.length === 0 ? (
          <div className="col-span-full py-20 bg-card border-2 border-dashed border-border rounded-[32px] text-center">
            <Trophy size={48} className="text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground">No tournaments yet</h3>
            <p className="text-muted-foreground mt-2 text-sm font-['Poppins']">Create your first tournament to get started.</p>
          </div>
        ) : (
          tournaments.map((t) => {
            const tourStats = stats[t.id];
            return (
              <div key={t.id} className="bg-card border border-border rounded-[32px] p-6 group hover:border-accent/30 transition-all shadow-sm hover:shadow-accent/10 overflow-hidden">
                <div className="flex justify-between items-start mb-4 font-['Poppins']">
                  <div className="p-3 rounded-2xl bg-accent/10">
                    <Trophy size={24} className="text-accent" />
                  </div>
                  <span className={`text-[10px] font-bold uppercase py-1 px-3 rounded-full ${
                    t.status === 'Open' ? 'bg-accent/10 text-accent' :
                    t.status === 'Ongoing' ? 'bg-blue-500/10 text-blue-500' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {t.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-foreground mb-1">{t.title}</h3>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{t.description || "No description"}</p>

                <div className="space-y-2 mb-6 text-sm text-muted-foreground font-['Poppins']">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-accent" />
                    {new Date(t.start_date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-accent" />
                    {tourStats?.currentPlayers || 0} / {t.max_players} Players
                  </div>
                  {t.entry_fee > 0 && (
                    <div className="flex items-center gap-2">
                      <DollarSign size={14} className="text-accent" />
                      ${t.entry_fee}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Target size={14} className="text-accent" />
                    {t.skill_level}
                  </div>
                </div>

                {tourStats && (
                  <div className="mb-4 p-3 bg-muted rounded-xl">
                    <p className="text-xs font-bold text-muted-foreground mb-2">Registration: {tourStats.paidRegistrations}/{tourStats.totalRegistrations}</p>
                    <div className="h-1.5 bg-card rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent transition-all" 
                        style={{ width: `${(tourStats.currentPlayers / t.max_players) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 pt-4 border-t border-border/50">
                  <button 
                    onClick={() => handleEdit(t)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-muted hover:bg-accent hover:text-accent-foreground transition-all text-sm font-semibold"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(t.id)}
                    className="px-3 py-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}