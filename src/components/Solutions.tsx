import { motion } from "motion/react";
import svgPaths from "./icons/IconService";
import { Link } from "react-router";
import { Moon, Sun, ArrowRight } from "lucide-react";
import { useEffect, useState,  } from "react";
const imgImage1 = "/assets/images/padel2.png";
const imgImage2 = "/assets/images/waterdispanse.jpg";

export function Solutions() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);
  return (
   <section
      id="solutions"
      className="py-24 px-12 lg:px-20 bg-[#F5F5F5] dark:bg-[#0B0F14] transition-colors duration-300"
    >
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
                to="/Solutions"
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

      
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2
            className="font-['Playfair_Display',serif] font-bold text-[72px] leading-[75px] text-[#0f172b] dark:text-[#F9FAFB] mb-4"
            style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
          >
            Solutions
          </h2>
          <p className="font-['Poppins',sans-serif] text-[24px] leading-[28px] text-[#45556c] dark:text-[#9CA3AF] mt-4">
            Intelligent systems for modern healthcare
          </p>
        </motion.div>

        <div className="space-y-32">
          {/* SUMMA */}
          <motion.div
            id="summa"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6 lg:pl-24"
            >
              <div>
                <h3
                  className="font-['Playfair_Display',serif] font-bold text-[72px] leading-tight text-[#0f172b] dark:text-[#F9FAFB]"
                  style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
                >
                  SUMMA
                </h3>
                <p className="font-['Poppins',sans-serif] text-[16px] leading-[24px] text-[#45556c] dark:text-[#9CA3AF] mt-2">
                  Smart Dispenser System
                </p>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-[6px] h-[6px] bg-[#0f172b] dark:bg-[#3B82F6] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="font-['Poppins',sans-serif] text-[16px] leading-[24px] text-[#314158] dark:text-[#E5E7EB]">
                    automatic counting and tracking
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-[6px] h-[6px] bg-[#0f172b] dark:bg-[#3B82F6] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="font-['Poppins',sans-serif] text-[16px] leading-[24px] text-[#314158] dark:text-[#E5E7EB]">
                    Real-time monitoring
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-[6px] h-[6px] bg-[#0f172b] dark:bg-[#3B82F6] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="font-['Poppins',sans-serif] text-[16px] leading-[24px] text-[#314158] dark:text-[#E5E7EB]">
                    no external controls
                  </span>
                </li>
              </ul>

              <Link 
  to="/summa" 
  className="bg-[#0f172b] dark:bg-[#3B82F6] h-[48px] px-6 rounded-full shadow-md hover:bg-[#1e293b] hover:scale-105 hover:shadow-lg dark:hover:bg-[#2563EB] transition-all duration-300 flex items-center gap-2 mt-6 no-underline w-fit"
>
  <span className="font-['Poppins',sans-serif] font-semibold text-[14px] leading-[20px] text-white">
    Explore SUMMA
  </span>
  <svg
    width="16"
    height="16"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.16667 10H15.8333"
      stroke="white"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d={svgPaths.p1ae0b780}
      stroke="white"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</Link>
            </motion.div>

            {/* Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square rounded-[32px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group">
                <img
                  src={imgImage1}
                  alt="SUMMA Smart Dispenser"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* ALMUS */}
          <motion.div
            id="almus"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            {/* Visual (on left for alternating layout) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative order-2 lg:order-1"
            >
              <div className="aspect-square rounded-[32px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group">
                <img
                  src={imgImage2}
                  alt="ALMUS Flavored Drink Machine"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6 order-1 lg:order-2 lg:pl-24"
            >
              <div>
                <h3
                  className="font-['Playfair_Display',serif] font-bold text-[72px] leading-tight text-[#0f172b] dark:text-[#F9FAFB]"
                  style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
                >
                  ALMUS
                </h3>
                <p className="font-['Poppins',sans-serif] text-[16px] leading-[24px] text-[#45556c] dark:text-[#9CA3AF] mt-2">
                  Smart Dispenser System
                </p>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-[6px] h-[6px] bg-[#0f172b] dark:bg-[#3B82F6] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="font-['Poppins',sans-serif] text-[16px] leading-[24px] text-[#314158] dark:text-[#E5E7EB]">
                    It mixes water with natural flavors
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-[6px] h-[6px] bg-[#0f172b] dark:bg-[#3B82F6] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="font-['Poppins',sans-serif] text-[16px] leading-[24px] text-[#314158] dark:text-[#E5E7EB]">
                    Very low calorie / no sugar
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-[6px] h-[6px] bg-[#0f172b] dark:bg-[#3B82F6] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="font-['Poppins',sans-serif] text-[16px] leading-[24px] text-[#314158] dark:text-[#E5E7EB]">
                    Simple, clean, and modern
                  </span>
                </li>
              </ul>

<Link 
  to="/almus" 
  className="bg-[#0f172b] dark:bg-[#3B82F6] h-[48px] px-6 rounded-full shadow-md hover:bg-[#1e293b] hover:scale-105 hover:shadow-lg dark:hover:bg-[#2563EB] transition-all duration-300 flex items-center gap-2 mt-6 no-underline w-fit"
>
  <span className="font-['Poppins',sans-serif] font-semibold text-[14px] leading-[20px] text-white">
    Explore ALMUS
  </span>
  <svg
    width="16"
    height="16"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.16667 10H15.8333"
      stroke="white"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d={svgPaths.p1ae0b780}
      stroke="white"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
     </section>
  );
}