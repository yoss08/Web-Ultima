import { motion } from "motion/react";
import { useState } from "react";

export function FinalCTA() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Quote request submitted:", formData);
    alert("Thank you for your interest. Our sales team will contact you shortly.");
    setFormData({ name: "", company: "", email: "", phone: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section
      id="almus-cta"
      className="relative py-24 px-6 lg:px-20 bg-gradient-to-b from-[#0A0E1A] to-black dark:bg-gradient-to-b dark:from-gray-50 dark:to-gray-100 overflow-hidden transition-colors duration-300"
    >
      {/* Central glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00E5FF]/10 dark:bg-[#00E5FF]/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2
            className="font-['Playfair_Display',serif] font-bold text-[56px] lg:text-[64px] leading-[1.1] text-white dark:text-[#0A0E1A] drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] dark:drop-shadow-none mb-6"
            style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
          >
            Bring ALMUS to your facility
          </h2>
          <p className="font-['Poppins',sans-serif] text-[18px] lg:text-[20px] text-white/70 dark:text-gray-500 max-w-2xl mx-auto">
            Contact our sales team to discuss pricing, installation, and how ALMUS
            can enhance your facility.
          </p>
        </motion.div>

        {/* Contact Form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          onSubmit={handleSubmit}
          className="space-y-6 bg-white/5 backdrop-blur-sm border border-white/10 p-8 lg:p-12 rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
        >
          {/* Name & Company */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="font-['Poppins',sans-serif] font-medium text-[16px] text-white/90"
              >
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="bg-white/5 backdrop-blur-sm h-[52px] px-4 rounded-[14px] border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#00E5FF] focus:border-transparent transition-all text-white placeholder:text-white/40"
                placeholder="Your name"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="company"
                className="font-['Poppins',sans-serif] font-medium text-[16px] text-white/90"
              >
                Company *
              </label>
              <input
                type="text"
                id="company"
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
                className="bg-white/5 backdrop-blur-sm h-[52px] px-4 rounded-[14px] border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#00E5FF] focus:border-transparent transition-all text-white placeholder:text-white/40"
                placeholder="Facility or company name"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="font-['Poppins',sans-serif] font-medium text-[16px] text-white/90"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="bg-white/5 backdrop-blur-sm h-[52px] px-4 rounded-[14px] border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#00E5FF] focus:border-transparent transition-all text-white placeholder:text-white/40"
                placeholder="your.email@example.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="phone"
                className="font-['Poppins',sans-serif] font-medium text-[16px] text-white/90"
              >
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="bg-white/5 backdrop-blur-sm h-[52px] px-4 rounded-[14px] border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#00E5FF] focus:border-transparent transition-all text-white placeholder:text-white/40"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          {/* Message */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="message"
              className="font-['Poppins',sans-serif] font-medium text-[16px] text-white/90"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="bg-white/5 backdrop-blur-sm px-4 py-3 rounded-[14px] border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#00E5FF] focus:border-transparent transition-all resize-none text-white placeholder:text-white/40"
              placeholder="Tell us about your facility and what you're looking for..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="bg-[#00E5FF] hover:bg-[#00D4E6] h-[60px] px-16 rounded-full shadow-[0_0_24px_rgba(0,229,255,0.4)] hover:shadow-[0_0_36px_rgba(0,229,255,0.7)] hover:scale-[1.02] transition-all duration-300 font-['Poppins',sans-serif] font-bold text-[18px] text-black"
            >
              Request a quote
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}