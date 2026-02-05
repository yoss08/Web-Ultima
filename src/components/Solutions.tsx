import { motion } from "motion/react";
import svgPaths from "./../components/icons/IconService";
import imgImage1 from "figma:asset/8b0da350454b038a4e8476b303df3b4488bd3386.png";
import imgImage2 from "figma:asset/34d7c131a6ab8246cf7708093f3465c605242038.png";

export function Solutions() {
  return (
    <section
      id="solutions"
      className="py-24 px-12 lg:px-20 bg-[#F5F5F5] dark:bg-[#0B0F14] transition-colors duration-300"
    >
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
              className="space-y-6"
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

              <button className="bg-[#0f172b] dark:bg-[#3B82F6] h-[48px] px-6 rounded-full shadow-md hover:bg-[#1e293b] hover:scale-105 hover:shadow-lg dark:hover:bg-[#2563EB] transition-all duration-300 flex items-center gap-2 mt-6">
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
              </button>
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
              className="space-y-6 order-1 lg:order-2"
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

              <button className="bg-[#0f172b] dark:bg-[#3B82F6] h-[48px] px-6 rounded-full shadow-md hover:bg-[#1e293b] hover:scale-105 hover:shadow-lg dark:hover:bg-[#2563EB] transition-all duration-300 flex items-center gap-2 mt-6">
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
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}