import { motion } from "motion/react";
import {
  User,
  Bell,
  Shield,
  Save,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../services/AuthContext";

export function SettingsPage() {
  const { user } = useAuth();
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    role: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setUserData({
        fullName: user.fullName || "",
        email: user.email || "",
        role: user.role || "Player",
        phone: user.phoneNumber || "",
      });
    }
  }, [user]);

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    matchUpdates: true,
    maintenanceReminders: true,
    lowWaterAlerts: true,
    weeklyReports: false,
  });

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNotificationToggle = (key: string) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key as keyof typeof notifications],
    });
  };

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  // Style commun pour les champs de saisie
  const inputClassName = "w-full bg-gray-50 dark:bg-white/5 h-[52px] px-4 rounded-[14px] border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-transparent transition-all text-[#0A0E1A] dark:text-white font-['Poppins',sans-serif]";

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="font-['Playfair_Display',serif] font-bold text-[36px] lg:text-[42px] text-[#0A0E1A] dark:text-white mb-2">
          Settings
        </h1>
        <p className="font-['Poppins',sans-serif] text-[16px] text-[#0A0E1A]/60 dark:text-white/60">
          Manage your account and preferences
        </p>
      </div>
      
      {/* User Account Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-black/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-[20px] p-6 lg:p-8 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-[12px] bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center">
            <User className="w-6 h-6 text-[#00E5FF]" />
          </div>
          <h2 className="font-['Poppins',sans-serif] font-semibold text-[22px] text-[#0A0E1A] dark:text-white">
            User Account
          </h2>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="font-['Poppins',sans-serif] font-medium text-[14px] text-[#0A0E1A]/70 dark:text-white/70 ml-1">
              Full Name
            </label>
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
              <label className="font-['Poppins',sans-serif] font-medium text-[14px] text-[#0A0E1A]/70 dark:text-white/70 ml-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleUserChange}
                className={inputClassName}
                placeholder="name@example.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-['Poppins',sans-serif] font-medium text-[14px] text-[#0A0E1A]/70 dark:text-white/70 ml-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={userData.phone}
                onChange={handleUserChange}
                className={inputClassName}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-['Poppins',sans-serif] font-medium text-[14px] text-[#0A0E1A]/70 dark:text-white/70 ml-1">
              Account Role
            </label>
            <div className="w-full bg-gray-100 dark:bg-white/5 h-[52px] px-4 rounded-[14px] border border-gray-200 dark:border-white/10 flex items-center cursor-not-allowed">
              <span className="font-['Poppins',sans-serif] text-[15px] text-[#0A0E1A]/40 dark:text-white/40">
                {userData.role}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

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