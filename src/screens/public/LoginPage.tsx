import { motion } from "motion/react";
import { useState} from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Mail, Lock } from "lucide-react";
import { authHelpers } from "../../config/supabase";
import { useTheme } from "../../styles/useTheme";

export function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
   const { isDark, setIsDark } = useTheme();
  const [error, setError] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: signInError } = await authHelpers.signIn(
      formData.email,
      formData.password
    );

    if (signInError) {
      setError(signInError.message);
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
    <div   className="min-h-screen bg-gradient-to-b from-[#E8EBF0] via-[#F5F7FA] to-[#FFFFFF] dark:from-[#0A1F2E] dark:via-[#0A0E1A] dark:to-[#000000] transition-colors duration-300 flex flex-col items-center justify-center px-6 py-12">
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

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative w-full max-w-[420px]"
      >
        <div className="bg-white/95 dark:bg-[#0D1117]/95 backdrop-blur-xl transition-colors duration-300 rounded-[32px] p-12 shadow-2xl border border-black/5 dark:border-white/5">
        <div className="text-center mb-10">
          <h2 className="font-['Poppins',sans-serif] font-bold text-[32px] text-[#0A0E1A] dark:text-white mb-3">
            Welcome back
          </h2>
          <p className="font-['Poppins',sans-serif] text-[14px] text-[#0A0E1A]/50 dark:text-white/50">
            Access your ULTIMA dashboard
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="font-['Poppins',sans-serif] font-medium text-[14px] text-[#0A0E1A] dark:text-white"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0A0E1A]/30 dark:text-white/30" />
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

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="font-['Poppins',sans-serif] font-medium text-[14px] text-[#0A0E1A] dark:text-white"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0A0E1A]/30 dark:text-white/30" />
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
              <Link
                to="/forgot-password"
                className="font-['Poppins',sans-serif] text-[13px] text-[#00E5FF] hover:text-[#00D4E6] transition-colors text-right"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00E5FF] hover:bg-[#00D4E6] disabled:bg-[#00E5FF]/50 h-[56px] rounded-[28px] shadow-[0_0_32px_rgba(0,229,255,0.5)] hover:shadow-[0_0_48px_rgba(0,229,255,0.7)] hover:scale-[1.02] disabled:scale-100 transition-all duration-300 font-['Poppins',sans-serif] font-bold text-[16px] text-black mt-8"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="font-['Poppins',sans-serif] text-[14px] text-[#0A0E1A]/50 dark:text-white/50">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[#0A0E1A] dark:text-white font-semibold hover:text-[#00E5FF] dark:hover:text-[#00E5FF] transition-colors"
              >
                Sign up
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