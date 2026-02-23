import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Moon, Sun, ArrowRight, Citrus, Leaf, Cherry, Palmtree, X, Menu } from "lucide-react";
import { useTheme } from "../../styles/useTheme";
import { toast, Toaster } from 'sonner'; 
import { Mail, Phone } from 'lucide-react';

const imgImageAlmusSmartHydrationStation = "https://images.unsplash.com/photo-1517093911940-08cb5b3952e7?q=80&w=744&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dpg";
const imgImageAlmusInstalledInProfessionalTrainingFacility = "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";


const flavors = [
  { 
    name: "Lemon & Lime", 
    desc: "Refreshing citrus burst", 
    color: "bg-yellow-300",
    icon: Citrus 
  },
  { 
    name: "Red Fruits", 
    desc: "Sweet berry blend", 
    color: "bg-red-800",
    icon: Cherry 
  },
  { 
    name: "Tropical Mix", 
    desc: "Exotic fruit fusion", 
    color: "bg-orange-500",
    icon: Palmtree
  },
  { 
    name: "Mint ", 
    desc: "Cooling hydration", 
    color: "bg-emerald-400",
    icon: Leaf 
  },
];




export function AlmusPage() {
  
  const { isDark, setIsDark } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  

  const nextStep = () => {
    setCurrentStep((prev) => (prev === steps.length - 1 ? 0 : prev + 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev === 0 ? steps.length - 1 : prev - 1));
  };

  const [formData, setFormData] = useState({
    name: "",
    facility: "",
    email: "",
    message: "",
  });
  const scrollToContact = () => {
    const contactSection = document.getElementById("almus-cta");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

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

  const benefits = [
    {
      title: "Encourages consistent hydration during training",
      description:
        "Keep members properly hydrated throughout their workout sessions",
    },
    {
      title: "Enhances overall member experience",
      description:
        "Offer premium amenities that set your facility apart from competitors",
    },
    {
      title: "Low maintenance, high reliability",
      description:
        "Designed for high-traffic facilities with minimal operational overhead",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Select a flavor",
      description: "Choose from multiple refreshing options",
    },
    {
      number: "02",
      title: "Dispense beverage",
      description: "Quick and touchless dispensing system",
    },
    {
      number: "03",
      title: "Enjoy hydration",
      description: "Light, low-calorie refreshment on demand",
    },
  ];

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
          <span className="text-gray-700 dark:text-white/80 font-medium text-sm sm:text-base break-all">96 094 772</span>
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
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#0A0E1A] dark:to-gray-900 transition-colors duration-300">
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
              className="font-['Arial',sans-serif] font-bold text-[20px] sm:text-[20px] sm:text-[24px] text-gray-900 dark:text-white tracking-[1.2px] transition-colors duration-300"
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
<section className="relative min-h-[70vh] pt-20 sm:pt-24 md:pt-32 pb-16 overflow-hidden bg-gray-50 dark:bg-[#060910]">

  {/* Background Blurs (hidden on mobile) */}
  <div className="hidden md:block absolute bg-blue-400/10 dark:bg-[rgba(0,229,255,0.05)] blur-[120px] left-[15%] rounded-full w-[500px] h-[500px] top-[10%]" />
  <div className="hidden md:block absolute bg-emerald-400/10 dark:bg-[rgba(57,255,20,0.03)] blur-[120px] right-[15%] rounded-full w-[500px] h-[500px] top-[20%]" />

  <div className="max-w-[1096px] mx-auto px-4 sm:px-6 lg:px-12 relative">
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">

      {/* Left Content */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col gap-4 text-center lg:text-left"
      >
        <div>
          <h1
            className="font-['Playfair_Display',serif] font-bold 
                       text-[42px] sm:text-[64px] md:text-[90px] lg:text-[120px]
                       text-gray-900 dark:text-white mb-2 transition-colors duration-300"
            style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
          >
            ALMUS
          </h1>
          <div className="bg-blue-500 dark:bg-[#00e5ff] h-[5px] sm:h-[6px] w-[96px] sm:w-[128px] mx-auto lg:mx-0 rounded-full shadow-lg dark:shadow-[0px_0px_20px_rgba(0,229,255,0.8)] transition-colors duration-300" />
        </div>

        <h2 className="font-['Poppins',sans-serif] font-medium 
                       text-[16px] sm:text-[20px] md:text-[24px]
                       text-gray-700 dark:text-white/90 transition-colors duration-300">
          Smart Hydration Station
        </h2>

        <p className="font-['Poppins',sans-serif] 
                      text-[16px] sm:text-[18px] md:text-[22px]
                      leading-relaxed text-gray-600 dark:text-white/70 transition-colors duration-300">
          Support hydration, recovery, and performance in active environments.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center lg:justify-start">
          <button className="bg-blue-500 hover:bg-blue-600 dark:bg-[#00e5ff] dark:hover:bg-[#00d4e6] 
                             h-[48px] sm:h-[56px] px-6 sm:px-8 rounded-full shadow-lg 
                             hover:scale-[1.02] transition-all duration-300 
                             font-['Poppins',sans-serif] font-semibold text-[15px] sm:text-[16px] 
                             text-white dark:text-black">
            Request a quote
          </button>

          <Toaster />

          <button
            onClick={handleContactClick}
            className="bg-white/80 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10 
                       border-2 border-gray-300 dark:border-white/20 
                       h-[48px] sm:h-[56px] px-6 sm:px-8 rounded-full 
                       transition-all duration-300 
                       font-['Poppins',sans-serif] font-semibold text-[15px] sm:text-[16px] 
                       text-gray-800 dark:text-white">
            Contact ULTIMA
          </button>
        </div>
      </motion.div>

      {/* Right Image */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative mt-8 lg:mt-0"
      >
        <div className="relative rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-xl">
          <img
            src={imgImageAlmusSmartHydrationStation}
            alt="ALMUS Smart Hydration Station"
            className="w-full h-[220px] sm:h-[320px] md:h-[360px] lg:h-[461px] object-cover"
          />
          <div
            className="absolute inset-0 blur-[24px] opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(140deg, rgba(59,130,246,0.1) 0%, rgba(0,0,0,0) 100%)",
            }}
          />
        </div>
      </motion.div>

    </div>
  </div>
</section>
      {/* Hydration Solution Section */}
      <section className="relative min-h-[70vh] pt-20 md:pt-32 pb-16 overflow-hidden bg-gray-50 dark:bg-[#060910] transition-colors duration-300">
        {/* Background Blurs matching the new aesthetic */}
        <div className="absolute bg-blue-400/10 dark:bg-[rgba(0,229,255,0.05)] blur-[120px] left-[15%] rounded-full w-[500px] h-[500px] top-[10%]" />
        <div className="absolute bg-emerald-400/10 dark:bg-[rgba(57,255,20,0.03)] blur-[120px] right-[15%] rounded-full w-[500px] h-[500px] top-[20%]" />

        <div className="max-w-[1096px] mx-auto px-4 sm:px-10 lg:px-20 relative">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-['Playfair_Display',serif] font-bold text-[48px] lg:text-[56px] text-gray-900 dark:text-white mb-6"
            style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
          >
            A hydration solution designed for your facility
          </motion.h2>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-[32px] overflow-hidden shadow-xl dark:shadow-[0px_20px_60px_0px_rgba(0,0,0,0.6)]">
                <img
                  src={imgImageAlmusInstalledInProfessionalTrainingFacility}
                  alt="ALMUS installed in professional training facility"
                  className="w-full h-[272px] object-cover"
                />
                <div
                  className="absolute inset-0 opacity-20 dark:opacity-100"
                  style={{
                    backgroundImage:
                      "linear-gradient(139.834deg, rgba(59, 130, 246, 0.05) 0%, rgba(0, 0, 0, 0) 100%)",
                  }}
                />
              </div>
              <div className="bg-blue-500 dark:bg-[#00e5ff] h-[4px] w-[96px] rounded-full shadow-lg dark:shadow-[0px_0px_12px_0px_rgba(0,229,255,0.8)] mt-8 transition-colors duration-300" />
            </motion.div>

            {/* Right Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="pt-0 lg:pt-24"
            >
              <p className="font-['Poppins',sans-serif] text-[18px] sm:text-[16px] sm:text-[20px] md:text-[24px] leading-[34px] text-gray-600 dark:text-white/70 transition-colors duration-300">
                ALMUS is an on-site hydration station that mixes water with
                light flavors to offer refreshing, low-calorie drinks. Built for
                high-traffic environments, it enhances user experience while
                remaining simple and reliable for facility operators.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

{/* Why Choose ALMUS Section */}
      <section className="relative min-h-[70vh] pt-20 md:pt-32 pb-16 overflow-hidden bg-gray-50 dark:bg-[#060910] transition-colors duration-300">
        {/* Background Blurs matching the new aesthetic */}
        <div className="absolute bg-blue-400/10 dark:bg-[rgba(0,229,255,0.05)] blur-[120px] left-[15%] rounded-full w-[500px] h-[500px] top-[10%]" />
        <div className="absolute bg-emerald-400/10 dark:bg-[rgba(57,255,20,0.03)] blur-[120px] right-[15%] rounded-full w-[500px] h-[500px] top-[20%]" />

        <div className="max-w-[1096px] mx-auto px-4 sm:px-10 lg:px-14 relative">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Left Heading */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2
                className="font-['Playfair_Display',serif] font-bold text-[36px] sm:text-[48px] lg:text-[64px] leading-[1.2] text-gray-900 dark:text-white transition-colors duration-300"
                style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
              >
                Why choose ALMUS
              </h2>
              <div className="bg-blue-500 dark:bg-[#00e5ff] h-[6px] w-[128px] rounded-full shadow-lg dark:shadow-[0px_0px_16px_0px_rgba(0,229,255,0.8)] mt-6 transition-colors duration-300" />
            </motion.div>

            {/* Right Benefits - Animated one by one */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.3, // Delay between each card appearing
                  },
                },
              }}
              className="flex flex-col gap-6"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
                  }}
                  className="bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[32px] p-6 sm:p-10 shadow-xl dark:shadow-[0px_20px_60px_0px_rgba(0,0,0,0.6)] transition-colors duration-300"
                >
                  <h3 className="font-['Poppins',sans-serif] font-bold text-[18px] sm:text-[16px] sm:text-[20px] md:text-[24px] leading-[36.4px] text-gray-800 dark:text-white mb-4 transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="font-['Poppins',sans-serif] text-[16px] sm:text-[16px] sm:text-[20px] md:text-[24px] leading-[34px] text-gray-600 dark:text-white/70 transition-colors duration-300">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Flavored Hydration Options  */}
