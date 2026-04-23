import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, MapPin, Info, CheckCircle2, ChevronRight,
  Loader2, CalendarDays, ShieldCheck, Zap, QrCode,
  XCircle, ChevronLeft, Users, FileText, Tag, Layers,
  AlertTriangle, CalendarX, History, LayoutGrid
} from "lucide-react";
import { useAuth } from "../../services/AuthContext";
import { supabase } from "../../config/supabase";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { getPlayers, createMatch } from "../../services/playerService";
import QRCode from "react-qr-code"; 
import padelArena from "../../assets/images/padel_arena.png";
import { CourtCard } from "../../components/dashboard/CourtCard";


interface Court {
  id: string;
  name: string;
  type: string;
  surface: string;
  image: string;
  status?: "available" | "occupied" | "maintenance";
  club_id?: string | number;
}

interface Booking {
  id: string;
  court_id: string;
  user_id: string;
  booking_date: string;
  time_slot: string;
  status: "pending" | "accepted" | "declined" | "confirmed" | "cancelled" | "completed";
  duration: number;
  player_count: number;
  notes: string;
  total_price: number;
  created_at: string;
  result?: string;
  score?: string;
  courts?: { name: string; surface: string };
}

type Tab = "book" | "upcoming" | "history";


const TIME_SLOTS = [
  "08:00 - 09:30", "09:30 - 11:00", "11:00 - 12:30",
  "12:30 - 14:00", "14:00 - 15:30", "15:30 - 17:00",
  "17:00 - 18:30", "18:30 - 20:00", "20:00 - 21:30",
];

const DURATION_OPTIONS = [
  { label: "1 session", value: 1, slots: 1 },
  { label: "2 sessions", value: 2, slots: 2 },
];

const PRICE_PER_SLOT = 99;

const DISCOUNT_CODES: Record<string, number> = {
  ULTIMA10: 0.1,
  MEMBER20: 0.2,
};

const COURT_STATUS_CONFIG = {
  available: { label: "Available", color: "text-accent bg-accent/10 border border-accent/20" },
  occupied:  { label: "Occupied",  color: "text-orange-500 bg-orange-500/10 border border-orange-500/20" },
  maintenance:{ label: "Maintenance", color: "text-rose-500 bg-rose-500/10 border border-rose-500/20" },
};


function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });
}

function getCountdown(date: string, slot: string) {
  const start = slot.split(" - ")[0];
  const target = new Date(`${date}T${start}:00`);
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}


