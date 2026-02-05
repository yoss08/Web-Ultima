import { motion } from "motion/react";

const metrics = [
  {
    number: "99.9%",
    label: "Uptime reliability",
  },
  {
    number: "< 0.1s",
    label: "Score detection speed",
  },
  {
    number: "500+",
    label: "Facilities worldwide",
  },
  {
    number: "24/7",
    label: "Support available",
  },
];

export function KeyMetrics() {
  return (
    <section className="relative py-20 px-6 lg:px-20 bg-black dark:bg-white overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative bg-[#0F1425] dark:bg-gray-100 border border-white/10 dark:border-[#0A0E1A]/10 rounded-[20px] p-8 text-center"
            >
              {/* Number */}
              <h3
                className="font-['Playfair_Display',serif] font-bold text-[48px] text-[#39FF14] mb-2"
                style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
              >
                {metric.number}
              </h3>
              {/* Label */}
              <p className="font-['Poppins',sans-serif] text-[14px] text-white/70 dark:text-[#0A0E1A]/70 uppercase tracking-wider">
                {metric.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
