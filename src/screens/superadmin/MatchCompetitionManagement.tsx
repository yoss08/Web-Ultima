import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Zap,
  Plus,
  X,
  Check,
  Loader2,
  RefreshCw,
  Calendar,
  Users,
  ChevronRight,
  Layout,
  UserPlus,
} from "lucide-react";
import { adminService } from "../../services/adminService";
import { superAdminService } from "../../services/superAdminService";
import { supabase } from "../../config/supabase";
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

export function MatchCompetitionManagement() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"competitions" | "matches">("competitions");

  // Match modal
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
    match_type: "singles" 
  });
  const [clubs, setClubs] = useState<any[]>([]);

  // Competition modal
  const [showCompModal, setShowCompModal] = useState(false);
  const [compForm, setCompForm] = useState({
    name: "",
    type: "Elimination",
    start_date: "",
    end_date: "",
    club_id: "",
  });
  const [compSaving, setCompSaving] = useState(false);

  const fetchCompetitions = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch("/api/admin/competitions", {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });
      if (!response.ok) throw new Error("Failed to fetch competitions");
      const data = await response.json();
      setCompetitions(data ?? []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitions();
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const data = await superAdminService.getAllClubs();
      setClubs(data || []);
    } catch (err: any) {
      toast.error("Failed to load clubs");
    }
  };

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
    if (!matchForm.player1_id || !matchForm.player2_id || !matchForm.court_id) {
      return toast.error("Please fill all fields");
    }
    if (matchForm.player1_id === matchForm.player2_id) {
      return toast.error("Please select two different players");
    }
    setMatchLoading(true);
    try {
      await superAdminService.createMatch({ ...matchForm, status: "live" });
      toast.success("Match started!");
      setShowMatchModal(false);
      setMatchForm({ 
        player1_id: "", 
        player2_id: "", 
        player3_id: "", 
        player4_id: "", 
        court_id: "", 
        club_id: "",
        match_type: "singles"
      });
    } catch {
      toast.error("Could not start match");
    } finally {
      setMatchLoading(false);
    }
  };
  const handleCreateCompetition = async () => {
    if (!compForm.name || !compForm.start_date || !compForm.end_date || !compForm.club_id) {
      toast.error("Name, dates, and club are required.");
      return;
    }
    setCompSaving(true);
    try {
      await superAdminService.createCompetition({ ...compForm, status: "upcoming" });
      toast.success("Competition created!");
      setShowCompModal(false);
      setCompForm({ name: "", type: "Elimination", start_date: "", end_date: "", club_id: "" });
      fetchCompetitions();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setCompSaving(false);
    }
  };

  const handleDeleteCompetition = async (id: string | number) => {
    if (!confirm("Delete this competition?")) return;
    try {
      const response = await fetch(`/api/admin/competitions/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Deletion failed");
      toast.success("Competition deleted");
      fetchCompetitions();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground font-['Playfair_Display']">
            Matches
          </h1>
          <p className="text-muted-foreground text-sm font-['Poppins'] mt-1">
            Launch live matches and manage tournaments across all clubs.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchCompetitions}
            className="p-3 bg-card border border-border rounded-xl text-foreground hover:bg-muted/80 transition-all"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-[28px] p-6 group hover:border-accent/30 transition-all shadow-sm">
          <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mb-4">
            <Zap className="text-accent" size={24} />
          </div>
          <h3 className="text-xl font-bold text-foreground font-['Playfair_Display']">
            Start Live Match
          </h3>
          <p className="text-sm text-muted-foreground mt-1 mb-5 font-['Poppins']">
            Select two players and an available court to launch a live match.
          </p>
          <button
            onClick={openMatchModal}
            disabled={matchLoading}
            className="w-full py-3 bg-accent text-accent-foreground rounded-xl font-bold hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 shadow-lg shadow-accent/20 font-['Poppins']"
          >
            {matchLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <Zap size={18} /> Create Match
              </>
            )}
          </button>
        </div>
      </div>

      {/* Competitions List */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4 font-['Playfair_Display']">
          Active Competitions
        </h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-52 bg-card border border-border rounded-[28px] animate-pulse" />
            ))}
          </div>
        ) : competitions.length === 0 ? (
          <div className="bg-card border-2 border-dashed border-border rounded-[32px] p-16 text-center">
            <Trophy size={44} className="text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-['Poppins'] text-sm">
              No competitions yet. Create the first one above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {competitions.map((comp) => (
              <motion.div
                key={comp.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-[28px] p-6 group hover:border-accent/30 transition-all shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 rounded-xl bg-accent/10">
                    <Trophy size={20} className="text-accent" />
                  </div>
                  <span className="text-[10px] font-bold uppercase py-1 px-3 bg-accent/10 text-accent rounded-full font-['Poppins']">
                    {comp.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground font-['Playfair_Display']">
                  {comp.name}
                </h3>
                <div className="space-y-2 mt-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-['Poppins']">
                    <Layout size={13} /> {comp.type}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-['Poppins']">
                    <Calendar size={13} /> {new Date(comp.start_date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-['Poppins']">
                    <Users size={13} /> {comp.participants_count ?? 0} Participants
                  </div>
                </div>
                <div className="flex gap-2 pt-4 border-t border-border/50">
                  <button className="flex-1 py-2 rounded-xl bg-muted text-foreground text-xs font-bold hover:bg-accent hover:text-accent-foreground transition-all font-['Poppins']">
                    View Bracket
                  </button>
                  <button
                    onClick={() => handleDeleteCompetition(comp.id)}
                    className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                  >
                    <X size={15} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Start Match Modal */}
      <AnimatePresence>
        {showMatchModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border w-full max-w-lg rounded-[32px] p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground font-['Playfair_Display']">
                  New Live Match
                </h2>
                <button
                  onClick={() => setShowMatchModal(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-5 font-['Poppins']">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
                    Assign to Club *
                  </label>
                  <select
                    className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all"
                    value={matchForm.club_id}
                    onChange={(e) => handleClubChangeForMatch(e.target.value)}
                  >
                    <option value="">Select club...</option>
                    {clubs.map((club) => (
                      <option key={club.id} value={club.id}>{club.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
                      Match Type
                    </label>
                    <select
                      className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all"
                      value={matchForm.match_type}
                      onChange={(e) => setMatchForm({ ...matchForm, match_type: e.target.value })}
                    >
                      <option value="singles">Singles (1v1)</option>
                      <option value="doubles">Doubles (2v2)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Player 1 (Team A)", key: "player1_id" },
                    { label: "Player 2 (Team B)", key: "player2_id" },
                  ].map(({ label, key }) => (
                    <div key={key}>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
                        {label}
                      </label>
                      <select
                        className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all"
                        value={(matchForm as any)[key]}
                        onChange={(e) => setMatchForm({ ...matchForm, [key]: e.target.value })}
                      >
                        <option value="">Select player...</option>
                        {availablePlayers.map((p) => (
                          <option key={p.id} value={p.id}>{p.full_name}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                {matchForm.match_type === "doubles" && (
                  <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                    {[
                      { label: "Player 3 (Team A)", key: "player3_id" },
                      { label: "Player 4 (Team B)", key: "player4_id" },
                    ].map(({ label, key }) => (
                      <div key={key}>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
                          {label}
                        </label>
                        <select
                          className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all"
                          value={(matchForm as any)[key]}
                          onChange={(e) => setMatchForm({ ...matchForm, [key]: e.target.value })}
                        >
                          <option value="">Select player...</option>
                          {availablePlayers.map((p) => (
                            <option key={p.id} value={p.id}>{p.full_name}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                )}
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
                    Court
                  </label>
                  <select
                    className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all"
                    value={matchForm.court_id}
                    onChange={(e) => setMatchForm({ ...matchForm, court_id: e.target.value })}
                  >
                    <option value="">Select available court...</option>
                    {availableCourts.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
                    ))}
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
                  {matchLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <Zap size={20} /> Start Match Now
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
