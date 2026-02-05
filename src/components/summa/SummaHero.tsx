import { motion } from "motion/react";

export function SummaHero() {
  const scrollToContact = () => {
    const contactSection = document.getElementById("summa-cta");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const padelCourtImage =
    "https://images.unsplash.com/photo-1693517235862-a1b8c3323efb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWRlbCUyMGNvdXJ0JTIwc3BvcnQlMjBmYWNpbGl0eSUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzAxMzkxNjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black dark:bg-white overflow-hidden transition-colors duration-300">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={padelCourtImage}
          alt="SUMMA Smart Scoring System"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black"></div>
      </div>

      <div className="max-w-[1200px] mx-auto w-full px-8 lg:px-12 pt-32 pb-16 relative z-10">
        <div className="text-center space-y-8">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1
              className="font-['Playfair_Display',serif] font-bold text-[100px] lg:text-[120px] leading-[0.9] text-white dark:text-[#0A0E1A] mb-4"
              style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
            >
              SUMMA
            </h1>
            <div className="w-40 h-[6px] bg-[#39FF14] dark:bg-[#39FF14] rounded-full shadow-[0_0_20px_rgba(57,255,20,0.8)] mx-auto mb-8"></div>
          </motion.div>

          {/* Subtitle */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-['Poppins',sans-serif] text-[28px] text-white/90 dark:text-[#0A0E1A]/90 font-light tracking-wide"
          >
            Smart Scoring & Facility System
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-['Poppins',sans-serif] text-[18px] leading-[1.8] text-white/60 dark:text-[#0A0E1A]/60 max-w-2xl mx-auto"
          >
            An intelligent scoring and facility management system designed for
            padel courts and professional sports environments
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 pt-4"
          >
            <button
              onClick={scrollToContact}
              className="bg-[#39FF14] hover:bg-[#32E012] dark:bg-[#39FF14] dark:hover:bg-[#32E012] h-[60px] px-12 rounded-full hover:scale-[1.02] transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[16px] text-black dark:text-black shadow-[0_0_20px_rgba(57,255,20,0.6)]"
            >
              Request a demo
            </button>
            <button
              onClick={scrollToContact}
              className="bg-transparent hover:bg-white/10 dark:hover:bg-black/5 h-[60px] px-12 rounded-full border-2 border-white/40 dark:border-[#0A0E1A]/40 hover:border-[#39FF14] dark:hover:border-[#39FF14] transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[16px] text-white dark:text-[#0A0E1A]"
            >
              Contact sales
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
