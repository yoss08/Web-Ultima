import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Zap,
  Plus,
  X,
  Loader2,
  RefreshCw,
  Calendar,
  Users,
  Layout,
  Clock,
  CheckCircle2,
  CircleDot,
  Edit2,
  Trash2,
  Target,
  Check,
  ChevronDown,
  UserCheck,
  UserX,
} from "lucide-react";
import { adminService } from "../../services/adminService";
import { superAdminService } from "../../services/superAdminService";
import { supabase } from "../../config/supabase";
import { toast } from "react-hot-toast";
import { confirmDialog } from "../../components/ui/ConfirmDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Match {
  id: string | number;
  player1_name?: string;
  player2_name?: string;
  player3_name?: string;
  player4_name?: string;
  court_name?: string;
  match_type: string;
  status: string;
  created_at: string;
  score?: string;
}

interface Tournament {
  id: string;
  title: string;
  description?: string;
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
  clubs?: { name?: string };
}

interface Registration {
  id: string;
  player_id: string;
  tournament_id: string;
  status: string; // 'en attente' | 'accepté' | 'refusé'
  registered_at: string;
  profiles?: { full_name?: string; skill_level?: string; phone?: string };
  tournaments?: { title?: string; clubs?: { name?: string } };
}

type Tab = "matches" | "competitions";

const EMPTY_TOURNAMENT_FORM = {
  title: "",
  description: "",
  start_date: "",
  end_date: "",
  registration_deadline: "",
  max_players: 32,
  prize_pool: "$0",
  entry_fee: 0,
  competition_type: "Open",
  rules_text: "",
  club_id: "",
};

// ─── Status helpers ────────────────────────────────────────────────────────────

