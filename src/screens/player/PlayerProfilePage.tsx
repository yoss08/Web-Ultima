import { motion, AnimatePresence } from "framer-motion";
import {
  Bolt,
  Calendar,
  Trophy,
  Camera,
  User,
  Phone,
  Lock,
  LogOut,
  Bell,
  Globe,
  ChevronRight,
  ShieldCheck,
  Loader2,
  Save,
  Clock,
  Check,
  RefreshCw,
  X,
  Search,
  Flag,
  Star,
  Users
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../services/AuthContext";
import { supabase } from "../../config/supabase";
import { toast } from "react-hot-toast";
import { notificationService } from "../../services/NotificationService";

// ─── LEVEL SYSTEM ────────────────────────────────────────────────────────────

interface PlayerLevel {
  level: number;
  title: string;
  minPoints: number;
  maxPoints: number;
  color: string;        // tailwind bg color class
  textColor: string;    // tailwind text color class
  hex: string;          // raw hex for inline styles
}

const LEVELS: PlayerLevel[] = [
  { level: 1, title: "Rookie",   minPoints: 0,    maxPoints: 249,   color: "bg-gray-400",    textColor: "text-gray-400",    hex: "#9E9E9E" },
  { level: 2, title: "Amateur",  minPoints: 250,  maxPoints: 599,   color: "bg-green-500",   textColor: "text-green-400",   hex: "#4CAF50" },
  { level: 3, title: "Semi-Pro", minPoints: 600,  maxPoints: 1199,  color: "bg-blue-500",    textColor: "text-blue-400",    hex: "#2196F3" },
  { level: 4, title: "Pro",      minPoints: 1200, maxPoints: 2199,  color: "bg-purple-500",  textColor: "text-purple-400",  hex: "#9C27B0" },
  { level: 5, title: "Elite",    minPoints: 2200, maxPoints: 3999,  color: "bg-orange-500",  textColor: "text-orange-400",  hex: "#FF9800" },
  { level: 6, title: "Champion", minPoints: 4000, maxPoints: 99999, color: "bg-accent",    textColor: "text-accent",    hex: "var(--accent)" },
];

function getLevelForPoints(points: number): PlayerLevel {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].minPoints) return LEVELS[i];
  }
  return LEVELS[0];
}

// ─── TYPES ───────────────────────────────────────────────────────────────────

