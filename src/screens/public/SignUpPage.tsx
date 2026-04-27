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
        role: formData.accountType.toLowerCase() as any,
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
    <div className="min-h-screen bg-gradient-to-b from-muted/50 via-background to-background transition-colors duration-300 flex flex-col items-center justify-center px-6 py-12">
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[560px] bg-card border border-border rounded-[40px] overflow-hidden shadow-2xl relative"
      >
        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-['Playfair_Display',serif] text-[40px] font-bold text-foreground mb-2">
              Create Account
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/30" size={20} />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full h-14 pl-12 pr-4 bg-muted border border-transparent focus:border-accent rounded-2xl text-foreground outline-none transition-all font-['Poppins',sans-serif]"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/30" size={20} />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full h-14 pl-12 pr-4 bg-muted border border-transparent focus:border-accent rounded-2xl text-foreground outline-none transition-all font-['Poppins',sans-serif]"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/30" size={20} />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full h-14 pl-12 pr-4 bg-muted border border-transparent focus:border-accent rounded-2xl text-foreground outline-none transition-all font-['Poppins',sans-serif]"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/30" size={20} />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full h-14 pl-12 pr-4 bg-muted border border-transparent focus:border-accent rounded-2xl text-foreground outline-none transition-all font-['Poppins',sans-serif]"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>
            {/* Account Type Selector - Original Design */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, accountType: "Player" })}
                className={`flex flex-col items-center justify-center gap-3 p-4 rounded-[24px] border-2 transition-all duration-300 ${
                  formData.accountType === "Player"
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-transparent bg-muted text-muted-foreground"
                }`}
              >
                <Users size={24} />
                <span className="font-['Poppins',sans-serif] font-bold text-[14px]">Player</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, accountType: "Coach" })}
                className={`flex flex-col items-center justify-center gap-3 p-4 rounded-[24px] border-2 transition-all duration-300 ${
                  formData.accountType === "Coach"
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-transparent bg-muted text-muted-foreground"
                }`}
              >
                <Dumbbell size={24} />
                <span className="font-['Poppins',sans-serif] font-bold text-[14px]">Coach</span>
              </button>
            </div>

            {/* submit button*/}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-accent rounded-[28px] shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:scale-[1.02] disabled:scale-100 transition-all duration-300 font-['Poppins',sans-serif] font-bold text-[16px] text-accent-foreground mt-6"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="font-['Poppins',sans-serif] text-[14px] text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-foreground font-semibold hover:text-accent/80 transition-colors">
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
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-['Poppins',sans-serif] text-[14px] font-medium">Back to Home</span>
        </Link>
      </motion.div>
    </div>
  );
}