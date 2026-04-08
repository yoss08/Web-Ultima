import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  MapPin,
  Star,
  Phone,
  Clock,
  Image as ImageIcon,
  Users,
  Trophy,
  CheckCircle,
} from 'lucide-react';
import { Button } from '../../components/Button';

interface Court {
  id: string;
  name: string;
  type: string;
  available: boolean;
  nextAvailable?: string;
}

interface OpenGame {
  id: string;
  time: string;
  court: string;
  level: string;
  players: number;
  maxPlayers: number;
  gender: string;
  pricePerPlayer: number;
}

const mockClubDetails = {
  id: '1',
  name: 'Elite Padel Center',
  coverImage: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&h=600&fit=crop',
  address: '123 Sports Avenue, Downtown',
  distance: 1.2,
  rating: 4.8,
  reviewCount: 342,
  phone: '+1 234 567 8900',
  openingHours: 'Mon-Sun: 6:00 AM - 11:00 PM',
  courtsCount: 6,
  indoor: true,
  outdoor: true,
  amenities: ['Locker rooms', 'Pro shop', 'Café', 'Parking', 'Equipment rental'],
  gallery: [
    'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=400&h=300&fit=crop',
  ],
};

const mockAvailableCourts: Court[] = [
  { id: 'c1', name: 'Court 1', type: 'Indoor - Glass walls', available: true },
  { id: 'c2', name: 'Court 2', type: 'Indoor - Premium', available: true },
  { id: 'c3', name: 'Court 3', type: 'Outdoor - Standard', available: false, nextAvailable: '3:00 PM' },
  { id: 'c4', name: 'Court 4', type: 'Indoor - Standard', available: true },
];

const mockOpenGames: OpenGame[] = [
  {
    id: 'g1',
    time: '2:30 PM',
    court: 'Court 1',
    level: 'Intermediate',
    players: 3,
    maxPlayers: 4,
    gender: 'Mixed',
    pricePerPlayer: 15,
  },
  {
    id: 'g2',
    time: '4:00 PM',
    court: 'Court 2',
    level: 'Advanced',
    players: 2,
    maxPlayers: 4,
    gender: 'Men',
    pricePerPlayer: 20,
  },
  {
    id: 'g3',
    time: '6:00 PM',
    court: 'Court 4',
    level: 'Beginner',
    players: 3,
    maxPlayers: 4,
    gender: 'Mixed',
    pricePerPlayer: 12,
  },
];

export function ClubDetailsScreen() {
  const navigate = useNavigate();
  const { clubId } = useParams();
  const [activeTab, setActiveTab] = useState<'courts' | 'games'>('courts');

  const club = mockClubDetails;

  return (
    <div className="h-screen w-screen bg-background flex flex-col overflow-hidden">
      {/* Header with cover image */}
      <div className="relative h-64 shrink-0">
        <img
          src={club.coverImage}
          alt={club.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 p-2 rounded-lg bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Club name overlay */}
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-3xl mb-2">{club.name}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-[#39ff14] text-[#39ff14]" />
              <span>{club.rating}</span>
              <span className="text-muted-foreground text-sm">({club.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{club.distance} km</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Club Info Section */}
        <div className="px-6 py-6 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-[#39ff14]" />
            <span>{club.address}</span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-[#39ff14]" />
            <span>{club.openingHours}</span>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card hover:bg-card/80 transition-colors">
            <Phone className="w-5 h-5 text-[#39ff14]" />
            <span>Call Club</span>
          </button>
        </div>

        {/* Amenities */}
        <div className="px-6 py-6 border-b border-border">
          <h3 className="mb-4">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {club.amenities.map((amenity) => (
              <span
                key={amenity}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card text-sm"
              >
                <CheckCircle className="w-4 h-4 text-[#39ff14]" />
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* Gallery Preview */}
        <div className="px-6 py-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h3>Gallery</h3>
            <button className="flex items-center gap-2 text-sm text-[#39ff14]">
              <ImageIcon className="w-4 h-4" />
              View all
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {club.gallery.map((image, index) => (
              <div
                key={index}
                className="aspect-square rounded-lg overflow-hidden"
              >
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-6">
          <div className="flex gap-2 mb-6 bg-card rounded-lg p-1">
            <button
              onClick={() => setActiveTab('courts')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md transition-all ${
                activeTab === 'courts'
                  ? 'bg-[#39ff14] text-[#0a0e1a]'
                  : 'text-muted-foreground'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Book Court</span>
            </button>
            <button
              onClick={() => setActiveTab('games')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md transition-all ${
                activeTab === 'games'
                  ? 'bg-[#39ff14] text-[#0a0e1a]'
                  : 'text-muted-foreground'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Join Game</span>
            </button>
          </div>

          {/* Available Courts */}
          {activeTab === 'courts' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pb-6"
            >
              <h3 className="mb-4">Available Courts Today</h3>
              <div className="space-y-3">
                {mockAvailableCourts.map((court, index) => (
                  <motion.div
                    key={court.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-xl bg-card border border-border p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="mb-1">{court.name}</h4>
                        <p className="text-sm text-muted-foreground">{court.type}</p>
                        {!court.available && court.nextAvailable && (
                          <p className="text-xs text-[#39ff14] mt-1">
                            Next: {court.nextAvailable}
                          </p>
                        )}
                      </div>
                      {court.available ? (
                        <Button
                          variant="summa"
                          size="sm"
                          onClick={() => navigate(`/summa/club/${clubId}/book-court?courtId=${court.id}`)}
                        >
                          Book Now
                        </Button>
                      ) : (
                        <span className="text-sm text-muted-foreground">Occupied</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Open Games */}
          {activeTab === 'games' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3>Open Games You Can Join</h3>
                <button
                  onClick={() => navigate(`/summa/club/${clubId}/join-game`)}
                  className="text-sm text-[#39ff14] hover:underline"
                >
                  View all
                </button>
              </div>
              <div className="space-y-3">
                {mockOpenGames.slice(0, 3).map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => navigate(`/summa/club/${clubId}/game/${game.id}`)}
                    className="rounded-xl bg-card border border-border p-4 hover:border-[#39ff14]/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-[#39ff14]" />
                          <span className="text-lg">{game.time}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{game.court}</span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[#39ff14]/10 text-[#39ff14] text-sm">
                        ${game.pricePerPlayer}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-2 py-1 rounded-md bg-background text-xs">
                        {game.level}
                      </span>
                      <span className="px-2 py-1 rounded-md bg-background text-xs">
                        {game.gender}
                      </span>
                      <span className="px-2 py-1 rounded-md bg-background text-xs flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {game.players}/{game.maxPlayers} players
                      </span>
                    </div>

                    <Button variant="summa" size="sm" fullWidth>
                      Join Game
                    </Button>
                  </motion.div>
                ))}

                {/* View All Button */}
                <Button
                  variant="ghost"
                  size="md"
                  fullWidth
                  onClick={() => navigate(`/summa/club/${clubId}/join-game`)}
                  className="border border-border hover:border-[#39ff14]/50"
                >
                  View All Games
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}