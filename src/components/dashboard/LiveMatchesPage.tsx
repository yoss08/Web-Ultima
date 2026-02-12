import { useAuth } from "../../services/AuthContext";
import { Zap, Play, Edit2, Eye, Info, XCircle } from "lucide-react";

export function LiveMatchesPage() {
  const { user } = useAuth();
  const role = user?.user_metadata?.account_type?.toLowerCase() || "player";

  // Cette liste sera vide jusqu'à ce que l'Admin crée un match en base
  const matches = []; 

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold dark:text-white font-['Playfair_Display']">Matches</h1>
          <p className="text-gray-500">
            {role === 'admin' ? "Monitor all club activity." : role === 'coach' ? "Analyze your students' performance." : "Follow live scores and your history."}
          </p>
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="bg-white dark:bg-white/5 rounded-[32px] p-20 border-2 border-dashed border-gray-200 dark:border-white/10 text-center">
          <div className="w-16 h-16 bg-[#39FF14]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="text-[#39FF14]" size={32} />
          </div>
          <h2 className="text-xl font-bold dark:text-white">No matches currently</h2>
          <p className="text-gray-500 mt-2">Live scores will appear here once the games begin.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {/* Exemple de Carte de Match avec Boutons Dynamiques */}
          <div className="bg-white dark:bg-white/5 p-6 rounded-[28px] border border-gray-100 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="w-14 h-14 bg-gray-200 rounded-full mb-2 mx-auto" />
                <p className="font-bold dark:text-white text-sm">Player 1</p>
              </div>
              <div className="text-2xl font-black text-[#39FF14]">VS</div>
              <div className="text-center">
                <div className="w-14 h-14 bg-gray-200 rounded-full mb-2 mx-auto" />
                <p className="font-bold dark:text-white text-sm">Player 2</p>
              </div>
            </div>

            {/* --- BOUTONS PAR RÔLE --- */}
            <div className="flex gap-3">
              {role === 'admin' && (
                <>
                  <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black font-bold rounded-xl text-sm">
                    <Edit2 size={16} /> Edit Score
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 font-bold rounded-xl text-sm">
                    <XCircle size={16} /> Stop
                  </button>
                </>
              )}

              {role === 'coach' && (
                <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-700 transition-all">
                  <Play size={16} /> Analysis Mode
                </button>
              )}

              {role === 'player' && (
                <button className="flex items-center gap-2 px-6 py-2 bg-white dark:bg-white/10 dark:text-white border border-gray-200 dark:border-white/10 font-bold rounded-xl text-sm">
                  <Eye size={16} /> Watch Live
                </button>
              )}
              
              <button className="p-2 dark:text-white/40"><Info size={20}/></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}