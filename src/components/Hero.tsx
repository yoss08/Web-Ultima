import { motion } from "motion/react";
import { Link } from "react-router";

export function Hero() {
  const summaImage =
    "https://images.unsplash.com/photo-1767128890583-b3f8dc30bdbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWRlbCUyMHRlbm5pcyUyMHNwb3J0JTIwYWN0aW9ufGVufDF8fHx8MTc3MDExNjU1MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
  const almusImage =
    "https://images.unsplash.com/photo-1544198841-10f34f31f8dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3YXRlciUyMGRpc3BlbnNlciUyMG1hY2hpbmV8ZW58MXx8fHwxNzcwMTE2NTUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

  return (
    <section className="relative h-screen flex items-center justify-center px-6 lg:px-12 pt-24 pb-8 bg-gradient-to-br from-[#0A0E1A] via-[#0F1425] to-[#050810] dark:bg-gradient-to-br dark:from-white dark:via-gray-50 dark:to-gray-100 transition-colors duration-300 overflow-hidden">
      {/* Radial glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00E5FF]/10 dark:bg-[#00E5FF]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#39FF14]/10 dark:bg-[#39FF14]/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto w-full h-full flex flex-col justify-center relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <p className="font-['Poppins',sans-serif] text-[24px] lg:text-[32px] text-white/90 dark:text-[#0A0E1A]/90 tracking-wide">
            Choose Your Experience
          </p>
        </motion.div>

        {/* Two Cards */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 flex-1 max-h-[70vh]">
          {/* SUMMA Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-full"
          >
            <Link to="/summa" className="block group h-full">
              <div className="relative h-full rounded-[32px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.6)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:shadow-[0_25px_50px_rgba(57,255,20,0.4)] dark:hover:shadow-[0_25px_50px_rgba(57,255,20,0.3)] transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={summaImage}
                    alt="SUMMA - Padel Sports Dashboard"
                    className="w-full h-full object-cover brightness-[0.4] dark:brightness-[0.6] group-hover:brightness-[0.3] dark:group-hover:brightness-[0.5] group-hover:scale-110 transition-all duration-700"
                  />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent dark:from-black/80 dark:via-black/40 dark:to-transparent"></div>
                
                {/* Neon green glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#39FF14]/0 via-transparent to-transparent group-hover:from-[#39FF14]/20 dark:group-hover:from-[#39FF14]/15 transition-all duration-500"></div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-10">
                  {/* Name */}
                  <h2
                    className="font-['Playfair_Display',serif] font-bold text-[56px] lg:text-[64px] leading-[1] text-white mb-3 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
                    style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
                  >
                    SUMMA
                  </h2>

                  {/* Subtitle */}
                  <p className="font-['Poppins',sans-serif] text-[18px] lg:text-[20px] text-white/90 mb-4">
                    Padel Sports Dashboard
                  </p>

                  {/* Accent Bar with glow */}
                  <div className="w-24 h-1 bg-[#39FF14] rounded-full shadow-[0_0_12px_rgba(57,255,20,0.8)] group-hover:w-48 group-hover:shadow-[0_0_20px_rgba(57,255,20,1)] transition-all duration-500"></div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* ALMUS Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-full"
          >
            <Link to="/almus" className="block group h-full">
              <div className="relative h-full rounded-[32px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.6)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:shadow-[0_25px_50px_rgba(0,229,255,0.4)] dark:hover:shadow-[0_25px_50px_rgba(0,229,255,0.3)] transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={almusImage}
                    alt="ALMUS - Smart Dispenser Station"
                    className="w-full h-full object-cover brightness-[0.4] dark:brightness-[0.6] group-hover:brightness-[0.3] dark:group-hover:brightness-[0.5] group-hover:scale-110 transition-all duration-700"
                  />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent dark:from-black/80 dark:via-black/40 dark:to-transparent"></div>
                
                {/* Electric blue glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#00E5FF]/0 via-transparent to-transparent group-hover:from-[#00E5FF]/20 dark:group-hover:from-[#00E5FF]/15 transition-all duration-500"></div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-10">
                  {/* Name */}
                  <h2
                    className="font-['Playfair_Display',serif] font-bold text-[56px] lg:text-[64px] leading-[1] text-white mb-3 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
                    style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
                  >
                    ALMUS
                  </h2>

                  {/* Subtitle */}
                  <p className="font-['Poppins',sans-serif] text-[18px] lg:text-[20px] text-white/90 mb-4">
                    Smart Dispenser Station
                  </p>

                  {/* Accent Bar with glow */}
                  <div className="w-24 h-1 bg-[#00E5FF] rounded-full shadow-[0_0_12px_rgba(0,229,255,0.8)] group-hover:w-48 group-hover:shadow-[0_0_20px_rgba(0,229,255,1)] transition-all duration-500"></div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}