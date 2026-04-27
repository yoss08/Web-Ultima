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
  Trophy,
  ShieldCheck,
  Dumbbell,
  Users,
  CalendarDays,
  ClipboardList,
  Crown,
  Building2,
  UserCog,
  BookOpen,
  UserPlus,
  Lock,
  User,
} from "lucide-react";
import { useAuth } from "../../services/AuthContext";
import { useTheme } from "../../styles/useTheme";
import { NotificationBell } from "../shared/NotificationBell";

export function DashboardLayout() {
  const { user, signOut } = useAuth();
  const { isDark, setIsDark } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Resolve role — profile DB takes priority over metadata
  const role = (
    user?.role ??
    user?.user_metadata?.account_type ??
    user?.user_metadata?.accountType ??
    "player"
  ).toLowerCase();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleLogoutClick = () => {
    setShowLogoutAlert(true);
    setMobileMenuOpen(false);
  };

  const handleLogoutConfirm = async () => {
    setShowLogoutAlert(false);
    await signOut();
    navigate("/");
  };

  const handleLogoutCancel = () => {
    setShowLogoutAlert(false);
  };

  // ─── Navigation by role ──────────────────────────────────────
  const navItems = [
    // ── SUPER ADMIN ──────────────────────────────────────────
    ...(role === "super_admin"
      ? [
          {
            icon: LayoutDashboard,
            label: "Overview",
            path: "/dashboard/superadmin/overview",
          },
          {
            icon: Building2,
            label: "Club Management",
            path: "/dashboard/superadmin/clubs",
          },
          {
            icon: UserCog,
            label: "Admin Accounts",
            path: "/dashboard/superadmin/admins",
          },
          {
            icon: Users,
            label: "All Users",
            path: "/dashboard/superadmin/users",
          },
          {
            icon: CalendarDays,
            label: "All Bookings",
            path: "/dashboard/superadmin/bookings",
          },
          {
            icon: Trophy,
            label: "Matches & Competitions",
            path: "/dashboard/superadmin/matches",
          },
          {
            icon: BarChart3,
            label: "Analytics",
            path: "/dashboard/analytics",
          },
        ]
      : []),

    // ── ADMIN (Business Owner) ────────────────────────────────
    ...(role === "admin"
      ? [
          {
            icon: LayoutDashboard,
            label: "Club Overview",
            path: "/dashboard/admin/overview",
          },
          {
            icon: ClipboardList,
            label: "Booking Requests",
            path: "/dashboard/admin/bookings",
          },
          {
            icon: Grid3X3,
            label: "Court Management",
            path: "/dashboard/courts",
          },
           {
            icon: Trophy,
            label: "Competitions ",
            path: "/dashboard/admin/competitions",
          },
          {
            icon: Users,
            label: "Players",
            path: "/dashboard/admin/players",
          },
          {
            icon: Dumbbell,
            label: "Coaches",
            path: "/dashboard/admin/coaches",
          },
        ]
      : []),

    // ── PLAYER ───────────────────────────────────────────────
    ...(role === "player"
      ? [
          { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
          { icon: Zap, label: "Matches & Activity", path: "/dashboard/matches" },
          { icon: Trophy, label: "Competitions", path: "/dashboard/competitions" },
          { icon: Grid3X3, label: "Court Booking", path: "/dashboard/courts" },
        ]
      : []),

    // ── COACH ────────────────────────────────────────────────
    ...(role === "coach"
      ? [
          { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
          { icon: Users, label: "My Students", path: "/dashboard/coach/students" },
          { icon: CalendarDays, label: "Schedule Session", path: "/dashboard/coach/schedule" },
          {
            icon: BarChart3,
            label: "Student Analytics",
            path: "/dashboard/coach/students/:id",
          },
        ]
      : []),

    // ── SHARED (all roles) ────────────────────────────────────
    { icon: Droplet, label: "Hydration", path: "/dashboard/hydration" },
    { icon: User, label: "Profile", path: "/dashboard/profile" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // ─── Role badge config ───────────────────────────────────────
  const getRoleBadge = () => {
    switch (role) {
      case "super_admin":
        return {
          icon: Crown,
          color: "text-yellow-500",
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/30",
          label: "Super Admin",
        };
      case "admin":
        return {
          icon: ShieldCheck,
          color: "text-accent",
          bg: "bg-accent/10",
          border: "border-accent/30",
          label: "Admin",
        };
      case "coach":
        return {
          icon: Dumbbell,
          color: "text-indigo-400",
          bg: "bg-indigo-400/10",
          border: "border-indigo-400/30",
          label: "Coach",
        };
      default:
        return {
          icon: Trophy,
          color: "text-accent",
          bg: "bg-accent/10",
          border: "border-accent/30",
          label: "Player",
        };
    }
  };

  const badge = getRoleBadge();
  const activities: any[] = [];

  const SidebarNavLink = ({
    item,
    onClick,
  }: {
    item: (typeof navItems)[0];
    onClick?: () => void;
  }) => {
    const Icon = item.icon;
    const active = location.pathname === item.path;
    return (
      <Link
        to={item.path}
        onClick={onClick}
        className={`flex items-center gap-3 px-4 h-12 rounded-[12px] transition-all ${
          active ? "bg-accent/10 border border-accent/30" : "hover:bg-accent/5"
        }`}
      >
        <Icon
          className={`w-5 h-5 flex-shrink-0 ${active ? "text-accent" : "text-foreground/60"}`}
        />
        <span
          className={`font-['Poppins',sans-serif] text-[14px] font-medium transition-opacity duration-300 truncate ${
            active ? "text-accent" : "text-foreground"
          } ${sidebarOpen ? "lg:opacity-100 md:hidden lg:block" : "hidden"}`}
        >
          {item.label}
          {(item as any).badge && (
            <span className="ml-1.5 text-[9px] px-1.5 py-0.5 bg-muted border border-border rounded text-muted-foreground font-bold uppercase tracking-wider">
              {(item as any).badge}
            </span>
          )}
        </span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 backdrop-blur-xl border-b z-50 bg-background/80 border-border">
        <div className="h-full px-3 sm:px-6 flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-[12px] hover:bg-accent/5 transition-colors"
            >
              <Menu className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-[12px] hover:bg-accent/5 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
            </button>
            <Link to="/">
              <h1 className="font-['Arial',sans-serif] font-bold text-[24px] text-foreground tracking-[1.2px]">
                ULTIMA
              </h1>
            </Link>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <NotificationBell />

            {/* User Profile */}
            <Link
              to="/dashboard/profile"
              className="flex items-center gap-3 pl-2 pr-4 h-12 rounded-[16px] hover:bg-accent/10 transition-all border border-transparent hover:border-accent/10 group"
            >
              <div
                className={`w-9 h-9 rounded-full ${badge.bg} border ${badge.border} flex items-center justify-center transition-transform group-hover:scale-105`}
              >
                <badge.icon className={`w-5 h-5 ${badge.color}`} />
              </div>
              <div className="hidden sm:flex flex-col items-start text-left max-w-[120px] lg:max-w-none">
                <span className="font-['Poppins',sans-serif] text-[14px] font-bold text-foreground leading-tight truncate">
                  {user?.fullName ?? user?.user_metadata?.full_name ?? "User"}
                </span>
                <span className={`text-[10px] uppercase tracking-wider font-bold ${badge.color}`}>
                  {badge.label}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 bg-background border-border border-r z-40 transition-all duration-300 hidden md:block ${
          sidebarOpen ? "lg:w-64 w-20" : "w-20"
        }`}
      >
        <nav className="p-4 space-y-1 h-full overflow-y-auto pb-8">

          {navItems.map((item) => (
            <SidebarNavLink key={item.path} item={item} />
          ))}

          {/* Logout */}
          <div className="pt-4">
            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-3 px-4 h-12 rounded-[12px] hover:bg-red-500/10 hover:border hover:border-red-500 transition-all"
            >
              <LogOut className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span
                className={`font-['Poppins',sans-serif] text-[14px] font-medium text-red-500 transition-opacity duration-300 ${
                  sidebarOpen ? "lg:opacity-100 md:hidden lg:block" : "hidden"
                }`}
              >
                Logout
              </span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <nav className="absolute left-0 top-0 bottom-0 w-72 bg-background p-6 shadow-2xl overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              {role === "super_admin" && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                  <Crown size={14} className="text-yellow-500" />
                  <span className="text-xs font-bold text-yellow-500 font-['Poppins']">
                    Super Admin
                  </span>
                </div>
              )}
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="ml-auto text-foreground"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-1">
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 h-12 rounded-[12px] ${
                      active
                        ? "bg-accent/10 border border-accent/30 text-accent"
                        : "text-foreground/60"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-['Poppins'] text-[14px] font-medium">{item.label}</span>
                    {(item as any).badge && (
                      <Lock size={11} className="ml-auto text-muted-foreground/60" />
                    )}
                  </Link>
                );
              })}
            </div>
            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-3 px-4 h-12 rounded-[12px] hover:bg-red-500/10 hover:border hover:border-red-500 transition-all mt-4"
            >
              <LogOut className="w-5 h-5 text-red-500" />
              <span className="font-['Poppins',sans-serif] text-[14px] font-medium text-red-500">
                Logout
              </span>
            </button>
          </nav>
        </div>
      )}

      {/* Logout Confirmation Alert */}
      {showLogoutAlert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleLogoutCancel}
          />
          {/* Dialog */}
          <div className="relative bg-background border border-border rounded-2xl shadow-2xl p-6 w-[340px] mx-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Icon */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 mx-auto mb-4">
              <LogOut className="w-6 h-6 text-red-500" />
            </div>
            {/* Text */}
            <h2 className="font-['Poppins',sans-serif] text-[18px] font-bold text-foreground text-center mb-1">
              Logout
            </h2>
            <p className="font-['Poppins',sans-serif] text-[13px] text-foreground/60 text-center mb-6">
              Are you sure you want to log out of your account?
            </p>
            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleLogoutCancel}
                className="flex-1 h-11 rounded-[12px] border border-border text-foreground/80 font-['Poppins'] text-[14px] font-medium hover:bg-accent/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="flex-1 h-11 rounded-[12px] bg-red-500 hover:bg-red-600 text-white font-['Poppins'] text-[14px] font-semibold transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main
        className={`pt-16 transition-all duration-300 ${
          sidebarOpen ? "lg:pl-64 md:pl-20" : "md:pl-20"
        }`}
      >
        <div className="p-4 sm:p-6 lg:p-8 pb-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}