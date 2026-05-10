import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, ChevronRight, CheckCircle2, Play, Pause, Square, Edit2 } from 'lucide-react';

export interface Match {
  id: string | number;
  match_type: 'singles' | 'doubles';
  status: 'live' | 'paused' | 'scheduled' | 'completed' | 'finished';
  score: string;
  points?: string;
  player1_id?: string;
  player2_id?: string;
  player3_id?: string;
  player4_id?: string;
  court_id?: string;
  start_time?: string;
  end_time?: string;
  winner_team?: number;
  created_at: string;
  player1?: { full_name: string };
  player2?: { full_name: string };
  player3?: { full_name: string };
  player4?: { full_name: string };
  court?: { name: string };
  booking?: {
    time_slot: string;
    courts?: { name: string };
  };
  clubs?: { name: string };
}

interface MatchCardProps {
  match: Match;
  delay?: number;
  onEditScore?: () => void;
  onStart?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onEnd?: () => void;
  showActions?: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({ 
  match, 
  delay = 0, 
  onEditScore, 
  onStart, 
  onPause, 
  onResume, 
  onEnd,
  showActions = true
}) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const calculateDuration = (start: string | undefined, end: string | undefined | null, status: string) => {
      const startTime = start ? new Date(start).getTime() : 0;
      if (isNaN(startTime) || startTime === 0) return 0;

      const isLiveOrPaused = status === 'live' || status === 'paused';
      const endTime = end ? new Date(end).getTime() : (isLiveOrPaused ? Date.now() : startTime);
      const effectiveEnd = isNaN(endTime) ? (isLiveOrPaused ? Date.now() : startTime) : endTime;
      
      const diff = Math.floor((effectiveEnd - startTime) / 60000);
      return diff < 0 || diff > 1440 ? 0 : diff;
    };

    if (match.status === 'scheduled') {
      setElapsed(0);
      return;
    }

    if (match.status !== 'live') {
      setElapsed(calculateDuration(match.start_time, match.end_time, match.status));
      return;
    }

