import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Save,
  Loader2,
  Moon,
  Sun,
  Bell,
  Globe,
  Shield,
  Palette,
  CreditCard,
  Lock,
  ChevronRight
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useTheme } from "../../styles/useTheme";
import { useAuth } from "../../services/AuthContext";
import { supabase } from "../../config/supabase";
import { toast } from "react-hot-toast";

type TabType = 'account' | 'appearance' | 'notifications' | 'security';

export function SettingsPage() {
  const { user } = useAuth();
  const { isDark, setIsDark } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as TabType) || 'account';
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [loading, setLoading] = useState(false);

  // Sync tab state with URL
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Profile Data state
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    role: "",
    phone: "",
  });

  // App Settings states
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    matchUpdates: true,
    maintenanceReminders: true,
    lowWaterAlerts: true,
    push: true,
  });
  const [language, setLanguage] = useState("en");
  const [privacy, setPrivacy] = useState("public");

  // Security states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Load initial data
  useEffect(() => {
    if (user) {
      const metadata = user.user_metadata || {};
      setUserData({
        fullName: metadata.full_name || "",
        email: user.email || "",
        role: metadata.account_type || "Player",
        phone: metadata.phone_number || "",
      });
    }
  }, [user]);

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateProfile = async () => {
    if (!user) {
      toast.error("You must be logged in to update your profile");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Updating profile...");

    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          full_name: userData.fullName,
          phone_number: userData.phone
        }
      });

      if (error) throw error;

      await supabase
        .from('profiles')
        .update({ 
          full_name: userData.fullName,
          phone_number: userData.phone,
          telephone: userData.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      await supabase.auth.getUser();
      toast.success("Profile updated successfully!", { id: toastId });
    } catch (error: any) {
      toast.error(error.message || "Update failed", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleThemeUpdate = (mode: 'light' | 'dark') => {
    if ((mode === 'dark' && isDark) || (mode === 'light' && !isDark)) return;
    setIsDark(mode === 'dark');
    
    // Refresh to ensure all styles and themed components update correctly
    setTimeout(() => {
      window.location.reload();
    }, 150);
  };

  const handleNotificationToggle = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof notifications],
    }));
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
    if (newPassword.length < 6) return toast.error("Password too short");

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);

    if (error) {
      toast.error(error.message);
    }
  };

  const handleDisableAccount = () => {
    toast.error("Account disabling is currently not available in this version.");
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone.");
    if (confirmed) {
      toast.error("Account deletion requires admin permissions. Please contact support.");
    }
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: User, color: 'text-[#39ff14]', bg: 'bg-[#39ff14]/10' },
    { id: 'appearance', label: 'Appearance', icon: Palette, color: 'text-accent', bg: 'bg-accent/10' },
    { id: 'notifications', label: 'Alerts', icon: Bell, color: 'text-[#14e9ff]', bg: 'bg-[#14e9ff]/10' },
    { id: 'security', label: 'Security', icon: Shield, color: 'text-[#ff3d14]', bg: 'bg-[#ff3d14]/10' },
  ];

  const inputClassName = "w-full bg-muted h-[52px] px-4 rounded-[14px] border border-border focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-foreground font-['Poppins',sans-serif]";

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="font-['Playfair_Display',serif] text-2xl md:text-4xl font-black text-foreground leading-none mb-4">
          Settings
        </h1>
        <p className="font-['Poppins',sans-serif] text-[16px] text-muted-foreground">
          Manage your account profile, appearance, and security preferences.
        </p>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        {/* Navigation Sidebar */}
        <div className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as TabType)}
                className={`w-full flex items-center justify-between p-4 rounded-[16px] transition-all group ${
                  isActive 
                    ? "bg-accent/10 border border-accent/20 shadow-sm" 
                    : "hover:bg-muted border border-transparent"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-[12px] ${tab.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <Icon className={`w-5 h-5 ${tab.color}`} />
                  </div>
                  <span className={`font-['Poppins',sans-serif] font-bold text-[15px] ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {tab.label}
                  </span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? "text-accent translate-x-1" : "text-muted-foreground/30 opacity-0 group-hover:opacity-100"}`} />
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-card backdrop-blur-xl border border-border rounded-[28px] p-6 lg:p-10 shadow-sm"
            >
              {/* ACCOUNT TAB */}
              {activeTab === 'account' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Account Profile</h2>
                    <p className="text-sm text-muted-foreground">Manage your public information and contact details.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={userData.fullName}
                        onChange={handleUserChange}
                        className={inputClassName}
                        placeholder="Your full name"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                        <input
                          type="email"
                          value={userData.email}
                          disabled
                          className={`${inputClassName} opacity-50 cursor-not-allowed`}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={userData.phone}
                          onChange={handleUserChange}
                          className={inputClassName}
                          placeholder="+216 00 000 000"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Account Role</label>
                      <div className="w-full bg-muted h-[52px] px-4 rounded-[14px] border border-border flex items-center cursor-not-allowed">
                        <span className="font-['Poppins',sans-serif] text-[15px] text-muted-foreground">
                          {userData.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end">
                    <button
                      onClick={handleUpdateProfile}
                      disabled={loading}
                      className="flex items-center gap-2 px-10 h-14 bg-accent hover:opacity-90 disabled:opacity-50 rounded-[18px] shadow-lg shadow-accent/20 transition-all font-bold text-accent-foreground"
                    >
                      {loading ? <Loader2 className="animate-spin text-accent-foreground" /> : <Save className="w-5 h-5 text-accent-foreground" />}
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
              {/* APPEARANCE TAB */}
              {activeTab === 'appearance' && (
                <div className="space-y-10">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Display & Appearance</h2>
                    <p className="text-sm text-muted-foreground">Customize how the application looks on your device.</p>
                  </div>

                  {/* Theme Selection */}
                  <div className="grid grid-cols-2 gap-6">
                    <button
                      onClick={() => handleThemeUpdate('light')}
                      className={`relative p-8 rounded-[24px] border-2 flex flex-col items-center gap-6 transition-all ${
                        !isDark 
                          ? "border-accent bg-accent/5 shadow-accent" 
                          : "border-border hover:border-accent/40"
                      }`}
                    >
                      <div className={`p-5 rounded-full ${!isDark ? "bg-accent text-accent-foreground shadow-lg shadow-accent/30" : "bg-muted text-muted-foreground"}`}>
                        <Sun size={32} />
                      </div>
                      <div className="text-center">
                        <p className={`font-black text-lg ${!isDark ? "text-foreground" : "text-muted-foreground"}`}>Light</p>
                        {!isDark && <span className="text-[10px] text-accent font-black uppercase tracking-widest">Selected</span>}
                      </div>
                    </button>

                    <button
                      onClick={() => handleThemeUpdate('dark')}
                      className={`relative p-8 rounded-[24px] border-2 flex flex-col items-center gap-6 transition-all ${
                        isDark 
                          ? "border-accent bg-accent/5 shadow-accent" 
                          : "border-border hover:border-accent/40"
                      }`}
                    >
                      <div className={`p-5 rounded-full ${isDark ? "bg-accent text-accent-foreground shadow-lg shadow-accent/30" : "bg-muted text-muted-foreground"}`}>
                        <Moon size={32} />
                      </div>
                      <div className="text-center">
                        <p className={`font-black text-lg ${isDark ? "text-foreground" : "text-muted-foreground"}`}>Dark</p>
                        {isDark && <span className="text-[10px] text-accent font-black uppercase tracking-widest">Selected</span>}
                      </div>
                    </button>
                  </div>

                  <div className="space-y-6 pt-6 border-t border-gray-100 dark:border-white/5">
                    {/* Language */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-accent/10 rounded-xl">
                          <Globe className="text-accent" size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground">Global Language</h4>
                          <p className="text-xs text-muted-foreground">System-wide display language</p>
                        </div>
                      </div>
                      <select 
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="h-11 px-4 bg-muted rounded-xl border border-border outline-none text-sm font-bold text-foreground cursor-pointer hover:bg-muted/80 transition-colors"
                      >
                        <option value="en">English (US)</option>
                        <option value="fr">Français</option>
                        <option value="es">Español</option>
                      </select>
                    </div>

                    {/* Privacy */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-500/10 rounded-xl">
                          <Lock className="text-red-500" size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground">Profile Visibility</h4>
                          <p className="text-xs text-muted-foreground">Control who can see your stats</p>
                        </div>
                      </div>
                      <select 
                        value={privacy}
                        onChange={(e) => setPrivacy(e.target.value)}
                        className="h-11 px-4 bg-muted rounded-xl border border-border outline-none text-sm font-bold text-foreground cursor-pointer hover:bg-muted/80 transition-colors"
                      >
                        <option value="public">Public</option>
                        <option value="friends">Friends</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS TAB */}
              {activeTab === 'notifications' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Notification Preferences</h2>
                    <p className="text-sm text-muted-foreground">Choose which updates you want to receive and how.</p>
                  </div>

                  <div className="space-y-2">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-5 rounded-[18px] hover:bg-muted transition-colors group"
                      >
                        <div>
                          <span className="font-bold text-[16px] text-foreground">
                            {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                          </span>
                          <p className="text-[12px] text-muted-foreground">Get notified about {key.toLowerCase().replace('alerts', '')} instantly</p>
                        </div>
                        <button
                          onClick={() => handleNotificationToggle(key)}
                          className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                            value ? "bg-accent" : "bg-muted"
                          }`}
                        >
                          <motion.span
                            layout
                            className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md ${
                              value ? "translate-x-6" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-10">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Security & Privacy</h2>
                    <p className="text-sm text-muted-foreground">Keep your account safe and manage authentication.</p>
                  </div>

                  <div className="p-8 bg-red-500/5 border border-red-500/20 rounded-[24px]">
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                        <Shield className="text-white w-6 h-6" />
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-bold text-red-500">Password Protection</h3>
                          <p className="text-sm text-foreground/70">We recommend using a strong password that you don't use elsewhere.</p>
                        </div>
                        <button 
                          onClick={() => setShowPasswordModal(true)}
                          className="px-8 h-12 bg-muted font-black text-sm rounded-xl border border-border hover:opacity-80 transition-all shadow-sm text-foreground"
                        >
                          Change Password
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                      <Lock size={18} className="text-accent" />
                      Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-muted-foreground px-7">Enhanced security is coming soon to the platform to help you protect your sensitive data.</p>
                  </div>

                  {/* Account Removal Section */}
                  <div className="pt-10 border-t border-gray-100 dark:border-white/5 space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">Account Removal</h3>
                      <p className="text-sm text-muted-foreground">
                        Disabling your account means you can recover it at any time after taking this action.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <button 
                        onClick={handleDisableAccount}
                        className="px-8 h-12 bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#E11D48]/20"
                      >
                        Disable Account
                      </button>
                      <button 
                        onClick={handleDeleteAccount}
                        className="px-8 h-12 bg-gray-100 dark:bg-[#E11D48]/5 text-[#E11D48] font-bold rounded-xl border border-[#E11D48]/10 hover:bg-[#E11D48]/10 transition-all"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPasswordModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-card p-10 rounded-[36px] max-w-md w-full relative border border-gray-200 dark:border-white/10 shadow-2xl"
            >
              <h2 className="text-3xl font-black mb-2 dark:text-white">Security Update</h2>
              <p className="text-sm opacity-50 mb-8 font-['Poppins']">Enter your new password below to secure your account.</p>
              
              <div className="space-y-5 mb-10">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground ml-1 tracking-widest">New Password</label>
                  <input 
                    type="password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    className={inputClassName} 
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground ml-1 tracking-widest">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    className={inputClassName} 
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowPasswordModal(false)} 
                  className="flex-1 h-14 bg-muted font-bold rounded-2xl hover:opacity-80 transition-colors text-foreground"
                >
                  Cancel
                </button>
                <button 
                  onClick={handlePasswordChange} 
                  disabled={loading}
                  className="flex-1 h-14 bg-accent text-accent-foreground font-black rounded-2xl hover:opacity-90 transition-colors shadow-lg shadow-accent/20 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin text-accent-foreground" />}
                  Update
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
