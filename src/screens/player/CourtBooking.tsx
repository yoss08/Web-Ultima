import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Info, 
  CheckCircle2, 
  ChevronLeft,
  Construction,
  BellRing,
  Loader2
} from "lucide-react";
import { useAuth } from "../../services/AuthContext";
import { supabase } from "../../config/supabase";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";

// Types pour le typage TypeScript
interface Court {
  id: string;
  name: string;
  type: string;
  surface: string;
  image: string;
}

export function CourtBooking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // États de données
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  
  // États de sélection
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Récupération des terrains depuis Supabase
  useEffect(() => {
    async function fetchCourts() {
      try {
        const { data, error } = await supabase
          .from('courts')
          .select('*');
        
        if (error) throw error;
        setCourts(data || []);
      } catch (err) {
        console.error("Error fetching courts:", err);
        toast.error("Failed to load courts");
      } finally {
        setLoading(false);
      }
    }
    fetchCourts();
  }, []);

  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

  const handleConfirmBooking = async () => {
    if (!user) return toast.error("Please log in to book.");
    if (!selectedCourt || !selectedSlot) return toast.error("Please select a court and a time slot.");

    setBookingLoading(true);
    const toastId = toast.loading("Saving your booking...");

    try {
      const { error } = await supabase
        .from('bookings')
        .insert([{
          court_id: selectedCourt.id,
          user_id: user.id,
          booking_date: selectedDate,
          time_slot: selectedSlot,
          status: 'confirmed'
        }]);

      if (error) {
        if (error.code === '23505') throw new Error("This slot has just been taken!");
        throw error;
      }

      toast.success("Booking confirmed! See you on court.", { id: toastId });
      
      // Redirection vers l'historique ou le dashboard
      setTimeout(() => navigate("/dashboard/live-matches"), 1500);

    } catch (err: any) {
      toast.error(err.message || "An error occurred", { id: toastId });
    } finally {
      setBookingLoading(false);
    }
  };

  // État de chargement initial
  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#39FF14]" size={40} />
      </div>
    );
  }

  // ÉCRAN VIDE : Si aucun terrain n'est trouvé en base de données
  if (courts.length === 0) {
    return (
      <div className="p-8 max-w-7xl mx-auto h-[80vh] flex flex-col items-center justify-center text-center space-y-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center border border-yellow-500/20"
        >
          <Construction className="text-yellow-500" size={48} />
        </motion.div>
        <div className="max-w-md space-y-2">
          <h1 className="font-['Playfair_Display'] font-bold text-3xl dark:text-white">No Courts Available</h1>
          <p className="text-[#0A0E1A]/60 dark:text-white/60 font-['Poppins']">
            Our management team hasn't added any courts to the system yet. Please check back later or contact the administrator.
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-all dark:text-white"
          >
            Go Back
          </button>
          <button 
            onClick={() => toast.success("Notification alert set!")}
            className="px-6 py-3 bg-[#39FF14] text-black font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-all"
          >
            <BellRing size={18} /> Notify Me
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors dark:text-white"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="font-['Playfair_Display',serif] font-bold text-[36px] text-[#0A0E1A] dark:text-white leading-tight">
            Book a Court
          </h1>
          <p className="text-[#0A0E1A]/60 dark:text-white/60 font-['Poppins']">
            Secure your match in a few clicks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Selection */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. Date Picker */}
          <section className="bg-white dark:bg-white/5 p-6 rounded-[24px] border border-gray-200 dark:border-white/10 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
              <CalendarIcon size={20} className="text-[#39FF14]" /> 1. Select Date
            </h2>
            <input 
              type="date" 
              min={new Date().toISOString().split('T')[0]}
              className="w-full h-12 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#39FF14] transition-all dark:text-white"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </section>

          {/* 2. Slots */}
          <section className="bg-white dark:bg-white/5 p-6 rounded-[24px] border border-gray-200 dark:border-white/10 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
              <Clock size={20} className="text-[#39FF14]" /> 2. Choose Time Slot
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {timeSlots.map(slot => (
                <button 
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`h-12 rounded-xl border transition-all font-medium ${
                    selectedSlot === slot 
                    ? "bg-[#39FF14] border-[#39FF14] text-black shadow-lg shadow-[#39FF14]/20" 
                    : "border-gray-200 dark:border-white/10 hover:border-[#39FF14] dark:text-white"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </section>

          {/* 3. Court Selection */}
          <section className="bg-white dark:bg-white/5 p-6 rounded-[24px] border border-gray-200 dark:border-white/10 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
              <MapPin size={20} className="text-[#39FF14]" /> 3. Select Court
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courts.map(court => (
                <div 
                  key={court.id} 
                  onClick={() => setSelectedCourt(court)}
                  className={`relative group cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 ${
                    selectedCourt?.id === court.id 
                    ? "border-[#39FF14] ring-2 ring-[#39FF14]/20" 
                    : "border-gray-200 dark:border-white/10"
                  }`}
                >
                  <img src={court.image} alt={court.name} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-4 flex flex-col justify-end">
                    <div className="flex justify-between items-end">
                      <div>
                        <h3 className="text-white font-bold text-lg">{court.name}</h3>
                        <p className="text-white/70 text-sm">{court.type} • {court.surface}</p>
                      </div>
                      {selectedCourt?.id === court.id && (
                        <CheckCircle2 className="text-[#39FF14]" size={24} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Side: Summary Card */}
        <div className="lg:relative">
          <div className="bg-white dark:bg-white/5 p-8 rounded-[32px] border border-gray-200 dark:border-white/10 sticky top-24 shadow-xl">
            <h3 className="font-bold text-xl mb-6 dark:text-white font-['Playfair_Display']">Booking Summary</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-60 dark:text-white font-['Poppins']">Date</span>
                <span className="font-bold dark:text-white">{selectedDate}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-60 dark:text-white font-['Poppins']">Time</span>
                <span className={`font-bold ${selectedSlot ? "text-[#39FF14]" : "text-red-400"}`}>
                  {selectedSlot || "Required"}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-60 dark:text-white font-['Poppins']">Court</span>
                <span className="font-bold dark:text-white">{selectedCourt?.name || "Required"}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-60 dark:text-white font-['Poppins']">Price</span>
                <span className="font-bold dark:text-white">$25.00</span>
              </div>
              
              <hr className="border-gray-200 dark:border-white/10 mt-6" />
              
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-lg dark:text-white">Total</span>
                <span className="font-bold text-2xl text-[#39FF14]">$25.00</span>
              </div>
            </div>

            <button 
              onClick={handleConfirmBooking}
              disabled={!selectedSlot || !selectedCourt || bookingLoading}
              className="w-full h-14 bg-[#39FF14] disabled:bg-gray-500 disabled:cursor-not-allowed text-black font-bold rounded-xl shadow-lg shadow-[#39FF14]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {bookingLoading ? "Processing..." : "Confirm Booking"}
            </button>

            <div className="mt-6 p-4 bg-[#39FF14]/5 rounded-xl flex gap-3 items-start border border-[#39FF14]/10">
              <Info size={16} className="text-[#39FF14] shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#0A0E1A]/70 dark:text-white/60">
                By confirming, you agree to our club rules. Cancellations allowed up to 24h before the match.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}