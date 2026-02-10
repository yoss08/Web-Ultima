import { useState } from "react";
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
  Dumbbell,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../services/AuthContext";
import { useTheme } from "../../styles/useTheme";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
  { icon: Zap, label: "Live Matches", path: "/dashboard/live-matches" },
  { icon: Grid3X3, label: "Courts Management", path: "/dashboard/courts" },
  { icon: BarChart3, label: "Analytics", path: "/dashboard/analytics" },
  { icon: Droplet, label: "Hydration", path: "/dashboard/hydration" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

export function DashboardLayout() {
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, setIsDark } = useTheme();

  // Fonction pour obtenir les infos du badge selon le rôle
  const getRoleBadge = () => {
    const role = user?.role?.toLowerCase();
    switch (role) {
      case 'admin':
      case 'facility':
        return { icon: ShieldCheck, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/30" };
      case 'coach':
        return { icon: Dumbbell, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/30" };
      default: 
        return { icon: Trophy, color: "text-[#39FF14]", bg: "bg-[#39FF14]/20", border: "border-[#39FF14]" };
  };
} 
  const badge = getRoleBadge();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? "bg-[#0A0E1A]" : "bg-gray-50"
    }`}>
      {/* Top Bar */}
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
                <X className="w-5 h-5 text-white dark:text-[#0A0E1A]" />
              ) : (
                <Menu className="w-5 h-5 text-white dark:text-[#0A0E1A]" />
              )}
            </button>

            <Link to="/">
              <h1
                className="font-['Playfair_Display',serif] font-bold text-[28px] text-[#0A0E1A] dark:text-white cursor-pointer hover:opacity-80 transition-opacity"
              >
                ULTIMA
              </h1>
            </Link>
          </div>
        
          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="flex items-center justify-center w-10 h-10 rounded-[12px] transition-colors"
                style={{
                background: isDark 
              ? 'linear-gradient(135deg, #39FF14/20, #00E5FF/20)' 
              : 'linear-gradient(135deg, #39FF14/10, #00E5FF/10)'
          }}
            >
             {isDark ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
            </button>

            {/* Notifications */}
            <button className="flex items-center justify-center w-10 h-10 rounded-[12px] hover:bg-white/10 dark:hover:bg-[#0A0E1A]/10 transition-colors relative">
              <Bell className="w-5 h-5 text-[#0A0E1A] dark:text-white" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#39FF14] rounded-full"></span>
            </button>

            {/* User Profile Link to Settings */}
            <Link 
              to="/dashboard/settings" 
              className="flex items-center gap-3 pl-2 pr-4 h-12 rounded-[16px] hover:bg-white/10 dark:hover:bg-[#0A0E1A]/10 transition-all border border-transparent hover:border-white/10 group"
            >
              <div className={`w-9 h-9 rounded-full ${badge.bg} border ${badge.border} flex items-center justify-center transition-transform group-hover:scale-105`}>
                <badge.icon className={`w-5 h-5 ${badge.color}`} />
              </div>

              <div className="hidden sm:flex flex-col items-start text-left">
                <span className={`font-['Poppins',sans-serif] text-[14px] font-bold ${
                                      isDark ? "text-white" : "text-[#0A0E1A]"
                                      } leading-tight`}>
                                      {user?.fullName || "User"}
                </span>
                <span className={`text-[10px] uppercase tracking-wider font-bold ${badge.color}`}>
                  {user?.role || "Player"}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Sidebar - Desktop */}
      <aside
        className={`hidden lg:block fixed top-16 left-0 bottom-0 backdrop-blur-xl border-r transition-all duration-300 z-40 ${
        sidebarOpen ? "w-64" : "w-20"
      } ${
        isDark 
          ? "bg-black/80 border-white/10" 
          : "bg-white/90 border-[#0A0E1A]/10"
      }`}
      >
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Correction de "active"
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 h-12 rounded-[12px] transition-all group ${
                  active
                    ? isDark
                      ? "bg-gradient-to-r from-[#39FF14]/20 to-[#00E5FF]/20 border border-[#39FF14]/40"
                      : "bg-gradient-to-r from-[#39FF14]/15 to-[#00E5FF]/15 border border-[#39FF14]/30"
                    : isDark
                    ? "hover:bg-white/5 hover:border hover:border-white/10"
                    : "hover:bg-[#0A0E1A]/5 hover:border hover:border-gray-200"
                }`}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition-colors ${
                    active
                      ? "text-[#39FF14]"
                      : isDark 
                        ? "text-white/70 group-hover:text-[#39FF14]" 
                        : "text-gray-600 group-hover:text-[#39FF14]"
                  }`}
                />
                {sidebarOpen && (
                  <span
                    className={`font-['Poppins',sans-serif] text-[14px] font-medium transition-colors ${
                      active
                        ? "text-[#39FF14]"
                        : isDark 
                          ? "text-white/90 group-hover:text-[#39FF14]" 
                          : "text-gray-800 group-hover:text-[#39FF14]"
                    }`}
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Logout */}
          <Link
            to="/"
            onClick={handleSignOut}
            className={`flex items-center gap-3 px-4 h-12 rounded-[12px] transition-all mt-8 group ${
              isDark
                ? "hover:bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:border hover:border-red-500/40"
                : "hover:bg-gradient-to-r from-red-500/15 to-pink-500/15 hover:border hover:border-red-500/30"
            }`}
          >
            <LogOut className={`w-5 h-5 transition-colors ${
              isDark ? "text-red-400 group-hover:text-red-500" : "text-red-500"
            }`} />
            {sidebarOpen && (
              <span className={`font-['Poppins',sans-serif] text-[14px] font-medium ${
                isDark ? "text-red-400 group-hover:text-red-500" : "text-red-600"
              }`}>
                Logout
              </span>
            )}
          </Link>
        </nav>
      </aside>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-white/95 dark:bg-[#0A0E1A]/95 backdrop-blur-xl z-40">
          <nav className="p-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 h-12 rounded-[12px] transition-all ${
                    active
                      ? "bg-[#39FF14]/10 border border-[#39FF14]/30"
                      : "hover:bg-black/10 dark:hover:bg-[#0A0E1A]/10"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      active
                        ? "text-[#39FF14]"
                        : "text-[#0A0E1A]/60 dark:text-white/60"
                    }`}
                  />
                  <span
                    className={`font-['Poppins',sans-serif] text-[14px] font-medium ${
                      active
                        ? "text-[#39FF14]"
                        : "text-[#0A0E1A] dark:text-white"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main
        className={`pt-16 ${isDark ? "text-white" : "text-[#0A0E1A]"} transition-all duration-300 ${
          sidebarOpen ? "lg:pl-64" : "lg:pl-20"
        }`}
      >
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}