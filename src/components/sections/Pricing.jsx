import { Check, Zap } from "lucide-react";
import { PRICING } from "../../data/content";
import { MStagger, MItem, MDiv, motion } from "../MotionComponents";

export default function Pricing() {
  return (
    <section id="pricing" className="section" style={{ background:"var(--bg-secondary)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <MDiv variant="fadeUp" className="text-center mb-16">
          <div className="pill mb-5 mx-auto" style={{ display:"inline-flex" }}>Simple Pricing</div>
          <h2 className="font-display mb-5" style={{ fontSize:"clamp(32px,5vw,52px)", fontWeight:800, color:"var(--text-primary)", lineHeight:1.08 }}>
            Invest in Your <span className="gradient-text">Future</span>
          </h2>
          <p className="text-[16px] max-w-lg mx-auto" style={{ color:"var(--text-secondary)" }}>
            Choose the plan that fits your journey. Cancel anytime. No hidden fees.
          </p>
        </MDiv>

        <MStagger className="grid md:grid-cols-3 gap-5 items-start max-w-5xl mx-auto" staggerDelay={0.1}>
          {PRICING.map((plan) => (
            <MItem key={plan.name}>
              {plan.highlight ? (
                <div className="grad-border-wrap">
                  <PlanCard plan={plan} />
                </div>
              ) : <PlanCard plan={plan} />}
            </MItem>
          ))}
        </MStagger>
        <p className="text-center text-[12px] mt-8" style={{ color:"var(--text-muted)" }}>
          All prices in UZS. 7-day money-back guarantee.
        </p>
      </div>
    </section>
  );
}

function PlanCard({ plan }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="card p-7 flex flex-col gap-6 h-full"
      style={{ borderRadius:18 }}>
      {plan.highlight && (
        <div className="flex items-center gap-1.5 text-[11px] font-bold" style={{ color:"var(--pumpkin)" }}>
          <Zap size={11} fill="currentColor" /> Most Popular
        </div>
      )}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color:"var(--text-muted)" }}>{plan.name}</p>
        <div className="flex items-end gap-1 mb-1">
          {plan.price === "Free"
            ? <span className="font-display text-[40px] font-extrabold" style={{ fontWeight:800, color:"var(--text-primary)" }}>Free</span>
            : <>
                <span className="font-display text-[36px] font-extrabold leading-none" style={{ fontWeight:800, color:"var(--text-primary)" }}>{plan.price}</span>
                <span className="text-[13px] mb-1.5" style={{ color:"var(--text-muted)" }}>UZS{plan.period}</span>
              </>
          }
        </div>
        <p className="text-[13px]" style={{ color:"var(--text-secondary)" }}>{plan.description}</p>
      </div>
      <ul className="flex flex-col gap-3">
        {plan.features.map(f => (
          <li key={f} className="flex items-start gap-2.5 text-[13px]" style={{ color:"var(--text-secondary)" }}>
            <Check size={14} style={{ color:"var(--pumpkin)", marginTop:2, flexShrink:0 }} strokeWidth={2.5} />
            {f}
          </li>
        ))}
      </ul>
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className={plan.highlight ? "btn-primary w-full justify-center !py-3.5 mt-auto" : "btn-ghost w-full justify-center !py-3.5 mt-auto"}>
        {plan.cta}
      </motion.button>
    </motion.div>
  );
}
