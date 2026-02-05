import { motion } from "motion/react";
import { Building2, FlaskConical, Heart, Users } from "lucide-react";

export function UseCases() {
  const cases = [
    {
      icon: Building2,
      title: "Hospitals",
      description: "Critical care & acute environments",
    },
    {
      icon: FlaskConical,
      title: "Clinics",
      description: "Modern outpatient facilities",
    },
    {
      icon: Heart,
      title: "Care centers",
      description: "Long-term & assisted living",
    },
    {
      icon: Users,
      title: "Public health spaces",
      description: "Community wellness centers",
    },
  ];

  return (
    <section className="py-32 px-6 bg-[#0B0F14]">
      <div className="max-w-5xl mx-auto">
        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {cases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="text-center space-y-4"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-14 h-14 bg-white/5 backdrop-blur-xl border border-white/8 rounded-xl text-[#3B82F6]">
                <useCase.icon className="w-7 h-7" strokeWidth={1.5} />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-[#F9FAFB]">
                {useCase.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-[#9CA3AF]">
                {useCase.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
