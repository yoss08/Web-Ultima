import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Clock,
  MapPin,
  Users,
  Trophy,
  DollarSign,
  User,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import { Button } from '../../components/Button';

interface Player {
  id: string;
  name: string;
  avatar?: string;
  level: string;
}

const mockGameDetails = {
  id: 'g1',
  time: '2:30 PM',
  date: 'Today, Apr 7, 2026',
  court: 'Court 1',
  courtType: 'Indoor - Glass walls',
  club: 'Elite Padel Center',
  clubAddress: '123 Sports Avenue, Downtown',
  level: 'Intermediate',
  players: [
    { id: 'p1', name: 'Alex M.', level: '4.5' },
    { id: 'p2', name: 'Jamie R.', level: '4.0' },
    { id: 'p3', name: 'Sam K.', level: '4.2' },
  ],
  maxPlayers: 4,
  gender: 'Mixed',
  pricePerPlayer: 15,
  duration: '1.5 hours',
  description: 'Looking for one more player for a casual game. All levels welcome, just come ready to have fun!',
};

export function GameConfirmationScreen() {
  const navigate = useNavigate();
  const { clubId, gameId } = useParams();
  const [isJoining, setIsJoining] = useState(false);

  const game = mockGameDetails;
  const spotsLeft = game.maxPlayers - game.players.length;

  const handleJoinGame = async () => {
    setIsJoining(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsJoining(false);
    
    // Show success message
    alert('Successfully joined the game!');
    navigate(`/summa/club/${clubId}`);
  };

  return (
    <div className="h-screen w-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-border">
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-card hover:bg-card/80 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl">Game Details</h1>
            <p className="text-sm text-muted-foreground">{game.club}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Time & Location Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-br from-card to-card/50 border-2 border-[#39ff14]/30 p-6 shadow-[0_0_20px_rgba(57,255,20,0.15)] mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-[#39ff14]/10">
              <Calendar className="w-5 h-5 text-[#39ff14]" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">When</div>
              <div className="text-lg">{game.date}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-[#39ff14]/10">
              <Clock className="w-5 h-5 text-[#39ff14]" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Time</div>
              <div className="text-lg">{game.time} • {game.duration}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#39ff14]/10">
              <MapPin className="w-5 h-5 text-[#39ff14]" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Location</div>
              <div className="text-lg">{game.court}</div>
              <div className="text-sm text-muted-foreground">{game.courtType}</div>
            </div>
          </div>
        </motion.div>

        {/* Game Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h3 className="mb-4">Game Information</h3>
          <div className="rounded-xl bg-card border border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Trophy className="w-4 h-4" />
                <span className="text-sm">Skill Level</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#39ff14]/10 text-[#39ff14] text-sm">
                {game.level}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span className="text-sm">Players</span>
              </div>
              <span>
                {game.players.length}/{game.maxPlayers} joined
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="w-4 h-4" />
                <span className="text-sm">Gender</span>
              </div>
              <span>{game.gender}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm">Price per player</span>
              </div>
              <span className="text-lg text-[#39ff14]">${game.pricePerPlayer}</span>
            </div>
          </div>
        </motion.div>

        {/* Description */}
        {game.description && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <h3 className="mb-3">About this game</h3>
            <div className="rounded-xl bg-card border border-border p-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {game.description}
              </p>
            </div>
          </motion.div>
        )}

        {/* Current Players */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3>Current Players ({game.players.length})</h3>
            <span className="text-sm text-[#39ff14]">
              {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} left
            </span>
          </div>
          <div className="space-y-3">
            {game.players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="rounded-xl bg-card border border-border p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#39ff14]/10 flex items-center justify-center text-[#39ff14]">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1">{player.name}</div>
                    <div className="text-sm text-muted-foreground">Level {player.level}</div>
                  </div>
                  {index === 0 && (
                    <span className="px-2 py-1 rounded-md bg-[#39ff14]/10 text-[#39ff14] text-xs">
                      Organizer
                    </span>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Empty slot */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + game.players.length * 0.05 }}
              className="rounded-xl bg-card border-2 border-dashed border-[#39ff14]/30 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center">
                  <Users className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="text-muted-foreground">Waiting for player...</div>
                  <div className="text-sm text-muted-foreground">Join this game!</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* What's Included */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <h3 className="mb-4">What's Included</h3>
          <div className="rounded-xl bg-card border border-border p-4 space-y-3">
            {['Court rental', 'Equipment available', 'Locker room access'].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#39ff14]" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom CTA */}
      <div className="px-6 py-6 border-t border-border bg-background">
        <Button
          variant="summa"
          size="lg"
          fullWidth
          disabled={isJoining}
          onClick={handleJoinGame}
        >
          {isJoining ? 'Joining...' : `Confirm Join - $${game.pricePerPlayer}`}
        </Button>
        <p className="text-center text-xs text-muted-foreground mt-3">
          Payment will be processed after confirmation
        </p>
      </div>
    </div>
  );
}
