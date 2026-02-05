import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

export function UltimaEcosystem() {
  return (
    <section className="relative py-24 px-6 lg:px-20 bg-gradient-to-b from-[#0A0E1A] via-[#0F1425] to-[#0A0E1A] dark:bg-gradient-to-b dark:from-gray-50 dark:via-white dark:to-gray-50 overflow-hidden transition-colors duration-300">
      {/* Multiple glows */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#00E5FF]/8 dark:bg-[#00E5FF]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#39FF14]/8 dark:bg-[#39FF14]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Product cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* ALMUS Card (current) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative bg-white/5 dark:bg-[#0A0E1A]/5 backdrop-blur-sm border-2 border-[#00E5FF] rounded-[24px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
            >
              <h3 className="font-['Playfair_Display',serif] font-bold text-[36px] text-white dark:text-[#0A0E1A] mb-2">
                ALMUS
              </h3>
              <p className="font-['Poppins',sans-serif] text-[16px] text-white/70 dark:text-[#0A0E1A]/70 mb-4">
                Smart Hydration Station
              </p>
              <div className="w-20 h-1 bg-[#00E5FF] rounded-full shadow-[0_0_12px_rgba(0,229,255,0.8)]"></div>
            </motion.div>

            {/* SUMMA Card (link) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link to="/summa" className="block group h-full">
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/20 hover:border-[#39FF14] rounded-[24px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_48px_rgba(57,255,20,0.3)] transition-all duration-300 h-full">
                  <h3 className="font-['Playfair_Display',serif] font-bold text-[36px] text-white mb-2">
                    SUMMA
                  </h3>
                  <p className="font-['Poppins',sans-serif] text-[16px] text-white/70 mb-4">
                    Padel Sports Dashboard
                  </p>
                  <div className="flex items-center gap-2 text-[#39FF14] font-['Poppins',sans-serif] text-[14px] font-semibold">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                  <div className="w-20 h-1 bg-[#39FF14] rounded-full shadow-[0_0_12px_rgba(57,255,20,0.8)] mt-4"></div>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Divider */}
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto"></div>
        </motion.div>
      </div>
    </section>
  );
}