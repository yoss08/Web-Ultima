import { motion } from "motion/react";

const environments = [
  {
    title: "Gyms & fitness centers",
    image:
      "https://images.unsplash.com/photo-1765728617805-b9f22d64e5b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBneW0lMjB0cmFpbmluZyUyMGNlbnRlcnxlbnwxfHx8fDE3NzAxMjA5Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    title: "Training facilities",
    image:
      "https://images.unsplash.com/photo-1710814824560-943273e8577e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwY2VudGVyJTIwcHJvZmVzc2lvbmFsJTIwZXF1aXBtZW50fGVufDF8fHx8MTc3MDEyMDk4MHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    title: "Sports clubs",
    image:
      "https://images.unsplash.com/photo-1761775446030-5e1fdd4166a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjbHViJTIwZmFjaWxpdHl8ZW58MXx8fHwxNzcwMTA2NDk4fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    title: "Wellness spaces",
    image:
      "https://images.unsplash.com/photo-1717500252010-d708ec89a0a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMHNwYSUyMGZhY2lsaXR5JTIwbW9kZXJufGVufDF8fHx8MTc3MDEyMDk4MHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

export function WhereAlmusFits() {
  return (
    <section className="relative py-24 px-6 lg:px-20 bg-gradient-to-b from-[#0F1425] to-[#0A0E1A] dark:bg-gradient-to-b dark:from-white dark:to-gray-50 overflow-hidden transition-colors duration-300">
      {/* Subtle glow */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-[#00E5FF]/5 dark:bg-[#00E5FF]/3 rounded-full blur-[120px] pointer-events-none"></div>

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
            className="font-['Playfair_Display',serif] font-bold text-[48px] lg:text-[56px] leading-[1.1] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] mb-4"
            style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
          >
            Built for active environments
          </h2>
          <p className="font-['Poppins',sans-serif] text-[18px] text-white/70 max-w-2xl mx-auto">
            ALMUS integrates seamlessly into professional facilities where
            performance and member experience matter.
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
              <div className="relative h-80 rounded-[24px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.6)] hover:shadow-[0_12px_48px_rgba(0,229,255,0.3)] transition-all duration-500">
                {/* Image */}
                <img
                  src={env.image}
                  alt={env.title}
                  className="w-full h-full object-cover brightness-[0.5] group-hover:brightness-[0.4] group-hover:scale-110 transition-all duration-700"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

                {/* Blue accent on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#00E5FF]/0 via-transparent to-transparent group-hover:from-[#00E5FF]/20 transition-all duration-500"></div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-['Poppins',sans-serif] font-semibold text-[22px] text-white mb-2">
                    {env.title}
                  </h3>
                  <div className="w-16 h-1 bg-[#00E5FF] rounded-full shadow-[0_0_12px_rgba(0,229,255,0.8)] group-hover:w-24 transition-all duration-500"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}