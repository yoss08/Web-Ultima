import { motion } from "motion/react";

export function Glance() {
  const cards = [
    "Healthcare-focused technology company",
    "Smart products for modern environments",
    "Innovation driven by real needs",
  ];

  return (
    <section className="py-24 px-6 bg-[#F5F5F5] dark:bg-[#111827] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-['Playfair_Display',serif] font-bold text-[72px] leading-[75px] text-[#0f172b] dark:text-[#F9FAFB] text-center mb-20"
          style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
        >
          ULTIMA at a glance
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((text, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-100 dark:border-white/10 px-8 py-10 rounded-[24px] shadow-[0px_10px_20px_rgba(0,0,0,0.08)] hover:shadow-[0px_20px_30px_rgba(0,0,0,0.12)] hover:scale-[1.02] transition-all duration-300">
                <p className="font-['Poppins',sans-serif] text-[18px] leading-[28px] text-[#374151] dark:text-[#E5E7EB] text-center">
                  {text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}