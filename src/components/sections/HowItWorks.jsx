import { STEPS } from "../../data/content";
import { MStagger, MItem, MDiv } from "../MotionComponents";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section" style={{ background:"var(--bg-secondary)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <MDiv variant="fadeUp" className="text-center mb-16">
          <div className="pill mb-5 mx-auto" style={{ display:"inline-flex" }}>The Process</div>
          <h2 className="font-display mb-5" style={{ fontSize:"clamp(32px,5vw,52px)", fontWeight:800, color:"var(--text-primary)", lineHeight:1.08 }}>
            From Zero to <span className="gradient-text">Admitted</span> in 4 Steps
          </h2>
          <p className="text-[16px] max-w-lg mx-auto" style={{ color:"var(--text-secondary)" }}>
            We've turned the entire admission process into a clear, AI-guided journey.
          </p>
        </MDiv>

        <MStagger className="grid md:grid-cols-2 lg:grid-cols-4 gap-5" staggerDelay={0.1}>
          {STEPS.map((s) => (
            <MItem key={s.step}>
              <div className="card p-7 relative overflow-hidden group h-full">
                <div className="absolute -bottom-3 -right-2 font-display select-none pointer-events-none"
                     style={{ fontSize:90, fontWeight:800, lineHeight:1, color:"var(--pumpkin-soft)", opacity:0.6 }}>
                  {s.step}
                </div>
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-5 text-[13px] font-extrabold"
                     style={{ background:"linear-gradient(135deg,var(--pumpkin),#FFAD60)", color:"#fff", fontWeight:800 }}>
                  {s.step}
                </div>
                <h3 className="font-display text-[17px] font-bold mb-2.5" style={{ fontWeight:700, color:"var(--text-primary)" }}>
                  {s.title}
                </h3>
                <p className="text-[13px] leading-relaxed" style={{ color:"var(--text-secondary)" }}>
                  {s.description}
                </p>
              </div>
            </MItem>
          ))}
        </MStagger>
      </div>
    </section>
  );
}
