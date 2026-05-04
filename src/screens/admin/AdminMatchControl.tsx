import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  Square, 
  Edit2, 
  Clock, 
  Trophy, 
  ChevronRight, 
  Plus, 
  Minus,
  X,
  RefreshCw,
  Zap,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { adminService } from "../../services/adminService";
import { supabase } from "../../config/supabase";
import { useAuth } from "../../services/AuthContext";
import { useTheme } from "../../styles/useTheme";
import { toast } from "react-hot-toast";
import { MOCK_ADMIN_MATCHES } from "../../utils/mockData";

const USE_MOCK_DATA = true; // Toggle for development

interface Match {
  id: string;
  booking_id?: string | number;
  status: 'scheduled' | 'live' | 'paused' | 'completed' | 'finished';
  score: string;       // e.g. "6-4, 3-2" — full set history + current set
  points?: string;     // e.g. "30-15" — current game points
  match_type: 'singles' | 'doubles';
  winner_team?: 1 | 2 | null;
  player1_id: string;
  player2_id: string;
  player3_id?: string;
  player4_id?: string;
  court_id?: string;
  start_time?: string;
  end_time?: string;
  player1?: { full_name: string };
  player2?: { full_name: string };
  player3?: { full_name: string };
  player4?: { full_name: string };
  booking?: {
    booking_date: string;
    time_slot: string;
    courts: { name: string };
  };
}

