import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserPlus, Zap, X, Check, Loader2, Trophy, CheckCircle2 } from "lucide-react";
import { adminService } from "../../services/adminService";
import { toast } from "react-hot-toast";


export function AdminManagement() {
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unassignedPlayers, setUnassignedPlayers] = useState<any[]>([]);
  const [coaches, setCoaches] = useState<any[]>([]);
  const [selectedCoachForPlayer, setSelectedCoachForPlayer] = useState<{[key: string]: string}>({});
  const [isAssigning, setIsAssigning] = useState<string | null>(null)
  useEffect(() => {
    loadAssignmentData();
  }, []);
  // Données pour le formulaire
  const [availablePlayers, setAvailablePlayers] = useState<any[]>([]);
  const [availableCourts, setAvailableCourts] = useState<any[]>([]);
  
  // État du formulaire
  const [matchForm, setMatchForm] = useState({
    player1_id: "",
    player2_id: "",
    court_id: ""
  });
  const loadAssignmentData = async () => {
    try {
      // On récupère les joueurs sans coach et tous les coachs
      const [players, allCoaches] = await Promise.all([
        adminService.getUnassignedPlayers(),
        adminService.getAllCoaches() // Assure-toi que cette méthode existe dans adminService
      ]);
      setUnassignedPlayers(players || []);
      setCoaches(allCoaches || []);
    } catch (err) {
      toast.error("Failed to load assignment data");
    }
  };

  const handleAssign = async (playerId: string) => {
    const coachId = selectedCoachForPlayer[playerId];
    if (!coachId) {
      toast.error("Please select a coach first");
      return;
    }

    setIsAssigning(playerId);
    try {
      await adminService.assignCoachToPlayer(playerId, coachId);
      toast.success("Coach assigned successfully!");
      // Rafraîchir la liste
      loadAssignmentData();
    } catch (err) {
      toast.error("Error during assignment");
    } finally {
      setIsAssigning(null);
    }
  };
  // Charger les données au clic sur "Start Live Match"
  const openMatchModal = async () => {
    setLoading(true);
    try {
      // On récupère les joueurs et les terrains dispo
      const [players, courts] = await Promise.all([
        adminService.getUnassignedPlayers(), // Ou un service getPlayers() plus large
        adminService.getAllCourts()
      ]);
      setAvailablePlayers(players || []);
      setAvailableCourts(courts?.filter(c => c.status === 'available') || []);
      setIsMatchModalOpen(true);
    } catch (error) {
      toast.error("Failed to load match requirements");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchForm.player1_id || !matchForm.player2_id || !matchForm.court_id) {
      return toast.error("Please fill all fields");
    }

    setLoading(true);
    try {
      await adminService.createMatch({
        ...matchForm,
        status: 'live'
      });
      toast.success("Match started successfully!");
      setIsMatchModalOpen(false);
    } catch (error) {
      toast.error("Could not start match");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold dark:text-white font-['Playfair_Display'] text-[#0A0E1A]">Admin Control Center</h1>
        <p className="text-gray-500">Execute administrative actions and manage the club ecosystem.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Action : Assigner Coach */}
        <section className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[32px] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 dark:border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#39FF14]/10 flex items-center justify-center text-[#39FF14]">
            <UserPlus size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold dark:text-white font-['Poppins']">Assign Coach to Player</h3>
            <p className="text-sm text-gray-500">Connect unassigned students with available coaches</p>
          </div>
        </div>

        <div className="p-6">
          {unassignedPlayers.length === 0 ? (
            <div className="text-center py-10">
              <CheckCircle2 size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">All players currently have a coach.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <th className="pb-4 px-2">Player Name</th>
                    <th className="pb-4 px-2">Select Coach</th>
                    <th className="pb-4 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {unassignedPlayers.map((player) => (
                    <tr key={player.id} className="group">
                      <td className="py-4 px-2">
                        <span className="font-semibold dark:text-white">{player.full_name}</span>
                      </td>
                      <td className="py-4 px-2">
                        <select
                          className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 h-10 text-sm dark:text-white outline-none focus:border-[#39FF14] transition-all w-full max-w-[200px]"
                          onChange={(e) => setSelectedCoachForPlayer({
                            ...selectedCoachForPlayer,
                            [player.id]: e.target.value
                          })}
                          value={selectedCoachForPlayer[player.id] || ""}
                        >
                          <option value="">Choose a coach...</option>
                          {coaches.map(coach => (
                            <option key={coach.id} value={coach.id}>Coach {coach.full_name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <button
                          onClick={() => handleAssign(player.id)}
                          disabled={isAssigning === player.id}
                          className="bg-[#39FF14] text-black font-bold text-xs px-4 py-2 rounded-lg hover:scale-105 transition-all disabled:opacity-50"
                        >
                          {isAssigning === player.id ? "Assigning..." : "Confirm"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

        {/* Action : Créer Match */}
        <div className="bg-white dark:bg-white/5 p-8 rounded-[32px] border border-gray-100 dark:border-white/10 shadow-sm group hover:border-[#39FF14]/50 transition-all">
          <div className="w-14 h-14 bg-yellow-500/10 rounded-2xl flex items-center justify-center mb-6">
            <Zap className="text-yellow-500" size={28} />
          </div>
          <h3 className="text-2xl font-bold dark:text-white mb-2">Start Live Match</h3>
          <p className="text-sm text-gray-500 mb-8">Launch a new match with live scoring on a selected court.</p>
          <button 
            onClick={openMatchModal}
            className="w-full py-4 bg-yellow-500 text-black rounded-2xl font-bold hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Create Match"}
          </button>
        </div>
      </div>

      {/* MODAL : CREATE MATCH */}
      {isMatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-[#0A0E1A] border dark:border-white/10 w-full max-w-lg rounded-[32px] p-8 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold dark:text-white">New Live Match</h2>
              <button onClick={() => setIsMatchModalOpen(false)} className="dark:text-white/40 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateMatch} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Player 1</label>
                <select 
                  className="w-full h-14 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-4 dark:text-white outline-none focus:border-[#39FF14]"
                  onChange={(e) => setMatchForm({...matchForm, player1_id: e.target.value})}
                >
                  <option value="">Select first player</option>
                  {availablePlayers.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Player 2</label>
                <select 
                  className="w-full h-14 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-4 dark:text-white outline-none focus:border-[#39FF14]"
                  onChange={(e) => setMatchForm({...matchForm, player2_id: e.target.value})}
                >
                  <option value="">Select second player</option>
                  {availablePlayers.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Court Selection</label>
                <select 
                  className="w-full h-14 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-4 dark:text-white outline-none focus:border-[#39FF14]"
                  onChange={(e) => setMatchForm({...matchForm, court_id: e.target.value})}
                >
                  <option value="">Select an available court</option>
                  {availableCourts.map(c => <option key={c.id} value={c.id}>{c.name} ({c.type})</option>)}
                </select>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-[#39FF14] text-black font-bold rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-4"
              >
                {loading ? <Loader2 className="animate-spin" /> : <><Check size={20} /> Start Match Now</>}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}