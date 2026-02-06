import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Moon, Sun, ArrowRight } from "lucide-react";
import svgPaths from "../../components/icons/IconMainLogo";
const imgImageSummaPadelSportsDashboard = "/assets/images/image1.png";
const imgImageAlmusSmartDispenserStation = "/assets/images/machinedispenser.webp";
export function HomePage() {
  const [isDark, setIsDark] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

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
    <div className="min-h-screen bg-gradient-to-b from-[#0A0E1A] to-black">
      {/* Navigation */}
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

      {/* Hero Section - Choose Your Experience */}
      <section className="relative min-h-screen pt-32 pb-16 overflow-hidden">
        {/* Background Blurs */}
        <div className="absolute bg-[rgba(0,229,255,0.1)] blur-[120px] left-[274px] rounded-full w-[384px] h-[384px] top-[160px]" />
        <div className="absolute bg-[rgba(57,255,20,0.1)] blur-[120px] left-[438px] rounded-full w-[384px] h-[384px] top-[96px]" />

        <div className="max-w-[1096px] mx-auto px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h1 className="font-['Poppins',sans-serif] text-[32px] text-white/90 tracking-[0.8px]">
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
                <div className="relative h-[432px] rounded-[32px] overflow-hidden shadow-[0px_8px_32px_0px_rgba(0,0,0,0.6)] hover:scale-[1.02] transition-transform duration-300">
                  <img
                    src={imgImageSummaPadelSportsDashboard}
                    alt="SUMMA - Padel Sports Dashboard"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-[rgba(0,0,0,0.6)] to-[rgba(0,0,0,0)]" />
                  <div className="absolute bottom-0 left-0 p-10 flex flex-col gap-3">
                    <h2
                      className="font-['Playfair_Display',serif] font-bold text-[64px] text-white shadow-[0px_2px_20px_0px_rgba(0,0,0,0.8)]"
                      style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
                    >
                      SUMMA
                    </h2>
                    <p className="font-['Poppins',sans-serif] text-[20px] text-white/90">
                      Padel Sports Dashboard
                    </p>
                    <div className="bg-[#39ff14] h-[4px] w-[96px] rounded-full shadow-[0px_0px_12px_0px_rgba(57,255,20,0.8)]" />
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
                <div className="relative h-[432px] rounded-[32px] overflow-hidden shadow-[0px_8px_32px_0px_rgba(0,0,0,0.6)] hover:scale-[1.02] transition-transform duration-300">
                  <img
                    src={imgImageAlmusSmartDispenserStation}
                    alt="ALMUS - Smart Dispenser Station"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-[rgba(0,0,0,0.6)] to-[rgba(0,0,0,0)]" />
                  <div className="absolute bottom-0 left-0 p-10 flex flex-col gap-3">
                    <h2
                      className="font-['Playfair_Display',serif] font-bold text-[64px] text-white shadow-[0px_2px_20px_0px_rgba(0,0,0,0.8)]"
                      style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
                    >
                      ALMUS
                    </h2>
                    <p className="font-['Poppins',sans-serif] text-[20px] text-white/90">
                      Smart Dispenser Station
                    </p>
                    <div className="bg-[#00e5ff] h-[4px] w-[96px] rounded-full shadow-[0px_0px_12px_0px_rgba(0,229,255,0.8)]" />
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative bg-gradient-to-b from-[#0a0e1a] to-[#0f1425] py-24 overflow-hidden">
        <div className="absolute bg-[rgba(0,229,255,0.05)] blur-[100px] h-[400px] left-[248px] rounded-full top-[10.69px] w-[600px]" />

        <div className="max-w-[936px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <p className="font-['Poppins',sans-serif] text-[24px] leading-[40.8px] text-white/80 whitespace-pre-wrap">
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
            <div className="bg-white/5 border border-white/20 rounded-full px-8 py-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.3)]">
              <p className="font-['Poppins',sans-serif] text-[18px] text-white/90">
                Smart products
              </p>
            </div>
            <div className="bg-white/5 border border-white/20 rounded-full px-8 py-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.3)]">
              <p className="font-['Poppins',sans-serif] text-[18px] text-white/90">
                Technology
              </p>
            </div>
            <div className="bg-white/5 border border-white/20 rounded-full px-8 py-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.3)]">
              <p className="font-['Poppins',sans-serif] text-[18px] text-white/90">
                Innovation
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative bg-gradient-to-b from-[#0f1425] via-[#0a0e1a] to-[#0f1425] py-24 overflow-hidden">
        <div className="absolute bg-[rgba(57,255,20,0.05)] blur-[120px] left-[438px] rounded-full w-[384px] h-[384px] top-[274px]" />

        <div className="max-w-[1096px] mx-auto px-20 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Heading */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2
              className="font-['Playfair_Display',serif] font-bold text-[48px] leading-[1.3] text-white mb-4"
              style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
            >
              Designed for real healthcare challenges
            </h2>
            <div className="bg-[#00e5ff] h-[4px] w-[96px] rounded-full shadow-[0px_0px_12px_0px_rgba(0,229,255,0.8)]" />
          </motion.div>

          {/* Right Side - Features List */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            {[
              "Built for professionals",
              "Privacy & reliability focused",
              "Scalable systems",
              "Future-ready infrastructure",
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-[20px] p-6 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.4)] flex items-center gap-4"
              >
                <div className="relative w-6 h-6 flex-shrink-0">
                  <svg
                    className="w-full h-full"
                    fill="none"
                    viewBox="0 0 54 54"
                  >
                    <g filter="url(#filter0_d_105_190)">
                      <path
                        d={svgPaths.p4d60100}
                        stroke="#39FF14"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                      <path
                        d="M24 27L26 29L30 25"
                        stroke="#39FF14"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </g>
                    <defs>
                      <filter
                        id="filter0_d_105_190"
                        x="-1"
                        y="-1"
                        width="56"
                        height="56"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                      >
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix
                          in="SourceAlpha"
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          result="hardAlpha"
                        />
                        <feOffset />
                        <feGaussianBlur stdDeviation="8" />
                        <feColorMatrix
                          type="matrix"
                          values="0 0 0 0 0.223529 0 0 0 0 1 0 0 0 0 0.0784314 0 0 0 0.8 0"
                        />
                        <feBlend
                          mode="normal"
                          in2="BackgroundImageFix"
                          result="effect1_dropShadow_105_190"
                        />
                        <feBlend
                          mode="normal"
                          in="SourceGraphic"
                          in2="effect1_dropShadow_105_190"
                          result="shape"
                        />
                      </filter>
                    </defs>
                  </svg>
                </div>
                <p className="font-['Poppins',sans-serif] text-[18px] text-white/90">
                  {feature}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-b from-[#0f1425] to-[#0a0e1a] py-24 overflow-hidden">
        <div className="absolute bg-[rgba(0,229,255,0.05)] blur-[120px] left-[298px] rounded-full w-[500px] h-[500px] top-[145.39px]" />

        <div className="max-w-[1024px] mx-auto px-9 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-['Playfair_Display',serif] font-bold text-[64px] leading-[75px] text-white mb-16"
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
                <label className="font-['Poppins',sans-serif] font-medium text-[16px] text-white/90 text-left">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="bg-white/5 border border-white/20 rounded-[14px] px-4 h-[52px] font-['Arial',sans-serif] text-[16px] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#00e5ff] transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-['Poppins',sans-serif] font-medium text-[16px] text-white/90 text-left">
                  Company *
                </label>
                <input
                  type="text"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Facility or company name"
                  className="bg-white/5 border border-white/20 rounded-[14px] px-4 h-[52px] font-['Arial',sans-serif] text-[16px] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#00e5ff] transition-all"
                />
              </div>
            </div>

            {/* Email and Phone */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-['Poppins',sans-serif] font-medium text-[16px] text-white/90 text-left">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="bg-white/5 border border-white/20 rounded-[14px] px-4 h-[52px] font-['Arial',sans-serif] text-[16px] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#00e5ff] transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-['Poppins',sans-serif] font-medium text-[16px] text-white/90 text-left">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="bg-white/5 border border-white/20 rounded-[14px] px-4 h-[52px] font-['Arial',sans-serif] text-[16px] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#00e5ff] transition-all"
                />
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2">
              <label className="font-['Poppins',sans-serif] font-medium text-[16px] text-white/90 text-left">
                Message
              </label>
              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your facility and what you're looking for..."
                className="bg-white/5 border border-white/20 rounded-[14px] px-4 py-3 font-['Arial',sans-serif] text-[16px] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#00e5ff] transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-[#00e5ff] hover:bg-[#00d4e6] h-[55px] px-12 rounded-full shadow-[0px_0px_20px_0px_rgba(0,229,255,0.3)] hover:shadow-[0px_0px_30px_0px_rgba(0,229,255,0.5)] hover:scale-[1.02] transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[15px] text-black flex items-center justify-center gap-2 mx-auto"
            >
              Send Inquiry
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-12">
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
                    className="font-['Poppins',sans-serif] text-[14px] text-white/60 hover:text-white transition-colors"
                  >
                    About us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="font-['Poppins',sans-serif] text-[14px] text-white/60 hover:text-white transition-colors"
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
                    className="font-['Poppins',sans-serif] text-[14px] text-white/60 hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="font-['Poppins',sans-serif] text-[14px] text-white/60 hover:text-white transition-colors"
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
                    className="font-['Poppins',sans-serif] text-[14px] text-white/60 hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="font-['Poppins',sans-serif] text-[14px] text-white/60 hover:text-white transition-colors"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-white/10 text-center">
            <p className="font-['Poppins',sans-serif] text-[14px] text-white/60">
              © 2025 ULTIMA. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}