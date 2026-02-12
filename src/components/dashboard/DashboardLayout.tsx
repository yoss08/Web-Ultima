import { useState, useRef, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Zap,
  Grid3X3,
  BarChart3,
  Droplet,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Sun,
  Moon,
  Trophy,
  ShieldCheck,
  Dumbbell,
  User,
  Users,
  CalendarDays, 
  ClipboardList,
} from "lucide-react";
import { useAuth } from "../../services/AuthContext";
import { useTheme } from "../../styles/useTheme";

export function DashboardLayout() {
  const { user, signOut } = useAuth();
  const { isDark, setIsDark } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const role = user?.user_metadata?.account_type || "Player";


  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };
  const navItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },

    // MENU JOUEUR (Basé sur vos fichiers folder 'player')
    ...(role === "Player" ? [
      { icon: Zap, label: "My Matches", path: "/dashboard/live-matches" },
      { icon: Trophy, label: "Competitions", path: "/dashboard/competitions" },
      { icon: Grid3X3, label: "Court Booking", path: "/dashboard/courts" },
      { icon: BarChart3, label: "My Stats", path: "/dashboard/analytics" },
    ] : []),

    // MENU COACH (Basé sur vos fichiers folder 'coach')
    ...(role === "Coach" ? [
      { icon: Users, label: "My Students", path: "/dashboard/coach/students" },
      { icon: CalendarDays, label: "Schedule Session", path: "/dashboard/coach/schedule" },
      { icon: BarChart3, label: "Student Analytics", path: "/dashboard/coach/students/:id" },
      { icon: Zap, label: "Live Matches", path: "/dashboard/live-matches" },
    ] : []),

    // MENU ADMIN (Basé sur vos fichiers folder 'admin')
    ...(role === "Admin" ? [
      { icon: Zap, label: "Live Matches", path: "/dashboard/live-matches" },
      { icon: Grid3X3, label: "Court Management", path: "/dashboard/courts" },
      { icon: BarChart3, label: "System Analytics", path: "/dashboard/analytics" },
    ] : []),

    { icon: Droplet, label: "Hydration", path: "/dashboard/hydration" },
    { icon: User, label: "Profile", path: "/dashboard/profile" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const activities = [];

  const getRoleBadge = () => {
    const role = user?.role?.toLowerCase();
    switch (role) {
      case 'admin':
        return { icon: ShieldCheck, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/30" };
      case 'coach':
        return { icon: Dumbbell, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/30" };
      default: 
        return { icon: Trophy, color: "text-[#39FF14]", bg: "bg-[#39FF14]/20", border: "border-[#39FF14]" };
  };
  } 
  const badge = getRoleBadge();
  return (
    <div className={`min-h-screen ${isDark ? "bg-[#0A0E1A]" : "bg-gray-50"} transition-colors duration-300`}>
      {/* Top Navigation Bar */}
      <header className={`fixed top-0 left-0 right-0 h-16 backdrop-blur-xl border-b z-50 ${
        isDark 
          ? "bg-black/80 border-white/10" 
          : "bg-white/90 border-[#0A0E1A]/10"
      }`}>
        <div className="h-full px-6 flex items-center justify-between">
          {/* Left: Menu Toggle + Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex items-center justify-center w-10 h-10 rounded-[12px] hover:bg-white/10 dark:hover:bg-[#0A0E1A]/10 transition-colors"
            >
              <Menu className={`w-5 h-5 ${isDark ? "text-white" : "text-[#0A0E1A]"}`} />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-[12px] hover:bg-white/10 dark:hover:bg-[#0A0E1A]/10 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[#0A0E1A] dark:text-white" />
              ) : (
                <Menu className="w-5 h-5 text-[#0A0E1A] dark:text-white" />
              )}
            </button>

            <Link to="/">
              <h1
                className="font-['Arial',sans-serif] font-bold text-[24px] text-gray-900 dark:text-white tracking-[1.2px] transition-colors duration-300"
              >
                ULTIMA
              </h1>
            </Link>
          </div>
        
          {/* Right: Actions */}
          <div className="flex items-center gap-3">

              {/* Notifications */}
<div className="relative" ref={notificationRef}>
  <button 
    onClick={() => setNotificationsOpen(!notificationsOpen)}
    className={`flex items-center justify-center w-10 h-10 rounded-[12px] transition-colors relative ${
      notificationsOpen ? "bg-[#39FF14]/10" : "hover:bg-black/5 dark:hover:bg-white/10"
    }`}
  >
    <Bell className={`w-5 h-5 ${isDark ? "text-white" : "text-[#0A0E1A]"}`} />
    {/* On n'affiche la pastille verte que s'il y a des activités */}
    {activities.length > 0 && (
      <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#39FF14] rounded-full border-2 border-black"></span>
    )}
  </button>

  {/* Dropdown Menu */}
  {notificationsOpen && (
    <div className={`absolute right-0 mt-3 w-80 rounded-[24px] shadow-2xl border backdrop-blur-xl z-[100] animate-in fade-in zoom-in duration-200 ${
      isDark ? "bg-black/95 border-white/10 shadow-black/50" : "bg-white border-gray-200"
    }`}>
      <div className="p-5 border-b border-gray-100 dark:border-white/10 flex justify-between items-center">
        <h3 className={`font-bold text-sm ${isDark ? "text-white" : "text-[#0A0E1A]"}`}>
          Notifications
        </h3>
        <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">
          Feed
        </span>
      </div>

      <div className="py-8 px-6 flex flex-col items-center justify-center text-center">
        {activities.length > 0 ? (
          /* Liste des activités si elles existent */
          <div className="w-full">
            {/* ... map des activités ... */}
          </div>
        ) : (
          /* ÉTAT VIDE (NULL) */
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto">
              <Bell className="w-8 h-8 text-gray-300 dark:text-white/20" />
            </div>
            <div className="space-y-1">
              <p className={`font-semibold text-sm ${isDark ? "text-white" : "text-[#0A0E1A]"}`}>
                All caught up!
              </p>
              <p className="text-xs text-gray-400 max-w-[180px] mx-auto leading-relaxed">
                Matches and competitions will appear here once the season starts.
              </p>
            </div>
          </div>
        )}
      </div>

      {activities.length > 0 && (
        <Link 
          to="/dashboard/notifications" 
          onClick={() => setNotificationsOpen(false)}
          className="block p-4 text-center text-xs font-bold text-[#39FF14] hover:bg-[#39FF14]/5 transition-colors border-t border-white/5 rounded-b-[24px]"
        >
          View All Activity
        </Link>
      )}
    </div>
  )}
</div>
            {/* User Profile */}
            <Link 
              to="/dashboard/profile" 
              className="flex items-center gap-3 pl-2 pr-4 h-12 rounded-[16px] hover:bg-white/10 dark:hover:bg-[#0A0E1A]/10 transition-all border border-transparent hover:border-white/10 group"
            >
              <div className={`w-9 h-9 rounded-full ${badge.bg} border ${badge.border} flex items-center justify-center transition-transform group-hover:scale-105`}>
                <badge.icon className={`w-5 h-5 ${badge.color}`} />
              </div>

              <div className="hidden sm:flex flex-col items-start text-left">
                <span className={`font-['Poppins',sans-serif] text-[14px] font-bold ${
                                      isDark ? "text-white" : "text-[#0A0E1A]"
                                      } leading-tight`}>
                                      {user?.user_metadata?.full_name || "User"}
                </span>
                <span className={`text-[10px] uppercase tracking-wider font-bold ${badge.color}`}>
                  {user?.user_metadata?.account_type || "Player"}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 w-64 ${isDark ? "bg-[#0A0E1A] border-white/10" : "bg-white border-gray-200"} border-r z-40 transition-transform duration-300 transform hidden lg:block ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        <nav className="flex-1 px-4 space-y-2 py-6">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 h-12 rounded-[12px] transition-all ${
                  active
                    ? "bg-[#39FF14]/10 border border-[#39FF14]/30"
                    : "hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    active ? "text-[#39FF14]" : isDark ? "text-white/60" : "text-[#0A0E1A]/60"
                  }`}
                />
                <span
                  className={`font-['Poppins'] text-[14px] font-medium ${
                    active ? "text-[#39FF14]" : isDark ? "text-white" : "text-[#0A0E1A]"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 h-12 w-full rounded-[12px] text-red-500 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={20} />
            <span className="font-['Poppins'] text-[14px] font-medium">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar (Overlay) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <nav className={`absolute left-0 top-0 bottom-0 w-72 ${isDark ? "bg-[#0A0E1A]" : "bg-white"} p-6 shadow-2xl`}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#39FF14] rounded-lg flex items-center justify-center font-bold text-black">A</div>
                <span className={`font-['Playfair_Display'] font-bold text-xl ${isDark ? "text-white" : "text-[#0A0E1A]"}`}>ALMUS</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className={isDark ? "text-white" : "text-black"}>
                <X size={24} />
              </button>
            </div>
            <div className="space-y-2">
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 h-12 rounded-[12px] ${
                      active ? "bg-[#39FF14]/10 border border-[#39FF14]/30 text-[#39FF14]" : isDark ? "text-white/60" : "text-[#0A0E1A]/60"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-['Poppins'] text-[14px] font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main
        className={`pt-16 min-h-screen transition-all duration-300 ${
          sidebarOpen ? "lg:pl-64" : "lg:pl-0"
        }`}
      >
        <div className="p-4 lg:p-8 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}