import { motion } from "motion/react";

export function AboutIntro() {
  return (
    <section
      className="relative py-24 px-6 lg:px-20 bg-gradient-to-b from-[#0A0E1A] to-[#0F1425] dark:bg-gradient-to-b dark:from-gray-50 dark:to-white transition-colors duration-300 overflow-hidden"
    >
      {/* Subtle glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#00E5FF]/5 dark:bg-[#00E5FF]/3 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-['Poppins',sans-serif] text-[20px] lg:text-[24px] leading-[1.7] text-white/80 dark:text-[#0A0E1A]/80 mb-12">
            ULTIMA delivers innovative healthcare products and intelligent
            systems designed to enhance safety, efficiency, and care quality in
            modern environments.
          </p>

          {/* Tags */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {["Smart products", "Technology", "Innovation"].map((tag, index) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="px-8 py-4 bg-white/5 dark:bg-[#0A0E1A]/5 backdrop-blur-sm border border-white/20 dark:border-[#0A0E1A]/20 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.3)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.1)]"
              >
                <span className="font-['Poppins',sans-serif] text-[16px] text-white/90 dark:text-[#0A0E1A]/90">
                  {tag}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}