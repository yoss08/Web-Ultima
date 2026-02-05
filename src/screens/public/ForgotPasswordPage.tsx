import { motion } from "motion/react";
import { useState } from "react";
import { Link } from "react-router";
import { Mail, ArrowLeft } from "lucide-react";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] dark:bg-gray-50 flex items-center justify-center px-6 py-12 transition-colors duration-300">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0E1A] via-[#0F1425] to-[#0A0E1A] dark:from-gray-50 dark:via-white dark:to-gray-50"></div>

      {/* Forgot Password Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-black/80 dark:bg-white/90 backdrop-blur-xl border border-white/10 dark:border-[#0A0E1A]/10 rounded-[32px] p-10 shadow-2xl">
          {/* Back to Login */}
          <Link
            to="/login"
            className="inline-flex items-center gap-2 mb-8 font-['Poppins',sans-serif] text-[14px] text-white/60 dark:text-[#0A0E1A]/60 hover:text-[#39FF14] dark:hover:text-[#39FF14] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>

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

          {!success ? (
            <>
              {/* Title */}
              <div className="text-center mb-8">
                <h2 className="font-['Poppins',sans-serif] font-bold text-[28px] text-white dark:text-[#0A0E1A] mb-2">
                  Reset your password
                </h2>
                <p className="font-['Poppins',sans-serif] text-[15px] text-white/60 dark:text-[#0A0E1A]/60">
                  Enter your email and we'll send you a reset link
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 dark:bg-[#0A0E1A]/5 backdrop-blur-sm h-[52px] pl-12 pr-4 rounded-[14px] border border-white/20 dark:border-[#0A0E1A]/20 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-transparent transition-all text-white dark:text-[#0A0E1A] placeholder:text-white/40 dark:placeholder:text-[#0A0E1A]/40"
                      placeholder="your.email@company.com"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#39FF14] hover:bg-[#32E012] disabled:bg-[#39FF14]/50 dark:bg-[#39FF14] dark:hover:bg-[#32E012] h-[56px] rounded-[14px] shadow-[0_0_24px_rgba(57,255,20,0.4)] hover:shadow-[0_0_36px_rgba(57,255,20,0.7)] hover:scale-[1.02] disabled:scale-100 transition-all duration-300 font-['Poppins',sans-serif] font-bold text-[16px] text-black dark:text-black"
                >
                  {loading ? "Sending..." : "Send reset link"}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center py-8">
                {/* Success Icon */}
                <div className="w-20 h-20 bg-[#39FF14]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-[#39FF14]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <h2 className="font-['Poppins',sans-serif] font-bold text-[24px] text-white dark:text-[#0A0E1A] mb-3">
                  Check your email
                </h2>
                <p className="font-['Poppins',sans-serif] text-[15px] text-white/60 dark:text-[#0A0E1A]/60 mb-8">
                  We've sent a password reset link to{" "}
                  <span className="text-[#39FF14] font-medium">{email}</span>
                </p>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center w-full bg-white/5 dark:bg-[#0A0E1A]/5 hover:bg-white/10 dark:hover:bg-[#0A0E1A]/10 h-[56px] rounded-[14px] border border-white/20 dark:border-[#0A0E1A]/20 transition-all font-['Poppins',sans-serif] font-semibold text-[16px] text-white dark:text-[#0A0E1A]"
                >
                  Back to login
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
