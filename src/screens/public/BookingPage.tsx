import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Search, MapPin, Star, ChevronRight, 
  Calendar, Clock, Users, CreditCard, Wallet, 
  CheckCircle2, Info, ArrowRight
} from 'lucide-react';

// Reusing User Provided Mock Data
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
  },
];

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];

type Step = 'club' | 'details' | 'form' | 'payment' | 'confirmation';

export function BookingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('club');
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    duration: '60',
    players: '4',
  });
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');

  const handleClubSelect = (club: Club) => {
    setSelectedClub(club);
    setStep('details');
  };

  const handleBookingDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('form');
  };

  const handleUserDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePayment = () => {
    setStep('confirmation');
  };

  const renderStep = () => {
    switch (step) {
      case 'club':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold text-white">Choose a Club</h2>
              <p className="text-white/60">Select your preferred padel center to start booking.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockClubs.map((club) => (
                <div 
                  key={club.id}
                  onClick={() => club.isOpen && handleClubSelect(club)}
                  className={`group relative rounded-2xl overflow-hidden bg-[#0D121F] border border-white/10 hover:border-[#39FF14]/50 transition-all cursor-pointer ${!club.isOpen ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                >
                  <div className="h-48 overflow-hidden">
                    <img src={club.image} alt={club.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-white">{club.name}</h3>
                        <div className="flex items-center gap-1 text-white/60 text-sm">
                          <MapPin size={14} />
                          <span>{club.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-[#39FF14]/10 text-[#39FF14] px-2 py-1 rounded-lg text-sm font-bold">
                        <Star size={14} fill="#39FF14" />
                        <span>{club.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {club.tags.map(tag => (
                        <span key={tag} className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md bg-white/5 text-white/40 border border-white/10">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="pt-2 flex justify-between items-center text-sm border-t border-white/5">
                      <span className="text-white/40">{club.distance} km away</span>
                      <span className="text-[#39FF14] font-bold">{club.courtsCount} Courts Available</span>
                    </div>
                  </div>
                  {!club.isOpen && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      Currently Closed
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'details':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-xl mx-auto space-y-8"
          >
            <button onClick={() => setStep('club')} className="flex items-center gap-2 text-white/60 hover:text-[#39FF14] transition-colors">
              <ArrowLeft size={18} />
              <span>Back to clubs</span>
            </button>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white">Booking Details</h2>
              <p className="text-white/60">Pick your time and duration at <span className="text-[#39FF14]">{selectedClub?.name}</span></p>
            </div>

            <form onSubmit={handleBookingDetails} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Select Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                    <input 
                      type="date" 
                      required
                      value={bookingData.date}
                      onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-white focus:border-[#39FF14] outline-none transition-colors"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Select Time</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                    <select 
                      required
                      value={bookingData.time}
                      onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-white focus:border-[#39FF14] outline-none transition-colors appearance-none"
                    >
                      <option value="" disabled className="bg-[#0D121F]">Choose time</option>
                      {timeSlots.map(t => <option key={t} value={t} className="bg-[#0D121F]">{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Duration</label>
                  <div className="flex gap-2">
                    {['60', '90', '120'].map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setBookingData({...bookingData, duration: d})}
                        className={`flex-1 py-3 rounded-xl border transition-all ${bookingData.duration === d ? 'bg-[#39FF14] border-[#39FF14] text-black font-bold' : 'bg-white/5 border-white/10 text-white hover:border-[#39FF14]/50'}`}
                      >
                        {d} min
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Players</label>
                  <div className="flex gap-2">
                    {['2', '4'].map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setBookingData({...bookingData, players: p})}
                        className={`flex-1 py-3 rounded-xl border transition-all ${bookingData.players === p ? 'bg-[#39FF14] border-[#39FF14] text-black font-bold' : 'bg-white/5 border-white/10 text-white hover:border-[#39FF14]/50'}`}
                      >
                        {p} Players
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-white/60">Estimated Total</span>
                  <span className="text-3xl font-bold text-[#39FF14]">${(Number(bookingData.duration) / 60) * 40}</span>
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 rounded-xl bg-[#39FF14] text-black font-bold text-lg hover:scale-[1.02] transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                  Continue to Personal Details
                  <ArrowRight size={20} />
                </button>
              </div>
            </form>
          </motion.div>
        );

      case 'form':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-md mx-auto space-y-8"
          >
            <button onClick={() => setStep('details')} className="flex items-center gap-2 text-white/60 hover:text-[#39FF14] transition-colors">
              <ArrowLeft size={18} />
              <span>Back to booking info</span>
            </button>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white">Your Details</h2>
              <p className="text-white/60">Please provide your contact information to finalize the booking.</p>
            </div>

            <form onSubmit={handleUserDetails} className="space-y-4">
               <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="John Doe"
                  value={userDetails.name}
                  onChange={(e) => setUserDetails({...userDetails, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#39FF14] outline-none transition-colors"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="john@example.com"
                  value={userDetails.email}
                  onChange={(e) => setUserDetails({...userDetails, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#39FF14] outline-none transition-colors"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  placeholder="+216 -- --- ---"
                  value={userDetails.phone}
                  onChange={(e) => setUserDetails({...userDetails, phone: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#39FF14] outline-none transition-colors"
                />
              </div>

              <div className="pt-6">
                 <button 
                  type="submit"
                  className="w-full py-4 rounded-xl bg-[#39FF14] text-black font-bold text-lg hover:scale-[1.02] transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                  Continue to Payment
                  <ArrowRight size={20} />
                </button>
              </div>
            </form>
          </motion.div>
        );

      case 'payment':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-md mx-auto space-y-8"
          >
            <button onClick={() => setStep('form')} className="flex items-center gap-2 text-white/60 hover:text-[#39FF14] transition-colors">
              <ArrowLeft size={18} />
              <span>Back to details</span>
            </button>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white">Payment Method</h2>
              <p className="text-white/60">Choose how you'd like to pay for your session.</p>
            </div>

            <div className="space-y-4">
              <div 
                onClick={() => setPaymentMethod('cash')}
                className={`p-6 rounded-2xl border cursor-pointer transition-all flex items-center gap-4 ${paymentMethod === 'cash' ? 'bg-[#39FF14]/10 border-[#39FF14]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${paymentMethod === 'cash' ? 'bg-[#39FF14] text-black' : 'bg-white/10 text-white/40'}`}>
                  <Wallet size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg">Cash (In Club)</h3>
                  <p className="text-white/40 text-sm">Pay directly at the reception desk.</p>
                </div>
                {paymentMethod === 'cash' && <div className="w-6 h-6 rounded-full bg-[#39FF14] flex items-center justify-center"><CheckCircle2 size={16} color="black" /></div>}
              </div>

              <div 
                onClick={() => setPaymentMethod('card')}
                className={`p-6 rounded-2xl border cursor-pointer transition-all flex items-center gap-4 ${paymentMethod === 'card' ? 'bg-[#39FF14]/10 border-[#39FF14]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${paymentMethod === 'card' ? 'bg-[#39FF14] text-black' : 'bg-white/10 text-white/40'}`}>
                  <CreditCard size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg">Online Payment</h3>
                  <p className="text-white/40 text-sm">Pay securely with Credit / Debit Card.</p>
                </div>
                {paymentMethod === 'card' && <div className="w-6 h-6 rounded-full bg-[#39FF14] flex items-center justify-center"><CheckCircle2 size={16} color="black" /></div>}
              </div>
            </div>

            <div className="pt-6">
                 <button 
                  onClick={handlePayment}
                  className="w-full py-4 rounded-xl bg-[#39FF14] text-black font-bold text-lg hover:scale-[1.02] transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                  Confirm Booking
                  <CheckCircle2 size={20} />
                </button>
            </div>
          </motion.div>
        );

      case 'confirmation':
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center space-y-6 py-12"
          >
            <div className="w-24 h-24 rounded-full bg-[#39FF14] flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(57,255,20,0.3)]">
              <CheckCircle2 size={48} color="black" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-white">Booking Confirmed!</h2>
              <p className="text-white/60">Your court at <span className="text-[#39FF14]">{selectedClub?.name}</span> is ready.</p>
            </div>

            <div className="bg-[#0D121F] border border-white/10 rounded-2xl p-6 text-left space-y-4 shadow-xl">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/40 uppercase tracking-widest font-bold">Ref Number</span>
                <span className="text-white font-mono">#ULT-9942</span>
              </div>
              
              <div className="space-y-1">
                <p className="text-white/40 text-xs">DateTime</p>
                <p className="text-white font-medium">{bookingData.date} @ {bookingData.time}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-white/40 text-xs">Duration</p>
                  <p className="text-white font-medium">{bookingData.duration} Minutes</p>
                </div>
                <div className="space-y-1">
                  <p className="text-white/40 text-xs">Payment</p>
                  <p className="text-white font-medium capitalize">{paymentMethod}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <button 
                onClick={() => navigate('/')}
                className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors"
              >
                Back to Home
              </button>
              <div className="flex items-center justify-center gap-2 text-white/40 text-sm">
                <Info size={14} />
                <span>A confirmation email has been sent.</span>
              </div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#060910] text-white pt-32 pb-20 px-4">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#39FF14]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-[1096px] mx-auto relative z-10">
        {/* Progress Bar */}
        {step !== 'confirmation' && (
          <div className="hidden md:flex justify-between items-center mb-16 px-12 relative">
             <div className="absolute top-1/2 left-0 w-full h-px bg-white/10 -translate-y-1/2" />
             <div 
              className="absolute top-1/2 left-0 h-[2px] bg-[#39FF14] -translate-y-1/2 transition-all duration-500" 
              style={{ width: `${(step === 'club' ? 0 : step === 'details' ? 33 : step === 'form' ? 66 : 100)}%` }}
             />
             
             {[
               { id: 'club', label: 'Select Club' },
               { id: 'details', label: 'Book Time' },
               { id: 'form', label: 'Details' },
               { id: 'payment', label: 'Payment' }
             ].map((s, idx) => (
               <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
                 <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                   step === s.id ? 'bg-black border-[#39FF14] text-[#39FF14] scale-125' : 
                   (idx < ['club', 'details', 'form', 'payment'].indexOf(step) ? 'bg-[#39FF14] border-[#39FF14] text-black' : 'bg-[#060910] border-white/20 text-white/40')
                 }`}>
                   {idx + 1}
                 </div>
                 <span className={`text-[10px] uppercase tracking-widest font-bold transition-colors duration-300 ${step === s.id ? 'text-[#39FF14]' : 'text-white/40'}`}>
                   {s.label}
                 </span>
               </div>
             ))}
          </div>
        )}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>
    </div>
  );
}
