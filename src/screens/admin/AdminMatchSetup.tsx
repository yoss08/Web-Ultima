import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Users, X, CheckCircle2, RefreshCw, Zap } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminService } from "../../services/adminService";
import { supabase } from "../../config/supabase";

interface Player {
  id: string;
  full_name: string;
}

interface Booking {
  id: string | number;
  user_id: string;
  club_id: string;
  court_id: string | number;
  profiles?: { full_name: string };
  courts?: { name: string };
}

interface MatchSetupProps {
  booking: Booking;
  onClose: () => void;
  onSuccess: () => void;
}

export function MatchSetupForm({ booking, onClose, onSuccess }: MatchSetupProps) {
  const [player2, setPlayer2] = useState<Player | null>(null);
  const [player3, setPlayer3] = useState<Player | null>(null);
  const [player4, setPlayer4] = useState<Player | null>(null);
  const [search2, setSearch2] = useState("");
  const [search3, setSearch3] = useState("");
  const [search4, setSearch4] = useState("");
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      const activeSearch = showDropdown === 2 ? search2 : showDropdown === 3 ? search3 : showDropdown === 4 ? search4 : "";
      if (activeSearch.length >= 2) {
        try {
          const results = await adminService.searchAllPlayers(activeSearch);
          // Filter out already selected players
          const excludeIds = [booking.user_id, player2?.id, player3?.id, player4?.id].filter(Boolean);
          setFilteredPlayers(results.filter((p: any) => !excludeIds.includes(p.id)));
        } catch (error) {
          console.error("Search error:", error);
        }
      } else {
        setFilteredPlayers([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search2, search3, search4, showDropdown, booking.club_id, player2?.id, player3?.id, player4?.id]);

  const getOrCreatePlayer = async (player: Player | null) => {
    if (!player) return null;
    if (player.id !== 'guest') return player.id;
    return adminService.createGuestPlayer(booking.club_id, player.full_name);
  };

  const handleStartMatch = async () => {
    if (!player2 || !player3 || !player4) {
      toast.error("Please select all 4 players for a doubles match");
      return;
    }

    setSubmitting(true);
    try {
      const [p2_id, p3_id, p4_id] = await Promise.all([
        getOrCreatePlayer(player2),
        getOrCreatePlayer(player3),
        getOrCreatePlayer(player4)
      ]);

      await adminService.createMatch({
        booking_id: booking.id,
        player1_id: booking.user_id,
        player2_id: p2_id!,
        player3_id: p3_id!,
        player4_id: p4_id!,
        court_id: booking.court_id,
        status: 'live',
        start_time: new Date().toISOString(),
        club_id: booking.club_id
      });
      
      // Update booking status if not already updated
      await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', booking.id);

      toast.success("Match started successfully!");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to start match");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-xl"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-card border border-border rounded-[40px] shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-accent" />
        
        <div className="p-8 sm:p-10">
          <header className="flex items-center justify-between mb-10">
            <div className="flex flex-col">
              <h2 className="text-3xl font-black text-foreground font-['Playfair_Display']">Match Setup</h2>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest font-['Poppins'] mt-1">
                2 vs 2 Team Formation
              </p>
            </div>
            <button 
              onClick={onClose}
              className="w-12 h-12 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <X size={24} className="text-foreground" />
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border/50 -translate-x-1/2" />
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-accent uppercase tracking-widest font-['Poppins']">Team 1</span>
                <Users size={20} className="text-accent/30" />
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Player 1 (Booker)</label>
                  <div className="flex items-center gap-3 p-4 bg-accent/5 border border-accent/20 rounded-2xl">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xs">
                      {booking.profiles?.full_name?.[0] || 'U'}
                    </div>
                    <span className="font-bold text-foreground text-sm">{booking.profiles?.full_name || 'Unknown'}</span>
                    <div className="ml-auto">
                      <CheckCircle2 size={16} className="text-accent" />
                    </div>
                  </div>
                </div>

                <PlayerSelect 
                  label="Player 2"
                  value={player2}
                  onSelect={setPlayer2}
                  search={search2}
                  onSearchChange={setSearch2}
                  dropdownId={2}
                  showDropdown={showDropdown}
                  setShowDropdown={setShowDropdown}
                  filteredPlayers={filteredPlayers}
                  bookingClubId={booking.club_id}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-red-500 uppercase tracking-widest font-['Poppins']">Team 2</span>
                <Users size={20} className="text-red-500/30" />
              </div>

              <div className="space-y-4">
                <PlayerSelect 
                  label="Player 3"
                  value={player3}
                  onSelect={setPlayer3}
                  search={search3}
                  onSearchChange={setSearch3}
                  dropdownId={3}
                  showDropdown={showDropdown}
                  setShowDropdown={setShowDropdown}
                  filteredPlayers={filteredPlayers}
                  bookingClubId={booking.club_id}
                />

                <PlayerSelect 
                  label="Player 4"
                  value={player4}
                  onSelect={setPlayer4}
                  search={search4}
                  onSearchChange={setSearch4}
                  dropdownId={4}
                  showDropdown={showDropdown}
                  setShowDropdown={setShowDropdown}
                  filteredPlayers={filteredPlayers}
                  bookingClubId={booking.club_id}
                />
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center gap-4">
            <button 
              onClick={handleStartMatch}
              disabled={submitting || !player2 || !player3 || !player4}
              className="w-full h-16 rounded-[24px] bg-accent text-accent-foreground font-black text-lg shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3 font-['Poppins']"
            >
              {submitting ? (
                <RefreshCw size={24} className="animate-spin" />
              ) : (
                <>
                  <Zap size={24} fill="currentColor" />
                  START LIVE MATCH
                </>
              )}
            </button>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] font-['Poppins']">
              This will create a live match on {booking.courts?.name}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const PlayerSelect = ({ 
  label, 
  value, 
  onSelect, 
  search, 
  onSearchChange, 
  dropdownId,
  showDropdown,
  setShowDropdown,
  filteredPlayers,
  bookingClubId
}: any) => (
  <div className="space-y-2 relative">
    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      {value ? (
        <div className="flex items-center justify-between p-4 bg-muted/50 border border-accent/30 rounded-2xl group transition-all">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xs">
              {value.full_name[0]}
            </div>
            <span className="font-bold text-foreground text-sm">{value.full_name}</span>
          </div>
          <button onClick={() => onSelect(null)} className="text-muted-foreground hover:text-red-500 p-1">
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            placeholder="Search player..."
            className="w-full h-12 pl-12 pr-4 bg-card border border-border rounded-2xl outline-none focus:border-accent transition-all text-sm font-['Poppins']"
            value={search}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setShowDropdown(dropdownId);
            }}
            onFocus={() => setShowDropdown(dropdownId)}
          />
          {showDropdown === dropdownId && search.length >= 2 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-2xl z-[110] overflow-hidden">
              {filteredPlayers.map((p: any) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelect(p);
                    setShowDropdown(null);
                  }}
                  className="w-full p-4 flex items-center justify-between hover:bg-muted transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xs">
                      {p.full_name[0]}
                    </div>
                    <span className="font-medium text-foreground text-sm">{p.full_name}</span>
                  </div>
                  {p.club_id && p.club_id !== bookingClubId && (
                    <span className="text-[9px] font-black bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                      External
                    </span>
                  )}
                </button>
              ))}
              
              {/* Guest Option */}
              <button
                onClick={() => {
                  onSelect({ id: 'guest', full_name: search });
                  setShowDropdown(null);
                }}
                className="w-full p-4 flex items-center gap-3 hover:bg-accent/10 transition-colors text-left border-t border-border"
              >
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xs">
                  +
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-accent text-sm">Add "{search}"</span>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">As Guest Player</span>
                </div>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);
