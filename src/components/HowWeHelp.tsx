import { motion } from "motion/react";
import { Pencil, Workflow, TrendingUp } from "lucide-react";

export function HowWeHelp() {
  const steps = [
    {
      icon: Pencil,
      title: "Design",
      description: "Human-centered healthcare systems",
    },
    {
      icon: Workflow,
      title: "Integrate",
      description: "Seamless deployment",
    },
    {
      icon: TrendingUp,
      title: "Optimize",
      description: "Continuous monitoring & improvement",
    },
  ];

  return (
    <section className="py-32 px-6 bg-[#111827]">
      <div className="max-w-6xl mx-auto">
        {/* Steps Flow */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16">
          {steps.map((step, index) => (
            <div key={step.title} className="flex items-center gap-12">
              {/* Step */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="text-center space-y-4"
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 backdrop-blur-xl border border-white/8 rounded-2xl text-[#3B82F6]">
                  <step.icon className="w-8 h-8" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-[#F9FAFB]">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-[#9CA3AF] text-sm max-w-[180px] mx-auto">
                  {step.description}
                </p>
              </motion.div>

              {/* Arrow */}
              {index < steps.length - 1 && (
                <div className="hidden md:block w-12 h-0.5 bg-white/10"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
