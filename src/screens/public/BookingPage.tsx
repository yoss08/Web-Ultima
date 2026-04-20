import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { 
  SlidersHorizontal, MapPin, Clock, DollarSign, 
  TrendingUp, Home as HomeIcon, Sun, Moon, 
  Menu, X, LayoutDashboard, Star, Info, List, Map, Calendar
} from 'lucide-react';
import { useTheme } from "../../styles/useTheme";
import { useAuth } from "../../services/AuthContext";
import Navigation from "../../components/Navigation";
import PadelArena from "../../assets/images/padel_arena.png";
import { supabase } from "../../config/supabase";

interface Club {
  id: number | string;
  name: string;
  image: string;
  courts: number;
  distance: number;
  available: boolean;
  price: number;
  level: string;
  type: string;
  location?: string;
  open_time?: string;
  close_time?: string;
}

function ClubCard({ club }: { club: Club }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`bg-card rounded-2xl border border-border overflow-hidden hover:border-accent transition-all duration-300 shadow-sm hover:shadow-md ${!club.available ? 'opacity-70 grayscale-[0.5]' : ''}`}
    >
      <div className="relative h-48 overflow-hidden group">
        <img
          src={club.image}
          alt={club.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            {club.courts} Courts
          </div>
          {club.available && (
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              Available
            </div>
          )}
        </div>
        {!club.available && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Closed Now</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-lg text-foreground">{club.name}</h3>
              {club.type && (
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full capitalize">
                  {club.type}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-2">
              <MapPin className="w-4 h-4 text-accent" />
              <span>{club.location || 'Tunisia'}</span>
              {club.distance && (
                <span className="text-accent font-semibold">• {club.distance} km</span>
              )}
            </div>

            <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-sm mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent" />
                <span>Open {club.open_time || '9:00 AM'} - {club.close_time || '06:00 PM'}</span>
              </div>
              {club.price && (
                <span className="text-foreground font-semibold">{club.price} DT/hr</span>
              )}
            </div>

            {club.level && (
              <div className="mt-2 text-left">
                <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-medium inline-block">
                  {club.level.charAt(0).toUpperCase() + club.level.slice(1)}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center h-full pt-2">
            {club.available ? (
              <Link to={`/club/${club.id}`} state={{ club }} className="px-6 py-3 rounded-xl font-semibold text-sm shadow-lg transition-all duration-300 whitespace-nowrap active:scale-95 text-center bg-accent text-accent-foreground hover:opacity-90 hover:shadow-accent/20">
                Order Now
              </Link>
            ) : (
              <button disabled className="px-6 py-3 rounded-xl font-semibold text-sm shadow-lg transition-all duration-300 whitespace-nowrap bg-gray-200 dark:bg-white/5 text-gray-400 cursor-not-allowed shadow-none">
                Order Now
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function BookingPage() {
  const { isDark, setIsDark } = useTheme();
  const { user } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    maxDistance: 10,
    availableNow: false,
    priceSort: 'none' as 'asc' | 'desc' | 'none',
    level: 'all' as 'all' | 'beginner' | 'intermediate' | 'advanced',
    type: 'all' as 'all' | 'indoor' | 'outdoor'
  });

  useEffect(() => {
    async function fetchClubs() {
      setLoading(true);
      try {
        const apiUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/api/public/clubs`);
        if (!response.ok) throw new Error('Failed to fetch clubs from server');
        const data = await response.json();
        
        const formattedClubs: Club[] = (data || []).map((c: any) => ({
          id: c.id,
          name: c.name,
          image: c.photo_url || PadelArena,
          courts: c.courts?.[0]?.count || 0,
          distance: Math.floor(Math.random() * 8) + 1, // Mock distance
          available: true,
          price: c.price_per_court || 0,
          level: 'all',
          type: 'all',
          location: c.location,
          open_time: c.open_time,
          close_time: c.close_time
        }));
        setClubs(formattedClubs);
      } catch (err) {
        console.error("Error fetching clubs:", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchClubs();

    const subscription = supabase
      .channel('public:clubs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clubs' }, () => {
        fetchClubs();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const filteredClubs = clubs
    .filter(club => club.distance <= filters.maxDistance)
    .filter(club => !filters.availableNow || club.available)
    .filter(club => filters.level === 'all' || club.level === filters.level)
    .filter(club => filters.type === 'all' || club.type === filters.type)
    .sort((a, b) => {
      if (filters.priceSort === 'asc') return a.price - b.price;
      if (filters.priceSort === 'desc') return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen transition-colors duration-300 bg-background pb-24">
      {/* Navigation Bar */}
      <Navigation />

      {/* Main Content */}
      <div className="max-w-[1096px] mx-auto pt-28 px-4">
        {/* Page Title */}
        <div className="mb-6">
          <h2 className="font-['Playfair_Display',serif] text-3xl md:text-4xl font-black text-foreground leading-none mb-2">Recommendations</h2>
          <p className="text-muted-foreground font-['Poppins']">Find and reserve the best padel clubs in your area.</p>
        </div>

        {/* Filter Bar */}
        <div className="mb-6 bg-card rounded-[20px] border border-border p-4 shadow-sm">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between text-gray-900 dark:text-white"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-accent" />
              <span className="font-semibold">Filters</span>
              {(filters.availableNow || filters.priceSort !== 'none' || filters.level !== 'all' || filters.type !== 'all') && (
                <span className="bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full font-bold">Active</span>
              )}
            </div>
            <span className="text-gray-400 transition-transform duration-300" style={{ transform: showFilters ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
          </button>

          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: "auto" }} 
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-5 overflow-hidden border-t border-gray-100 dark:border-white/10 pt-4"
              >
                {/* Distance */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-accent" />
                    <label className="text-sm font-medium text-foreground">Distance: {filters.maxDistance} km</label>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={filters.maxDistance}
                    onChange={(e) => setFilters({ ...filters, maxDistance: parseInt(e.target.value) })}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-muted"
                    style={{
                      background: `linear-gradient(to right, var(--theme-accent) 0%, var(--theme-accent) ${(filters.maxDistance / 20) * 100}%, var(--theme-border) ${(filters.maxDistance / 20) * 100}%, var(--theme-border) 100%)`
                    }}
                  />
                </div>

                {/* Available Now */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-accent" />
                    <label className="text-sm font-medium text-foreground">Available Now</label>
                  </div>
                  <button
                    onClick={() => setFilters({ ...filters, availableNow: !filters.availableNow })}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      filters.availableNow ? 'bg-accent' : 'bg-muted'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        filters.availableNow ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {/* Price Sort */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-accent" />
                      <label className="text-sm font-medium text-foreground">Price</label>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setFilters({ ...filters, priceSort: 'asc' })}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-transparent ${
                          filters.priceSort === 'asc'
                            ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/20'
                            : 'bg-muted text-muted-foreground hover:bg-gray-200 dark:hover:bg-white/10'
                        }`}
                      >
                        Low High
                      </button>
                      <button
                        onClick={() => setFilters({ ...filters, priceSort: 'desc' })}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-transparent ${
                          filters.priceSort === 'desc'
                            ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/20'
                            : 'bg-muted text-muted-foreground hover:bg-gray-200 dark:hover:bg-white/10'
                        }`}
                      >
                        High Low
                      </button>
                      <button
                        onClick={() => setFilters({ ...filters, priceSort: 'none' })}
                        className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-transparent ${
                          filters.priceSort === 'none'
                            ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/20'
                            : 'bg-muted text-muted-foreground hover:bg-gray-200 dark:hover:bg-white/10'
                        }`}
                        title="Reset Price Filter"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Level */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-accent" />
                      <label className="text-sm font-medium text-foreground">Level</label>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
                        <button
                          key={level}
                          onClick={() => setFilters({ ...filters, level: level as any })}
                          className={`flex-1 min-w-[70px] py-2 px-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all border border-transparent ${
                            filters.level === level
                              ? 'bg-accent text-accent-foreground shadow-lg dark:shadow-accent/20'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}
                        >
                          {level === 'all' ? 'All' : level.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Indoor/Outdoor */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <HomeIcon className="w-4 h-4 text-accent" />
                      <label className="text-sm font-medium text-foreground">Court Type</label>
                    </div>
                    <div className="flex gap-2">
                      {['all', 'indoor', 'outdoor'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setFilters({ ...filters, type: type as any })}
                          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-transparent ${
                            filters.type === type
                              ? 'bg-accent text-accent-foreground shadow-lg dark:shadow-accent/20'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Count & View Toggle */}
        <div className="mb-6 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <p className="text-muted-foreground text-sm">
              Showing <span className="font-bold text-accent">{filteredClubs.length}</span> of {clubs.length} clubs
            </p>
            {filteredClubs.length !== clubs.length && (
               <button 
                onClick={() => setFilters({ maxDistance: 10, availableNow: false, priceSort: 'none', level: 'all', type: 'all' })}
                className="text-accent text-xs font-bold uppercase tracking-widest hover:underline"
               >
                Reset Filters
               </button>
            )}
          </div>

          <div className="flex items-center gap-1 bg-muted p-1 rounded-xl">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-card text-accent shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="text-sm font-semibold hidden sm:block">List</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'map'
                  ? 'bg-card text-accent shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Map className="w-4 h-4" />
              <span className="text-sm font-semibold hidden sm:block">Map</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'map' ? (
          <div className="w-full h-[600px] rounded-2xl bg-white dark:bg-[#1A1F2C] border border-gray-200 dark:border-white/10 flex items-center justify-center shadow-sm">
            <div className="text-center">
              <Map className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">Map view coming soon</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredClubs.length > 0 ? (
                filteredClubs.map((club) => (
                  <ClubCard key={club.id} club={club} />
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-20 text-center space-y-4"
                >
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Info className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">No centers match your filters</h3>
                    <p className="text-gray-500 mt-2">Try adjusting your radius or requirements.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
