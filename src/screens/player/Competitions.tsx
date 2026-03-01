import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Calendar, 
  Users, 
  Search, 
  Loader2, 
  Medal,
  Filter,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MapPin,
  ChevronRight,
  X,
  Clock,
  DollarSign
} from "lucide-react";
import { supabase } from "../../config/supabase";
import { useAuth } from "../../services/AuthContext";
import { toast } from "react-hot-toast";

interface Tournament {
  id: string;
  title: string;
  description: string;
  start_date: string;
  registration_deadline?: string;
  max_players: number;
  current_players: number;
  prize_pool: string;
  status: 'Open' | 'Closed' | 'Ongoing' | 'Completed';
  skill_level: string;
  competition_type: string;
  entry_fee: number;
}

export function Competitions() {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [userRegistrations, setUserRegistrations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [selectedComp, setSelectedComp] = useState<Tournament | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");

  useEffect(() => {
    fetchData();
  }, [user]);

  async function fetchData() {
    try {
      setLoading(true);
      const { data: tourneys, error: tError } = await supabase
        .from('tournaments')
        .select('*')
        .order('start_date', { ascending: true });

      if (tError) throw tError;

      if (user) {
        const { data: regs } = await supabase
          .from('tournament_registrations')
          .select('tournament_id')
          .eq('player_id', user.id);
        if (regs) setUserRegistrations(regs.map(r => r.tournament_id));
      }

      setTournaments(tourneys || []);
    } catch (err) {
      toast.error("Could not load competitions");
    } finally {
      setLoading(false);
    }
  }

  const handleRegister = async (tournament: Tournament) => {
    if (!user) return toast.error("Please log in to register");
    if (tournament.status !== 'Open') return toast.error("Registration is closed");
    
    setRegisteringId(tournament.id);
    try {
      const { error } = await supabase
        .from('tournament_registrations')
        .insert([{ tournament_id: tournament.id, player_id: user.id }]);

      if (error) throw error;

      setUserRegistrations([...userRegistrations, tournament.id]);
      setTournaments(prev => prev.map(t => 
        t.id === tournament.id ? { ...t, current_players: t.current_players + 1 } : t
      ));
      toast.success("Spot secured!");
    } catch (err: any) {
      toast.error(err.code === '23505' ? "Already registered" : "Registration failed");
    } finally {
      setRegisteringId(null);
    }
  };

  const filteredTournaments = tournaments.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === "All" || t.skill_level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  if (loading && tournaments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="animate-spin text-[#39FF14]" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-20">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 text-[#39FF14] font-bold text-xs uppercase tracking-[3px] mb-2">
            <TrendingUp size={16} />
            <span>Tournament Center</span>
          </div>
          <h1 className="font-['Playfair_Display',serif] text-4xl md:text-6xl font-black dark:text-white leading-none mb-4">Active Competitions</h1>
          <p className="text-[#0A0E1A]/60 dark:text-white/60 font-['Poppins']">
            Register for upcoming tournaments and prove your skills.
          </p>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="flex flex-wrap gap-4 items-center bg-white dark:bg-white/5 p-2 rounded-[24px] border border-gray-100 dark:border-white/10">
          <div className="relative group flex-1 md:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:text-[#39FF14] transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Find a tournament..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 pl-12 pr-6 rounded-2xl bg-gray-50 dark:bg-black/20 border-none outline-none text-sm font-medium w-full md:w-64 focus:ring-1 ring-[#39FF14]/50 transition-all"
            />
          </div>
          <div className="relative flex items-center bg-gray-100/50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-[#39FF14]/50 transition-all px-4 group">
            <Filter size={16} className="text-[#39FF14] mr-2" />
            <select 
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="h-12 bg-transparent border-none outline-none text-sm font-black text-[#0A0E1A] dark:text-white cursor-pointer appearance-none pr-8"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <div className="absolute right-4 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
              <ChevronRight size={14} className="rotate-90 text-[#39FF14]" />
            </div>
          </div>
        </div>
      </header>

      {/* COMPETITION CARDS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredTournaments.map((t) => {
            const isRegistered = userRegistrations.includes(t.id);
            const isFull = t.current_players >= t.max_players;

            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key={t.id}
                onClick={() => setSelectedComp(t)}
                className="group relative bg-white dark:bg-[#0F1423] rounded-[40px] border border-gray-100 dark:border-white/5 overflow-hidden hover:border-[#39FF14]/40 transition-all duration-500 shadow-xl cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#39FF14]/5 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-[#39FF14]/10 transition-colors" />

                <div className="p-8 md:p-10">
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-[#39FF14]/10 rounded-[22px] flex items-center justify-center shrink-0 border border-[#39FF14]/20">
                        <Trophy className="text-[#39FF14]" size={28} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                           <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                             t.status === 'Open' ? 'bg-[#39FF14]/10 text-[#39FF14]' :
                             t.status === 'Ongoing' ? 'bg-[#00E5FF]/10 text-[#00E5FF]' :
                             'bg-gray-100 dark:bg-white/5 text-gray-400'
                           }`}>
                             {t.status}
                           </span>
                           <span className="text-[10px] font-bold text-gray-400 dark:text-white/20 uppercase tracking-widest leading-none">
                             {t.competition_type}
                           </span>
                        </div>
                        <h3 className="text-2xl font-black dark:text-white group-hover:text-[#39FF14] transition-colors">
                          {t.title}
                        </h3>
                      </div>
                    </div>
                    {isRegistered && (
                      <div className="bg-[#39FF14] text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter flex items-center gap-1.5 shadow-lg shadow-[#39FF14]/20">
                        <CheckCircle2 size={12} /> Registered
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                    <CardInfo icon={Calendar} label="Date" value={new Date(t.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                    <CardInfo icon={Users} label="Participants" value={`${t.current_players}/${t.max_players}`} />
                    <CardInfo icon={Medal} label="Reward" value={t.prize_pool} />
                    <CardInfo icon={DollarSign} label="Entry Fee" value={t.entry_fee === 0 ? "Free" : `$${t.entry_fee}`} />
                  </div>

                  <div className="flex items-center justify-between gap-4">
                     <div className="flex items-center gap-2 text-xs font-bold dark:text-white/40">
                        <Clock size={14} className="text-[#39FF14]" />
                        <span className="opacity-60">Deadline:</span> {t.registration_deadline ? new Date(t.registration_deadline).toLocaleDateString() : 'Rolling'}
                     </div>
                     <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRegister(t);
                        }}
                        disabled={isRegistered || isFull || t.status !== 'Open' || registeringId === t.id}
                        className={`px-8 h-12 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all shadow-lg ${
                          isRegistered ? 'bg-white/5 text-gray-400 shadow-none' :
                          isFull || t.status !== 'Open' ? 'bg-red-500/10 text-red-500 shadow-none' :
                          'bg-[#39FF14] text-black hover:scale-105 active:scale-95 shadow-[#39FF14]/20'
                        }`}
                     >
                       {registeringId === t.id ? <Loader2 className="animate-spin" size={16} /> : 
                        isRegistered ? "Registered" : 
                        isFull ? "Tournament Full" : 
                        t.status !== 'Open' ? "Closed" : "Join Now"}
                     </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {selectedComp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl" onClick={() => setSelectedComp(null)}>
            <motion.div 
               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
               onClick={(e) => e.stopPropagation()}
               className="bg-white dark:bg-[#0F1423] rounded-[48px] border border-white/10 w-full max-w-4xl overflow-hidden relative shadow-3xl"
            >
              <button 
                onClick={() => setSelectedComp(null)}
                className="absolute top-8 right-8 w-12 h-12 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 transition-all z-10"
              >
                <X size={24} />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 h-full max-h-[90vh] overflow-y-auto">
                 {/* Left Panel: Info */}
                 <div className="p-10 lg:p-12 space-y-8 bg-gray-50/50 dark:bg-black/20">
                    <div>
                       <div className="bg-[#39FF14]/10 text-[#39FF14] text-[10px] font-black uppercase tracking-[3px] px-3 py-1 rounded-full w-fit mb-6">
                         Competition Detail
                       </div>
                       <h2 className="text-4xl font-black mb-4 dark:text-white leading-none">{selectedComp.title}</h2>
                       <p className="text-sm opacity-60 leading-relaxed font-medium">{selectedComp.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <DetailItem icon={Calendar} label="Tournament Date" value={new Date(selectedComp.start_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} />
                       <DetailItem icon={MapPin} label="Location" value="Court 1, ULTIMA Arena" />
                       <DetailItem icon={TrendingUp} label="Skill Level" value={selectedComp.skill_level} />
                       <DetailItem icon={Users} label="Mode" value={selectedComp.competition_type} />
                    </div>

                    <div className="p-6 bg-[#39FF14]/5 border border-[#39FF14]/10 rounded-3xl">
                       <div className="flex justify-between items-center mb-4">
                          <span className="text-xs font-black uppercase tracking-widest opacity-40">Prize Pool</span>
                          <span className="text-2xl font-black text-[#39FF14]">{selectedComp.prize_pool}</span>
                       </div>
                       <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-[#39FF14]" style={{ width: `${(selectedComp.current_players / selectedComp.max_players) * 100}%` }} />
                       </div>
                       <p className="text-[10px] font-bold mt-2 text-right opacity-40">{selectedComp.current_players} / {selectedComp.max_players} Slots SECURED</p>
                    </div>
                 </div>

                 {/* Right Panel: Bracket/Standings Placeholder */}
                 <div className="p-10 lg:p-12 space-y-8">
                    <h3 className="text-xs font-black uppercase tracking-[3px] opacity-40 mb-2">Live Brackets & Standings</h3>
                    
                    {selectedComp.status === 'Open' ? (
                      <div className="flex flex-col items-center justify-center h-64 text-center opacity-30 border-2 border-dashed border-white/5 rounded-3xl p-8">
                         <AlertCircle size={48} className="mb-4" />
                         <p className="font-bold text-sm uppercase tracking-wider">Brackets will be generated once registration closes</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                         {/* Mock Standing/Bracket UI */}
                         {[1, 2, 3, 4].map(i => (
                           <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                              <div className="flex items-center gap-4">
                                 <span className="font-black opacity-20 text-xl">{i}</span>
                                 <div className="w-10 h-10 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/20" />
                                 <span className="font-bold text-sm">Player {i}</span>
                              </div>
                              <span className="text-xs font-black text-[#39FF14]">+ {100 - i * 10}pts</span>
                           </div>
                         ))}
                      </div>
                    )}

                    <div className="pt-8">
                       <button 
                         onClick={() => handleRegister(selectedComp)}
                         disabled={userRegistrations.includes(selectedComp.id) || selectedComp.current_players >= selectedComp.max_players || selectedComp.status !== 'Open'}
                         className="w-full h-16 bg-[#39FF14] text-black font-black rounded-3xl shadow-xl shadow-[#39FF14]/20 hover:scale-[1.02] active:scale-95 transition-all"
                       >
                         {userRegistrations.includes(selectedComp.id) ? "YOU ARE IN" : "REGISTER FOR EVENT"}
                       </button>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {filteredTournaments.length === 0 && (
        <div className="text-center py-32 bg-white dark:bg-white/5 rounded-[40px] border-2 border-dashed border-gray-100 dark:border-white/5">
          <AlertCircle className="mx-auto mb-6 opacity-10" size={64} />
          <h3 className="text-2xl font-black opacity-40 tracking-tighter uppercase">No Competitions Found</h3>
          <p className="text-sm font-medium opacity-30 mt-2">Adjust your filters or check back later.</p>
        </div>
      )}
    </div>
  );
}

function CardInfo({ icon: Icon, label, value }: any) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-gray-400 dark:text-white/20">
        <Icon size={14} />
        <span className="text-[10px] font-black uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm font-black dark:text-white uppercase leading-none">{value}</p>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }: any) {
  return (
    <div className="p-4 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
      <div className="flex items-center gap-2 mb-2 opacity-30">
        <Icon size={14} />
        <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-sm font-black dark:text-white uppercase">{value}</p>
    </div>
  );
}
