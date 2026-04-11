import { useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, LayoutDashboard, Menu, X } from 'lucide-react';
import { useTheme } from '../styles/useTheme';
import { useAuth } from '../services/AuthContext';

export default function Navigation() {
  const { isDark, setIsDark } = useTheme();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[rgba(10,14,26,0.8)] backdrop-blur-xl border-b border-gray-200 dark:border-white/10 transition-colors duration-300"
    >
      <div className="max-w-[1096px] mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="font-['Arial',sans-serif] font-bold text-[20px] sm:text-[24px] text-gray-900 dark:text-white tracking-[1.2px] transition-colors duration-300"
          >
            ULTIMA
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/about" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-[#00E5FF] transition-colors">About</Link>
            <a href="#contact" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-[#00E5FF] transition-colors">Contact</a>
            <Link to="/solutions" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-[#00E5FF] transition-colors">Solutions</Link>
            <Link to="/summa" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-[#00E5FF] transition-colors">SUMMA</Link>
            <Link to="/almus" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-[#00E5FF] transition-colors">ALMUS</Link>
            
            <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
            </button>
            
            {user ? (
              // SI CONNECTÉ
              <Link
                to="/dashboard"
                className="bg-blue-500 dark:bg-[#00E5FF] hover:bg-[#00D4E6] h-[40px] px-6 rounded-full hover:scale-105 transition-all duration-300 font-['Poppins',sans-serif] font-bold text-[14px] text-black flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 dark:shadow-[#00E5FF]/20"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            ) : (
              // SI DÉCONNECTÉ
              <button className="bg-blue-500 hover:bg-blue-600 dark:bg-[#00E5FF] dark:hover:bg-[#00D4E6] h-[40px] px-6 rounded-full hover:scale-105 transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[14px] text-white dark:text-black flex items-center justify-center shadow-lg dark:shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-xl dark:hover:shadow-[0_0_30px_rgba(0,229,255,0.5)]">
                Get Started
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6 text-gray-900 dark:text-white" /> : <Menu className="w-6 h-6 text-gray-900 dark:text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#0A0E1A] overflow-hidden"
          >
            <div className="px-6 py-6 space-y-4">
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-[#00E5FF] transition-colors">About</Link>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-[#00E5FF] transition-colors">Contact</a>
              <Link to="/solutions" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-[#00E5FF] transition-colors">Solutions</Link>
              <Link to="/summa" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-[#00E5FF] transition-colors">SUMMA</Link>
              <Link to="/almus" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-[#00E5FF] transition-colors">ALMUS</Link>
              
              <div className="pt-4 space-y-3 border-t border-gray-200 dark:border-white/10">
                <button onClick={() => setIsDark(!isDark)} className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                  {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                {user ? (
                  // SI CONNECTÉ
                  <Link
                    to="/dashboard"
                    className="w-full bg-blue-500 dark:bg-[#00E5FF] hover:bg-[#00D4E6] h-[40px] px-6 rounded-full hover:scale-105 transition-all duration-300 font-['Poppins',sans-serif] font-bold text-[14px] text-black flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 dark:shadow-[#00E5FF]/20"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                ) : (
                  // SI DÉCONNECTÉ
                  <button className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-[#00E5FF] dark:hover:bg-[#00D4E6] h-[40px] px-6 rounded-full hover:scale-105 transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[14px] text-white dark:text-black flex items-center justify-center shadow-lg dark:shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-xl dark:hover:shadow-[0_0_30px_rgba(0,229,255,0.5)]">
                    Get Started
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
