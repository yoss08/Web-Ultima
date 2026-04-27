import { useEffect, useState } from "react";
import { CheckCircle2, Clock, Loader2, Activity, Zap, ChevronRight, X, Calendar, Search, Filter, ArrowUpDown, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../config/supabase";
import { useAuth } from "../../services/AuthContext";

export function Matches() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'Win' | 'Loss' | 'TBD'>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedMatch, setSelectedMatch] = useState<any>(null);

  useEffect(() => {
    async function fetchMatches() {
      if (!user?.id) return;
      setLoading(true);
      
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          player1:profiles!player1_id(full_name),
          player2:profiles!player2_id(full_name),
          booking:bookings(booking_date, time_slot, courts(name, surface))
        `)
        .or(`player1_id.eq.${user.id},player2_id.eq.${user.id}`)
        .order('created_at', { ascending: sortOrder === 'asc' });
      
      if (!error && data) {
        // Flatten for the UI
        const flattened = data.map(m => ({
          ...m,
          booking_date: m.booking?.booking_date,
          time_slot: m.booking?.time_slot,
          courts: m.booking?.courts,
          opponent_name: m.player1_id === user.id ? m.player2?.full_name : m.player1?.full_name,
          result: m.winner_id === user.id ? 'Win' : m.winner_id ? 'Loss' : 'TBD'
        }));
        setMatches(flattened);
      }
      setLoading(false);
    }
    fetchMatches();
  }, [user, sortOrder]);

  const filteredMatches = matches.filter(m => {
    const matchesSearch = m.courts?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || m.result === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading && matches.length === 0) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-accent" /></div>;

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-['Playfair_Display',serif] text-2xl md:text-4xl font-black text-foreground leading-none mb-4 tracking-tighter">Match History</h1>
          <p className="text-muted-foreground font-['Poppins']">Detailed breakdown of your performance on court.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:text-accent transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Search courts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 pl-12 pr-6 rounded-2xl bg-card border-border outline-none text-sm font-medium w-full md:w-64 focus:ring-1 ring-accent/50 transition-all"
              />
           </div>
           
           <select 
             value={statusFilter}
             onChange={(e: any) => setStatusFilter(e.target.value)}
             className="h-12 px-4 rounded-2xl bg-card border-border outline-none text-sm font-bold dark:text-white"
           >
             <option value="all">All Results</option>
             <option value="Win">Wins</option>
             <option value="Loss">Losses</option>
             <option value="TBD">Scheduled</option>
           </select>

           <button 
             onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
             className="h-12 px-4 rounded-2xl bg-card border-border flex items-center gap-2 text-sm font-bold dark:text-white hover:border-[#00E5FF]/50"
           >
             <ArrowUpDown size={16} className="text-accent" />
             {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
           </button>
        </div>
      </header>

      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {filteredMatches.length === 0 ? (
            <div className="text-center py-32 bg-card rounded-[40px] border-2 border-dashed border-border">
              <AlertCircle className="text-muted-foreground/30 mx-auto mb-4" size={64} />
              <h3 className="text-xl font-bold text-foreground">No Matches Found</h3>
              <p className="text-muted-foreground text-sm mt-2">Book court or check back later.</p>
            </div>
          ) : filteredMatches.map((match) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={match.id} 
              onClick={() => setSelectedMatch(match)}
              className="bg-card p-6 rounded-[28px] border border-border flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:border-accent/50 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-colors ${
                  match.result === 'Win' 
                    ? 'bg-accent/10 border-accent/20 text-accent' 
                    : match.result === 'Loss'
                    ? 'bg-red-500/10 border-red-500/20 text-red-500'
                    : 'bg-muted border-transparent text-muted-foreground'
                }`}>
                  {match.result === 'Win' ? <Zap size={24} /> : match.result === 'Loss' ? <X size={24} /> : <Clock size={24} />}
                </div>
                <div>
                  <h4 className="font-bold text-xl group-hover:text-accent transition-colors">{match.courts?.name}</h4>
                  <div className="flex items-center gap-4 text-xs opacity-60 font-medium mt-1">
                    <span className="flex items-center gap-1.5"><Calendar size={14} className="text-accent"/> {new Date(match.booking_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className="flex items-center gap-1.5"><Clock size={14} className="text-accent"/> {match.time_slot}</span>
                    <span className="px-2 py-0.5 rounded-full bg-muted text-[10px] uppercase font-black tracking-tighter text-foreground">{match.courts?.surface}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex items-center justify-between md:justify-end gap-10 border-t md:border-t-0 pt-4 md:pt-0 border-gray-100 dark:border-white/5">
                <div className="text-left md:text-center">
                  <p className="text-[9px] uppercase opacity-40 font-black tracking-widest mb-1">Final Score</p>
                  <p className={`font-mono font-black text-2xl tracking-tighter ${match.result === 'Win' ? 'text-accent' : ''}`}>
                    {match.score || "---"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:block">
                    {match.result === 'Win' ? (
                       <span className="text-[10px] font-black uppercase text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">Victory</span>
                    ) : match.result === 'Loss' ? (
                       <span className="text-[10px] font-black uppercase text-red-500 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">Defeat</span>
                    ) : (
                       <span className="text-[10px] font-black uppercase text-muted-foreground bg-muted px-3 py-1 rounded-full">Scheduled</span>
                    )}
                  </div>
                  <ChevronRight className="opacity-20 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-accent" />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Match Details Modal */}
      <AnimatePresence>
        {selectedMatch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl" onClick={() => setSelectedMatch(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card p-8 md:p-12 rounded-[48px] max-w-2xl w-full relative border border-border shadow-3xl text-foreground"
            >
              <button onClick={() => setSelectedMatch(null)} className="absolute top-8 right-8 w-10 h-10 rounded-full bg-muted flex items-center justify-center opacity-60 hover:opacity-100 hover:bg-red-500/20 hover:text-red-500 transition-all"><X size={20} /></button>
              
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-[10px] font-black uppercase tracking-[2px] mb-6 border border-accent/20">
                  <Zap size={14} /> ALMUS Performance Core
                </div>
                <h2 className="text-4xl md:text-5xl font-black mb-2 tracking-tighter">{selectedMatch.courts?.name}</h2>
                <div className="flex items-center justify-center gap-4 text-sm font-black opacity-40 uppercase tracking-widest text-foreground">
                   <span>{selectedMatch.time_slot}</span>
                   <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                   <span>{new Date(selectedMatch.booking_date).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <DetailStat icon={Activity} label="Intensity" value="High" color="var(--theme-accent)" />
                <DetailStat icon={Zap} label="Top Speed" value="128 km/h" color="var(--theme-accent)" />
                <DetailStat icon={CheckCircle2} label="Accuracy" value="84%" color="var(--theme-accent)" />
                <DetailStat icon={Clock} label="Duration" value={`${selectedMatch.duration || 1.5}h`} color="var(--theme-accent)" />
              </div>

              <div className="space-y-4 mb-10 bg-muted p-6 rounded-[32px] border border-border">
                <h4 className="text-xs font-black uppercase tracking-[3px] opacity-30 mb-2">Technical Breakdown</h4>
                <div className="space-y-4">
                  <ProgressBar label="First Serve In" value={72} color="var(--theme-accent)" />
                  <ProgressBar label="Winners" value={18} max={25} color="var(--theme-accent)" />
                  <ProgressBar label="Unforced Errors" value={12} max={20} color="#FF4D4D" inverse />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                 <button className="flex-1 py-4 bg-accent text-accent-foreground font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-accent/20">Watch Video Replay</button>
                 <button onClick={() => setSelectedMatch(null)} className="flex-1 py-4 bg-muted text-foreground font-black rounded-2xl hover:bg-muted/80 transition-all">Dismiss</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailStat({ icon: Icon, label, value, color }: any) {
  return (
    <div className="bg-muted p-4 rounded-3xl text-center border border-border">
      <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
        <Icon size={18} style={{ color }} />
      </div>
      <p className="text-[9px] uppercase opacity-40 font-black tracking-widest leading-none mb-1">{label}</p>
      <p className="text-lg font-black">{value}</p>
    </div>
  );
}

function ProgressBar({ label, value, max = 100, color, inverse = false }: any) {
  const percentage = (value / max) * 100;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
        <span className="opacity-60">{label}</span>
        <span style={{ color: inverse ? (percentage > 70 ? '#FF4D4D' : color) : color }}>{value}{max === 100 ? '%' : ''}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}
