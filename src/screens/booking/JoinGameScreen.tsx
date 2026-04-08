import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Users, Trophy, MapPin, Calendar, DollarSign } from 'lucide-react';
import { Button } from '../../components/Button';

interface OpenGame {
  id: string;
  time: string;
  date: string;
  court: string;
  courtType: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  players: number;
  maxPlayers: number;
  gender: 'Men' | 'Women' | 'Mixed';
  pricePerPlayer: number;
  duration: string;
}

const mockOpenGames: OpenGame[] = [
  {
    id: 'g1',
    time: '2:30 PM',
    date: 'Today',
    court: 'Court 1',
    courtType: 'Indoor - Glass walls',
    level: 'Intermediate',
    players: 3,
    maxPlayers: 4,
    gender: 'Mixed',
    pricePerPlayer: 15,
    duration: '1.5 hours',
  },
  {
    id: 'g2',
    time: '4:00 PM',
    date: 'Today',
    court: 'Court 2',
    courtType: 'Indoor - Premium',
    level: 'Advanced',
    players: 2,
    maxPlayers: 4,
    gender: 'Men',
    pricePerPlayer: 20,
    duration: '2 hours',
  },
  {
    id: 'g3',
    time: '6:00 PM',
    date: 'Today',
    court: 'Court 4',
    courtType: 'Indoor - Standard',
    level: 'Beginner',
    players: 3,
    maxPlayers: 4,
    gender: 'Mixed',
    pricePerPlayer: 12,
    duration: '1 hour',
  },
  {
    id: 'g4',
    time: '7:30 PM',
    date: 'Today',
    court: 'Court 3',
    courtType: 'Outdoor',
    level: 'Intermediate',
    players: 2,
    maxPlayers: 4,
    gender: 'Women',
    pricePerPlayer: 18,
    duration: '1.5 hours',
  },
  {
    id: 'g5',
    time: '2:00 PM',
    date: 'Tomorrow',
    court: 'Court 1',
    courtType: 'Indoor - Glass walls',
    level: 'Advanced',
    players: 1,
    maxPlayers: 4,
    gender: 'Mixed',
    pricePerPlayer: 22,
    duration: '2 hours',
  },
  {
    id: 'g6',
    time: '5:00 PM',
    date: 'Tomorrow',
    court: 'Court 5',
    courtType: 'Indoor - Premium',
    level: 'Intermediate',
    players: 3,
    maxPlayers: 4,
    gender: 'Mixed',
    pricePerPlayer: 16,
    duration: '1.5 hours',
  },
];

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Beginner':
      return 'bg-blue-500/10 text-blue-400';
    case 'Intermediate':
      return 'bg-[#39ff14]/10 text-[#39ff14]';
    case 'Advanced':
      return 'bg-orange-500/10 text-orange-400';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export function JoinGameScreen() {
  const navigate = useNavigate();
  const { clubId } = useParams();
  const [filterDate, setFilterDate] = useState<'all' | 'today' | 'tomorrow'>('all');
  const [filterLevel, setFilterLevel] = useState<'all' | 'Beginner' | 'Intermediate' | 'Advanced'>('all');

  const filteredGames = mockOpenGames.filter(game => {
    if (filterDate !== 'all' && game.date.toLowerCase() !== filterDate) return false;
    if (filterLevel !== 'all' && game.level !== filterLevel) return false;
    return true;
  });

  return (
    <div className="h-screen w-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-border">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-card hover:bg-card/80 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl">Join a Game</h1>
            <p className="text-sm text-muted-foreground">Elite Padel Center</p>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-3">
          {/* Date Filter */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">When</p>
            <div className="flex gap-2">
              {(['all', 'today', 'tomorrow'] as const).map((date) => (
                <button
                  key={date}
                  onClick={() => setFilterDate(date)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    filterDate === date
                      ? 'bg-[#39ff14] text-[#0a0e1a]'
                      : 'bg-card border border-border text-foreground hover:border-[#39ff14]/50'
                  }`}
                >
                  {date === 'all' ? 'All dates' : date.charAt(0).toUpperCase() + date.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Level Filter */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Skill Level</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {(['all', 'Beginner', 'Intermediate', 'Advanced'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setFilterLevel(level)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all shrink-0 ${
                    filterLevel === level
                      ? 'bg-[#39ff14] text-[#0a0e1a]'
                      : 'bg-card border border-border text-foreground hover:border-[#39ff14]/50'
                  }`}
                >
                  {level === 'all' ? 'All levels' : level}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Games List */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {filteredGames.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Users className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="mb-2">No games found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or check back later
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredGames.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/summa/club/${clubId}/game/${game.id}`)}
                className="rounded-2xl bg-card border border-border p-5 hover:border-[#39ff14]/50 transition-all cursor-pointer"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-[#39ff14]" />
                      <span className="text-sm text-muted-foreground">{game.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#39ff14]" />
                      <span className="text-xl">{game.time}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl text-[#39ff14] mb-1">
                      ${game.pricePerPlayer}
                    </div>
                    <span className="text-xs text-muted-foreground">per player</span>
                  </div>
                </div>

                {/* Court Info */}
                <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{game.court}</span>
                  <span className="text-sm">• {game.courtType}</span>
                </div>

                {/* Game Details */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1.5 rounded-lg text-sm ${getLevelColor(game.level)}`}>
                    <Trophy className="w-3.5 h-3.5 inline mr-1" />
                    {game.level}
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-background text-sm">
                    <Users className="w-3.5 h-3.5 inline mr-1" />
                    {game.players}/{game.maxPlayers} players
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-background text-sm">
                    {game.gender}
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-background text-sm">
                    <Clock className="w-3.5 h-3.5 inline mr-1" />
                    {game.duration}
                  </span>
                </div>

                {/* Spots Remaining */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    {game.maxPlayers - game.players === 1 ? (
                      <span className="text-sm text-[#39ff14]">Last spot available!</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {game.maxPlayers - game.players} spots remaining
                      </span>
                    )}
                  </div>
                  <Button variant="summa" size="sm">
                    Join Game
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
