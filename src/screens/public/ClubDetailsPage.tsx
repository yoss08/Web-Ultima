import React, { useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
 import {Phone, Calendar, Clock, MapPin, Star, Users, CheckCircle2, ChevronLeft, Shield, Sun, Moon, Trophy,
  Loader2, CalendarDays, XCircle, Grid3X3, Layers, ChevronRight, Info
} from 'lucide-react';
import { useTheme } from "../../styles/useTheme";
import { supabase } from "../../config/supabase";

const MOCK_CLUBS = [
  {
    id: 1,
    name: "Padel Arena",
    rating: 4.8,
    reviews: 124,
    location: "La Soukra, Tunis",
    description: "Premium padel experience with state-of-the-art panoramic crystal courts and professional lighting.",
    image: "https://images.unsplash.com/photo-1709587825415-814c2d7cfce7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    price: 99,
    courts: [
      { id: 'c1', name: 'Court 1', type: 'Indoor - Panoramic', available: true },
      { id: 'c2', name: 'Court 2', type: 'Indoor - Panoramic', available: true },
      { id: 'c3', name: 'Court 3', type: 'Indoor - Standard', available: false, nextAvailable: '3:00 PM' },
      { id: 'c4', name: 'Court 4', type: 'Indoor - Premium', available: true },
      { id: 'c5', name: 'Court 5', type: 'Indoor - Premium', available: true },
    ]
  },
  {
    id: 2,
    name: "Padel Marsa",
    rating: 4.6,
    reviews: 89,
    location: "La Marsa, Tunis",
    description: "Beautiful outdoor courts located in the heart of La Marsa. Perfect for sunset matches.",
    image: 'https://images.unsplash.com/photo-1672223550220-df93d147fa4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    price: 100,
    courts: [
      { id: 'm1', name: 'Court 1', type: 'Outdoor - Standard', available: true },
      { id: 'm2', name: 'Court 2', type: 'Outdoor - Standard', available: false, nextAvailable: '4:30 PM' },
      { id: 'm3', name: 'Court 3', type: 'Outdoor - Premium', available: true },
    ]
  },
  {
    id: 3,
    name: "Casa Del Padel",
    rating: 4.9,
    reviews: 210,
    location: "Gammarth, Tunis",
    description: "An exclusive members-only feeling experience with luxury amenities and high-end surface technology.",
    image: 'https://images.unsplash.com/photo-1709587825393-84b6c1698f32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    price: 99,
    courts: [
      { id: 'cd1', name: 'Court A', type: 'Indoor - Glass walls', available: true },
      { id: 'cd2', name: 'Court B', type: 'Indoor - Glass walls', available: true },
    ]
  },
  {
    id: 4,
    name: "Five Stars Padel",
    rating: 4.7,
    reviews: 156,
    location: "Arianah, Tunis",
    description: "Modern facility offering both indoor and outdoor play with excellent coaching staff.",
    image: 'https://images.unsplash.com/photo-1709587824751-dd30420f5cf3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    price: 99,
    courts: [
      { id: 'fs1', name: 'Court 1', type: 'Indoor - Glass', available: true },
      { id: 'fs2', name: 'Court 2', type: 'Outdoor - Glass', available: true },
      { id: 'fs3', name: 'Court 3', type: 'Indoor - Standard', available: false, nextAvailable: '6:00 PM' },
      { id: 'fs4', name: 'Court 4', type: 'Outdoor - standard', available: true },
    ]
  },
  {
    id: 5,
    name: "Club De Padel",
    rating: 4.5,
    reviews: 67,
    location: "Sousse, Tunisia",
    description: "Vibrant club atmosphere with competitive leagues and social events for all skill levels.",
    image: 'https://images.unsplash.com/photo-1709587825415-814c2d7cfce7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    price: 100,
    courts: [
      { id: 'cl1', name: 'Court 1', type: 'Indoor - Standard', available: true },
      { id: 'cl2', name: 'Court 2', type: 'Indoor - Premium', available: true },
      { id: 'cl3', name: 'Court 3', type: 'Indoor - Standard', available: true },
    ]
  }
];

const mockOpenGames = [
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

const getISODate = (d: Date) => {
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().split('T')[0];
};

const MOCK_TIMES = [
  { id: 't1', time: '8:00 AM' },
  { id: 't2', time: '9:30 AM'},
  { id: 't4', time: '11:00 AM' },
  { id: 't5', time: '12:30 PM' },
  { id: 't6', time: '2:00 PM' },
  { id: 't8', time: '3:30 PM' },
  { id: 't9', time: '5:00 PM' },
  { id: 't10', time: '6:30 PM' },
  { id: 't11', time: '8:00 PM' },

];

const DURATIONS = [
  { id: 1, label: '1 session', value: 1 },
  { id: 2, label: '2 sessions', value: 2 },
];

export function ClubDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, setIsDark } = useTheme();

  // Resolve active club by ID from URL
  const displayClub = MOCK_CLUBS.find(c => c.id === Number(id)) || MOCK_CLUBS[0];
  
  const [activeTab, setActiveTab] = useState<'courts' | 'games'>('courts');
  const [selectedCourt, setSelectedCourt] = useState<string | null>(null);
  
  // Date constraints logic
  const getISODate = (date: Date) => date.toISOString().split('T')[0];
  const todayDateObj = new Date();
  const minDateStr = getISODate(todayDateObj);
  const maxDateObj = new Date();
  maxDateObj.setDate(todayDateObj.getDate() + 7);
  const maxDateStr = getISODate(maxDateObj);

  const [selectedDate, setSelectedDate] = useState(minDateStr);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const selectedCourtDetails = displayClub.courts.find(c => c.id === selectedCourt);
  const selectedDurObj = DURATIONS.find(d => d.id === selectedDuration);
  const selectedTimeObj = MOCK_TIMES.find(t => t.id === selectedTime);
  const basePricePerSession = displayClub.price;
  const totalPrice = basePricePerSession * selectedDuration;

  const handleBook = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in your contact information first.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('bookings').insert([
        {
          full_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          club_id: displayClub.id,
          court_id: selectedCourt,
          booking_date: selectedDate,
          time_slot: selectedTimeObj?.time || '',
          duration: selectedDurObj?.value || 1,
          total_price: totalPrice,
          status: 'pending'
        }
      ]);

      if (error) {
        console.error('Supabase error:', error);
        alert("Failed to confirm booking. Please try again.");
        return;
      }

      alert("Booking Confirmed!");
      navigate('/booking');
    } catch (err) {
      console.error('Error creating booking:', err);
      alert("Failed to confirm booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-[#0A0E1A] pb-24">
      {/* Navbar (Simplified for this page) */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0A0E1A]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/10"
      >
        <div className="max-w-[1096px] mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-white" />
            </button>
            <span className="font-['Arial',sans-serif] font-bold text-xl text-gray-900 dark:text-white tracking-[1.2px]">
              ULTIMA
            </span>
          </div>
          <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
            {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
          </button>
        </div>
      </motion.nav>

      <div className="max-w-[1096px] mx-auto pt-24 px-4">
        {/* Header Section */}
        <div className="bg-white dark:bg-[#1A1F2C] rounded-[32px] overflow-hidden border border-gray-200 dark:border-white/10 shadow-sm mb-8">
          <div className="h-[250px] relative">
            <img src={displayClub.image} alt={displayClub.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
              <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">{displayClub.name}</h1>
                  <div className="flex items-center gap-4 text-white/80 text-sm">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {displayClub.location}</span>
                    <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> {displayClub.rating} ({displayClub.reviews} reviews)</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors">
                    <Phone className="w-4 h-4" /> Call Club
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 px-6">
          {/* Main Content Area */}
          <div className="flex-1 space-y-8">
            {/* Tabs */}
            <div className="bg-gray-100 dark:bg-white/5 rounded-2xl p-1 flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab('courts')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                  activeTab === 'courts'
                    ? 'bg-[#00E5FF] text-black shadow-lg shadow-[#00E5FF]/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Trophy size={18} />
                <span>Book Court</span>
              </button>
              <button
                onClick={() => setActiveTab('games')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                  activeTab === 'games'
                    ? 'bg-[#00E5FF] text-black shadow-lg shadow-[#00E5FF]/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Users size={18} />
                <span>Join Game</span>
              </button>
            </div>

            {/* Available Courts */}
            {activeTab === 'courts' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Available Courts Today</h3>
                <div className="grid gap-3">
                    {displayClub.courts.map((court, index) => (
                      <motion.div
                        key={court.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="rounded-2xl bg-gray-50 dark:bg-[#1A1F2C] border border-gray-200 dark:border-[#2A303C] p-4 hover:border-blue-400 dark:hover:border-[#00E5FF]/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="mb-1 font-bold text-gray-900 dark:text-white">{court.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{court.type}</p>
                            {!court.available && court.nextAvailable && (
                              <p className="text-xs text-[#00E5FF] mt-1">
                                Next: {court.nextAvailable}
                              </p>
                            )}
                          </div>
                          {court.available ? (
                            <button
                              onClick={() => {
                                setSelectedCourt(court.id);
                                document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className="px-5 py-2 rounded-xl font-semibold text-sm bg-[#00E5FF] text-black hover:scale-105 transition-all shadow-lg shadow-[#00E5FF]/10"
                            >
                              Book Now
                            </button>
                          ) : (
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest opacity-40">Occupied</span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Open Games 
              {activeTab === 'games' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pb-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 dark:text-white">Open Games You Can Join</h3>
                    <button
                      onClick={() => navigate(`/summa/club/${id}/join-game`)}
                      className="text-sm text-[#00E5FF] hover:underline"
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
                        onClick={() => navigate(`/summa/club/${id}/game/${game.id}`)}
                        className="rounded-xl bg-white dark:bg-[#1A1F2C] border border-gray-200 dark:border-white/10 p-4 hover:border-blue-400 dark:hover:border-[#00E5FF]/50 transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="w-4 h-4 text-[#00E5FF]" />
                              <span className="text-lg text-gray-900 dark:text-white font-semibold">{game.time}</span>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{game.court}</span>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] text-sm">
                            ${game.pricePerPlayer}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 text-xs">
                            {game.level}
                          </span>
                          <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 text-xs">
                            {game.gender}
                          </span>
                          <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 text-xs flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {game.players}/{game.maxPlayers} players
                          </span>
                        </div>

                        <button className="w-full py-2 rounded-lg font-bold text-sm bg-gradient-to-r from-blue-600 to-blue-500 dark:from-[#00E5FF] dark:to-[#00D4E6] text-white dark:text-black shadow-md hover:scale-[1.02] transition-all">
                          Join Game
                        </button>
                      </motion.div>  
                    ))}
                    

                    {/* View All Button 
                    <button
                      onClick={() => navigate(`/summa/club/${id}/join-game`)}
                      className="w-full py-2.5 rounded-lg font-semibold text-sm border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-[#00E5FF] transition-all"
                    >
                      View All Games
                    </button>
                  </div>
                </motion.div>
              )}
              */}
            
            {/* Divider */}
            <div className="h-px bg-gray-200 dark:bg-white/10 w-full my-8"></div>

            {/* Booking Form */}
            <div id="booking-section">
               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Book a Court</h2>
               <p className="text-gray-500 dark:text-gray-400 mb-6">{displayClub.name}</p>

               {selectedCourt ? (
                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                   
                   {/* Selected Court Details */}
                   <div className="bg-blue-50 dark:bg-[#00E5FF]/5 border border-blue-200 dark:border-[#00E5FF]/20 rounded-2xl p-4 flex items-center justify-between">
                     <div>
                       <h4 className="font-bold text-blue-900 dark:text-[#00E5FF]">{selectedCourtDetails?.name}</h4>
                       <p className="text-sm text-blue-700 dark:text-[#00E5FF]/80">{selectedCourtDetails?.type}</p>
                     </div>
                     <button onClick={() => setSelectedCourt(null)} className="text-sm text-blue-600 dark:text-[#00E5FF] underline font-medium">Change</button>
                   </div>

                   {/* Contact Information Form */}
                   <div className="bg-white dark:bg-[#1C212E] p-6 rounded-2xl border border-gray-200 dark:border-[#2A303C]">
                     <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Personal Information</h3>
                     <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                         <input 
                           type="text" 
                           value={formData.name}
                           onChange={e => setFormData({...formData, name: e.target.value})}
                           placeholder="Enter your full name" 
                           className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#0A0E1A] border border-gray-200 dark:border-[#2A303C] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#00E5FF]" 
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                         <input 
                           type="email" 
                           value={formData.email}
                           onChange={e => setFormData({...formData, email: e.target.value})}
                           placeholder="Enter your email" 
                           className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#0A0E1A] border border-gray-200 dark:border-[#2A303C] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00E5FF]" 
                         />
                       </div>
                       <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                          <input 
                            type="tel" 
                            value={formData.phone}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                            placeholder="Enter your phone number" 
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#0A0E1A] border border-gray-200 dark:border-[#2A303C] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00E5FF]/50" 
                          />
                       </div>
                     </div>
                   </div>

                    {/* consolidated Date & Time Section */}
                    <section>
                      <div className="flex items-center gap-4 mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pick Your Time</h3>
                      </div>
                      
                      <div className="bg-white dark:bg-white/5 rounded-[40px] p-8 border border-gray-200 dark:border-white/10">
                        <div className="flex flex-col md:flex-row gap-8">
                          {/* Date & Duration picker side */}
                          <div className="md:w-1/3 space-y-6">
                            <div>
                              <label className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-3 block">
                                Choose Date
                              </label>
                              <input
                                type="date"
                                min={minDateStr}
                                max={maxDateStr}
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full h-14 px-6 bg-gray-100 dark:bg-black/40 rounded-2xl border-none outline-none font-black text-sm dark:text-white focus:ring-2 ring-[#00E5FF]/50 transition-all cursor-pointer"
                              />
                            </div>

                            {/* Duration selector */}
                            <div>
                              <label className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-3 block">
                                Duration
                              </label>
                              <div className="flex gap-2">
                                {DURATIONS.map((dur) => (
                                  <button
                                    key={dur.id}
                                    onClick={() => setSelectedDuration(dur.id)}
                                    className={`flex-1 h-12 rounded-xl text-[11px] font-black transition-all border ${
                                      selectedDuration === dur.id
                                        ? "bg-[#00E5FF] border-[#00E5FF] text-black"
                                        : "bg-transparent border-gray-200 dark:border-white/10 dark:text-white/60 hover:border-[#00E5FF]"
                                    }`}
                                  >
                                    {dur.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Time slots side */}
                          <div className="md:w-2/3">
                            <div className="flex items-center justify-between mb-3">
                              <label className="text-[10px] font-black uppercase tracking-widest opacity-40">
                                Available Slots
                              </label>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {MOCK_TIMES.map((timeObj) => {
                                const isSelected = selectedTime === timeObj.id;
                                return (
                                  <button
                                    key={timeObj.id}
                                    onClick={() => setSelectedTime(timeObj.id)}
                                    className={`relative h-12 rounded-xl text-[11px] font-black transition-all border ${
                                      isSelected
                                        ? "bg-[#00E5FF] border-[#00E5FF] text-black shadow-lg shadow-[#00E5FF]/20 scale-105"
                                        : "bg-transparent border-gray-200 dark:border-white/10 dark:text-white/60 hover:border-[#00E5FF]"
                                    }`}
                                  >
                                    {timeObj.time}
                                  </button>
                                );
                              })}
                            </div>

                            <div className="flex items-center gap-4 mt-4 text-[10px] font-bold opacity-40 dark:text-white">
                              <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded bg-[#00E5FF]" /> Selected
                              </span>
                              <span className="flex items-center gap-1.5">
                                  <span className="w-3 h-3 rounded bg-red-400" /> Taken
                                </span>
                              <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded bg-gray-200 dark:bg-white/10" /> Available
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Sidebar / Price Summary */}
                    <div className="w-full">
                      <div className="sticky top-28 rounded-[24px] bg-gray-50 dark:bg-[#1A1F2C] border border-blue-200 dark:border-[#00E5FF]/30 p-6 shadow-sm dark:shadow-[0_0_20px_rgba(0,229,255,0.05)]">
                        
                        {/* Club Info in Summary */}
                        <div className="mb-6 flex items-center gap-4 border-b border-gray-200 dark:border-white/10 pb-4">
                          <img src={displayClub.image} alt={displayClub.name} className="w-16 h-16 rounded-xl object-cover" />
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{displayClub.name}</h3>
                            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
                              <MapPin className="w-3.5 h-3.5" /> {displayClub.location}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-6">
                          <span className="text-blue-500 dark:text-[#00E5FF] text-xl font-bold">DT</span>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Booking Details</h3>
                        </div>
                        
                        <div className="space-y-4 mb-8">
                          {/* Court & Duration */}
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Court:</span>
                            <span className="font-bold text-gray-900 dark:text-white">{selectedCourtDetails?.name || '---'}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                            <span className="font-medium text-gray-900 dark:text-white">{selectedDurObj?.label}</span>
                          </div>
                          
                          <div className="h-px bg-gray-200 dark:bg-white/10 w-full" />

                          {/* Date & Time */}
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Date:</span>
                            <span className="font-bold text-gray-900 dark:text-white">{selectedDate}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Time Slot:</span>
                            <span className="font-bold text-[#00E5FF]">{selectedTimeObj?.time || '---'}</span>
                          </div>

                          <div className="h-px bg-gray-200 dark:bg-white/10 w-full" />

                          {/* Personal Info */}
                          <div className="space-y-2">
                             <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Contact Information</span>
                             <div className="flex justify-between text-xs">
                               <span className="text-gray-500 dark:text-gray-400">Name:</span>
                               <span className="font-medium text-gray-900 dark:text-white truncate max-w-[150px]">{formData.name || '---'}</span>
                             </div>
                             <div className="flex justify-between text-xs">
                               <span className="text-gray-500 dark:text-gray-400">Phone:</span>
                               <span className="font-medium text-gray-900 dark:text-white">{formData.phone || '---'}</span>
                             </div>
                          </div>
                          
                          <div className="pt-6 border-t border-blue-200 dark:border-[#00E5FF]/30 flex justify-between items-center">
                            <span className="font-bold text-gray-900 dark:text-white text-lg">Total</span>
                            <span className="text-3xl font-bold text-blue-500 dark:text-[#00E5FF]">{totalPrice}DT</span>
                          </div>
                        </div>

                        <div className="mt-8 border-t border-blue-200 dark:border-[#00E5FF]/30 pt-6">
                          <button
                            onClick={handleBook}
                            disabled={!selectedCourt || !selectedTime || isSubmitting}
                            className={`w-full py-4 rounded-xl font-semibold text-[17px] transition-all flex items-center justify-center gap-2 ${
                              selectedCourt && selectedTime && !isSubmitting
                                ? 'bg-[#00E5FF] text-black shadow-lg shadow-[#00E5FF]/20 hover:scale-[1.02] active:scale-95'
                                : 'bg-gray-200 dark:bg-[#1C212E] text-gray-400 cursor-not-allowed border border-gray-300 dark:border-[#2A303C]'
                            }`}
                          >
                            {isSubmitting ? (
                              <span className="flex items-center gap-2">
                                 <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                                 Processing...
                              </span>
                            ) : (
                              `CONFIRM BOOKING`
                            )}
                          </button>
                          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4 leading-relaxed">
                            Cancellations must be made at least 24 hours in advance.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="bg-gray-100 dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/20 rounded-2xl p-12 text-center w-full">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Court Selected</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Please select a court from the available list above to continue with your booking.</p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClubDetailsPage;
