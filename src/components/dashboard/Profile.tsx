import { motion } from "framer-motion";
import {
  User,
  Save,
  Loader2
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../services/AuthContext";
import { supabase } from "../../config/supabase";
import { toast } from "react-hot-toast";

export function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    role: "",
    phone: "",
  });

  // Charger les données initiales
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

  // Gérer les changements dans les inputs
  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  // SAUVEGARDE RÉELLE DANS SUPABASE
  const handleUpdateProfile = async () => {
    setLoading(true);
    const toastId = toast.loading("Updating profile...");

    try {
      // 1. Mise à jour des User Metadata dans Supabase Auth
      const { error } = await supabase.auth.updateUser({
        data: { 
          full_name: userData.fullName,
          phone_number: userData.phone
          // Note: On ne change pas le rôle ici car c'est géré par l'admin
        }
      });

      if (error) throw error;

      // 2. IMPORTANT: Rafraîchir la session locale pour que l'icône de profil change partout
      await supabase.auth.getUser();

      toast.success("Profile updated successfully!", { id: toastId });
    } catch (error: any) {
      toast.error(error.message || "Update failed", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const inputClassName = "w-full bg-gray-50 dark:bg-white/5 h-[52px] px-4 rounded-[14px] border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-transparent transition-all text-[#0A0E1A] dark:text-white font-['Poppins',sans-serif]";

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="font-['Playfair_Display',serif] font-bold text-[36px] lg:text-[42px] text-[#0A0E1A] dark:text-white mb-2">
          Profile
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
          {/* Full Name */}
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
            {/* Email (Read Only souvent recommandé pour l'auth simple) */}
            <div className="flex flex-col gap-2">
              <label className="font-['Poppins',sans-serif] font-medium text-[14px] text-[#0A0E1A]/70 dark:text-white/70 ml-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={userData.email}
                disabled
                className={`${inputClassName} opacity-50 cursor-not-allowed`}
                placeholder="name@example.com"
              />
            </div>

            {/* Phone */}
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

          {/* Role (Locked) */}
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

      {/* Action Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex justify-end pt-4"
      >
        <button
          onClick={handleUpdateProfile}
          disabled={loading}
          className="flex items-center gap-2 px-10 h-14 bg-[#39FF14] hover:bg-[#32E012] disabled:opacity-50 disabled:cursor-not-allowed rounded-[16px] shadow-[0_8px_24px_rgba(57,255,20,0.3)] hover:shadow-[0_12px_32px_rgba(57,255,20,0.4)] transition-all duration-300 font-['Poppins',sans-serif] text-[16px] font-bold text-black"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5" />}
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </motion.div>
    </div>
  );
}