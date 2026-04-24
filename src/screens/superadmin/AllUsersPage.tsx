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
  ShieldBan,
  ShieldCheck as ShieldUnban,
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
  is_banned?: boolean;
}

interface Club {
  id: string;
  name: string;
}

const ROLES = ["all", "player", "coach", "admin", "super_admin"];

const roleConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  super_admin: { icon: Crown,      color: "text-yellow-500",  bg: "bg-yellow-500/10",  label: "Super Admin" },
  admin:       { icon: ShieldCheck, color: "text-accent",      bg: "bg-accent/10",      label: "Admin"       },
  coach:       { icon: Dumbbell,    color: "text-indigo-400",  bg: "bg-indigo-400/10",  label: "Coach"       },
  player:      { icon: Trophy,      color: "text-emerald-400", bg: "bg-emerald-400/10", label: "Player"      },
};

const getRoleConfig = (role: string) =>
  roleConfig[role?.toLowerCase()] ?? { icon: Users, color: "text-muted-foreground", bg: "bg-muted", label: role };

export function AllUsersPage() {
  const [users, setUsers]               = useState<UserProfile[]>([]);
  const [clubs, setClubs]               = useState<Club[]>([]);
  const [loading, setLoading]           = useState(true);
  const [searchQuery, setSearchQuery]   = useState("");
  const [roleFilter, setRoleFilter]     = useState("all");
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [deletingId, setDeletingId]     = useState<string | null>(null);
  const [banningId, setBanningId]       = useState<string | null>(null);

  // ── Confirm dialog state ──────────────────────────────────────
  const [confirm, setConfirm] = useState<{
    open: boolean;
    type: "delete" | "ban" | "unban";
    userId: string;
    userName: string;
  } | null>(null);

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
      toast.error(err.message ?? "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ── Delete ────────────────────────────────────────────────────
  const handleDeleteUser = async () => {
    if (!confirm || confirm.type !== "delete") return;
    const { userId, userName } = confirm;
    setConfirm(null);
    setDeletingId(userId);
    try {
      await superAdminService.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      toast.success(`"${userName}" has been deleted`);
    } catch (err: any) {
      toast.error(err.message ?? "Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  // ── Ban / Unban ───────────────────────────────────────────────
  const handleBanToggle = async () => {
    if (!confirm || (confirm.type !== "ban" && confirm.type !== "unban")) return;
    const { userId, type } = confirm;
    const isBanning = type === "ban";
    setConfirm(null);
    setBanningId(userId);
    try {
      await (superAdminService as any).updateUserBanStatus(userId, isBanning);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_banned: isBanning } : u))
      );
      toast.success(isBanning ? "User banned" : "User unbanned");
    } catch (err: any) {
      toast.error(err.message ?? "Failed to update ban status");
    } finally {
      setBanningId(null);
    }
  };

  // ── Role change ───────────────────────────────────────────────
  const handleRoleChange = async (id: string, newRole: string) => {
    setUpdatingRole(id);
    try {
      await superAdminService.updateUserRole(id, newRole);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
      toast.success("Role updated");
    } catch (err: any) {
      toast.error(err.message ?? "Failed to update role");
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
    const matchesRole = roleFilter === "all" || u.role?.toLowerCase() === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* ── Confirm Dialog ─────────────────────────────────────── */}
      {confirm?.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-[28px] p-8 w-full max-w-sm shadow-2xl space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground font-['Playfair_Display']">
                {confirm.type === "delete" && "Delete User"}
                {confirm.type === "ban"    && "Ban User"}
                {confirm.type === "unban"  && "Unban User"}
              </h3>
              <p className="text-sm text-muted-foreground font-['Poppins']">
                {confirm.type === "delete" &&
                  `Are you sure you want to permanently delete "${confirm.userName}"? This cannot be undone.`}
                {confirm.type === "ban" &&
                  `Ban "${confirm.userName}"? They will lose access to the platform immediately.`}
                {confirm.type === "unban" &&
                  `Restore access for "${confirm.userName}"?`}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirm(null)}
                className="flex-1 h-11 rounded-xl border border-border text-foreground font-bold text-sm font-['Poppins'] hover:bg-muted transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirm.type === "delete" ? handleDeleteUser : handleBanToggle}
                className={`flex-1 h-11 rounded-xl font-bold text-sm font-['Poppins'] text-white transition-all hover:opacity-90 ${
                  confirm.type === "delete"
                    ? "bg-red-500"
                    : confirm.type === "ban"
                    ? "bg-orange-500"
                    : "bg-emerald-500"
                }`}
              >
                {confirm.type === "delete" && "Delete"}
                {confirm.type === "ban"    && "Ban User"}
                {confirm.type === "unban"  && "Restore Access"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ─────────────────────────────────────────────── */}
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

      {/* ── Filters ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
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
            className="bg-background text-foreground outline-none text-sm font-semibold pr-2"
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

      {/* ── Count ──────────────────────────────────────────────── */}
      {!loading && (
        <p className="text-sm text-muted-foreground font-['Poppins']">
          Showing <span className="font-bold text-foreground">{filtered.length}</span> of {users.length} users
        </p>
      )}

      {/* ── Table ──────────────────────────────────────────────── */}
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
                  {["User", "Contact", "Role", "Club", "Joined", "Status", "Actions"].map((h, i) => (
                    <th
                      key={h}
                      className={`px-6 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-['Poppins'] ${
                        i === 6 ? "text-right" : ""
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
                  const isProtected = user.role === "super_admin";
                  const isDeleting  = deletingId === user.id;
                  const isBanning   = banningId  === user.id;

                  return (
                    <tr
                      key={user.id}
                      className={`group hover:bg-muted/30 transition-colors ${
                        user.is_banned ? "opacity-60" : ""
                      }`}
                    >
                      {/* User */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-2xl ${rc.bg} flex items-center justify-center font-bold text-sm ${rc.color}`}>
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
                          <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${rc.bg} ${rc.color}`}>
                            <RoleIcon size={11} />
                            {rc.label}
                          </span>
                          {!isProtected && (
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

                      {/* Status (banned badge) */}
                      <td className="px-6 py-5">
                        {user.is_banned ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight bg-red-500/10 text-red-500">
                            <ShieldBan size={11} /> Banned
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight bg-emerald-500/10 text-emerald-500">
                            Active
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5 text-right">
                        {!isProtected && (
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">

                            {/* Ban / Unban */}
                            <button
                              onClick={() =>
                                setConfirm({
                                  open: true,
                                  type: user.is_banned ? "unban" : "ban",
                                  userId: user.id,
                                  userName: user.full_name,
                                })
                              }
                              disabled={isBanning}
                              title={user.is_banned ? "Unban user" : "Ban user"}
                              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold font-['Poppins'] transition-all disabled:opacity-50 ${
                                user.is_banned
                                  ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                                  : "bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white"
                              }`}
                            >
                              {isBanning ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : user.is_banned ? (
                                <ShieldCheck size={13} />
                              ) : (
                                <ShieldBan size={13} />
                              )}
                              {user.is_banned ? "Unban" : "Ban"}
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() =>
                                setConfirm({
                                  open: true,
                                  type: "delete",
                                  userId: user.id,
                                  userName: user.full_name,
                                })
                              }
                              disabled={isDeleting}
                              title="Delete user"
                              className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                            >
                              {isDeleting ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </div>
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