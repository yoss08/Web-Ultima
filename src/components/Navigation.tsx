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
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border transition-colors duration-300"
    >
      <div className="max-w-[1096px] mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="font-['Arial',sans-serif] font-bold text-[20px] sm:text-[24px] text-foreground tracking-[1.2px] transition-colors duration-300"
          >
            ULTIMA
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors">About</Link>
            <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors">Contact</a>
            <Link to="/solutions" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors">Solutions</Link>
            <Link to="/summa" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors">SUMMA</Link>
            <Link to="/almus" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors">ALMUS</Link>
            
            <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-xl bg-muted hover:bg-accent/10 transition-colors">
              {isDark ? <Sun className="w-5 h-5 text-accent" /> : <Moon className="w-5 h-5 text-muted-foreground" />}
            </button>
            
            {user ? (
              // SI CONNECTÉ
              <Link
                to="/dashboard"
                className="bg-accent hover:bg-accent/90 h-[40px] px-6 rounded-full hover:scale-105 transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[14px] text-accent-foreground flex items-center justify-center shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/50"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            ) : (
              // SI DÉCONNECTÉ
              <Link to="/login" className="bg-accent hover:bg-accent/90 h-[40px] px-6 rounded-full hover:scale-105 transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[14px] text-accent-foreground flex items-center justify-center shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/50">
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-muted hover:bg-accent/10 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
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
            className="md:hidden border-t border-border bg-background overflow-hidden"
          >
            <div className="px-6 py-6 space-y-4">
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium text-muted-foreground hover:text-accent transition-colors">About</Link>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium text-muted-foreground hover:text-accent transition-colors">Contact</a>
              <Link to="/solutions" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium text-muted-foreground hover:text-accent transition-colors">Solutions</Link>
              <Link to="/summa" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium text-muted-foreground hover:text-accent transition-colors">SUMMA</Link>
              <Link to="/almus" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium text-muted-foreground hover:text-accent transition-colors">ALMUS</Link>
              
              <div className="pt-4 space-y-3 border-t border-border">
                <button onClick={() => setIsDark(!isDark)} className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-muted hover:bg-accent/10 transition-colors">
                  {isDark ? <Sun className="w-5 h-5 text-accent" /> : <Moon className="w-5 h-5 text-foreground" />}
                  <span className="text-sm font-medium text-muted-foreground">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                {user ? (
                  // SI CONNECTÉ
                  <Link
                    to="/dashboard"
                    className="w-full bg-accent hover:bg-accent/90 h-[40px] px-6 rounded-full hover:scale-105 transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[14px] text-accent-foreground flex items-center justify-center shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/50"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                ) : (
                  // SI DÉCONNECTÉ
                  <Link to="/login" className="w-full bg-accent hover:bg-accent/90 h-[40px] px-6 rounded-full hover:scale-105 transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[14px] text-accent-foreground flex items-center justify-center shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/50">
                    Get Started
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
