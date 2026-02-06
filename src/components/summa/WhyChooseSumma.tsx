import { motion } from "motion/react";
import { Users, AlertCircle, Sliders, Award, Zap } from "lucide-react";

const benefits = [
  {
    icon: Users,
    title: "Enhances player experience",
    description: "Real-time visibility and accurate scoring create professional-grade gameplay",
  },
  {
    icon: AlertCircle,
    title: "Reduces manual scoring errors",
    description: "Automated detection eliminates human mistakes and disputes",
  },
  {
    icon: Sliders,
    title: "Simplifies facility management",
    description: "Centralized control of all courts from a single dashboard",
  },
  {
    icon: Award,
    title: "Designed for professional environments",
    description: "Premium quality system that elevates your facility's reputation",
  },
  {
    icon: Zap,
    title: "Built for intensive daily use",
    description: "Reliable hardware and software engineered for high-traffic operations",
  },
];

export function WhyChooseSumma() {
  const athleteImage =
    "/assets/images/athleteimage.avif";

  return (
    <section className="relative py-24 px-6 lg:px-20 bg-black dark:bg-white overflow-hidden transition-colors duration-300">
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
            Why choose SUMMA
          </h2>
          <p className="font-['Poppins',sans-serif] text-[16px] leading-[1.7] text-white/60 dark:text-[#0A0E1A]/60 max-w-3xl mx-auto">
            A complete scoring solution designed for professional sports facilities that demand accuracy, reliability, and seamless operation
          </p>
        </motion.div>

        {/* Large Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-[#1A1A1A] dark:bg-gray-100 border border-white/10 dark:border-[#0A0E1A]/10 rounded-[32px] overflow-hidden"
        >
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left Side - Benefits List */}
            <div className="p-12 lg:p-16 flex flex-col justify-center">
              <div className="space-y-8">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <motion.div
                      key={benefit.title}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="flex gap-4"
                    >
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-[#39FF14] flex items-center justify-center">
                          <Icon className="w-6 h-6 text-black" />
                        </div>
                      </div>

                      {/* Content */}
                      <div>
                        <h3 className="font-['Poppins',sans-serif] font-semibold text-[18px] text-white dark:text-[#0A0E1A] mb-1 leading-[1.3]">
                          {benefit.title}
                        </h3>
                        <p className="font-['Poppins',sans-serif] text-[14px] leading-[1.6] text-white/60 dark:text-[#0A0E1A]/60">
                          {benefit.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Right Side - Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[400px] lg:h-auto"
            >
              <img
                src={athleteImage}
                alt="Professional athlete"
                className="w-full h-full object-cover"
              />
              {/* Green overlay */}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#1A1A1A]/20 dark:to-gray-100/20"></div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
