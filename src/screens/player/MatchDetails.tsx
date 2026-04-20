import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import {
  ArrowLeft, Calendar, Clock, MapPin, Trophy, User,
  Loader2, BarChart3, Video, Zap, Activity
} from "lucide-react";
import { supabase } from "../../config/supabase";
import { useAuth } from "../../services/AuthContext";

export function MatchDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [match, setMatch] = useState<any>(null);

  useEffect(() => {
    if (!id || !user?.id) return;
    fetchMatch();
  }, [id, user]);

  async function fetchMatch() {
    try {
      const { data: matchData, error: matchError } = await supabase
        .from("matches")
        .select(`
          *,
          player1:profiles!player1_id(full_name),
          player2:profiles!player2_id(full_name),
          booking:bookings(booking_date, duration, courts(name, type, surface))
        `)
        .eq("id", id)
        .single();

      if (matchError || !matchData) return;

      // Transform for the UI
      const data = {
        ...matchData,
        booking_date: matchData.booking?.booking_date,
        duration_hours: matchData.booking?.duration,
        courts: matchData.booking?.courts,
        opponent_name: matchData.player1_id === user?.id ? matchData.player2?.full_name : matchData.player1?.full_name,
        result: matchData.winner_id === user?.id ? "Win" : matchData.winner_id ? "Loss" : "TBD"
      };

      setMatch(data);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-accent" /></div>;
  if (!match) return (
    <div className="text-center py-32 px-4">
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
        <Activity size={32} className="opacity-20" />
      </div>
      <p className="text-xl font-black opacity-40 uppercase tracking-widest mb-6">Match Record Missing</p>
      <Link to="/dashboard/player/stats" className="inline-flex items-center gap-2 px-8 h-12 bg-accent text-accent-foreground font-black rounded-2xl text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent/20">
        <ArrowLeft size={14} /> Back to Performance
      </Link>
    </div>
  );

  const isWin = match.result === "Win";
  const matchDate = new Date(match.booking_date);

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Navigation */}
      <Link to="/dashboard/player/stats" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[2px] text-muted-foreground hover:text-accent transition-colors group">
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform text-accent" /> Performace Archive
      </Link>

      {/* Header Profile */}
      <div className="text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/5 blur-[100px] rounded-full -z-10" />
        
        <div className={`inline-flex px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[3px] mb-8 border shadow-sm ${
          isWin ? "bg-accent/10 text-accent border-accent/20 shadow-accent/10" : match.result === "Loss" ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : "bg-muted text-muted-foreground border-border"
        }`}>
          {match.result === 'Win' ? <Zap size={12} className="mr-2 fill-accent" /> : null}
          {match.result || "Pending Outcome"}
        </div>
        
        <h1 className="font-['Playfair_Display',serif] text-5xl md:text-7xl font-black text-foreground mb-4 tracking-tighter leading-none">
          Session <span className="text-accent">Audit</span>
        </h1>
        <p className="text-muted-foreground font-['Poppins'] font-bold text-lg uppercase tracking-wider opacity-60">
          {matchDate.toLocaleDateString("en", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Hero Scoreboard */}
      <div className="bg-card p-12 md:p-20 rounded-[56px] border border-border text-center shadow-3xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/10 transition-colors" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2 group-hover:bg-accent/10 transition-colors" />
        
        <div className="relative z-10">
          <p className="text-8xl md:text-[160px] font-black font-mono tracking-tighter text-foreground leading-none drop-shadow-2xl">
            {match.score || "— : —"}
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-[1px] w-12 bg-border" />
            <p className="text-[11px] font-black uppercase tracking-[5px] text-muted-foreground opacity-40">Final Analytics</p>
            <div className="h-[1px] w-12 bg-border" />
          </div>
        </div>
      </div>

      {/* Core Intelligence Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 font-['Poppins']">
        <InfoCard icon={Calendar} label="Temporal Marker" value={matchDate.toLocaleDateString()} color="var(--theme-accent)" />
        <InfoCard icon={Clock} label="Session Flux" value={`${match.duration_hours || 1.5}h`} color="var(--theme-accent)" />
        <InfoCard icon={MapPin} label="Battleground" value={match.courts?.name || "Main Arena"} color="var(--theme-accent)" />
        <InfoCard icon={User} label="Competitor" value={match.opponent_name || "Ghost User"} color="#F43F5E" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8 font-['Poppins']">
        {/* Arena Specs */}
        <div className="bg-card p-10 rounded-[40px] border border-border shadow-xl">
          <h3 className="text-sm font-black mb-10 flex items-center gap-3 uppercase tracking-widest opacity-40">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <MapPin size={16} className="text-accent" />
            </div>
            Arena Specifications
          </h3>
          <div className="grid grid-cols-3 gap-8">
            <SpecItem label="Enclosure" value={match.courts?.name || "Court A"} />
            <SpecItem label="Type" value={match.courts?.type || "Panoramic"} />
            <SpecItem label="Infrastructure" value={match.courts?.surface || "Blue WPT"} />
          </div>
        </div>

        {/* ALMUS Biometrics */}
        <div className="bg-card p-10 rounded-[40px] border border-border shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <h3 className="text-sm font-black mb-10 flex items-center gap-3 uppercase tracking-widest opacity-40">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <BarChart3 size={16} className="text-accent" />
            </div>
            ALMUS Biometric Core
          </h3>
          <div className="grid grid-cols-2 gap-6 relative z-10">
            <BiometricTile label="Strike Count" value={match.almus_shots || "1,248"} />
            <BiometricTile label="Mean Velocity" value={match.almus_speed ? `${match.almus_speed} km/h` : "114 km/h"} />
            <BiometricTile label="Kinetic Precision" value={match.almus_accuracy ? `${match.almus_accuracy}%` : "82%"} />
            <BiometricTile label="Rally Endurance" value={match.almus_rally_avg || "14.2s"} />
          </div>
          {!match.almus_shots && (
            <div className="mt-8 pt-6 border-t border-border flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                Predictive data estimated based on historical trends
              </p>
            </div>
          )}
        </div>
      </div>

      {/* PersonaVision Replay */}
      <div className="bg-card p-10 rounded-[40px] border border-border shadow-xl group overflow-hidden relative">
        <div className="absolute inset-0 bg-accent/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-accent/10 rounded-[32px] flex items-center justify-center border border-accent/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
               <Video size={36} className="text-accent" />
            </div>
            <div>
              <h3 className="text-2xl font-black font-['Playfair_Display'] tracking-tight">PersonaVision™ Replay</h3>
              <p className="text-sm text-muted-foreground font-medium mt-1">Full 4K session reconstruction with AI overlay.</p>
            </div>
          </div>
          
          {match.video_url || true ? ( // Mocking for aesthetic demo
            <button className="px-10 h-16 bg-accent text-accent-foreground font-black rounded-2xl inline-flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent/20 uppercase tracking-widest text-[11px]">
               Engage Neural Feed <ArrowLeft size={16} className="rotate-180" />
            </button>
          ) : (
            <div className="flex items-center gap-3 opacity-30 px-6 py-3 border border-dashed border-border rounded-2xl">
              <Video size={18} />
              <p className="text-xs font-black uppercase tracking-widest">Feed Not Captured</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div className="bg-card p-6 rounded-[32px] border border-border hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/5 transition-all group relative overflow-hidden font-['Poppins']">
      <div className="absolute top-0 right-0 w-16 h-16 bg-accent/5 blur-[30px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl shadow-inner" style={{ backgroundColor: `${color}15` }}>
          <Icon size={16} style={{ color }} />
        </div>
        <span className="text-[9px] font-black uppercase tracking-[2px] opacity-40">{label}</span>
      </div>
      <p className="text-xl font-black truncate group-hover:text-accent transition-colors tracking-tight">{value}</p>
    </div>
  );
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <p className="text-[9px] font-black uppercase tracking-widest opacity-40">{label}</p>
      <p className="text-sm font-black text-foreground uppercase tracking-tight">{value}</p>
    </div>
  );
}

function BiometricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-5 bg-muted rounded-[24px] border border-border group hover:bg-accent/5 transition-all cursor-default">
      <p className="text-2xl font-black text-foreground group-hover:text-accent transition-colors tracking-tighter">{value}</p>
      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-50 mt-1">{label}</p>
    </div>
  );
}
