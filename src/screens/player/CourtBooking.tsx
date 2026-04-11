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


interface Court {
  id: string;
  name: string;
  type: string;
  surface: string;
  image: string;
  status?: "available" | "occupied" | "maintenance";
}

interface Booking {
  id: string;
  court_id: string;
  user_id: string;
  booking_date: string;
  time_slot: string;
  status: "confirmed" | "cancelled" | "completed";
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
  { label: "1 hr", value: 1, slots: 1 },
  { label: "1.5 hrs", value: 1.5, slots: 1 },
  { label: "2 hrs", value: 2, slots: 2 },
];

const PRICE_PER_SLOT = 25;

const DISCOUNT_CODES: Record<string, number> = {
  ULTIMA10: 0.1,
  MEMBER20: 0.2,
};

const COURT_STATUS_CONFIG = {
  available: { label: "Available", color: "text-[#39FF14] bg-[#39FF14]/10" },
  occupied:  { label: "Occupied",  color: "text-orange-400 bg-orange-400/10" },
  maintenance:{ label: "Maintenance", color: "text-red-400 bg-red-400/10" },
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
    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

function SectionHeading({ step, title }: { step?: number | string; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      {step !== undefined && (
        <div className="w-10 h-10 bg-[#39FF14] rounded-xl flex items-center justify-center text-black font-black shrink-0">
          {step}
        </div>
      )}
      <h3 className="text-xl font-black dark:text-white uppercase tracking-tight">{title}</h3>
    </div>
  );
}


export function CourtBooking() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ── Tab state ──
  const [activeTab, setActiveTab] = useState<Tab>("book");

  // ── Data ──
  const [courts, setCourts] = useState<Court[]>([]);
  const [takenSlots, setTakenSlots] = useState<Set<string>>(new Set());
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [players, setPlayers] = useState<any[]>([]);
  const [playersLoading, setPlayersLoading] = useState(false);

  // ── Booking form ──
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [selectedOpponentId, setSelectedOpponentId] = useState<string | null>(null);
  const [duration, setDuration] = useState(1.5);
  const [playerCount, setPlayerCount] = useState(2);
  const [notes, setNotes] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [discountError, setDiscountError] = useState("");

  // ── My Bookings UI ──
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [qrBooking, setQrBooking] = useState<Booking | null>(null);

  // ── Computed ──
  const basePrice = PRICE_PER_SLOT * duration;
  const discount = basePrice * appliedDiscount;
  const totalPrice = basePrice - discount;

  

  useEffect(() => {
    async function fetchCourts() {
      try {
        const { data, error } = await supabase.from("courts").select("*");
        if (error) throw error;
        setCourts(data || []);
        if (data?.length) setSelectedCourt(data[0]);
      } catch {
        toast.error("Failed to load courts");
      } finally {
        setLoading(false);
      }
    }
    fetchCourts();

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

    // Real-time subscription for courts
    const courtSub = supabase
      .channel('courts_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'courts' }, () => {
         fetchCourts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(courtSub);
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

  const handleConfirmBooking = async () => {
    if (!user || !selectedCourt || !selectedSlot)
      return toast.error("Please select a court and time slot");

    if (selectedCourt.status === "maintenance")
      return toast.error("This court is under maintenance");

    setBookingLoading(true);
    try {
      const { data: bookingData, error: bookingError } = await supabase.from("bookings").insert([
        {
          court_id: selectedCourt.id,
          user_id: user.id,
          booking_date: selectedDate,
          time_slot: selectedSlot,
          status: "confirmed",
          duration,
          player_count: playerCount,
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

      toast.success("Spot secured! See you on the court. 🎾");
      setSelectedSlot(null);
      setNotes("");
      setDiscountCode("");
      setAppliedDiscount(0);
      setActiveTab("upcoming");
    } catch (err: any) {
      toast.error(err.message || "Booking failed");
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
        <Loader2 className="animate-spin text-[#39FF14] mb-4" size={40} />
        <p className="text-xs font-black uppercase tracking-[4px] opacity-40">Initializing Courts</p>
      </div>
    );
  }

  

  const today = new Date().toISOString().split("T")[0];
  const upcomingBookings = myBookings.filter(
    (b) => b.booking_date >= today && b.status === "confirmed"
  );
  const pastBookings = myBookings.filter(
    (b) => b.booking_date < today || b.status !== "confirmed"
  );



  return (
    <div className="max-w-[1400px] mx-auto pb-20 px-4 md:px-0">

      {/* ── HEADER ── */}
      <header className="mb-8">
        <div className="flex items-center gap-3 text-[#39FF14] font-black text-[10px] uppercase tracking-[4px] mb-3">
          <Zap size={14} fill="#39FF14" />
          <span>Ultima Reservation System</span>
        </div>
        <h2 className="font-['Playfair_Display',serif] text-4xl md:text-6xl font-black dark:text-white leading-none mb-4">
          Court Booking
          
        </h2>
        <p className="text-[#0A0E1A]/60 dark:text-white/60 font-['Poppins']">
          Reserve, track, and manage all your court sessions in one place.
        </p>
      </header>

      {/* ── TOP NAV TABS ── */}
      <nav className="flex gap-2 mb-10 p-1.5 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 w-fit">
        {(
          [
            { id: "book",     label: "Book a Court", icon: <LayoutGrid size={15} /> },
            { id: "upcoming", label: "Upcoming",     icon: <CalendarDays size={15} /> },
            { id: "history",  label: "History",      icon: <History size={15} /> },
          ] as { id: Tab; label: string; icon: React.ReactNode }[]
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${
              activeTab === tab.id
                ? "bg-[#39FF14] text-black shadow-lg shadow-[#39FF14]/20"
                : "dark:text-white/50 hover:text-white"
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.id === "upcoming" && upcomingBookings.length > 0 && (
              <span className={`ml-1 w-5 h-5 rounded-full text-[9px] flex items-center justify-center font-black ${
                activeTab === "upcoming" ? "bg-black text-[#39FF14]" : "bg-[#39FF14] text-black"
              }`}>
                {upcomingBookings.length}
              </span>
            )}
          </button>
        ))}
      </nav>

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

                {/* ── 1. Court Selection ── */}
                <section>
                  <SectionHeading step={1} title="Select Surface" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courts.map((court) => (
                      <button
                        key={court.id}
                        disabled={court.status === "maintenance"}
                        onClick={() => setSelectedCourt(court)}
                        className={`relative overflow-hidden rounded-[32px] p-6 text-left transition-all duration-500 border-2 ${
                          court.status === "maintenance"
                            ? "opacity-40 grayscale cursor-not-allowed border-gray-200 dark:border-white/5"
                            : selectedCourt?.id === court.id
                            ? "border-[#39FF14] bg-[#39FF14]/5 ring-4 ring-[#39FF14]/10"
                            : "border-gray-100 dark:border-white/5 bg-white dark:bg-white/5 hover:border-[#39FF14]/40"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h4 className="text-xl font-black dark:text-white uppercase leading-none mb-2">
                              {court.name}
                            </h4>
                            <span className="text-[10px] font-bold text-[#39FF14] uppercase tracking-widest">
                              {court.surface}
                            </span>
                          </div>
                          {selectedCourt?.id === court.id && (
                            <CheckCircle2 className="text-[#39FF14]" size={24} />
                          )}
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex items-center gap-4 opacity-60 text-xs font-bold dark:text-white">
                            <span className="flex items-center gap-1.5"><MapPin size={14} /> Indoor</span>
                            <span className="flex items-center gap-1.5"><ShieldCheck size={14} /> Official Grade</span>
                          </div>
                          <StatusBadge status={court.status ?? "available"} />
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                {/* ── 2. Date & Time ── */}
                <section>
                  <SectionHeading step={2} title="Pick Your Time" />
                  <div className="bg-white dark:bg-white/5 rounded-[40px] p-8 border border-gray-100 dark:border-white/10">
                    <div className="flex flex-col md:flex-row gap-8">
                      {/* Date picker */}
                      <div className="md:w-1/3 space-y-4">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-3 block">
                            Choose Date
                          </label>
                          <input
                            type="date"
                            value={selectedDate}
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full h-14 px-6 bg-gray-100 dark:bg-black/40 rounded-2xl border-none outline-none font-black text-sm dark:text-white focus:ring-2 ring-[#39FF14]/50 transition-all"
                          />
                        </div>

                        {/* Duration selector */}
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
                                    ? "bg-[#39FF14] border-[#39FF14] text-black"
                                    : "bg-transparent border-gray-200 dark:border-white/10 dark:text-white/60 hover:border-[#39FF14]"
                                }`}
                              >
                                {d.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Player count */}
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-3 block">
                            Players
                          </label>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setPlayerCount((p) => Math.max(1, p - 1))}
                              className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/10 font-black dark:text-white hover:bg-[#39FF14] hover:text-black transition-all"
                            >
                              −
                            </button>
                            <span className="text-2xl font-black dark:text-white w-8 text-center">
                              {playerCount}
                            </span>
                            <button
                              onClick={() => setPlayerCount((p) => Math.min(4, p + 1))}
                              className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/10 font-black dark:text-white hover:bg-[#39FF14] hover:text-black transition-all"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Time slots */}
                      <div className="md:w-2/3">
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-[10px] font-black uppercase tracking-widest opacity-40">
                            Available Slots
                          </label>
                          {slotsLoading && (
                            <Loader2 className="animate-spin text-[#39FF14]" size={14} />
                          )}
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
                                    ? "bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/5 text-gray-300 dark:text-white/20 cursor-not-allowed line-through"
                                    : isSelected
                                    ? "bg-[#39FF14] border-[#39FF14] text-black shadow-lg shadow-[#39FF14]/20 scale-105"
                                    : "bg-transparent border-gray-200 dark:border-white/10 dark:text-white/60 hover:border-[#39FF14]"
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

                        <div className="flex items-center gap-4 mt-4 text-[10px] font-bold opacity-40 dark:text-white">
                          <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded bg-[#39FF14]" /> Selected
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

                {/* ── 3. Details & Extras ── */}
                <section>
                  <SectionHeading step={3} title="Details & Extras" />
                  <div className="bg-white dark:bg-white/5 rounded-[40px] p-8 border border-gray-100 dark:border-white/10 space-y-6">
                    {/* Notes */}
                    <div>
                      <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 mb-3">
                        <FileText size={12} /> Notes / Equipment Requests
                      </label>
                      <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Need ball machine, extra rackets, specific court side..."
                        className="w-full px-5 py-4 bg-gray-100 dark:bg-black/40 rounded-2xl border-none outline-none font-medium text-sm dark:text-white focus:ring-2 ring-[#39FF14]/50 transition-all resize-none placeholder:opacity-30"
                      />
                    </div>

                    {/* Discount */}
                    <div>
                      <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 mb-3">
                        <Tag size={12} /> Discount / Membership Code
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={discountCode}
                          onChange={(e) => {
                            setDiscountCode(e.target.value);
                            setDiscountError("");
                          }}
                          placeholder="Enter code"
                          className="flex-1 h-12 px-5 bg-gray-100 dark:bg-black/40 rounded-2xl border-none outline-none font-black text-sm dark:text-white focus:ring-2 ring-[#39FF14]/50 transition-all placeholder:font-medium placeholder:opacity-30"
                        />
                        <button
                          onClick={handleApplyDiscount}
                          className="px-6 h-12 bg-[#39FF14] text-black font-black rounded-2xl text-[11px] uppercase tracking-wider hover:scale-105 active:scale-95 transition-all"
                        >
                          Apply
                        </button>
                      </div>
                      {discountError && (
                        <p className="mt-2 text-xs text-red-400 font-bold">{discountError}</p>
                      )}
                      {appliedDiscount > 0 && (
                        <p className="mt-2 text-xs text-[#39FF14] font-bold">
                          ✓ {appliedDiscount * 100}% discount applied
                        </p>
                      )}
                    </div>

                    {/* ── Opponent Selection (Match Logic) ── */}
                    <div className="pt-6 border-t border-gray-100 dark:border-white/5">
                      <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 mb-4">
                        <Users size={14} /> Who are you playing against? (Optional)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                        {playersLoading ? (
                          <div className="col-span-2 py-8 flex items-center justify-center">
                            <Loader2 className="animate-spin text-[#39FF14]" size={24} />
                          </div>
                        ) : (
                          players.map(player => (
                            <button
                              key={player.id}
                              onClick={() => setSelectedOpponentId(selectedOpponentId === player.id ? null : player.id)}
                              className={`flex items-center gap-3 p-4 rounded-[20px] border transition-all duration-300 text-left ${
                                selectedOpponentId === player.id
                                  ? "bg-[#39FF14] border-[#39FF14] text-black shadow-lg shadow-[#39FF14]/20 scale-[0.98]"
                                  : "bg-gray-100 dark:bg-white/5 border-transparent dark:text-white hover:border-[#39FF14]/40 hover:bg-white dark:hover:bg-white/10"
                              }`}
                            >
                              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden shrink-0 border-2 border-white/10">
                                <img 
                                  src={player.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.full_name}`} 
                                  alt="" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-xs font-black truncate leading-none mb-1">{player.full_name}</span>
                                <span className={`text-[9px] font-bold uppercase tracking-widest ${selectedOpponentId === player.id ? 'text-black/60' : 'opacity-40'}`}>
                                  Player Profile
                                </span>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* RIGHT: Summary */}
              <div className="lg:col-span-4">
                <div className="sticky top-24 space-y-6">
                  <div className="dark:bg-[#0F1423] rounded-[40px] p-8 dark:text-white border border-white/5 bg-white shadow-2xl">
                    <h3 className="text-2xl font-black mb-8 tracking-tighter">SUMMARY</h3>

                    <div className="space-y-5 mb-8">
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
                        value={`${duration} hr${duration !== 1 ? "s" : ""}`}
                      />
                      <SummaryRow
                        icon={<Users size={18} />}
                        label="Players"
                        value={`${playerCount}`}
                      />

                      <div className="h-[1px] bg-gray-100 dark:bg-white/10 w-full" />

                      {/* Price breakdown */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-400 dark:text-white/40">
                          <span className="text-[11px] font-bold uppercase tracking-widest">Base</span>
                          <span className="font-bold">${basePrice.toFixed(2)}</span>
                        </div>
                        {appliedDiscount > 0 && (
                          <div className="flex justify-between text-[#39FF14]">
                            <span className="text-[11px] font-bold uppercase tracking-widest">
                              Discount ({appliedDiscount * 100}%)
                            </span>
                            <span className="font-bold">−${discount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-end pt-2">
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                            Total
                          </span>
                          <span className="text-4xl font-black text-[#39FF14] tracking-tighter">
                            ${totalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleConfirmBooking}
                      disabled={!selectedSlot || !selectedCourt || bookingLoading || selectedCourt?.status === "maintenance"}
                      className="w-full h-16 bg-[#39FF14] text-black font-black rounded-2xl shadow-xl shadow-[#39FF14]/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-20 disabled:grayscale disabled:scale-100 disabled:cursor-not-allowed"
                    >
                      {bookingLoading ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <>
                          <span>CONFIRM BOOKING</span>
                          <ChevronRight size={20} />
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-6 bg-[#39FF14]/5 border border-[#39FF14]/10 rounded-[24px] flex gap-4">
                    <Info className="text-[#39FF14] shrink-0 mt-0.5" size={18} />
                    <p className="text-[11px] font-medium leading-relaxed dark:text-white/60">
                      Cancellations must be made at least 24 hours in advance for a full refund to your Ultima wallet.
                    </p>
                  </div>
                </div>
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
                icon={<CalendarX size={40} className="text-[#39FF14]" />}
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
                    className="bg-white dark:bg-white/5 rounded-[32px] p-7 border border-gray-100 dark:border-white/10 flex flex-col md:flex-row md:items-center gap-6"
                  >
                    {/* Color accent */}
                    <div className="w-2 h-full min-h-[60px] bg-[#39FF14] rounded-full shrink-0 hidden md:block" />

                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-1">Court</p>
                        <p className="font-black dark:text-white text-sm">{booking.courts?.name || "—"}</p>
                        <p className="text-[10px] text-[#39FF14] font-bold uppercase">{booking.courts?.surface}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-1">Date</p>
                        <p className="font-black dark:text-white text-sm">{formatDate(booking.booking_date)}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-1">Time</p>
                        <p className="font-black dark:text-white text-sm">{booking.time_slot}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-1">Starts in</p>
                        {countdown ? (
                          <p className="font-black text-[#39FF14] text-sm">{countdown}</p>
                        ) : (
                          <p className="font-black text-orange-400 text-sm">Starting soon</p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => setQrBooking(booking)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-white/10 rounded-xl text-[11px] font-black dark:text-white hover:bg-[#39FF14] hover:text-black transition-all"
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
                icon={<History size={40} className="text-[#39FF14]" />}
                title="No booking history"
                message="Your completed and cancelled bookings will appear here."
              />
            ) : (
              pastBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white dark:bg-white/5 rounded-[32px] p-7 border border-gray-100 dark:border-white/10 flex flex-col md:flex-row md:items-center gap-6 opacity-80 hover:opacity-100 transition-opacity"
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
                      <p className="font-black dark:text-white text-sm">{booking.time_slot}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-1">Result</p>
                      <p className={`font-black text-sm ${
                        booking.result === "Win" ? "text-[#39FF14]" :
                        booking.result === "Loss" ? "text-red-400" :
                        "dark:text-white/40"
                      }`}>
                        {booking.result || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-1">Status</p>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        booking.status === "cancelled"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-[#39FF14]/10 text-[#39FF14]"
                      }`}>
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
              className="bg-white dark:bg-[#0F1423] rounded-[40px] p-10 max-w-sm w-full text-center border border-white/10 shadow-2xl"
            >
              <div className="flex items-center gap-2 text-[#39FF14] font-black text-[10px] uppercase tracking-[4px] mb-5 justify-center">
                <Zap size={12} fill="#39FF14" />
                Check-in QR Code
              </div>
              <h3 className="text-2xl font-black dark:text-white mb-1">{qrBooking.courts?.name}</h3>
              <p className="text-sm dark:text-white/40 font-medium mb-8">
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
              <p className="text-[10px] font-bold dark:text-white/30 uppercase tracking-widest mb-6">
                Present this at the ALMUS kiosk
              </p>
              <button
                onClick={() => setQrBooking(null)}
                className="w-full h-12 bg-[#39FF14] text-black font-black rounded-2xl text-sm hover:scale-[1.02] active:scale-95 transition-all"
              >
                Close
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
      <span className={`text-sm font-black ${accent ? "text-[#39FF14]" : "dark:text-white"}`}>
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
          className="px-8 h-12 bg-[#39FF14] text-black font-black rounded-2xl text-sm hover:scale-[1.02] active:scale-95 transition-all"
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