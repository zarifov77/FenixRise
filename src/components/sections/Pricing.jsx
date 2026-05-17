import { useState } from "react";
import { Check, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";

const PLANS = [
  {
    name: "FREE",
    price: "0",
    period: "UZS",
    description: "Start your journey with essential tools",
    features: [
      "5 AI Advisor prompts/day",
      "3 Whiteboards",
      "5 Practice tests/month",
      "Basic roadmap (SAT or IELTS only)",
      "10 Notebook notes",
    ],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    name: "RISE",
    price: "149,000",
    period: "UZS/month",
    description: "Everything you need to succeed",
    features: [
      "30 AI Advisor prompts/day",
      "20 Whiteboards",
      "Unlimited practice tests",
      "Full SAT + IELTS roadmap",
      "Unlimited notebook notes",
      "Unlimited university favourites",
    ],
    cta: "Start Rising",
    highlight: true,
  },
  {
    name: "PHOENIX",
    price: "299,000",
    period: "UZS/month",
    description: "Premium support for ambitious students",
    features: [
      "Unlimited everything in Rise",
      "1-on-1 mentor session/month",
      "Essay AI review",
      "University application support",
      "Priority support 24/7",
    ],
    cta: "Go Phoenix",
    highlight: false,
  },
];

const MODULES = [
  { id: "sat-math", name: "SAT Math", price: 49000, icon: "📐" },
  { id: "sat-english", name: "SAT English (EBRW)", price: 49000, icon: "📖" },
  { id: "sat-full", name: "SAT Full Package", price: 79000, icon: "🎯", bestValue: true },
  { id: "ielts-listening", name: "IELTS Listening", price: 39000, icon: "🎧" },
  { id: "ielts-reading", name: "IELTS Reading", price: 39000, icon: "📄" },
  { id: "ielts-writing", name: "IELTS Writing", price: 59000, icon: "✍️" },
  { id: "ielts-speaking", name: "IELTS Speaking", price: 59000, icon: "🎤" },
  { id: "ielts-full", name: "IELTS Full Package", price: 99000, icon: "🏆", bestValue: true },
];

const FAQS = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from your account settings before your next billing date and you will not be charged again.",
  },
  {
    q: "Do you offer refunds?",
    a: "Refund requests are reviewed by our admin team. Contact us within 7 days of purchase with your reason. Approved refunds are processed within 3-5 business days.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Click and Payme. Both support Uzbek bank cards.",
  },
  {
    q: "Can I switch between plans?",
    a: "Yes. Upgrade or downgrade anytime from your account settings. Changes take effect from the next billing cycle.",
  },
  {
    q: "What is the difference between plans and modules?",
    a: "Plans give you full platform access. Modules let you pay only for one specific subject — SAT Math, IELTS Writing etc — without paying for the full platform.",
  },
];

