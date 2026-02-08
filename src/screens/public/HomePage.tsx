import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Moon, Sun, ArrowRight } from "lucide-react";
import svgPaths from "../../components/icons/IconMainLogo";

const imgImageSummaPadelSportsDashboard = "/assets/images/padel1.jpg";
const imgImageAlmusSmartDispenserStation = "/assets/images/water.jpg";

export function HomePage() {
  const [isDark, setIsDark] = useState(() => {
    // Vérifier la préférence système ou le thème stocké
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) return storedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Appliquer le thème au document
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Form submitted! (This is a demo)");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#0A0E1A] dark:to-gray-900 transition-colors duration-300">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[rgba(10,14,26,0.8)] backdrop-blur-xl border-b border-gray-200 dark:border-white/10 transition-colors duration-300"
      >
        <div className="max-w-[1096px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="font-['Arial',sans-serif] font-bold text-[24px] text-gray-900 dark:text-white tracking-[1.2px] transition-colors duration-300"
            >
              ULTIMA
            </Link>

            {/* Center Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                to="/solutions"
                className="font-['Poppins',sans-serif] font-medium text-[16px] text-gray-700 dark:text-white/80 hover:text-blue-600 dark:hover:text-white transition-colors duration-300"
              >
                Solutions
              </Link>
              <Link
                to="/summa"
                className="font-['Poppins',sans-serif] font-medium text-[16px] text-gray-700 dark:text-white/80 hover:text-blue-600 dark:hover:text-white transition-colors duration-300"
              >
                SUMMA
              </Link>
              <Link
                to="/almus"
                className="font-['Poppins',sans-serif] font-medium text-[16px] text-gray-700 dark:text-white/80 hover:text-blue-600 dark:hover:text-white transition-colors duration-300"
              >
                ALMUS
              </Link>
              <a
                href="#about"
                className="font-['Poppins',sans-serif] font-medium text-[16px] text-gray-700 dark:text-white/80 hover:text-blue-600 dark:hover:text-white transition-colors duration-300"
              >
                About
              </a>
              <a
                href="#contact"
                className="font-['Poppins',sans-serif] font-medium text-[16px] text-gray-700 dark:text-white/80 hover:text-blue-600 dark:hover:text-white transition-colors duration-300"
              >
                Contact
              </a>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsDark(!isDark)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 transition-all duration-300"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </button>

              <Link
                to="/login"
                className="text-gray-700 dark:text-white/70 hover:text-blue-600 dark:hover:text-white transition-colors duration-300 font-['Poppins',sans-serif] font-semibold text-[14px]"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="bg-blue-500 hover:bg-blue-600 dark:bg-[#00E5FF] dark:hover:bg-[#00D4E6] h-[40px] px-6 rounded-full hover:scale-105 transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[14px] text-white dark:text-black flex items-center justify-center shadow-lg dark:shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-xl dark:hover:shadow-[0_0_30px_rgba(0,229,255,0.5)]"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - Choose Your Experience */}
      <section className="relative min-h-screen pt-32 pb-16 overflow-hidden bg-gray-50 dark:bg-[#060910] transition-colors duration-300">
        {/* Refined Glows */}
        <div className="absolute bg-blue-400/10 dark:bg-[rgba(0,229,255,0.05)] blur-[120px] left-[10%] rounded-full w-[400px] h-[400px] top-[10%]" />
        <div className="absolute bg-emerald-400/10 dark:bg-[rgba(57,255,20,0.03)] blur-[120px] right-[10%] rounded-full w-[400px] h-[400px] top-[5%]" />
        <div className="max-w-[1096px] mx-auto px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h1 className="font-['Poppins',sans-serif] text-[32px] text-gray-900 dark:text-white/90 tracking-[0.8px]">
              Choose Your Experience
            </h1>
          </motion.div>

          {/* Product Cards Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* SUMMA Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Link to="/summa" className="block group">
                <div className="relative h-[432px] rounded-[32px] overflow-hidden shadow-xl hover:scale-[1.02] transition-transform duration-300">
                  <img
                    src={imgImageSummaPadelSportsDashboard}
                    alt="SUMMA - Padel Sports Dashboard"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-10 flex flex-col gap-3">
                    <h2
                      className="font-['Playfair_Display',serif] font-bold text-[64px] text-white shadow-lg"
                      style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
                    >
                      SUMMA
                    </h2>
                    <p className="font-['Poppins',sans-serif] text-[20px] text-white/90">
                      Padel Sports Dashboard
                    </p>
                    <div className="bg-emerald-500 dark:bg-[#39ff14] h-[4px] w-[96px] rounded-full shadow-lg dark:shadow-[0px_0px_12px_0px_rgba(57,255,20,0.8)]" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* ALMUS Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Link to="/almus" className="block group">
                <div className="relative h-[432px] rounded-[32px] overflow-hidden shadow-xl hover:scale-[1.02] transition-transform duration-300">
                  <img
                    src={imgImageAlmusSmartDispenserStation}
                    alt="ALMUS - Smart Dispenser Station"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-10 flex flex-col gap-3">
                    <h2
                      className="font-['Playfair_Display',serif] font-bold text-[64px] text-white shadow-lg"
                      style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
                    >
                      ALMUS
                    </h2>
                    <p className="font-['Poppins',sans-serif] text-[20px] text-white/90">
                      Smart Dispenser Station
                    </p>
                    <div className="bg-blue-500 dark:bg-[#00e5ff] h-[4px] w-[96px] rounded-full shadow-lg dark:shadow-[0px_0px_12px_0px_rgba(0,229,255,0.8)]" />
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative bg-white dark:bg-[#060910] py-24 overflow-hidden transition-colors duration-300 border-gray-100 dark:border-white/5">
        <div className="absolute bg-blue-400/5 dark:bg-[rgba(0,229,255,0.02)] blur-[100px] h-[400px] left-1/2 -translate-x-1/2 rounded-full top-0 w-[800px]" />

        <div className="max-w-[936px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <p className="font-['Poppins',sans-serif] text-[24px] leading-[40.8px] text-gray-700 dark:text-white/80 whitespace-pre-wrap">
              ULTIMA delivers innovative healthcare products and intelligent
              systems designed to enhance safety, efficiency, and care quality
              in modern environments.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {["Smart products", "Technology", "Innovation"].map((item) => (
              <div key={item} className="bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/20 rounded-full px-8 py-4 shadow-lg transition-colors duration-300">
                <p className="font-['Poppins',sans-serif] text-[18px] text-gray-800 dark:text-white/90">
                  {item}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 overflow-hidden bg-gray-50 dark:bg-[#060910] transition-colors duration-300">
        {/* Subtle Background Glow */}
        <div className="absolute bg-blue-400/10 dark:bg-[rgba(0,229,255,0.05)] blur-[120px] right-0 rounded-full w-[500px] h-[500px] top-1/4" />

        <div className="max-w-[1096px] mx-auto px-12 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Heading */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2
              className="font-['Playfair_Display',serif] font-bold text-[64px] leading-[1.1] text-gray-900 dark:text-white mb-8"
              style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
            >
              Designed for <br />
              real healthcare <br />
              challenges
            </h2>
            <div className="bg-blue-500 dark:bg-[#00e5ff] h-[6px] w-[120px] rounded-full shadow-[0_0_15px_rgba(0,229,255,0.5)]" />
          </motion.div>

          {/* Right Side - Features List */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.2 }
              }
            }}
            className="flex flex-col gap-5"
          >
            {[
              "Built for professionals",
              "Privacy & reliability focused",
              "Scalable systems",
              "Future-ready infrastructure",
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, x: 30 },
                  show: { opacity: 1, x: 0 }
                }}
                className="group relative bg-white dark:bg-[#0D121F] border border-gray-200 dark:border-[#00e5ff]/20 rounded-[24px] p-6 flex items-center gap-5 shadow-sm hover:shadow-md dark:shadow-[0_0_20px_rgba(0,229,255,0.05)] transition-all duration-300"
              >
                {/* Neon Checkmark Icon */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-green-500 dark:border-[#39ff14] flex items-center justify-center shadow-[0_0_10px_rgba(57,255,20,0.3)]">
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    className="w-4 h-4 text-green-600 dark:text-[#39ff14]" 
                    stroke="currentColor" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>

                <p className="font-['Poppins',sans-serif] text-[20px] font-medium text-gray-700 dark:text-white/90">
                  {feature}
                </p>

                {/* Subtle inner glow for Dark Mode only */}
                <div className="absolute inset-0 rounded-[24px] bg-[#00e5ff]/5 opacity-0 group-hover:opacity-100 transition-opacity hidden dark:block" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gray-50 dark:bg-[#060910] py-32 overflow-hidden transition-colors duration-300 border-gray-100 dark:border-white/5">
        <div className="absolute bg-blue-400/10 dark:bg-[rgba(0,229,255,0.05)] blur-[150px] left-1/2 -translate-x-1/2 rounded-full w-[600px] h-[600px] -top-20" />

        <div className="max-w-[1024px] mx-auto px-9 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-['Playfair_Display',serif] font-bold text-[64px] leading-[75px] text-gray-900 dark:text-white mb-16"
            style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
          >
            Let's build safer, smarter
            <br />
            healthcare environments.
          </motion.h2>

          {/* Contact Form */}
          <motion.form
            id="contact"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="max-w-[798px] mx-auto space-y-6"
          >
            {/* Name and Company */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-['Poppins',sans-serif] font-medium text-[16px] text-gray-800 dark:text-white/90 text-left">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="bg-white/80 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-[14px] px-4 h-[52px] font-['Arial',sans-serif] text-[16px] text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-['Poppins',sans-serif] font-medium text-[16px] text-gray-800 dark:text-white/90 text-left">
                  Company *
                </label>
                <input
                  type="text"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Facility or company name"
                  className="bg-white/80 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-[14px] px-4 h-[52px] font-['Arial',sans-serif] text-[16px] text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Email and Phone */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-['Poppins',sans-serif] font-medium text-[16px] text-gray-800 dark:text-white/90 text-left">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="bg-white/80 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-[14px] px-4 h-[52px] font-['Arial',sans-serif] text-[16px] text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-['Poppins',sans-serif] font-medium text-[16px] text-gray-800 dark:text-white/90 text-left">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="bg-white/80 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-[14px] px-4 h-[52px] font-['Arial',sans-serif] text-[16px] text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2">
              <label className="font-['Poppins',sans-serif] font-medium text-[16px] text-gray-800 dark:text-white/90 text-left">
                Message
              </label>
              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your facility and what you're looking for..."
                className="bg-white/80 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-[14px] px-4 py-3 font-['Arial',sans-serif] text-[16px] text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 dark:bg-[#00e5ff] dark:hover:bg-[#00d4e6] h-[55px] px-12 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[15px] text-white dark:text-black flex items-center justify-center gap-2 mx-auto"
            >
              Send Inquiry
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.form>
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
                <li>
                  <a
                    href="#"
                    className="font-['Poppins',sans-serif] text-[14px] text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    Our Localisation
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
                  <a
                    href="#contact"
                    className="font-['Poppins',sans-serif] text-[14px] text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="font-['Poppins',sans-serif] text-[14px] text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Follow Us Column */}
            <div>
              <h4 className="font-['Poppins',sans-serif] font-semibold text-[14px] text-white mb-4">
                Follow us
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="font-['Poppins',sans-serif] text-[14px] text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="font-['Poppins',sans-serif] text-[14px] text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-gray-700 dark:border-white/10 text-center">
            <p className="font-['Poppins',sans-serif] text-[14px] text-gray-400">
              © 2025 ULTIMA. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}