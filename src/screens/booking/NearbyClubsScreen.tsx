import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Search, MapPin, Star, ChevronRight, SlidersHorizontal, Map, List } from 'lucide-react';
import { Button } from '../../components/Button';

interface Club {
  id: string;
  name: string;
  image: string;
  distance: number;
  rating: number;
  reviewCount: number;
  location: string;
  tags: string[];
  courtsCount: number;
  isOpen: boolean;
  indoor: boolean;
  outdoor: boolean;
}

const mockClubs: Club[] = [
  {
    id: '1',
    name: 'Elite Padel Center',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=600&fit=crop',
    distance: 1.2,
    rating: 4.8,
    reviewCount: 342,
    location: 'Downtown Sports Complex',
    tags: ['Indoor', 'Outdoor', 'Open now'],
    courtsCount: 6,
    isOpen: true,
    indoor: true,
    outdoor: true,
  },
  {
    id: '2',
    name: 'Padel Pro Arena',
    image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&h=600&fit=crop',
    distance: 2.5,
    rating: 4.9,
    reviewCount: 198,
    location: 'West End Sports Park',
    tags: ['Indoor', 'Open now', 'Premium'],
    courtsCount: 8,
    isOpen: true,
    indoor: true,
    outdoor: false,
  },
  {
    id: '3',
    name: 'City Padel Club',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&h=600&fit=crop',
    distance: 3.1,
    rating: 4.6,
    reviewCount: 267,
    location: 'Central Business District',
    tags: ['Outdoor', 'Open now'],
    courtsCount: 4,
    isOpen: true,
    indoor: false,
    outdoor: true,
  },
  {
    id: '4',
    name: 'Summit Padel Courts',
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&h=600&fit=crop',
    distance: 4.3,
    rating: 4.7,
    reviewCount: 421,
    location: 'North Hills Recreation',
    tags: ['Indoor', 'Outdoor', 'Academy'],
    courtsCount: 10,
    isOpen: true,
    indoor: true,
    outdoor: true,
  },
  {
    id: '5',
    name: 'Riverside Padel',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=600&fit=crop',
    distance: 5.7,
    rating: 4.5,
    reviewCount: 156,
    location: 'Riverside Sports Zone',
    tags: ['Outdoor', 'Closed'],
    courtsCount: 4,
    isOpen: false,
    indoor: false,
    outdoor: true,
  },
];

export function NearbyClubsScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filters = ['Distance', 'Available now', 'Price', 'Level', 'Indoor/Outdoor'];

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const filteredClubs = mockClubs.filter(club =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen w-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-card hover:bg-card/80 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl">Nearby Padel Clubs</h1>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search club or area"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#39ff14]/50 transition-all"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
          <button
            className="p-2 rounded-lg bg-card border border-border hover:border-[#39ff14]/50 transition-colors shrink-0"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => toggleFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm transition-all shrink-0 ${
                selectedFilters.includes(filter)
                  ? 'bg-[#39ff14] text-[#0a0e1a]'
                  : 'bg-card border border-border text-foreground hover:border-[#39ff14]/50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-card rounded-lg p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
              viewMode === 'list'
                ? 'bg-[#39ff14] text-[#0a0e1a]'
                : 'text-muted-foreground'
            }`}
          >
            <List className="w-4 h-4" />
            <span className="text-sm">List</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
              viewMode === 'map'
                ? 'bg-[#39ff14] text-[#0a0e1a]'
                : 'text-muted-foreground'
            }`}
          >
            <Map className="w-4 h-4" />
            <span className="text-sm">Map</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {viewMode === 'map' ? (
          <div className="w-full h-full rounded-2xl bg-card border border-border flex items-center justify-center">
            <div className="text-center">
              <Map className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Map view coming soon</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredClubs.map((club, index) => (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/summa/club/${club.id}`)}
                className="rounded-2xl bg-card border border-border overflow-hidden hover:border-[#39ff14]/50 transition-all cursor-pointer"
              >
                {/* Club Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={club.image}
                    alt={club.name}
                    className="w-full h-full object-cover"
                  />
                  {club.isOpen && (
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#39ff14] text-[#0a0e1a] text-xs">
                      Open now
                    </div>
                  )}
                </div>

                {/* Club Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="mb-1">{club.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{club.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="w-4 h-4 fill-[#39ff14] text-[#39ff14]" />
                        <span className="text-sm">{club.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({club.reviewCount})
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {club.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-md bg-background text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="px-2 py-1 rounded-md bg-background text-xs text-muted-foreground">
                      {club.courtsCount} courts
                    </span>
                  </div>

                  {/* Distance & CTA */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {club.distance} km away
                    </span>
                    <Button
                      variant="summa"
                      size="sm"
                      className="gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/summa/club/${club.id}`);
                      }}
                    >
                      View Club
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
