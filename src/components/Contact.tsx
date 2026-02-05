import { motion } from "motion/react";
import { useState } from "react";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for your interest. We will contact you shortly.");
    setFormData({ name: "", organization: "", email: "", message: "" });
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
      id="contact"
      className="relative py-24 px-6 bg-gradient-to-b from-[#0F1425] to-[#0A0E1A] dark:bg-gradient-to-b dark:from-gray-50 dark:to-white transition-colors duration-300 overflow-hidden"
    >
      {/* Subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00E5FF]/5 dark:bg-[#00E5FF]/3 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2
            className="font-['Playfair_Display',serif] font-bold text-[56px] lg:text-[64px] leading-[1.2] text-white dark:text-[#0A0E1A] drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] dark:drop-shadow-none mb-4"
            style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
          >
            Get in touch with ULTIMA
          </h2>
        </motion.div>

        {/* Contact Form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          onSubmit={handleSubmit}
          className="space-y-6 max-w-2xl mx-auto"
        >
          {/* Name & Organization */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="font-['Poppins',sans-serif] font-medium text-[18px] leading-[20px] text-white/90 dark:text-[#0A0E1A]/90"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="bg-white/5 dark:bg-[#0A0E1A]/5 backdrop-blur-sm h-[50px] px-4 rounded-[14px] border border-white/20 dark:border-[#0A0E1A]/20 focus:outline-none focus:ring-2 focus:ring-[#00E5FF] focus:border-transparent transition-all text-white dark:text-[#0A0E1A] placeholder:text-white/40 dark:placeholder:text-[#0A0E1A]/40"
                placeholder="Your name"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="organization"
                className="font-['Poppins',sans-serif] font-medium text-[18px] leading-[20px] text-white/90 dark:text-[#0A0E1A]/90"
              >
                Organization
              </label>
              <input
                type="text"
                id="organization"
                name="organization"
                required
                value={formData.organization}
                onChange={handleChange}
                className="bg-white/5 dark:bg-[#0A0E1A]/5 backdrop-blur-sm h-[50px] px-4 rounded-[14px] border border-white/20 dark:border-[#0A0E1A]/20 focus:outline-none focus:ring-2 focus:ring-[#00E5FF] focus:border-transparent transition-all text-white dark:text-[#0A0E1A] placeholder:text-white/40 dark:placeholder:text-[#0A0E1A]/40"
                placeholder="Your organization"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="font-['Poppins',sans-serif] font-medium text-[18px] leading-[20px] text-white/90 dark:text-[#0A0E1A]/90"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="bg-white/5 dark:bg-[#0A0E1A]/5 backdrop-blur-sm h-[50px] px-4 rounded-[14px] border border-white/20 dark:border-[#0A0E1A]/20 focus:outline-none focus:ring-2 focus:ring-[#00E5FF] focus:border-transparent transition-all text-white dark:text-[#0A0E1A] placeholder:text-white/40 dark:placeholder:text-[#0A0E1A]/40"
              placeholder="your.email@example.com"
            />
          </div>

          {/* Message */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="message"
              className="font-['Poppins',sans-serif] font-medium text-[18px] leading-[20px] text-white/90 dark:text-[#0A0E1A]/90"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className="bg-white/5 dark:bg-[#0A0E1A]/5 backdrop-blur-sm px-4 py-3 rounded-[14px] border border-white/20 dark:border-[#0A0E1A]/20 focus:outline-none focus:ring-2 focus:ring-[#00E5FF] focus:border-transparent transition-all resize-none text-white dark:text-[#0A0E1A] placeholder:text-white/40 dark:placeholder:text-[#0A0E1A]/40"
              placeholder="Tell us about your needs..."
            />
          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-[#00E5FF] hover:bg-[#00D4E6] dark:bg-[#00E5FF] dark:hover:bg-[#00D4E6] h-[56px] px-12 rounded-full shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.6)] hover:scale-[1.02] transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[16px] text-black dark:text-black flex items-center justify-center gap-2"
            >
              Get in touch
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 2L11 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 2L15 22L11 13L2 9L22 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}