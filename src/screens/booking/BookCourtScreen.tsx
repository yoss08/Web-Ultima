import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Clock, Users, DollarSign, MapPin } from 'lucide-react';
import { Button } from '../../components/Button';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  price: number;
}

const mockTimeSlots: TimeSlot[] = [
  { id: 't1', time: '2:00 PM', available: true, price: 40 },
  { id: 't2', time: '3:00 PM', available: true, price: 40 },
  { id: 't3', time: '4:00 PM', available: false, price: 40 },
  { id: 't4', time: '5:00 PM', available: true, price: 45 },
  { id: 't5', time: '6:00 PM', available: true, price: 50 },
  { id: 't6', time: '7:00 PM', available: true, price: 50 },
  { id: 't7', time: '8:00 PM', available: false, price: 50 },
  { id: 't8', time: '9:00 PM', available: true, price: 45 },
];

const durations = [
  { id: '60', label: '1 hour', minutes: 60 },
  { id: '90', label: '1.5 hours', minutes: 90 },
  { id: '120', label: '2 hours', minutes: 120 },
];

const playerCounts = [2, 4];

export function BookCourtScreen() {
  const navigate = useNavigate();
  const { clubId } = useParams();
  const [searchParams] = useSearchParams();
  const courtId = searchParams.get('courtId');

  const [selectedDate, setSelectedDate] = useState('Today, Apr 7');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState('60');
  const [playerCount, setPlayerCount] = useState(4);

  const selectedSlot = mockTimeSlots.find(slot => slot.id === selectedTime);
  const selectedDurationData = durations.find(d => d.id === selectedDuration);
  
  const basePrice = selectedSlot?.price || 0;
  const totalPrice = basePrice * (selectedDurationData?.minutes || 60) / 60;

  const handleBooking = () => {
    // Navigate to confirmation or handle booking
    alert('Court booked successfully!');
    navigate(`/summa/club/${clubId}`);
  };

  return (
    <div className="h-screen w-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-border">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-card hover:bg-card/80 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl">Book a Court</h1>
            <p className="text-sm text-muted-foreground">Elite Padel Center</p>
          </div>
        </div>

        {/* Selected Court */}
        <div className="rounded-xl bg-card border border-[#39ff14]/30 p-4">
          <div className="flex items-center gap-2 text-[#39ff14] mb-1">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Court {courtId}</span>
          </div>
          <span className="text-sm text-muted-foreground">Indoor - Glass walls</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Date Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-[#39ff14]" />
            <h3>Select Date</h3>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['Today, Apr 7', 'Tue, Apr 8', 'Wed, Apr 9', 'Thu, Apr 10'].map((date) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`px-4 py-3 rounded-xl shrink-0 transition-all ${
                  selectedDate === date
                    ? 'bg-[#39ff14] text-[#0a0e1a]'
                    : 'bg-card border border-border text-foreground hover:border-[#39ff14]/50'
                }`}
              >
                <div className="text-sm whitespace-nowrap">{date}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Time Slot Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-[#39ff14]" />
            <h3>Select Time</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {mockTimeSlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => slot.available && setSelectedTime(slot.id)}
                disabled={!slot.available}
                className={`px-4 py-3 rounded-xl transition-all ${
                  selectedTime === slot.id
                    ? 'bg-[#39ff14] text-[#0a0e1a]'
                    : slot.available
                    ? 'bg-card border border-border text-foreground hover:border-[#39ff14]/50'
                    : 'bg-card/50 border border-border text-muted-foreground opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="text-sm">{slot.time}</div>
                <div className="text-xs mt-1">${slot.price}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Duration Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h3 className="mb-3">Duration</h3>
          <div className="flex gap-2">
            {durations.map((duration) => (
              <button
                key={duration.id}
                onClick={() => setSelectedDuration(duration.id)}
                className={`flex-1 px-4 py-3 rounded-xl transition-all ${
                  selectedDuration === duration.id
                    ? 'bg-[#39ff14] text-[#0a0e1a]'
                    : 'bg-card border border-border text-foreground hover:border-[#39ff14]/50'
                }`}
              >
                {duration.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Player Count */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-[#39ff14]" />
            <h3>Number of Players</h3>
          </div>
          <div className="flex gap-2">
            {playerCounts.map((count) => (
              <button
                key={count}
                onClick={() => setPlayerCount(count)}
                className={`flex-1 px-4 py-3 rounded-xl transition-all ${
                  playerCount === count
                    ? 'bg-[#39ff14] text-[#0a0e1a]'
                    : 'bg-card border border-border text-foreground hover:border-[#39ff14]/50'
                }`}
              >
                {count} players
              </button>
            ))}
          </div>
        </motion.div>

        {/* Price Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-gradient-to-br from-card to-card/50 border-2 border-[#39ff14]/30 p-6 shadow-[0_0_20px_rgba(57,255,20,0.15)] mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-[#39ff14]" />
            <h3>Price Summary</h3>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Court rental</span>
              <span>${basePrice}/hour</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Duration</span>
              <span>{selectedDurationData?.label || '-'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Players</span>
              <span>{playerCount} players</span>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex justify-between items-center">
            <span className="text-lg">Total</span>
            <span className="text-3xl text-[#39ff14]">${totalPrice.toFixed(0)}</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom CTA */}
      <div className="px-6 py-6 border-t border-border bg-background">
        <Button
          variant="summa"
          size="lg"
          fullWidth
          disabled={!selectedTime}
          onClick={handleBooking}
        >
          Book Court - ${totalPrice.toFixed(0)}
        </Button>
        <p className="text-center text-xs text-muted-foreground mt-3">
          You can cancel up to 2 hours before the booking
        </p>
      </div>
    </div>
  );
}
