import { Brain, BookOpen, GraduationCap, FileText, Users, Award } from "lucide-react";
import { FEATURES } from "../../data/content";
import { MStagger, MItem, MDiv } from "../MotionComponents";

const ICONS = { Brain, BookOpen, GraduationCap, FileText, Users, Award };

export default function Features() {
  return (
    <section id="features" className="section" style={{ background: "var(--bg)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <MDiv variant="fadeUp" className="text-center mb-16">
          <div className="pill mb-5 mx-auto" style={{ display:"inline-flex" }}>Everything you need</div>
          <h2 className="font-display mb-5" style={{ fontSize:"clamp(32px,5vw,52px)", fontWeight:800, color:"var(--text-primary)", lineHeight:1.08 }}>
            One Platform.<br />
            <span className="gradient-text">Infinite Possibilities.</span>
          </h2>
          <p className="text-[16px] max-w-xl mx-auto leading-relaxed" style={{ color:"var(--text-secondary)" }}>
            From test prep to acceptance letter — FenixRise covers every step with AI precision.
          </p>
        </MDiv>

        <MStagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-5" staggerDelay={0.08}>
          {FEATURES.map((f) => {
            const Icon = ICONS[f.icon];
            return (
              <MItem key={f.title}>
                <div className="card p-7 group cursor-default h-full">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-gradient-to-br ${f.color} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon size={21} color="#fff" strokeWidth={2.2} aria-hidden />
                  </div>
                  <h3 className="font-display text-[18px] font-bold mb-2.5 transition-colors"
                      style={{ fontWeight:700, color:"var(--text-primary)" }}>
                    {f.title}
                  </h3>
                  <p className="text-[14px] leading-relaxed" style={{ color:"var(--text-secondary)" }}>
                    {f.description}
                  </p>
                </div>
              </MItem>
            );
          })}
        </MStagger>
      </div>
    </section>
  );
}
