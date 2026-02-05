import { motion } from "motion/react";

const environments = [
  {
    title: "Padel clubs",
    image:
      "https://images.unsplash.com/photo-1693517235862-a1b8c3323efb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWRlbCUyMGNvdXJ0JTIwc3BvcnQlMjBmYWNpbGl0eSUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzAxMzkxNjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    title: "Sports and fitness centers",
    image:
      "https://images.unsplash.com/photo-1682241367368-6387d5d4921a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBmaXRuZXNzJTIwY2VudGVyJTIwZ3ltfGVufDF8fHx8MTc3MDEzOTMzM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    title: "Training academies",
    image:
      "https://images.unsplash.com/photo-1761039807688-f5b154a8827a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFpbmluZyUyMGFjYWRlbXklMjBzcG9ydHN8ZW58MXx8fHwxNzcwMTM5MzM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    title: "Competition venues",
    image:
      "https://images.unsplash.com/photo-1765261176106-6076a63ee433?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wZXRpdGlvbiUyMHNwb3J0cyUyMHZlbnVlJTIwc3RhZGl1bXxlbnwxfHx8fDE3NzAxMzkzMzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
];

export function WhereSummaFits() {
  return (
    <section className="relative py-24 px-6 lg:px-20 bg-[#0A0E1A] dark:bg-gray-50 overflow-hidden transition-colors duration-300">
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
            className="font-['Playfair_Display',serif] font-bold text-[48px] lg:text-[56px] leading-[1.1] text-white dark:text-[#0A0E1A] mb-4"
            style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
          >
            Where SUMMA fits
          </h2>
          <p className="font-['Poppins',sans-serif] text-[18px] lg:text-[20px] leading-[1.7] text-white/60 dark:text-[#0A0E1A]/60 max-w-2xl mx-auto">
            Built for professional sports environments that demand precision and reliability
          </p>
        </motion.div>

        {/* Environment Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {environments.map((env, index) => (
            <motion.div
              key={env.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative rounded-[20px] overflow-hidden bg-black dark:bg-white border border-white/10 dark:border-[#0A0E1A]/10 hover:border-[#39FF14] dark:hover:border-[#39FF14] transition-all duration-300">
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={env.image}
                    alt={env.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                  {/* Green accent overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#39FF14]/0 group-hover:from-[#39FF14]/10 to-transparent transition-all duration-300"></div>
                </div>

                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-['Poppins',sans-serif] font-semibold text-[18px] text-white leading-[1.3]">
                    {env.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}