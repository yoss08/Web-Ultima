import { motion } from "motion/react";

export function WhatIsAlmus() {
  const facilityImage =
    "https://images.unsplash.com/photo-1761971974992-6df33df97c3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBneW0lMjBmYWNpbGl0eSUyMGVxdWlwbWVudCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzAxMjA4ODh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

  return (
    <section className="relative py-24 px-6 lg:px-20 bg-gradient-to-b from-[#0F1425] to-[#0A0E1A] dark:bg-gradient-to-b dark:from-gray-50 dark:to-white overflow-hidden transition-colors duration-300">
      {/* Subtle glow */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-[#00E5FF]/5 dark:bg-[#00E5FF]/3 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
              <img
                src={facilityImage}
                alt="ALMUS installed in professional training facility"
                className="w-full h-auto"
              />
              {/* Blue overlay tint */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/10 to-transparent pointer-events-none"></div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2
              className="font-['Playfair_Display',serif] font-bold text-[48px] lg:text-[56px] leading-[1.1] text-white dark:text-[#0A0E1A] drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] dark:drop-shadow-none"
              style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
            >
              A hydration solution designed for your facility
            </h2>

            <p className="font-['Poppins',sans-serif] text-[18px] lg:text-[20px] leading-[1.7] text-white/70 dark:text-[#0A0E1A]/70">
              ALMUS is an on-site hydration station that mixes water with light
              flavors to offer refreshing, low-calorie drinks. Built for
              high-traffic environments, it enhances user experience while
              remaining simple and reliable for facility operators.
            </p>

            <div className="w-24 h-1 bg-[#00E5FF] rounded-full shadow-[0_0_12px_rgba(0,229,255,0.8)]"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}