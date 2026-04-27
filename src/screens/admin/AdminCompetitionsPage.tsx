import { useState, useEffect } from "react";
import {
  Trophy,
  Plus,
  Calendar,
  Users,
  Loader2,
  RefreshCw,
  Edit2,
  Trash2,
  AlertCircle,
  Target,
  Clock,
  Check,
  X,
  ChevronDown,
  UserCheck,
  UserX,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { toast } from "react-hot-toast";
import { useAuth } from "../../services/AuthContext";
import { supabase } from "../../config/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Tournament {
  id: string;
  title: string;
  description?: string;
  status: string;
  skill_level: string;
  start_date: string;
  end_date?: string;
  registration_deadline?: string;
  max_players: number;
  prize_pool?: string;
  entry_fee?: number;
  competition_type?: string;
  rules_text?: string;
  club_id?: string;
  current_players?: number;
}

interface Registration {
  id: string;
  player_id: string;
  tournament_id: string;
  status: string; // 'en attente' | 'accepté' | 'refusé'
  registered_at: string;
  profiles?: { full_name?: string; skill_level?: string; phone?: string };
  tournaments?: { title?: string };
}

const EMPTY_FORM = {
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
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function regStatusCfg(status: string) {
  switch (status) {
    case "accepté":
      return { label: "Accepted", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30" };
    case "refusé":
      return { label: "Rejected", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30" };
    default:
      return { label: "Pending", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" };
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AdminCompetitionsPage() {
  const { user } = useAuth();
  const clubId: string | null = user?.club_id ?? user?.user_metadata?.club_id ?? null;

  // Tournaments state
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  // Registrations state
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [regsLoading, setRegsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [expandedTournament, setExpandedTournament] = useState<string | null>(null);
  const [updatingReg, setUpdatingReg] = useState<string | null>(null);

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const fetchTournaments = async () => {
    if (!clubId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("tournaments")
        .select("*")
        .eq("club_id", clubId)
        .order("start_date", { ascending: false });
      if (error) throw error;

      // Enrich with accepted players count
      const enriched = await Promise.all(
        (data ?? []).map(async (t: any) => {
          const { count } = await supabase
            .from("tournament_registrations")
            .select("id", { count: "exact", head: true })
            .eq("tournament_id", t.id)
            .eq("status", "accepté");
          return { ...t, current_players: count ?? 0 };
        })
      );
      setTournaments(enriched);
    } catch (err: any) {
      toast.error(err.message || "Failed to load tournaments");
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    if (!clubId) return;
    setRegsLoading(true);
    try {
      // Get all tournament ids for this club
      const { data: clubTournaments } = await supabase
        .from("tournaments")
        .select("id")
        .eq("club_id", clubId);

      const ids = (clubTournaments ?? []).map((t: any) => t.id);
      if (ids.length === 0) { setRegistrations([]); return; }

      const { data, error } = await supabase
        .from("tournament_registrations")
        .select("*, profiles!player_id(full_name, skill_level, phone), tournaments!tournament_id(title)")
        .in("tournament_id", ids)
        .order("registered_at", { ascending: false });

      if (error) throw error;
      setRegistrations((data ?? []) as Registration[]);
    } catch (err: any) {
      toast.error(err.message || "Failed to load registrations");
    } finally {
      setRegsLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
    fetchRegistrations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubId]);

  // ── Tournament CRUD ───────────────────────────────────────────────────────

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.start_date) return toast.error("Title and start date are required");
    if (!clubId) return toast.error("No club associated with your account");

    setIsSaving(true);
    try {
      const payload = { ...form, club_id: clubId };
      if (editingId) {
        const { error } = await supabase.from("tournaments").update(payload).eq("id", editingId);
        if (error) throw error;
        toast.success("Tournament updated!");
      } else {
        const { error } = await supabase.from("tournaments").insert({ ...payload, current_players: 0 });
        if (error) throw error;
        toast.success("Tournament created!");
      }
      setShowModal(false);
      setEditingId(null);
      setForm({ ...EMPTY_FORM });
      fetchTournaments();
    } catch (err: any) {
      toast.error(err.message || "Failed to save tournament");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (t: Tournament) => {
    setForm({
      title: t.title,
      description: t.description ?? "",
      status: t.status,
      skill_level: t.skill_level ?? "All",
      start_date: t.start_date,
      end_date: t.end_date ?? "",
      registration_deadline: t.registration_deadline ?? "",
      max_players: t.max_players,
      prize_pool: t.prize_pool ?? "$0",
      entry_fee: t.entry_fee ?? 0,
      competition_type: t.competition_type ?? "Open",
      rules_text: t.rules_text ?? "",
    });
    setEditingId(t.id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this tournament? This cannot be undone.")) return;
    try {
      const { error } = await supabase.from("tournaments").delete().eq("id", id);
      if (error) throw error;
      toast.success("Tournament deleted");
      fetchTournaments();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  };

  // ── Registration Actions ──────────────────────────────────────────────────

  const updateRegistration = async (regId: string, newStatus: string) => {
    setUpdatingReg(regId);
    try {
      const { error } = await supabase
        .from("tournament_registrations")
        .update({ status: newStatus })
        .eq("id", regId);
      if (error) throw error;
      toast.success(newStatus === "accepté" ? "Player accepted!" : "Player rejected");
      await fetchRegistrations();
      await fetchTournaments(); // refresh player count
    } catch (err: any) {
      toast.error(err.message || "Failed to update");
    } finally {
      setUpdatingReg(null);
    }
  };

  const deleteRegistration = async (regId: string) => {
    if (!confirm("Remove this registration?")) return;
    try {
      const { error } = await supabase.from("tournament_registrations").delete().eq("id", regId);
      if (error) throw error;
      toast.success("Registration removed");
      await fetchRegistrations();
      await fetchTournaments();
    } catch (err: any) {
      toast.error(err.message || "Failed to remove");
    }
  };

  // ── Filtered registrations ─────────────────────────────────────────────────

  const filteredRegs = registrations.filter((r) => {
    if (statusFilter === "All") return true;
    if (statusFilter === "en attente") return r.status === "en attente";
    if (statusFilter === "accepté") return r.status === "accepté";
    if (statusFilter === "refusé") return r.status === "refusé";
    return true;
  });

  // Group registrations by tournament for expanded view
  const regsByTournament: Record<string, Registration[]> = {};
  filteredRegs.forEach((r) => {
    if (!regsByTournament[r.tournament_id]) regsByTournament[r.tournament_id] = [];
    regsByTournament[r.tournament_id].push(r);
  });

  // ── Render ─────────────────────────────────────────────────────────────────

  const inputCls =
    "w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all font-['Poppins'] text-sm";

  return (
    <div className="space-y-10 animate-in fade-in duration-500">

      {/* ── Section 1: Tournaments ── */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground font-['Playfair_Display']">Tournaments</h1>
            <p className="text-muted-foreground font-['Poppins'] text-sm">Create and manage your club's competitions.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { fetchTournaments(); fetchRegistrations(); }}
              className="p-3 bg-card border border-border rounded-xl text-foreground hover:bg-muted/80 transition-all"
            >
              <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>

            <Dialog open={showModal} onOpenChange={(open) => {
              setShowModal(open);
              if (!open) { setEditingId(null); setForm({ ...EMPTY_FORM }); }
            }}>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 px-5 py-3 bg-accent text-accent-foreground font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-accent/20 font-['Poppins'] text-sm">
                  <Plus size={18} /> New Tournament
                </button>
              </DialogTrigger>

              <DialogContent className="bg-card border-border rounded-[32px] max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-foreground font-['Playfair_Display']">
                    {editingId ? "Edit Tournament" : "New Tournament"}
                  </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSave} className="space-y-4 mt-4">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block font-['Poppins']">Title *</label>
                    <input className={inputCls} placeholder="Tournament name" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block font-['Poppins']">Description</label>
                    <textarea
                      placeholder="Brief description..."
                      className="w-full h-20 bg-muted border border-border rounded-xl px-4 py-3 text-foreground outline-none focus:border-accent transition-all resize-none font-['Poppins'] text-sm"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block font-['Poppins']">Start *</label>
                      <input type="date" className={inputCls} value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block font-['Poppins']">End</label>
                      <input type="date" className={inputCls} value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block font-['Poppins']">Deadline</label>
                      <input type="date" className={inputCls} value={form.registration_deadline} onChange={(e) => setForm({ ...form, registration_deadline: e.target.value })} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block font-['Poppins']">Status</label>
                      <select className={inputCls} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                        <option value="Open">Open</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Finished">Finished</option>
                        <option value="Invite Only">Invite Only</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block font-['Poppins']">Skill Level</label>
                      <select className={inputCls} value={form.skill_level} onChange={(e) => setForm({ ...form, skill_level: e.target.value })}>
                        <option value="All">All</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block font-['Poppins']">Max Players</label>
                      <input type="number" min="2" max="1000" className={inputCls} value={form.max_players} onChange={(e) => setForm({ ...form, max_players: parseInt(e.target.value) || 32 })} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block font-['Poppins']">Entry Fee ($)</label>
                      <input type="number" min="0" step="0.01" className={inputCls} value={form.entry_fee} onChange={(e) => setForm({ ...form, entry_fee: parseFloat(e.target.value) || 0 })} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block font-['Poppins']">Prize Pool</label>
                      <input type="text" placeholder="e.g., $5000" className={inputCls} value={form.prize_pool} onChange={(e) => setForm({ ...form, prize_pool: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block font-['Poppins']">Competition Type</label>
                      <input type="text" placeholder="e.g., Open" className={inputCls} value={form.competition_type} onChange={(e) => setForm({ ...form, competition_type: e.target.value })} />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block font-['Poppins']">Rules</label>
                    <textarea
                      placeholder="Tournament rules..."
                      className="w-full h-24 bg-muted border border-border rounded-xl px-4 py-3 text-foreground outline-none focus:border-accent transition-all resize-none font-['Poppins'] text-sm"
                      value={form.rules_text}
                      onChange={(e) => setForm({ ...form, rules_text: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full h-14 bg-accent text-accent-foreground font-bold rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-accent/20 disabled:opacity-60 font-['Poppins']"
                  >
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                    {editingId ? "Update Tournament" : "Create Tournament"}
                  </button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {!clubId && !loading && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl text-yellow-500 text-sm font-['Poppins'] flex items-center gap-2">
            <AlertCircle size={16} />
            Your account is not linked to a club. Contact a Super Admin.
          </div>
        )}

        {/* Tournament grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-72 bg-card border border-border rounded-[32px] animate-pulse" />
              ))
            : tournaments.length === 0
            ? (
              <div className="col-span-full py-20 bg-card border-2 border-dashed border-border rounded-[32px] text-center">
                <Trophy size={48} className="text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground">No tournaments yet</h3>
                <p className="text-muted-foreground text-sm mt-2 font-['Poppins']">Create your first tournament above.</p>
              </div>
            )
            : tournaments.map((t) => (
              <div key={t.id} className="bg-card border border-border rounded-[32px] p-6 flex flex-col gap-4 hover:border-accent/30 transition-all shadow-sm group">
                <div className="flex justify-between items-start">
                  <div className="p-3 rounded-2xl bg-accent/10">
                    <Trophy size={22} className="text-accent" />
                  </div>
                  <span className={`text-[10px] font-bold uppercase py-1 px-3 rounded-full font-['Poppins'] ${
                    t.status === "Open" ? "bg-accent/10 text-accent"
                    : t.status === "Ongoing" ? "bg-blue-500/10 text-blue-400"
                    : "bg-muted text-muted-foreground"
                  }`}>
                    {t.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-foreground font-['Playfair_Display']">{t.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 font-['Poppins']">{t.description || "No description"}</p>
                </div>

                <div className="space-y-1.5 text-sm text-muted-foreground font-['Poppins']">
                  <div className="flex items-center gap-2"><Calendar size={13} className="text-accent" /> {formatDate(t.start_date)}</div>
                  <div className="flex items-center gap-2"><Users size={13} className="text-accent" /> {t.current_players ?? 0} / {t.max_players} accepted</div>
                  {t.skill_level && <div className="flex items-center gap-2"><Target size={13} className="text-accent" /> {t.skill_level}</div>}
                  {t.registration_deadline && <div className="flex items-center gap-2"><Clock size={13} className="text-amber-400" /><span className="text-amber-400">Deadline {formatDate(t.registration_deadline)}</span></div>}
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground font-['Poppins']">
                    {Math.round(((t.current_players ?? 0) / t.max_players) * 100)}% filled
                  </p>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-accent transition-all" style={{ width: `${Math.min(((t.current_players ?? 0) / t.max_players) * 100, 100)}%` }} />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                  <button
                    onClick={() => handleEdit(t)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-muted hover:bg-accent hover:text-accent-foreground transition-all text-sm font-semibold font-['Poppins']"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* ── Section 2: Registrations ── */}
      <div className="space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground font-['Playfair_Display']">Player Registrations</h2>
            <p className="text-muted-foreground font-['Poppins'] text-sm">Review and approve player requests.</p>
          </div>

          {/* Status filter */}
          <div className="flex gap-2 font-['Poppins'] text-sm flex-wrap">
            {["All", "en attente", "accepté", "refusé"].map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-4 py-1.5 rounded-lg font-semibold capitalize transition-all ${
                  statusFilter === f
                    ? "bg-accent text-accent-foreground"
                    : "bg-card border border-border text-muted-foreground hover:border-accent/30"
                }`}
              >
                {f === "en attente" ? "Pending" : f === "accepté" ? "Accepted" : f === "refusé" ? "Rejected" : "All"}
                {f !== "All" && (
                  <span className="ml-1.5 text-[10px]">
                    ({registrations.filter((r) => r.status === f).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {regsLoading ? (
          <div className="space-y-3">
            {Array(3).fill(0).map((_, i) => <div key={i} className="h-16 bg-card border border-border rounded-2xl animate-pulse" />)}
          </div>
        ) : filteredRegs.length === 0 ? (
          <div className="py-16 bg-card border-2 border-dashed border-border rounded-[32px] text-center">
            <Users size={40} className="text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-['Poppins'] text-sm">No registrations found.</p>
          </div>
        ) : (
          /* Group by tournament */
          <div className="space-y-4">
            {Object.entries(regsByTournament).map(([tId, regs]) => {
              const tournamentTitle = regs[0]?.tournaments?.title ?? "Unknown Tournament";
              const isExpanded = expandedTournament === tId;
              return (
                <div key={tId} className="bg-card border border-border rounded-[28px] overflow-hidden">
                  {/* Tournament header */}
                  <button
                    onClick={() => setExpandedTournament(isExpanded ? null : tId)}
                    className="w-full flex items-center justify-between p-5 hover:bg-muted/30 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-accent/10">
                        <Trophy size={16} className="text-accent" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-foreground font-['Poppins'] text-sm">{tournamentTitle}</p>
                        <p className="text-xs text-muted-foreground font-['Poppins']">{regs.length} registration{regs.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full font-['Poppins']">
                        {regs.filter(r => r.status === 'en attente').length} pending
                      </span>
                      <ChevronDown size={16} className={`text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {/* Expanded rows */}
                  {isExpanded && (
                    <div className="border-t border-border/50 divide-y divide-border/30">
                      {regs.map((reg) => {
                        const cfg = regStatusCfg(reg.status);
                        return (
                          <div key={reg.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/20 transition-all">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground font-['Poppins']">
                                {(reg.profiles?.full_name ?? "?")[0].toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground font-['Poppins']">
                                  {reg.profiles?.full_name ?? "Unknown"}
                                </p>
                                <p className="text-[11px] text-muted-foreground font-['Poppins']">
                                  {reg.profiles?.skill_level ?? "—"} · {new Date(reg.registered_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Status badge */}
                              <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border font-['Poppins'] ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                                {cfg.label}
                              </span>

                              {/* Actions */}
                              {reg.status !== "accepté" && (
                                <button
                                  onClick={() => updateRegistration(reg.id, "accepté")}
                                  disabled={updatingReg === reg.id}
                                  title="Accept"
                                  className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all disabled:opacity-50"
                                >
                                  {updatingReg === reg.id ? <Loader2 size={13} className="animate-spin" /> : <UserCheck size={13} />}
                                </button>
                              )}
                              {reg.status !== "refusé" && (
                                <button
                                  onClick={() => updateRegistration(reg.id, "refusé")}
                                  disabled={updatingReg === reg.id}
                                  title="Reject"
                                  className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50"
                                >
                                  <UserX size={13} />
                                </button>
                              )}
                              <button
                                onClick={() => deleteRegistration(reg.id)}
                                title="Remove"
                                className="p-1.5 rounded-lg hover:bg-muted transition-all text-muted-foreground hover:text-red-400"
                              >
                                <X size={13} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}