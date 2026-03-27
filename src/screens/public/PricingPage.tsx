import { motion } from "framer-motion";
import { Check, X, Star, Zap, Crown, ArrowRight } from "lucide-react";
import { Link } from "react-router";

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  icon: typeof Star;
  color: string;
  popular?: boolean;
  features: { name: string; included: boolean }[];
}

const plans: Plan[] = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Perfect for trying out ULTIMA's smart courts.",
    icon: Star,
    color: "#888",
    features: [
      { name: "Court booking (limited hours)", included: true },
      { name: "Basic match scorekeeping", included: true },
      { name: "View personal stats", included: true },
      { name: "Access to community events", included: true },
      { name: "ALMUS advanced analytics", included: false },
      { name: "PersonaVision video replay", included: false },
      { name: "AI coaching recommendations", included: false },
      { name: "Priority court booking", included: false },
      { name: "Coach assignment", included: false },
    ],
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For serious players who want full analytics.",
    icon: Zap,
    color: "#39FF14",
    popular: true,
    features: [
      { name: "Unlimited court booking", included: true },
      { name: "Full ALMUS match analytics", included: true },
      { name: "Detailed performance stats", included: true },
      { name: "Competition registration", included: true },
      { name: "PersonaVision video replay", included: true },
      { name: "AI coaching recommendations", included: true },
      { name: "Priority court booking", included: true },
      { name: "Coach assignment", included: false },
      { name: "Custom training plans", included: false },
    ],
  },
  {
    name: "Elite",
    price: "$59",
    period: "/month",
    description: "Full access with personal coaching and AI training.",
    icon: Crown,
    color: "#FFD700",
    features: [
      { name: "Everything in Pro", included: true },
      { name: "Personal coach assignment", included: true },
      { name: "Custom AI training plans", included: true },
      { name: "Video annotation by coach", included: true },
      { name: "Progress reports (weekly)", included: true },
      { name: "Early access to competitions", included: true },
      { name: "Guest passes (2/month)", included: true },
      { name: "Exclusive member events", included: true },
      { name: "1-on-1 performance review", included: true },
    ],
  },
];

const courtRates = [
  { type: "Indoor Court", peak: "$40/hr", offPeak: "$25/hr", member: "$15/hr" },
  { type: "Outdoor Court", peak: "$30/hr", offPeak: "$18/hr", member: "$10/hr" },
  { type: "Premium Smart Court", peak: "$55/hr", offPeak: "$35/hr", member: "$22/hr" },
];

export function PricingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E1A] text-[#0A0E1A] dark:text-white">
      {/* Hero */}
      <section className="py-28 px-6 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#39FF14]/5 via-transparent to-transparent" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-[#39FF14] text-sm font-black uppercase tracking-[0.3em] mb-4">Pricing</p>
          <h1 className="font-['Playfair_Display',serif] text-5xl md:text-7xl font-black mb-6">
            Plans For Every <span className="text-[#39FF14]">Player</span>
          </h1>
          <p className="opacity-60 text-lg font-['Poppins']">
            Choose the plan that matches your ambition. Upgrade or downgrade anytime.
          </p>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative bg-gray-50 dark:bg-white/5 rounded-[32px] border overflow-hidden flex flex-col ${
                  plan.popular
                    ? "border-[#39FF14]/40 shadow-xl shadow-[#39FF14]/10 scale-[1.02]"
                    : "border-gray-100 dark:border-white/10"
                }`}
              >
                {plan.popular && (
                  <div className="bg-[#39FF14] text-black text-xs font-black uppercase tracking-widest text-center py-2">
                    Most Popular
                  </div>
                )}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${plan.color}15` }}>
                      <Icon size={20} style={{ color: plan.color }} />
                    </div>
                    <h3 className="text-xl font-black">{plan.name}</h3>
                  </div>

                  <div className="mb-2">
                    <span className="text-4xl font-black">{plan.price}</span>
                    <span className="text-sm opacity-40">{plan.period}</span>
                  </div>
                  <p className="text-sm opacity-50 mb-8 font-['Poppins']">{plan.description}</p>

                  <div className="space-y-3 flex-1">
                    {plan.features.map((f) => (
                      <div key={f.name} className="flex items-center gap-3">
                        {f.included ? (
                          <Check size={16} className="text-[#39FF14] flex-shrink-0" />
                        ) : (
                          <X size={16} className="opacity-20 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${f.included ? "opacity-80" : "opacity-30 line-through"}`}>
                          {f.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/signup"
                    className={`mt-8 w-full h-14 rounded-2xl font-black flex items-center justify-center gap-2 transition-all ${
                      plan.popular
                        ? "bg-[#39FF14] text-black shadow-lg shadow-[#39FF14]/20 hover:scale-105"
                        : "bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/15"
                    }`}
                  >
                    Get Started <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Court Rental Rates */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-white/[0.02]">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-['Playfair_Display',serif] text-3xl md:text-4xl font-black text-center mb-3">
            Court <span className="text-[#39FF14]">Rental Rates</span>
          </h2>
          <p className="text-center opacity-50 mb-10 font-['Poppins']">Pay-as-you-go court booking rates</p>

          <div className="bg-white dark:bg-white/5 rounded-[28px] border border-gray-200 dark:border-white/10 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/10">
                  <th className="text-left p-5 text-sm font-black uppercase tracking-wider opacity-40">Court Type</th>
                  <th className="text-center p-5 text-sm font-black uppercase tracking-wider opacity-40">Peak</th>
                  <th className="text-center p-5 text-sm font-black uppercase tracking-wider opacity-40">Off-Peak</th>
                  <th className="text-center p-5 text-sm font-black uppercase tracking-wider text-[#39FF14]">Member</th>
                </tr>
              </thead>
              <tbody>
                {courtRates.map((rate) => (
                  <tr key={rate.type} className="border-b border-gray-50 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="p-5 font-bold">{rate.type}</td>
                    <td className="p-5 text-center font-mono">{rate.peak}</td>
                    <td className="p-5 text-center font-mono">{rate.offPeak}</td>
                    <td className="p-5 text-center font-mono text-[#39FF14] font-bold">{rate.member}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-xs opacity-30 mt-4 font-['Poppins']">
            Peak hours: Mon–Fri 5PM–10PM, Weekends 9AM–6PM. Member rates require active Pro or Elite subscription.
          </p>
        </div>
      </section>

      {/* FAQ CTA */}
      <section className="py-20 px-6 text-center">
        <h2 className="font-['Playfair_Display',serif] text-3xl font-black mb-4">
          Questions? <span className="text-[#39FF14]">We're here.</span>
        </h2>
        <p className="opacity-50 mb-8 font-['Poppins']">Contact us for custom enterprise plans or group rates.</p>
        <Link to="/about" className="px-8 py-4 bg-[#39FF14] text-black font-black rounded-2xl hover:scale-105 transition-transform inline-flex items-center gap-2 shadow-lg shadow-[#39FF14]/20">
          Contact Us <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
