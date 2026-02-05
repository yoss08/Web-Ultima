import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

export function UltimaEcosystem() {
  return (
    <section className="relative py-24 px-6 lg:px-20 bg-black dark:bg-white overflow-hidden transition-colors duration-300">
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Title */}
          <h2
            className="font-['Playfair_Display',serif] font-bold text-[48px] lg:text-[56px] leading-[1.1] text-white dark:text-[#0A0E1A] mb-12"
            style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
          >
            Part of the ULTIMA ecosystem
          </h2>

          {/* Product cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* SUMMA Card (current) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative bg-[#0F1425] dark:bg-gray-100 border-2 border-[#39FF14] rounded-[20px] p-10"
            >
              <h3 className="font-['Playfair_Display',serif] font-bold text-[36px] text-white dark:text-[#0A0E1A] mb-2">
                SUMMA
              </h3>
              <p className="font-['Poppins',sans-serif] text-[16px] text-white/60 dark:text-[#0A0E1A]/60 mb-4">
                Smart Scoring & Facility System
              </p>
              <div className="w-20 h-1 bg-[#39FF14] rounded-full shadow-[0_0_12px_rgba(57,255,20,0.8)]"></div>
            </motion.div>

            {/* ALMUS Card (link) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link
                to="/almus"
                className="block group relative bg-[#0F1425] dark:bg-gray-100 border border-white/10 dark:border-[#0A0E1A]/10 hover:border-[#00E5FF] dark:hover:border-[#00E5FF] rounded-[20px] p-10 transition-all duration-300 h-full"
              >
                <h3 className="font-['Playfair_Display',serif] font-bold text-[36px] text-white dark:text-[#0A0E1A] mb-2">
                  ALMUS
                </h3>
                <p className="font-['Poppins',sans-serif] text-[16px] text-white/60 dark:text-[#0A0E1A]/60 mb-4">
                  Smart Hydration Station
                </p>
                <div className="flex items-center gap-2 text-[#00E5FF] font-['Poppins',sans-serif] text-[14px] font-semibold">
                  Discover ALMUS
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-[#0F1425] dark:bg-gray-100 border border-white/10 dark:border-[#0A0E1A]/10 rounded-[20px] p-10"
          >
            <div className="max-w-2xl mx-auto space-y-4">
              <p className="font-['Poppins',sans-serif] text-[18px] leading-[1.8] text-white/80 dark:text-[#0A0E1A]/80">
                <span className="text-[#39FF14] font-semibold">SUMMA</span>{" "}
                manages scoring and performance.
              </p>
              <p className="font-['Poppins',sans-serif] text-[18px] leading-[1.8] text-white/80 dark:text-[#0A0E1A]/80">
                <span className="text-[#00E5FF] font-semibold">ALMUS</span>{" "}
                supports hydration and recovery.
              </p>
              <p className="font-['Poppins',sans-serif] text-[18px] leading-[1.8] text-white dark:text-[#0A0E1A] font-semibold">
                Together, they form the ULTIMA sport-tech ecosystem.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}