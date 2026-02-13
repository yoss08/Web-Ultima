import { useEffect, useState } from "react";
import { CalendarDays, Clock, User, ChevronRight } from "lucide-react";
import { supabase } from "../../config/supabase";
import { useAuth } from "../../services/AuthContext";

export function PlayerSchedule() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMySchedule() {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from('sessions') // Table à créer pour les entraînements coach
        .select(`
          *,
          profiles:coach_id ( full_name )
        `)
        .eq('player_id', user.id)
        .gte('date', new Date().toISOString()) // Uniquement les sessions futures
        .order('date', { ascending: true })
        .limit(3);

      if (!error) setSessions(data || []);
      setLoading(false);
    }
    fetchMySchedule();
  }, [user]);

  return (
    <div className="bg-white dark:bg-white/5 rounded-[32px] p-6 border border-gray-100 dark:border-white/10 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold dark:text-white flex items-center gap-2 font-['Poppins']">
          <CalendarDays className="text-[#39FF14]" size={24} /> 
          Training Schedule
        </h3>
        <button className="text-[12px] font-bold text-[#39FF14] hover:underline uppercase tracking-wider">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="h-20 animate-pulse bg-gray-100 dark:bg-white/5 rounded-2xl" />
        ) : sessions.length === 0 ? (
          <div className="text-center py-8 opacity-50 text-sm italic">
            No training sessions scheduled.
          </div>
        ) : (
          sessions.map((session) => (
            <div key={session.id} className="group flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-[#39FF14]/5 transition-colors border border-transparent hover:border-[#39FF14]/20">
              {/* Date Block */}
              <div className="flex flex-col items-center justify-center min-w-[56px] h-[56px] bg-[#0A0E1A] dark:bg-white rounded-xl">
                <span className="text-[10px] font-bold text-white/50 dark:text-black/50 uppercase">
                  {new Date(session.date).toLocaleDateString('en-US', { month: 'short' })}
                </span>
                <span className="text-lg font-black text-white dark:text-black leading-none">
                  {new Date(session.date).getDate()}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h4 className="font-bold text-sm dark:text-white group-hover:text-[#39FF14] transition-colors">
                  {session.title || "Technical Training"}
                </h4>
                <div className="flex items-center gap-3 mt-1 opacity-60 text-[11px]">
                  <span className="flex items-center gap-1"><Clock size={12} /> {session.time_slot}</span>
                  <span className="flex items-center gap-1"><User size={12} /> Coach {session.profiles?.full_name}</span>
                </div>
              </div>

              <ChevronRight size={18} className="opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}