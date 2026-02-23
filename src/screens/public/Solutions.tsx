import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, ArrowRight, Check, Mail, Phone, Menu, X } from "lucide-react";
import { ImageWithFallback } from "../../components/Design/ImageWithFallback";
import { useTheme } from "../../styles/useTheme";
import { toast, Toaster } from 'sonner';

import waterImage from "../../images/water.jpg";

export function Solutions() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDark, setIsDark } = useTheme();
  const scrollToContact = () => {
    const contactSection = document.getElementById("solution-cta");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const solutions = [
    {
      name: "SUMMA",
      title: "Padel Sports Dashboard",
      description:
        "Comprehensive court management and analytics platform for padel facilities. Monitor live matches, track player performance, and optimize facility operations.",
      color: "#10B981",
      darkColor: "#39FF14",
      image: "https://images.unsplash.com/photo-1646651105454-6c167ea6f83b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      features: [
        "Live match monitoring",
        "Court management system",
        "Performance analytics",
        "Booking integration",
        "Player tracking",
        "Revenue insights",
      ],
      link: "/summa",
    },
    {
      name: "ALMUS",
      title: "Smart Hydration Station",
      description:
        "On-site hydration solution delivering flavored, low-calorie beverages designed for active environments. Enhance user experience while maintaining facility standards.",
      color: "#3B82F6",
      darkColor: "#00E5FF",
      image: waterImage,
      features: [
        "Multiple flavor options",
        "Low-calorie formulas",
        "Touchless dispensing",
        "High-traffic ready",
        "Low maintenance",
        "Usage analytics",
      ],
      link: "/almus",
    },
  ];

  const industries = [
    "Padel & Tennis Facilities",
    "Fitness Centers & Gyms",
    "Sports Training Centers",
    "Wellness Facilities",
    "Country Clubs",
    "Corporate Wellness Programs",
  ];

  const getSolutionColor = (solution: typeof solutions[0]) => {
    return isDark ? solution.darkColor : solution.color;
  };


  const handleContactClick = () => {
    toast.custom((t) => (
      <div className="bg-white dark:bg-[#0F1425] border border-gray-200 dark:border-white/10 p-4 sm:p-6 rounded-[24px] shadow-2xl flex flex-col gap-4 min-w-[280px] sm:min-w-[300px] max-w-[90vw]">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 dark:text-white font-['Poppins'] text-[16px] sm:text-[18px]">Contact Details</h3>
          <button onClick={() => toast.dismiss(t)} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-[#39FF14]/10 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 text-emerald-600 dark:text-[#39FF14]" />
            </div>
            <span className="text-gray-700 dark:text-white/80 font-medium text-sm sm:text-base break-all">+216 96 094 772</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-400/10 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-gray-700 dark:text-white/80 font-medium text-sm sm:text-base break-all">Ultima.contacus@gmail.com</span>
          </div>
        </div>
      </div>
    ), {
      duration: 5000,
      position: 'bottom-right',
    });
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#0A0E1A] dark:to-black transition-colors duration-300">
      {/* Navigation */}
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
              <a href="#contact" className="text-sm font-medium hover:text-blue-500 transition-colors">Contact</a>
              <Link to="/solutions" className="text-sm font-medium hover:text-blue-500 transition-colors">Solutions</Link>
              <Link to="/summa" className="text-sm font-medium hover:text-blue-500 transition-colors">SUMMA</Link>
              <Link to="/almus" className="text-sm font-medium hover:text-blue-500 transition-colors">ALMUS</Link>
              <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 dark:bg-[#00E5FF] dark:hover:bg-[#00D4E6] h-[40px] px-6 rounded-full hover:scale-105 transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[14px] text-white dark:text-black flex items-center justify-center shadow-lg dark:shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-xl dark:hover:shadow-[0_0_30px_rgba(0,229,255,0.5)]">
                Get Started
              </button>
              {/* Nouveau Bouton Live Matches */}
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 transition-all duration-300 group"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                </span>
                <span className="font-['Poppins',sans-serif] font-semibold text-[14px] text-red-600 dark:text-red-500">
                  Live Matches
                </span>
              </button>
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
                <a href="#contact" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium hover:text-blue-500 transition-colors">Contact</a>
                <Link to="/solutions" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium hover:text-blue-500 transition-colors">Solutions</Link>
                <Link to="/summa" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium hover:text-blue-500 transition-colors">SUMMA</Link>
                <Link to="/almus" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium hover:text-blue-500 transition-colors">ALMUS</Link>

                <div className="pt-4 space-y-3 border-t border-gray-200 dark:border-white/10">
                  <button onClick={() => setIsDark(!isDark)} className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                    {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
                    <span className="text-sm font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>
                  <button className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-[#00E5FF] dark:hover:bg-[#00D4E6] h-[40px] px-6 rounded-full hover:scale-105 transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[14px] text-white dark:text-black flex items-center justify-center shadow-lg dark:shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-xl dark:hover:shadow-[0_0_30px_rgba(0,229,255,0.5)]">
                    Get Started
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 transition-all duration-300">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                    </span>
                    <span className="font-['Poppins',sans-serif] font-semibold text-[14px] text-red-600 dark:text-red-500">
                      Live Matches
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] pt-24 pb-12 sm:pt-32 sm:pb-16 overflow-hidden bg-gray-50 dark:bg-[#060910] transition-colors duration-300">
        {/* Background Blurs matching the new aesthetic */}
        <div className="absolute bg-blue-400/10 dark:bg-[rgba(0,229,255,0.05)] blur-[120px] left-[15%] rounded-full w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] top-[10%]" />
        <div className="absolute bg-emerald-400/10 dark:bg-[rgba(57,255,20,0.03)] blur-[120px] right-[15%] rounded-full w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] top-[20%]" />

        <div className="max-w-[1096px] mx-auto px-4 sm:px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h1
              className="font-['Playfair_Display',serif] font-bold text-[48px] sm:text-[64px] md:text-[80px] leading-[1.1] text-gray-900 dark:text-white mb-4 sm:mb-6"
              style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
            >
              ULTIMA Solutions
            </h1>
            <p className="font-['Poppins',sans-serif] text-[18px] sm:text-[22px] md:text-[28px] leading-[1.5] text-gray-600 dark:text-white/70 max-w-[800px] mx-auto transition-colors duration-300 px-4">
              Intelligent systems designed to enhance safety, efficiency, and
              experience in modern sports and wellness facilities
            </p>
          </motion.div>

          {/* Solutions Grid */}
          <div className="space-y-12 sm:space-y-16 mt-12 sm:mt-20">
            {solutions.map((solution, index) => {
              const solutionColor = getSolutionColor(solution);

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 * index }}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""
                    }`}
                >
                  {/* Content */}
                  <div
                    className={`${index % 2 === 1 ? "lg:order-2" : "lg:order-1"}`}
                  >
                    <div className="mb-4 sm:mb-6">
                      <h2
                        className="font-['Playfair_Display',serif] font-bold text-[48px] sm:text-[56px] md:text-[64px] text-gray-900 dark:text-white mb-3 transition-colors duration-300"
                        style={{
                          fontVariationSettings: "'opsz' 12, 'wdth' 100",
                        }}
                      >
                        {solution.name}
                      </h2>
                      <div
                        className="h-[6px] w-[128px] rounded-full shadow-lg"
                        style={{
                          backgroundColor: solutionColor,
                          boxShadow: `0px 0px 20px 0px ${solutionColor}80`,
                        }}
                      />
                    </div>

                    <h3 className="font-['Poppins',sans-serif] font-medium text-[22px] sm:text-[26px] md:text-[28px] text-gray-800 dark:text-white/90 mb-4 transition-colors duration-300">
                      {solution.title}
                    </h3>

                    <p className="font-['Poppins',sans-serif] text-[16px] sm:text-[18px] md:text-[20px] leading-[1.6] text-gray-600 dark:text-white/70 mb-6 sm:mb-8 transition-colors duration-300">
                      {solution.description}
                    </p>

                    {/* Features List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                      {solution.features.map((feature, fIndex) => (
                        <div key={fIndex} className="flex items-center gap-3">
                          <Check
                            className="w-5 h-5 flex-shrink-0"
                            style={{ color: solutionColor }}
                          />
                          <span className="font-['Poppins',sans-serif] text-[16px] text-gray-700 dark:text-white/80 transition-colors duration-300">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Link
                      to={solution.link}
                      className="inline-flex items-center gap-2 h-[48px] sm:h-[56px] px-6 sm:px-8 rounded-full hover:scale-105 transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[14px] sm:text-[16px] text-white dark:text-black"
                      style={{
                        backgroundColor: solutionColor,
                        boxShadow: `0px 0px 20px 0px ${solutionColor}40`,
                      }}
                    >
                      Learn more about {solution.name}
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>

                  {/* Image Card */}
                  <div
                    className={`${index % 2 === 1 ? "lg:order-1" : "lg:order-2"}`}
                  >
                    <div className="bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 md:p-8 shadow-xl backdrop-blur-sm transition-colors duration-300">
                      <div className="aspect-square bg-gradient-to-br from-gray-100 to-transparent dark:from-white/10 dark:to-transparent rounded-[20px] sm:rounded-[24px] overflow-hidden transition-colors duration-300">
                        <ImageWithFallback
                          src={solution.image}
                          alt={`${solution.name} - ${solution.title}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden bg-gray-50 dark:bg-[#060910] transition-colors duration-300">
        {/* Refined Center Glow */}
        <div className="absolute bg-blue-400/10 dark:bg-[rgba(0,229,255,0.05)] blur-[120px] left-1/2 -translate-x-1/2 rounded-full w-[600px] h-[600px] top-0" />

        <div className="max-w-[936px] mx-auto px-4 sm:px-6 relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 sm:mb-12"
          >
            <h2
              className="font-['Playfair_Display',serif] font-bold text-[40px] sm:text-[52px] md:text-[62px] leading-[1.2] text-gray-900 dark:text-white mb-4 sm:mb-6 transition-colors duration-300"
              style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
            >
              Built for your industry
            </h2>
            <p className="font-['Poppins',sans-serif] text-[18px] sm:text-[20px] md:text-[24px] leading-[1.4] text-gray-600 dark:text-white/70 max-w-[761px] mx-auto transition-colors duration-300 px-4">
              ULTIMA solutions are trusted by leading facilities across multiple
              industries
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {industries.map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                className="bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[16px] sm:rounded-[20px] p-4 sm:p-6 shadow-lg hover:bg-white dark:hover:bg-white/10 transition-all duration-300"
              >
                <p className="font-['Poppins',sans-serif] text-[16px] sm:text-[18px] text-gray-800 dark:text-white/90 transition-colors duration-300">
                  {industry}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="solution-cta" className="relative py-20 sm:py-24 md:py-32 overflow-hidden bg-gray-50 dark:bg-[#060910] transition-colors duration-300">
        {/* Subtle Glow to lift the CTA */}
        <div className="absolute bg-blue-400/10 dark:bg-[rgba(0,229,255,0.05)] blur-[150px] left-1/2 -translate-x-1/2 rounded-full w-[500px] h-[500px] -top-20" />

        <div className="max-w-[800px] mx-auto px-4 sm:px-6 relative text-center">
          <motion.div
            id="contact"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2
              className="font-['Playfair_Display',serif] font-bold text-[40px] sm:text-[52px] md:text-[62px] leading-[1.2] text-gray-900 dark:text-white mb-4 sm:mb-6 transition-colors duration-300"
              style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
            >
              Ready to transform your facility?
            </h2>
            <p className="font-['Poppins',sans-serif] text-[18px] sm:text-[20px] md:text-[24px] leading-[1.4] text-gray-600 dark:text-white/70 mb-8 sm:mb-12 transition-colors duration-300 px-4">
              Contact us to learn how ULTIMA solutions can enhance your
              operations
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">

              <Toaster />
              <button onClick={handleContactClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 dark:bg-[#00e5ff] dark:hover:bg-[#00d4e6] h-[48px] sm:h-[56px] px-6 sm:px-8 rounded-full hover:scale-105 transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[14px] sm:text-[16px] text-white dark:text-black shadow-lg dark:shadow-[0px_0px_20px_0px_rgba(0,229,255,0.3)]"
              >
                Contact Sales
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/80 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10 border-2 border-gray-300 dark:border-white/20 h-[48px] sm:h-[56px] px-6 sm:px-8 rounded-full transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[14px] sm:text-[16px] text-gray-800 dark:text-white"
              >
                Create Account
              </button>
            </div>
          </motion.div>
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
                  <a
                    href="#"
                    className="font-['Poppins',sans-serif] text-[14px] text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    About us
                  </a>
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
                      href="tel:+21696094772"
                      className="flex items-center gap-2 font-['Poppins',sans-serif] text-[14px] text-gray-300 hover:text-white transition-colors duration-300 group"
                    >
                      <Phone className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                      <span>96 094 772</span>
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
