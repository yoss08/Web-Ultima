import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, Cpu, Code, Briefcase, Zap, Award, Rocket, Users, Globe } from "lucide-react";

type Category = "all" | "hardware" | "software" | "business";

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  category: Category;
  icon: typeof Cpu;
  details: string;
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  hardware: { bg: "bg-[#00E5FF]/10", text: "text-[#00E5FF]", border: "border-[#00E5FF]/30" },
  software: { bg: "bg-[#39FF14]/10", text: "text-[#39FF14]", border: "border-[#39FF14]/30" },
  business: { bg: "bg-[#FFD700]/10", text: "text-[#FFD700]", border: "border-[#FFD700]/30" },
};

const events: TimelineEvent[] = [
  {
    year: "2019", title: "The Idea is Born", category: "business", icon: Rocket,
    description: "ULTIMA is founded with the vision of smart sports technology.",
    details: "A small team of engineers and athletes come together with a shared vision: using technology to democratize performance analytics in racquet sports."
  },
  {
    year: "2020", title: "ALMUS v1 Prototype", category: "hardware", icon: Cpu,
    description: "First prototype of the ALMUS scoring system completed.",
    details: "The first hardware prototype integrates sensors and cameras capable of tracking ball position and scoring matches automatically. Tested on 2 courts."
  },
  {
    year: "2021", title: "SUMMA Analytics Platform", category: "software", icon: Code,
    description: "Launch of the SUMMA data analytics and scoring platform.",
    details: "SUMMA goes live, providing players with detailed match statistics including shot placement, speed, and movement patterns. Web dashboard released."
  },
  {
    year: "2021", title: "First Major Partnership", category: "business", icon: Briefcase,
    description: "Partnership with top sports facility operators.",
    details: "ULTIMA partners with major court operators, expanding deployment to 6 locations. Revenue model validated with subscription-based services."
  },
  {
    year: "2022", title: "PersonaVision AI", category: "software", icon: Zap,
    description: "AI-powered player recognition system launched.",
    details: "PersonaVision uses computer vision to automatically identify players, track their movements, and generate personalized performance reports without manual input."
  },
  {
    year: "2022", title: "Innovation Award", category: "business", icon: Award,
    description: "Winner of the Sports Technology Innovation Award.",
    details: "ULTIMA receives recognition for its contribution to sports technology innovation, validating years of R&D and on-court testing."
  },
  {
    year: "2023", title: "ALMUS v2 — Smart Courts", category: "hardware", icon: Cpu,
    description: "Next-gen hardware with integrated IoT and real-time scoring.",
    details: "ALMUS v2 features improved sensors, real-time WebSocket streaming, automatic calibration, and support for multiple simultaneous matches on networked courts."
  },
  {
    year: "2024", title: "Global Expansion", category: "business", icon: Globe,
    description: "ULTIMA expands to international markets with 12+ locations.",
    details: "Launching in new territories, ULTIMA partners with sports academies and national federations to bring smart court technology to a global audience."
  },
  {
    year: "2025", title: "AI Coach & Recommendations", category: "software", icon: Users,
    description: "AI-driven coaching recommendations and training plans.",
    details: "Machine learning models analyze player weaknesses and automatically generate personalized training recommendations, drill sequences, and improvement timelines."
  },
];

export function TimelinePage() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [filter, setFilter] = useState<Category>("all");

  const filtered = filter === "all" ? events : events.filter(e => e.category === filter);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E1A] text-[#0A0E1A] dark:text-white">
      {/* Hero */}
      <section className="relative py-28 px-6 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#39FF14]/5 via-transparent to-transparent" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-[#39FF14] font-black text-sm uppercase tracking-[0.3em] mb-4">Our Journey</p>
          <h1 className="font-['Playfair_Display',serif] text-5xl md:text-7xl font-black mb-6">
            Technology <span className="text-[#39FF14]">Timeline</span>
          </h1>
          <p className="opacity-60 text-lg font-['Poppins']">
            From first prototype to global expansion — explore the milestones that shaped ULTIMA.
          </p>
        </div>
      </section>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-3 mb-16 px-6 flex-wrap">
        {(["all", "hardware", "software", "business"] as Category[]).map(cat => (
          <button
            key={cat} onClick={() => setFilter(cat)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all capitalize ${
              filter === cat
                ? "bg-[#39FF14] text-black shadow-lg shadow-[#39FF14]/20"
                : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/50 hover:bg-gray-200 dark:hover:bg-white/10"
            }`}
          >
            {cat === "all" ? "All" : cat}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <section className="max-w-3xl mx-auto px-6 pb-28">
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#39FF14] via-[#00E5FF] to-[#FFD700] opacity-20" />

          {filtered.map((event, i) => {
            const colors = categoryColors[event.category];
            const isExpanded = expanded === i;
            const Icon = event.icon;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className={`relative pl-16 md:pl-0 mb-10 ${
                  i % 2 === 0 ? "md:pr-[52%]" : "md:pl-[52%]"
                }`}
              >
                {/* Dot on line */}
                <div className={`absolute left-4 md:left-1/2 md:-translate-x-1/2 top-6 w-5 h-5 rounded-full border-2 ${colors.border} ${colors.bg} z-10`} />

                {/* Card */}
                <div
                  onClick={() => setExpanded(isExpanded ? null : i)}
                  className={`bg-gray-50 dark:bg-white/5 p-6 rounded-[24px] border border-gray-100 dark:border-white/10 hover:border-[#39FF14]/20 transition-all cursor-pointer ${colors.border}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-2.5 rounded-xl ${colors.bg} flex-shrink-0`}>
                        <Icon size={18} className={colors.text} />
                      </div>
                      <div>
                        <span className={`text-xs font-black uppercase tracking-wider ${colors.text}`}>{event.year} · {event.category}</span>
                        <h3 className="text-lg font-black mt-1">{event.title}</h3>
                        <p className="text-sm opacity-60 mt-1 font-['Poppins']">{event.description}</p>
                      </div>
                    </div>
                    <ChevronDown size={18} className={`opacity-40 transition-transform flex-shrink-0 mt-1 ${isExpanded ? "rotate-180" : ""}`} />
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10"
                    >
                      <p className="text-sm opacity-70 leading-relaxed font-['Poppins']">{event.details}</p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
