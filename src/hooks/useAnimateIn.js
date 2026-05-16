import { useEffect, useRef, useState } from "react";

// Triggers when element enters viewport
export function useAnimateIn(threshold = 0.08) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible];
}

// Staggered animation style helper
export function stagger(visible, index, base = 0.06) {
  return {
    opacity:   visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.55s ${index * base}s ease, transform 0.55s ${index * base}s ease`,
  };
}
