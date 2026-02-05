import { motion } from "motion/react";

export function WhatIsSumma() {
  const scoringSystemImage =
    "https://images.unsplash.com/photo-1736729654379-daa07a3629cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzcG9ydHMlMjB0ZWNobm9sb2d5JTIwc2NvcmluZyUyMHN5c3RlbXxlbnwxfHx8fDE3NzAxMzkxOTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

  return (
    <section className="relative py-24 px-6 lg:px-20 bg-black dark:bg-white overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2
            className="font-['Playfair_Display',serif] font-bold text-[56px] lg:text-[64px] leading-[1.1] text-white dark:text-[#0A0E1A] mb-6"
            style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
          >
            A complete scoring system
            <br />
            for padel facilities
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-[24px] overflow-hidden border border-white/10 dark:border-[#0A0E1A]/10">
              <img
                src={scoringSystemImage}
                alt="SUMMA scoring system in action"
                className="w-full h-auto"
              />
              {/* Green overlay tint */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#39FF14]/10 to-transparent pointer-events-none"></div>
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
            <p className="font-['Poppins',sans-serif] text-[18px] lg:text-[20px] leading-[1.8] text-white/70 dark:text-[#0A0E1A]/70">
              SUMMA combines real-time scoring, hardware and software
              integration, and centralized management in one intelligent
              platform.
            </p>

            <p className="font-['Poppins',sans-serif] text-[18px] lg:text-[20px] leading-[1.8] text-white/70 dark:text-[#0A0E1A]/70">
              Designed specifically for padel courts, it automates
              match tracking while giving facility managers complete control
              over court operations and player data.
            </p>

            <div className="w-24 h-1 bg-[#39FF14] rounded-full shadow-[0_0_12px_rgba(57,255,20,0.8)]"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}