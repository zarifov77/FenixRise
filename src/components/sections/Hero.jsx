import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
/* eslint-disable-next-line no-unused-vars */
import { motion } from "../MotionComponents";

const spring = { type: "spring", stiffness: 300, damping: 24 };

export default function Hero() {
  return (
    <section className="hero-mesh min-h-screen flex items-center relative overflow-hidden pt-24 pb-16">
      {/* Animated grid dots */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
      }} />


      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5, ...spring }}
            className="pill mb-8">
            <Sparkles size={11} /> AI-Powered University Admission Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.2, duration: 0.7, ...spring }}
            className="font-display leading-[1.03] mb-7"
            style={{ fontSize:"clamp(36px,6vw,64px)", fontWeight:800, color:"var(--text-primary)" }}>
            Get admitted to your dream university —
            <br />
            AI-driven roadmap, test prep, and mentors.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5, ...spring }}
            className="text-[17px] leading-relaxed mb-10 max-w-[500px]"
            style={{ color:"var(--text-secondary)" }}>
            AI-powered SAT &amp; IELTS prep, smart university matching, and expert mentors — everything you need to get admitted to the world's top universities.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5, ...spring }}
            className="flex flex-wrap gap-3 mb-12">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link to="/register" aria-label="Create account" className="btn-primary text-[15px] py-4 px-8">
                Get Started <ArrowRight size={17} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <a href="#how-it-works" className="btn-ghost text-[15px] py-4 px-8">
                How It Works
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5, ...spring }}
            className="flex flex-wrap gap-6">
            {["2,400+ students enrolled", "94% admission rate", "180+ partner universities"].map((t, i) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
                className="flex items-center gap-2 text-[13px] font-semibold"
                style={{ color:"var(--text-secondary)" }}>
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:"var(--pumpkin)" }} />
                {t}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Right — illustration card (static for stability) */}
        <div className="hidden lg:flex items-center justify-center relative">
          <div className="relative z-10">
            <div className="w-[280px] h-[280px] rounded-[28px] flex items-center justify-center"
                 style={{ background:"var(--bg-card)", border:"1px solid var(--border)", boxShadow:"var(--shadow)" }}>
              <img src={logo} alt="FenixRise" className="w-48 h-48 object-contain" />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative bottom fade removed for a cleaner footer transition */}
    </section>
  );
}
