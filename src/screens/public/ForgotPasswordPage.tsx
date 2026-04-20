import { motion } from "motion/react";
import { useState } from "react";
import { Link } from "react-router";
import { Mail, ArrowLeft } from "lucide-react";
import { authHelpers } from "../../config/supabase";
import { useTheme } from "../../styles/useTheme";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
    const { isDark } = useTheme();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: resetError } = await authHelpers.resetPassword(email);

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 flex flex-col items-center justify-center px-6 py-12">
      {/* Logo at top */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h1 className="font-['Arial',sans-serif] font-bold text-[32px] text-foreground tracking-[1.6px]">
          ULTIMA
        </h1>
      </motion.div>

      {/* Forgot Password Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="w-full max-w-[560px] bg-card border border-border rounded-[40px] overflow-hidden shadow-2xl relative"
      >
        <div className="p-8 md:p-12">
          {!success ? (
            <>
              {/* Title */}
              <div className="text-center mb-10">
                <h2 className="font-['Playfair_Display',serif] text-[40px] font-bold text-foreground mb-2">
                  Reset Password
                </h2>
                <p className="font-['Poppins',sans-serif] text-[14px] text-muted-foreground">
                  Enter your email and we'll send you a reset link
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
                    className="font-['Poppins',sans-serif] font-medium text-[14px] text-foreground"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-muted/50 h-[52px] pl-12 pr-4 rounded-[16px] border border-border focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground/50 font-['Poppins',sans-serif] text-[14px]"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent hover:opacity-90 disabled:opacity-50 h-[56px] rounded-[28px] shadow-lg dark:shadow-accent/20 hover:scale-[1.02] disabled:scale-100 transition-all duration-300 font-['Poppins',sans-serif] font-bold text-[16px] text-accent-foreground mt-8"
                >
                  {loading ? "Sending..." : "Send reset link"}
                </button>
              </form>

              {/* Back to Login Link */}
              <div className="mt-8 text-center">
                <p className="font-['Poppins',sans-serif] text-[14px] text-muted-foreground">
                  Remember your password?{" "}
                  <Link
                    to="/login"
                    className="text-foreground font-semibold hover:text-accent transition-colors"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center py-8">
                {/* Success Icon */}
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-accent"
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

                <h2 className="font-['Poppins',sans-serif] font-bold text-[28px] text-foreground mb-3">
                  Check your email
                </h2>
                <p className="font-['Poppins',sans-serif] text-[14px] text-muted-foreground mb-8">
                  We've sent a password reset link to{" "}
                  <span className="text-accent font-medium">{email}</span>
                </p>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center w-full bg-accent hover:opacity-90 h-[56px] rounded-[28px] shadow-lg dark:shadow-accent/20 hover:scale-[1.02] transition-all duration-300 font-['Poppins',sans-serif] font-bold text-[16px] text-accent-foreground"
                >
                  Back to login
                </Link>
              </div>
            </>
          )}
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
          className="inline-flex items-center gap-2 font-['Poppins',sans-serif] text-[14px] text-muted-foreground hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </motion.div>
    </div>
  );
}
