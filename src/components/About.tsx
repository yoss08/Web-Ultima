import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

const features = [
  "Built for professionals",
  "Privacy & reliability focused",
  "Scalable systems",
  "Future-ready infrastructure",
];

export function About() {
  return (
    <section
      id="about"
      className="relative py-24 px-6 lg:px-20 bg-gradient-to-b from-[#0F1425] via-[#0A0E1A] to-[#0F1425] dark:bg-gradient-to-b dark:from-white dark:via-gray-50 dark:to-white transition-colors duration-300 overflow-hidden"
    >
      {/* Radial glow */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#39FF14]/5 dark:bg-[#39FF14]/3 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Heading */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2
              className="font-['Playfair_Display',serif] font-bold text-[56px] lg:text-[64px] leading-[1.2] text-white dark:text-[#0A0E1A] drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] dark:drop-shadow-none"
              style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
            >
              Designed for real healthcare challenges
            </h2>
          </motion.div>

          {/* Right: Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-center gap-4 bg-white/5 dark:bg-[#0A0E1A]/5 backdrop-blur-sm border border-white/10 dark:border-[#0A0E1A]/10 p-6 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.4)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:bg-white/10 dark:hover:bg-[#0A0E1A]/10 hover:border-white/20 dark:hover:border-[#0A0E1A]/20 transition-all duration-300"
              >
                <CheckCircle2 className="w-6 h-6 text-[#39FF14] flex-shrink-0 drop-shadow-[0_0_8px_rgba(57,255,20,0.8)]" />
                <span className="font-['Poppins',sans-serif] text-[18px] text-white/90 dark:text-[#0A0E1A]/90">
                  {feature}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}