function StatusBadge({ status }: { status: Court["status"] }) {
  const cfg = COURT_STATUS_CONFIG[status ?? "available"];
  return (
    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${cfg.color} font-['Poppins']`}>
      {cfg.label}
    </span>
  );
}

function SectionHeading({ step, title }: { step?: number | string; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      {step !== undefined && (
        <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-accent-foreground font-black shrink-0 shadow-lg shadow-accent/20">
          {step}
        </div>
      )}
      <h3 className="text-xl font-black text-foreground uppercase tracking-tight font-['Playfair_Display']">{title}</h3>
    </div>
  );
}


export function CourtBooking() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ── Tab state ──
  const [activeTab, setActiveTab] = useState<Tab>("book");

  // ── Data ──
  const [clubs, setClubs] = useState<any[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [takenSlots, setTakenSlots] = useState<Set<string>>(new Set());
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [players, setPlayers] = useState<any[]>([]);
  const [playersLoading, setPlayersLoading] = useState(false);

  // ── Booking form ──
  const [selectedClub, setSelectedClub] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [selectedOpponentId, setSelectedOpponentId] = useState<string | null>(null);
  const [duration, setDuration] = useState(1);
  const [notes, setNotes] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [discountError, setDiscountError] = useState("");

  // ── My Bookings UI ──
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [qrBooking, setQrBooking] = useState<Booking | null>(null);

  // ── Email OTP Verification ──
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpCountdown, setOtpCountdown] = useState(0);

  // ── Computed ──
  const basePricePerSlot = selectedClub?.price_per_court || PRICE_PER_SLOT;
  const basePrice = basePricePerSlot * duration;
  const discount = basePrice * appliedDiscount;
  const totalPrice = basePrice - discount;

  

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [clubsRes, courtsRes] = await Promise.all([
          supabase.from('clubs').select('*'),
          supabase.from('courts').select('*')
        ]);

        if (clubsRes.error) throw clubsRes.error;
        const clubsData = clubsRes.data || [];
        
        if (courtsRes.error) throw courtsRes.error;
        const courtsData = courtsRes.data || [];
        
        // Map courts count manually to avoid complex join issues
        const formattedClubs = clubsData.map((c: any) => ({
          ...c,
          image: c.photo_url || padelArena,
          courts_count: courtsData.filter((court: any) => court.club_id === c.id).length,
        }));
        
        setClubs(formattedClubs);
        setCourts(courtsData);
      } catch (err) {
        console.error("CourtBooking init error:", err);
        toast.error("Failed to load clubs and courts");
      } finally {
        setLoading(false);
      }
    }
    fetchInitialData();

    // Fetch players for opponent selection
    async function fetchPlayers() {
      setPlayersLoading(true);
      try {
        const data = await getPlayers();
        // Remove current user from list
        setPlayers(data.filter((p: any) => p.id !== user?.id));
      } catch {
        console.error("Failed to load players");
      } finally {
        setPlayersLoading(false);
      }
    }
    if (user) fetchPlayers();

    // Real-time subscription for clubs and courts
    const dataSub = supabase
      .channel('data_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'courts' }, () => {
         fetchInitialData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clubs' }, () => {
         fetchInitialData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(dataSub);
    };
  }, []);

  // Fetch taken slots whenever court or date changes
  useEffect(() => {
    if (!selectedCourt) return;
    async function fetchTaken() {
      setSlotsLoading(true);
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("time_slot")
          .eq("court_id", selectedCourt!.id)
          .eq("booking_date", selectedDate)
          .eq("status", "confirmed");
        if (error) throw error;
        setTakenSlots(new Set((data || []).map((b: any) => b.time_slot)));
        setSelectedSlot(null);
      } catch {
        toast.error("Failed to load availability");
      } finally {
        setSlotsLoading(false);
      }
    }
    fetchTaken();

    // Real-time subscription for bookings on the selected date & court
    const bookingSub = supabase
      .channel('bookings_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, (payload) => {
         const newBooking = payload.new as any;
         // Handle delete events where new is empty, check old
         const record = newBooking && Object.keys(newBooking).length > 0 ? newBooking : payload.old as any;
         
         if (record && record.court_id === selectedCourt!.id && record.booking_date === selectedDate) {
           fetchTaken();
         }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(bookingSub);
    };
  }, [selectedCourt, selectedDate]);

  // Fetch user's bookings
  useEffect(() => {
    if (!user || activeTab === "book") return;
    async function fetchMyBookings() {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*, courts(name, surface)")
          .eq("user_id", user!.id)
          .order("booking_date", { ascending: false });
        if (error) throw error;
        setMyBookings(data || []);
      } catch {
        toast.error("Failed to load bookings");
      }
    }
    fetchMyBookings();
  }, [user, activeTab]);


  const handleApplyDiscount = () => {
    const upper = discountCode.toUpperCase();
    if (DISCOUNT_CODES[upper] !== undefined) {
      setAppliedDiscount(DISCOUNT_CODES[upper]);
      setDiscountError("");
      toast.success(`Discount applied: ${DISCOUNT_CODES[upper] * 100}% off`);
    } else {
      setDiscountError("Invalid code");
      setAppliedDiscount(0);
    }
  };

  // ─── Step 1: validate form & send OTP ──────────────────────────────────
  const handleRequestOtp = async () => {
    if (!user || !selectedCourt || !selectedSlot)
      return toast.error("Please select a court and time slot");
    if (selectedCourt.status === "maintenance")
      return toast.error("This court is under maintenance");

    setShowOtpModal(true);
    setOtpSent(false);
    setOtpCode("");
    setOtpError("");

    // Send OTP to the user's email via Supabase Auth
    setOtpLoading(true);
    try {
      const email = user.email!;
      const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
      if (error) throw error;
      setOtpSent(true);
      // 60-second cooldown before allowing resend
      setOtpCountdown(60);
      const interval = setInterval(() => {
        setOtpCountdown((c) => {
          if (c <= 1) { clearInterval(interval); return 0; }
          return c - 1;
        });
      }, 1000);
      toast.success(`Verification code sent to ${email}`);
    } catch (err: any) {
      setOtpError(err.message || "Failed to send verification code");
    } finally {
      setOtpLoading(false);
    }
  };

  // ─── Step 2: verify OTP & create booking ───────────────────────────────
  const handleConfirmBooking = async () => {
    if (!user || !selectedCourt || !selectedSlot) return;
    if (!otpCode.trim() || otpCode.length < 6)
      return setOtpError("Please enter the 6-digit code from your email");

    setBookingLoading(true);
    setOtpError("");
    try {
      // Verify the OTP
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: user.email!,
        token: otpCode.trim(),
        type: "email",
      });
      if (verifyError) {
        setOtpError("Invalid or expired code. Please try again.");
        setBookingLoading(false);
        return;
      }

      const { data: bookingData, error: bookingError } = await supabase.from("bookings").insert([
        {
          court_id: selectedCourt.id,
          user_id: user.id,
          club_id: selectedClub.id,
          booking_date: selectedDate,
          time_slot: selectedSlot,
          status: "pending",
          duration,
          notes,
          total_price: totalPrice,
        },
      ]).select();

      if (bookingError) {
        if (bookingError.code === "23505")
          throw new Error("This slot was just taken. Please choose another.");
        throw bookingError;
      }

      // Create the match record if an opponent was selected
      if (selectedOpponentId && bookingData?.[0]) {
        await createMatch({
          booking_id: bookingData[0].id,
          player1_id: user.id,
          player2_id: selectedOpponentId,
          match_type: 'friendly'
        });
      }

      toast.success("Request sent! Waiting for club approval. 🎾");
      setShowOtpModal(false);
      setOtpCode("");
      setOtpSent(false);
      setSelectedSlot(null);
      setNotes("");
      setDiscountCode("");
      setAppliedDiscount(0);
      setActiveTab("upcoming");
    } catch (err: any) {
      setOtpError(err.message || "Booking failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    setCancellingId(bookingId);
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId)
        .eq("user_id", user!.id);
      if (error) throw error;
      setMyBookings((prev) =>
        prev.map((b) => b.id === bookingId ? { ...b, status: "cancelled" } : b)
      );
      toast.success("Booking cancelled");
    } catch {
      toast.error("Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-accent mb-4" size={40} />
        <p className="text-xs font-black uppercase tracking-[4px] opacity-40 text-foreground">Initializing Courts</p>
      </div>
    );
  }

  

  const today = new Date().toISOString().split("T")[0];
  const upcomingBookings = myBookings.filter(
    (b) => b.booking_date >= today && (b.status === "confirmed" || b.status === "pending" || b.status === "accepted")
  );
  const pastBookings = myBookings.filter(
    (b) => b.booking_date < today || (b.status !== "confirmed" && b.status !== "pending" && b.status !== "accepted")
  );



  return (
    <div className="max-w-[1400px] mx-auto pb-20 px-4 sm:px-6 lg:px-8">

      {/* ── HEADER ── */}
      <header className="mb-8">
        <div className="flex items-center gap-3 text-accent font-black text-[10px] uppercase tracking-[4px] mb-3 font-['Poppins']">
          <Zap size={14} className="fill-accent" />
          <span>Ultima Reservation System</span>
        </div>
        <h2 className="font-['Playfair_Display',serif] text-3xl md:text-5xl font-black text-foreground leading-none mb-4">
          Court Booking
        </h2>
        <p className="text-muted-foreground font-['Poppins'] text-lg">
          Reserve, track, and manage all your court sessions in one place.
        </p>
      </header>

      {/* ── TOP NAV TABS ── */}
      <div className="overflow-x-auto no-scrollbar mb-12">
        <nav className="relative flex p-1.5 bg-muted rounded-[22px] border border-border w-full min-w-max md:w-fit backdrop-blur-md shadow-inner">
        {(
          [
            { id: "book",     label: "Book",     icon: <LayoutGrid size={15} /> },
            { id: "upcoming", label: "Upcoming",  icon: <CalendarDays size={15} /> },
            { id: "history",  label: "History",   icon: <History size={15} /> },
          ] as { id: Tab; label: string; icon: React.ReactNode }[]
        ).map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3.5 rounded-[18px] text-[11px] font-black uppercase tracking-[1px] transition-all duration-300 z-10 font-['Poppins'] ${
                isActive ? "text-accent-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-accent rounded-[17px] shadow-lg shadow-accent/40 z-[-1]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {tab.icon}
              <span className={isActive ? "block" : "hidden sm:block"}>
                {tab.label}
              </span>
              
              {tab.id === "upcoming" && upcomingBookings.length > 0 && (
                <span className={`ml-1 w-5 h-5 rounded-full text-[9px] flex items-center justify-center font-black transition-transform ${
                  isActive ? "bg-accent-foreground text-accent scale-110" : "bg-accent text-accent-foreground"
                }`}>
                  {upcomingBookings.length}
                </span>
              )}
            </button>
          );
        })}
        </nav>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "book" && (
          <motion.div
            key="book"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* LEFT: Selection panels */}
              <div className="lg:col-span-8 space-y-10">

                {/* ── 1. Club Selection ── */}
                <section>
                  <SectionHeading step={1} title="Choose Your Club" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {clubs.map((club) => (
                      <motion.div
                        layout
                        key={club.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`bg-card rounded-2xl border border-border overflow-hidden hover:border-accent transition-all duration-300 shadow-sm hover:shadow-md ${
                          selectedClub?.id === club.id ? 'ring-2 ring-accent border-accent scale-[1.02]' : ''
                        }`}
                      >
                        <div className="relative h-48 overflow-hidden group cursor-pointer" onClick={() => {
                          setSelectedClub(club);
                          setSelectedCourt(null);
                        }}>
                          <img
                            src={club.image}
                            alt={club.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 right-3 flex gap-2">
                            <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                              {club.courts_count} Courts
                            </div>
                          </div>
                          {selectedClub?.id === club.id && (
                            <div className="absolute top-3 left-3 bg-accent text-accent-foreground p-1 rounded-full shadow-lg">
                              <CheckCircle2 size={16} />
                            </div>
                          )}
                        </div>

                        <div className="p-4 cursor-pointer" onClick={() => {
                          setSelectedClub(club);
                          setSelectedCourt(null);
                        }}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-foreground mb-2">{club.name}</h3>

                              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-2">
                                <MapPin className="w-4 h-4 text-accent" />
                                <span>{club.location || 'Tunisia'}</span>
                              </div>

                              <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-sm mb-2">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-accent" />
                                  <span>Open {club.open_time || '9:00 AM'} - {club.close_time || '06:00 PM'}</span>
                                </div>
                                <span className="text-foreground font-semibold">{club.price_per_court || PRICE_PER_SLOT} DT/hr</span>
                              </div>
                            </div>

                            <div className="flex flex-col justify-center h-full pt-2">
                              <button
                                className={`px-4 py-2 rounded-xl font-semibold text-sm shadow-lg transition-all duration-300 whitespace-nowrap active:scale-95 text-center ${
                                  selectedClub?.id === club.id
                                    ? 'bg-accent text-accent-foreground'
                                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                }`}
                              >
                                {selectedClub?.id === club.id ? 'Selected' : 'Select'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {selectedClub && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <SectionHeading step={2} title="Select Surface" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {courts.filter(c => String(c.club_id) === String(selectedClub.id)).map((court, index) => (
                        <CourtCard
                          key={court.id}
                          court={{
                            id: court.id,
                            name: court.name,
                            status: court.status || "available",
                            type: court.type,
                            surface: court.surface
                          }}
                          index={index}
                          isSelected={selectedCourt?.id === court.id}
                          onClick={court.status === "maintenance" ? undefined : () => setSelectedCourt(court)}
                        />
                      ))}
                    </div>
                  </motion.section>
                )}

                <AnimatePresence>
                  {selectedCourt && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-10"
                    >
                      {/* ── 3. Date & Time (Consolidated) ── */}
                      <section>
                        <SectionHeading step={3} title="Pick Your Time" />
                        <div className="bg-card rounded-[40px] p-8 border border-border">
                          <div className="flex flex-col lg:flex-row gap-10">
                            {/* Date & Duration */}
                            <div className="w-full lg:w-1/3 space-y-8">
                              <div>
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-3 block">
                                  Choose Date
                                </label>
                                <input
                                  type="date"
                                  value={selectedDate}
                                  min={new Date().toISOString().split("T")[0]}
                                  onChange={(e) => setSelectedDate(e.target.value)}
                                  className="w-full h-14 px-6 bg-muted rounded-2xl border-none outline-none font-black text-sm dark:text-white focus:ring-2 ring-accent/50 transition-all cursor-pointer"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-3 block">
                                  Duration
                                </label>
                                <div className="flex gap-2">
                                  {DURATION_OPTIONS.map((d) => (
                                    <button
                                      key={d.value}
                                      onClick={() => setDuration(d.value)}
                                      className={`flex-1 h-12 rounded-xl text-[11px] font-black transition-all border ${
                                        duration === d.value
                                          ? "bg-accent border-accent text-accent-foreground shadow-lg shadow-accent/20"
                                          : "bg-transparent border-gray-200 dark:border-border dark:text-white/60 hover:border-accent"
                                      }`}
                                    >
                                      {d.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Time Slots */}
                            <div className="w-full lg:w-2/3">
                              <div className="flex items-center justify-between mb-4">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-40">
                                  Available Slots for {selectedCourt.name}
                                </label>
                                {slotsLoading && <Loader2 className="animate-spin text-accent" size={14} />}
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {TIME_SLOTS.map((slot) => {
                                  const isTaken = takenSlots.has(slot);
                                  const isSelected = selectedSlot === slot;
                                  return (
                                    <button
                                      key={slot}
                                      disabled={isTaken || slotsLoading}
                                      onClick={() => setSelectedSlot(slot)}
                                      className={`relative h-12 rounded-xl text-[11px] font-black transition-all border ${
                                        isTaken
                                          ? "bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/5 text-gray-300 dark:text-white/20 cursor-not-allowed"
                                          : isSelected
                                          ? "bg-accent border-accent text-accent-foreground shadow-lg shadow-accent/20 scale-105"
                                          : "bg-transparent border-gray-200 dark:border-border dark:text-white/60 hover:border-accent"
                                      }`}
                                    >
                                      {slot}
                                      {isTaken && (
                                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                          <XCircle size={10} className="text-white" />
                                        </span>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>

                              <div className="flex items-center gap-4 mt-6 text-[10px] font-bold opacity-40">
                                <span className="flex items-center gap-1.5">
                                  <span className="w-3 h-3 rounded bg-accent" /> Selected
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <span className="w-3 h-3 rounded bg-red-400" /> Taken
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <span className="w-3 h-3 rounded bg-gray-200 dark:bg-card" /> Available
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* ── 4. Details & Extras ── */}
                      <section>
                        <SectionHeading step={4} title="Details & Extras" />
                        <div className="bg-card rounded-[40px] p-8 border border-border space-y-8">
                          {/* Notes */}
                          <div>
                            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 mb-3">
                              <FileText size={12} /> Notes / Equipment Requests
                            </label>
                            <textarea
                              rows={3}
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="e.g. Need ball machine, extra rackets..."
                              className="w-full px-5 py-4 bg-muted rounded-2xl border-none outline-none font-medium text-sm dark:text-white focus:ring-2 ring-accent/50 transition-all resize-none"
                            />
                          </div>

                          {/* Discount & Opponent */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="min-w-0">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 mb-3">
                                  <Tag size={12} /> Discount Code
                                </label>
                                <div className="flex flex-col sm:flex-row gap-3">
                                  <input
                                    type="text"
                                    value={discountCode}
                                    onChange={(e) => setDiscountCode(e.target.value)}
                                    placeholder="Enter code"
                                    className="flex-1 h-16 sm:h-12 px-6 bg-muted rounded-2xl border-2 border-transparent outline-none font-bold text-base sm:text-sm dark:text-white focus:border-accent/50 focus:bg-white dark:focus:bg-black/40 transition-all placeholder:opacity-40"
                                  />
                                  <button
                                    onClick={handleApplyDiscount}
                                    className="px-8 sm:px-6 h-12 bg-accent text-accent-foreground font-black rounded-2xl text-[11px] uppercase tracking-wider hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
                                  >
                                    Apply
                                  </button>
                                </div>
                            </div>

                            {/* Opponent Selection (Condensed) */}
                            <div className="min-w-0 overflow-hidden">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 mb-3">
                                  <Users size={14} /> Play Against (Optional)
                                </label>
                                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                  {playersLoading ? (
                                    <div className="flex items-center justify-center p-2">
                                      <Loader2 className="animate-spin text-accent" size={20} />
                                    </div>
                                  ) : (
                                    players.slice(0, 5).map(player => (
                                      <button
                                        key={player.id}
                                        onClick={() => setSelectedOpponentId(selectedOpponentId === player.id ? null : player.id)}
                                        className={`shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 transition-all p-0.5 ${
                                          selectedOpponentId === player.id ? 'border-accent scale-110 ring-4 ring-accent/20' : 'border-transparent'
                                        }`}
                                      >
                                        <img 
                                          src={player.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.full_name}`} 
                                          className="w-full h-full rounded-full object-cover"
                                          alt={player.full_name}
                                        />
                                      </button>
                                    ))
                                  )}
                                  <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center border border-dashed border-white/20">
                                    <ChevronRight size={18} className="opacity-40" />
                                  </div>
                                </div>
                            </div>
                          </div>
                        </div>
                      </section>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* RIGHT: Summary - Only if court is selected */}
              <div className="lg:col-span-4">
                {selectedCourt ? (
                  <div className="lg:sticky lg:top-24 space-y-6 animate-in fade-in slide-in-from-right duration-500">
                    <div className="dark:bg-card rounded-[40px] p-8 dark:text-white border border-border bg-white shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
                      <h3 className="text-2xl font-black mb-8 tracking-tighter">BOOKING DETAILS</h3>

                      <div className="space-y-5 mb-8">
                        <SummaryRow
                          icon={<MapPin size={18} />}
                          label="Club"
                          value={selectedClub?.name || "---"}
                        />
                        <SummaryRow
                          icon={<Grid3X3 size={18} />}
                          label="Court"
                          value={selectedCourt?.name || "---"}
                          accent
                        />
                        <SummaryRow
                          icon={<CalendarDays size={18} />}
                          label="Date"
                          value={formatDate(selectedDate)}
                        />
                        <SummaryRow
                          icon={<Clock size={18} />}
                          label="Time"
                          value={selectedSlot || "---"}
                        />
                        <SummaryRow
                          icon={<Layers size={18} />}
                          label="Duration"
                          value={`${duration} session${duration !== 1 ? "s" : ""}`}
                        />

                        <div className="h-[1px] bg-gray-100 dark:bg-white/10 w-full" />

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-end pt-2">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                              Total Amount
                            </span>
                            <span className="text-4xl font-black text-accent tracking-tighter">
                              {totalPrice.toFixed(2)} DT
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleRequestOtp}
                        disabled={!selectedSlot || !selectedCourt || bookingLoading}
                        className="w-full h-16 bg-accent text-accent-foreground font-black rounded-2xl shadow-xl shadow-accent/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-20 disabled:grayscale disabled:scale-100 disabled:cursor-not-allowed"
                      >
                        {bookingLoading ? (
                          <Loader2 className="animate-spin" size={20} />
                        ) : (
                          <>
                            <ShieldCheck size={20} />
                            <span>VERIFY &amp; CONFIRM</span>
                            <ChevronRight size={20} />
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-6 bg-accent/5 border border-accent/10 rounded-[24px] flex gap-4">
                      <Info className="text-accent shrink-0 mt-0.5" size={18} />
                      <p className="text-[11px] font-medium leading-relaxed dark:text-white/60">
                        Cancellations must be made at least 24 hours in advance.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="sticky top-24 p-8 rounded-[40px] border-2 border-dashed border-border text-center space-y-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto text-foreground">
                      <LayoutGrid className="opacity-20" size={32} />
                    </div>
                    <div className="text-foreground">
                      <h4 className="font-bold opacity-60">Complete Step 1 & 2</h4>
                      <p className="text-xs opacity-40">Choose a club and court to view the price summary.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            TAB: UPCOMING BOOKINGS
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab === "upcoming" && (
          <motion.div
            key="upcoming"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {upcomingBookings.length === 0 ? (
              <EmptyState
                icon={<CalendarX size={40} className="text-accent" />}
                title="No upcoming bookings"
                message="You don't have any confirmed bookings yet."
                action={{ label: "Book a Court", onClick: () => setActiveTab("book") }}
              />
            ) : (
              upcomingBookings.map((booking) => {
                const countdown = getCountdown(booking.booking_date, booking.time_slot);
                return (
                  <div
                    key={booking.id}
                    className="bg-card rounded-[32px] p-7 border border-border flex flex-col md:flex-row md:items-center gap-6"
                  >
                    {/* Color accent */}
                    <div className="w-2 h-full min-h-[60px] bg-accent rounded-full shrink-0 hidden md:block" />

                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-1">Court</p>
                        <p className="font-black text-foreground text-sm">{booking.courts?.name || "—"}</p>
                        <p className="text-[10px] text-accent font-bold uppercase">{booking.courts?.surface}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-1">Date</p>
                        <p className="font-black text-foreground text-sm">{formatDate(booking.booking_date)}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-1">Time</p>
                        <p className="font-black text-foreground text-sm">{booking.time_slot}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-1">Status</p>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            booking.status === 'pending' ? 'bg-yellow-500' :
                            booking.status === 'accepted' || booking.status === 'confirmed' ? 'bg-emerald-500' :
                            'bg-red-500'
                          }`} />
                          <p className="font-black text-foreground text-[10px] uppercase">{booking.status}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => setQrBooking(booking)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-muted rounded-xl text-[11px] font-black text-foreground hover:bg-accent hover:text-accent-foreground transition-all"
                      >
                        <QrCode size={14} /> QR
                      </button>
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={cancellingId === booking.id}
                        className="flex items-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-xl text-[11px] font-black hover:bg-red-500 hover:text-white transition-all disabled:opacity-40"
                      >
                        {cancellingId === booking.id ? (
                          <Loader2 className="animate-spin" size={14} />
                        ) : (
                          <XCircle size={14} />
                        )}
                        Cancel
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            TAB: BOOKING HISTORY
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab === "history" && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {pastBookings.length === 0 ? (
              <EmptyState
                icon={<History size={40} className="text-accent" />}
                title="No booking history"
                message="Your completed and cancelled bookings will appear here."
              />
            ) : (
              pastBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-card rounded-[32px] p-7 border border-border flex flex-col md:flex-row md:items-center gap-6 opacity-80 hover:opacity-100 transition-opacity"
                >
                  <div className={`w-2 min-h-[60px] rounded-full shrink-0 hidden md:block ${
                    booking.status === "cancelled" ? "bg-red-500" : "bg-gray-300 dark:bg-white/20"
                  }`} />

                  <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-1">Court</p>
                      <p className="font-black dark:text-white text-sm">{booking.courts?.name || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-1">Date</p>
                      <p className="font-black dark:text-white text-sm">{formatDate(booking.booking_date)}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-1">Time</p>
                      <p className="font-black text-foreground text-sm">{booking.time_slot}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-1">Result</p>
                      <p className={`font-black text-sm ${
                        booking.result === "Win" ? "text-accent" :
                        booking.result === "Loss" ? "text-red-400" :
                        "text-foreground/40"
                      }`}>
                        {booking.result || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-1">Status</p>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-2 ${
                        booking.status === "cancelled" || booking.status === "declined"
                          ? "bg-red-500/10 text-red-400"
                          : booking.status === "pending"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : "bg-accent/10 text-accent"
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          booking.status === "cancelled" || booking.status === "declined" ? "bg-red-500" :
                          booking.status === "pending" ? "bg-yellow-500" : "bg-accent"
                        }`} />
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── QR CODE MODAL ── */}
      <AnimatePresence>
        {qrBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setQrBooking(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-[40px] p-10 max-w-sm w-full text-center border border-border shadow-2xl"
            >
              <div className="flex items-center gap-2 text-accent font-black text-[10px] uppercase tracking-[4px] mb-5 justify-center">
                <Zap size={12} fill="#CCFF00" />
                Check-in QR Code
              </div>
              <h3 className="text-2xl font-black text-foreground mb-1">{qrBooking.courts?.name}</h3>
              <p className="text-sm text-muted-foreground font-medium mb-8">
                {formatDate(qrBooking.booking_date)} · {qrBooking.time_slot}
              </p>
              <div className="bg-white p-5 rounded-[24px] inline-block mb-8 shadow-lg">
                <QRCode
                  value={JSON.stringify({
                    booking_id: qrBooking.id,
                    court: qrBooking.courts?.name,
                    date: qrBooking.booking_date,
                    slot: qrBooking.time_slot,
                  })}
                  size={180}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                />
              </div>
              <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest mb-6 text-foreground">
                Present this at the ALMUS kiosk
              </p>
              <button
                onClick={() => setQrBooking(null)}
                className="w-full h-12 bg-accent text-accent-foreground font-black rounded-2xl text-sm hover:scale-[1.02] active:scale-95 transition-all"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════ EMAIL OTP VERIFICATION MODAL ════ */}
      <AnimatePresence>
        {showOtpModal && (
          <motion.div
            key="otp-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) { setShowOtpModal(false); setOtpError(""); } }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
              className="relative bg-card border border-border rounded-[32px] p-8 w-full max-w-md shadow-2xl overflow-hidden"
            >
              {/* accent bar */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-accent" />

              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="text-accent" size={32} />
                </div>
                <h2 className="text-2xl font-black text-foreground font-['Playfair_Display'] mb-2">
                  Verify Your Email
                </h2>
                <p className="text-sm text-muted-foreground font-['Poppins']">
                  {otpSent
                    ? <>We sent a 6-digit code to <span className="text-accent font-bold">{user?.email}</span></>
                    : "Sending verification code…"}
                </p>
              </div>

              {otpLoading && !otpSent && (
                <div className="flex justify-center mb-6">
                  <Loader2 className="animate-spin text-accent" size={32} />
                </div>
              )}

              {otpSent && (
                <div className="space-y-5">
                  {/* 6-digit input */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 font-['Poppins']">
                      Enter 6-digit code
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => { setOtpCode(e.target.value.replace(/\D/g, "")); setOtpError(""); }}
                      placeholder="000000"
                      className="w-full h-16 px-6 bg-muted rounded-2xl text-center text-3xl font-black tracking-[0.5em] outline-none focus:ring-2 ring-accent/50 transition-all text-foreground border border-border"
                      autoFocus
                    />
                    {otpError && (
                      <p className="mt-2 text-xs text-red-500 font-bold font-['Poppins'] flex items-center gap-1">
                        <XCircle size={12} /> {otpError}
                      </p>
                    )}
                  </div>

                  {/* Confirm button */}
                  <button
                    onClick={handleConfirmBooking}
                    disabled={bookingLoading || otpCode.length < 6}
                    className="w-full h-14 bg-accent text-accent-foreground font-black rounded-2xl shadow-lg shadow-accent/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 font-['Poppins']"
                  >
                    {bookingLoading ? <Loader2 className="animate-spin" size={20} /> : <><CheckCircle2 size={18} /> Confirm Booking</>}
                  </button>

                  {/* Resend */}
                  <div className="text-center">
                    <button
                      onClick={handleRequestOtp}
                      disabled={otpCountdown > 0 || otpLoading}
                      className="text-xs font-bold text-accent hover:underline disabled:text-muted-foreground disabled:no-underline disabled:cursor-not-allowed font-['Poppins'] transition-colors"
                    >
                      {otpCountdown > 0 ? `Resend code in ${otpCountdown}s` : "Resend code"}
                    </button>
                  </div>
                </div>
              )}

              {/* Cancel */}
              <button
                onClick={() => { setShowOtpModal(false); setOtpError(""); setOtpCode(""); }}
                className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors"
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

// ─── Small helpers ────────────────────────────────────────────────────────────

function SummaryRow({
  icon, label, value, accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3 opacity-60">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <span className={`text-sm font-black ${accent ? "text-accent" : "text-foreground"}`}>
        {value}
      </span>
    </div>
  );
}

function EmptyState({
  icon, title, message, action,
}: {
  icon: React.ReactNode;
  title: string;
  message: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-6 opacity-60">{icon}</div>
      <h4 className="text-xl font-black dark:text-white mb-2">{title}</h4>
      <p className="text-sm dark:text-white/40 font-medium mb-8 max-w-xs">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-8 h-12 bg-accent text-accent-foreground font-black rounded-2xl text-sm hover:scale-[1.02] active:scale-95 transition-all"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

function Grid3X3({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
    </svg>
  );
}
