import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
/* eslint-disable-next-line no-unused-vars */
import { motion, MOrb } from "../MotionComponents";

const spring = { type: "spring", stiffness: 300, damping: 24 };

export default function Hero() {
  return (
    <section className="hero-mesh min-h-screen flex items-center relative overflow-hidden pt-24 pb-16">
      {/* Animated grid dots */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
      }} />

      {/* Glow orbs */}
      <MOrb className="absolute" style={{ width:480, height:480, background:"var(--pumpkin-glow)", top:-80, right:-60, opacity:0.7, filter:"blur(80px)", borderRadius:"50%" }} />
      <MOrb className="absolute" style={{ width:320, height:320, background:"var(--pumpkin-glow)", bottom:0, left:-40, opacity:0.5, filter:"blur(80px)", borderRadius:"50%" }} />

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

        {/* Right — floating cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ...spring }}
          className="hidden lg:flex items-center justify-center relative">
          <div className="float-anim relative z-10">
            <div className="w-[280px] h-[280px] rounded-[36px] flex items-center justify-center"
                 style={{ background:"var(--bg-card)", border:"1px solid var(--border)", boxShadow:"var(--shadow)" }}>
              <img src={logo} alt="FenixRise" className="w-52 h-52 object-contain"
                   style={{ filter:"drop-shadow(0 0 50px var(--pumpkin-glow))" }} />
            </div>
          </div>

          {/* Floating chips */}
          <motion.div
            initial={{ opacity: 0, x: -30, y: -10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5, ...spring }}
            className="card absolute -left-8 top-8 px-4 py-3 min-w-[160px]">
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color:"var(--text-muted)" }}>Roadmap Progress</p>
            <p className="font-display text-[17px] font-bold" style={{ fontWeight:700, color:"var(--text-primary)" }}>Week 6 / 12</p>
            <div className="mt-2 rounded-full h-1.5 overflow-hidden" style={{ background:"var(--bg-secondary)" }}>
              <div className="h-full w-1/2 rounded-full" style={{ background:"linear-gradient(90deg, var(--pumpkin), #FFAD60)" }} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.75, duration: 0.5, ...spring }}
            className="card absolute -right-8 bottom-10 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color:"var(--text-muted)" }}>Score Boost</p>
            <p className="font-display text-[30px] font-bold num-shine" style={{ fontWeight:800 }}>+380</p>
            <p className="text-[11px]" style={{ color:"var(--text-muted)" }}>SAT pts · 10 weeks</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5, ...spring }}
            className="card absolute -right-4 top-8 px-4 py-3 text-center">
            <p className="text-[22px] mb-1">🎓</p>
            <p className="text-[12px] font-bold" style={{ color:"var(--pumpkin)" }}>Oxford</p>
            <p className="text-[10px]" style={{ color:"var(--text-muted)" }}>Admitted</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
           style={{ background:"linear-gradient(to top, var(--bg), transparent)" }} />
    </section>
  );
}
