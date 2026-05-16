import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { MOrb, MDiv, motion } from "../MotionComponents";

export default function CTA() {
  return (
    <section className="section relative overflow-hidden" style={{ background:"var(--bg)" }}>
      <MOrb className="absolute" style={{ width:600, height:300, background:"var(--pumpkin-glow)", top:"50%", left:"50%", transform:"translate(-50%,-50%)", filter:"blur(80px)", borderRadius:"50%" }} />
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5, type: "spring", stiffness: 300, damping: 24 }}
          className="float-anim inline-block mb-8">
          <img src={logo} alt="" className="h-20 w-20 object-contain mx-auto"
               style={{ filter:"drop-shadow(0 0 40px var(--pumpkin-glow))" }} />
        </motion.div>
        <MDiv variant="fadeUp" delay={0.2} className="text-center">
          <div className="pill mb-8 mx-auto" style={{ display:"inline-flex" }}>
            <Sparkles size={11} /> Join the first cohort of rising students
          </div>
          <h2 className="font-display mb-6" style={{ fontSize:"clamp(36px,6vw,64px)", fontWeight:800, color:"var(--text-primary)", lineHeight:1.04 }}>
            Your Dream University<br />
            <span className="gradient-text">Isn't a Dream.</span><br />
            It's a Roadmap.
          </h2>
          <p className="text-[17px] max-w-xl mx-auto mb-10 leading-relaxed" style={{ color:"var(--text-secondary)" }}>
            Stop wondering "what if." Start building "what's next." Create your free profile today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link to="/register" className="btn-primary !py-4 !px-9 !text-[15px]">
                Start Free — No Credit Card <ArrowRight size={17} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <a href="#courses" className="btn-ghost !py-4 !px-9 !text-[15px]">Browse Courses</a>
            </motion.div>
          </div>
          <p className="text-[12px] mt-6" style={{ color:"var(--text-muted)" }}>Free forever. Upgrade when ready. Cancel anytime.</p>
        </MDiv>
      </div>
    </section>
  );
}