export default function Pricing() {
  const [selectedModules, setSelectedModules] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);

  const toggleModule = (moduleId) => {
    setSelectedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const getTotalPrice = () => {
    return selectedModules.reduce((sum, id) => {
      const module = MODULES.find(m => m.id === id);
      return sum + (module?.price || 0);
    }, 0);
  };

  const getSuggestion = () => {
    const selected = selectedModules.map(id => MODULES.find(m => m.id === id));
    const hasSatMath = selected.some(m => m?.id === "sat-math");
    const hasSatEnglish = selected.some(m => m?.id === "sat-english");
    const hasSatFull = selected.some(m => m?.id === "sat-full");
    
    const ieltsCount = selected.filter(m => m?.id?.startsWith("ielts-") && !m?.id?.includes("full")).length;
    const hasIeltsFull = selected.some(m => m?.id === "ielts-full");

    if (hasSatMath && hasSatEnglish && !hasSatFull) {
      return "💡 SAT Full Package saves you 19,000 UZS!";
    }
    
    if (ieltsCount >= 3 && !hasIeltsFull) {
      const individualSum = selected
        .filter(m => m?.id?.startsWith("ielts-") && !m?.id?.includes("full"))
        .reduce((sum, m) => sum + m.price, 0);
      const savings = individualSum - 99000;
      return `💡 IELTS Full Package saves you ${savings.toLocaleString()} UZS!`;
    }

    if (getTotalPrice() > 149000) {
      return "💡 Rise plan includes everything for 149,000 UZS/mo";
    }

    return null;
  };

  return (
    <section id="pricing" className="section" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Plans Section */}
        <div className="text-center mb-16">
          <div className="pill mb-5 mx-auto" style={{ display: "inline-flex" }}>Simple Pricing</div>
          <h2 className="font-display mb-5" style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.08 }}>
            Invest in Your <span className="gradient-text">Future</span>
          </h2>
          <p className="text-[16px] max-w-lg mx-auto" style={{ color: "var(--text-secondary)" }}>
            Choose the plan that fits your journey. Cancel anytime. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 items-start max-w-5xl mx-auto mb-20">
          {PLANS.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>

        {/* Pay Per Feature Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="font-display mb-3" style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 700, color: "var(--text-primary)" }}>
              Or pay only for what you need
            </h3>
            <p className="text-[15px]" style={{ color: "var(--text-secondary)" }}>
              Choose specific modules. Pay only for what you study.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-8">
            {MODULES.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                isSelected={selectedModules.includes(module.id)}
                onToggle={() => toggleModule(module.id)}
              />
            ))}
          </div>

          {selectedModules.length > 0 && (
            <div className="text-center">
              <div className="inline-block px-6 py-3 rounded-lg" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <p className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>
                  Selected: {selectedModules.map(id => MODULES.find(m => m.id === id)?.name).join(", ")} = {getTotalPrice().toLocaleString()} UZS/mo
                </p>
                {getSuggestion() && (
                  <p className="text-[13px] mt-2" style={{ color: "var(--pumpkin)" }}>
                    {getSuggestion()}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="font-display mb-3" style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 700, color: "var(--text-primary)" }}>
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                isOpen={openFaq === index}
                onToggle={() => setOpenFaq(openFaq === index ? null : index)}
              />
            ))}
          </div>
        </div>

        <p className="text-center text-[12px] mt-16" style={{ color: "var(--text-muted)" }}>
          All prices in UZS. 7-day money-back guarantee.
        </p>
      </div>
    </section>
  );
}

function PlanCard({ plan }) {
  return (
    <div
      className={`card p-7 flex flex-col gap-6 h-full ${plan.highlight ? 'grad-border-wrap' : ''}`}
      style={{ borderRadius: 18, border: plan.highlight ? "2px solid var(--pumpkin)" : "1px solid var(--border)" }}>
      {plan.highlight && (
        <div className="flex items-center gap-1.5 text-[11px] font-bold" style={{ color: "var(--pumpkin)" }}>
          <Zap size={11} fill="currentColor" /> Most Popular
        </div>
      )}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>{plan.name}</p>
        <div className="flex items-end gap-1 mb-1">
          {plan.price === "0" ? (
            <span className="font-display text-[40px] font-extrabold" style={{ fontWeight: 800, color: "var(--text-primary)" }}>Free</span>
          ) : (
            <>
              <span className="font-display text-[36px] font-extrabold leading-none" style={{ fontWeight: 800, color: "var(--text-primary)" }}>{plan.price}</span>
              <span className="text-[13px] mb-1.5" style={{ color: "var(--text-muted)" }}>{plan.period}</span>
            </>
          )}
        </div>
        <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>{plan.description}</p>
      </div>
      <ul className="flex flex-col gap-3">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5 text-[13px]" style={{ color: "var(--text-secondary)" }}>
            <Check size={14} style={{ color: "var(--pumpkin)", marginTop: 2, flexShrink: 0 }} strokeWidth={2.5} />
            {f}
          </li>
        ))}
      </ul>
      <Link
        to="/register"
        className={`w-full justify-center !py-3.5 mt-auto text-center block rounded-lg font-semibold transition-all ${plan.highlight ? 'btn-primary' : 'btn-ghost'}`}
        style={{ padding: "14px 20px" }}
      >
        {plan.cta}
      </Link>
    </div>
  );
}

function ModuleCard({ module, isSelected, onToggle }) {
  return (
    <div
      onClick={onToggle}
      className={`card p-5 cursor-pointer transition-all ${isSelected ? 'ring-2' : ''}`}
      style={{
        borderRadius: 12,
        border: isSelected ? "2px solid var(--pumpkin)" : "1px solid var(--border)",
        background: isSelected ? "var(--pumpkin-soft)" : "var(--bg-card)",
      }}
    >
      {module.bestValue && (
        <div className="absolute -top-2 -right-2 text-[10px] font-bold px-2 py-1 rounded-full"
             style={{ background: "var(--pumpkin)", color: "#fff" }}>
          Best Value
        </div>
      )}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{module.icon}</span>
        <div className="flex-1">
          <p className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>{module.name}</p>
          <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>{module.price.toLocaleString()} UZS/mo</p>
        </div>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggle}
          className="w-5 h-5 rounded"
          style={{ accentColor: "var(--pumpkin)" }}
        />
      </div>
    </div>
  );
}

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div className="card" style={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--bg-card)" }}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left"
        style={{ background: "transparent", border: "none", cursor: "pointer" }}
      >
        <span className="text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>{faq.q}</span>
        {isOpen ? <ChevronUp size={18} style={{ color: "var(--text-muted)" }} /> : <ChevronDown size={18} style={{ color: "var(--text-muted)" }} />}
      </button>
      {isOpen && (
        <div className="px-5 pb-5">
          <p className="text-[14px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{faq.a}</p>
        </div>
      )}
    </div>
  );
}
