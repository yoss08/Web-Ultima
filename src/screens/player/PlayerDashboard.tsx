import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { PlayerSchedule } from "./PlayerSchedule";
import { 
  Calendar, 
  Trophy, 
  Activity, 
  Plus, 
  ArrowRight, 
  Droplet, 
  TrendingUp,
  Clock
} from "lucide-react";
import { Link } from "react-router";
import { supabase } from "../../config/supabase";
import { useAuth } from "../../services/AuthContext";

export function PlayerDashboard() {
  const { user } = useAuth();
  const [hasData, setHasData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [assignedCoach, setAssignedCoach] = useState<any>(null);
if (!user) return;
useEffect(() => {
  async function getMyCoach() {
    const { data } = await supabase
      .from('profiles')
      .select('coach_id')
      .eq('id', user?.id)
      .single();

    if (data?.coach_id) {
      const { data: coach } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', data.coach_id)
        .single();
      setAssignedCoach(coach);
    }
  }
  getMyCoach();
}, [user]);

  useEffect(() => {
    async function checkActivity() {
      if (!user) return;
      // Vérifier s'il existe au moins une réservation
      const { count } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      setHasData(!!count && count > 0);
      setLoading(false);
    }
    checkActivity();
  }, [user]);
  
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Playfair_Display'] font-bold text-3xl dark:text-white">
            Hello, {user?.user_metadata?.full_name?.split(' ')[0] || "Player"}! 👋
          </h1>
          <p className="text-[#0A0E1A]/60 dark:text-white/60 font-['Poppins']">
            Ready for your next match? Here's your activity overview.
          </p>
        </div>
        <Link 
          to="/dashboard/courts"
          className="bg-[#39FF14] text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-[#39FF14]/20 w-fit"
        >
          <Plus size={20} /> Book a Court
        </Link>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stats Cards & Progress */}
        <div className="lg:col-span-2 space-y-8">
         
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard icon={Trophy} label="Wins" value={hasData ? "0" : "--"} color="#39FF14" />
            <StatCard icon={Activity} label="Matches" value={hasData ? "0" : "--"} color="#00E5FF" />
            <StatCard icon={TrendingUp} label="Rank" value="Newbie" color="#FFD700" />
          </div>

          {/* Performance Placeholder or Data */}
          <section className="bg-white dark:bg-white/5 p-8 rounded-[32px] border border-gray-200 dark:border-white/10 min-h-[300px] flex flex-col justify-center items-center text-center">
            {!hasData ? (
              <div className="max-w-md space-y-4">
                <div className="w-16 h-16 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="text-gray-400" size={32} />
                </div>
                <h3 className="text-xl font-bold">No Performance Data Yet</h3>
                <p className="text-sm opacity-60">
                  Complete your first match to start tracking your win rate and skill progression.
                </p>
                <Link to="/dashboard/courts" className="text-[#39FF14] font-bold text-sm inline-flex items-center gap-2 hover:underline">
                  Find a court nearby <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <p>Your charts will appear here...</p>
            )}
          </section>
        </div>
         <PlayerSchedule />
        {/* Right Column: Quick Access & Shared Pages */}
        <div className="space-y-6">
          {assignedCoach && (
  <div className="bg-gradient-to-br from-[#39FF14]/20 to-transparent p-6 rounded-[32px] border border-[#39FF14]/30 mb-6">
    <p className="text-[10px] uppercase tracking-widest font-bold text-[#39FF14] mb-2">Your Assigned Coach</p>
    <div className="flex items-center gap-3">
       <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold text-white">
         {assignedCoach.full_name[0]}
       </div>
       <h4 className="text-lg font-bold text-white">Coach {assignedCoach.full_name}</h4>
    </div>
  </div>
)}
          {/* Next Booking Card (Adaptive State) */}
         <div className="bg-white dark:bg-[#0A0E1A] text-[#0A0E1A] dark:text-white p-8 rounded-[32px] border border-gray-100 dark:border-white/5 overflow-hidden relative group transition-colors duration-300">
          <div className="relative z-10">
           <h3 className="font-bold text-lg mb-2">Next Booking</h3>
             <p className="text-[#0A0E1A]/40 dark:text-white/40 text-sm mb-6">
               You have no upcoming matches.
            </p>
               <Link 
                 to="/dashboard/courts"
                 className="w-full py-3 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 border border-gray-200 dark:border-white/10 rounded-xl flex items-center justify-center gap-2 transition-all font-semibold"
                 >
                 Schedule Now
               </Link>
           </div>
           {/* L'icône change aussi d'opacité selon le mode */}
            <Calendar className="absolute -bottom-4 -right-4 text-black/[0.03] dark:text-white/5 w-32 h-32 group-hover:scale-110 transition-transform" />
         </div>

          {/* Quick Links to Shared Pages */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider opacity-50 px-2">Quick Access</h4>
            <SharedPageLink to="/dashboard/hydration" icon={Droplet} label="Water Tracker" color="#00E5FF" />
            <SharedPageLink to="/dashboard/profile" icon={Plus} label="Complete Profile" color="#39FF14" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components
function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="bg-white dark:bg-white/5 p-6 rounded-[24px] border border-gray-200 dark:border-white/10">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}15` }}>
          <Icon size={18} style={{ color }} />
        </div>
        <span className="text-sm opacity-60 font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function SharedPageLink({ to, icon: Icon, label, color }: any) {
  return (
    <Link to={to} className="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-[#39FF14] transition-all group">
      <div className="flex items-center gap-3">
        <Icon size={20} style={{ color }} />
        <span className="font-medium">{label}</span>
      </div>
      <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
    </Link>
  );
}