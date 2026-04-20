import { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Moon, Sun, ArrowRight, Eye, Brain, Menu, X, LayoutDashboard} from "lucide-react";
import { useTheme } from "../../styles/useTheme";
import { toast, Toaster } from 'sonner';
import { Mail, Phone } from 'lucide-react';
import { useAuth } from "../../services/AuthContext";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";

import imgImageSummaPadelSportsDashboard from "../../assets/images/image.jpg";
const imgImageAlmusSmartDispenserStation = "https://www.thoughtco.com/thmb/BVnoDc9J_65SCnuAQ9fvciTSyLQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/splashing-165192_1280-7879d2914dfb4e5d8dbf2e943669bd92.jpg";

export function HomePage() {

  const { isDark, setIsDark } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Form submitted!");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleContactClick = () => {
    toast.custom((t) => (
      <div className="bg-white dark:bg-card border border-gray-200 dark:border-border p-4 sm:p-6 rounded-[24px] shadow-2xl flex flex-col gap-4 min-w-[280px] sm:min-w-[300px] max-w-[90vw]">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground font-['Poppins'] text-[16px] sm:text-[18px]">Contact Details</h3>
          <button onClick={() => toast.dismiss(t)} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 text-accent" />
            </div>
            <span className="text-gray-700 dark:text-foreground/80 font-medium text-sm sm:text-base break-all">+216 99 799 368</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-accent" />
            </div>
            <span className="text-gray-700 dark:text-foreground/80 font-medium text-sm sm:text-base break-all">Ultima.contacus@gmail.com</span>
          </div>
        </div>
      </div>
    ), {
      duration: 5000,
      position: 'bottom-right',
    });
  };

  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background transition-colors duration-300">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-20 md:pt-48 md:pb-32 px-4 sm:px-6 overflow-hidden bg-gray-50 dark:bg-background transition-colors duration-300">
        <div className="absolute bg-accent/10 blur-[120px] left-[10%] rounded-full w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] top-[10%]" />
        <div className="absolute bg-accent/5 blur-[120px] right-[10%] rounded-full w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] top-[5%]" />
        <div className="max-w-[1096px] mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[36px] sm:text-[54px] md:text-[72px] lg:text-[82px] font-bold leading-[1.1] text-foreground mb-8"
          >
            Experience the  <br className="hidden md:block" />
            <span className="text-accent">Ultimate Evolution</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[18px] md:text-[24px] text-gray-600 dark:text-foreground/70 max-w-[800px] mx-auto mb-12 px-4"
          >
            From professional padel analytics to smart hydration systems, we build the technology that powers elite performance.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Toaster />
            <button onClick={handleContactClick} className="w-full sm:w-auto h-[60px] px-12 rounded-full border border-gray-300 dark:border-border flex items-center justify-center gap-2 text-foreground">
              Contact Sales
            </button>
            <Link to="/booking" className="w-full sm:w-auto h-[60px] px-12 rounded-full bg-accent text-accent-foreground font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform">
              Book a Court <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Choose Your Experience */}
      <section className="relative min-h-screen pt-24 sm:pt-32 pb-16 overflow-hidden bg-gray-50 dark:bg-background transition-colors duration-300">
        {/* Refined Glows */}
        <div className="absolute bg-accent/10 blur-[120px] left-[10%] rounded-full w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] top-[10%]" />
        <div className="absolute bg-accent/5 blur-[120px] right-[10%] rounded-full w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] top-[5%]" />
        <div className="max-w-[1096px] mx-auto px-4 sm:px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h1 className="font-['Poppins',sans-serif] text-[24px] sm:text-[32px] text-foreground/90 tracking-[0.8px]">
              Choose Your Experience
            </h1>
          </motion.div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {/* SUMMA Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Link to="/summa" className="block group">
                <div className="relative h-[320px] sm:h-[380px] md:h-[432px] rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-xl hover:scale-[1.02] transition-transform duration-300">
                  <img
                    src={imgImageSummaPadelSportsDashboard}
                    alt="SUMMA - Padel Sports Dashboard"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 sm:p-8 md:p-10 flex flex-col gap-2 sm:gap-3">
                    <h2
                      className="font-['Playfair_Display',serif] font-bold text-[48px] sm:text-[56px] md:text-[64px] text-white shadow-lg"
                      style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
                    >
                      SUMMA
                    </h2>
                    <p className="font-['Poppins',sans-serif] text-[16px] sm:text-[18px] md:text-[20px] text-white/90">
                      Padel Sports Dashboard
                    </p>
                    <div className="bg-accent h-[4px] w-[96px] rounded-full shadow-lg shadow-accent/40" />
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
                <div className="relative h-[320px] sm:h-[380px] md:h-[432px] rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-xl hover:scale-[1.02] transition-transform duration-300">
                  <img
                    src={imgImageAlmusSmartDispenserStation}
                    alt="ALMUS - Smart Dispenser Station"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 sm:p-8 md:p-10 flex flex-col gap-2 sm:gap-3">
                    <h2
                      className="font-['Playfair_Display',serif] font-bold text-[48px] sm:text-[56px] md:text-[64px] text-white shadow-lg"
                      style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
                    >
                      ALMUS
                    </h2>
                    <p className="font-['Poppins',sans-serif] text-[16px] sm:text-[18px] md:text-[20px] text-white/90">
                      Smart Dispenser Station
                    </p>
                    <div className="bg-accent h-[4px] w-[96px] rounded-full shadow-lg shadow-accent/40" />
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      {/* PersonaVision AI Section - Integrated Design */}
      <section className="relative py-12 sm:py-16 overflow-hidden bg-gray-50 dark:bg-background transition-colors duration-300">
        <div className="max-w-[1096px] mx-auto px-4 sm:px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative group bg-white dark:bg-card border border-gray-200 dark:border-border rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 md:p-12 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            {/* Background Decorative Glow (Matching your existing style) */}
            <div className="absolute bg-purple-500/5 dark:bg-[rgba(192,192,192,0.03)] blur-[80px] -right-20 -top-20 rounded-full w-[300px] h-[300px]" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center relative z-10">
              {/* Left: Content */}
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3 text-accent">
                  <Eye size={24} className="sm:w-7 sm:h-7 drop-shadow-[0_0_8px_var(--accent)]" />
                  <span className="font-['Poppins',sans-serif] text-[10px] sm:text-[12px] uppercase tracking-[0.2rem] font-bold">
                    Featured Platform
                  </span>
                </div>

                <h3 className="font-['Playfair_Display',serif] font-bold text-[36px] sm:text-[42px] md:text-[48px] leading-[1.1] text-foreground">
                  PersonaVision AI
                </h3>

                <p className="font-['Poppins',sans-serif] text-gray-700 dark:text-foreground/80 text-[16px] sm:text-[18px] leading-relaxed">
                  Revolutionary computer vision platform powered by advanced neural networks.
                  Real-time movement analysis, biomechanical intelligence, and performance
                  optimization at the intersection of AI and human capability.
                </p>

                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-4">
                  <button

                    className="bg-accent h-[48px] px-8 rounded-full transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[14px] text-accent-foreground flex items-center justify-center shadow-lg hover:scale-105"
                  >
                    Explore Platform
                  </button>
                  <button className="bg-transparent border border-gray-300 dark:border-border hover:bg-gray-100 dark:hover:bg-accent/5 h-[48px] px-8 rounded-full transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[14px] text-gray-700 dark:text-foreground flex items-center justify-center">
                    Learn More
                  </button>
                </div>
              </div>

              {/* Right: Visual Element */}
              <div className="relative h-64 sm:h-80 rounded-[24px] overflow-hidden border border-gray-200 dark:border-border bg-gray-100 dark:bg-card shadow-inner">
                <img
                  src="https://images.unsplash.com/photo-1673255745677-e36f618550d1?q=80&w=1080&auto=format&fit=crop"
                  alt="PersonaVision AI Visualization"
                  className="w-full h-full object-cover opacity-80 dark:opacity-60 group-hover:scale-110 transition-transform duration-700"
                />
                {/* Overlay gradient matching your SUMMA/ALMUS cards */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent dark:from-black/80" />

                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 flex items-center gap-3">
                  <div className="bg-accent p-2 rounded-lg">
                    <Brain size={20} className="text-accent-foreground" />
                  </div>
                  <span className="font-['Poppins',sans-serif] text-white text-[12px] sm:text-[14px] font-semibold uppercase tracking-wider">
                    AI Powered Analysis
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* About Section */}
      <section id="about" className="relative bg-white dark:bg-background py-16 sm:py-20 md:py-24 overflow-hidden transition-colors duration-300 border-gray-100 dark:border-border">
        <div className="absolute bg-accent/5 blur-[100px] h-[400px] left-1/2 -translate-x-1/2 rounded-full top-0 w-[800px]" />

        <div className="max-w-[936px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-12"
          >
            <p className="font-['Poppins',sans-serif] text-[18px] sm:text-[20px] md:text-[24px] leading-[1.7] text-gray-700 dark:text-foreground/80 whitespace-pre-wrap">
              ULTIMA delivers innovative healthcare products and intelligent
              systems designed to enhance safety, efficiency, and care quality
              in modern environments.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 sm:gap-4"
          >
            {["Smart products", "Technology", "Innovation"].map((item) => (
              <div key={item} className="bg-white/80 dark:bg-card border border-gray-200 dark:border-border rounded-full px-6 sm:px-8 py-3 sm:py-4 shadow-lg transition-colors duration-300">
                <p className="font-['Poppins',sans-serif] text-[16px] sm:text-[18px] text-gray-800 dark:text-foreground/90">
                  {item}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden bg-gray-50 dark:bg-background transition-colors duration-300">
        {/* Subtle Background Glow */}
        <div className="absolute bg-accent/5 blur-[120px] right-0 rounded-full w-[500px] h-[500px] top-1/4" />

        <div className="max-w-[1096px] mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-center">
          {/* Left Side - Heading */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2
              className="font-['Playfair_Display',serif] font-bold text-[40px] sm:text-[52px] md:text-[64px] leading-[1.1] text-foreground mb-6 sm:mb-8"
              style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
            >
              Designed for <br />
              real healthcare <br />
              challenges
            </h2>
            <div className="bg-accent h-[6px] w-[120px] rounded-full shadow-[0_0_15px_var(--accent)]" />
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
                className="group relative bg-white dark:bg-card border border-gray-200 dark:border-border rounded-[24px] p-6 flex items-center gap-5 shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Neon Checkmark Icon */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-accent flex items-center justify-center shadow-[0_0_10px_shadow-accent/30]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-4 h-4 text-accent"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>

                <p className="font-['Poppins',sans-serif] text-[18px] sm:text-[20px] font-medium text-gray-700 dark:text-foreground/90">
                  {feature}
                </p>

                {/* Subtle inner glow for Dark Mode only */}
                <div className="absolute inset-0 rounded-[24px] bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity hidden dark:block" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gray-50 dark:bg-background py-20 sm:py-24 md:py-32 overflow-hidden transition-colors duration-300 border-gray-100 dark:border-border">
        <div className="absolute bg-accent/5 blur-[150px] left-1/2 -translate-x-1/2 rounded-full w-[600px] h-[600px] -top-20" />

        <div className="max-w-[1024px] mx-auto px-4 sm:px-6 md:px-9 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-['Playfair_Display',serif] font-bold text-[32px] sm:text-[48px] md:text-[56px] lg:text-[64px] leading-[1.15] text-foreground mb-12 sm:mb-16"
            style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
          >
            Let's build safer, smarter
            <br className="hidden sm:block" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-['Poppins',sans-serif] font-medium text-[16px] text-gray-800 dark:text-foreground/90 text-left">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="bg-white/80 dark:bg-card border border-gray-300 dark:border-border rounded-[14px] px-4 h-[52px] font-['Arial',sans-serif] text-[16px] text-gray-900 dark:text-foreground placeholder:text-gray-500 dark:placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-['Poppins',sans-serif] font-medium text-[16px] text-gray-800 dark:text-foreground/90 text-left">
                  Company *
                </label>
                <input
                  type="text"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Facility or company name"
                  className="bg-white/80 dark:bg-card border border-gray-300 dark:border-border rounded-[14px] px-4 h-[52px] font-['Arial',sans-serif] text-[16px] text-gray-900 dark:text-foreground placeholder:text-gray-500 dark:placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                />
              </div>
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-['Poppins',sans-serif] font-medium text-[16px] text-gray-800 dark:text-foreground/90 text-left">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="bg-white/80 dark:bg-card border border-gray-300 dark:border-border rounded-[14px] px-4 h-[52px] font-['Arial',sans-serif] text-[16px] text-gray-900 dark:text-foreground placeholder:text-gray-500 dark:placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-['Poppins',sans-serif] font-medium text-[16px] text-gray-800 dark:text-foreground/90 text-left">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+216 00 000 000"
                  className="bg-white/80 dark:bg-card border border-gray-300 dark:border-border rounded-[14px] px-4 h-[52px] font-['Arial',sans-serif] text-[16px] text-gray-900 dark:text-foreground placeholder:text-gray-500 dark:placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                />
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2">
              <label className="font-['Poppins',sans-serif] font-medium text-[16px] text-gray-800 dark:text-foreground/90 text-left">
                Message
              </label>
              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your facility and what you're looking for..."
                className="bg-white/80 dark:bg-card border border-gray-300 dark:border-border rounded-[14px] px-4 py-3 font-['Arial',sans-serif] text-[16px] text-gray-900 dark:text-foreground placeholder:text-gray-500 dark:placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-accent text-accent-foreground h-[55px] px-12 rounded-full shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:scale-[1.02] transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[15px] flex items-center justify-center gap-2 mx-auto"
            >
              Send Inquiry
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
