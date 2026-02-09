import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { Moon, Sun, ArrowRight, Check, Activity, Zap, LayoutDashboard, Smartphone, Shield, Play, RefreshCw, MonitorPlay, Monitor, Globe, Users, AlertCircle, Sliders, Award } from "lucide-react";

// Images
const padelCourtImage = "https://images.unsplash.com/photo-1693517235862-a1b8c3323efb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWRlbCUyMGNvdXJ0JTIwc3BvcnQlMjBmYWNpbGl0eSUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzAxMzkxNjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const scoringSystemImage = "https://images.unsplash.com/photo-1741478551723-4b7ce95cf395?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const athleteImage = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const padelClubImage = "https://images.unsplash.com/photo-1612534847738-b3af9bc31f0c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGFkZWx8ZW58MHx8MHx8fDA%3D";
const fitnessCenterImage = "https://images.pexels.com/photos/34761566/pexels-photo-34761566/free-photo-of-salle-de-sport-interieure-moderne-avec-equipements-cardio.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";
const trainingAcademyImage = "https://images.unsplash.com/photo-1676312827534-21947df045ac?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const competitionVenueImage = "https://plus.unsplash.com/premium_photo-1721755951157-b055a8de6de3?q=80&w=1324&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export function SummaPage() {
  const [isDark, setIsDark] = useState(() => {
    // Dark mode par défaut
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'light') return false;
      return true; // Par défaut dark
    }
    return true;
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
    console.log("Demo request submitted:", formData);
    alert("Thank you for your interest. Our team will contact you shortly to schedule your demo.");
    setFormData({ name: "", company: "", email: "", phone: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById("summa-cta");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Données pour les sections
  const metrics = [
    { number: "99.9%", label: "Uptime reliability" },
    { number: "< 0.1s", label: "Score detection speed" },
    { number: "500+", label: "Facilities worldwide" },
    { number: "24/7", label: "Support available" },
  ];

  const features = [
    {
      icon: Activity,
      title: "Real-time match scoring",
      description: "Live score updates visible to players and spectators instantly",
    },
    {
      icon: Zap,
      title: "Automatic score detection",
      description: "Smart sensors capture every point without manual input",
    },
    {
      icon: LayoutDashboard,
      title: "Court and match management",
      description: "Centralized control of all courts from a single dashboard",
    },
    {
      icon: Smartphone,
      title: "Multi-platform access",
      description: "View scores on displays, mobile devices, and web platforms",
    },
    {
      icon: Shield,
      title: "Reliable performance",
      description: "Built for high-traffic facilities with consistent uptime",
    },
  ];

  const steps = [
    {
      icon: Play,
      title: "Match starts on the court",
      number: "01",
    },
    {
      icon: RefreshCw,
      title: "Score updates automatically",
      number: "02",
    },
    {
      icon: MonitorPlay,
      title: "Data displayed across all platforms",
      number: "03",
    },
  ];

  const platforms = [
    {
      icon: Monitor,
      title: "On-court display",
      description: "Live scoring visibility",
      details: "Large format displays show real-time scores visible to all players and spectators",
      image: "https://images.unsplash.com/photo-1728044993618-cf86c59147e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwc2NvcmVib2FyZCUyMGRpc3BsYXklMjBzY3JlZW58ZW58MXx8fHwxNzcwMTM5MjY1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      icon: Smartphone,
      title: "Mobile application",
      description: "Match tracking",
      details: "Players and coaches access live scores, match history, and performance stats on mobile",
      image: "https://images.unsplash.com/photo-1761721576781-baaf47945242?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBzcG9ydHMlMjB0cmFja2luZ3xlbnwxfHx8fDE3NzAxMzkyNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      icon: Globe,
      title: "Web dashboard",
      description: "Facility management & analytics",
      details: "Centralized control panel for managing courts, viewing analytics, and exporting reports",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkYXNoYm9hcmQlMjBhbmFseXRpY3MlMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzcwMTM5MjY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  const benefits = [
    {
      icon: Users,
      title: "Enhances player experience",
      description: "Real-time visibility and accurate scoring create professional-grade gameplay",
    },
    {
      icon: AlertCircle,
      title: "Reduces manual scoring errors",
      description: "Automated detection eliminates human mistakes and disputes",
    },
    {
      icon: Sliders,
      title: "Simplifies facility management",
      description: "Centralized control of all courts from a single dashboard",
    },
    {
      icon: Award,
      title: "Designed for professional environments",
      description: "Premium quality system that elevates your facility's reputation",
    },
    {
      icon: Shield,
      title: "Built for intensive daily use",
      description: "Reliable hardware and software engineered for high-traffic operations",
    },
  ];

  const environments = [
    { title: "Padel clubs", image: padelClubImage },
    { title: "Sports and fitness centers", image: fitnessCenterImage },
    { title: "Training academies", image: trainingAcademyImage },
    { title: "Competition venues", image: competitionVenueImage },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
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
                href="/#about"
                className="font-['Poppins',sans-serif] font-medium text-[16px] text-gray-700 dark:text-white/80 hover:text-blue-600 dark:hover:text-white transition-colors duration-300"
              >
                About
              </a>
              <button onClick={scrollToContact}
                className="font-['Poppins',sans-serif] font-medium text-[16px] text-gray-700 dark:text-white/80 hover:text-blue-600 dark:hover:text-white transition-colors duration-300"
              >
                Contact
              </button>
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

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={padelCourtImage}
            alt="SUMMA Smart Scoring System"
            className="w-full h-full object-cover opacity-20 dark:opacity-10"
          />
        </div>

        <div className="max-w-[1200px] mx-auto w-full px-8 lg:px-12 pb-16 relative z-10">
          <div className="text-center space-y-8">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1
                className="font-['Playfair_Display',serif] font-bold text-[100px] lg:text-[120px] leading-[0.9] text-gray-900 dark:text-white mb-4 transition-colors duration-300"
                style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
              >
                SUMMA
              </h1>
              <div className="w-40 h-[6px] bg-emerald-500 dark:bg-[#39FF14] rounded-full shadow-lg dark:shadow-[0_0_20px_rgba(57,255,20,0.8)] mx-auto mb-8 transition-colors duration-300"></div>
            </motion.div>

            {/* Subtitle */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-['Poppins',sans-serif] text-[28px] text-gray-700 dark:text-white/90 font-light tracking-wide transition-colors duration-300"
            >
              Smart Scoring & Facility System
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-['Poppins',sans-serif] text-[18px] leading-[1.8] text-gray-600 dark:text-white/60 max-w-2xl mx-auto transition-colors duration-300"
            >
              An intelligent scoring and facility management system designed for
              padel courts and professional sports environments
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4 pt-4"
            >
              <button
                onClick={scrollToContact}
                className="bg-emerald-500 hover:bg-emerald-600 dark:bg-[#39FF14] dark:hover:bg-[#32E012] h-[60px] px-12 rounded-full hover:scale-[1.02] transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[16px] text-white dark:text-black shadow-lg dark:shadow-[0_0_20px_rgba(57,255,20,0.6)]"
              >
                Request a demo
              </button>
              <button
                onClick={scrollToContact}
                className="bg-transparent hover:bg-gray-100 dark:hover:bg-white/10 h-[60px] px-12 rounded-full border-2 border-gray-300 dark:border-white/40 hover:border-emerald-500 dark:hover:border-[#39FF14] transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[16px] text-gray-800 dark:text-white"
              >
                Contact sales
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Metrics Section */}
      <section className="relative py-20 px-6 lg:px-20 overflow-hidden transition-colors duration-300">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative bg-gray-100 dark:bg-[#0F1425] border border-gray-200 dark:border-white/10 rounded-[20px] p-8 text-center transition-colors duration-300"
              >
                <h3
                  className="font-['Playfair_Display',serif] font-bold text-[48px] text-emerald-600 dark:text-[#39FF14] mb-2 transition-colors duration-300"
                  style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
                >
                  {metric.number}
                </h3>
                <p className="font-['Poppins',sans-serif] text-[14px] text-gray-600 dark:text-white/70 uppercase tracking-wider transition-colors duration-300">
                  {metric.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What Is Summa Section */}
      <section className="relative py-24 px-6 lg:px-20 overflow-hidden transition-colors duration-300">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2
              className="font-['Playfair_Display',serif] font-bold text-[56px] lg:text-[64px] leading-[1.1] text-gray-900 dark:text-white mb-6 transition-colors duration-300"
              style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
            >
              A complete scoring system
              <br />
              for padel facilities
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-[24px] overflow-hidden border border-gray-200 dark:border-white/10 transition-colors duration-300">
                <img
                  src={scoringSystemImage}
                  alt="SUMMA scoring system in action"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 dark:from-[#39FF14]/10 to-transparent pointer-events-none"></div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <p className="font-['Poppins',sans-serif] text-[18px] lg:text-[20px] leading-[1.8] text-gray-600 dark:text-white/70 transition-colors duration-300">
                SUMMA combines real-time scoring, hardware and software
                integration, and centralized management in one intelligent
                platform.
              </p>

              <p className="font-['Poppins',sans-serif] text-[18px] lg:text-[20px] leading-[1.8] text-gray-600 dark:text-white/70 transition-colors duration-300">
                Designed specifically for padel courts, it automates
                match tracking while giving facility managers complete control
                over court operations and player data.
              </p>

              <div className="w-24 h-1 bg-emerald-500 dark:bg-[#39FF14] rounded-full shadow-lg dark:shadow-[0_0_12px_rgba(57,255,20,0.8)] transition-colors duration-300"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="relative py-24 px-6 lg:px-20 overflow-hidden transition-colors duration-300">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2
              className="font-['Playfair_Display',serif] font-bold text-[48px] lg:text-[56px] leading-[1.1] text-gray-900 dark:text-white mb-6 transition-colors duration-300"
              style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
            >
              Core features
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white dark:bg-black border border-gray-200 dark:border-white/10 p-10 rounded-[20px] hover:border-emerald-500 dark:hover:border-[#39FF14] transition-all duration-300"
                >
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 dark:bg-[#39FF14]/10 border border-emerald-200 dark:border-[#39FF14]/30">
                      <Icon className="w-7 h-7 text-emerald-600 dark:text-[#39FF14]" />
                    </div>
                  </div>

                  <h3 className="font-['Poppins',sans-serif] font-semibold text-[20px] text-gray-900 dark:text-white mb-3 leading-[1.3] transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="font-['Poppins',sans-serif] text-[15px] leading-[1.6] text-gray-600 dark:text-white/60 transition-colors duration-300">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-24 px-6 lg:px-20 overflow-hidden transition-colors duration-300">
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2
              className="font-['Playfair_Display',serif] font-bold text-[48px] lg:text-[56px] leading-[1.1] text-gray-900 dark:text-white mb-6 transition-colors duration-300"
              style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
            >
              How it works
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative bg-gray-100 dark:bg-[#0F1425] border border-gray-200 dark:border-white/10 rounded-[20px] p-10 text-center transition-colors duration-300"
                >
                  <div className="mb-6">
                    <span className="font-['Playfair_Display',serif] font-bold text-[72px] text-emerald-200 dark:text-[#39FF14]/20 transition-colors duration-300">
                      {step.number}
                    </span>
                  </div>

                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-[#39FF14]/10 border border-emerald-200 dark:border-[#39FF14]/30">
                      <Icon className="w-8 h-8 text-emerald-600 dark:text-[#39FF14]" />
                    </div>
                  </div>

                  <h3 className="font-['Poppins',sans-serif] font-semibold text-[18px] text-gray-900 dark:text-white leading-[1.4] transition-colors duration-300">
                    {step.title}
                  </h3>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interfaces & Platforms Section */}
      <section className="relative py-24 px-6 lg:px-20 overflow-hidden transition-colors duration-300">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2
              className="font-['Playfair_Display',serif] font-bold text-[48px] lg:text-[56px] leading-[1.1] text-gray-900 dark:text-white mb-4 transition-colors duration-300"
              style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
            >
              Interfaces & platforms
            </h2>
            <p className="font-['Poppins',sans-serif] text-[18px] lg:text-[20px] leading-[1.7] text-gray-600 dark:text-white/60 max-w-2xl mx-auto transition-colors duration-300">
              SUMMA is a complete ecosystem accessible from every touchpoint
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {platforms.map((platform, index) => {
              const Icon = platform.icon;
              return (
                <motion.div
                  key={platform.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-[20px] overflow-hidden hover:border-emerald-500 dark:hover:border-[#39FF14] transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={platform.image}
                      alt={platform.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 dark:from-[#39FF14]/10 to-transparent pointer-events-none"></div>
                  </div>

                  <div className="p-8">
                    <div className="mb-6">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 dark:bg-[#39FF14]/10 border border-emerald-200 dark:border-[#39FF14]/30">
                        <Icon className="w-7 h-7 text-emerald-600 dark:text-[#39FF14]" />
                      </div>
                    </div>

                    <h3 className="font-['Poppins',sans-serif] font-bold text-[22px] text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                      {platform.title}
                    </h3>

                    <p className="font-['Poppins',sans-serif] text-[14px] text-emerald-600 dark:text-[#39FF14] mb-3 transition-colors duration-300">
                      {platform.description}
                    </p>

                    <p className="font-['Poppins',sans-serif] text-[14px] leading-[1.6] text-gray-600 dark:text-white/60 transition-colors duration-300">
                      {platform.details}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Summa Section */}
      <section className="relative py-24 px-6 lg:px-20 overflow-hidden transition-colors duration-300">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2
              className="font-['Playfair_Display',serif] font-bold text-[48px] lg:text-[56px] leading-[1.1] text-gray-900 dark:text-white mb-6 transition-colors duration-300"
              style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
            >
              Why choose SUMMA
            </h2>
            <p className="font-['Poppins',sans-serif] text-[16px] leading-[1.7] text-gray-600 dark:text-white/60 max-w-3xl mx-auto transition-colors duration-300">
              A complete scoring solution designed for professional sports facilities that demand accuracy, reliability, and seamless operation
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gray-100 dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-[32px] overflow-hidden transition-colors duration-300"
          >
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="p-12 lg:p-16 flex flex-col justify-center">
                <div className="space-y-8">
                  {benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <motion.div
                        key={benefit.title}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="flex gap-4"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-emerald-500 dark:bg-[#39FF14] flex items-center justify-center">
                            <Icon className="w-6 h-6 text-white dark:text-black" />
                          </div>
                        </div>

                        <div>
                          <h3 className="font-['Poppins',sans-serif] font-semibold text-[18px] text-gray-900 dark:text-white mb-1 leading-[1.3] transition-colors duration-300">
                            {benefit.title}
                          </h3>
                          <p className="font-['Poppins',sans-serif] text-[14px] leading-[1.6] text-gray-600 dark:text-white/60 transition-colors duration-300">
                            {benefit.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative h-[400px] lg:h-auto"
              >
                <img
                  src={athleteImage}
                  alt="Professional athlete"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-gray-100/20 dark:to-[#1A1A1A]/20"></div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Where Summa Fits Section */}
      <section className="relative py-24 px-6 lg:px-20 overflow-hidden transition-colors duration-300">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2
              className="font-['Playfair_Display',serif] font-bold text-[48px] lg:text-[56px] leading-[1.1] text-gray-900 dark:text-white mb-4 transition-colors duration-300"
              style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
            >
              Where SUMMA fits
            </h2>
            <p className="font-['Poppins',sans-serif] text-[18px] lg:text-[20px] leading-[1.7] text-gray-600 dark:text-white/60 max-w-2xl mx-auto transition-colors duration-300">
              Built for professional sports environments that demand precision and reliability
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {environments.map((env, index) => (
              <motion.div
                key={env.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative rounded-[20px] overflow-hidden bg-white dark:bg-black border border-gray-200 dark:border-white/10 hover:border-emerald-500 dark:hover:border-[#39FF14] transition-all duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={env.image}
                      alt={env.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 group-hover:from-emerald-500/10 dark:from-[#39FF14]/0 dark:group-hover:from-[#39FF14]/10 to-transparent transition-all duration-300"></div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-['Poppins',sans-serif] font-semibold text-[18px] text-white leading-[1.3]">
                      {env.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ultima Ecosystem Section */}
      <section className="relative py-24 px-6 lg:px-20 overflow-hidden transition-colors duration-300">
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2
              className="font-['Playfair_Display',serif] font-bold text-[48px] lg:text-[56px] leading-[1.1] text-gray-900 dark:text-white mb-12 transition-colors duration-300"
              style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
            >
              Part of the ULTIMA ecosystem
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative bg-gray-100 dark:bg-[#0F1425] border-2 border-emerald-500 dark:border-[#39FF14] rounded-[20px] p-10 transition-colors duration-300"
              >
                <h3 className="font-['Playfair_Display',serif] font-bold text-[36px] text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                  SUMMA
                </h3>
                <p className="font-['Poppins',sans-serif] text-[16px] text-gray-600 dark:text-white/60 mb-4 transition-colors duration-300">
                  Smart Scoring & Facility System
                </p>
                <div className="w-20 h-1 bg-emerald-500 dark:bg-[#39FF14] rounded-full shadow-lg dark:shadow-[0_0_12px_rgba(57,255,20,0.8)] transition-colors duration-300"></div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Link
                  to="/almus"
                  className="block group relative bg-gray-100 dark:bg-[#0F1425] border border-gray-200 dark:border-white/10 hover:border-blue-500 dark:hover:border-[#00E5FF] rounded-[20px] p-10 transition-all duration-300 h-full"
                >
                  <h3 className="font-['Playfair_Display',serif] font-bold text-[36px] text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                    ALMUS
                  </h3>
                  <p className="font-['Poppins',sans-serif] text-[16px] text-gray-600 dark:text-white/60 mb-4 transition-colors duration-300">
                    Smart Hydration Station
                  </p>
                  <div className="flex items-center gap-2 text-blue-500 dark:text-[#00E5FF] font-['Poppins',sans-serif] text-[14px] font-semibold">
                    Discover ALMUS
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-gray-100 dark:bg-[#0F1425] border border-gray-200 dark:border-white/10 rounded-[20px] p-10 transition-colors duration-300"
            >
              <div className="max-w-2xl mx-auto space-y-4">
                <p className="font-['Poppins',sans-serif] text-[18px] leading-[1.8] text-gray-800 dark:text-white/80 transition-colors duration-300">
                  <span className="text-emerald-600 dark:text-[#39FF14] font-semibold">SUMMA</span>{" "}
                  manages scoring and performance.
                </p>
                <p className="font-['Poppins',sans-serif] text-[18px] leading-[1.8] text-gray-800 dark:text-white/80 transition-colors duration-300">
                  <span className="text-blue-500 dark:text-[#00E5FF] font-semibold">ALMUS</span>{" "}
                  supports hydration and recovery.
                </p>
                <p className="font-['Poppins',sans-serif] text-[18px] leading-[1.8] text-gray-900 dark:text-white font-semibold transition-colors duration-300">
                  Together, they form the ULTIMA sport-tech ecosystem.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section
        id="summa-cta"
        className="relative py-24 px-6 lg:px-20 overflow-hidden transition-colors duration-300"
      >
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2
              className="font-['Playfair_Display',serif] font-bold text-[56px] lg:text-[64px] leading-[1.1] text-gray-900 dark:text-white mb-6 transition-colors duration-300"
              style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
            >
              Bring SUMMA to your facility
            </h2>
            <p className="font-['Poppins',sans-serif] text-[18px] lg:text-[20px] leading-[1.7] text-gray-600 dark:text-white/60 transition-colors duration-300">
              Request a demo and discover how SUMMA can transform your sports facility
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            onSubmit={handleSubmit}
            className="space-y-6 bg-white dark:bg-black border border-gray-200 dark:border-white/10 p-8 lg:p-12 rounded-[20px] transition-colors duration-300"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="name"
                  className="font-['Poppins',sans-serif] font-medium text-[16px] text-gray-700 dark:text-white/90 transition-colors duration-300"
                >
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-gray-100 dark:bg-white/5 backdrop-blur-sm h-[52px] px-4 rounded-[14px] border border-gray-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/40"
                  placeholder="Your name"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="company"
                  className="font-['Poppins',sans-serif] font-medium text-[16px] text-gray-700 dark:text-white/90 transition-colors duration-300"
                >
                  Facility / Company *
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  className="bg-gray-100 dark:bg-white/5 backdrop-blur-sm h-[52px] px-4 rounded-[14px] border border-gray-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/40"
                  placeholder="Facility or company name"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="font-['Poppins',sans-serif] font-medium text-[16px] text-gray-700 dark:text-white/90 transition-colors duration-300"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-gray-100 dark:bg-white/5 backdrop-blur-sm h-[52px] px-4 rounded-[14px] border border-gray-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/40"
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="phone"
                  className="font-['Poppins',sans-serif] font-medium text-[16px] text-gray-700 dark:text-white/90 transition-colors duration-300"
                >
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="bg-gray-100 dark:bg-white/5 backdrop-blur-sm h-[52px] px-4 rounded-[14px] border border-gray-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/40"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="message"
                className="font-['Poppins',sans-serif] font-medium text-[16px] text-gray-700 dark:text-white/90 transition-colors duration-300"
              >
                Tell us about your facility
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="bg-gray-100 dark:bg-white/5 backdrop-blur-sm px-4 py-3 rounded-[14px] border border-gray-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/40"
                placeholder="Number of courts, expected usage, specific requirements..."
              />
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 dark:bg-[#39FF14] dark:hover:bg-[#32E012] h-[60px] px-16 rounded-full shadow-lg dark:shadow-[0_0_24px_rgba(57,255,20,0.4)] hover:shadow-xl dark:hover:shadow-[0_0_36px_rgba(57,255,20,0.7)] hover:scale-[1.02] transition-all duration-300 font-['Poppins',sans-serif] font-bold text-[18px] text-white dark:text-black"
              >
                Request a demo
              </button>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black border-t border-gray-700 dark:border-white/10 py-12 transition-colors duration-300">
        <div className="max-w-[1096px] mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-['Arial',sans-serif] font-bold text-[20px] text-white mb-4">
                ULTIMA
              </h3>
            </div>

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