import { Send, MapPin, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const LINKS = {
  Platform: [
    { label: "AI Roadmap",       href: "/#how-it-works" },
    { label: "SAT Prep",         href: "/#courses" },
    { label: "IELTS Prep",       href: "/#courses" },
    { label: "University Match", href: "/#features" },
    { label: "Scholarships",     href: "/#features" },
  ],
  Company: [
    { label: "About Us",  href: "/about" },
    { label: "Blog",      href: "/blog" },
    { label: "Careers",   href: "/careers" },
  ],
  Support: [
    { label: "Help Center",      href: "/help" },
    { label: "Privacy Policy",   href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Contact Us",       href: "/contact" },
  ],
};

export default function Footer() {
  return (
    <footer style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border)" }}>
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 pb-12"
             style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <Link to="/" className="flex items-center gap-3 mb-5">
              <img src={logo} alt="" className="h-9 w-9 object-contain" />
              <span className="font-display text-[20px]" style={{ fontWeight: 800, color: "var(--text-primary)" }}>
                Fenix<span style={{ color: "var(--pumpkin)" }}>Rise</span>
              </span>
            </Link>
            <p className="text-[14px] leading-relaxed mb-5 max-w-[240px]" style={{ color: "var(--text-secondary)" }}>
              Your Dream University Isn't a Dream. It's a Roadmap.
            </p>
            <div className="flex flex-col gap-2.5 text-[13px]" style={{ color: "var(--text-secondary)" }}>
              <a href="mailto:hello@fenixrise.uz" className="flex items-center gap-2 transition-colors"
                 style={{ color: "var(--text-secondary)" }}
                 onMouseEnter={e => e.currentTarget.style.color = "var(--pumpkin)"}
                 onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}>
                <Mail size={13} style={{ color: "var(--pumpkin)" }} /> hello@fenixrise.uz
              </a>
              <span className="flex items-center gap-2">
                <MapPin size={13} style={{ color: "var(--pumpkin)" }} /> Tashkent, Uzbekistan
              </span>
            </div>
          </div>

          {Object.entries(LINKS).map(([cat, links]) => (
            <div key={cat}>
              <p className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
                {cat}
              </p>
              <ul className="flex flex-col gap-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link to={href} className="text-[13px] transition-colors"
                       style={{ color: "var(--text-secondary)" }}
                       onMouseEnter={e => e.currentTarget.style.color = "var(--pumpkin)"}
                       onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="py-8 flex flex-col md:flex-row gap-5 items-center justify-between"
             style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <p className="font-display text-[17px] font-bold mb-1" style={{ fontWeight: 700, color: "var(--text-primary)" }}>
              Stay in the loop
            </p>
            <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
              Admission tips and SAT strategies — weekly.
            </p>
          </div>
          <form onSubmit={e => e.preventDefault()} className="flex gap-2 w-full md:w-auto">
            <input type="email" placeholder="your@email.com" className="form-input !rounded-full md:w-56" />
            <button type="submit" className="btn-primary !py-2.5 !px-5 !text-[13px]">
              <Send size={13} /> Subscribe
            </button>
          </form>
        </div>

        <div className="pt-7 flex flex-col md:flex-row justify-between items-center gap-3 text-[12px]"
             style={{ color: "var(--text-muted)" }}>
          <p>© 2025 FenixRise. All rights reserved. Built with 🔥 in Tashkent.</p>
          <p>Rise from the ashes. Reach the stars.</p>
        </div>
      </div>
    </footer>
  );
}