export function AdminMatchControl() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [showScoreEditor, setShowScoreEditor] = useState(false);
  const [clubId, setClubId] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const clubInfo = await adminService.getClubInfo();
        setClubId(clubInfo.id);
        fetchMatches(clubInfo.id);
      } catch (error: any) {
        toast.error(error.message || "Failed to load club info");
        setLoading(false);
      }
    }
    init();
  }, []);

  const fetchMatches = async (id: string) => {
    try {
      if (USE_MOCK_DATA) {
        setMatches(MOCK_ADMIN_MATCHES as any);
        setLoading(false);
        return;
      }
      const [matchesData, bookingsData] = await Promise.all([
        adminService.getClubMatches(id),
        supabase
          .from('bookings')
          .select('*, profiles(full_name), courts(name)')
          .eq('club_id', id)
          .eq('status', 'confirmed')
          .eq('booking_date', new Date().toISOString().split('T')[0])
      ]);

      const existingMatchBookingIds = new Set(matchesData.map((m: any) => String(m.booking_id)));
      
      const scheduledFromBookings = (bookingsData.data || [])
        .filter(b => !existingMatchBookingIds.has(String(b.id)))
        .map(b => {
          const [start, end] = b.time_slot.split(' - ');
          return {
            id: `booking-${b.id}`,
            booking_id: b.id,
            status: 'scheduled' as const,
            score: '0-0',
            match_type: 'singles' as const, // Default, can be improved
            player1_id: b.user_id,
            court_id: b.court_id,
            player1: { full_name: b.profiles?.full_name || "Unknown" },
            booking: {
              booking_date: b.booking_date,
              time_slot: b.time_slot,
              courts: { name: b.courts?.name || "Court" }
            },
            start_time: `${b.booking_date}T${start}:00`,
            end_time: `${b.booking_date}T${end}:00`
          };
        });

      setMatches([...matchesData, ...scheduledFromBookings]);
    } catch (error: any) {
      toast.error(error.message || "Failed to load matches");
    } finally {
      setLoading(false);
    }
  };

  const handleStartMatch = async (match: Match) => {
    try {
      if (USE_MOCK_DATA) {
        setMatches(prev => prev.map(m => m.id === match.id ? { ...m, status: 'live', start_time: new Date().toISOString() } : m));
        toast.success("Match started (Mock)!");
        return;
      }
      if (match.id.startsWith('booking-')) {
        // Create new match from booking
        await adminService.createMatch({
          booking_id: match.booking_id,
          player1_id: match.player1_id,
          court_id: match.court_id ?? '',
          status: 'live',
          start_time: new Date().toISOString(),
          club_id: clubId || undefined
        });
      } else {
        // Update existing match
        await adminService.updateMatchStatus(match.id, 'live', { start_time: new Date().toISOString() });
      }
      toast.success("Match started!");
      if (clubId) fetchMatches(clubId);
    } catch (error: any) {
      toast.error(error.message || "Failed to start match");
    }
  };

  const handlePauseMatch = async (matchId: string) => {
    try {
      if (USE_MOCK_DATA) {
        setMatches(prev => prev.map(m => m.id === matchId ? { ...m, status: 'paused' } : m));
        toast.success("Match paused");
        return;
      }
      await adminService.updateMatchStatus(matchId, 'paused');
      toast.success("Match paused");
      if (clubId) fetchMatches(clubId);
    } catch (error: any) {
      toast.error(error.message || "Failed to pause match");
    }
  };

  const handleResumeMatch = async (matchId: string) => {
    try {
      if (USE_MOCK_DATA) {
        setMatches(prev => prev.map(m => m.id === matchId ? { ...m, status: 'live' } : m));
        toast.success("Match resumed (Mock)");
        return;
      }
      await adminService.updateMatchStatus(matchId, 'live');
      toast.success("Match resumed");
      if (clubId) fetchMatches(clubId);
    } catch (error: any) {
      toast.error(error.message || "Failed to resume match");
    }
  };

  const handleEndMatch = async (matchId: string) => {
    if (!window.confirm("Are you sure you want to end this match?")) return;
    try {
      if (USE_MOCK_DATA) {
        setMatches(prev => prev.map(m => m.id === matchId ? { ...m, status: 'completed', end_time: new Date().toISOString() } : m));
        toast.success("Match ended (Mock)");
        return;
      }
      await adminService.updateMatchStatus(matchId, 'completed', { end_time: new Date().toISOString() });
      toast.success("Match ended");
      if (clubId) fetchMatches(clubId);
    } catch (error: any) {
      toast.error(error.message || "Failed to end match");
    }
  };

  const openScoreEditor = (match: Match) => {
    setSelectedMatch(match);
    setShowScoreEditor(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground font-['Playfair_Display']">
            Match Control
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-muted-foreground text-sm font-['Poppins']">
              Manage live scores & match status for your club.
            </p>
            <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest">
                {matches.filter(m => m.status === 'live').length} Live
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => clubId && fetchMatches(clubId)}
            className="p-3 bg-card border border-border rounded-xl text-foreground hover:bg-muted/80 transition-all shadow-sm"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-card border border-border rounded-[32px] p-20 flex flex-col items-center justify-center font-['Poppins'] shadow-sm">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground font-medium">Loading matches...</p>
        </div>
      ) : matches.length === 0 ? (
        <div className="bg-card border-2 border-dashed border-border rounded-[32px] p-20 text-center shadow-sm">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
            <Trophy size={32} />
          </div>
          <h3 className="text-xl font-bold text-foreground font-['Playfair_Display']">No matches found</h3>
          <p className="text-muted-foreground mt-1 font-['Poppins']">Schedule matches via the booking system to see them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {matches.map((match) => (
            <MatchCard 
              key={match.id} 
              match={match} 
              onStart={() => handleStartMatch(match)}
              onPause={() => handlePauseMatch(match.id)}
              onResume={() => handleResumeMatch(match.id)}
              onEnd={() => handleEndMatch(match.id)}
              onEditScore={() => openScoreEditor(match)}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {showScoreEditor && selectedMatch && (
          <ScoreEditorModal 
            match={selectedMatch} 
            onClose={(newScore?: string, newPoints?: string) => {
              setShowScoreEditor(false);
              if (newScore && USE_MOCK_DATA) {
                setMatches(prev => prev.map(m => m.id === selectedMatch.id 
                  ? { ...m, score: newScore, points: newPoints ?? m.points } 
                  : m
                ));
              } else if (clubId) {
                fetchMatches(clubId);
              }
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function MatchCard({ 
  match, 
  onStart, 
  onPause, 
  onResume, 
  onEnd, 
  onEditScore 
}: { 
  match: Match; 
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onEnd: () => void;
  onEditScore: () => void;
}) {
  const statusColors = {
    scheduled: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    live: "text-accent bg-accent/10 border-accent/20",
    paused: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    completed: "text-muted-foreground bg-muted/10 border-border",
    finished: "text-muted-foreground bg-muted/10 border-border",
  };

  const isLive = match.status === 'live';
  const isPaused = match.status === 'paused';
  const isScheduled = match.status === 'scheduled';
  const isFinished = match.status === 'completed' || match.status === 'finished';

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative group bg-card border border-border rounded-[32px] overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md ${
        isLive ? 'ring-2 ring-accent/20' : ''
      }`}
    >
      <div className="p-6 sm:p-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border font-['Poppins'] ${statusColors[match.status]}`}>
              <div className="flex items-center gap-2">
                {isLive && <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />}
                {match.status}
              </div>
            </span>
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 font-['Poppins']">
              <ChevronRight size={14} className="text-border" />
              {match.booking?.courts?.name || "Unassigned Court"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground/60 text-[11px] font-bold font-['Poppins']">
            <Clock size={14} />
            <span>{isLive ? "32 min" : isScheduled ? match.booking?.time_slot.split(' - ')[0] : "Finished"}</span>
          </div>
        </div>

        {/* Players & Score */}
        <div className="flex items-center justify-between gap-4">
          {/* Team A */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-col gap-1">
              <span className="text-base sm:text-lg font-bold text-foreground truncate font-['Poppins']">
                {match.player1?.full_name || "TBD"}
              </span>
              {match.match_type === 'doubles' && (
                <span className="text-base sm:text-lg font-bold text-foreground truncate font-['Poppins']">
                  {match.player3?.full_name || "TBD"}
                </span>
              )}
            </div>
          </div>

          {/* Score Display */}
          <div className="relative shrink-0">
            <div 
              onClick={!isFinished ? onEditScore : undefined}
              className={`flex flex-col items-center justify-center min-w-[110px] sm:min-w-[130px] rounded-2xl bg-muted/30 border border-border transition-all px-3 py-3 ${
                isFinished ? 'cursor-default opacity-60' : 'cursor-pointer group-hover:border-accent/30'
              }`}
            >
              {/* Previous sets — small top */}
              {(() => {
                const parts = (match.score || '0-0').split(',').map(s => s.trim());
                const prevSets = parts.slice(0, -1).join(', ');
                const currentSet = parts[parts.length - 1];
                return (
                  <>
                    {prevSets && (
                      <span className="text-[10px] font-bold text-muted-foreground font-['Poppins'] mb-0.5 tracking-wide">
                        {prevSets}
                      </span>
                    )}
                    {/* Current set — large */}
                    <span className={`text-3xl sm:text-4xl font-black font-['Poppins'] leading-none ${
                      isLive ? 'text-accent' : isPaused ? 'text-orange-500' : isScheduled ? 'text-blue-400' : 'text-foreground'
                    }`}>
                      {currentSet}
                    </span>
                    {/* Game points — small bottom */}
                    {!isFinished && match.points && (
                      <span className="text-[11px] font-bold text-muted-foreground/70 font-['Poppins'] mt-0.5">
                        {match.points.replace('-', ' — ')}
                      </span>
                    )}
                    {!isFinished && !match.points && (
                      <span className="text-[11px] font-bold text-muted-foreground/40 font-['Poppins'] mt-0.5">
                        0 — 0
                      </span>
                    )}
                  </>
                );
              })()}
              {!isFinished && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit2 size={12} className="text-accent" />
                </div>
              )}
            </div>
          </div>

          {/* Team B */}
          <div className="flex-1 text-center sm:text-right min-w-0">
            <div className="flex flex-col gap-1">
              <span className="text-base sm:text-lg font-bold text-foreground truncate font-['Poppins']">
                {match.player2?.full_name || "TBD"}
              </span>
              {match.match_type === 'doubles' && (
                <span className="text-base sm:text-lg font-bold text-foreground truncate font-['Poppins']">
                  {match.player4?.full_name || "TBD"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Winner Banner for Finished Matches */}
        {isFinished && match.winner_team && (
          <div className="mt-8 pt-8 border-t border-border">
            <div className={`flex items-center justify-between rounded-2xl p-4 ${
              match.winner_team === 1 ? 'bg-accent/10 border border-accent/20' : 'bg-red-500/10 border border-red-500/20'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  match.winner_team === 1 ? 'bg-accent/20 text-accent' : 'bg-red-500/20 text-red-500'
                }`}>
                  <Trophy size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-['Poppins']">Winners</p>
                  <p className={`text-sm font-bold font-['Poppins'] ${
                    match.winner_team === 1 ? 'text-accent' : 'text-red-500'
                  }`}>
                    {match.winner_team === 1
                      ? `${match.player1?.full_name} & ${match.player2?.full_name}`
                      : `${match.player3?.full_name} & ${match.player4?.full_name}`
                    }
                  </p>
                </div>
              </div>
              <span className="text-2xl font-black text-foreground font-['Poppins']">{match.score}</span>
            </div>
          </div>
        )}

        {/* Completed without winner info */}
        {isFinished && !match.winner_team && (
          <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground/60 text-sm font-medium border-t border-border pt-6 font-['Poppins']">
            <CheckCircle2 size={16} />
            <span>Match completed · {match.score}</span>
          </div>
        )}
        {!isFinished && (
          <div className="mt-8 pt-8 border-t border-border flex flex-wrap gap-3">
            {isScheduled && (
              <button 
                onClick={onStart}
                className="flex-1 min-w-[140px] h-12 rounded-xl bg-accent text-accent-foreground font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all font-['Poppins'] shadow-sm"
              >
                <Play size={18} fill="currentColor" /> START MATCH
              </button>
            )}

            {isLive && (
              <button 
                onClick={onPause}
                className="flex-1 min-w-[140px] h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 font-bold text-sm flex items-center justify-center gap-2 hover:bg-orange-500/20 transition-all font-['Poppins']"
              >
                <Pause size={18} fill="currentColor" /> PAUSE
              </button>
            )}

            {isPaused && (
              <button 
                onClick={onResume}
                className="flex-1 min-w-[140px] h-12 rounded-xl bg-accent text-accent-foreground font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all font-['Poppins'] shadow-sm"
              >
                <Play size={18} fill="currentColor" /> RESUME
              </button>
            )}

            {!isScheduled && (
              <button 
                onClick={onEditScore}
                className="flex-1 min-w-[140px] h-12 rounded-xl bg-muted border border-border text-foreground font-bold text-sm flex items-center justify-center gap-2 hover:bg-muted/80 transition-all font-['Poppins']"
              >
                <Edit2 size={18} /> SCORE
              </button>
            )}

            {!isScheduled && (
              <button 
                onClick={onEnd}
                className="flex-1 min-w-[140px] h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all font-['Poppins']"
              >
                <Square size={18} fill="currentColor" /> END
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}


function ScoreEditorModal({ match, onClose }: { 
  match: Match; 
  onClose: (newScore?: string, newPoints?: string) => void;
}) {
  const POINTS = ['0', '15', '30', '40'];
  const [team1Games, setTeam1Games] = useState(0);
  const [team2Games, setTeam2Games] = useState(0);
  const [team1Points, setTeam1Points] = useState(0); // index into POINTS
  const [team2Points, setTeam2Points] = useState(0);
  const [sets, setSets] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (match.score) {
      const parts = match.score.split(',').map(s => s.trim());
      const currentSet = parts[parts.length - 1];
      const previousSets = parts.slice(0, parts.length - 1);
      const [g1, g2] = currentSet.split('-').map(n => parseInt(n) || 0);
      setTeam1Games(g1);
      setTeam2Games(g2);
      setSets(previousSets);
    }
    // Parse existing points
    if (match.points) {
      const [p1, p2] = match.points.split('-');
      setTeam1Points(Math.max(0, POINTS.indexOf(p1 || '0')));
      setTeam2Points(Math.max(0, POINTS.indexOf(p2 || '0')));
    }
  }, [match.score, match.points]);

  const pointLabel = (idx: number) => {
    if (team1Points === 3 && team2Points === 3) return 'D';
    if (idx === 3 && team1Points === 3 && team2Points < 3) return 'A';
    if (idx === 3 && team2Points === 3 && team1Points < 3) return 'A';
    return POINTS[idx];
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const currentScore = `${team1Games}-${team2Games}`;
      const fullScore = sets.length > 0 ? `${sets.join(', ')}, ${currentScore}` : currentScore;
      const fullPoints = `${POINTS[team1Points]}-${POINTS[team2Points]}`;

      if (USE_MOCK_DATA) {
        onClose(fullScore, fullPoints);
        toast.success("Score updated");
        return;
      }
      await adminService.updateScore(match.id, fullScore);
      toast.success("Score updated");
      onClose(fullScore, fullPoints);
    } catch (error: any) {
      toast.error(error.message || "Failed to update score");
    } finally {
      setSaving(false);
    }
  };

  const addSet = () => {
    setSets([...sets, `${team1Games}-${team2Games}`]);
    setTeam1Games(0);
    setTeam2Games(0);
    setTeam1Points(0);
    setTeam2Points(0);
  };

  const removeLastSet = () => {
    if (sets.length === 0) return;
    const last = sets[sets.length - 1];
    const [g1, g2] = last.split('-').map(n => parseInt(n) || 0);
    setTeam1Games(g1);
    setTeam2Games(g2);
    setSets(sets.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => onClose()}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-card border border-border rounded-[40px] shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <header className="flex items-center justify-between mb-8">
            <div className="flex flex-col">
              <h2 className="text-2xl font-black text-foreground font-['Playfair_Display']">Score Editor</h2>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest font-['Poppins']">{match.booking?.courts?.name || "Court Control"}</span>
            </div>
            <button 
              onClick={() => onClose()}
              className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <X size={20} className="text-foreground" />
            </button>
          </header>

          {/* Set History */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] font-['Poppins']">Sets</span>
            <div className="flex gap-2 flex-wrap justify-center">
              {sets.map((s, i) => (
                <div key={i} className="px-3 py-1 rounded-lg bg-muted border border-border text-sm font-bold text-foreground font-['Poppins']">
                  {s}
                </div>
              ))}
              {sets.length === 0 && (
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-border" />
                  <div className="w-2 h-2 rounded-full bg-border" />
                </div>
              )}
            </div>
          </div>

          {/* Game Counter */}
          <div className="flex items-center justify-between gap-4 mb-6">
            {/* Team 1 */}
            <div className="flex-1 flex flex-col items-center gap-4">
              <span className="text-xs font-bold text-muted-foreground truncate w-full text-center font-['Poppins'] uppercase tracking-wider">
                {match.player1?.full_name?.split(' ')[0]} & {match.player3?.full_name?.split(' ')[0]}
              </span>
              <span className="text-6xl font-black text-foreground tabular-nums font-['Poppins']">{team1Games}</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setTeam1Games(Math.max(0, team1Games - 1))}
                  className="w-11 h-11 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Minus size={18} className="text-foreground" />
                </button>
                <button 
                  onClick={() => setTeam1Games(team1Games + 1)}
                  className="w-11 h-11 rounded-full bg-accent text-accent-foreground flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-accent/20"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <div className="text-2xl font-black text-muted-foreground/20">&mdash;</div>

            {/* Team 2 */}
            <div className="flex-1 flex flex-col items-center gap-4">
              <span className="text-xs font-bold text-muted-foreground truncate w-full text-center font-['Poppins'] uppercase tracking-wider">
                {match.player2?.full_name?.split(' ')[0]} & {match.player4?.full_name?.split(' ')[0]}
              </span>
              <span className="text-6xl font-black text-foreground tabular-nums font-['Poppins']">{team2Games}</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setTeam2Games(Math.max(0, team2Games - 1))}
                  className="w-11 h-11 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Minus size={18} className="text-foreground" />
                </button>
                <button 
                  onClick={() => setTeam2Games(team2Games + 1)}
                  className="w-11 h-11 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-red-500/20"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Current Set label */}
          <div className="flex items-center justify-center mb-6">
            <span className="text-[11px] font-bold text-accent uppercase tracking-widest bg-accent/10 px-4 py-1 rounded-full border border-accent/20 font-['Poppins']">Current Set</span>
          </div>

          {/* Points Tracker */}
          <div className="bg-muted/40 border border-border rounded-2xl p-4 mb-6">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center mb-3 font-['Poppins']">Game Points</p>
            <div className="flex items-center justify-between gap-2">
              {/* Team 1 points */}
              <div className="flex gap-1">
                {POINTS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTeam1Points(i)}
                    className={`w-10 h-10 rounded-xl text-xs font-black font-['Poppins'] transition-all ${
                      team1Points === i
                        ? 'bg-accent text-accent-foreground shadow-md shadow-accent/30 scale-110'
                        : 'bg-muted border border-border text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {POINTS[i]}
                  </button>
                ))}
              </div>

              <div className="flex flex-col items-center gap-0.5">
                <span className="text-base font-black text-foreground font-['Poppins']">{pointLabel(team1Points)}</span>
                <span className="text-[10px] text-muted-foreground font-['Poppins']">&mdash;</span>
                <span className="text-base font-black text-foreground font-['Poppins']">{pointLabel(team2Points)}</span>
              </div>

              {/* Team 2 points */}
              <div className="flex gap-1">
                {POINTS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTeam2Points(i)}
                    className={`w-10 h-10 rounded-xl text-xs font-black font-['Poppins'] transition-all ${
                      team2Points === i
                        ? 'bg-red-500 text-white shadow-md shadow-red-500/30 scale-110'
                        : 'bg-muted border border-border text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {POINTS[i]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={addSet}
              className="h-14 rounded-2xl bg-muted border border-border text-foreground font-bold text-sm hover:bg-muted/80 transition-all font-['Poppins']"
            >
              FINISH SET
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="h-14 rounded-2xl bg-accent text-accent-foreground font-black text-sm shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 font-['Poppins']"
            >
              {saving ? "SAVING..." : "UPDATE SCORE"}
            </button>
          </div>
          
          {sets.length > 0 && (
            <button 
              onClick={removeLastSet}
              className="w-full mt-4 text-[11px] font-bold text-muted-foreground/40 uppercase tracking-widest hover:text-red-500 transition-colors font-['Poppins']"
            >
              Undo last set
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
