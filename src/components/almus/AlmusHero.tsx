import { motion } from "motion/react";

export function AlmusHero() {
  const productImage =
    "https://images.unsplash.com/photo-1759882609566-cb5a7eff6813?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3YXRlciUyMGRpc3BlbnNlciUyMG1hY2hpbmUlMjBneW18ZW58MXx8fHwxNzcwMTIwODU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

  const scrollToContact = () => {
    const element = document.getElementById("almus-cta");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center bg-[#0A0E1A] dark:bg-white overflow-hidden transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto w-full px-8 lg:px-12 pt-20 pb-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center h-full">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Title */}
            <div className="space-y-4">
              <h1
                className="font-['Playfair_Display',serif] font-bold text-[80px] leading-[0.9] text-white dark:text-[#0A0E1A]"
                style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
              >
                ALMUS
              </h1>
              <div className="w-32 h-[6px] bg-[#00E5FF] dark:bg-[#00E5FF] rounded-full"></div>
            </div>

            {/* Subtitle */}
            <h2 className="font-['Poppins',sans-serif] text-[24px] text-white dark:text-[#0A0E1A] font-normal">
              Smart Hydration Station
            </h2>

            {/* Description */}
            <p className="font-['Poppins',sans-serif] text-[16px] leading-[1.8] text-white/60 dark:text-[#0A0E1A]/60 max-w-lg">
              ALMUS delivers flavored, low-calorie beverages designed to support
              hydration, recovery, and performance in active environments.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={scrollToContact}
                className="bg-[#00E5FF] hover:bg-[#00D4E6] dark:bg-[#00E5FF] dark:hover:bg-[#00D4E6] h-[56px] px-10 rounded-full hover:scale-[1.02] transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[15px] text-black dark:text-black"
              >
                Request a quote
              </button>
              <button
                onClick={scrollToContact}
                className="bg-transparent hover:bg-white/5 dark:hover:bg-black/5 h-[56px] px-10 rounded-full border-2 border-white/30 dark:border-[#0A0E1A]/30 hover:border-white/50 dark:hover:border-[#0A0E1A]/50 transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[15px] text-white dark:text-[#0A0E1A]"
              >
                Contact ULTIMA
              </button>
            </div>
          </motion.div>

          {/* Right: Product Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[500px] lg:h-[550px] flex items-center justify-center"
          >
            <div className="relative rounded-[32px] overflow-hidden w-full h-full shadow-[0_20px_60px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
              <img
                src={productImage}
                alt="ALMUS Smart Hydration Station"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}