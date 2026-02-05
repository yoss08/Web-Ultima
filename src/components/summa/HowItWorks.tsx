import { motion } from "motion/react";
import { Play, RefreshCw, MonitorPlay } from "lucide-react";

const steps = [
  {
    icon: Play,
    title: "Match starts on the court",
    number: "01",
  },
  {
    icon: RefreshCw,
    title: "Score updates automatically",
    number: "02",
  },
  {
    icon: MonitorPlay,
    title: "Data displayed across all platforms",
    number: "03",
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-24 px-6 lg:px-20 bg-black dark:bg-white overflow-hidden transition-colors duration-300">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2
            className="font-['Playfair_Display',serif] font-bold text-[48px] lg:text-[56px] leading-[1.1] text-white dark:text-[#0A0E1A] mb-6"
            style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
          >
            How it works
          </h2>
        </motion.div>

        {/* Steps Timeline */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative bg-[#0F1425] dark:bg-gray-100 border border-white/10 dark:border-[#0A0E1A]/10 rounded-[20px] p-10 text-center"
              >
                {/* Number */}
                <div className="mb-6">
                  <span className="font-['Playfair_Display',serif] font-bold text-[72px] text-[#39FF14]/20 dark:text-[#39FF14]/20">
                    {step.number}
                  </span>
                </div>

                {/* Icon */}
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/30">
                    <Icon className="w-8 h-8 text-[#39FF14]" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-['Poppins',sans-serif] font-semibold text-[18px] text-white dark:text-[#0A0E1A] leading-[1.4]">
                  {step.title}
                </h3>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}