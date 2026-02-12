import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Calendar, TrendingUp, Plus, ArrowRight, Video } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "../../services/AuthContext";

export function CoachDashboard() {
  const { user } = useAuth();
  
  // États pour les données réelles (initialisés à 0 car pas encore de données en base)
  const [stats, setStats] = useState({
    studentCount: 0,
    upcomingSessions: 0,
    performanceAvg: 0
  });

  // Extraction du prénom du coach
  const coachName = user?.user_metadata?.full_name?.split(' ')[0] || "Coach";

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome Message Dynamique - Identique aux specs du PDF */}
      <div>
        <h1 className="font-['Playfair_Display'] font-bold text-4xl dark:text-white mb-2">
          Welcome, Coach {coachName}!
        </h1>
        <p className="text-gray-500 font-['Poppins'] text-sm">
          Here's an overview of your coaching activity and student progress.
        </p>
      </div>

      {/* Quick Overview Cards - Données réelles (vides pour l'instant) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-white/5 p-6 rounded-[28px] border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-[#39FF14]/10 rounded-2xl flex items-center justify-center mb-4">
            <Users className="text-[#39FF14]" size={24} />
          </div>
          <h3 className="text-3xl font-bold dark:text-white">{stats.studentCount}</h3>
          <p className="text-sm text-gray-400 font-medium">Total Students</p>
        </div>

        <div className="bg-white dark:bg-white/5 p-6 rounded-[28px] border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-400/10 rounded-2xl flex items-center justify-center mb-4">
            <Calendar className="text-blue-400" size={24} />
          </div>
          <h3 className="text-3xl font-bold dark:text-white">{stats.upcomingSessions}</h3>
          <p className="text-sm text-gray-400 font-medium">Sessions Today</p>
        </div>

        <div className="bg-white dark:bg-white/5 p-6 rounded-[28px] border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-400/10 rounded-2xl flex items-center justify-center mb-4">
            <TrendingUp className="text-purple-400" size={24} />
          </div>
          <h3 className="text-3xl font-bold dark:text-white">--%</h3>
          <p className="text-sm text-gray-400 font-medium">Performance Avg.</p>
        </div>
      </div>

      {/* Quick Actions - Section recommandée par le Sprint 3 */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold dark:text-white px-1">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link 
            to="/dashboard/coach/schedule" 
            className="flex items-center gap-3 px-6 h-14 bg-[#39FF14] text-black rounded-[18px] font-bold shadow-lg shadow-[#39FF14]/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={20} /> Schedule Session
          </Link>
          
          <Link 
            to="/dashboard/coach/students" 
            className="flex items-center gap-3 px-6 h-14 bg-white dark:bg-white/5 dark:text-white border border-gray-200 dark:border-white/10 rounded-[18px] font-bold hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
          >
            <Users size={20} /> Manage Students
          </Link>

          <button className="flex items-center gap-3 px-6 h-14 bg-white dark:bg-white/5 dark:text-white border border-gray-200 dark:border-white/10 rounded-[18px] font-bold opacity-50 cursor-not-allowed">
            <Video size={20} /> Video Review (Coming Soon)
          </button>
        </div>
      </div>

      {/* Placeholder for Recent Activity */}
      <div className="bg-gray-50 dark:bg-black/20 border border-dashed border-gray-200 dark:border-white/10 rounded-[32px] p-12 text-center">
        <p className="text-gray-500 font-medium">
          Your recent activities and pending student requests will appear here.
        </p>
      </div>
    </div>
  );
}