import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MStagger, MItem, MCard } from "../components/MotionComponents";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "0",
    period: "UZS/month",
    who: "Getting started",
    benefits: ["AI profile assessment", "3 practice tests", "Community access"],
    cta: "Get Started",
  },
  {
    id: "rise",
    name: "Rise",
    price: "149,000",
    period: "UZS/month",
    who: "Students aiming for top universities",
    benefits: ["Full AI roadmap", "Unlimited practice tests", "Mentor support"],
    cta: "Choose Rise",
  },
  {
    id: "phoenix",
    name: "Phoenix",
    price: "299,000",
    period: "UZS/month",
    who: "Personalised concierge support",
    benefits: ["Dedicated mentor", "Unlimited reviews", "Application support"],
    cta: "Choose Phoenix",
  },
];

export default function Pricing() {
  const navigate = useNavigate();

  const handleBuy = (plan) => {
    // Redirect to Profile with selected plan (no payments integrated)
    navigate("/profile", { state: { plan: plan.id, name: plan.name, price: plan.price } });
  };

  return (
    <section className="section" style={{ background: "var(--bg)" }}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="pill mx-auto mb-4">Pricing</div>
          <h1 className="font-display" style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, color: "var(--text-primary)" }}>
            Simple plans. Clear value.
          </h1>
          <p className="text-[15px] max-w-2xl mx-auto mt-4" style={{ color: "var(--text-secondary)" }}>
            No surprises. Select a plan and we'll follow up to complete your purchase — personally.
          </p>
        </div>

        <MStagger className="grid md:grid-cols-3 gap-6 mb-8">
          {PLANS.map((p) => (
            <MItem key={p.id}>
              <MCard className="p-6 text-center" style={{ borderRadius: 16 }}>
                <div className="mb-3">
                  <p className="text-[12px] font-bold uppercase" style={{ color: "var(--text-muted)" }}>{p.who}</p>
                </div>
                <h3 className="font-display text-[20px] font-bold mb-2" style={{ color: "var(--text-primary)" }}>{p.name}</h3>
                <p className="text-[28px] font-extrabold mb-2" style={{ color: "var(--text-primary)" }}>{p.price} <span className="text-[13px] font-normal" style={{ color: "var(--text-muted)" }}>{p.period}</span></p>
                <ul className="text-left mb-6" style={{ color: "var(--text-secondary)" }}>
                  {p.benefits.map((b) => (
                    <li key={b} className="mb-2">• {b}</li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <button onClick={() => handleBuy(p)} className="btn-primary w-full py-3">
                    {p.cta}
                  </button>
                  <Link to="/register" className="block mt-3 text-[13px]" style={{ color: "var(--text-muted)" }}>Create account instead</Link>
                </div>
              </MCard>
            </MItem>
          ))}
        </MStagger>

        <div className="text-center mt-8 text-[13px]" style={{ color: "var(--text-muted)" }}>
          <p>No payment provider integrated. We'll contact you to complete payment.</p>
        </div>
      </div>
    </section>
  );
}
