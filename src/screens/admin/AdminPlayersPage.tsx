import { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Mail, 
  Calendar, 
  MoreVertical, 
  UserX, 
  UserCheck, 
  Loader2,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import { toast } from "react-hot-toast";

interface Player {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  status?: string;
  avatar_url?: string;
}

export function AdminPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/players');
      if (!response.ok) throw new Error("Failed to fetch players");
      const data = await response.json();
      setPlayers(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const filteredPlayers = players.filter(p => 
    p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold dark:text-white font-['Playfair_Display']">Player Directory</h1>
          <p className="text-gray-500">Manage club members and their accounts.</p>
        </div>
        <button 
          onClick={fetchPlayers}
          className="p-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl dark:text-white hover:bg-gray-50 transition-all"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text"
          placeholder="Search by name or email..."
          className="w-full h-14 pl-12 pr-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl dark:text-white outline-none focus:border-[#39FF14] transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[32px] overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-[#39FF14] w-10 h-10 mb-4" />
            <p className="text-gray-500">Retrieving athlete data...</p>
          </div>
        ) : filteredPlayers.length === 0 ? (
          <div className="p-20 text-center text-gray-500 italic">
            No players found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10">
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Player</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Joined</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                {filteredPlayers.map((player) => (
                  <tr key={player.id} className="group hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#39FF14]/10 flex items-center justify-center text-[#39FF14] font-bold text-lg border border-[#39FF14]/20 shadow-[0_0_15px_rgba(57,255,20,0.05)]">
                          {player.full_name?.[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold dark:text-white leading-none">{player.full_name}</p>
                          <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-tight">Standard Member</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-sm dark:text-gray-300">
                        <Mail size={14} className="text-gray-400" />
                        {player.email}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-sm dark:text-gray-400">
                        <Calendar size={14} />
                        {new Date(player.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex justify-end gap-2">
                          <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all">
                            <ExternalLink size={18} />
                          </button>
                          <button className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 transition-all">
                            <UserX size={18} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