type Tab = "Overview"  | "Notification history";

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export function PlayerProfilePage() {
  const { user, signOut } = useAuth();

  // ── State ──────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving]   = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Profile data
  const [fullName, setFullName]   = useState("");
  const [phone, setPhone]         = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [points, setPoints]       = useState(0);
  const [bookings, setBookings]   = useState(0);
  const [wins, setWins]           = useState(0);

  // Notification history
  const [notificationHistory, setNotificationHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Data Fetching ──────────────────────────────────────────────────────────

  useEffect(() => {
    fetchProfile();
  }, [user]);

  async function fetchProfile() {
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
        setPhone(profile.phone ?? user.user_metadata?.phone ?? "");
        setAvatarUrl(profile.avatar_url ?? null);
        setPoints(profile.points ?? 0);
      }

      // Bookings count
      const { data: bookingsList } = await supabase
        .from("bookings")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "confirmed");
      setBookings(bookingsList?.length ?? 0);

      // Wins count
      try {
        const { data: winsList } = await supabase
          .from("matches")
          .select("id")
          .eq("winner_id", user.id);
        setWins(winsList?.length ?? 0);
      } catch {
        // matches table may not exist yet
      }
    } catch (e) {
      toast.error("Error loading profile");
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchNotificationHistory() {
    if (!user) return;
    setHistoryLoading(true);
    try {
      const data = await notificationService.getMyNotifications();
      setNotificationHistory(data || []);
    } catch (e) {
      console.error("Error fetching notification history:", e);
    } finally {
      setHistoryLoading(false);
    }
  }

  useEffect(() => {
    if (activeTab === "Notification history") {
      fetchNotificationHistory();
    }
  }, [activeTab]);

  // ── Actions ───────────────────────────────────────────────────────────────

  async function handleUpdateProfile() {
    if (!user) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.from("profiles").update({
        full_name: fullName,
        phone: phone,
      }).eq("id", user.id);

      if (error) throw error;

      await supabase.auth.updateUser({
        data: { full_name: fullName, phone: phone }
      });

      toast.success("Profile updated successfully!");
    } catch (e: any) {
      toast.error(e.message || "Update failed");
    } finally {
      setIsSaving(false);
    }
  }

  // ── Avatar Upload ──────────────────────────────────────────────────────────

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

  // ── Computed ───────────────────────────────────────────────────────────────

  const currentLevel  = getLevelForPoints(points);
  const nextLevel     = LEVELS.find((l) => l.level === currentLevel.level + 1) ?? currentLevel;
  const isMaxLevel    = currentLevel.level === LEVELS[LEVELS.length - 1].level;
  const progressRatio = isMaxLevel
    ? 1
    : (points - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints);
  const initials = fullName ? fullName[0].toUpperCase() : "P";

  // ── Render ─────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin border-accent"
        />
      </div>
    );
  }

  return (
        <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-500 px-4">
      {/* ── HERO HEADER ───────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-[32px] mb-6 bg-gradient-to-b from-accent to-background">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 pt-8 pb-4">
          <div className="flex items-center gap-1.5 bg-black/10 rounded-full px-4 py-2 backdrop-blur-md">
            <Trophy className="w-3.5 h-3.5 text-black" />
            <span className="text-black text-[10px] font-black uppercase tracking-widest">Player</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-black/10 px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-md">
               <Bolt className="fill-black" size={16} />
               <span className="text-sm font-black text-black">{points} Pts</span>
            </div>
          </div>
        </div>

      {/* Avatar & Info Wrapper */}
        <div className="flex flex-col md:flex-row items-center md:items-start md:px-10 pt-4 pb-8 md:gap-12">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="relative group"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-[3px] border-black shadow-2xl overflow-hidden bg-black/20 flex items-center justify-center transition-transform group-hover:scale-105">
                {isUploading ? (
                  <Loader2 className="w-6 h-6 md:w-8 md:h-8 text-black animate-spin" />
                ) : avatarUrl ? (
                  <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-black font-black text-4xl md:text-5xl">{initials}</span>
                )}
              </div>
              {/* Camera badge */}
              <div className="absolute bottom-0.5 right-0.5 md:bottom-2 md:right-2 w-7 h-7 md:w-9 md:h-9 rounded-full bg-black border-2 border-accent flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                <Camera className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent" />
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            {avatarUrl && (
              <button
                onClick={handleRemovePhoto}
                className="mt-3 text-xs font-bold text-red-600 bg-red-100/50 hover:bg-red-200/50 px-3 py-1 rounded-full transition-all"
              >
                Remove Photo
              </button>
            )}
          </div>

          {/* Info Section */}
          <div className="flex flex-col items-center md:items-start flex-1 w-full mt-4 md:mt-2">
            {/* Name */}
            <h1 className="text-black font-black text-2xl md:text-4xl leading-none text-center md:text-left">
              {fullName || "Player"}
            </h1>

            {/* Level badge */}
            <div className="mt-2 md:mt-3 flex items-center gap-1.5 bg-black/15 rounded-full px-3 py-1.5">
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-black text-[11px] md:text-xs font-black tracking-widest uppercase">
                LVL {currentLevel.level} · {currentLevel.title}
              </span>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-end w-full gap-6 md:gap-12 mt-5 md:mt-8">
              {/* Stats row */}
              <div className="flex items-center gap-0 w-full max-w-xs md:max-w-sm px-6 md:px-0">
                <StatChip icon={<Bolt className="w-4 h-4 md:w-5 md:h-5 text-black" />} value={points} label="POINTS" />
                <div className="w-px h-9 md:h-12 bg-black/20 mx-2 md:mx-4" />
                <StatChip icon={<Calendar className="w-4 h-4 md:w-5 md:h-5 text-black" />} value={bookings} label="BOOKINGS" />
                <div className="w-px h-9 md:h-12 bg-black/20 mx-2 md:mx-4" />
                <StatChip icon={<Trophy className="w-4 h-4 md:w-5 md:h-5 text-black" />} value={wins} label="WINS" />
              </div>

              {/* XP Progress bar */}
              <div className="w-full max-w-xs md:max-w-md px-6 md:px-0 flex-1">
                <div className="flex justify-between mb-1.5 md:mb-2">
                  <span className="text-black/60 text-[10px] md:text-xs font-bold uppercase">
                    {currentLevel.title} LVL {currentLevel.level}
                  </span>
                  <span className="text-black/60 text-[10px] md:text-xs font-bold uppercase">
                    {nextLevel.title} LVL {nextLevel.level}
                  </span>
                </div>
                <div className="w-full h-[7px] md:h-[10px] rounded-full bg-black/15 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progressRatio * 100, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    className="h-full bg-black rounded-full"
                  />
                </div>
                {!isMaxLevel && (
                  <p className="text-black/60 text-[10px] md:text-xs mt-1 md:mt-2 text-center md:text-left">
                    {nextLevel.minPoints - points} pts to next level
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
 
     
     
      <div className="flex bg-card border border-border rounded-[22px] p-1.5 mb-8 overflow-x-auto no-scrollbar shadow-sm">
        {(["Overview", "Notification history"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 min-w-max px-6 py-3 rounded-[16px] text-[10px] md:text-[11px] font-black tracking-[2px] uppercase transition-all relative ${
              activeTab === tab ? "text-black" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="tab-pill"
                className="absolute inset-0 rounded-[16px] bg-[#CCFF00]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "Overview" ? (
          <OverviewTab 
            points={points} 
            currentLevel={currentLevel} 
            notificationHistory={notificationHistory} 
            wins={wins} 
            bookings={bookings} 
            setActiveTab={setActiveTab} 
          />
        ) : (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-6 space-y-6"
          >
             <NotificationHistoryTab 
                notifications={notificationHistory}
                isLoading={historyLoading}
                onRefresh={fetchNotificationHistory}
                onMarkAsRead={async (id) => {
                  await notificationService.markAsRead(id);
                  setNotificationHistory(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
                }}
                onRespond={async (id, action) => {
                  try {
                    await notificationService.respondToNotification(id, action);
                    fetchNotificationHistory();
                  } catch (error) { console.error(error); }
                }}
              />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
    </div>
  );
}

// ─── STAT CHIP ───────────────────────────────────────────────────────────────

function StatChip({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="flex-1 flex flex-col items-center">
      {icon}
      <span className="text-foreground font-black text-xl md:text-2xl leading-none mt-0.5">{value}</span>
      <span className="text-muted-foreground text-[9px] md:text-[10px] font-bold tracking-[1.5px] uppercase mt-0.5 text-center">{label}</span>
    </div>
  );
}

// ─── SECTION HEADER ───────────────────────────────────────────────────────────

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="text-accent">{icon}</div>
      <span className="text-[10px] font-black uppercase tracking-[2px] text-muted-foreground">
        {title}
      </span>
    </div>
  );
}

// ─── OVERVIEW TAB ────────────────────────────────────────────────────────────

function OverviewTab({
  points,
  currentLevel,
  notificationHistory,
  wins,
  bookings,
  setActiveTab
}: {
  points: number;
  currentLevel: PlayerLevel;
  notificationHistory: any[];
  wins: number;
  bookings: number;
  setActiveTab: (tab: Tab) => void;
}) {
  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-12"
    >
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <StatSquare icon={<Bolt size={24} />} value={points} label="Total Points" />
        <StatSquare icon={<Bell size={24} />} value={notificationHistory.length} label="Activity" color="#FFD700" />
        <StatSquare icon={<Trophy size={24} />} value={wins} label="Match Wins" color="#C0C0C0" />
        <StatSquare icon={<Calendar size={24} />} value={bookings} label="Court Bookings" color="#ADD8E6" />
      </div>

      <div className="space-y-16">
        {/* Row 1: Game Profile & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
           <section>
              <SectionHeader icon={<Search className="w-4 h-4" />} title="Game Profile" />
              <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-xl">
                 <InfoRow icon={<Search size={18} />} label="Sport" value="Padel" />
                 <InfoRow icon={<Flag size={18} />} label="Total Played" value={wins} />
                 <InfoRow icon={<Star size={18} />} label="Rank" value={currentLevel.title} />
                 <InfoRow icon={<Calendar size={18} />} label="Confirmed" value={bookings} isLast />
              </div>
           </section>
        </div>

        {/* Row 2: Ranks & Progression (Full Width) */}
        <section>
           <SectionHeader icon={<Trophy className="w-5 h-5" />} title="Ranks & Global Progression" />
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/20 p-8 rounded-[40px] border border-border shadow-inner">
             {LEVELS.map((lvl) => {
               const isCurrentLevel = lvl.level === currentLevel.level;
               const isUnlocked     = points >= lvl.minPoints;

               return (
                 <motion.div
                   key={lvl.level}
                   whileHover={{ scale: 1.01 }}
                   className={`flex items-center gap-6 p-6 rounded-[28px] border transition-all ${
                     isCurrentLevel 
                       ? "bg-accent/10 border-accent/40 shadow-[0_0_30px_rgba(204,255,0,0.1)]" 
                       : isUnlocked 
                         ? "bg-card border-border" 
                         : "bg-muted/10 border-border opacity-50"
                   }`}
                 >
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl ${isUnlocked ? 'bg-background border border-border' : 'bg-muted/20'}`}>
                      {isUnlocked ? (
                        <span className="font-black text-2xl" style={{ color: lvl.hex }}>{lvl.level}</span>
                      ) : (
                        <Lock className="w-6 h-6 text-muted-foreground/20" />
                      )}
                   </div>
                   <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className={`text-sm md:text-base font-black uppercase tracking-wider ${isUnlocked ? 'text-foreground' : 'text-muted-foreground/30'}`}>{lvl.title}</span>
                        {isCurrentLevel && <span className="text-[8px] bg-accent text-black px-2 py-1 rounded-lg font-black uppercase shadow-[0_0_10px_rgba(204,255,0,0.5)]">Current Rank</span>}
                      </div>
                      <div className="flex items-center gap-4 mt-1.5">
                         <p className="text-xs opacity-40 font-bold">{lvl.minPoints} Points Required</p>
                         {isUnlocked && !isCurrentLevel && <ShieldCheck size={16} className="text-accent opacity-30" />}
                      </div>
                   </div>
                 </motion.div>
               );
             })}
           </div>
        </section>

        {/* Row 3: How to Earn Points (Full Width) */}
        <section>
           <SectionHeader icon={<Bolt className="w-5 h-5" />} title="How to Earn Points" />
           <div className="bg-card border border-border rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
             {/* Decorative background element */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] -mr-32 -mt-32 rounded-full" />
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                <PointsGuideCard icon={<Calendar size={28} />} label="Court Booking" sub="Confirmed and played" pts="+3 pts" color="#3B82F6" />
                <PointsGuideCard icon={<Trophy size={28} />} label="Match Victory" sub="Win against opponents" pts="+10 pts" color="#CCFF00" />
                <PointsGuideCard icon={<Users size={28} />} label="Tournament" sub="Entry and participation" pts="+15 pts" color="#C084FC" />
                <PointsGuideCard icon={<Star size={28} />} label="Perfect Score" sub="Flawless performance" pts="+20 pts" color="#FACC15" />
             </div>
           </div>
        </section>
      </div>
    </motion.div>
  );
}

// ─── NOTIFICATION HISTORY TAB ──────────────────────────────────────────────────

function NotificationHistoryTab({
  notifications,
  isLoading,
  onRefresh,
  onMarkAsRead,
  onRespond,
}: {
  notifications: any[];
  isLoading: boolean;
  onRefresh: () => void;
  onMarkAsRead: (id: string) => Promise<void>;
  onRespond: (id: string, action: 'confirm' | 'decline') => Promise<void>;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeader icon={<Bell className="w-3.5 h-3.5" />} title="NOTIFICATION HISTORY" />
        <button 
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-[24px] border-dashed">
          <Loader2 className="w-8 h-8 text-accent animate-spin mb-4" />
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Loading history...</p>
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n) => (
            <motion.div 
              key={n.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-[24px] border transition-all flex items-start gap-4 ${
                n.read 
                  ? "bg-card/40 border-border/50 opacity-60" 
                  : "bg-card border-accent/20 shadow-lg shadow-accent/5"
              }`}
            >
              <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${n.read ? "bg-muted-foreground/30" : "bg-accent shadow-[0_0_10px_rgba(204,255,0,0.5)]"}`} />
              <div className="flex-1">
                <p className={`text-sm font-medium leading-relaxed ${n.read ? "text-muted-foreground" : "text-foreground"}`}>
                  {n.message}
                </p>

                {n.type === 'student_assignment' && !n.read && (
                  <div className="flex gap-2 mt-4 mb-2">
                    <button 
                      onClick={() => onRespond(n.id, 'confirm')}
                      className="px-6 py-2 bg-accent text-accent-foreground rounded-xl text-[10px] font-black uppercase tracking-wider hover:scale-[1.02] transition-all flex items-center gap-1.5"
                    >
                      <Check size={14} strokeWidth={3} /> Confirm
                    </button>
                    <button 
                      onClick={() => onRespond(n.id, 'decline')}
                      className="px-6 py-2 bg-muted text-foreground rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-red-500/10 hover:text-red-500 transition-all flex items-center gap-1.5"
                    >
                      <X size={14} strokeWidth={3} /> Decline
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-3 mt-2.5">
                  <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest flex items-center gap-1.5">
                    <Clock size={11} />
                    {new Date(n.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
              {!n.read && (
                <button 
                  onClick={() => onMarkAsRead(n.id)}
                  className="p-2 rounded-xl bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground transition-all"
                  title="Mark as read"
                >
                  <Check size={16} />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-card border border-border rounded-[24px] border-dashed">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="text-muted-foreground/30" size={32} />
          </div>
          <p className="text-muted-foreground text-sm font-medium">Your notification history is empty</p>
          <button 
            onClick={onRefresh}
            className="mt-5 px-6 py-2.5 bg-muted hover:bg-muted/80 text-foreground font-black text-[10px] uppercase tracking-widest rounded-full border border-border transition-all"
          >
            Check for activity
          </button>
        </div>
      )}
    </div>
  );
}

// ─── HELPERS ───────────────────────────────────────────────────────────────

function PointsGuideCard({
  icon,
  label,
  sub,
  pts,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  pts: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-muted/20 border border-border rounded-[32px] hover:bg-muted/30 hover:border-accent/20 transition-all group">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-xl"
        style={{ 
          background: `color-mix(in srgb, ${color}, transparent 90%)`, 
          color 
        }}
      >
        {icon}
      </div>
      <h4 className="text-foreground font-black text-sm uppercase tracking-wider mb-1">{label}</h4>
      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-4">{sub}</p>
      <span className="text-2xl font-black" style={{ color }}>
        {pts}
      </span>
    </div>
  );
}

function PointsRow({
  icon,
  label,
  pts,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  pts: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div
        className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
        style={{ 
          background: color.startsWith('var')
            ? `color-mix(in srgb, ${color}, transparent 90%)`
            : `${color}18`, 
          color 
        }}
      >
        {icon}
      </div>
      <span className="flex-1 text-foreground text-sm font-semibold">{label}</span>
      <span className="font-black text-base" style={{ color }}>
        {pts}
      </span>
    </div>
  );
}

function StatSquare({ icon, value, label, color = "var(--accent)" }: { icon: React.ReactNode; value: number | string; label: string; color?: string }) {
  return (
    <div className="bg-card border border-border rounded-[24px] p-4 flex flex-col items-center gap-1 group hover:border-accent/30 transition-all">
       <div className="p-2.5 rounded-xl bg-muted/50 group-hover:scale-110 transition-transform" style={{ color }}>
          {icon}
       </div>
       <span className="text-lg font-black mt-1 leading-none">{value}</span>
       <span className="text-[9px] font-bold uppercase tracking-widest opacity-30">{label}</span>
    </div>
  );
}

function InfoRow({ icon, label, value, isLast = false }: { icon: React.ReactNode; label: string; value?: string | number; isLast?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-6 py-5 group hover:bg-muted/20 transition-colors ${!isLast ? 'border-b border-border' : ''}`}>
       <div className="flex items-center gap-4">
          <div className="text-accent opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
             {icon}
          </div>
          <span className="text-sm font-bold opacity-80 group-hover:opacity-100 text-foreground">{label}</span>
       </div>
       {value !== undefined && (
          <span className="text-sm font-black opacity-90">{value}</span>
       )}
    </div>
  );
}

function SwitchRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors">
      <span className="text-foreground text-sm font-medium">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
          checked ? "bg-accent" : "bg-muted"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
          style={checked ? { background: "#000" } : {}}
        />
      </button>
    </div>
  );
}