<section className="relative min-h-[70vh] py-24 bg-gray-50 dark:bg-[#060910] transition-colors duration-300">
<div className="absolute bg-blue-400/10 dark:bg-[rgba(0,229,255,0.05)] blur-[120px] left-[365.33px] rounded-full w-[500px] h-[500px] top-[181.02px]" />
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-['Playfair_Display',serif] font-bold text-[48px] lg:text-[56px] text-gray-900 dark:text-white mb-6"
      >
        Flavored hydration options
      </motion.h2>
      <p className="font-['Poppins',sans-serif] text-[18px] text-gray-600 dark:text-white/60 max-w-2xl mx-auto">
        Personalize your recovery with our range of zero-sugar, electrolyte-rich flavors.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {flavors.map((flavor, index) => {
        const FlavorIcon = flavor.icon;
        return (
          <motion.div
            key={flavor.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative p-8 rounded-[32px] bg-white dark:bg-[#0F1425] border border-gray-200 dark:border-white/10 hover:border-emerald-500 transition-all duration-300 text-center"
          >
            {/* Icône avec cercle de couleur en fond */}
            <div className={`w-16 h-16 rounded-2xl ${flavor.color} bg-opacity-10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
              <FlavorIcon className={`w-8 h-8 ${flavor.color.replace('bg-', 'text-')}`} />
            </div>

            <h3 className="font-['Poppins',sans-serif] font-bold text-[22px] text-gray-900 dark:text-white mb-2">
              {flavor.name}
            </h3>
            <p className="font-['Poppins',sans-serif] text-gray-600 dark:text-white/60">
              {flavor.desc}
            </p>

            {/* Petit indicateur de couleur en bas */}
            <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full ${flavor.color} opacity-40`} />
          </motion.div>
        );
      })}
    </div>
  </div>
</section>

      {/* How It Works Section */}
<section className="relative min-h-[70vh] pt-20 md:pt-32 pb-16 bg-white dark:bg-[#060910] transition-colors duration-300">
      <div className="absolute bg-blue-400/10 dark:bg-[rgba(0,229,255,0.05)] blur-[120px] left-[298px] rounded-full w-[500px] h-[500px] top-[145.39px]" />
  <div className="max-w-[936px] mx-auto px-6 relative text-center">
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="font-['Playfair_Display',serif] font-bold text-[44px] sm:text-[60px] lg:text-[72px] text-gray-900 dark:text-white mb-16"
    >
      How it works
    </motion.h2>

    {/* Glowing underline */}
    <div className="w-32 h-1.5 bg-blue-500 dark:bg-[#00e5ff] mx-auto -mt-12 mb-20 rounded-full shadow-[0_0_15px_rgba(0,229,255,0.8)]" />

    <div className="relative flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
      {/* Step Card */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-[650px] bg-white dark:bg-[#161B2C] border border-gray-200 dark:border-white/10 rounded-[40px] p-6 sm:p-12 flex flex-col sm:flex-row items-center gap-6 sm:gap-10 shadow-2xl transition-colors duration-300"
      >
        {/* Circular Number Badge */}
        <div className="relative flex-shrink-0 w-32 h-32 rounded-full bg-gray-100 dark:bg-gradient-to-b dark:from-white/10 dark:to-transparent border border-gray-200 dark:border-white/20 flex items-center justify-center shadow-inner">
          <span className="text-blue-600 dark:text-[#00e5ff] font-bold text-[48px] tracking-tighter">
            {steps[currentStep].number}
          </span>
        </div>

        {/* Text Content */}
        <div className="text-center sm:text-left">
          <h3 className="font-['Poppins',sans-serif] font-bold text-[22px] sm:text-[28px] text-gray-900 dark:text-white mb-2">
            {steps[currentStep].title}
          </h3>
          <p className="font-['Poppins',sans-serif] text-[16px] sm:text-[20px] text-gray-600 dark:text-white/60">
            {steps[currentStep].description}
          </p>
        </div>
      </motion.div>

      {/* Right Arrow Button */}
      <button 
        onClick={nextStep}
        className="w-16 h-16 rounded-full bg-blue-500/10 dark:bg-[#003B46]/40 border border-blue-500/30 dark:border-[#00e5ff]/30 flex items-center justify-center group hover:bg-blue-500/20 dark:hover:bg-[#00e5ff]/20 transition-all"
      >
        <ArrowRight className="text-blue-600 dark:text-[#00e5ff] w-6 h-6 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>

    {/* Pagination Dots */}
    <div className="flex justify-center gap-3 mt-12">
      {steps.map((_, index) => (
        <div
          key={index}
          className={`transition-all duration-300 rounded-full ${
            index === currentStep 
              ? "w-8 h-3 bg-blue-600 dark:bg-[#00e5ff] shadow-[0_0_10px_rgba(0,229,255,0.5)]" 
              : "w-3 h-3 bg-gray-300 dark:bg-white/20"
          }`}
        />
      ))}
    </div>
  </div>
</section>


      {/* Bring ALMUS to Your Facility Section */}
      <section id="almus-cta" className="relative min-h-[70vh] pt-20 md:pt-32 pb-16 overflow-hidden bg-gray-50 dark:bg-[#060910] transition-colors duration-300">
        {/* Background Blurs matching the new aesthetic */}
        <div className="absolute bg-blue-400/10 dark:bg-[rgba(0,229,255,0.05)] blur-[120px] left-[15%] rounded-full w-[500px] h-[500px] top-[10%]" />

        <div className="max-w-[798px] mx-auto px-6 relative text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-['Playfair_Display',serif] font-bold text-[36px] sm:text-[48px] lg:text-[62px] leading-[1.1] text-gray-900 dark:text-white mb-4 transition-colors duration-300"
            style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
          >
            Bring ALMUS to your facility
          </motion.h2>
          <p className="font-['Poppins',sans-serif] text-[18px] md:text-[16px] sm:text-[20px] md:text-[24px] leading-[28px] md:leading-[34px] text-gray-600 dark:text-white/70 mb-12 transition-colors duration-300">
            Contact us to learn more about integrating ALMUS into your facility.
          </p>

          {/* Contact Form */}
          <motion.form
            id= "contact"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Name and Facility */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-['Poppins',sans-serif] font-medium text-[16px] text-gray-700 dark:text-white/90 text-left transition-colors duration-300">
                  Name
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
                <label className="font-['Poppins',sans-serif] font-medium text-[16px] text-gray-700 dark:text-white/90 text-left transition-colors duration-300">
                  Facility
                </label>
                <input
                  type="text"
                  name="facility"
                  required
                  value={formData.facility}
                  onChange={handleChange}
                  placeholder="Facility name"
                  className="bg-white/80 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-[14px] px-4 h-[52px] font-['Arial',sans-serif] text-[16px] text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="font-['Poppins',sans-serif] font-medium text-[16px] text-gray-700 dark:text-white/90 text-left transition-colors duration-300">
                Email
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

            {/* Message */}
            <div className="flex flex-col gap-2">
              <label className="font-['Poppins',sans-serif] font-medium text-[16px] text-gray-700 dark:text-white/90 text-left transition-colors duration-300">
                Message
              </label>
              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your facility..."
                className="bg-white/80 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-[14px] px-4 py-3 font-['Arial',sans-serif] text-[16px] text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 dark:bg-[#00e5ff] dark:hover:bg-[#00d4e6] h-[55px] w-full sm:w-auto px-12 rounded-full shadow-lg dark:shadow-[0px_0px_20px_0px_rgba(0,229,255,0.3)] hover:shadow-xl dark:hover:shadow-[0px_0px_30px_0px_rgba(0,229,255,0.5)] hover:scale-[1.02] transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[15px] text-white dark:text-black flex items-center justify-center gap-2 mx-auto"
            >
              Send inquiry
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
