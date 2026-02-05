import { motion } from "motion/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Mail, Lock, ChevronDown } from "lucide-react";

const roles = ["Facility Manager", "Coach / Referee", "Administrator"];

export function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: roles[0],
  });
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Navigate to dashboard
      navigate("/dashboard");
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] dark:bg-gray-50 flex items-center justify-center px-6 py-12 transition-colors duration-300">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0E1A] via-[#0F1425] to-[#0A0E1A] dark:from-gray-50 dark:via-white dark:to-gray-50"></div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-black/80 dark:bg-white/90 backdrop-blur-xl border border-white/10 dark:border-[#0A0E1A]/10 rounded-[32px] p-10 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/">
              <h1
                className="font-['Playfair_Display',serif] font-bold text-[48px] text-white dark:text-[#0A0E1A] mb-2 cursor-pointer hover:opacity-80 transition-opacity"
                style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
              >
                ULTIMA
              </h1>
            </Link>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="font-['Poppins',sans-serif] font-bold text-[28px] text-white dark:text-[#0A0E1A] mb-2">
              Welcome back
            </h2>
            <p className="font-['Poppins',sans-serif] text-[15px] text-white/60 dark:text-[#0A0E1A]/60">
              Access your ULTIMA dashboard
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-[16px]">
              <p className="font-['Poppins',sans-serif] text-[14px] text-red-500">
                {error}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="font-['Poppins',sans-serif] font-medium text-[14px] text-white/90 dark:text-[#0A0E1A]/90"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 dark:text-[#0A0E1A]/40" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white/5 dark:bg-[#0A0E1A]/5 backdrop-blur-sm h-[52px] pl-12 pr-4 rounded-[14px] border border-white/20 dark:border-[#0A0E1A]/20 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-transparent transition-all text-white dark:text-[#0A0E1A] placeholder:text-white/40 dark:placeholder:text-[#0A0E1A]/40"
                  placeholder="your.email@company.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="font-['Poppins',sans-serif] font-medium text-[14px] text-white/90 dark:text-[#0A0E1A]/90"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 dark:text-[#0A0E1A]/40" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-white/5 dark:bg-[#0A0E1A]/5 backdrop-blur-sm h-[52px] pl-12 pr-4 rounded-[14px] border border-white/20 dark:border-[#0A0E1A]/20 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-transparent transition-all text-white dark:text-[#0A0E1A] placeholder:text-white/40 dark:placeholder:text-[#0A0E1A]/40"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Role Selector */}
            <div className="flex flex-col gap-2">
              <label className="font-['Poppins',sans-serif] font-medium text-[14px] text-white/90 dark:text-[#0A0E1A]/90">
                Role
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className="w-full bg-white/5 dark:bg-[#0A0E1A]/5 backdrop-blur-sm h-[52px] px-4 rounded-[14px] border border-white/20 dark:border-[#0A0E1A]/20 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-transparent transition-all text-white dark:text-[#0A0E1A] text-left flex items-center justify-between"
                >
                  <span className="font-['Poppins',sans-serif] text-[15px]">
                    {formData.role}
                  </span>
                  <ChevronDown className="w-5 h-5 text-white/40 dark:text-[#0A0E1A]/40" />
                </button>

                {/* Dropdown */}
                {showRoleDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-black dark:bg-white border border-white/20 dark:border-[#0A0E1A]/20 rounded-[14px] overflow-hidden shadow-2xl z-10">
                    {roles.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, role });
                          setShowRoleDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-white/10 dark:hover:bg-[#0A0E1A]/10 transition-colors font-['Poppins',sans-serif] text-[15px] text-white dark:text-[#0A0E1A]"
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="font-['Poppins',sans-serif] text-[14px] text-[#39FF14] hover:text-[#32E012] transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#39FF14] hover:bg-[#32E012] disabled:bg-[#39FF14]/50 dark:bg-[#39FF14] dark:hover:bg-[#32E012] h-[56px] rounded-[14px] shadow-[0_0_24px_rgba(57,255,20,0.4)] hover:shadow-[0_0_36px_rgba(57,255,20,0.7)] hover:scale-[1.02] disabled:scale-100 transition-all duration-300 font-['Poppins',sans-serif] font-bold text-[16px] text-black dark:text-black"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="font-['Poppins',sans-serif] text-[14px] text-white/60 dark:text-[#0A0E1A]/60">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[#39FF14] hover:text-[#32E012] font-semibold transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
