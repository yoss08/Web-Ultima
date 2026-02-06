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
  User,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../../services/AuthContext";

interface DashboardLayoutProps {
  isDark: boolean;
  setIsDark: (value: boolean) => void;
}

const navItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
  { icon: Zap, label: "Live Matches", path: "/dashboard/live-matches" },
  { icon: Grid3X3, label: "Courts Management", path: "/dashboard/courts" },
  { icon: BarChart3, label: "Analytics", path: "/dashboard/analytics" },
  { icon: Droplet, label: "Hydration", path: "/dashboard/hydration" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

export function DashboardLayout({ isDark, setIsDark }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] dark:bg-gray-50 transition-colors duration-300">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-black/80 dark:bg-white/90 backdrop-blur-xl border-b border-white/10 dark:border-[#0A0E1A]/10 z-50">
        <div className="h-full px-6 flex items-center justify-between">
          {/* Left: Menu Toggle + Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex items-center justify-center w-10 h-10 rounded-[12px] hover:bg-white/10 dark:hover:bg-[#0A0E1A]/10 transition-colors"
            >
              <Menu className="w-5 h-5 text-white dark:text-[#0A0E1A]" />
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
                className="font-['Playfair_Display',serif] font-bold text-[28px] text-white dark:text-[#0A0E1A] cursor-pointer hover:opacity-80 transition-opacity"
                style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
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
              className="flex items-center justify-center w-10 h-10 rounded-[12px] hover:bg-white/10 dark:hover:bg-[#0A0E1A]/10 transition-colors"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-white dark:text-[#0A0E1A]" />
              ) : (
                <Moon className="w-5 h-5 text-white dark:text-[#0A0E1A]" />
              )}
            </button>

            {/* Notifications */}
            <button className="flex items-center justify-center w-10 h-10 rounded-[12px] hover:bg-white/10 dark:hover:bg-[#0A0E1A]/10 transition-colors relative">
              <Bell className="w-5 h-5 text-white dark:text-[#0A0E1A]" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#39FF14] rounded-full"></span>
            </button>

            {/* User Profile */}
            <button className="flex items-center gap-3 pl-3 pr-4 h-10 rounded-[12px] hover:bg-white/10 dark:hover:bg-[#0A0E1A]/10 transition-colors">
              <div className="w-8 h-8 rounded-full bg-[#39FF14]/20 border border-[#39FF14] flex items-center justify-center">
                <User className="w-4 h-4 text-[#39FF14]" />
              </div>
              <span className="hidden sm:block font-['Poppins',sans-serif] text-[14px] font-medium text-white dark:text-[#0A0E1A]">
                John Doe
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar - Desktop */}
      <aside
        className={`hidden lg:block fixed top-16 left-0 bottom-0 bg-black/80 dark:bg-white/90 backdrop-blur-xl border-r border-white/10 dark:border-[#0A0E1A]/10 transition-all duration-300 z-40 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 h-12 rounded-[12px] transition-all ${
                  active
                    ? "bg-[#39FF14]/10 border border-[#39FF14]"
                    : "hover:bg-white/10 dark:hover:bg-[#0A0E1A]/10"
                }`}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    active
                      ? "text-[#39FF14]"
                      : "text-white/60 dark:text-[#0A0E1A]/60"
                  }`}
                />
                {sidebarOpen && (
                  <span
                    className={`font-['Poppins',sans-serif] text-[14px] font-medium ${
                      active
                        ? "text-[#39FF14]"
                        : "text-white dark:text-[#0A0E1A]"
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
            to="/login"
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 h-12 rounded-[12px] hover:bg-red-500/10 hover:border hover:border-red-500 transition-all mt-8"
          >
            <LogOut className="w-5 h-5 text-red-500 flex-shrink-0" />
            {sidebarOpen && (
              <span className="font-['Poppins',sans-serif] text-[14px] font-medium text-red-500">
                Logout
              </span>
            )}
          </Link>
        </nav>
      </aside>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-black/95 dark:bg-white/95 backdrop-blur-xl z-40">
          <nav className="p-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 h-12 rounded-[12px] transition-all ${
                    active
                      ? "bg-[#39FF14]/10 border border-[#39FF14]"
                      : "hover:bg-white/10 dark:hover:bg-[#0A0E1A]/10"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      active
                        ? "text-[#39FF14]"
                        : "text-white/60 dark:text-[#0A0E1A]/60"
                    }`}
                  />
                  <span
                    className={`font-['Poppins',sans-serif] text-[14px] font-medium ${
                      active
                        ? "text-[#39FF14]"
                        : "text-white dark:text-[#0A0E1A]"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}

            {/* Logout */}
            <Link
              to="/login"
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 h-12 rounded-[12px] hover:bg-red-500/10 hover:border hover:border-red-500 transition-all mt-8"
            >
              <LogOut className="w-5 h-5 text-red-500" />
              <span className="font-['Poppins',sans-serif] text-[14px] font-medium text-red-500">
                Logout
              </span>
            </Link>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main
        className={`pt-16 transition-all duration-300 ${
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