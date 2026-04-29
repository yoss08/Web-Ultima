import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  UserPlus,
  Building2,
  Mail,
  Phone,
  Lock,
  Trash2,
  X,
  Loader2,
  RefreshCw,
  Check,
  User,
  Search,
  AlertTriangle,
} from "lucide-react";
import { superAdminService } from "../../services/superAdminService";
import { toast } from "react-hot-toast";
import { confirmDialog } from "../../components/ui/ConfirmDialog";

interface AdminAccount {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  club_id?: string;
  created_at: string;
}

interface Club {
  id: string;
  name: string;
  location: string;
}

const emptyForm = {
  email: "",
  password: "",
  fullName: "",
  phone: "",
  clubId: "",
};

export function AdminAccountCreation() {
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [loadingClubs, setLoadingClubs] = useState(true);
  const [clubsError, setClubsError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ─── Load clubs and admins independently ─────────────────────
  // They are loaded in separate calls so a failing /api endpoint
  // for admins does NOT prevent clubs from showing in the form.

  const fetchClubs = async () => {
    setLoadingClubs(true);
    setClubsError(null);
    try {
      const clubList = await superAdminService.getAllClubs();
      setClubs(clubList ?? []);
    } catch (err: any) {
      setClubsError(err.message);
      toast.error("Could not load clubs: " + err.message);
    } finally {
      setLoadingClubs(false);
    }
  };

  const fetchAdmins = async () => {
    setLoadingAdmins(true);
    try {
      const adminList = await superAdminService.getAllAdmins();
      setAdmins(adminList ?? []);
    } catch (err: any) {
      // Non-fatal — admins list failing should not block the clubs dropdown
      toast.error("Could not load admin list: " + err.message);
    } finally {
      setLoadingAdmins(false);
    }
  };

  useEffect(() => {
    fetchClubs();
    fetchAdmins();
  }, []);

  const handleCreate = async () => {
    if (!form.email || !form.password || !form.fullName || !form.clubId) {
      toast.error("All fields are required.");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setSaving(true);
    try {
      await superAdminService.createAdminAccount(form);
      toast.success(`Admin account created for ${form.fullName}`);
      setShowModal(false);
      setForm(emptyForm);
      fetchAdmins();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const ok = await confirmDialog({ title: "Delete Admin Account", message: `Delete admin account for "${name}"? This cannot be undone.`, confirmLabel: "Delete", variant: "danger" });
    if (!ok) return;
    try {
      await superAdminService.deleteAdminAccount(id);
      toast.success("Admin account deleted");
      fetchAdmins();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const filteredAdmins = admins.filter(
    (a) =>
      a.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getClubName = (clubId?: string) => {
    if (!clubId) return "Unassigned";
    return clubs.find((c) => c.id === clubId)?.name ?? "Unknown Club";
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground font-['Playfair_Display']">
            Admin Accounts
          </h1>
          <p className="text-muted-foreground text-sm font-['Poppins'] mt-1">
            Create and manage business owner accounts, assign them to clubs.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { fetchClubs(); fetchAdmins(); }}
            className="p-3 bg-card border border-border rounded-xl text-foreground hover:bg-muted/80 transition-all"
          >
            <RefreshCw size={20} className={(loadingAdmins || loadingClubs) ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-bold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-accent/20 font-['Poppins']"
          >
            <UserPlus size={20} /> New Admin
          </button>
        </div>
      </div>

      {/* RLS warning banner */}
      {clubsError && (
        <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl">
          <AlertTriangle size={18} className="text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-yellow-500 font-['Poppins']">
              Could not load clubs
            </p>
            <p className="text-xs text-yellow-500/80 font-['Poppins'] mt-0.5">
              {clubsError}. The most common cause is a missing RLS policy — run the SQL below in
              your Supabase SQL editor:
            </p>
            <pre className="mt-2 text-[11px] bg-yellow-500/10 rounded-lg p-3 text-yellow-600 overflow-x-auto whitespace-pre-wrap">
{`-- Allow authenticated users to read all clubs
CREATE POLICY "authenticated_read_clubs"
ON public.clubs
FOR SELECT
TO authenticated
USING (true);

-- Allow super_admin to insert/update/delete
CREATE POLICY "super_admin_write_clubs"
ON public.clubs
FOR ALL
TO authenticated
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
);`}
            </pre>
            <button
              onClick={fetchClubs}
              className="mt-2 text-xs font-bold text-yellow-500 underline font-['Poppins']"
            >
              Retry
            </button>
          </div>
        </div>
      )}

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

      {/* Admins Table */}
      <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-sm">
        {loadingAdmins ? (
          <div className="p-20 flex flex-col items-center justify-center font-['Poppins']">
            <Loader2 className="animate-spin text-accent w-10 h-10 mb-4" />
            <p className="text-muted-foreground font-medium">Loading admin accounts...</p>
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div className="p-20 text-center font-['Poppins']">
            <ShieldCheck size={48} className="text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground">No admin accounts yet</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Create the first admin account to get started.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="p-4 space-y-4 sm:hidden">
              {filteredAdmins.map((admin) => (
                <div key={admin.id} className="bg-muted/30 border border-border/50 rounded-2xl p-4 space-y-4 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold text-sm">
                        {admin.full_name?.[0]?.toUpperCase() ?? <User size={16} />}
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-sm font-['Poppins']">
                          {admin.full_name}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <ShieldCheck size={11} className="text-accent" />
                          <span className="text-[10px] text-accent font-bold uppercase tracking-tight font-['Poppins']">
                            Admin
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(admin.id, admin.full_name)}
                      className="p-2 bg-red-500/10 text-red-500 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 text-[11px] font-['Poppins']">
                    <div className="flex items-center justify-between border-b border-border/30 pb-2">
                      <p className="text-muted-foreground uppercase font-bold tracking-wider">Email</p>
                      <p className="text-foreground truncate max-w-[180px]">{admin.email}</p>
                    </div>
                    <div className="flex items-center justify-between border-b border-border/30 pb-2">
                      <p className="text-muted-foreground uppercase font-bold tracking-wider">Club</p>
                      <p className="text-foreground">{getClubName(admin.club_id)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-muted-foreground uppercase font-bold tracking-wider">Created</p>
                      <p className="text-foreground">{new Date(admin.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    {["Admin", "Email", "Assigned Club", "Created", "Actions"].map((h, i) => (
                      <th
                        key={h}
                        className={`px-6 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-['Poppins'] ${
                          i === 4 ? "text-right" : ""
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredAdmins.map((admin) => (
                    <tr key={admin.id} className="group hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold text-sm">
                            {admin.full_name?.[0]?.toUpperCase() ?? <User size={16} />}
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-sm font-['Poppins']">
                              {admin.full_name}
                            </p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <ShieldCheck size={11} className="text-accent" />
                              <span className="text-[10px] text-accent font-bold uppercase tracking-tight font-['Poppins']">
                                Admin
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-['Poppins']">
                          <Mail size={14} className="text-muted-foreground/60" />
                          {admin.email}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm font-['Poppins']">
                          <Building2 size={14} className="text-accent" />
                          <span
                            className={`font-medium ${
                              admin.club_id ? "text-foreground" : "text-muted-foreground italic"
                            }`}
                          >
                            {getClubName(admin.club_id)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm text-muted-foreground font-['Poppins']">
                          {new Date(admin.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => handleDelete(admin.id, admin.full_name)}
                          className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                          title="Delete admin"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border w-full max-w-lg rounded-[32px] p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground font-['Playfair_Display']">
                  Create Admin Account
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4 font-['Poppins']">
                {/* Full Name */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Ahmed Ben Salah"
                      className="w-full h-12 pl-11 pr-4 bg-muted border border-border rounded-xl text-foreground outline-none focus:border-accent transition-all"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      placeholder="admin@club.tn"
                      className="w-full h-12 pl-11 pr-4 bg-muted border border-border rounded-xl text-foreground outline-none focus:border-accent transition-all"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      className="w-full h-12 pl-11 pr-16 bg-muted border border-border rounded-xl text-foreground outline-none focus:border-accent transition-all"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-accent"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="tel"
                      placeholder="+216 XX XXX XXX"
                      className="w-full h-12 pl-11 pr-4 bg-muted border border-border rounded-xl text-foreground outline-none focus:border-accent transition-all"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                </div>

                {/* Club Assignment */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
                    Assign to Club *
                  </label>
                  {loadingClubs ? (
                    <div className="h-12 bg-muted border border-border rounded-xl flex items-center px-4 gap-2">
                      <Loader2 size={14} className="animate-spin text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Loading clubs...</span>
                    </div>
                  ) : clubsError ? (
                    <div className="h-12 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between px-4">
                      <span className="text-sm text-red-500">Failed to load clubs</span>
                      <button
                        onClick={fetchClubs}
                        className="text-xs font-bold text-red-500 underline"
                      >
                        Retry
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <select
                        className="w-full h-12 pl-11 pr-4 bg-muted border border-border rounded-xl text-foreground outline-none focus:border-accent transition-all appearance-none"
                        value={form.clubId}
                        onChange={(e) => setForm({ ...form, clubId: e.target.value })}
                      >
                        <option value="">Select a club...</option>
                        {clubs.map((club) => (
                          <option key={club.id} value={club.id}>
                            {club.name} — {club.location}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {!loadingClubs && !clubsError && clubs.length === 0 && (
                    <p className="text-xs text-yellow-500 mt-1 font-['Poppins']">
                      No clubs found. Create a club first in Club Management.
                    </p>
                  )}
                </div>

                <button
                  onClick={handleCreate}
                  disabled={saving || loadingClubs || !!clubsError}
                  className="w-full h-14 bg-accent text-accent-foreground font-bold rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-accent/20 disabled:opacity-60 mt-2"
                >
                  {saving ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      <Check size={20} /> Create Admin Account
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}