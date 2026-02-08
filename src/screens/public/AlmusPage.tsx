import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { Moon, Sun, ArrowRight } from "lucide-react";

import almusImg from "../../../assets/images/almus.jpg";

const imgImageAlmusSmartHydrationStation = almusImg;

const imgImageAlmusInstalledInProfessionalTrainingFacility = "/assets/images/hydrationsolution.jpg";
const imgImageLemonFlavor = "/assets/images/lemon.png";
const imgImageBerryFlavor = "/assets/images/berry.webp";
const imgImageCitrusFlavor = "/assets/images/citrus.png";
const imgImageTropicalFlavor = "/assets/images/tropical.avif";
const imgImageGymsFitnessCenters = "/assets/images/fitnesscenters.png";
const imgImageTrainingFacilities = "/assets/images/trainingcenters.jpg";
const imgImageSportsClubs = "/assets/images/sportclubs.jpg";
const imgImageWellnessSpaces = "/assets/images/wellness.webp";

export function AlmusPage() {
  const [isDark, setIsDark] = useState(() => {
    // Dark mode par défaut
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'light') return false;
      return true; // Par défaut dark
    }
    return true;
  });

  const [currentStep, setCurrentStep] = useState(0);
  

  const nextStep = () => {
    setCurrentStep((prev) => (prev === steps.length - 1 ? 0 : prev + 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev === 0 ? steps.length - 1 : prev - 1));
  };

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

  const flavors = [
    {
      name: "Lemon",
      image: imgImageLemonFlavor,
      color: "#FFD700",
      gradient: "rgba(255,215,0,0.25)",
    },
    {
      name: "Berry",
      image: imgImageBerryFlavor,
      color: "#DC143C",
      gradient: "rgba(220,20,60,0.25)",
    },
    {
      name: "Citrus",
      image: imgImageCitrusFlavor,
      color: "#FF8C00",
      gradient: "rgba(255,140,0,0.25)",
    },
    {
      name: "Tropical",
      image: imgImageTropicalFlavor,
      color: "#FF1493",
      gradient: "rgba(255,20,147,0.25)",
    },
  ];

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

  const environments = [
    {
      name: "Gyms & Fitness Centers",
      image: imgImageGymsFitnessCenters,
      description: "High-traffic facilities",
    },
    {
      name: "Training Facilities",
      image: imgImageTrainingFacilities,
      description: "Professional sports",
    },
    {
      name: "Sports Clubs",
      image: imgImageSportsClubs,
      description: "Competitive environments",
    },
    {
      name: "Wellness Spaces",
      image: imgImageWellnessSpaces,
      description: "Recovery-focused",
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#0A0E1A] dark:to-black transition-colors duration-300">
      {/* Navigation - Laissée inchangée comme demandé */}
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
              <button
                onClick={scrollToContact}
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
      <section className="relative min-h-[70vh] pt-32 pb-16 overflow-hidden bg-gray-50 dark:bg-[#060910] transition-colors duration-300">
        {/* Background Blurs matching the new aesthetic */}
        <div className="absolute bg-blue-400/10 dark:bg-[rgba(0,229,255,0.05)] blur-[120px] left-[15%] rounded-full w-[500px] h-[500px] top-[10%]" />
        <div className="absolute bg-emerald-400/10 dark:bg-[rgba(57,255,20,0.03)] blur-[120px] right-[15%] rounded-full w-[500px] h-[500px] top-[20%]" />

        <div className="max-w-[1096px] mx-auto px-12 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-4"
            >
              <div>
                <h1
                  className="font-['Playfair_Display',serif] font-bold text-[120px] text-gray-900 dark:text-white mb-2 transition-colors duration-300"
                  style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
                >
                  ALMUS
                </h1>
                <div className="bg-blue-500 dark:bg-[#00e5ff] h-[6px] w-[128px] rounded-full shadow-lg dark:shadow-[0px_0px_20px_0px_rgba(0,229,255,0.8)] transition-colors duration-300" />
              </div>

              <h2 className="font-['Poppins',sans-serif] font-medium text-[24px] text-gray-700 dark:text-white/90 tracking-[0.5px] transition-colors duration-300">
                Smart Hydration Station
              </h2>

              <p className="font-['Poppins',sans-serif] text-[24px] leading-[34px] text-gray-600 dark:text-white/70 transition-colors duration-300">
                ALMUS delivers flavored, low-calorie beverages designed to
                support hydration, recovery, and performance in active
                environments.
              </p>

              <div className="flex gap-6 mt-6">
                <button onClick={scrollToContact} className="bg-blue-500 hover:bg-blue-600 dark:bg-[#00e5ff] dark:hover:bg-[#00d4e6] h-[56px] px-8 rounded-full shadow-lg dark:shadow-[0px_0px_20px_0px_rgba(0,229,255,0.3)] hover:shadow-xl dark:hover:shadow-[0px_0px_30px_0px_rgba(0,229,255,0.5)] hover:scale-[1.02] transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[16px] text-white dark:text-black">
                  Request a quote
                </button>
                <button onClick={scrollToContact} className="bg-white/80 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10 border-2 border-gray-300 dark:border-white/20 h-[56px] px-8 rounded-full transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[16px] text-gray-800 dark:text-white">
                  Contact ULTIMA
                </button>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-[32px] overflow-hidden shadow-xl dark:shadow-[0px_20px_60px_0px_rgba(0,0,0,0.6)]">
                <img
                  src={imgImageAlmusSmartHydrationStation}
                  alt="ALMUS Smart Hydration Station"
                  className="w-full h-[461px] object-cover rounded-[32px]"
                />
                <div
                  className="absolute inset-0 blur-[24px] opacity-30 dark:opacity-100"
                  style={{
                    backgroundImage:
                      "linear-gradient(140.528deg, rgba(59, 130, 246, 0.1) 0%, rgba(0, 0, 0, 0) 100%)",
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Hydration Solution Section */}
      <section className="relative min-h-[70vh] pt-32 pb-16 overflow-hidden bg-gray-50 dark:bg-[#060910] transition-colors duration-300">
        {/* Background Blurs matching the new aesthetic */}
        <div className="absolute bg-blue-400/10 dark:bg-[rgba(0,229,255,0.05)] blur-[120px] left-[15%] rounded-full w-[500px] h-[500px] top-[10%]" />
        <div className="absolute bg-emerald-400/10 dark:bg-[rgba(57,255,20,0.03)] blur-[120px] right-[15%] rounded-full w-[500px] h-[500px] top-[20%]" />

        <div className="max-w-[1096px] mx-auto px-20 relative">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-['Playfair_Display',serif] font-bold text-[64px] leading-[1.1] text-gray-900 dark:text-white mb-16 max-w-[704px] transition-colors duration-300"
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
              className="pt-24"
            >
              <p className="font-['Poppins',sans-serif] text-[24px] leading-[34px] text-gray-600 dark:text-white/70 transition-colors duration-300">
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
      <section className="relative min-h-[70vh] pt-32 pb-16 overflow-hidden bg-gray-50 dark:bg-[#060910] transition-colors duration-300">
        {/* Background Blurs matching the new aesthetic */}
        <div className="absolute bg-blue-400/10 dark:bg-[rgba(0,229,255,0.05)] blur-[120px] left-[15%] rounded-full w-[500px] h-[500px] top-[10%]" />
        <div className="absolute bg-emerald-400/10 dark:bg-[rgba(57,255,20,0.03)] blur-[120px] right-[15%] rounded-full w-[500px] h-[500px] top-[20%]" />

        <div className="max-w-[1096px] mx-auto px-14 relative">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left Heading */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2
                className="font-['Playfair_Display',serif] font-bold text-[64px] leading-[1.2] text-gray-900 dark:text-white transition-colors duration-300"
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
                  className="bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[32px] p-10 shadow-xl dark:shadow-[0px_20px_60px_0px_rgba(0,0,0,0.6)] transition-colors duration-300"
                >
                  <h3 className="font-['Poppins',sans-serif] font-bold text-[24px] leading-[36.4px] text-gray-800 dark:text-white mb-4 transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="font-['Poppins',sans-serif] text-[24px] leading-[34px] text-gray-600 dark:text-white/70 transition-colors duration-300">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Flavored Hydration Options Section */}
      <section className="relative min-h-[70vh] py-24 bg-gray-50 dark:bg-[#060910] transition-colors duration-300">
        {/* Background Blurs matching the new aesthetic */}
        <div className="absolute bg-blue-400/10 dark:bg-[rgba(0,229,255,0.05)] blur-[120px] left-[365.33px] rounded-full w-[500px] h-[500px] top-[181.02px]" />

        <div className="max-w-[936px] mx-auto px-6 relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <h2
              className="font-['Playfair_Display',serif] font-bold text-[62px] leading-[61.6px] text-gray-900 dark:text-white mb-6 transition-colors duration-300"
              style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
            >
              Flavored hydration options
            </h2>
            <p className="font-['Poppins',sans-serif] text-[24px] leading-[34px] text-gray-600 dark:text-white/70 max-w-[761px] mx-auto transition-colors duration-300">
              ALMUS offers a range of light, refreshing flavors formulated for
              regular consumption in active environments.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {flavors.map((flavor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                className="bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[24px] overflow-hidden shadow-lg dark:shadow-[0px_8px_32px_0px_rgba(0,0,0,0.4)] hover:scale-105 transition-all duration-300"
              >
                <div className="relative h-[256px]">
                  <img
                    src={flavor.image}
                    alt={`${flavor.name} flavor`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent dark:from-[rgba(0,0,0,0.8)] dark:via-[rgba(0,0,0,0.4)] dark:to-[rgba(0,0,0,0)]" />
                  <div
                    className="absolute inset-0 bg-gradient-to-t to-transparent opacity-20"
                    style={{
                      backgroundImage: `linear-gradient(to top, ${flavor.gradient}, rgba(0,0,0,0))`,
                    }}
                  />
                  <div className="absolute bottom-6 left-6">
                    <h3 className="font-['Poppins',sans-serif] font-semibold text-[24px] leading-[36px] text-white mb-1">
                      {flavor.name}
                    </h3>
                    <div
                      className="h-[4px] w-[64px] rounded-full shadow-lg"
                      style={{ backgroundColor: flavor.color }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
<section className="relative min-h-[70vh] pt-32 pb-16 bg-white dark:bg-[#060910] transition-colors duration-300">
      <div className="absolute bg-blue-400/10 dark:bg-[rgba(0,229,255,0.05)] blur-[120px] left-[298px] rounded-full w-[500px] h-[500px] top-[145.39px]" />
  <div className="max-w-[936px] mx-auto px-6 relative text-center">
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="font-['Playfair_Display',serif] font-bold text-[72px] text-gray-900 dark:text-white mb-16"
    >
      How it works
    </motion.h2>

    {/* Glowing underline */}
    <div className="w-32 h-1.5 bg-blue-500 dark:bg-[#00e5ff] mx-auto -mt-12 mb-20 rounded-full shadow-[0_0_15px_rgba(0,229,255,0.8)]" />

    <div className="relative flex items-center justify-center gap-12">
      {/* Step Card */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-[650px] bg-white dark:bg-[#161B2C] border border-gray-200 dark:border-white/10 rounded-[40px] p-12 flex items-center gap-10 shadow-2xl transition-colors duration-300"
      >
        {/* Circular Number Badge */}
        <div className="relative flex-shrink-0 w-32 h-32 rounded-full bg-gray-100 dark:bg-gradient-to-b dark:from-white/10 dark:to-transparent border border-gray-200 dark:border-white/20 flex items-center justify-center shadow-inner">
          <span className="text-blue-600 dark:text-[#00e5ff] font-bold text-[48px] tracking-tighter">
            {steps[currentStep].number}
          </span>
        </div>

        {/* Text Content */}
        <div className="text-left">
          <h3 className="font-['Poppins',sans-serif] font-bold text-[28px] text-gray-900 dark:text-white mb-2">
            {steps[currentStep].title}
          </h3>
          <p className="font-['Poppins',sans-serif] text-[20px] text-gray-600 dark:text-white/60">
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

      {/* Built for Active Environments Section */}
      <section className="relative min-h-[70vh] py-24 bg-gray-50 dark:bg-[#060910] transition-colors duration-300">
        {/* Background Blurs matching the new aesthetic */}
        <div className="absolute bg-blue-400/10 dark:bg-[rgba(0,229,255,0.05)] blur-[120px] left-[365.33px] rounded-full w-[500px] h-[500px] top-[181.02px]" />

        <div className="max-w-[936px] mx-auto px-6 relative text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-['Playfair_Display',serif] font-bold text-[62px] leading-[61.6px] text-gray-900 dark:text-white mb-6 transition-colors duration-300"
            style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
          >
            Built for active environments
          </motion.h2>
          <p className="font-['Poppins',sans-serif] text-[24px] leading-[34px] text-gray-600 dark:text-white/70 mb-16 max-w-[761px] mx-auto transition-colors duration-300">
            ALMUS is designed for facilities where hydration is critical to
            performance and member experience.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {environments.map((env, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                className="bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[24px] overflow-hidden shadow-lg dark:shadow-[0px_8px_32px_0px_rgba(0,0,0,0.4)] hover:scale-105 transition-all duration-300"
              >
                <div className="relative h-[200px]">
                  <img
                    src={env.image}
                    alt={env.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent dark:from-black dark:via-[rgba(0,0,0,0.6)] dark:to-[rgba(0,0,0,0)]" />
                  <div className="absolute bottom-4 left-4 text-left">
                    <h3 className="font-['Poppins',sans-serif] font-semibold text-[16px] text-white mb-1">
                      {env.name}
                    </h3>
                    <p className="font-['Poppins',sans-serif] text-[12px] text-white/70">
                      {env.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bring ALMUS to Your Facility Section */}
      <section id="almus-cta" className="relative min-h-[70vh] pt-32 pb-16 overflow-hidden bg-gray-50 dark:bg-[#060910] transition-colors duration-300">
        {/* Background Blurs matching the new aesthetic */}
        <div className="absolute bg-blue-400/10 dark:bg-[rgba(0,229,255,0.05)] blur-[120px] left-[15%] rounded-full w-[500px] h-[500px] top-[10%]" />

        <div className="max-w-[798px] mx-auto px-6 relative text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-['Playfair_Display',serif] font-bold text-[62px] leading-[61.6px] text-gray-900 dark:text-white mb-4 transition-colors duration-300"
            style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
          >
            Bring ALMUS to your facility
          </motion.h2>
          <p className="font-['Poppins',sans-serif] text-[24px] leading-[34px] text-gray-600 dark:text-white/70 mb-12 transition-colors duration-300">
            Contact us to learn more about integrating ALMUS into your facility.
          </p>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Name and Facility */}
            <div className="grid md:grid-cols-2 gap-6">
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
              className="bg-blue-500 hover:bg-blue-600 dark:bg-[#00e5ff] dark:hover:bg-[#00d4e6] h-[55px] px-12 rounded-full shadow-lg dark:shadow-[0px_0px_20px_0px_rgba(0,229,255,0.3)] hover:shadow-xl dark:hover:shadow-[0px_0px_30px_0px_rgba(0,229,255,0.5)] hover:scale-[1.02] transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[15px] text-white dark:text-black flex items-center justify-center gap-2 mx-auto"
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
