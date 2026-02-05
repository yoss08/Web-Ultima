import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, ChevronLeft } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Select a flavor",
    description: "Choose from multiple light, refreshing options",
  },
  {
    number: "02",
    title: "Dispense the drink",
    description: "Quick, clean dispensing with precise mixing",
  },
  {
    number: "03",
    title: "Hydrate and recover",
    description: "Enjoy low-calorie hydration during or after training",
  },
];

export function HowItWorks() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <section className="relative py-24 px-6 lg:px-20 bg-gradient-to-b from-[#0F1425] via-[#0A0E1A] to-[#0F1425] dark:bg-gradient-to-b dark:from-gray-50 dark:via-white dark:to-gray-50 overflow-hidden transition-colors duration-300">
      {/* Radial glow */}
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-[#00E5FF]/5 dark:bg-[#00E5FF]/3 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2
            className="font-['Playfair_Display',serif] font-bold text-[56px] leading-[1.1] text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)] mb-4"
            style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
          >
            How it works
          </h2>
          <div className="w-32 h-1 bg-[#00E5FF] rounded-full shadow-[0_0_12px_rgba(0,229,255,0.8)] mx-auto"></div>
        </motion.div>

        {/* Step Card Container */}
        <div className="relative min-h-[400px] flex items-center justify-center">
          {/* Previous Button */}
          {currentStep > 0 && (
            <motion.button
              onClick={handlePrevious}
              className="absolute left-0 lg:left-20 top-1/2 -translate-y-1/2 size-16 rounded-full border-2 border-[#00E5FF] bg-transparent flex items-center justify-center hover:bg-[#00E5FF]/10 transition-all duration-300 group z-10"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-6 h-6 text-[#00E5FF] group-hover:translate-x-[-2px] transition-transform duration-300" />
            </motion.button>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              {/* Card */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-12 w-[525px] min-h-[246px] relative">
                {/* Number Circle */}
                <div className="absolute left-6 top-12">
                  <div className="relative size-32">
                    {/* Glow */}
                    <div className="absolute inset-0 bg-[#00E5FF]/10 rounded-full blur-[24px]"></div>
                    
                    {/* Circle with gradient border */}
                    <div 
                      className="absolute inset-0 rounded-full p-px flex items-center justify-center"
                      style={{ backgroundImage: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)" }}
                    >
                      <div className="absolute inset-0 border border-white/20 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)] pointer-events-none" />
                      <p className="font-['Poppins',sans-serif] font-bold text-[64px] text-[#00E5FF] leading-none">
                        {currentStepData.number}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div className="ml-44 pt-6">
                  <h3 className="font-['Poppins',sans-serif] font-semibold text-[22px] text-white mb-3 text-center">
                    {currentStepData.title}
                  </h3>
                  <p className="font-['Poppins',sans-serif] text-[16px] leading-[1.6] text-white/60 text-center max-w-[216px] mx-auto">
                    {currentStepData.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Next Button */}
          {currentStep < steps.length - 1 && (
            <motion.button
              onClick={handleNext}
              className="absolute right-0 lg:right-20 top-1/2 -translate-y-1/2 size-16 rounded-full border-2 border-[#00E5FF] bg-transparent flex items-center justify-center hover:bg-[#00E5FF]/10 transition-all duration-300 group z-10"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-6 h-6 text-[#00E5FF] group-hover:translate-x-[2px] transition-transform duration-300" />
            </motion.button>
          )}
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center gap-3 mt-12">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? "bg-[#00E5FF] w-8 shadow-[0_0_12px_rgba(0,229,255,0.8)]"
                  : "bg-white/20 w-3 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}