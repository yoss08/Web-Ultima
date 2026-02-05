import { motion } from "motion/react";
import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="py-12 px-6 lg:px-20 bg-black dark:bg-gray-100 border-t border-white/10 dark:border-[#0A0E1A]/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3
              className="font-['Playfair_Display',serif] font-bold text-[36px] text-white dark:text-[#0A0E1A] tracking-wider"
              style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
            >
              ULTIMA
            </h3>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <Link
              to="/summa"
              className="font-['Poppins',sans-serif] text-[14px] text-white/70 dark:text-[#0A0E1A]/70 hover:text-white dark:hover:text-[#0A0E1A] transition-colors"
            >
              SUMMA
            </Link>
            <Link
              to="/almus"
              className="font-['Poppins',sans-serif] text-[14px] text-white/70 dark:text-[#0A0E1A]/70 hover:text-white dark:hover:text-[#0A0E1A] transition-colors"
            >
              ALMUS
            </Link>
            <a
              href="#contact"
              className="font-['Poppins',sans-serif] text-[14px] text-white/70 dark:text-[#0A0E1A]/70 hover:text-white dark:hover:text-[#0A0E1A] transition-colors"
            >
              Contact
            </a>
          </motion.div>

          {/* Legal */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center md:justify-end gap-6"
          >
            <a
              href="#"
              className="font-['Poppins',sans-serif] text-[12px] text-white/50 dark:text-[#0A0E1A]/50 hover:text-white/70 dark:hover:text-[#0A0E1A]/70 transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="font-['Poppins',sans-serif] text-[12px] text-white/50 dark:text-[#0A0E1A]/50 hover:text-white/70 dark:hover:text-[#0A0E1A]/70 transition-colors"
            >
              Terms
            </a>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 pt-8 border-t border-white/10 dark:border-[#0A0E1A]/10 text-center"
        >
          <p className="font-['Poppins',sans-serif] text-[12px] text-white/50 dark:text-[#0A0E1A]/50">
            © 2026 ULTIMA. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}