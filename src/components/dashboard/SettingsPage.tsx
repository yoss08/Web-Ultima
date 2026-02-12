import { motion } from "framer-motion"; // Correction de l'import (framer-motion est plus standard que motion/react)
import {
  Bell,
  Shield,
  Save,
  Sun,
  Moon,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "../../styles/useTheme";

export function SettingsPage() {
  const { isDark, setIsDark } = useTheme();
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    matchUpdates: true,
    maintenanceReminders: true,
    lowWaterAlerts: true,
    weeklyReports: false,
  });

  const handleThemeUpdate = (mode: 'light' | 'dark') => {
  if ((mode === 'dark' && isDark) || (mode === 'light' && !isDark)) return;
   setIsDark(mode === 'dark');
  
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

  const handleSave = () => {
    // Ici vous pourriez ajouter un appel API/Supabase pour sauver les notifs
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-8 max-w-4xl pb-10 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="font-['Playfair_Display',serif] font-bold text-[36px] lg:text-[42px] text-[#0A0E1A] dark:text-white mb-2 transition-colors">
          Settings
        </h1>
        <p className="font-['Poppins',sans-serif] text-[16px] text-[#0A0E1A]/60 dark:text-white/60">
          Manage your dashboard preferences and account security.
        </p>
      </div>

      {/* Appearance Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-black/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-[24px] p-6 lg:p-8 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-[12px] bg-[#39FF14]/10 border border-[#39FF14]/20 flex items-center justify-center">
            {isDark ? <Moon className="w-6 h-6 text-[#39FF14]" /> : <Sun className="w-6 h-6 text-[#39FF14]" />}
          </div>
          <div>
            <h2 className="font-['Poppins'] font-semibold text-[20px] text-[#0A0E1A] dark:text-white">Appearance</h2>
            <p className="text-xs opacity-50 text-[#0A0E1A] dark:text-white">Customize how the dashboard looks on your device</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => handleThemeUpdate('light')}
            className={`relative p-6 rounded-[20px] border-2 flex flex-col items-center gap-4 transition-all ${
              !isDark 
                ? "border-[#39FF14] bg-[#39FF14]/5 shadow-[0_0_20px_rgba(57,255,20,0.1)]" 
                : "border-gray-100 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20"
            }`}
          >
            <div className={`p-3 rounded-full ${!isDark ? "bg-[#39FF14] text-black" : "bg-gray-100 dark:bg-white/5 text-gray-400"}`}>
              <Sun size={24} />
            </div>
            <div className="text-center">
              <p className={`font-bold text-sm ${!isDark ? "text-black" : "text-gray-400"}`}>Light Mode</p>
              {!isDark && <span className="text-[10px] text-[#39FF14] font-black uppercase tracking-widest">Active</span>}
            </div>
          </button>

          <button
            onClick={() => handleThemeUpdate('dark')}
            className={`relative p-6 rounded-[20px] border-2 flex flex-col items-center gap-4 transition-all ${
              isDark 
                ? "border-[#39FF14] bg-[#39FF14]/5 shadow-[0_0_20px_rgba(57,255,20,0.1)]" 
                : "border-gray-100 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20"
            }`}
          >
            <div className={`p-3 rounded-full ${isDark ? "bg-[#39FF14] text-black" : "bg-gray-100 dark:bg-white/5 text-gray-400"}`}>
              <Moon size={24} />
            </div>
            <div className="text-center">
              <p className={`font-bold text-sm ${isDark ? "text-white" : "text-gray-400"}`}>Dark Mode</p>
              {isDark && <span className="text-[10px] text-[#39FF14] font-black uppercase tracking-widest">Active</span>}
            </div>
          </button>
        </div>
      </motion.div>

      {/* Notifications Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-black/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-[24px] p-6 lg:p-8 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-[12px] bg-[#39FF14]/10 border border-[#39FF14]/20 flex items-center justify-center">
            <Bell className="w-6 h-6 text-[#39FF14]" />
          </div>
          <h2 className="font-['Poppins',sans-serif] font-semibold text-[22px] text-[#0A0E1A] dark:text-white">
            Notifications
          </h2>
        </div>

        <div className="space-y-1">
          {Object.entries(notifications).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-white/5 last:border-0"
            >
              <span className="font-['Poppins',sans-serif] text-[15px] font-medium text-[#0A0E1A] dark:text-white">
                {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
              </span>
              <button
                onClick={() => handleNotificationToggle(key)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                  value ? "bg-[#39FF14]" : "bg-gray-200 dark:bg-white/10"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                    value ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Security Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-black/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-[24px] p-6 lg:p-8 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-[12px] bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="font-['Poppins',sans-serif] font-semibold text-[22px] text-[#0A0E1A] dark:text-white">
            Security
          </h2>
        </div>

        <button className="px-8 h-12 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 border border-gray-200 dark:border-white/20 rounded-[12px] transition-all font-bold text-sm text-[#0A0E1A] dark:text-white shadow-sm">
          Change Password
        </button>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex justify-end"
      >
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-10 h-14 bg-[#39FF14] hover:bg-[#32E012] rounded-[16px] shadow-[0_8px_24px_rgba(57,255,20,0.3)] transition-all font-bold text-black"
        >
          <Save className="w-5 h-5" />
          Save Settings
        </button>
      </motion.div>
    </div>
  );
}