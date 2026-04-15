import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Calendar, TrendingUp, Plus, ArrowRight, Video, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "../../services/AuthContext";
import { coachService } from "../../services/CoachService";

export function CoachDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // États pour les données réelles
  const [stats, setStats] = useState({
    studentCount: 0,
    upcomingSessions: 0,
    performanceAvg: "0.0"
  });

  useEffect(() => {
    async function loadStats() {
      if (user?.id) {
        try {
          setLoading(true);
          const data = await coachService.getStats(user.id);
          setStats(data);
        } catch (error) {
          console.error("Error loading coach stats:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    loadStats();
  }, [user]);

  // Extraction du prénom du coach
  const coachName = user?.user_metadata?.full_name?.split(' ')[0] || "Coach";

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome Message Dynamique - Identique aux specs du PDF */}
      <div>
        <h1 className="font-['Playfair_Display'] font-bold text-2xl md:text-4xl dark:text-white mb-2 leading-tight">
          Welcome, Coach {coachName}!
        </h1>
        <p className="text-gray-500 font-['Poppins'] text-sm">
          Here's an overview of your coaching activity and student progress.
        </p>
      </div>

      {/* Quick Overview Cards - Données réelles (vides pour l'instant) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-white/5 p-6 rounded-[28px] border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-[#39FF14]/10 rounded-2xl flex items-center justify-center mb-4">
            <Users className="text-[#39FF14]" size={24} />
          </div>
          <h3 className="text-3xl font-bold dark:text-white">{loading ? "..." : stats.studentCount}</h3>
          <p className="text-sm text-gray-400 font-medium">Total Students</p>
        </div>

        <div className="bg-white dark:bg-white/5 p-6 rounded-[28px] border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-400/10 rounded-2xl flex items-center justify-center mb-4">
            <Calendar className="text-blue-400" size={24} />
          </div>
          <h3 className="text-3xl font-bold dark:text-white">{loading ? "..." : stats.upcomingSessions}</h3>
          <p className="text-sm text-gray-400 font-medium">Sessions Today</p>
        </div>

        <div className="bg-white dark:bg-white/5 p-6 rounded-[28px] border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-400/10 rounded-2xl flex items-center justify-center mb-4">
            <TrendingUp className="text-purple-400" size={24} />
          </div>
          <h3 className="text-3xl font-bold dark:text-white">{loading ? "..." : `${stats.performanceAvg}/5`}</h3>
          <p className="text-sm text-gray-400 font-medium">Session Rating Avg.</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold dark:text-white px-1">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            to="/dashboard/coach/schedule" 
            className="flex items-center gap-3 px-6 h-14 bg-[#00E5FF] text-black rounded-[18px] font-bold shadow-lg shadow-[#00E5FF]/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={20} /> Schedule Session
          </Link>
          
          <Link 
            to="/dashboard/coach/students" 
            className="flex items-center gap-3 px-6 h-14 bg-white dark:bg-white/5 dark:text-white border border-gray-200 dark:border-white/10 rounded-[18px] font-bold hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
          >
            <Users size={20} /> Manage Students
          </Link>

          <Link 
            to="/dashboard/coach/video-review" 
            className="flex items-center gap-3 px-6 h-14 bg-white dark:bg-white/5 dark:text-white border border-gray-200 dark:border-white/10 rounded-[18px] font-bold hover:bg-gray-50 dark:hover:bg-white/10 transition-all font-['Poppins']"
          >
            <Video size={20} className="text-red-400" /> Video Review
          </Link>

          <Link 
            to="/dashboard/coach/ai-analysis" 
            className="flex items-center gap-3 px-6 h-14 bg-white dark:bg-white/5 dark:text-white border border-gray-200 dark:border-white/10 rounded-[18px] font-bold hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-sm"
          >
            <Sparkles size={20} className="text-purple-400" /> AI Insights
          </Link>
        </div>
      </div>

      {/* Placeholder for Recent Activity */}
      <div className="bg-gray-50 dark:bg-black/20 border border-dashed border-gray-200 dark:border-white/10 rounded-[32px] p-8 md:p-12 text-center">
        <p className="text-gray-500 font-medium">
          Your recent activities and pending student requests will appear here.
        </p>
      </div>
      {/* Empty State / Get Started Tip */}
      {!loading && stats.studentCount === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-50 dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[32px] p-8 md:p-12 text-center"
        >
          <div className="w-16 h-16 bg-purple-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Plus className="text-purple-400" size={32} />
          </div>
          <h3 className="text-xl font-bold dark:text-white mb-2">Ready to start coaching?</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-8 text-sm">
            You don't have any students assigned yet. Contact the club administrator to link players to your profile or schedule your first open clinic.
          </p>
          <Link 
            to="/dashboard/coach/schedule" 
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#00E5FF] text-black font-bold rounded-xl hover:scale-105 transition-all"
          >
            Create Your First Session <ArrowRight size={18} />
          </Link>
        </motion.div>
      )}
    </div>
  );
}