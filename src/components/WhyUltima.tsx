import { motion } from "motion/react";
import { CheckCircle } from "lucide-react";

export function WhyUltima() {
  const features = [
    "Built for professionals",
    "Privacy & reliability focused",
    "Scalable systems",
    "Future-ready infrastructure",
  ];

  return (
    <section className="py-24 px-6 lg:px-20 bg-[#F5F5F5] dark:bg-[#0B0F14] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Title */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2
              className="font-['Playfair_Display',serif] font-bold text-[72px] leading-[80px] text-[#0f172b] dark:text-[#F9FAFB]"
              style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
            >
              Designed for
              <br />
              real healthcare
              <br />
              challenges
            </h2>
          </motion.div>

          {/* Right: Features */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-100 dark:border-white/10 px-6 py-5 rounded-[16px] shadow-[0px_4px_12px_rgba(0,0,0,0.06)] hover:shadow-[0px_8px_20px_rgba(0,0,0,0.1)] hover:scale-[1.02] transition-all duration-300 flex items-center gap-4">
                  <CheckCircle className="w-6 h-6 text-[#10B981] flex-shrink-0" />
                  <span className="font-['Poppins',sans-serif] text-[16px] leading-[24px] text-[#374151] dark:text-[#E5E7EB]">
                    {feature}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
