import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import {
  ArrowLeft, Calendar, Clock, MapPin, Trophy, User,
  Loader2, BarChart3, Video
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

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#39FF14]" /></div>;
  if (!match) return (
    <div className="text-center py-20">
      <p className="opacity-50 mb-4">Match not found.</p>
      <Link to="/dashboard/player/stats" className="text-[#00E5FF] font-bold">← Back to Stats</Link>
    </div>
  );

  const isWin = match.result === "Win";
  const matchDate = new Date(match.booking_date);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 max-w-4xl mx-auto">
      {/* Back */}
      <Link to="/dashboard/player/stats" className="inline-flex items-center gap-2 text-sm font-bold opacity-50 hover:opacity-100 transition-opacity">
        <ArrowLeft size={16} /> Back to Stats
      </Link>

      {/* Header */}
      <div className="text-center">
        <div className={`inline-flex px-4 py-1.5 rounded-full text-sm font-black mb-4 ${
          isWin ? "bg-[#00E5FF]/10 text-[#00E5FF]" : match.result === "Loss" ? "bg-red-500/10 text-red-500" : "bg-gray-100 dark:bg-white/10 opacity-40"
        }`}>
          {match.result || "Pending"}
        </div>
        <h1 className="font-['Playfair_Display',serif] text-4xl md:text-5xl font-black dark:text-white mb-2">
          Match <span className="text-[#00E5FF]">Details</span>
        </h1>
        <p className="opacity-50 font-['Poppins']">{matchDate.toLocaleDateString("en", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      {/* Score */}
      <div className="bg-white dark:bg-white/5 p-8 rounded-[32px] border border-gray-200 dark:border-white/10 text-center">
        <p className="text-6xl md:text-8xl font-black font-mono tracking-wider">
          {match.score || "— : —"}
        </p>
        <p className="text-sm opacity-40 mt-2 font-['Poppins']">Final Score</p>
      </div>

      {/* Details Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoCard icon={Calendar} label="Date" value={matchDate.toLocaleDateString()} color="#39FF14" />
        <InfoCard icon={Clock} label="Duration" value={`${match.duration_hours || 1}h`} color="#00E5FF" />
        <InfoCard icon={MapPin} label="Court" value={match.courts?.name || "—"} color="#FFD700" />
        <InfoCard icon={User} label="Opponent" value={match.opponent_name || "Unknown"} color="#FF4D4D" />
      </div>

      {/* Court Info */}
      <div className="bg-white dark:bg-white/5 p-6 rounded-[28px] border border-gray-200 dark:border-white/10">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <MapPin size={18} className="text-[#FFD700]" /> Court Information
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs opacity-40 font-bold uppercase tracking-wider">Name</p>
            <p className="font-bold mt-1">{match.courts?.name || "—"}</p>
          </div>
          <div>
            <p className="text-xs opacity-40 font-bold uppercase tracking-wider">Type</p>
            <p className="font-bold mt-1 capitalize">{match.courts?.type || "—"}</p>
          </div>
          <div>
            <p className="text-xs opacity-40 font-bold uppercase tracking-wider">Surface</p>
            <p className="font-bold mt-1 capitalize">{match.courts?.surface || "—"}</p>
          </div>
        </div>
      </div>

      {/* ALMUS Stats Placeholder */}
      <div className="bg-white dark:bg-white/5 p-6 rounded-[28px] border border-gray-200 dark:border-white/10">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <BarChart3 size={18} className="text-[#39FF14]" /> ALMUS Analytics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Shots", value: match.almus_shots || "—" },
            { label: "Avg Speed", value: match.almus_speed ? `${match.almus_speed} km/h` : "—" },
            { label: "Accuracy", value: match.almus_accuracy ? `${match.almus_accuracy}%` : "—" },
            { label: "Rally Length", value: match.almus_rally_avg || "—" },
          ].map(s => (
            <div key={s.label} className="text-center p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
              <p className="text-2xl font-black">{s.value}</p>
              <p className="text-[10px] uppercase tracking-wider opacity-40 mt-1 font-bold">{s.label}</p>
            </div>
          ))}
        </div>
        {!match.almus_shots && (
          <p className="text-xs opacity-30 text-center mt-4 font-['Poppins']">
            ALMUS analytics will appear here when match data is recorded by the scoring system.
          </p>
        )}
      </div>

      {/* Video Replay Placeholder */}
      <div className="bg-white dark:bg-white/5 p-6 rounded-[28px] border border-gray-200 dark:border-white/10">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Video size={18} className="text-[#00E5FF]" /> PersonaVision Replay
        </h3>
        {match.video_url ? (
          <a href={match.video_url} target="_blank" rel="noopener noreferrer"
            className="px-6 py-3 bg-[#00E5FF] text-black font-bold rounded-xl inline-flex items-center gap-2 hover:scale-105 transition-transform">
            Watch Replay <ArrowLeft size={14} className="rotate-180" />
          </a>
        ) : (
          <div className="text-center py-8 opacity-30">
            <Video size={32} className="mx-auto mb-2" />
            <p className="text-sm font-['Poppins']">Video replay not available for this match.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div className="bg-white dark:bg-white/5 p-4 rounded-[20px] border border-gray-200 dark:border-white/10">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${color}15` }}>
          <Icon size={14} style={{ color }} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider opacity-40">{label}</span>
      </div>
      <p className="text-lg font-bold truncate">{value}</p>
    </div>
  );
}
