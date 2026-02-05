import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { Moon, Sun, ArrowRight } from "lucide-react";
import svgPaths from "../../components/icons/IconSeparator";
const imgImageAlmusSmartHydrationStation = "/assets/images/Hydrationstation.png";
const imgImageAlmusInstalledInProfessionalTrainingFacility = "/assets/images/trainingfacility.png";
const imgImageLemonFlavor = "/assets/images/lemon.png";
const imgImageBerryFlavor = "/assets/images/berry.png";
const imgImageCitrusFlavor = "/assets/images/citrus.png";
const imgImageTropicalFlavor = "/assets/images/tropical.png";
const imgImageGymsFitnessCenters = "/assets/images/fitnesscenters.png";
const imgImageTrainingFacilities = "/assets/images/trainingfacilities.png";
const imgImageSportsClubs = "/assets/images/sportclubs.jpg";
const imgImageWellnessSpaces = "/assets/images/wellnessSpaces.png";
export function AlmusPage() {

  const [isDark, setIsDark] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    facility: "",
    email: "",
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
                to="/"
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
                href="/#about"
                className="font-['Poppins',sans-serif] font-medium text-[16px] text-white/80 hover:text-white transition-colors"
              >
                About
              </a>
              <a
                href="/#contact"
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
                className="bg-[#00E5FF] hover:bg-[#00D4E6] h-[40px] px-6 rounded-full hover:scale-105 transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[14px] text-black flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.3)]"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-[700px] pt-32 pb-16 overflow-hidden bg-gradient-to-b from-[#0a0e1a] via-[#0f1425] to-[#050810]">
        {/* Background Blurs */}
        <div className="absolute bg-[rgba(0,229,255,0.1)] blur-[140px] left-[274px] rounded-full w-[500px] h-[500px] top-[202.5px]" />
        <div className="absolute bg-[rgba(0,229,255,0.05)] blur-[120px] left-[422px] rounded-full w-[400px] h-[400px] top-[207.5px]" />

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
                  className="font-['Playfair_Display',serif] font-bold text-[64px] text-white shadow-[0px_2px_40px_0px_rgba(0,0,0,0.8)] mb-4"
                  style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
                >
                  ALMUS
                </h1>
                <div className="bg-[#00e5ff] h-[6px] w-[128px] rounded-full shadow-[0px_0px_20px_0px_rgba(0,229,255,0.8)]" />
              </div>

              <h2 className="font-['Poppins',sans-serif] font-medium text-[24px] text-white/90 tracking-[0.5px]">
                Smart Hydration Station
              </h2>

              <p className="font-['Poppins',sans-serif] text-[24px] leading-[34px] text-white/70">
                ALMUS delivers flavored, low-calorie beverages designed to
                support hydration, recovery, and performance in active
                environments.
              </p>

              <div className="flex gap-6 mt-6">
                <button className="bg-[#00e5ff] hover:bg-[#00d4e6] h-[56px] px-8 rounded-full shadow-[0px_0px_20px_0px_rgba(0,229,255,0.3)] hover:shadow-[0px_0px_30px_0px_rgba(0,229,255,0.5)] hover:scale-[1.02] transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[16px] text-black">
                  Request a quote
                </button>
                <button className="bg-white/5 hover:bg-white/10 border-2 border-white/20 h-[56px] px-8 rounded-full transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[16px] text-white">
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
              <div className="relative rounded-[32px] overflow-hidden shadow-[0px_20px_60px_0px_rgba(0,0,0,0.6)]">
                <img
                  src={imgImageAlmusSmartHydrationStation}
                  alt="ALMUS Smart Hydration Station"
                  className="w-full h-[461px] object-cover rounded-[32px]"
                />
                <div
                  className="absolute inset-0 blur-[24px]"
                  style={{
                    backgroundImage:
                      "linear-gradient(140.528deg, rgba(0, 229, 255, 0.2) 0%, rgba(0, 0, 0, 0) 100%)",
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Hydration Solution Section */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-b from-[#0f1425] to-[#0a0e1a]">
        <div className="absolute bg-[rgba(0,229,255,0.05)] blur-[120px] left-[322px] rounded-full w-[500px] h-[500px] top-[347.19px]" />

        <div className="max-w-[1096px] mx-auto px-20 relative">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-['Playfair_Display',serif] font-bold text-[64px] leading-[1.1] text-white mb-16 max-w-[704px]"
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
              <div className="relative rounded-[32px] overflow-hidden shadow-[0px_20px_60px_0px_rgba(0,0,0,0.6)]">
                <img
                  src={imgImageAlmusInstalledInProfessionalTrainingFacility}
                  alt="ALMUS installed in professional training facility"
                  className="w-full h-[272px] object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(139.834deg, rgba(0, 229, 255, 0.1) 0%, rgba(0, 0, 0, 0) 100%)",
                  }}
                />
              </div>
              <div className="bg-[#00e5ff] h-[4px] w-[96px] rounded-full shadow-[0px_0px_12px_0px_rgba(0,229,255,0.8)] mt-8" />
            </motion.div>

            {/* Right Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="pt-24"
            >
              <p className="font-['Poppins',sans-serif] text-[24px] leading-[34px] text-white/70">
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
      <section className="relative py-24 overflow-hidden bg-gradient-to-b from-[#0a0e1a] via-[#0f1425] to-[#0a0e1a]">
        <div className="absolute bg-[rgba(0,229,255,0.05)] blur-[140px] left-[248px] rounded-full w-[600px] h-[600px] top-[1300px]" />

        <div className="max-w-[1096px] mx-auto px-14 relative">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left Heading */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2
                className="font-['Playfair_Display',serif] font-bold text-[64px] leading-[1.2] text-white"
                style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
              >
                Why choose ALMUS
              </h2>
              <div className="bg-[#00e5ff] h-[6px] w-[128px] rounded-full shadow-[0px_0px_16px_0px_rgba(0,229,255,0.8)] mt-6" />
            </motion.div>

            {/* Right Benefits */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col gap-6"
            >
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-[32px] p-10 shadow-[0px_20px_60px_0px_rgba(0,0,0,0.6)]"
                >
                  <h3 className="font-['Poppins',sans-serif] font-bold text-[24px] leading-[36.4px] text-white mb-4">
                    {benefit.title}
                  </h3>
                  <p className="font-['Poppins',sans-serif] text-[24px] leading-[34px] text-white/70">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Flavored Hydration Options Section */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-b from-[#0a0e1a] to-[#0f1425]">
        <div className="absolute bg-[rgba(0,229,255,0.05)] blur-[120px] left-[365.33px] rounded-full w-[500px] h-[500px] top-[181.02px]" />

        <div className="max-w-[936px] mx-auto px-6 relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <h2
              className="font-['Playfair_Display',serif] font-bold text-[62px] leading-[61.6px] text-white mb-6"
              style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
            >
              Flavored hydration options
            </h2>
            <p className="font-['Poppins',sans-serif] text-[24px] leading-[34px] text-white/70 max-w-[761px] mx-auto">
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
                className="bg-white/5 border border-white/10 rounded-[24px] overflow-hidden shadow-[0px_8px_32px_0px_rgba(0,0,0,0.4)] hover:scale-105 transition-transform duration-300"
              >
                <div className="relative h-[256px]">
                  <img
                    src={flavor.image}
                    alt={`${flavor.name} flavor`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.8)] via-[rgba(0,0,0,0.4)] to-[rgba(0,0,0,0)]" />
                  <div
                    className="absolute inset-0 bg-gradient-to-t to-[rgba(0,0,0,0)] opacity-20"
                    style={{
                      backgroundImage: `linear-gradient(to top, ${flavor.gradient}, rgba(0,0,0,0))`,
                    }}
                  />
                  <div className="absolute bottom-6 left-6">
                    <h3 className="font-['Poppins',sans-serif] font-semibold text-[24px] leading-[36px] text-white mb-1">
                      {flavor.name}
                    </h3>
                    <div
                      className="h-[4px] w-[64px] rounded-full shadow-[0px_0px_12px_0px_rgba(255,255,255,0.4)]"
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
      <section className="relative py-24 overflow-hidden bg-gradient-to-b from-[#0f1425] to-[#0a0e1a]">
        <div className="absolute bg-[rgba(0,229,255,0.05)] blur-[120px] left-[298px] rounded-full w-[500px] h-[500px] top-[100px]" />

        <div className="max-w-[936px] mx-auto px-6 relative text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-['Playfair_Display',serif] font-bold text-[62px] leading-[61.6px] text-white mb-16"
            style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
          >
            How it works
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                className="relative"
              >
                <div className="text-[#00e5ff] font-['Poppins',sans-serif] font-bold text-[48px] mb-4">
                  {step.number}
                </div>
                <h3 className="font-['Poppins',sans-serif] font-bold text-[24px] text-white mb-3">
                  {step.title}
                </h3>
                <p className="font-['Poppins',sans-serif] text-[18px] leading-[28px] text-white/70">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Built for Active Environments Section */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-b from-[#0a0e1a] to-[#0f1425]">
        <div className="max-w-[936px] mx-auto px-6 relative text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-['Playfair_Display',serif] font-bold text-[62px] leading-[61.6px] text-white mb-6"
            style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
          >
            Built for active environments
          </motion.h2>
          <p className="font-['Poppins',sans-serif] text-[24px] leading-[34px] text-white/70 mb-16 max-w-[761px] mx-auto">
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
                className="bg-white/5 border border-white/10 rounded-[24px] overflow-hidden shadow-[0px_8px_32px_0px_rgba(0,0,0,0.4)] hover:scale-105 transition-transform duration-300"
              >
                <div className="relative h-[200px]">
                  <img
                    src={env.image}
                    alt={env.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-[rgba(0,0,0,0.6)] to-[rgba(0,0,0,0)]" />
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
      <section className="relative py-24 overflow-hidden bg-gradient-to-b from-[#0f1425] to-[#0a0e1a]">
        <div className="absolute bg-[rgba(0,229,255,0.05)] blur-[120px] left-[298px] rounded-full w-[500px] h-[500px] top-[145.39px]" />

        <div className="max-w-[798px] mx-auto px-6 relative text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-['Playfair_Display',serif] font-bold text-[62px] leading-[61.6px] text-white mb-4"
            style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
          >
            Bring ALMUS to your facility
          </motion.h2>
          <p className="font-['Poppins',sans-serif] text-[24px] leading-[34px] text-white/70 mb-12">
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
                <label className="font-['Poppins',sans-serif] font-medium text-[16px] text-white/90 text-left">
                  Name
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
                  Facility
                </label>
                <input
                  type="text"
                  name="facility"
                  required
                  value={formData.facility}
                  onChange={handleChange}
                  placeholder="Facility name"
                  className="bg-white/5 border border-white/20 rounded-[14px] px-4 h-[52px] font-['Arial',sans-serif] text-[16px] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#00e5ff] transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="font-['Poppins',sans-serif] font-medium text-[16px] text-white/90 text-left">
                Email
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
                placeholder="Tell us about your facility..."
                className="bg-white/5 border border-white/20 rounded-[14px] px-4 py-3 font-['Arial',sans-serif] text-[16px] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#00e5ff] transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-[#00e5ff] hover:bg-[#00d4e6] h-[55px] px-12 rounded-full shadow-[0px_0px_20px_0px_rgba(0,229,255,0.3)] hover:shadow-[0px_0px_30px_0px_rgba(0,229,255,0.5)] hover:scale-[1.02] transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[15px] text-black flex items-center justify-center gap-2 mx-auto"
            >
              Send inquiry
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
