import { Clock, BarChart2, TrendingUp, ArrowRight } from "lucide-react";
import { COURSES } from "../../data/content";
import { MStagger, MItem, MDiv, motion } from "../MotionComponents";

export default function Courses() {
  return (
    <section id="courses" className="section" style={{ background:"var(--bg)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <MDiv variant="fadeUp" className="text-center mb-16">
          <div className="pill mb-5 mx-auto" style={{ display:"inline-flex" }}>Our Courses</div>
          <h2 className="font-display mb-5" style={{ fontSize:"clamp(32px,5vw,52px)", fontWeight:800, color:"var(--text-primary)", lineHeight:1.08 }}>
            Prep Courses That <span className="gradient-text">Actually Work</span>
          </h2>
          <p className="text-[16px] max-w-lg mx-auto" style={{ color:"var(--text-secondary)" }}>
            Proven methodology, AI-adaptive drills, and expert instructors who know what it takes.
          </p>
        </MDiv>

        <MStagger className="grid md:grid-cols-3 gap-6" staggerDelay={0.12}>
          {COURSES.map((c, i) => (
            <MItem key={c.title}>
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="card flex flex-col gap-5 p-7 relative h-full"
                style={{ border: i === 1 ? "2px solid var(--pumpkin)" : "1px solid var(--border)" }}>
                <span className="absolute -top-3 left-6 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                      style={{ background:"var(--pumpkin)", color:"#fff" }}>
                  {c.tag}
                </span>
                <div>
                  <h3 className="font-display text-[21px] font-bold mb-2" style={{ fontWeight:700, color:"var(--text-primary)" }}>{c.title}</h3>
                  <p className="text-[13px] leading-relaxed" style={{ color:"var(--text-secondary)" }}>{c.description}</p>
                </div>
                <div className="flex flex-col gap-2 pt-4" style={{ borderTop:"1px solid var(--border)" }}>
                  {[[Clock, c.duration], [BarChart2, c.level], [TrendingUp, c.score]].map(([Icon, text], j) => (
                    <div key={j} className="flex items-center gap-2 text-[13px]" style={{ color:"var(--text-secondary)" }}>
                      <Icon size={13} style={{ color:"var(--pumpkin)", flexShrink:0 }} /> {text}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 mt-auto" style={{ borderTop:"1px solid var(--border)" }}>
                  <div>
                    <p className="text-[11px]" style={{ color:"var(--text-muted)" }}>from</p>
                    <p className="font-display text-[20px] font-bold" style={{ fontWeight:700, color:"var(--text-primary)" }}>
                      {c.price} <span className="text-[12px] font-normal" style={{ color:"var(--text-muted)" }}>UZS/mo</span>
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-primary !py-2.5 !px-5 !text-[13px]">
                    Enroll <ArrowRight size={14} />
                  </motion.button>
                </div>
              </motion.div>
            </MItem>
          ))}
        </MStagger>
      </div>
    </section>
  );
}
