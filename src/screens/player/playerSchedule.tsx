import { useEffect, useState } from "react";
import { Clock, User, ChevronRight, Loader2, MapPin, CalendarDays } from "lucide-react";
import { supabase } from "../../config/supabase";
import { useAuth } from "../../services/AuthContext";

// --- TYPES TO FIX LINTING ERRORS ---
interface TrainingSession {
  id: string;
  start_time: string;
  session_type: string;
  profiles: { full_name: string } | null;
}

interface BookingMatch {
  id: string;
  booking_date: string;
  time_slot: string;
  courts: { name: string } | null;
}

interface CombinedEvent {
  id: string;
  date: string;
  title: string;
  time: string;
  subtitle: string;
  type: 'coach' | 'match';
  status: string;
}

export function PlayerSchedule() {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<CombinedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFullSchedule() {
      if (!user?.id) return;
      
      try {
        setLoading(true);

        // 1. Fetch Training Sessions (Coaching) - Joining with profiles for Coach Name
        const { data: trainingsData } = await supabase
          .from('training_sessions')
          .select(`
            id, 
            start_time, 
            session_type, 
            profiles:coach_id(full_name)
          `)
          .eq('student_id', user.id)
          .eq('status', 'scheduled')
          .gte('start_time', new Date().toISOString());

        // 2. Fetch Court Bookings (Matches) - Joining with courts for Court Name
        const { data: matchesData } = await supabase
          .from('bookings')
          .select(`
            id, 
            booking_date, 
            time_slot, 
            status,
            courts(name)
          `)
          .eq('user_id', user.id)
          .gte('booking_date', new Date().toISOString().split('T')[0]);

        // Cast the data to our interfaces to resolve the "red error"
        const trainings = (trainingsData as unknown as TrainingSession[]) || [];
        const matches = (matchesData as unknown as any[]) || [];

        // 3. Merge and Normalize for the UI
        const combined: CombinedEvent[] = [
          ...trainings.map(t => ({
            id: t.id,
            date: t.start_time,
            title: `Pro Training: ${t.session_type}`,
            time: new Date(t.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            subtitle: t.profiles?.full_name ? `Coach ${t.profiles.full_name}` : "Assigned Coach",
            type: 'coach' as const,
            status: 'scheduled'
          })),
          ...matches.map(m => ({
            id: m.id,
            date: m.booking_date,
            title: `Match @ ${m.courts?.name || 'Main Court'}`,
            time: m.time_slot,
            subtitle: "Court Reservation",
            type: 'match' as const,
            status: m.status
          }))
        ];

        // Sort by date (Soonest first)
        combined.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setSchedule(combined.slice(0, 3)); // Only show top 3
      } catch (err) {
        console.error("Schedule fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFullSchedule();
  }, [user]);

  if (loading) {
    return (
      <div className="bg-card rounded-[32px] p-12 flex flex-col items-center justify-center border border-border">
        <Loader2 className="animate-spin text-accent mb-4" size={32} />
        <p className="text-xs font-black opacity-40 uppercase tracking-widest text-foreground">Loading Schedule...</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-[40px] p-8 border border-border shadow-xl shadow-black/5">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div>
          <h3 className="text-2xl font-black text-foreground uppercase tracking-tighter">Your Schedule</h3>
          <p className="text-[10px] font-bold text-accent uppercase tracking-widest mt-1">Next 3 Events</p>
        </div>
        <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
          <CalendarDays className="text-accent" size={20} />
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {schedule.map((item) => (
          <div 
            key={item.id} 
            className="group flex items-center gap-5 p-5 rounded-[24px] bg-muted border border-transparent hover:border-accent/30 hover:bg-card-hover transition-all duration-300 cursor-pointer"
          >
            {/* Date Identity Block */}
            <div className="flex flex-col items-center justify-center min-w-[64px] h-[64px] bg-foreground text-background rounded-[18px] shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-[10px] font-black opacity-40 uppercase tracking-tighter">
                {new Date(item.date).toLocaleDateString('en-US', { month: 'short' })}
              </span>
              <span className="text-2xl font-black leading-none text-background">
                {new Date(item.date).getDate()}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {item.type === 'match' ? (
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    item.status === 'pending' ? 'bg-yellow-500' :
                    item.status === 'confirmed' || item.status === 'accepted' ? 'bg-emerald-500' :
                    'bg-red-500'
                  } ring-2 ring-background`} />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-accent ring-2 ring-background" />
                )}
                <h4 className="font-black text-[15px] text-foreground truncate uppercase tracking-tight group-hover:text-accent transition-colors">
                  {item.title}
                </h4>
              </div>
              
              <div className="flex items-center gap-4 opacity-50">
                <div className="flex items-center gap-1.5 text-[11px] font-bold">
                  <Clock size={13} className="text-accent" />
                  <span>{item.time}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold">
                  {item.type === 'coach' ? <User size={13} className="text-accent" /> : <MapPin size={13} className="text-accent" />}
                  <span className="truncate max-w-[100px]">{item.subtitle}</span>
                </div>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
              <ChevronRight size={16} className="text-accent" />
            </div>
          </div>
        ))}

        {schedule.length === 0 && (
          <div className="text-center py-10 px-4 border-2 border-dashed border-border rounded-[32px]">
            <p className="text-sm font-bold opacity-30 italic text-foreground">No training or matches scheduled yet.</p>
          </div>
        )}
      </div>

      <button className="w-full mt-6 py-4 rounded-2xl bg-muted text-[11px] font-black uppercase tracking-[2px] text-muted-foreground hover:text-accent transition-colors">
        View Full Calendar
      </button>
    </div>
  );
}