function matchStatusConfig(status: string) {
  switch (status) {
    case "live":
      return { label: "Live", icon: CircleDot, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", pulse: true };
    case "completed":
      return { label: "Completed", icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30", pulse: false };
    default:
      return { label: "Pending", icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30", pulse: false };
  }
}

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

// ─── Main Component ────────────────────────────────────────────────────────────

export function MatchCompetitionManagement() {
  const [tab, setTab] = useState<Tab>("matches");
  const [clubs, setClubs] = useState<any[]>([]);

  // ── Matches state ──
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchLoading, setMatchLoading] = useState(false);
  const [availablePlayers, setAvailablePlayers] = useState<any[]>([]);
  const [availableCourts, setAvailableCourts] = useState<any[]>([]);
  const [matchForm, setMatchForm] = useState({
    player1_id: "",
    player2_id: "",
    player3_id: "",
    player4_id: "",
    court_id: "",
    club_id: "",
    match_type: "singles",
  });

  // ── Tournaments state ──
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [compLoading, setCompLoading] = useState(true);
  const [showCompModal, setShowCompModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSavingComp, setIsSavingComp] = useState(false);
  const [compForm, setCompForm] = useState({ ...EMPTY_TOURNAMENT_FORM });

  // ── Registrations state ──
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [regsLoading, setRegsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [expandedTournament, setExpandedTournament] = useState<string | null>(null);
  const [updatingReg, setUpdatingReg] = useState<string | null>(null);

  // ── Fetch ────────────────────────────────────────────────────────────────────

  const fetchClubs = async () => {
    try {
      const data = await superAdminService.getAllClubs();
      setClubs(data || []);
    } catch {
      toast.error("Failed to load clubs");
    }
  };

  const fetchMatches = async () => {
    setMatchesLoading(true);
    try {
      const { data, error } = await supabase
        .from("matches")
        .select(`
          id, match_type, status, created_at, score,
          player1:player1_id(full_name),
          player2:player2_id(full_name),
          player3:player3_id(full_name),
          player4:player4_id(full_name),
          court:court_id(name)
        `)
        .order("created_at", { ascending: false })
        .limit(30);
      if (error) throw error;
      const mapped = (data ?? []).map((m: any) => ({
        id: m.id,
        match_type: m.match_type,
        status: m.status,
        created_at: m.created_at,
        score: m.score,
        player1_name: m.player1?.full_name ?? "—",
        player2_name: m.player2?.full_name ?? "—",
        player3_name: m.player3?.full_name,
        player4_name: m.player4?.full_name,
        court_name: m.court?.name ?? "—",
      }));
      setMatches(mapped);
    } catch {
      toast.error("Failed to load matches");
    } finally {
      setMatchesLoading(false);
    }
  };

  const fetchTournaments = async () => {
    setCompLoading(true);
    try {
      const { data, error } = await supabase
        .from("tournaments")
        .select("*, clubs(name)")
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
      setCompLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    setRegsLoading(true);
    try {
      const { data, error } = await supabase
        .from("tournament_registrations")
        .select("*, profiles!player_id(full_name, phone), tournaments!tournament_id(title, clubs(name))")
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
    fetchClubs();
    fetchMatches();
    fetchTournaments();
    fetchRegistrations();
  }, []);

  // ── Match actions ────────────────────────────────────────────────────────────

  const handleClubChangeForMatch = async (clubId: string) => {
    setMatchForm({ ...matchForm, club_id: clubId, player1_id: "", player2_id: "", player3_id: "", player4_id: "", court_id: "" });
    if (!clubId) return;
    setMatchLoading(true);
    try {
      const [players, courts] = await Promise.all([
        adminService.getClubPlayers(clubId),
        adminService.getClubCourts(clubId),
      ]);
      setAvailablePlayers(players ?? []);
      setAvailableCourts(courts?.filter((c: any) => c.status === "available") ?? []);
    } catch {
      toast.error("Failed to load club data");
    } finally {
      setMatchLoading(false);
    }
  };

  const openMatchModal = async () => {
    setMatchLoading(true);
    try {
      const [players, courts] = await Promise.all([
        adminService.getUnassignedPlayers(),
        adminService.getAllCourts(),
      ]);
      setAvailablePlayers(players ?? []);
      setAvailableCourts(courts?.filter((c: any) => c.status === "available") ?? []);
      setShowMatchModal(true);
    } catch {
      toast.error("Failed to load match data");
    } finally {
      setMatchLoading(false);
    }
  };

  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchForm.player1_id || !matchForm.player2_id || !matchForm.court_id)
      return toast.error("Please fill all fields");
    if (matchForm.player1_id === matchForm.player2_id)
      return toast.error("Please select two different players");
    setMatchLoading(true);
    try {
      await superAdminService.createMatch({ ...matchForm, status: "live" });
      toast.success("Match started!");
      setShowMatchModal(false);
      setMatchForm({ player1_id: "", player2_id: "", player3_id: "", player4_id: "", court_id: "", club_id: "", match_type: "singles" });
      fetchMatches();
    } catch {
      toast.error("Could not start match");
    } finally {
      setMatchLoading(false);
    }
  };

  // ── Tournament actions ───────────────────────────────────────────────────────

  const handleSaveTournament = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compForm.title || !compForm.start_date || !compForm.club_id) return toast.error("Title, Start Date, and Club are required");

    setIsSavingComp(true);
    try {
      const payload = { ...compForm };
      if (editingId) {
        const { error } = await supabase.from("tournaments").update(payload).eq("id", editingId);
        if (error) throw error;
        toast.success("Tournament updated!");
      } else {
        const { error } = await supabase.from("tournaments").insert({ ...payload, current_players: 0 });
        if (error) throw error;
        toast.success("Tournament created!");
      }
      setShowCompModal(false);
      setEditingId(null);
      setCompForm({ ...EMPTY_TOURNAMENT_FORM });
      fetchTournaments();
    } catch (err: any) {
      toast.error(err.message || "Failed to save tournament");
    } finally {
      setIsSavingComp(false);
    }
  };

  const handleEditTournament = (t: Tournament) => {
    setCompForm({
      title: t.title,
      description: t.description ?? "",
      start_date: t.start_date,
      end_date: t.end_date ?? "",
      registration_deadline: t.registration_deadline ?? "",
      max_players: t.max_players,
      prize_pool: t.prize_pool ?? "$0",
      entry_fee: t.entry_fee ?? 0,
      competition_type: t.competition_type ?? "Open",
      rules_text: t.rules_text ?? "",
      club_id: t.club_id ?? "",
    });
    setEditingId(t.id);
    setShowCompModal(true);
  };

  const handleDeleteTournament = async (id: string) => {
    const ok = await confirmDialog({ title: "Delete Tournament", message: "This tournament will be permanently removed. This cannot be undone.", confirmLabel: "Delete", variant: "danger" });
    if (!ok) return;
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

  const updateRegistration = async (playerId: string, tournamentId: string, newStatus: string) => {
    setUpdatingReg(`${playerId}-${tournamentId}`);
    try {
      const { error } = await supabase
        .from("tournament_registrations")
        .update({ status: newStatus })
        .eq("player_id", playerId)
        .eq("tournament_id", tournamentId);
      if (error) throw error;
      toast.success(newStatus === "accepté" ? "Player accepted!" : "Player rejected");
      await fetchRegistrations();
      await fetchTournaments();
    } catch (err: any) {
      toast.error(err.message || "Failed to update");
    } finally {
      setUpdatingReg(null);
    }
  };

  const deleteRegistration = async (playerId: string, tournamentId: string) => {
    const ok = await confirmDialog({ title: "Remove Registration", message: "This player's registration will be permanently removed.", confirmLabel: "Remove", variant: "danger" });
    if (!ok) return;
    try {
      const { error } = await supabase
        .from("tournament_registrations")
        .delete()
        .eq("player_id", playerId)
        .eq("tournament_id", tournamentId);
      if (error) throw error;
      toast.success("Registration removed");
      await fetchRegistrations();
      await fetchTournaments();
    } catch (err: any) {
      toast.error(err.message || "Failed to remove");
    }
  };

  const filteredRegs = registrations.filter((r) => {
    if (statusFilter === "All") return true;
    if (statusFilter === "en attente") return r.status === "en attente";
    if (statusFilter === "accepté") return r.status === "accepté";
    if (statusFilter === "refusé") return r.status === "refusé";
    return true;
  });

  const regsByTournament: Record<string, Registration[]> = {};
  filteredRegs.forEach((r) => {
    if (!regsByTournament[r.tournament_id]) regsByTournament[r.tournament_id] = [];
    regsByTournament[r.tournament_id].push(r);
  });

  const handleRefresh = () => {
    if (tab === "matches") fetchMatches();
    else {
      fetchTournaments();
      fetchRegistrations();
    }
  };

  const isLoading = tab === "matches" ? matchesLoading : compLoading;

  // ─── Render ──────────────────────────────────────────────────────────────────

  const inputCls =
    "w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all font-['Poppins'] text-sm";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground font-['Playfair_Display']">
            {tab === "matches" ? "Matches" : "Competitions"}
          </h1>
          <p className="text-muted-foreground text-sm font-['Poppins'] mt-1">
            {tab === "matches"
              ? "Launch live matches and manage tournaments across all clubs."
              : "Create and manage competitions across all clubs."}
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={handleRefresh}
            className="p-3 bg-card border border-border rounded-xl text-foreground hover:bg-muted/80 transition-all"
          >
            <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
          </button>
          
          {tab === "matches" ? (
            <button
              onClick={openMatchModal}
              disabled={matchLoading}
              className="flex items-center gap-2 px-5 py-3 bg-accent text-accent-foreground rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-accent/20 font-['Poppins'] disabled:opacity-60"
            >
              {matchLoading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
              New Match
            </button>
          ) : (
            <Dialog open={showCompModal} onOpenChange={(open) => {
              setShowCompModal(open);
              if (!open) { setEditingId(null); setCompForm({ ...EMPTY_TOURNAMENT_FORM }); }
            }}>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 px-5 py-3 bg-accent text-accent-foreground rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-accent/20 font-['Poppins']">
                  <Plus size={18} /> New Tournament
                </button>
              </DialogTrigger>

              <DialogContent className="bg-card border-border rounded-[32px] max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-foreground font-['Playfair_Display']">
                    {editingId ? "Edit Tournament" : "New Tournament"}
                  </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSaveTournament} className="space-y-4 mt-4">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block font-['Poppins']">Title *</label>
                    <input className={inputCls} placeholder="Tournament name" value={compForm.title} onChange={(e) => setCompForm({ ...compForm, title: e.target.value })} />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block font-['Poppins']">Assign to Club *</label>
                    <select className={inputCls} value={compForm.club_id} onChange={(e) => setCompForm({ ...compForm, club_id: e.target.value })}>
                      <option value="" disabled>Select a Club</option>
                      {clubs.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block font-['Poppins']">Description</label>
                    <textarea
                      placeholder="Brief description..."
                      className="w-full h-20 bg-muted border border-border rounded-xl px-4 py-3 text-foreground outline-none focus:border-accent transition-all resize-none font-['Poppins'] text-sm"
                      value={compForm.description}
                      onChange={(e) => setCompForm({ ...compForm, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block font-['Poppins']">Start *</label>
                      <input type="date" className={inputCls} value={compForm.start_date} onChange={(e) => setCompForm({ ...compForm, start_date: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block font-['Poppins']">End</label>
                      <input type="date" className={inputCls} value={compForm.end_date} onChange={(e) => setCompForm({ ...compForm, end_date: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block font-['Poppins']">Deadline</label>
                      <input type="date" className={inputCls} value={compForm.registration_deadline} onChange={(e) => setCompForm({ ...compForm, registration_deadline: e.target.value })} />
                    </div>
                  </div>

                  {/* Status and Skill Level removed to match database schema */}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block font-['Poppins']">Max Players</label>
                      <input type="number" min="2" max="1000" className={inputCls} value={compForm.max_players} onChange={(e) => setCompForm({ ...compForm, max_players: parseInt(e.target.value) || 32 })} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block font-['Poppins']">Entry Fee ($)</label>
                      <input type="number" min="0" step="0.01" className={inputCls} value={compForm.entry_fee} onChange={(e) => setCompForm({ ...compForm, entry_fee: parseFloat(e.target.value) || 0 })} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block font-['Poppins']">Prize Pool</label>
                      <input type="text" placeholder="e.g., $5000" className={inputCls} value={compForm.prize_pool} onChange={(e) => setCompForm({ ...compForm, prize_pool: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block font-['Poppins']">Competition Type</label>
                      <input type="text" placeholder="e.g., Open" className={inputCls} value={compForm.competition_type} onChange={(e) => setCompForm({ ...compForm, competition_type: e.target.value })} />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block font-['Poppins']">Rules</label>
                    <textarea
                      placeholder="Tournament rules..."
                      className="w-full h-24 bg-muted border border-border rounded-xl px-4 py-3 text-foreground outline-none focus:border-accent transition-all resize-none font-['Poppins'] text-sm"
                      value={compForm.rules_text}
                      onChange={(e) => setCompForm({ ...compForm, rules_text: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingComp}
                    className="w-full h-14 bg-accent text-accent-foreground font-bold rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-accent/20 disabled:opacity-60 font-['Poppins']"
                  >
                    {isSavingComp ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                    {editingId ? "Update Tournament" : "Create Tournament"}
                  </button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div className="flex bg-card border border-border rounded-[18px] p-1 w-fit">
        {(["matches", "competitions"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative flex items-center gap-2 px-6 py-2.5 rounded-[14px] text-[13px] font-bold font-['Poppins'] capitalize transition-all ${
              tab === t ? "text-accent-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === t && (
              <motion.div
                layoutId="tab-bg"
                className="absolute inset-0 bg-accent rounded-[14px]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {t === "matches" ? <Zap size={15} /> : <Trophy size={15} />}
              {t}
            </span>
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22 }}
        >
          {tab === "matches" ? (
            <div className="space-y-3">
              {matchesLoading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="h-20 bg-card border border-border rounded-[20px] animate-pulse" />
                ))
              ) : matches.length === 0 ? (
                <div className="bg-card border-2 border-dashed border-border rounded-[32px] p-16 text-center">
                  <Zap size={44} className="text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground font-['Poppins'] text-sm mb-5">No matches yet. Start the first one!</p>
                  <button
                    onClick={openMatchModal}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-accent-foreground rounded-xl font-bold hover:opacity-90 transition-all font-['Poppins'] text-sm"
                  >
                    <Zap size={16} /> New Match
                  </button>
                </div>
              ) : (
                matches.map((match, i) => {
                  const cfg = matchStatusConfig(match.status);
                  const StatusIcon = cfg.icon;
                  const isDoubles = match.match_type === "doubles";
                  const teamA = isDoubles ? `${match.player1_name} & ${match.player3_name ?? "—"}` : match.player1_name;
                  const teamB = isDoubles ? `${match.player2_name} & ${match.player4_name ?? "—"}` : match.player2_name;

                  return (
                    <motion.div
                      key={match.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="bg-card border border-border rounded-[20px] px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-accent/20 transition-all"
                    >
                      {/* Status */}
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${cfg.bg} ${cfg.border} flex-shrink-0 w-fit`}>
                        <StatusIcon size={12} className={`${cfg.color} ${cfg.pulse ? "animate-pulse" : ""}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${cfg.color} font-['Poppins']`}>{cfg.label}</span>
                      </div>

                      {/* Players */}
                      <div className="flex-1 flex items-center gap-3 min-w-0">
                        <span className="font-bold text-foreground font-['Poppins'] text-sm truncate">{teamA}</span>
                        <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest flex-shrink-0">vs</span>
                        <span className="font-bold text-foreground font-['Poppins'] text-sm truncate">{teamB}</span>
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-4 text-muted-foreground text-xs font-['Poppins'] flex-shrink-0">
                        {match.score && <span className="font-black text-foreground text-sm">{match.score}</span>}
                        <span className="hidden sm:flex items-center gap-1">
                          <Layout size={12} /> {match.court_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {new Date(match.created_at).toLocaleDateString()}
                        </span>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
                          isDoubles ? "bg-purple-500/10 text-purple-400" : "bg-blue-500/10 text-blue-400"
                        }`}>
                          {match.match_type}
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          ) : (
            <div className="space-y-10">
              {/* Tournaments Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {compLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="h-72 bg-card border border-border rounded-[32px] animate-pulse" />
                  ))
                ) : tournaments.length === 0 ? (
                  <div className="col-span-full py-20 bg-card border-2 border-dashed border-border rounded-[32px] text-center">
                    <Trophy size={48} className="text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-foreground">No tournaments yet</h3>
                    <p className="text-muted-foreground text-sm mt-2 font-['Poppins']">Create a tournament above.</p>
                  </div>
                ) : (
                  tournaments.map((t) => (
                    <div key={t.id} className="bg-card border border-border rounded-[32px] p-6 flex flex-col gap-4 hover:border-accent/30 transition-all shadow-sm group">
                      <div className="flex justify-between items-start">
                        <div className="p-3 rounded-2xl bg-accent/10">
                          <Trophy size={22} className="text-accent" />
                        </div>
                        {/* Status badge removed to match database schema */}
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-foreground font-['Playfair_Display']">{t.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 font-['Poppins']">{t.clubs?.name ?? "No Club Assigned"}</p>
                      </div>

                      <div className="space-y-1.5 text-sm text-muted-foreground font-['Poppins']">
                        <div className="flex items-center gap-2"><Calendar size={13} className="text-accent" /> {formatDate(t.start_date)}</div>
                        <div className="flex items-center gap-2"><Users size={13} className="text-accent" /> {t.current_players ?? 0} / {t.max_players} accepted</div>
                        {/* Removed skill_level display */}
                        {t.registration_deadline && <div className="flex items-center gap-2"><Clock size={13} className="text-amber-400" /><span className="text-amber-400">Deadline {formatDate(t.registration_deadline)}</span></div>}
                      </div>

                      <div className="space-y-1 mt-auto pt-4">
                        <p className="text-[10px] text-muted-foreground font-['Poppins']">
                          {Math.round(((t.current_players ?? 0) / t.max_players) * 100)}% filled
                        </p>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-accent transition-all" style={{ width: `${Math.min(((t.current_players ?? 0) / t.max_players) * 100, 100)}%` }} />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                        <button
                          onClick={() => handleEditTournament(t)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-muted hover:bg-accent hover:text-accent-foreground transition-all text-sm font-semibold font-['Poppins']"
                        >
                          <Edit2 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTournament(t.id)}
                          className="px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Registrations Section */}
              <div className="space-y-5 pt-8 border-t border-border/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground font-['Playfair_Display']">Player Registrations</h2>
                    <p className="text-muted-foreground font-['Poppins'] text-sm">Review and approve player requests across all clubs.</p>
                  </div>
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
                  <div className="space-y-4">
                    {Object.entries(regsByTournament).map(([tId, regs]) => {
                      const tournamentTitle = regs[0]?.tournaments?.title ?? "Unknown Tournament";
                      const clubName = regs[0]?.tournaments?.clubs?.name ?? "No Club";
                      const isExpanded = expandedTournament === tId;
                      return (
                        <div key={tId} className="bg-card border border-border rounded-[28px] overflow-hidden">
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
                                <p className="text-xs text-muted-foreground font-['Poppins']">{clubName} · {regs.length} registration{regs.length !== 1 ? 's' : ''}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full font-['Poppins']">
                                {regs.filter(r => r.status === 'en attente').length} pending
                              </span>
                              <ChevronDown size={16} className={`text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </div>
                          </button>

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
                                          {new Date(reg.registered_at).toLocaleDateString()}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border font-['Poppins'] ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                                        {cfg.label}
                                      </span>

                                      {reg.status !== "accepté" && (
                                        <button
                                          onClick={() => updateRegistration(reg.player_id, reg.tournament_id, "accepté")}
                                          disabled={updatingReg === `${reg.player_id}-${reg.tournament_id}`}
                                          title="Accept"
                                          className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all disabled:opacity-50"
                                        >
                                          {updatingReg === `${reg.player_id}-${reg.tournament_id}` ? <Loader2 size={13} className="animate-spin" /> : <UserCheck size={13} />}
                                        </button>
                                      )}
                                      {reg.status !== "refusé" && (
                                        <button
                                          onClick={() => updateRegistration(reg.player_id, reg.tournament_id, "refusé")}
                                          disabled={updatingReg === `${reg.player_id}-${reg.tournament_id}`}
                                          title="Reject"
                                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50"
                                        >
                                          <UserX size={13} />
                                        </button>
                                      )}
                                      <button
                                        onClick={() => deleteRegistration(reg.player_id, reg.tournament_id)}
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
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Match Modal ── */}
      <AnimatePresence>
        {showMatchModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border w-full max-w-lg rounded-[32px] p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground font-['Playfair_Display']">New Live Match</h2>
                <button onClick={() => setShowMatchModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-5 font-['Poppins']">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Assign to Club *</label>
                  <select
                    className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all"
                    value={matchForm.club_id}
                    onChange={(e) => handleClubChangeForMatch(e.target.value)}
                  >
                    <option value="">Select club...</option>
                    {clubs.map((club) => <option key={club.id} value={club.id}>{club.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Match Type</label>
                  <select
                    className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all"
                    value={matchForm.match_type}
                    onChange={(e) => setMatchForm({ ...matchForm, match_type: e.target.value })}
                  >
                    <option value="singles">Singles (1v1)</option>
                    <option value="doubles">Doubles (2v2)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[{ label: "Player 1 (Team A)", key: "player1_id" }, { label: "Player 2 (Team B)", key: "player2_id" }].map(({ label, key }) => (
                    <div key={key}>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">{label}</label>
                      <select
                        className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all"
                        value={(matchForm as any)[key]}
                        onChange={(e) => setMatchForm({ ...matchForm, [key]: e.target.value })}
                      >
                        <option value="">Select player...</option>
                        {availablePlayers.map((p) => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                      </select>
                    </div>
                  ))}
                </div>

                {matchForm.match_type === "doubles" && (
                  <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                    {[{ label: "Player 3 (Team A)", key: "player3_id" }, { label: "Player 4 (Team B)", key: "player4_id" }].map(({ label, key }) => (
                      <div key={key}>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">{label}</label>
                        <select
                          className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all"
                          value={(matchForm as any)[key]}
                          onChange={(e) => setMatchForm({ ...matchForm, [key]: e.target.value })}
                        >
                          <option value="">Select player...</option>
                          {availablePlayers.map((p) => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Court</label>
                  <select
                    className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all"
                    value={matchForm.court_id}
                    onChange={(e) => setMatchForm({ ...matchForm, court_id: e.target.value })}
                  >
                    <option value="">Select available court...</option>
                    {availableCourts.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.type})</option>)}
                  </select>
                  {availableCourts.length === 0 && (
                    <p className="text-xs text-yellow-500 mt-1">No available courts at the moment.</p>
                  )}
                </div>

                <button
                  onClick={handleCreateMatch}
                  disabled={matchLoading}
                  className="w-full h-14 bg-accent text-accent-foreground font-bold rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-accent/20 disabled:opacity-60"
                >
                  {matchLoading ? <Loader2 className="animate-spin" size={20} /> : <><Zap size={20} /> Start Match Now</>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}