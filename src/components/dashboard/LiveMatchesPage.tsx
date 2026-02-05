import { motion } from "motion/react";
import { Play, Pause, Square, Clock, Users } from "lucide-react";
import { useState } from "react";

const matchesData = [
  {
    id: 1,
    court: "Court 1",
    players: {
      team1: ["Rodriguez", "Silva"],
      team2: ["Martinez", "Lopez"],
    },
    score: {
      sets: [
        { team1: 6, team2: 3 },
        { team1: 4, team2: 2 },
      ],
    },
    time: "32:15",
    status: "live",
  },
  {
    id: 2,
    court: "Court 2",
    players: {
      team1: ["Johnson", "Smith"],
      team2: ["Williams", "Jones"],
    },
    score: {
      sets: [
        { team1: 6, team2: 4 },
        { team1: 0, team2: 0 },
      ],
    },
    time: "45:22",
    status: "paused",
  },
  {
    id: 3,
    court: "Court 3",
    players: {
      team1: ["Anderson", "White"],
      team2: ["Taylor", "Brown"],
    },
    score: {
      sets: [
        { team1: 5, team2: 4 },
        { team1: 0, team2: 0 },
      ],
    },
    time: "28:40",
    status: "live",
  },
  {
    id: 4,
    court: "Court 5",
    players: {
      team1: ["Garcia", "Perez"],
      team2: ["Wilson", "Davis"],
    },
    score: {
      sets: [
        { team1: 2, team2: 1 },
        { team1: 1, team2: 1 },
      ],
    },
    time: "15:30",
    status: "live",
  },
  {
    id: 5,
    court: "Court 7",
    players: {
      team1: ["Miller", "Moore"],
      team2: ["Jackson", "Martin"],
    },
    score: {
      sets: [
        { team1: 6, team2: 2 },
        { team1: 3, team2: 1 },
      ],
    },
    time: "38:05",
    status: "live",
  },
  {
    id: 6,
    court: "Court 8",
    players: {
      team1: ["Thompson", "Harris"],
      team2: ["Clark", "Lewis"],
    },
    score: {
      sets: [
        { team1: 1, team2: 3 },
        { team1: 0, team2: 0 },
      ],
    },
    time: "12:18",
    status: "live",
  },
];

export function LiveMatchesPage() {
  const [matches] = useState(matchesData);

  const activeMatches = matches.filter((m) => m.status === "live").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="font-['Playfair_Display',serif] font-bold text-[36px] lg:text-[42px] text-white dark:text-[#0A0E1A] mb-2"
            style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
          >
            Live Matches
          </h1>
          <p className="font-['Poppins',sans-serif] text-[16px] text-white/60 dark:text-[#0A0E1A]/60">
            Monitor ongoing matches in real time
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-[#39FF14]/10 border border-[#39FF14] rounded-[12px]">
          <span className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse"></span>
          <span className="font-['Poppins',sans-serif] text-[14px] font-semibold text-[#39FF14]">
            {activeMatches} matches live
          </span>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {matches.map((match, index) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="bg-black/80 dark:bg-white/90 backdrop-blur-xl border border-white/10 dark:border-[#0A0E1A]/10 rounded-[20px] p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h3 className="font-['Poppins',sans-serif] font-bold text-[18px] text-white dark:text-[#0A0E1A]">
                  {match.court}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full font-['Poppins',sans-serif] text-[11px] uppercase font-semibold ${
                    match.status === "live"
                      ? "bg-[#39FF14]/10 border border-[#39FF14] text-[#39FF14]"
                      : "bg-yellow-500/10 border border-yellow-500 text-yellow-500"
                  }`}
                >
                  {match.status}
                </span>
              </div>

              <div className="flex items-center gap-1 text-white/60 dark:text-[#0A0E1A]/60">
                <Clock className="w-4 h-4" />
                <span className="font-['Poppins',sans-serif] text-[14px] font-mono">
                  {match.time}
                </span>
              </div>
            </div>

            {/* Score Display */}
            <div className="space-y-4 mb-6">
              {/* Team 1 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#39FF14]/20 border border-[#39FF14] flex items-center justify-center">
                    <Users className="w-4 h-4 text-[#39FF14]" />
                  </div>
                  <span className="font-['Poppins',sans-serif] text-[15px] text-white dark:text-[#0A0E1A]">
                    {match.players.team1.join(" / ")}
                  </span>
                </div>
                <div className="flex gap-2">
                  {match.score.sets.map((set, idx) => (
                    <span
                      key={idx}
                      className="w-10 h-10 rounded-[8px] bg-white/5 dark:bg-[#0A0E1A]/5 border border-white/20 dark:border-[#0A0E1A]/20 flex items-center justify-center font-['Poppins',sans-serif] font-bold text-[16px] text-white dark:text-[#0A0E1A]"
                    >
                      {set.team1}
                    </span>
                  ))}
                </div>
              </div>

              {/* Team 2 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#00E5FF]/20 border border-[#00E5FF] flex items-center justify-center">
                    <Users className="w-4 h-4 text-[#00E5FF]" />
                  </div>
                  <span className="font-['Poppins',sans-serif] text-[15px] text-white dark:text-[#0A0E1A]">
                    {match.players.team2.join(" / ")}
                  </span>
                </div>
                <div className="flex gap-2">
                  {match.score.sets.map((set, idx) => (
                    <span
                      key={idx}
                      className="w-10 h-10 rounded-[8px] bg-white/5 dark:bg-[#0A0E1A]/5 border border-white/20 dark:border-[#0A0E1A]/20 flex items-center justify-center font-['Poppins',sans-serif] font-bold text-[16px] text-white dark:text-[#0A0E1A]"
                    >
                      {set.team2}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-white/10 dark:border-[#0A0E1A]/10">
              <button className="flex-1 flex items-center justify-center gap-2 h-10 bg-[#39FF14]/10 hover:bg-[#39FF14]/20 border border-[#39FF14] rounded-[10px] transition-all font-['Poppins',sans-serif] text-[14px] font-semibold text-[#39FF14]">
                <Play className="w-4 h-4" />
                Resume
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 h-10 bg-white/5 hover:bg-white/10 dark:bg-[#0A0E1A]/5 dark:hover:bg-[#0A0E1A]/10 border border-white/20 dark:border-[#0A0E1A]/20 rounded-[10px] transition-all font-['Poppins',sans-serif] text-[14px] font-semibold text-white dark:text-[#0A0E1A]">
                <Pause className="w-4 h-4" />
                Pause
              </button>
              <button className="flex items-center justify-center gap-2 h-10 px-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500 rounded-[10px] transition-all font-['Poppins',sans-serif] text-[14px] font-semibold text-red-500">
                <Square className="w-4 h-4" />
                End
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
