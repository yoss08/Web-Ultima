import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Trophy, 
  Calendar, 
  Users, 
  ArrowRight, 
  Search, 
  Loader2, 
  Medal 
} from "lucide-react";
import { supabase } from "../../config/supabase";
import { toast } from "react-hot-toast";

interface Tournament {
  id: string;
  title: string;
  start_date: string;
  max_players: number;
  current_players: number;
  prize_pool: string;
  status: string;
}

export function Competitions() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTournaments() {
      try {
        const { data, error } = await supabase
          .from('tournaments')
          .select('*')
          .order('start_date', { ascending: true });

        if (error) throw error;
        setTournaments(data || []);
      } catch (err) {
        console.error("Error fetching tournaments:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTournaments();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#39FF14]" size={40} />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-['Playfair_Display'] font-bold text-4xl dark:text-white">Active Competitions</h1>
          <p className="text-[#0A0E1A]/60 dark:text-white/60 font-['Poppins']">
            Register for upcoming tournaments and prove your skills.
          </p>
        </div>
        <button 
          onClick={() => toast.success("Feature coming soon!")}
          className="px-6 h-12 bg-[#39FF14] text-black font-bold rounded-xl text-sm flex items-center gap-2 hover:scale-105 transition-all"
        >
          <Search size={18} /> Find More
        </button>
      </div>

      {/* Logic for No Competitions */}
      {tournaments.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[40px] p-16 text-center"
        >
          <div className="w-20 h-20 bg-[#39FF14]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#39FF14]/20">
            <Medal className="text-[#39FF14]" size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-2 dark:text-white font-['Playfair_Display']">The Arena is Quiet... For Now</h2>
          <p className="text-[#0A0E1A]/60 dark:text-white/60 max-w-md mx-auto mb-8 font-['Poppins']">
            Our upcoming season is being scheduled. Stay tuned for local leagues, open championships, and high-stakes tournaments.
          </p>
          <button 
            onClick={() => toast.success("We'll notify you when a tournament opens!")}
            className="px-8 py-3 bg-[#0A0E1A] dark:bg-white dark:text-black text-white font-bold rounded-xl hover:opacity-90 transition-all"
          >
            Notify Me of Next Season
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tournaments.map((t) => (
            <motion.div 
              whileHover={{ y: -5 }}
              key={t.id} 
              className="bg-white dark:bg-white/5 p-8 rounded-[32px] border border-gray-200 dark:border-white/10 relative overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute top-0 right-0 p-6">
                 <span className="text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 bg-[#39FF14]/10 text-[#39FF14] rounded-full border border-[#39FF14]/20">
                   {t.status}
                 </span>
              </div>
              
              <div className="w-14 h-14 bg-[#FFD700]/10 rounded-2xl flex items-center justify-center mb-6">
                <Trophy className="text-[#FFD700]" size={30} />
              </div>
              
              <h3 className="text-2xl font-bold mb-3 dark:text-white">{t.title}</h3>
              
              <div className="space-y-3 mb-8 opacity-70 text-sm font-medium">
                <div className="flex items-center gap-3"><Calendar size={16} className="text-[#39FF14]"/> {new Date(t.start_date).toLocaleDateString()}</div>
                <div className="flex items-center gap-3"><Users size={16} className="text-[#39FF14]"/> {t.current_players}/{t.max_players} Players Registered</div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-gray-100 dark:border-white/10">
                <div>
                  <p className="text-[10px] uppercase tracking-wider opacity-50 font-bold mb-1">Prize Pool</p>
                  <span className="font-bold text-xl text-[#39FF14]">{t.prize_pool}</span>
                </div>
                <button className="h-12 px-6 bg-[#0A0E1A] dark:bg-white dark:text-black text-white rounded-xl text-sm font-bold flex items-center gap-2 group-hover:bg-[#39FF14] group-hover:text-black transition-all">
                  Join Now <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}