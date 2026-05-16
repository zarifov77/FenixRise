import { motion, AnimatePresence } from "framer-motion";

// ── Shared spring config (edupath-style) ──────────────────────────
const spring = { type: "spring", stiffness: 300, damping: 24 };
const smoothSpring = { type: "spring", stiffness: 200, damping: 20 };

// ── Variant presets ──────────────────────────────────────────────
export const variants = {
  fadeUp: {
    hidden:  { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  },
  fadeDown: {
    hidden:  { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  },
  fadeLeft: {
    hidden:  { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  },
  fadeRight: {
    hidden:  { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  },
  scaleIn: {
    hidden:  { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1 },
  },
  popIn: {
    hidden:  { opacity: 0, scale: 0.5, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
  },
  blurIn: {
    hidden:  { opacity: 0, filter: "blur(10px)", y: 10 },
    visible: { opacity: 1, filter: "blur(0px)", y: 0 },
  },
  slideDown: {
    hidden:  { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  },
  staggerContainer: {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
  },
  staggerItem: {
    hidden:  { opacity: 0, y: 24, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { ...spring } },
  },
};

// ── Reusable motion components ────────────────────────────────────

export function MDiv({ children, variant = "fadeUp", delay = 0, duration = 0.5, className = "", style = {}, ...props }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={variants[variant]}
      transition={{ duration, delay, ...smoothSpring }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MStagger({ children, className = "", style = {}, staggerDelay = 0.07, ...props }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden:  { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: staggerDelay, delayChildren: 0.1 } },
      }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MItem({ children, className = "", style = {}, ...props }) {
  return (
    <motion.div
      variants={variants.staggerItem}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MH1({ children, delay = 0, className = "", style = {} }) {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ...smoothSpring }}
      className={className}
      style={style}
    >
      {children}
    </motion.h1>
  );
}

export function MH2({ children, delay = 0, className = "", style = {} }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ...spring }}
      className={className}
      style={style}
    >
      {children}
    </motion.h2>
  );
}

export function MP({ children, delay = 0, className = "", style = {} }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      className={className}
      style={style}
    >
      {children}
    </motion.p>
  );
}

export function MStat({ children, delay = 0, className = "", style = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ...spring }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function MCard({ children, delay = 0, className = "", style = {}, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.5, delay, ...spring }}
      whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.25, ...spring } }}
      whileTap={{ scale: 0.98 }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MButton({ children, delay = 0, className = "", style = {}, ...props }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay, ...spring }}
      whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.96 }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function MBadge({ children, delay = 0, className = "", style = {} }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.7, y: -8 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay, ...spring }}
      className={className}
      style={style}
    >
      {children}
    </motion.span>
  );
}

export function MOrb({ className = "", style = {} }) {
  return (
    <motion.div
      animate={{
        y: [0, -12, 0],
        scale: [1, 1.06, 1],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
      className={className}
      style={style}
    />
  );
}

export { AnimatePresence, motion };
