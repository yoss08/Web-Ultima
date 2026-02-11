import { motion } from "motion/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Mail, Lock, User, Phone, Users, Dumbbell } from "lucide-react";
import { authHelpers } from "../../config/supabase";
import { useTheme } from "../../styles/useTheme";

const accountTypes = ["Player", "Coach", "Admin"];

export function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    accountType: "Player",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
    const { isDark, setIsDark } = useTheme();
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
      setLoading(false);
      return;
    }

    if (data.user) {
      // Navigate to dashboard
      navigate("/dashboard");
    }
    
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8EBF0] via-[#F5F7FA] to-[#FFFFFF] dark:from-[#0A1F2E] dark:via-[#0A0E1A] dark:to-[#000000] transition-colors duration-300 flex flex-col items-center justify-center px-6 py-12">
      {/* Logo at top */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
      <h1 className="font-['Arial',sans-serif] font-bold text-[32px] text-[#0A0E1A] dark:text-white tracking-[1.6px]">
        ULTIMA
      </h1>
    </motion.div>

      {/* Sign Up Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative w-full max-w-[420px]"
      >
        <div className="bg-white/95 dark:bg-[#0D1117]/95 backdrop-blur-xl transition-colors duration-300 rounded-[32px] p-12 shadow-2xl border border-black/5 dark:border-white/5">
          {/* Title */}
          <div className="text-center mb-10">
            <h2 className="font-['Poppins',sans-serif] font-bold text-[32px] text-[#0A0E1A] dark:text-white mb-3">
              Create Account
            </h2>
            <p className="font-['Poppins',sans-serif] text-[14px] text-[#0A0E1A]/50 dark:text-white/50">
              Join the ULTIMA ecosystem
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-[16px]">
              <p className="font-['Poppins',sans-serif] text-[14px] text-red-500 dark:text-red-600">
                {error}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="fullName"
                className="font-['Poppins',sans-serif] font-medium text-[14px] text-[#0A0E1A] dark:text-white"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 dark:text-white/30 text-[#0A0E1A]/30" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-[#F0F2F5] dark:bg-[#1C2128]/50 h-[52px] pl-12 pr-4 rounded-[16px] border border-[#D1D5DB]/50 dark:border-[#2D333B]/50 focus:outline-none focus:ring-2 focus:ring-[#00E5FF] focus:border-transparent transition-all text-[#0A0E1A] dark:text-white placeholder:text-[#0A0E1A]/30 dark:placeholder:text-white/30 font-['Poppins',sans-serif] text-[14px]"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="font-['Poppins',sans-serif] font-medium text-[14px] text-[#0A0E1A] dark:text-white"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 dark:text-white/30 text-[#0A0E1A]/30" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#F0F2F5] dark:bg-[#1C2128]/50 h-[52px] pl-12 pr-4 rounded-[16px] border border-[#D1D5DB]/50 dark:border-[#2D333B]/50 focus:outline-none focus:ring-2 focus:ring-[#00E5FF] focus:border-transparent transition-all text-[#0A0E1A] dark:text-white placeholder:text-[#0A0E1A]/30 dark:placeholder:text-white/30 font-['Poppins',sans-serif] text-[14px]"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="phoneNumber"
                className="font-['Poppins',sans-serif] font-medium text-[14px] text-[#0A0E1A] dark:text-white"
              >
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 dark:text-white/30 text-[#0A0E1A]/30" />
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full bg-[#F0F2F5] dark:bg-[#1C2128]/50 h-[52px] pl-12 pr-4 rounded-[16px] border border-[#D1D5DB]/50 dark:border-[#2D333B]/50 focus:outline-none focus:ring-2 focus:ring-[#00E5FF] focus:border-transparent transition-all text-[#0A0E1A] dark:text-white placeholder:text-[#0A0E1A]/30 dark:placeholder:text-white/30 font-['Poppins',sans-serif] text-[14px]"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="font-['Poppins',sans-serif] font-medium text-[14px] text-[#0A0E1A] dark:text-white"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 dark:text-white/30 text-[#0A0E1A]/30" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#F0F2F5] dark:bg-[#1C2128]/50 h-[52px] pl-12 pr-4 rounded-[16px] border border-[#D1D5DB]/50 dark:border-[#2D333B]/50 focus:outline-none focus:ring-2 focus:ring-[#00E5FF] focus:border-transparent transition-all text-[#0A0E1A] dark:text-white placeholder:text-[#0A0E1A]/30 dark:placeholder:text-white/30 font-['Poppins',sans-serif] text-[14px]"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Account Type Selection */}
            <div className="flex flex-col gap-4 mb-6">
              <label className="font-['Poppins',sans-serif] text-[12px] uppercase tracking-wider dark:text-white/60 text-[#0A0E1A]/60 ml-1">
                Select Role
              </label>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Player Option */}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, accountType: "Player" })}
                  className={`relative flex flex-col items-center justify-center gap-3 h-[120px] rounded-[24px] transition-all duration-300 group border-2 ${
                    formData.accountType === "Player"
                      ? "bg-[#0D121F] border-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.2)]"
                      : "bg-[#F0F2F5] dark:bg-[#0D121F]/40 border-transparent hover:border-[#00E5FF]/50"
                  }`}
                >
                  <Users className={`w-8 h-8 transition-colors ${
                    formData.accountType === "Player" ? "text-[#00E5FF]" : "text-[#0A0E1A]/40 dark:text-white/30"
                  }`} />
                  <span className={`font-['Poppins',sans-serif] font-bold text-[13px] tracking-widest uppercase ${
                    formData.accountType === "Player" ? "text-white" : "text-[#0A0E1A]/60 dark:text-white/50"
                  }`}>
                    Player
                  </span>
                  {/* Subtle inner glow for active state */}
                  {formData.accountType === "Player" && (
                    <div className="absolute inset-0 rounded-[22px] bg-[#00E5FF]/5 pointer-events-none" />
                  )}
                </button>

                {/* Coach Option */}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, accountType: "Coach" })}
                  className={`relative flex flex-col items-center justify-center gap-3 h-[120px] rounded-[24px] transition-all duration-300 group border-2 ${
                    formData.accountType === "Coach"
                      ? "bg-[#0D121F] border-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.2)]"
                      : "bg-[#F0F2F5] dark:bg-[#0D121F]/40 border-transparent hover:border-[#00E5FF]/50"
                  }`}
                >
                  <Dumbbell className={`w-8 h-8 transition-colors ${
                    formData.accountType === "Coach" ? "text-[#00E5FF]" : "text-[#0A0E1A]/40 dark:text-white/30"
                  }`} />
                  <span className={`font-['Poppins',sans-serif] font-bold text-[13px] tracking-widest uppercase ${
                    formData.accountType === "Coach" ? "text-white" : "text-[#0A0E1A]/60 dark:text-white/50"
                  }`}>
                    Coach
                  </span>
                  {/* Subtle inner glow for active state */}
                  {formData.accountType === "Coach" && (
                    <div className="absolute inset-0 rounded-[22px] bg-[#00E5FF]/5 pointer-events-none" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00E5FF] hover:bg-[#00D4E6] disabled:bg-[#00E5FF]/50 h-[56px] rounded-[28px] shadow-[0_0_32px_rgba(0,229,255,0.5)] hover:shadow-[0_0_48px_rgba(0,229,255,0.7)] hover:scale-[1.02] disabled:scale-100 transition-all duration-300 font-['Poppins',sans-serif] font-bold text-[16px] text-black mt-6"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="font-['Poppins',sans-serif] text-[14px] text-[#0A0E1A]/50 dark:text-white/50">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#0A0E1A] dark:text-white font-semibold hover:text-[#00E5FF] dark:hover:text-[#00E5FF] transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Back to Home - Below card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-8 text-center"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-['Poppins',sans-serif] text-[14px] text-[#0A0E1A]/40 dark:text-white/40 hover:text-white/60 dark:hover:text-[#0A0E1A]/60 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </motion.div>
    </div>
  );
}