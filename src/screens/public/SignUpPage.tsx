import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Mail, Lock, User, Phone, Users, Dumbbell, ShieldCheck } from "lucide-react";
import { authHelpers } from "../../config/supabase";
import { useTheme } from "../../styles/useTheme";
import { toast } from "react-hot-toast";

export function SignUpPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    accountType: "Player",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Logique Admin invisible
  const isAdminEmail = formData.email.toLowerCase().includes(".uadmin@ultima.tn");

  // Sécurité : Reset le rôle si l'email ne correspond plus
  useEffect(() => {
    if (!isAdminEmail && formData.accountType === "Admin") {
      setFormData(prev => ({ ...prev, accountType: "Player" }));
    }
  }, [isAdminEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: signUpError } = await authHelpers.signUp(
      formData.email,
      formData.password,
      {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        accountType: formData.accountType,
      }
    );

    if (signUpError) {
      setError(signUpError.message);
      toast.error(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      toast.success("Account created successfully!");
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E1A] flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[560px] bg-white dark:bg-white/5 border border-[#0A0E1A]/5 dark:border-white/10 rounded-[40px] overflow-hidden shadow-2xl relative"
      >
        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-['Playfair_Display',serif] text-[40px] font-bold text-[#0A0E1A] dark:text-white mb-2">
              Join Ultima
            </h1>
            <p className="font-['Poppins',sans-serif] text-[16px] text-[#0A0E1A]/50 dark:text-white/50">
              Create your professional tennis profile
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Type Selector - Original Design */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, accountType: "Player" })}
                className={`flex flex-col items-center justify-center gap-3 p-4 rounded-[24px] border-2 transition-all duration-300 ${
                  formData.accountType === "Player"
                    ? "border-[#00E5FF] bg-[#00E5FF]/5 text-[#00E5FF]"
                    : "border-transparent bg-gray-50 dark:bg-white/5 text-gray-400"
                }`}
              >
                <Dumbbell size={24} />
                <span className="font-['Poppins',sans-serif] font-bold text-[14px]">Player</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, accountType: "Coach" })}
                className={`flex flex-col items-center justify-center gap-3 p-4 rounded-[24px] border-2 transition-all duration-300 ${
                  formData.accountType === "Coach"
                    ? "border-[#00E5FF] bg-[#00E5FF]/5 text-[#00E5FF]"
                    : "border-transparent bg-gray-50 dark:bg-white/5 text-gray-400"
                }`}
              >
                <Users size={24} />
                <span className="font-['Poppins',sans-serif] font-bold text-[14px]">Coach</span>
              </button>

              {/* Secret Admin Option */}
              <AnimatePresence>
                {isAdminEmail && (
                  <motion.button
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    type="button"
                    onClick={() => setFormData({ ...formData, accountType: "Admin" })}
                    className={`col-span-2 flex items-center justify-center gap-3 p-4 rounded-[24px] border-2 transition-all duration-300 ${
                      formData.accountType === "Admin"
                        ? "border-red-500 bg-red-500/5 text-red-500"
                        : "border-transparent bg-red-500/10 text-red-400"
                    }`}
                  >
                    <ShieldCheck size={20} />
                    <span className="font-['Poppins',sans-serif] font-bold text-[14px]">Admin Access</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0A0E1A]/30 dark:text-white/30" size={20} />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-[#00E5FF] rounded-2xl dark:text-white outline-none transition-all font-['Poppins',sans-serif]"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0A0E1A]/30 dark:text-white/30" size={20} />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-[#00E5FF] rounded-2xl dark:text-white outline-none transition-all font-['Poppins',sans-serif]"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0A0E1A]/30 dark:text-white/30" size={20} />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-[#00E5FF] rounded-2xl dark:text-white outline-none transition-all font-['Poppins',sans-serif]"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0A0E1A]/30 dark:text-white/30" size={20} />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-[#00E5FF] rounded-2xl dark:text-white outline-none transition-all font-['Poppins',sans-serif]"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#00E5FF] rounded-[28px] shadow-[0_0_32px_rgba(0,229,255,0.5)] hover:shadow-[0_0_48px_rgba(0,229,255,0.7)] hover:scale-[1.02] disabled:scale-100 transition-all duration-300 font-['Poppins',sans-serif] font-bold text-[16px] text-black mt-6"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="font-['Poppins',sans-serif] text-[14px] text-[#0A0E1A]/50 dark:text-white/50">
              Already have an account?{" "}
              <Link to="/login" className="text-[#0A0E1A] dark:text-white font-semibold hover:text-[#00E5FF] transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Back to Home Link - Exactly as before */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-8"
      >
        <Link to="/" className="flex items-center gap-2 text-[#0A0E1A]/50 dark:text-white/50 hover:text-[#00E5FF] transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-['Poppins',sans-serif] text-[14px] font-medium">Back to Home</span>
        </Link>
      </motion.div>
    </div>
  );
}