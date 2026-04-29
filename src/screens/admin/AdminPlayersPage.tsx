import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Mail,
  Calendar,
  Loader2,
  RefreshCw,
  AlertCircle,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { adminService } from "../../services/adminService";
import { useAuth } from "../../services/AuthContext";
import { toast } from "react-hot-toast";

interface Player {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  avatar_url?: string;
}

export function AdminPlayersPage() {
  const { user } = useAuth();
  const clubId = user?.club_id;

  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPlayers = async () => {
    if (!clubId) return;
    try {
      setLoading(true);
      const data = await adminService.getClubPlayers(clubId);
      setPlayers(data ?? []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, [clubId]);

  const filteredPlayers = players.filter(
    (p) =>
      p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!clubId) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertCircle size={48} className="text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold text-foreground font-['Playfair_Display']">No Club Assigned</h2>
        <p className="text-muted-foreground text-sm mt-2 font-['Poppins']">
          Contact your Super Admin to assign you to a club.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground font-['Playfair_Display']">
              Players
            </h1>
          </div>
          <p className="text-muted-foreground text-sm font-['Poppins'] mt-1">
            Members registered at your club.
          </p>
        </div>
        <button
          onClick={fetchPlayers}
          className="p-3 bg-card border border-border rounded-xl text-foreground hover:bg-muted/80 transition-all self-start"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={20}
        />
        <input
          type="text"
          placeholder="Search by name or email..."
          className="w-full h-14 pl-12 pr-4 bg-card border border-border rounded-2xl text-foreground outline-none focus:border-accent transition-all font-['Poppins']"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center font-['Poppins']">
            <Loader2 className="animate-spin text-accent w-10 h-10 mb-4" />
            <p className="text-muted-foreground">Loading players...</p>
          </div>
        ) : filteredPlayers.length === 0 ? (
          <div className="p-20 text-center font-['Poppins']">
            <Users size={44} className="text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground italic">No players found for your club.</p>
          </div>
        ) : (
          <>
            {/* Mobile View */}
            <div className="p-4 space-y-4 sm:hidden">
              {filteredPlayers.map((player) => (
                <div key={player.id} className="bg-card border border-border/50 rounded-[28px] p-5 space-y-4 shadow-sm hover:border-accent/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent font-bold text-lg border border-accent/20 group-hover:scale-105 transition-transform">
                      {player.full_name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-base font-['Poppins']">
                        {player.full_name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <ShieldCheck size={12} className="text-accent" />
                        <span className="text-[10px] text-accent font-black uppercase tracking-widest font-['Poppins']">
                          Member
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 text-xs font-['Poppins']">
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-border/50">
                      <div className="flex items-center gap-2 text-muted-foreground font-bold uppercase tracking-tighter text-[10px]">
                        <Mail size={12} /> Email
                      </div>
                      <p className="text-foreground font-medium truncate max-w-[160px]">{player.email}</p>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-border/50">
                      <div className="flex items-center gap-2 text-muted-foreground font-bold uppercase tracking-tighter text-[10px]">
                        <Calendar size={12} /> Joined
                      </div>
                      <p className="text-foreground font-medium">{new Date(player.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    {["Player", "Contact", "Joined"].map((h) => (
                      <th
                        key={h}
                        className="px-8 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-['Poppins']"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredPlayers.map((player) => (
                    <tr key={player.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-2xl bg-accent/10 flex items-center justify-center text-accent font-bold text-base border border-accent/20">
                            {player.full_name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-foreground font-['Poppins']">
                              {player.full_name}
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-0.5 uppercase font-bold tracking-tight font-['Poppins']">
                              Member
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-['Poppins']">
                          <Mail size={14} className="text-muted-foreground/60" />
                          {player.email}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-['Poppins']">
                          <Calendar size={14} />
                          {new Date(player.created_at).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
