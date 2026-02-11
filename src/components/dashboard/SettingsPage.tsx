import { motion } from "motion/react";
import {
  User,
  Bell,
  Shield,
  Save,
} from "lucide-react";
import { useState } from "react";

export function SettingsPage() {


  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    matchUpdates: true,
    maintenanceReminders: true,
    lowWaterAlerts: true,
    weeklyReports: false,
  });



  const handleNotificationToggle = (key: string) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key as keyof typeof notifications],
    });
  };

  const handleSave = () => {
    alert("Settings saved successfully!");
  };
  

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="font-['Playfair_Display',serif] font-bold text-[36px] lg:text-[42px] text-[#0A0E1A] dark:text-white mb-2">
          Settings
        </h1>
        <p className="font-['Poppins',sans-serif] text-[16px] text-[#0A0E1A]/60 dark:text-white/60">
          Manage your settings preferences
        </p>
      </div>

      {/* Notifications Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-black/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-[20px] p-6 lg:p-8 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-[12px] bg-[#39FF14]/10 border border-[#39FF14]/20 flex items-center justify-center">
            <Bell className="w-6 h-6 text-[#39FF14]" />
          </div>
          <h2 className="font-['Poppins',sans-serif] font-semibold text-[22px] text-[#0A0E1A] dark:text-white">
            Notifications
          </h2>
        </div>

        <div className="space-y-2">
          {Object.entries(notifications).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-white/5 last:border-0"
            >
              <span className="font-['Poppins',sans-serif] text-[15px] font-medium text-[#0A0E1A] dark:text-white">
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </span>
              <button
                onClick={() => handleNotificationToggle(key)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
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
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white dark:bg-black/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-[20px] p-6 lg:p-8 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-[12px] bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="font-['Poppins',sans-serif] font-semibold text-[22px] text-[#0A0E1A] dark:text-white">
            Security
          </h2>
        </div>

        <button className="px-6 h-12 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 border border-gray-200 dark:border-white/20 rounded-[12px] transition-all font-['Poppins',sans-serif] text-[14px] font-semibold text-[#0A0E1A] dark:text-white shadow-sm">
          Change Password
        </button>
      </motion.div>

      {/* Action Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex justify-end pt-4"
      >
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-10 h-14 bg-[#39FF14] hover:bg-[#32E012] rounded-[16px] shadow-[0_8px_24px_rgba(57,255,20,0.3)] hover:shadow-[0_12px_32px_rgba(57,255,20,0.4)] transition-all duration-300 font-['Poppins',sans-serif] text-[16px] font-bold text-black"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </motion.div>
    </div>
  );
}