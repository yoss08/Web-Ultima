import { motion } from "motion/react";

const flavors = [
  {
    name: "Lemon",
    color: "#FFD700",
    image:
      "https://images.unsplash.com/photo-1718196917011-801cddb84334?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZW1vbiUyMGNpdHJ1cyUyMGZyZXNoJTIwZHJpbmt8ZW58MXx8fHwxNzcwMTIwOTIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    name: "Berry",
    color: "#DC143C",
    image:
      "https://images.unsplash.com/photo-1676300186581-6dbe4c15adb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZXJyeSUyMGZydWl0JTIwZnJlc2glMjBkcmlua3xlbnwxfHx8fDE3NzAxMjA5MjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    name: "Citrus",
    color: "#FF8C00",
    image:
      "https://images.unsplash.com/photo-1671920090611-9a40303b52cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjBjaXRydXMlMjBmcmVzaCUyMGRyaW5rfGVufDF8fHx8MTc3MDEyMDkyNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    name: "Tropical",
    color: "#FF6347",
    image:
      "https://images.unsplash.com/photo-1708416817517-089fccf84b7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGZydWl0JTIwZnJlc2glMjBkcmlua3xlbnwxfHx8fDE3NzAxMjA5MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
];

export function Flavors() {
  return (
    <section className="relative py-24 px-6 lg:px-20 bg-gradient-to-b from-[#0A0E1A] to-[#0F1425] dark:bg-gradient-to-b dark:from-white dark:to-gray-50 overflow-hidden transition-colors duration-300">
      {/* Subtle glow */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#00E5FF]/5 dark:bg-[#00E5FF]/3 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title & Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <h2
            className="font-['Playfair_Display',serif] font-bold text-[48px] lg:text-[56px] leading-[1.1] text-white dark:text-[#0A0E1A] drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] dark:drop-shadow-none mb-6"
            style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
          >
            Flavored hydration options
          </h2>
          <p className="font-['Poppins',sans-serif] text-[18px] lg:text-[20px] leading-[1.7] text-white/70 dark:text-[#0A0E1A]/70 mb-4">
            ALMUS offers a range of light, refreshing flavors formulated for
            regular consumption in active environments.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-[15px] text-white/60 dark:text-[#0A0E1A]/60 font-['Poppins',sans-serif]">
            <span className="px-4 py-2 bg-white/5 dark:bg-[#0A0E1A]/5 rounded-full border border-white/10 dark:border-[#0A0E1A]/10">
              Low calorie
            </span>
            <span className="px-4 py-2 bg-white/5 dark:bg-[#0A0E1A]/5 rounded-full border border-white/10 dark:border-[#0A0E1A]/10">
              Light taste
            </span>
            <span className="px-4 py-2 bg-white/5 dark:bg-[#0A0E1A]/5 rounded-full border border-white/10 dark:border-[#0A0E1A]/10">
              No excess sugar
            </span>
          </div>
        </motion.div>

        {/* Flavor Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {flavors.map((flavor, index) => (
            <motion.div
              key={flavor.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative rounded-[24px] overflow-hidden bg-white/5 dark:bg-[#0A0E1A]/5 backdrop-blur-sm border border-white/10 dark:border-[#0A0E1A]/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:border-white/20 dark:hover:border-[#0A0E1A]/20 transition-all duration-300">
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={flavor.image}
                    alt={`${flavor.name} flavor`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                  />
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  {/* Color accent overlay */}
                  <div
                    className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-all duration-300"
                    style={{
                      background: `linear-gradient(to top, ${flavor.color}40, transparent)`,
                    }}
                  ></div>
                </div>

                {/* Label */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-['Poppins',sans-serif] font-semibold text-[24px] text-white dark:text-[#0A0E1A] mb-2">
                    {flavor.name}
                  </h3>
                  <div
                    className="w-16 h-1 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                    style={{ backgroundColor: flavor.color }}
                  ></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}