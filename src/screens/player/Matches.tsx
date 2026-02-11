import { useEffect, useState } from "react";
import { History, CheckCircle2, XCircle, Clock, Calendar, Loader2 } from "lucide-react";
import { supabase } from "../../config/supabase";
import { useAuth } from "../../services/AuthContext";

interface BookingMatch {
  id: string;
  booking_date: string;
  time_slot: string;
  status: string;
  result: string | null;
  score: string | null;
  courts: {
    name: string;
  };
}

export function Matches() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<BookingMatch[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchMatches() {
      if (!user) return;

      try {
        // 3. Forcer le type dans la requête Supabase
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            id,
            booking_date,
            time_slot,
            status,
            result,
            score,
            courts ( name )
          `)
          .eq('user_id', user.id)
          .order('booking_date', { ascending: false });

        if (error) throw error;

        // On "cast" la donnée pour rassurer TypeScript
        setMatches((data as any) || []); 
        
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();
  }, [user]);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#39FF14]" size={40} />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex items-center gap-4">
        <div className="p-3 bg-[#39FF14]/10 rounded-2xl border border-[#39FF14]/20">
          <History className="text-[#39FF14]" />
        </div>
        <div>
          <h1 className="font-['Playfair_Display'] font-bold text-3xl dark:text-white">My Match History</h1>
          <p className="text-[#0A0E1A]/60 dark:text-white/60 font-['Poppins']">
            All your court activities and results in one place.
          </p>
        </div>
      </header>

      {matches.length === 0 ? (
        <div className="bg-white dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/10 rounded-[32px] p-12 text-center">
          <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-bold mb-2">No matches found</h3>
          <p className="text-sm opacity-60 mb-6">You haven't booked any courts yet.</p>
          <button className="px-6 py-3 bg-[#39FF14] text-black font-bold rounded-xl hover:scale-105 transition-all">
            Book your first court
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-white/5 rounded-[24px] border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-white/5 text-[10px] uppercase tracking-[2px] font-bold opacity-60">
                <tr>
                  <th className="px-8 py-5">Result</th>
                  <th className="px-8 py-5">Court / Location</th>
                  <th className="px-8 py-5">Score</th>
                  <th className="px-8 py-5">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                {matches.map((match) => (
                  <tr key={match.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        {match.result === "Win" ? (
                          <CheckCircle2 size={20} className="text-[#39FF14]" />
                        ) : match.result === "Loss" ? (
                          <XCircle size={20} className="text-red-500" />
                        ) : (
                          <Clock size={20} className="text-gray-400" />
                        )}
                        <span className={`font-bold ${!match.result && "text-gray-400"}`}>
                          {match.result || "Pending"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-[#0A0E1A] dark:text-white group-hover:text-[#39FF14] transition-colors">
                        {match.courts?.name}
                      </p>
                      <p className="text-[11px] opacity-50 uppercase font-semibold">Standard Court</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-mono bg-gray-100 dark:bg-white/10 px-3 py-1 rounded-lg text-sm font-bold">
                        {match.score || "-- : --"}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-semibold text-sm">{new Date(match.booking_date).toLocaleDateString()}</p>
                      <p className="text-[11px] text-[#39FF14] font-bold">{match.time_slot}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}