    const update = () => {
      setElapsed(calculateDuration(match.start_time, match.end_time, match.status));
    };

    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, [match.start_time, match.end_time, match.status]);

  const statusColors: any = {
    scheduled: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    live: "text-accent bg-accent/10 border-accent/20",
    paused: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    completed: "text-green-400 bg-green-500/10 border-green-500/20",
    finished: "text-muted-foreground bg-muted/10 border-border",
  };

  const isLive = match.status === 'live';
  const isPaused = match.status === 'paused';
  const isScheduled = match.status === 'scheduled';
  const isFinished = match.status === 'completed' || match.status === 'finished';

  const progress = Math.min(100, (elapsed / 90) * 100);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className={`relative group bg-card border border-border rounded-[32px] overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md ${
        isLive ? 'ring-2 ring-accent/20' : ''
      }`}
    >
      {/* 90-minute Progress Bar */}
      {(isLive || isPaused || isFinished) && (
        <div className="absolute top-0 left-0 w-full h-1 bg-muted/30 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className={`h-full transition-colors duration-500 ${
              progress > 90 ? 'bg-red-500' : progress > 70 ? 'bg-orange-500' : 'bg-accent'
            }`}
          />
        </div>
      )}

      <div className="p-6 sm:p-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border font-['Poppins'] ${statusColors[match.status]}`}>
              <div className="flex items-center gap-2">
                {isLive && <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />}
                {match.status}
              </div>
            </span>
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 font-['Poppins']">
              <ChevronRight size={14} className="text-border" />
              {match.clubs?.name || "No Club"}
            </span>
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 font-['Poppins']">
              <ChevronRight size={14} className="text-border" />
              {match.court?.name || match.booking?.courts?.name || "No Court"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground/60 text-[11px] font-bold font-['Poppins']">
            <Clock size={14} />
            <span>{isScheduled && match.booking?.time_slot ? match.booking.time_slot.split(' - ')[0] : `${elapsed} / 90 min`}</span>
          </div>
        </div>

        {/* Players & Score */}
        <div className="flex items-center justify-between gap-6">
          {/* Team A */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col items-center sm:items-start gap-1">
              <span className="text-[9px] font-black text-accent uppercase tracking-[0.2em] font-['Poppins'] opacity-80">Team A</span>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-black text-foreground truncate font-['Poppins'] leading-tight">
                  {match.player1?.full_name || "Player 1"}
                </span>
                <span className="text-sm font-bold text-muted-foreground/60 truncate font-['Poppins']">
                  {match.player2?.full_name || ""}
                </span>
              </div>
            </div>
          </div>

          {/* Score Display */}
          <div className="relative shrink-0">
            <div 
              onClick={!isFinished ? onEditScore : undefined}
              className={`flex flex-col items-center justify-center min-w-[120px] sm:min-w-[140px] h-[100px] rounded-[24px] bg-muted/20 border border-border/50 transition-all px-4 ${
                !isFinished && onEditScore ? 'cursor-pointer hover:bg-muted/40 hover:border-accent/30 active:scale-95' : 'cursor-default opacity-80'
              }`}
            >
              <span className="text-[10px] font-black text-muted-foreground/20 uppercase tracking-[0.3em] mb-1">VS</span>
              
              {(() => {
                const parts = (match.score || '0-0').split(',').map(s => s.trim());
                const prevSets = parts.slice(0, -1).join(', ');
                const currentSet = parts[parts.length - 1];
                return (
                  <div className="flex flex-col items-center">
                    {prevSets && (
                      <span className="text-[10px] font-bold text-muted-foreground/40 font-['Poppins'] mb-1 tracking-widest">
                        {prevSets}
                      </span>
                    )}
                    <span className="text-3xl sm:text-4xl font-black text-foreground tracking-tighter font-['Poppins'] tabular-nums leading-none">
                      {currentSet.replace('-', ' — ')}
                    </span>
                    {!isFinished && match.points && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-accent animate-pulse" />
                        <span className="text-[11px] font-black text-accent font-['Poppins'] tracking-wider">
                          {match.points}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Team B */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col items-center sm:items-end gap-1">
              <span className="text-[9px] font-black text-red-500 uppercase tracking-[0.2em] font-['Poppins'] opacity-80">Team B</span>
              <div className="flex flex-col items-center sm:items-end">
                <span className="text-lg sm:text-xl font-black text-foreground truncate font-['Poppins'] leading-tight">
                  {match.player3?.full_name || "Player 3"}
                </span>
                <span className="text-sm font-bold text-muted-foreground/60 truncate font-['Poppins']">
                  {match.player4?.full_name || ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Winner Banner */}
        {isFinished && match.winner_team && (
          <div className="mt-8 pt-8 border-t border-border">
            <div className={`flex items-center justify-between rounded-2xl p-4 ${
              match.winner_team === 1 ? 'bg-accent/10 border border-accent/20' : 'bg-red-500/10 border border-red-500/20'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  match.winner_team === 1 ? 'bg-accent/20 text-accent' : 'bg-red-500/20 text-red-500'
                }`}>
                  <Trophy size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-['Poppins']">Winners</p>
                  <p className={`text-sm font-bold font-['Poppins'] ${
                    match.winner_team === 1 ? 'text-accent' : 'text-red-500'
                  }`}>
                    {match.winner_team === 1
                      ? `${match.player1?.full_name || 'Player 1'} & ${match.player2?.full_name || 'Player 2'}`
                      : `${match.player3?.full_name || 'Player 3'} & ${match.player4?.full_name || 'Player 4'}`
                    }
                  </p>
                </div>
              </div>
              <span className="text-2xl font-black text-foreground font-['Poppins']">{match.score}</span>
            </div>
          </div>
        )}

        {/* Completed without winner info */}
        {isFinished && !match.winner_team && (
          <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground/60 text-sm font-medium border-t border-border pt-6 font-['Poppins']">
            <CheckCircle2 size={16} />
            <span>Match completed · {match.score}</span>
          </div>
        )}

        {/* Action Buttons */}
        {showActions && !isFinished && (
          <div className="mt-8 pt-8 border-t border-border flex flex-wrap gap-3">
            {isScheduled && onStart && (
              <button 
                onClick={onStart}
                className="flex-1 min-w-[140px] h-12 rounded-xl bg-accent text-accent-foreground font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all font-['Poppins'] shadow-sm"
              >
                <Play size={18} fill="currentColor" /> START MATCH
              </button>
            )}

            {isLive && onPause && (
              <button 
                onClick={onPause}
                className="flex-1 min-w-[140px] h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 font-bold text-sm flex items-center justify-center gap-2 hover:bg-orange-500/20 transition-all font-['Poppins']"
              >
                <Pause size={18} fill="currentColor" /> PAUSE
              </button>
            )}

            {isPaused && onResume && (
              <button 
                onClick={onResume}
                className="flex-1 min-w-[140px] h-12 rounded-xl bg-accent text-accent-foreground font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all font-['Poppins'] shadow-sm"
              >
                <Play size={18} fill="currentColor" /> RESUME
              </button>
            )}

            {!isScheduled && onEditScore && (
              <button 
                onClick={onEditScore}
                className="flex-1 min-w-[140px] h-12 rounded-xl bg-muted border border-border text-foreground font-bold text-sm flex items-center justify-center gap-2 hover:bg-muted/80 transition-all font-['Poppins']"
              >
                <Edit2 size={18} /> SCORE
              </button>
            )}

            {!isScheduled && onEnd && (
              <button 
                onClick={onEnd}
                className="flex-1 min-w-[140px] h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all font-['Poppins']"
              >
                <Square size={16} fill="currentColor" /> END
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
