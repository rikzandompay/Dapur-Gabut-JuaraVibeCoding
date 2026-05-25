import { motion, type Variants } from "framer-motion";

/**
 * RevealUp — Scroll-triggered reveal animation wrapper.
 *
 * Wraps any element and makes it fade-in + slide-up when it scrolls
 * into the viewport. Uses `whileInView` for zero-config intersection
 * observer magic.
 *
 * Props:
 *   - delay: stagger delay in seconds (default 0)
 *   - duration: animation duration (default 0.8)
 *   - y: initial Y offset (default 50)
 *   - once: only animate once (default true)
 *   - className: pass-through className
 */

type RevealUpProps = {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  once?: boolean;
  className?: string;
};

const easeOut = [0.25, 0.46, 0.45, 0.94] as const;

const revealVariants: Variants = {
  hidden: (custom: { y: number }) => ({
    opacity: 0,
    y: custom.y,
    filter: "blur(4px)",
  }),
  visible: (custom: { delay: number; duration: number }) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: custom.duration,
      delay: custom.delay,
      ease: easeOut,
    },
  }),
};

export function RevealUp({
  children,
  delay = 0,
  duration = 0.8,
  y = 50,
  once = true,
  className,
}: RevealUpProps) {
  return (
    <motion.div
      custom={{ y, delay, duration }}
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.15 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * RevealScale — Scroll-triggered scale-up + fade-in.
 * Great for cards and images.
 */
export function RevealScale({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, filter: "blur(6px)" }}
      whileInView={{
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: {
          duration: 0.7,
          delay,
          ease: easeOut,
        },
      }}
      viewport={{ once: true, amount: 0.15 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * RevealSlide — Horizontal slide-in from left or right.
 */
export function RevealSlide({
  children,
  direction = "left",
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  direction?: "left" | "right";
  delay?: number;
  className?: string;
}) {
  const x = direction === "left" ? -60 : 60;

  return (
    <motion.div
      initial={{ opacity: 0, x, filter: "blur(4px)" }}
      whileInView={{
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
        transition: {
          duration: 0.8,
          delay,
          ease: easeOut,
        },
      }}
      viewport={{ once: true, amount: 0.15 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
