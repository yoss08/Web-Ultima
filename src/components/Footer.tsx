import { Link } from 'react-router';
import { Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border py-12 transition-colors duration-300">
      <div className="max-w-[1096px] mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo Column */}
          <div>
            <h3 className="font-['Arial',sans-serif] font-bold text-[20px] text-foreground mb-4">
              ULTIMA
            </h3>
          </div>

          {/* ULTIMA Column */}
          <div>
            <h4 className="font-['Poppins',sans-serif] font-semibold text-[14px] text-foreground mb-4">
              ULTIMA
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="font-['Poppins',sans-serif] text-[14px] text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  About us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="font-['Poppins',sans-serif] font-semibold text-[14px] text-foreground mb-4">
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  className="font-['Poppins',sans-serif] text-[14px] text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-['Poppins',sans-serif] font-semibold text-[14px] text-foreground mb-4">
              Contact
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+21699799368"
                  className="flex items-center gap-2 font-['Poppins',sans-serif] text-[14px] text-muted-foreground hover:text-foreground transition-colors duration-300 group"
                >
                  <Phone className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
                  <span>+216 99 799 368</span>
                </a>
              </li>
              <li>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=Ultima.contacus@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-['Poppins',sans-serif] text-[14px] text-muted-foreground hover:text-foreground transition-colors duration-300 group"
                >
                  <Mail className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
                  <span>Ultima.contacus@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border text-center">
          <p className="font-['Poppins',sans-serif] text-[14px] text-muted-foreground">
            © {new Date().getFullYear()} ULTIMA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
