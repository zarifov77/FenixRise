import { Star, MessageSquarePlus } from "lucide-react";
import { Link } from "react-router-dom";
import { MStagger, MItem, MDiv, motion } from "../MotionComponents";

export default function Testimonials() {
  return (
    <section id="testimonials" className="section" style={{ background:"var(--bg)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <MDiv variant="fadeUp" className="text-center mb-16">
          <div className="pill mb-5 mx-auto" style={{ display:"inline-flex" }}>Success Stories</div>
          <h2 className="font-display mb-5" style={{ fontSize:"clamp(32px,5vw,52px)", fontWeight:800, color:"var(--text-primary)", lineHeight:1.08 }}>
            Your Story Could Be <span className="gradient-text">The First.</span>
          </h2>
          <p className="text-[16px] max-w-xl mx-auto" style={{ color:"var(--text-secondary)" }}>
            FenixRise is just getting started. Be part of the first cohort and claim your spot on this wall.
          </p>
        </MDiv>

        <MStagger className="grid md:grid-cols-3 gap-5 mb-12" staggerDelay={0.1}>
          {[0,1,2].map(i => (
            <MItem key={i}>
              <div className="card p-7 flex flex-col gap-5 min-h-[240px]">
                <div className="flex gap-1">
                  {[...Array(5)].map((_,j) => <Star key={j} size={13} style={{ color:"var(--border)" }} fill="currentColor" />)}
                </div>
                <div className="flex-1 rounded-xl flex items-center justify-center p-4"
                     style={{ border:"1.5px dashed var(--border)" }}>
                  <p className="text-[13px] text-center italic" style={{ color:"var(--text-muted)" }}>
                    This spot is reserved for a student who rose with FenixRise. Could be you.
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4" style={{ borderTop:"1px solid var(--border)" }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background:"var(--bg-secondary)", border:"1px solid var(--border)" }}>
                    <span style={{ fontSize:16 }}>🔥</span>
                  </div>
                  <div>
                    <div className="w-24 h-2.5 rounded-full mb-1.5" style={{ background:"var(--bg-secondary)" }} />
                    <div className="w-16 h-2 rounded-full" style={{ background:"var(--bg-secondary)" }} />
                  </div>
                </div>
              </div>
            </MItem>
          ))}
        </MStagger>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 300, damping: 24 }}
          className="grad-border-wrap max-w-2xl mx-auto">
          <div className="card rounded-[18px] p-10 text-center" style={{ background:"var(--bg-card)", borderRadius:18 }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                 style={{ background:"var(--pumpkin-soft)" }}>
              <MessageSquarePlus size={26} style={{ color:"var(--pumpkin)" }} />
            </div>
            <h3 className="font-display text-[24px] font-bold mb-3" style={{ fontWeight:700, color:"var(--text-primary)" }}>
              Be Our First Success Story
            </h3>
            <p className="text-[15px] mb-8 max-w-md mx-auto leading-relaxed" style={{ color:"var(--text-secondary)" }}>
              Join the founding cohort. Get early access, founder pricing, and be the face of FenixRise's first generation.
            </p>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link to="/register" className="btn-primary mx-auto">Apply for Early Access</Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
