import {
  Mail, Phone, MapPin, Instagram, Linkedin,
  Users, Target, Eye, Heart, Award, Globe, ChevronRight,
  Facebook
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Moon, Sun, ArrowRight, Brain, Menu, X, LayoutDashboard} from "lucide-react";
import { Link } from "react-router";
import { useTheme } from "../../styles/useTheme";
import { useAuth } from "../../services/AuthContext";
import { useState } from "react";
import Navigation from "../../components/Navigation";
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
      <Navigation />
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
      <section className="py-20 px-6 bg-gray-50 dark:bg-white/[0.02]">
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
          <h2 className="font-['Playfair_Display',serif] text-4xl md:text-5xl font-black mb-8 text-center">
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
                  <p className="text-sm opacity-50">+216 99799368</p>
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
    { icon: Facebook, href: "", color: "#305fe1ff" },
    { icon: Linkedin, href: "", color: "#0A66C2" },
  ].map(({ icon: Icon, href, color }) => (
    <a
      key={href}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-12 h-12 rounded-xl border border-gray-200 dark:border-white/10 flex items-center justify-center hover:scale-110 transition-transform"
    >
      <Icon size={20} style={{ color }} />
    </a>
  ))}
</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black border-t border-gray-700 dark:border-white/10 py-12 transition-colors duration-300">
        <div className="max-w-[1096px] mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Logo Column */}
            <div>
              <h3 className="font-['Arial',sans-serif] font-bold text-[20px] text-white mb-4">
                ULTIMA
              </h3>
            </div>

            {/* ULTIMA Column */}
            <div>
              <h4 className="font-['Poppins',sans-serif] font-semibold text-[14px] text-white mb-4">
                ULTIMA
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/about"
                    className="font-['Poppins',sans-serif] text-[14px] text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    About us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h4 className="font-['Poppins',sans-serif] font-semibold text-[14px] text-white mb-4">
                Support
              </h4>
              <ul className="space-y-2">

                <li>
                  <button
                    className="font-['Poppins',sans-serif] text-[14px] text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    FAQ
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-['Poppins',sans-serif] font-semibold text-[14px] text-white mb-4">
                Contact
              </h4>
              <ul className="space-y-2">
                <ul className="space-y-4">

                  <li>
                    <a
                      href="tel:+21699799368"
                      className="flex items-center gap-2 font-['Poppins',sans-serif] text-[14px] text-gray-300 hover:text-white transition-colors duration-300 group"
                    >
                      <Phone className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                      <span>+216 99 799 368</span>
                    </a>
                  </li>


                  <li>
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=Ultima.contacus@gmail.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 font-['Poppins',sans-serif] text-[14px] text-gray-300 hover:text-white transition-colors duration-300 group"
                    >
                      <Mail className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                      <span>Ultima.contacus@gmail.com</span>
                    </a>
                  </li>
                </ul>
              </ul>
            </div>
          </div>


          {/* Copyright */}
          <div className="pt-8 border-t border-gray-700 dark:border-white/10 text-center">
            <p className="font-['Poppins',sans-serif] text-[14px] text-gray-400">
              © {new Date().getFullYear()} ULTIMA. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
