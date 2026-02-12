import { motion } from "motion/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Mail, Lock, Loader2 } from "lucide-react";
import { authHelpers } from "../../config/supabase";
import { useTheme } from "../../styles/useTheme";
import { toast } from "react-hot-toast";

export function LoginPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [loading, setLoading] = useState(false);
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
      toast.error(signInError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      toast.success("Welcome back to Ultima!");
      navigate("/dashboard");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E1A] flex flex-col items-center justify-center p-6 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[560px] bg-white dark:bg-white/5 border border-[#0A0E1A]/5 dark:border-white/10 rounded-[40px] overflow-hidden shadow-2xl relative"
      >
        <div className="p-8 md:p-12">
          {/* Header identique au SignUp */}
          <div className="text-center mb-10">
            <h1 className="font-['Playfair_Display',serif] text-[40px] font-bold text-[#0A0E1A] dark:text-white mb-2">
              Welcome Back
            </h1>
            <p className="font-['Poppins',sans-serif] text-[16px] text-[#0A0E1A]/50 dark:text-white/50">
              Access your professional tennis dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0A0E1A]/30 dark:text-white/30" size={20} />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-[#00E5FF] rounded-2xl dark:text-white outline-none transition-all font-['Poppins',sans-serif]"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0A0E1A]/30 dark:text-white/30" size={20} />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-[#00E5FF] rounded-2xl dark:text-white outline-none transition-all font-['Poppins',sans-serif]"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="font-['Poppins',sans-serif] text-[13px] text-[#00E5FF] hover:text-[#00D4E6] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-xs font-bold text-center animate-pulse">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#00E5FF] rounded-[28px] shadow-[0_0_32px_rgba(0,229,255,0.5)] hover:shadow-[0_0_48px_rgba(0,229,255,0.7)] hover:scale-[1.02] disabled:scale-100 transition-all duration-300 font-['Poppins',sans-serif] font-bold text-[16px] text-black mt-6 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Logging in...
                </>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="font-['Poppins',sans-serif] text-[14px] text-[#0A0E1A]/50 dark:text-white/50">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[#0A0E1A] dark:text-white font-semibold hover:text-[#00E5FF] transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Back to Home Link - Sortie de la carte comme dans SignUp */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-8"
      >
        <Link 
          to="/" 
          className="flex items-center gap-2 text-[#0A0E1A]/50 dark:text-white/50 hover:text-[#00E5FF] transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-['Poppins',sans-serif] text-[14px] font-medium">Back to Home</span>
        </Link>
      </motion.div>
    </div>
  );
}