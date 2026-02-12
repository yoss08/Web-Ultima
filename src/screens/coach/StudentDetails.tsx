import { motion } from "framer-motion";
import { TrendingUp, Target, BarChart2 } from "lucide-react";

export function StudentDetails() {
  // On simule une liste de données vide
  const performanceData = []; 

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Profil Header (Toujours utile pour savoir quel élève on regarde) */}
      <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
        <div className="flex gap-4 items-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-white/5 border-2 border-dashed border-gray-300 dark:border-white/20 flex items-center justify-center text-3xl font-bold text-gray-400">
            ?
          </div>
          <div>
            <h1 className="text-3xl font-bold dark:text-white font-['Playfair_Display']">Select a Student</h1>
            <p className="text-gray-500 font-medium text-sm">Individual performance metrics will appear here.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique Vide */}
        <div className="lg:col-span-2 bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-[24px] p-12 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
            <BarChart2 className="text-blue-500" size={32} />
          </div>
          <h3 className="text-xl font-bold dark:text-white">No Progression Data</h3>
          <p className="text-gray-500 max-w-xs mt-2">
            Once the student completes matches and training sessions, their skill progression will be visualized here.
          </p>
        </div>

        {/* Zones de Focus Vides */}
        <div className="bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-[24px] p-6 shadow-sm">
          <h3 className="font-bold dark:text-white mb-6 flex items-center gap-2">
            <Target size={20} className="text-[#39FF14]" /> Focus Areas
          </h3>
          <div className="space-y-6 py-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2 opacity-20">
                <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-3/4"></div>
                <div className="h-1.5 w-full bg-gray-100 dark:bg-white/10 rounded-full"></div>
              </div>
            ))}
            <p className="text-xs text-center text-gray-500 italic">Awaiting coach evaluation...</p>
          </div>
        </div>
      </div>
    </div>
  );
}