import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { Moon, Sun } from "lucide-react";

interface NavigationProps {
  isDark: boolean;
  setIsDark: (value: boolean) => void;
}

export function Navigation({ isDark, setIsDark }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-[rgba(0,0,0,0.6)] backdrop-blur-xl border-b border-white/10"
      >
        <div className="max-w-[1096px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="font-['Arial',sans-serif] font-bold text-[24px] text-white tracking-[1.2px]"
            >
              ULTIMA
            </Link>

            {/* Center Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                to="/solutions"
                className="font-['Poppins',sans-serif] font-medium text-[16px] text-white/80 hover:text-white transition-colors"
              >
                Solutions
              </Link>
              <Link
                to="/summa"
                className="font-['Poppins',sans-serif] font-medium text-[16px] text-white/80 hover:text-white transition-colors"
              >
                SUMMA
              </Link>
              <Link
                to="/almus"
                className="font-['Poppins',sans-serif] font-medium text-[16px] text-white/80 hover:text-white transition-colors"
              >
                ALMUS
              </Link>
              <a
                href="#about"
                className="font-['Poppins',sans-serif] font-medium text-[16px] text-white/80 hover:text-white transition-colors"
              >
                About
              </a>
              <a
                href="#contact"
                className="font-['Poppins',sans-serif] font-medium text-[16px] text-white/80 hover:text-white transition-colors"
              >
                Contact
              </a>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsDark(!isDark)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <Moon className="w-5 h-5 text-white" />
                ) : (
                  <Sun className="w-5 h-5 text-white" />
                )}
              </button>

              <Link
                to="/login"
                className="text-white/70 hover:text-white transition-colors font-['Poppins',sans-serif] font-semibold text-[14px]"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="bg-[#00E5FF] hover:bg-[#00D4E6] h-[40px] px-6 rounded-full hover:scale-105 transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[14px] text-black flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)]"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

  );
}