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
      className="fixed top-0 left-0 right-0 z-50 bg-[#0A0E1A] dark:bg-white border-b border-white/10 dark:border-[#0A0E1A]/10 transition-colors duration-300"
    >
      <div className="w-full px-8 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="font-['Poppins',sans-serif] font-bold text-[16px] text-white dark:text-[#0A0E1A] tracking-[0.1em] uppercase"
          >
            ULTIMA
          </Link>

          {/* Center Links */}
          <div className="flex items-center gap-10">
            <Link
              to="/"
              className="text-white/70 hover:text-white dark:text-[#0A0E1A]/70 dark:hover:text-[#0A0E1A] transition-colors font-['Poppins',sans-serif] font-normal text-[14px]"
            >
              Solutions
            </Link>
            <Link
              to="/summa"
              className="text-white/70 hover:text-white dark:text-[#0A0E1A]/70 dark:hover:text-[#0A0E1A] transition-colors font-['Poppins',sans-serif] font-normal text-[14px]"
            >
              SUMMA
            </Link>
            <Link
              to="/almus"
              className="text-white/70 hover:text-white dark:text-[#0A0E1A]/70 dark:hover:text-[#0A0E1A] transition-colors font-['Poppins',sans-serif] font-normal text-[14px]"
            >
              ALMUS
            </Link>
            <Link
              to="/#about"
              className="text-white/70 hover:text-white dark:text-[#0A0E1A]/70 dark:hover:text-[#0A0E1A] transition-colors font-['Poppins',sans-serif] font-normal text-[14px]"
            >
              About
            </Link>
            <Link
              to="/#contact"
              className="text-white/70 hover:text-white dark:text-[#0A0E1A]/70 dark:hover:text-[#0A0E1A] transition-colors font-['Poppins',sans-serif] font-normal text-[14px]"
            >
              Contact
            </Link>
          </div>

          {/* Right Side: Dark Mode Toggle + Auth Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 dark:bg-[#0A0E1A]/10 dark:hover:bg-[#0A0E1A]/20 transition-all duration-300"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Moon className="w-5 h-5 text-white dark:text-[#0A0E1A]" />
              ) : (
                <Sun className="w-5 h-5 text-white dark:text-[#0A0E1A]" />
              )}
            </button>
            
            <Link
              to="/login"
              className="text-white/70 hover:text-white dark:text-[#0A0E1A]/70 dark:hover:text-[#0A0E1A] transition-colors font-['Poppins',sans-serif] font-semibold text-[14px]"
            >
              Login
            </Link>
            
            <Link
              to="/signup"
              className="bg-[#39FF14] hover:bg-[#32E012] dark:bg-[#39FF14] dark:hover:bg-[#32E012] h-[40px] px-6 rounded-full hover:scale-105 transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[14px] text-black dark:text-black flex items-center justify-center shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)]"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}