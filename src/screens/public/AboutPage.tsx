import {
  Mail, Phone, MapPin, Instagram, Linkedin,
  Users, Target, Eye, Heart, Award, Globe, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Moon, Sun, ArrowRight, Brain, Menu, X, LayoutDashboard} from "lucide-react";
import { Link } from "react-router";
import { useTheme } from "../../styles/useTheme";
import { useAuth } from "../../services/AuthContext";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export function AboutPage() {
  const { isDark, setIsDark } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E1A] text-[#0A0E1A] dark:text-white">
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
              <Link to="/about" className="text-sm font-medium hover:text-blue-500 transition-colors">About</Link>
              <a href="#contact" className="text-sm font-medium hover:text-blue-500 transition-colors">Contact</a>
              <Link to="/solutions" className="text-sm font-medium hover:text-blue-500 transition-colors">Solutions</Link>
              <Link to="/summa" className="text-sm font-medium hover:text-blue-500 transition-colors">SUMMA</Link>
              <Link to="/almus" className="text-sm font-medium hover:text-blue-500 transition-colors">ALMUS</Link>
              <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
              </button>
               {user ? (
          // SI CONNECTÉ
          <Link
            to="/dashboard"
            className="bg-[#39FF14] hover:bg-[#32e612] h-[40px] px-6 rounded-full hover:scale-105 transition-all duration-300 font-['Poppins',sans-serif] font-bold text-[14px] text-black flex items-center justify-center gap-2 shadow-lg shadow-[#39FF14]/20"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
        ) : (
          // SI DÉCONNECTÉ
          <>
              <Link
                to="/signup" className="bg-blue-500 hover:bg-blue-600 dark:bg-[#00E5FF] dark:hover:bg-[#00D4E6] h-[40px] px-6 rounded-full hover:scale-105 transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[14px] text-white dark:text-black flex items-center justify-center shadow-lg dark:shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-xl dark:hover:shadow-[0_0_30px_rgba(0,229,255,0.5)]">
                Get Started
              </Link>
              </>
              )}
              {/* Nouveau Bouton Live Matches 
              <Link
                to="/live-matches"
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 transition-all duration-300 group"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                </span>
                <span className="font-['Poppins',sans-serif] font-semibold text-[14px] text-red-600 dark:text-red-500">
                  Live 
                </span>
              </Link>
              */}
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
                <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium hover:text-blue-500 transition-colors">About</Link>
                <a href="#contact" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium hover:text-blue-500 transition-colors">Contact</a>
                <Link to="/solutions" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium hover:text-blue-500 transition-colors">Solutions</Link>
                <Link to="/summa" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium hover:text-blue-500 transition-colors">SUMMA</Link>
                <Link to="/almus" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium hover:text-blue-500 transition-colors">ALMUS</Link>
                

                <div className="pt-4 space-y-3 border-t border-gray-200 dark:border-white/10">
                  <button onClick={() => setIsDark(!isDark)} className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                    {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
                    <span className="text-sm font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>
                  {user ? (
          // SI CONNECTÉ
          <Link
            to="/dashboard"
            className="w-full bg-[#39FF14] hover:bg-[#32e612] h-[40px] px-6 rounded-full hover:scale-105 transition-all duration-300 font-['Poppins',sans-serif] font-bold text-[14px] text-black flex items-center justify-center gap-2 shadow-lg shadow-[#39FF14]/20"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
        ) : (
          // SI DÉCONNECTÉ
          <>
              <Link
                to="/signup" className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-[#00E5FF] dark:hover:bg-[#00D4E6] h-[40px] px-6 rounded-full hover:scale-105 transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[14px] text-white dark:text-black flex items-center justify-center shadow-lg dark:shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-xl dark:hover:shadow-[0_0_30px_rgba(0,229,255,0.5)]">
                Get Started
              </Link>
              </>
              )}
              {/* 
                  <Link to="/live-matches" className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 transition-all duration-300">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                    </span>
                    <span className="font-['Poppins',sans-serif] font-semibold text-[14px] text-red-600 dark:text-red-500">
                      Live 
                    </span>
                  </Link>
                  */}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      {/* Hero */}
      <section className="relative overflow-hidden py-28 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-[#39FF14]/10 via-transparent to-[#00E5FF]/5" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.p
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="text-[#39FF14] font-black text-sm uppercase tracking-[0.3em] mb-4"
          >
            About ULTIMA
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-['Playfair_Display',serif] text-5xl md:text-7xl font-black leading-tight mb-6"
          >
            Redefining <span className="text-[#39FF14]">Sports</span> Technology
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-lg md:text-xl opacity-60 max-w-2xl mx-auto font-['Poppins']"
          >
            ULTIMA is pioneering the future of sports analytics, combining cutting-edge AI
            with hardware innovation to transform how athletes train, compete, and grow.
          </motion.p>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { icon: Target, title: "Our Mission", desc: "Empower every athlete with smart technology that reveals their true potential, making professional-grade analytics accessible to everyone.", color: "#39FF14" },
            { icon: Eye, title: "Our Vision", desc: "A world where every court is intelligent, every match provides insights, and every player has a data-driven path to excellence.", color: "#00E5FF" },
            { icon: Heart, title: "Our Values", desc: "Innovation without complexity. Performance with purpose. Community through competition. We believe technology should elevate, not complicate.", color: "#FFD700" },
          ].map((item, i) => (
            <motion.div
              key={item.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp}
              className="bg-gray-50 dark:bg-white/5 p-8 rounded-[28px] border border-gray-100 dark:border-white/10 hover:border-[#39FF14]/30 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: `${item.color}15` }}>
                <item.icon size={24} style={{ color: item.color }} />
              </div>
              <h3 className="text-xl font-black mb-3">{item.title}</h3>
              <p className="opacity-60 text-sm leading-relaxed font-['Poppins']">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="font-['Playfair_Display',serif] text-4xl md:text-5xl font-black mb-8 text-center">
              Our <span className="text-[#39FF14]">Story</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-5 text-[15px] opacity-70 leading-relaxed font-['Poppins']">
                <p>
                  Founded with the vision of merging technology and sport, ULTIMA began as a small team
                  of engineers and athletes who believed that data could unlock untapped potential in every player.
                </p>
                <p>
                  From our first prototype of the ALMUS scoring system to the launch of PersonaVision AI
                  recognition, every step has been driven by one goal: making professional-grade sports
                  analytics accessible to everyone.
                </p>
                <p>
                  Today, ULTIMA powers courts across multiple locations, serving hundreds of athletes
                  from beginners to professionals, with technology that sees, understands, and improves the game.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { num: "500+", label: "Athletes", icon: Users },
                  { num: "12", label: "Smart Courts", icon: Globe },
                  { num: "50K+", label: "Matches Analyzed", icon: Award },
                  { num: "98%", label: "Satisfaction", icon: Heart },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white dark:bg-white/5 p-5 rounded-2xl border border-gray-200 dark:border-white/10 text-center">
                    <p className="text-2xl font-black text-[#39FF14]">{stat.num}</p>
                    <p className="text-xs opacity-50 mt-1 font-bold uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-['Playfair_Display',serif] text-4xl font-black mb-10 text-center">
            Get In <span className="text-[#39FF14]">Touch</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Cards */}
            <div className="space-y-4">
              <a href="tel:+1234567890" className="flex items-center gap-4 p-5 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-[#39FF14]/40 transition-all group">
                <div className="p-3 bg-[#39FF14]/10 rounded-xl group-hover:scale-110 transition-transform">
                  <Phone size={20} className="text-[#39FF14]" />
                </div>
                <div>
                  <p className="font-bold">Call Us</p>
                  <p className="text-sm opacity-50">+216 96 094 772</p>
                </div>
                <ChevronRight size={16} className="ml-auto opacity-30" />
              </a>

              <a href="mailto:contact@ultima-sport.com" className="flex items-center gap-4 p-5 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-[#00E5FF]/40 transition-all group">
                <div className="p-3 bg-[#00E5FF]/10 rounded-xl group-hover:scale-110 transition-transform">
                  <Mail size={20} className="text-[#00E5FF]" />
                </div>
                <div>
                  <p className="font-bold">Email Us</p>
                  <p className="text-sm opacity-50">Ultima.contacus@gmail.com</p>
                </div>
                <ChevronRight size={16} className="ml-auto opacity-30" />
              </a>

              <div className="flex items-center gap-4 p-5 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                <div className="p-3 bg-[#FFD700]/10 rounded-xl">
                  <MapPin size={20} className="text-[#FFD700]" />
                </div>
                <div>
                  <p className="font-bold">Visit Us</p>
                  <p className="text-sm opacity-50">la Soukra, Tunisia</p>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-3 pt-4">
                {[
                  { icon: Instagram, href: "", color: "#E1306C" },
                  { icon: Linkedin, href: "", color: "#0A66C2" },
                ].map(({ icon: Icon, href, color }) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl border border-gray-200 dark:border-white/10 flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Icon size={20} style={{ color }} />
                  </a>
                ))}
                <a href="" target="_blank" rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl border border-gray-200 dark:border-white/10 flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="opacity-70">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78c.27 0 .54.04.8.1V8.94a6.34 6.34 0 0 0-.8-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.88a8.26 8.26 0 0 0 3.76.91V6.69z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Map Embed */}
            <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 h-[400px]">
              <iframe
                src="https://www.google.com/maps/place/Arena+Gym+Premium/@36.8706722,10.2397764,15z/data=!4m6!3m5!1s0x12e2cb94862d47bf:0x494dcecf1c908ab8!8m2!3d36.8706722!4d10.2588308!16s%2Fg%2F11s3dftxvv?entry=ttu&g_ep=EgoyMDI2MDMyMi4wIKXMDSoASAFQAw%3D%3D"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" title="ULTIMA Location"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <h2 className="font-['Playfair_Display',serif] text-3xl md:text-4xl font-black mb-6">
          Ready to <span className="text-[#39FF14]">elevate</span> your game?
        </h2>
        <div className="flex gap-4 justify-center">
          <Link to="/signup" className="px-8 py-4 bg-[#39FF14] text-black font-black rounded-2xl hover:scale-105 transition-transform shadow-lg shadow-[#39FF14]/20">
            Sign Up Free
          </Link>
          <Link to="/solutions" className="px-8 py-4 border border-gray-300 dark:border-white/20 font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
            Explore Solutions
          </Link>
        </div>
      </section>
    </div>
  );
}
