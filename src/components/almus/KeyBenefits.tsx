import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Droplets, TrendingUp, Users, Shield, Sparkles } from "lucide-react";

const benefits = [
  {
    icon: Droplets,
    title: "Encourages consistent hydration during training",
    description: "Keep members properly hydrated throughout their workout sessions",
  },
  {
    icon: Sparkles,
    title: "Low-calorie flavored beverages, no sugar overload",
    description: "Light, refreshing flavors without compromising health goals",
  },
  {
    icon: Users,
    title: "Enhances member satisfaction and retention",
    description: "Premium amenities that differentiate your facility",
  },
  {
    icon: Shield,
    title: "Reliable operation for high-traffic facilities",
    description: "Built for durability and consistent performance",
  },
  {
    icon: TrendingUp,
    title: "Clean, modern design adapted to professional spaces",
    description: "Seamlessly integrates with premium gym environments",
  },
];

function BenefitCard({ benefit, index }: { benefit: typeof benefits[0]; index: number }) {
  const Icon = benefit.icon;
  const cardRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  // Fade and slide up animation
  const opacity = useTransform(
    scrollYProgress,
    [0.2, 0.4, 0.6, 0.8],
    [0, 1, 1, 0]
  );
  
  const y = useTransform(
    scrollYProgress,
    [0.2, 0.4, 0.6, 0.8],
    [100, 0, 0, -100]
  );

  return (
    <div ref={cardRef} className="h-screen flex items-center justify-center">
      <motion.div
        style={{ opacity, y }}
        className="bg-white/5 dark:bg-[#0A0E1A]/5 backdrop-blur-sm border border-white/10 dark:border-[#0A0E1A]/10 p-12 rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.6)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.15)] max-w-xl w-full"
      >
        {/* Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#00E5FF]/20 border border-[#00E5FF]/40">
            <Icon className="w-10 h-10 text-[#00E5FF] drop-shadow-[0_0_12px_rgba(0,229,255,0.8)]" />
          </div>
        </div>

        {/* Content */}
        <h3 className="font-['Poppins',sans-serif] font-semibold text-[28px] text-white dark:text-[#0A0E1A] mb-4 leading-[1.3]">
          {benefit.title}
        </h3>
        <p className="font-['Poppins',sans-serif] text-[20px] leading-[1.7] text-white/70 dark:text-[#0A0E1A]/70">
          {benefit.description}
        </p>
      </motion.div>
    </div>
  );
}

export function KeyBenefits() {
  return (
    <section className="relative bg-gradient-to-b from-[#0A0E1A] via-[#0F1425] to-[#0A0E1A] dark:bg-gradient-to-b dark:from-white dark:via-gray-50 dark:to-white overflow-hidden transition-colors duration-300">
      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00E5FF]/5 dark:bg-[#00E5FF]/3 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 px-6 lg:px-20">
          {/* Left Column - Sticky Title */}
          <div className="lg:sticky lg:top-32 lg:self-start pt-24">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2
                className="font-['Playfair_Display',serif] font-bold text-[56px] lg:text-[64px] leading-[1.1] text-white dark:text-[#0A0E1A] drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] dark:drop-shadow-none mb-6"
                style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
              >
                Why choose ALMUS
              </h2>
              <div className="w-32 h-1.5 bg-[#00E5FF] rounded-full shadow-[0_0_16px_rgba(0,229,255,0.8)]"></div>
            </motion.div>
          </div>

          {/* Right Column - Scrolling Benefit Cards */}
          <div className="relative">
            {benefits.map((benefit, index) => (
              <BenefitCard key={benefit.title} benefit={benefit} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}