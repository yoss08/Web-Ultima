import { useState } from "react";
import { UserPlus, Trophy, MapPin, Zap, CheckCircle } from "lucide-react";

export function AdminManagement() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold dark:text-white font-['Playfair_Display']">Admin Control Center</h1>
        <p className="text-gray-500">Manage the ecosystem, courts, and match assignments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Action 1: Assigner Coach à Elève */}
        <div className="bg-white dark:bg-white/5 p-6 rounded-[24px] border border-gray-100 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <UserPlus className="text-purple-500" />
            </div>
            <h3 className="text-xl font-bold dark:text-white">Assign Coach</h3>
          </div>
          <p className="text-sm text-gray-500 mb-6">Link a student to a professional coach to enable tracking and training sessions.</p>
          <button className="w-full py-3 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-600 transition-colors">
            Open Directory
          </button>
        </div>

        {/* Action 2: Créer un Match en Direct */}
        <div className="bg-white dark:bg-white/5 p-6 rounded-[24px] border border-gray-100 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
              <Zap className="text-yellow-500" />
            </div>
            <h3 className="text-xl font-bold dark:text-white">Start Live Match</h3>
          </div>
          <p className="text-sm text-gray-500 mb-6">Select two players and a court to begin a live-scored match on the platform.</p>
          <button className="w-full py-3 bg-yellow-500 text-black rounded-xl font-bold hover:bg-yellow-600 transition-colors">
            Create Match
          </button>
        </div>
      </div>
    </div>
  );
}