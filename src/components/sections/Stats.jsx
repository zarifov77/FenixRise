import { useScrollAnimation, useCounter } from "../../hooks/useScrollAnimation";
import { STATS } from "../../data/content";
import { motion } from "framer-motion";

function StatCard({ value, label, visible, delay }) {
  const num = parseFloat(value.replace(/[^0-9.]/g, ""));
  const count = useCounter(num, 1800, visible);
  const prefix = value.match(/^[^\d]*/)?.[0] || "";
  const suffix = value.replace(/^[^\d]*[\d.]+/, "");
  const display = Number.isInteger(num) ? Math.round(count) : count.toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, type: "spring", stiffness: 300, damping: 24 }}
      className="text-center px-4">
      <div className="font-display text-[52px] leading-none mb-2 num-shine" style={{ fontWeight: 800 }}>
        {prefix}{display}{suffix}
      </div>
      <p className="text-[12px] font-bold uppercase tracking-[0.15em]" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
    </motion.div>
  );
}

export default function Stats() {
  const [ref, visible] = useScrollAnimation(0.2);
  return (
    <section style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "56px 0" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-8"
             style={{ borderRadius: 0 }}>
          {STATS.map((s, i) => (
            <StatCard key={s.label} {...s} visible={visible} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
