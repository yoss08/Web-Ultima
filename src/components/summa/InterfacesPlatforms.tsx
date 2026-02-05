import { motion } from "motion/react";
import { Monitor, Smartphone, Globe } from "lucide-react";

const platforms = [
  {
    icon: Monitor,
    title: "On-court display",
    description: "Live scoring visibility",
    details: "Large format displays show real-time scores visible to all players and spectators",
    image: "https://images.unsplash.com/photo-1728044993618-cf86c59147e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwc2NvcmVib2FyZCUyMGRpc3BsYXklMjBzY3JlZW58ZW58MXx8fHwxNzcwMTM5MjY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    icon: Smartphone,
    title: "Mobile application",
    description: "Match tracking",
    details: "Players and coaches access live scores, match history, and performance stats on mobile",
    image: "https://images.unsplash.com/photo-1761721576781-baaf47945242?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBzcG9ydHMlMjB0cmFja2luZ3xlbnwxfHx8fDE3NzAxMzkyNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    icon: Globe,
    title: "Web dashboard",
    description: "Facility management & analytics",
    details: "Centralized control panel for managing courts, viewing analytics, and exporting reports",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkYXNoYm9hcmQlMjBhbmFseXRpY3MlMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzcwMTM5MjY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
];

export function InterfacesPlatforms() {
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
            Interfaces & platforms
          </h2>
          <p className="font-['Poppins',sans-serif] text-[18px] lg:text-[20px] leading-[1.7] text-white/60 dark:text-[#0A0E1A]/60 max-w-2xl mx-auto">
            SUMMA is a complete ecosystem accessible from every touchpoint
          </p>
        </motion.div>

        {/* Platform Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {platforms.map((platform, index) => {
            const Icon = platform.icon;
            return (
              <motion.div
                key={platform.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-black dark:bg-white border border-white/10 dark:border-[#0A0E1A]/10 rounded-[20px] overflow-hidden hover:border-[#39FF14] dark:hover:border-[#39FF14] transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={platform.image}
                    alt={platform.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Green overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#39FF14]/10 to-transparent pointer-events-none"></div>
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/30">
                      <Icon className="w-7 h-7 text-[#39FF14]" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-['Poppins',sans-serif] font-bold text-[22px] text-white dark:text-[#0A0E1A] mb-2">
                    {platform.title}
                  </h3>

                  {/* Description */}
                  <p className="font-['Poppins',sans-serif] text-[14px] text-[#39FF14] mb-3">
                    {platform.description}
                  </p>

                  {/* Details */}
                  <p className="font-['Poppins',sans-serif] text-[14px] leading-[1.6] text-white/60 dark:text-[#0A0E1A]/60">
                    {platform.details}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}