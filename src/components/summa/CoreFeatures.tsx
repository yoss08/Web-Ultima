import { motion } from "motion/react";
import { Activity, Zap, LayoutDashboard, Smartphone, Shield } from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Real-time match scoring",
    description: "Live score updates visible to players and spectators instantly",
  },
  {
    icon: Zap,
    title: "Automatic score detection",
    description: "Smart sensors capture every point without manual input",
  },
  {
    icon: LayoutDashboard,
    title: "Court and match management",
    description: "Centralized control of all courts from a single dashboard",
  },
  {
    icon: Smartphone,
    title: "Multi-platform access",
    description: "View scores on displays, mobile devices, and web platforms",
  },
  {
    icon: Shield,
    title: "Reliable performance",
    description: "Built for high-traffic facilities with consistent uptime",
  },
];

export function CoreFeatures() {
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
            className="font-['Playfair_Display',serif] font-bold text-[48px] lg:text-[56px] leading-[1.1] text-white dark:text-[#0A0E1A] mb-6"
            style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
          >
            Core features
          </h2>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-black dark:bg-white backdrop-blur-sm border border-white/10 dark:border-[#0A0E1A]/10 p-10 rounded-[20px] hover:border-[#39FF14] dark:hover:border-[#39FF14] transition-all duration-300"
              >
                {/* Icon */}
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/30">
                    <Icon className="w-7 h-7 text-[#39FF14]" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-['Poppins',sans-serif] font-semibold text-[20px] text-white dark:text-[#0A0E1A] mb-3 leading-[1.3]">
                  {feature.title}
                </h3>
                <p className="font-['Poppins',sans-serif] text-[15px] leading-[1.6] text-white/60 dark:text-[#0A0E1A]/60">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}