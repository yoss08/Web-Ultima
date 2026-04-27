import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Crown,
  Users,
  Building2,
  Loader2,
  BarChart3,
  CalendarDays
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../services/AuthContext";
import { supabase } from "../../config/supabase";
import { toast } from "react-hot-toast";

type Tab = "Overview";

export function SuperAdminProfilePage() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Profile data
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Stats
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalClubs, setTotalClubs] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfileAndStats();
  }, [user]);

  async function fetchProfileAndStats() {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setFullName(profile.full_name ?? user.user_metadata?.full_name ?? "");
        setAvatarUrl(profile.avatar_url ?? null);
      }

      // We can use count with head: true to get counts without downloading all data
      const { count: usersCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });
      const { count: clubsCount } = await supabase.from("clubs").select("*", { count: "exact", head: true });
      const { count: bookingsCount } = await supabase.from("bookings").select("*", { count: "exact", head: true });

      setTotalUsers(usersCount || 0);
      setTotalClubs(clubsCount || 0);
      setTotalBookings(bookingsCount || 0);
    } catch (e) {
      toast.error("Error loading profile");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setIsUploading(true);
    const tid = toast.loading("Uploading avatar...");
    try {
      const path = `avatars/${user.id}.jpg`;
      await supabase.storage.from("photos").upload(path, file, {
        upsert: true,
        contentType: file.type,
      });
      const publicUrl =
        supabase.storage.from("photos").getPublicUrl(path).data.publicUrl +
        `?t=${Date.now()}`;

      await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id);
      setAvatarUrl(publicUrl);
      toast.success("Avatar updated!", { id: tid });
    } catch {
      toast.error("Upload failed", { id: tid });
    } finally {
      setIsUploading(false);
    }
  }

  async function handleRemovePhoto() {
    if (!user) return;
    const tid = toast.loading("Removing avatar...");
    try {
      const path = `avatars/${user.id}.jpg`;
      await supabase.storage.from("photos").remove([path]);
      await supabase.from("profiles").update({ avatar_url: null }).eq("id", user.id);
      setAvatarUrl(null);
      toast.success("Avatar removed!", { id: tid });
    } catch {
      toast.error("Failed to remove avatar", { id: tid });
    }
  }

  const initials = fullName ? fullName[0].toUpperCase() : "S";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin border-yellow-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-500">
      {/* ── HERO HEADER ───────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-[28px] mb-6 bg-gradient-to-b from-yellow-500 to-background">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center gap-1.5 bg-black/10 rounded-full px-3 py-1.5">
            <Crown className="w-3.5 h-3.5 text-black" />
            <span className="text-black text-xs font-bold uppercase tracking-wider">Super Admin</span>
          </div>
        </div>

        {/* Avatar & Info Wrapper */}
        <div className="flex flex-col md:flex-row items-center md:items-start md:px-10 pt-4 pb-8 md:gap-12">
          <div className="flex flex-col items-center">
            <button onClick={() => fileInputRef.current?.click()} className="relative group">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-[3px] border-black shadow-2xl overflow-hidden bg-black/20 flex items-center justify-center transition-transform group-hover:scale-105">
                {isUploading ? (
                  <Loader2 className="w-6 h-6 md:w-8 md:h-8 text-white animate-spin" />
                ) : avatarUrl ? (
                  <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-black font-black text-4xl md:text-5xl">{initials}</span>
                )}
              </div>
              <div className="absolute bottom-0.5 right-0.5 md:bottom-2 md:right-2 w-7 h-7 md:w-9 md:h-9 rounded-full bg-black border-2 border-yellow-500 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                <Camera className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-500" />
              </div>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            {avatarUrl && (
              <button
                onClick={handleRemovePhoto}
                className="mt-3 text-xs font-bold text-red-500 hover:text-red-400 bg-red-500/10 px-3 py-1 rounded-full transition-all"
              >
                Remove Photo
              </button>
            )}
          </div>

          <div className="flex flex-col items-center md:items-start flex-1 w-full mt-4 md:mt-2">
            <h1 className="text-black font-black text-2xl md:text-4xl leading-none text-center md:text-left">
              {fullName || "Super Admin"}
            </h1>

            <div className="flex flex-col md:flex-row items-center md:items-end w-full gap-6 md:gap-12 mt-5 md:mt-8">
              <div className="flex items-center gap-0 w-full max-w-xs md:max-w-md px-6 md:px-0">
                <StatChip icon={<Users className="w-4 h-4 md:w-5 md:h-5 text-black" />} value={totalUsers} label="USERS" />
                <div className="w-px h-9 md:h-12 bg-black/20 mx-2 md:mx-4" />
                <StatChip icon={<Building2 className="w-4 h-4 md:w-5 md:h-5 text-black" />} value={totalClubs} label="CLUBS" />
                <div className="w-px h-9 md:h-12 bg-black/20 mx-2 md:mx-4" />
                <StatChip icon={<CalendarDays className="w-4 h-4 md:w-5 md:h-5 text-black" />} value={totalBookings} label="BOOKINGS" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex bg-card border border-border rounded-[18px] p-1 mb-6">
        {(["Overview"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 rounded-[14px] text-[11px] font-black tracking-[1.5px] uppercase transition-all relative ${
              activeTab === tab ? "text-black" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="tab-pill"
                className="absolute inset-0 rounded-[14px] bg-yellow-500"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
          {activeTab === "Overview" && (
            <div className="bg-card border border-border rounded-[20px] p-8">
              <h3 className="text-xl font-bold mb-4">Super Admin Privileges</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span>Full control over all clubs and platform configurations.</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                    <Users className="w-5 h-5" />
                  </div>
                  <span>Manage user accounts, roles, and administrative access.</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <span>Access platform-wide analytics and performance reports.</span>
                </li>
              </ul>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function StatChip({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="flex-1 flex flex-col items-center">
      {icon}
      <span className="text-black font-black text-xl leading-none mt-0.5">{value}</span>
      <span className="text-black/60 text-[9px] md:text-[10px] font-bold tracking-[1.5px] uppercase mt-0.5 text-center">{label}</span>
    </div>
  );
}
