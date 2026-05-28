import { motion, AnimatePresence } from "framer-motion";
import { useRouterState } from "@tanstack/react-router";

/**
 * PageTransition — Lightweight route transition wrapper.
 *
 * Simplified from the previous version that had both an overlay animation
 * AND page animation running simultaneously, which caused "Page Unresponsive"
 * freezes when combined with Lenis smooth scroll and many Framer Motion
 * whileInView elements on the page.
 *
 * Now uses a simple, performant fade transition only.
 */

const pageVariants = {
  initial: {
    opacity: 0,
    y: 16,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

export function PageTransition({ children }: { children: React.ReactNode }) {
  const routerState = useRouterState();
  const locationKey = routerState.location.pathname;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={locationKey}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
