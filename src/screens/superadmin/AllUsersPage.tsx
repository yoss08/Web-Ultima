import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Mail,
  Calendar,
  Trash2,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Dumbbell,
  Trophy,
  Crown,
  Filter,
  Building2,
} from "lucide-react";
import { superAdminService } from "../../services/superAdminService";
import { toast } from "react-hot-toast";

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  club_id?: string;
  created_at: string;
  phone?: string;
}

interface Club {
  id: string;
  name: string;
}

const ROLES = ["all", "player", "coach", "admin", "super_admin"];

const roleConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  super_admin: { icon: Crown, color: "text-yellow-500", bg: "bg-yellow-500/10", label: "Super Admin" },
  admin: { icon: ShieldCheck, color: "text-accent", bg: "bg-accent/10", label: "Admin" },
  coach: { icon: Dumbbell, color: "text-indigo-400", bg: "bg-indigo-400/10", label: "Coach" },
  player: { icon: Trophy, color: "text-emerald-400", bg: "bg-emerald-400/10", label: "Player" },
};

const getRoleConfig = (role: string) =>
  roleConfig[role?.toLowerCase()] ?? { icon: Users, color: "text-muted-foreground", bg: "bg-muted", label: role };

export function AllUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [userList, clubList] = await Promise.all([
        superAdminService.getAllUsers(),
        superAdminService.getAllClubs(),
      ]);
      setUsers(userList ?? []);
      setClubs(clubList ?? []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await superAdminService.deleteUser(id);
      toast.success("User deleted");
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    setUpdatingRole(id);
    try {
      await superAdminService.updateUserRole(id, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
      );
      toast.success("Role updated");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpdatingRole(null);
    }
  };

  const getClubName = (clubId?: string) => {
    if (!clubId) return "—";
    return clubs.find((c) => c.id === clubId)?.name ?? "Unknown";
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole =
      roleFilter === "all" || u.role?.toLowerCase() === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground font-['Playfair_Display']">
            All Users
          </h1>
          <p className="text-muted-foreground text-sm font-['Poppins'] mt-1">
            Manage all platform users — players, coaches and admins.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="p-3 bg-card border border-border rounded-xl text-foreground hover:bg-muted/80 transition-all self-start"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full h-12 pl-12 pr-4 bg-card border border-border rounded-2xl text-foreground outline-none focus:border-accent transition-all font-['Poppins']"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 bg-card border border-border rounded-2xl px-4 h-12 font-['Poppins']">
          <Filter size={16} className="text-muted-foreground" />
          <select
            className="bg-transparent text-foreground outline-none text-sm font-semibold pr-2"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r === "all" ? "All Roles" : r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Count */}
      {!loading && (
        <p className="text-sm text-muted-foreground font-['Poppins']">
          Showing <span className="font-bold text-foreground">{filtered.length}</span> of{" "}
          {users.length} users
        </p>
      )}

      {/* Table */}
      <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center font-['Poppins']">
            <Loader2 className="animate-spin text-accent w-10 h-10 mb-4" />
            <p className="text-muted-foreground font-medium">Loading users...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-20 text-center text-muted-foreground italic font-['Poppins']">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  {["User", "Contact", "Role", "Club", "Joined", "Actions"].map((h, i) => (
                    <th
                      key={h}
                      className={`px-6 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-['Poppins'] ${
                        i === 5 ? "text-right" : ""
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map((user) => {
                  const rc = getRoleConfig(user.role);
                  const RoleIcon = rc.icon;
                  return (
                    <tr key={user.id} className="group hover:bg-muted/30 transition-colors">
                      {/* User */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-2xl ${rc.bg} flex items-center justify-center font-bold text-sm ${rc.color}`}
                          >
                            {user.full_name?.[0]?.toUpperCase() ?? "?"}
                          </div>
                          <p className="font-bold text-foreground text-sm font-['Poppins']">
                            {user.full_name}
                          </p>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-['Poppins']">
                          <Mail size={13} className="text-muted-foreground/60" />
                          <span className="truncate max-w-[160px]">{user.email}</span>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${rc.bg} ${rc.color}`}
                          >
                            <RoleIcon size={11} />
                            {rc.label}
                          </span>
                          {user.role !== "super_admin" && (
                            <select
                              className="text-[10px] bg-muted border border-border rounded-lg px-2 py-1 text-foreground outline-none focus:border-accent transition-all opacity-0 group-hover:opacity-100"
                              value={user.role ?? "player"}
                              onChange={(e) => handleRoleChange(user.id, e.target.value)}
                              disabled={updatingRole === user.id}
                            >
                              <option value="player">Player</option>
                              <option value="coach">Coach</option>
                              <option value="admin">Admin</option>
                            </select>
                          )}
                        </div>
                      </td>

                      {/* Club */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-['Poppins']">
                          <Building2 size={13} className="text-muted-foreground/60" />
                          {getClubName(user.club_id)}
                        </div>
                      </td>

                      {/* Joined */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-['Poppins']">
                          <Calendar size={13} />
                          {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5 text-right">
                        {user.role !== "super_admin" && (
                          <button
                            onClick={() => handleDeleteUser(user.id, user.full_name)}
                            className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                            title="Delete user"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
