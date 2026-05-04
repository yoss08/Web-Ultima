import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
 import {Phone, Calendar, Clock, MapPin, Star, Users, CheckCircle2, ChevronLeft, Shield, Sun, Moon, Trophy,
  Loader2, CalendarDays, XCircle, Grid3X3, Layers, ChevronRight, Info
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useTheme } from "../../styles/useTheme";
import { useAuth } from "../../services/AuthContext";
import { supabase } from "../../config/supabase";
import { CourtCard } from "../../components/dashboard/CourtCard";

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
  const { user } = useAuth();

  const [displayClub, setDisplayClub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
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
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const otpInterval = useRef<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    async function fetchClubDetails() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('clubs')
          .select('*, courts(*)')
          .eq('id', id)
          .single();
        if (error) throw error;
        setDisplayClub({
          ...data,
          rating: 4.8, // Mock rating
          reviews: Math.floor(Math.random() * 200) + 10,
          image: data.photo_url,
          price: data.price_per_court || 0,
          courts: data.courts || []
        });
      } catch (err) {
        console.error("Error fetching club details", err);
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      fetchClubDetails();
    }
  }, [id]);

  useEffect(() => {
    // If user clicks the magic link in the email and gets logged in
    // while the OTP modal is open, we can automatically confirm.
    if (user && showOtpModal && !isSubmitting) {
      handleConfirmAfterLogin();
    }
  }, [user, showOtpModal]);

  const handleConfirmAfterLogin = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('bookings').insert([
        {
          full_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          user_id: user?.id || null,
          club_id: displayClub.id,
          court_id: selectedCourt,
          booking_date: selectedDate,
          time_slot: selectedTimeObj?.time || '',
          duration: selectedDurObj?.value || 1,
          total_price: totalPrice,
          status: 'pending',
        }
      ]);

      if (error) throw error;

      toast.success("Booking confirmed via Magic Link!");
      setShowOtpModal(false);
      navigate('/booking');
    } catch (err: any) {
      toast.error("Failed to finalize booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (otpInterval.current) {
        window.clearInterval(otpInterval.current);
      }
    };
  }, []);

  if (loading || !displayClub) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
      </div>
    );
  }

  const selectedCourtDetails = displayClub.courts.find((c: any) => c.id === selectedCourt);
  const selectedDurObj = DURATIONS.find(d => d.id === selectedDuration);
  const selectedTimeObj = MOCK_TIMES.find(t => t.id === selectedTime);
  const basePricePerSession = displayClub.price;
  const totalPrice = basePricePerSession * selectedDuration;

  const startOtpTimer = () => {
    setOtpCountdown(60);
    if (otpInterval.current) {
      window.clearInterval(otpInterval.current);
    }
    otpInterval.current = window.setInterval(() => {
      setOtpCountdown((current) => {
        if (current <= 1) {
          if (otpInterval.current) {
            window.clearInterval(otpInterval.current);
            otpInterval.current = null;
          }
          return 0;
        }
        return current - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in your contact information first.");
      return;
    }
    if (!selectedCourt || !selectedTime) {
      toast.error("Please choose a court and a time slot.");
      return;
    }

    setOtpLoading(true);
    setOtpError("");

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: { shouldCreateUser: true },
      });
      if (error) throw error;

      setOtpSent(true);
      setShowOtpModal(true);
      startOtpTimer();
      toast.success(`Verification code sent to ${formData.email}`);
    } catch (err: any) {
      setOtpError(err.message || "Failed to send verification code.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!otpCode.trim() || otpCode.length < 6) {
      setOtpError("Please enter the 6-digit code sent to your email.");
      return;
    }

    setIsSubmitting(true);
    setOtpError("");

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: formData.email,
        token: otpCode.trim(),
        type: 'magiclink',
      });
      if (verifyError) {
        setOtpError("Invalid or expired code. Please try again.");
        setIsSubmitting(false);
        return;
      }

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.warn('Unable to resolve user after OTP verification', userError);
      }

      const { error } = await supabase.from('bookings').insert([
        {
          full_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          user_id: userData?.user?.id || null,
          club_id: displayClub.id,
          court_id: selectedCourt,
          booking_date: selectedDate,
          time_slot: selectedTimeObj?.time || '',
          duration: selectedDurObj?.value || 1,
          total_price: totalPrice,
          status: 'pending',
        }
      ]);

      if (error) {
        console.error('Supabase error:', error);
        setOtpError("Failed to create booking. Please try again.");
        return;
      }

      toast.success("Booking confirmed — awaiting club approval.");
      setShowOtpModal(false);
      setOtpCode("");
      setOtpSent(false);
      setSelectedTime(null);
      setSelectedDuration(1);
      setIsSubmitting(false);
      navigate('/booking');
    } catch (err: any) {
      setOtpError(err.message || "Booking failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-background pb-24">
      {/* Navbar (Simplified for this page) */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border"
      >
        <div className="max-w-[1096px] mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-muted hover:bg-accent/10 transition-colors">
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <span className="font-['Arial',sans-serif] font-bold text-xl text-foreground tracking-[1.2px]">
              ULTIMA
            </span>
          </div>
          <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-xl bg-muted hover:bg-accent/10 transition-colors">
            {isDark ? <Sun className="w-5 h-5 text-accent" /> : <Moon className="w-5 h-5 text-muted-foreground" />}
          </button>
        </div>
      </motion.nav>

      <div className="max-w-[1096px] mx-auto pt-24 px-4">
        {/* Header Section */}
        <div className="bg-card rounded-[32px] overflow-hidden border border-border shadow-sm mb-8">
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
            <div className="bg-muted rounded-2xl p-1 flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab('courts')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                  activeTab === 'courts'
                    ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/20'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Trophy size={18} />
                <span>Book Court</span>
              </button>
              <button
                onClick={() => setActiveTab('games')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                  activeTab === 'games'
                    ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/20'
                    : 'text-muted-foreground hover:text-foreground'
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
                <h3 className="text-2xl font-bold text-foreground mb-2">Available Courts Today</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayClub.courts.map((court: any, index: number) => (
                      <CourtCard
                        key={court.id}
                        court={{
                          id: court.id,
                          name: court.name,
                          status: court.status || "available",
                          type: court.type,
                          capacity: court.capacity,
                          surface: court.surface,
                          club_id: court.club_id
                        }}
                        index={index}
                        onClick={court.status !== 'maintenance' ? () => {
                          setSelectedCourt(court.id);
                          document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
                        } : undefined}
                      />
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
            <div className="h-px bg-border w-full my-8"></div>

            {/* Booking Form */}
            <div id="booking-section">
               <h2 className="text-2xl font-bold text-foreground mb-2">Book a Court</h2>
               <p className="text-muted-foreground mb-6">{displayClub.name}</p>

               {selectedCourt ? (
                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                   
                   {/* Selected Court Details */}
                   <div className="bg-accent/5 border border-accent/20 rounded-2xl p-4 flex items-center justify-between">
                     <div>
                       <h4 className="font-bold text-accent dark:text-accent">{selectedCourtDetails?.name}</h4>
                       <p className="text-sm text-accent/80 dark:text-accent/80">{selectedCourtDetails?.type}</p>
                     </div>
                     <button onClick={() => setSelectedCourt(null)} className="text-sm text-accent dark:text-accent underline font-medium">Change</button>
                   </div>

                   {/* Contact Information Form */}
                    <div className="bg-card p-6 rounded-2xl border border-border">
                      <h3 className="text-lg font-bold text-foreground mb-4">Personal Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground mb-1">Full Name</label>
                          <input 
                            type="text" 
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            placeholder="Enter your full name" 
                            className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                          <input 
                            type="email" 
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            placeholder="Enter your email" 
                            className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground mb-1">Phone Number</label>
                          <input 
                            type="tel" 
                            value={formData.phone}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                            placeholder="Enter your phone number" 
                            className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
                        </div>
                      </div>
                    </div>

                    {/* consolidated Date & Time Section */}
                    <section>
                      <div className="flex items-center gap-4 mb-6">
                        <h3 className="text-2xl font-bold text-foreground mb-2">Pick Your Time</h3>
                      </div>
                      
                      <div className="bg-card rounded-[40px] p-8 border border-border">
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
                                className="w-full h-14 px-6 bg-muted rounded-2xl border-none outline-none font-black text-sm text-foreground focus:ring-2 ring-accent/50 transition-all cursor-pointer"
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
                                        ? "bg-accent text-accent-foreground"
                                        : "bg-transparent border-border text-muted-foreground hover:border-accent"
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
                                        ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20 scale-105"
                                        : "bg-transparent border-border text-muted-foreground hover:border-accent"
                                    }`}
                                  >
                                    {timeObj.time}
                                  </button>
                                );
                              })}
                            </div>

                            <div className="flex items-center gap-4 mt-4 text-[10px] font-bold opacity-40 text-foreground">
                              <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded bg-accent" /> Selected
                              </span>
                              <span className="flex items-center gap-1.5">
                                  <span className="w-3 h-3 rounded bg-destructive" /> Taken
                                </span>
                              <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded bg-muted" /> Available
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Sidebar / Price Summary */}
                    <div className="w-full">
                      <div className="sticky top-28 rounded-[24px] bg-card border border-accent/20 p-6 shadow-sm shadow-accent/5">
                        
                        {/* Club Info in Summary */}
                        <div className="mb-6 flex items-center gap-4 border-b border-border pb-4">
                          <img src={displayClub.image} alt={displayClub.name} className="w-16 h-16 rounded-xl object-cover" />
                          <div>
                            <h3 className="text-lg font-bold text-foreground">{displayClub.name}</h3>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                              <MapPin className="w-3.5 h-3.5" /> {displayClub.location}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-6">
                          <span className="text-accent text-xl font-bold">DT</span>
                          <h3 className="text-lg font-bold text-foreground">Booking Details</h3>
                        </div>
                        
                        <div className="space-y-4 mb-8">
                          {/* Court & Duration */}
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Court:</span>
                            <span className="font-bold text-foreground">{selectedCourtDetails?.name || '---'}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Duration:</span>
                            <span className="font-medium text-foreground">{selectedDurObj?.label}</span>
                          </div>
                          
                          <div className="h-px bg-border w-full" />

                          {/* Date & Time */}
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Date:</span>
                            <span className="font-bold text-foreground">{selectedDate}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Time Slot:</span>
                            <span className="font-bold text-accent">{selectedTimeObj?.time || '---'}</span>
                          </div>

                          <div className="h-px bg-border w-full" />

                          {/* Personal Info */}
                          <div className="space-y-2">
                             <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Contact Information</span>
                             <div className="flex justify-between text-xs">
                               <span className="text-muted-foreground">Name:</span>
                               <span className="font-medium text-foreground truncate max-w-[150px]">{formData.name || '---'}</span>
                             </div>
                             <div className="flex justify-between text-xs">
                               <span className="text-muted-foreground">Phone:</span>
                               <span className="font-medium text-foreground">{formData.phone || '---'}</span>
                             </div>
                          </div>
                          
                          <div className="pt-6 border-t border-accent/20 flex justify-between items-center">
                            <span className="font-bold text-foreground text-lg">Total</span>
                            <span className="text-3xl font-bold text-accent">{totalPrice}DT</span>
                          </div>
                        </div>

                        <div className="mt-8 border-t border-accent/20 pt-6">
                          <button
                            onClick={handleSendOtp}
                            disabled={!selectedCourt || !selectedTime || isSubmitting}
                            className={`w-full py-4 rounded-xl font-semibold text-[17px] transition-all flex items-center justify-center gap-2 ${
                              selectedCourt && selectedTime && !isSubmitting
                                ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-95'
                                : 'bg-muted text-muted-foreground cursor-not-allowed border border-border'
                            }`}
                          >
                            {isSubmitting ? (
                              <Loader2 className="animate-spin" size={20} />
                        ) : (
                          <>
                            <CheckCircle2 size={20} />
                            <span>VERIFY & BOOK</span>
                            <ChevronRight size={20} />
                          </>
                        )}
                          </button>
                          <p className="text-center text-xs text-muted-foreground mt-4 leading-relaxed">
                            Cancellations must be made at least 24 hours in advance.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="bg-muted border border-dashed border-border rounded-2xl p-12 text-center w-full">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-foreground mb-2">No Court Selected</h3>
                    <p className="text-sm text-muted-foreground">Please select a court from the available list above to continue with your booking.</p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showOtpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowOtpModal(false);
                setOtpError('');
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.96, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 20, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.25, duration: 0.35 }}
              className="relative w-full max-w-md rounded-[32px] bg-card border border-border p-8 shadow-2xl"
            >
              <div className="absolute top-0 left-0 h-1.5 w-full bg-accent rounded-t-[32px]" />
              <div className="text-center mb-8">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-accent/10 text-accent">
                  <Shield size={32} />
                </div>
                <h2 className="text-2xl font-black text-foreground mb-2">Verify Your Email</h2>
                <p className="text-sm text-muted-foreground">
                  {otpSent ? (
                    <>Enter the 6-digit code sent to <span className="font-bold text-accent">{formData.email}</span></>
                  ) : (
                    'Sending your verification code...'
                  )}
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => {
                      setOtpCode(e.target.value.replace(/\D/g, '')); 
                      setOtpError('');
                    }}
                    className="w-full h-16 rounded-3xl border border-border bg-muted px-6 text-center text-3xl font-black tracking-[0.4em] outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                    placeholder="000000"
                    autoFocus
                  />
                  {otpError && (
                    <p className="mt-3 text-xs text-red-500 font-bold flex items-center gap-2">
                      <XCircle size={14} /> {otpError}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleConfirmBooking}
                  disabled={isSubmitting || otpCode.length !== 6}
                  className="w-full h-14 rounded-3xl bg-accent text-accent-foreground font-black shadow-lg shadow-accent/20 transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
                </button>

                <div className="flex flex-col gap-3 text-center">
                  <button
                    onClick={handleSendOtp}
                    disabled={otpCountdown > 0 || otpLoading}
                    className="text-xs font-bold text-accent hover:underline disabled:text-muted-foreground disabled:no-underline disabled:cursor-not-allowed"
                  >
                    {otpCountdown > 0 ? `Resend code in ${otpCountdown}s` : 'Resend code'}
                  </button>
                  {otpLoading && (
                    <span className="text-xs text-muted-foreground">Sending verification code…</span>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  setShowOtpModal(false);
                  setOtpError('');
                }}
                className="absolute right-5 top-5 text-muted-foreground hover:text-foreground"
              >
                <XCircle size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ClubDetailsPage;
