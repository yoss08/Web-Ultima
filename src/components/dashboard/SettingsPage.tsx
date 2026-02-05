import { motion } from "motion/react";
import {
  Building,
  User,
  Bell,
  Shield,
  Save,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useState } from "react";

export function SettingsPage() {
  const [facilityData, setFacilityData] = useState({
    name: "Elite Padel Sports Center",
    address: "123 Sports Avenue, Barcelona",
    phone: "+34 912 345 678",
    email: "info@elitepadel.com",
    courts: 12,
  });

  const [userData, setUserData] = useState({
    fullName: "John Doe",
    email: "john.doe@elitepadel.com",
    role: "Facility Manager",
    phone: "+34 678 901 234",
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    matchUpdates: true,
    maintenanceReminders: true,
    lowWaterAlerts: true,
    weeklyReports: false,
  });

  const handleFacilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFacilityData({
      ...facilityData,
      [e.target.name]: e.target.value,
    });
  };

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

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1
          className="font-['Playfair_Display',serif] font-bold text-[36px] lg:text-[42px] text-white dark:text-[#0A0E1A] mb-2"
          style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
        >
          Settings
        </h1>
        <p className="font-['Poppins',sans-serif] text-[16px] text-white/60 dark:text-[#0A0E1A]/60">
          Manage your facility and account settings
        </p>
      </div>

      {/* Facility Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-black/80 dark:bg-white/90 backdrop-blur-xl border border-white/10 dark:border-[#0A0E1A]/10 rounded-[20px] p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-[12px] bg-[#39FF14]/10 border border-[#39FF14] flex items-center justify-center">
            <Building className="w-6 h-6 text-[#39FF14]" />
          </div>
          <h2 className="font-['Poppins',sans-serif] font-semibold text-[22px] text-white dark:text-[#0A0E1A]">
            Facility Information
          </h2>
        </div>

        <div className="space-y-5">
          {/* Facility Name */}
          <div className="flex flex-col gap-2">
            <label className="font-['Poppins',sans-serif] font-medium text-[14px] text-white/90 dark:text-[#0A0E1A]/90">
              Facility Name
            </label>
            <input
              type="text"
              name="name"
              value={facilityData.name}
              onChange={handleFacilityChange}
              className="w-full bg-white/5 dark:bg-[#0A0E1A]/5 backdrop-blur-sm h-[52px] px-4 rounded-[14px] border border-white/20 dark:border-[#0A0E1A]/20 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-transparent transition-all text-white dark:text-[#0A0E1A]"
            />
          </div>

          {/* Address */}
          <div className="flex flex-col gap-2">
            <label className="font-['Poppins',sans-serif] font-medium text-[14px] text-white/90 dark:text-[#0A0E1A]/90 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Address
            </label>
            <input
              type="text"
              name="address"
              value={facilityData.address}
              onChange={handleFacilityChange}
              className="w-full bg-white/5 dark:bg-[#0A0E1A]/5 backdrop-blur-sm h-[52px] px-4 rounded-[14px] border border-white/20 dark:border-[#0A0E1A]/20 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-transparent transition-all text-white dark:text-[#0A0E1A]"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {/* Phone */}
            <div className="flex flex-col gap-2">
              <label className="font-['Poppins',sans-serif] font-medium text-[14px] text-white/90 dark:text-[#0A0E1A]/90 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={facilityData.phone}
                onChange={handleFacilityChange}
                className="w-full bg-white/5 dark:bg-[#0A0E1A]/5 backdrop-blur-sm h-[52px] px-4 rounded-[14px] border border-white/20 dark:border-[#0A0E1A]/20 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-transparent transition-all text-white dark:text-[#0A0E1A]"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="font-['Poppins',sans-serif] font-medium text-[14px] text-white/90 dark:text-[#0A0E1A]/90 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={facilityData.email}
                onChange={handleFacilityChange}
                className="w-full bg-white/5 dark:bg-[#0A0E1A]/5 backdrop-blur-sm h-[52px] px-4 rounded-[14px] border border-white/20 dark:border-[#0A0E1A]/20 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-transparent transition-all text-white dark:text-[#0A0E1A]"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* User Account */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-black/80 dark:bg-white/90 backdrop-blur-xl border border-white/10 dark:border-[#0A0E1A]/10 rounded-[20px] p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-[12px] bg-[#00E5FF]/10 border border-[#00E5FF] flex items-center justify-center">
            <User className="w-6 h-6 text-[#00E5FF]" />
          </div>
          <h2 className="font-['Poppins',sans-serif] font-semibold text-[22px] text-white dark:text-[#0A0E1A]">
            User Account
          </h2>
        </div>

        <div className="space-y-5">
          {/* Full Name */}
          <div className="flex flex-col gap-2">
            <label className="font-['Poppins',sans-serif] font-medium text-[14px] text-white/90 dark:text-[#0A0E1A]/90">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={userData.fullName}
              onChange={handleUserChange}
              className="w-full bg-white/5 dark:bg-[#0A0E1A]/5 backdrop-blur-sm h-[52px] px-4 rounded-[14px] border border-white/20 dark:border-[#0A0E1A]/20 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-transparent transition-all text-white dark:text-[#0A0E1A]"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="font-['Poppins',sans-serif] font-medium text-[14px] text-white/90 dark:text-[#0A0E1A]/90">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleUserChange}
                className="w-full bg-white/5 dark:bg-[#0A0E1A]/5 backdrop-blur-sm h-[52px] px-4 rounded-[14px] border border-white/20 dark:border-[#0A0E1A]/20 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-transparent transition-all text-white dark:text-[#0A0E1A]"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <label className="font-['Poppins',sans-serif] font-medium text-[14px] text-white/90 dark:text-[#0A0E1A]/90">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={userData.phone}
                onChange={handleUserChange}
                className="w-full bg-white/5 dark:bg-[#0A0E1A]/5 backdrop-blur-sm h-[52px] px-4 rounded-[14px] border border-white/20 dark:border-[#0A0E1A]/20 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-transparent transition-all text-white dark:text-[#0A0E1A]"
              />
            </div>
          </div>

          {/* Role (Read-only) */}
          <div className="flex flex-col gap-2">
            <label className="font-['Poppins',sans-serif] font-medium text-[14px] text-white/90 dark:text-[#0A0E1A]/90">
              Role
            </label>
            <div className="w-full bg-white/5 dark:bg-[#0A0E1A]/5 backdrop-blur-sm h-[52px] px-4 rounded-[14px] border border-white/20 dark:border-[#0A0E1A]/20 flex items-center">
              <span className="font-['Poppins',sans-serif] text-[15px] text-white/60 dark:text-[#0A0E1A]/60">
                {userData.role}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-black/80 dark:bg-white/90 backdrop-blur-xl border border-white/10 dark:border-[#0A0E1A]/10 rounded-[20px] p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-[12px] bg-[#39FF14]/10 border border-[#39FF14] flex items-center justify-center">
            <Bell className="w-6 h-6 text-[#39FF14]" />
          </div>
          <h2 className="font-['Poppins',sans-serif] font-semibold text-[22px] text-white dark:text-[#0A0E1A]">
            Notification Settings
          </h2>
        </div>

        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between py-3 border-b border-white/10 dark:border-[#0A0E1A]/10 last:border-0"
            >
              <span className="font-['Poppins',sans-serif] text-[15px] text-white dark:text-[#0A0E1A]">
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </span>
              <button
                onClick={() => handleNotificationToggle(key)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  value
                    ? "bg-[#39FF14]"
                    : "bg-white/20 dark:bg-[#0A0E1A]/20"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    value ? "translate-x-7" : "translate-x-1"
                  }`}
                ></span>
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-black/80 dark:bg-white/90 backdrop-blur-xl border border-white/10 dark:border-[#0A0E1A]/10 rounded-[20px] p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-[12px] bg-red-500/10 border border-red-500 flex items-center justify-center">
            <Shield className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="font-['Poppins',sans-serif] font-semibold text-[22px] text-white dark:text-[#0A0E1A]">
            Security
          </h2>
        </div>

        <button className="w-full sm:w-auto px-6 h-12 bg-white/5 hover:bg-white/10 dark:bg-[#0A0E1A]/5 dark:hover:bg-[#0A0E1A]/10 border border-white/20 dark:border-[#0A0E1A]/20 rounded-[12px] transition-all font-['Poppins',sans-serif] text-[14px] font-semibold text-white dark:text-[#0A0E1A]">
          Change Password
        </button>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex justify-end"
      >
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-8 h-14 bg-[#39FF14] hover:bg-[#32E012] rounded-[14px] shadow-[0_0_24px_rgba(57,255,20,0.4)] hover:shadow-[0_0_36px_rgba(57,255,20,0.6)] transition-all font-['Poppins',sans-serif] text-[16px] font-bold text-black"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </motion.div>
    </div>
  );
}
