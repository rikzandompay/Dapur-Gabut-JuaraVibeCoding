import { motion, AnimatePresence } from "framer-motion";
import { useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ChefHat } from "lucide-react";

/**
 * PageTransition — Wraps `<Outlet />` to create cinematic route transitions.
 *
 * Flow:
 *   1. Old page fades out + slides down slightly
 *   2. A minimal neo-brutal loading overlay flashes briefly
 *   3. New page fades in + slides up from below
 */

const easeOut = [0.25, 0.46, 0.45, 0.94] as const;
const easeIn = [0.55, 0.06, 0.68, 0.19] as const;
const cubicSmooth = [0.76, 0, 0.24, 1] as const;

const pageVariants = {
  initial: {
    opacity: 0,
    y: 40,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.99,
    transition: {
      duration: 0.3,
      ease: easeIn,
    },
  },
};

const overlayVariants = {
  initial: { scaleY: 0 },
  animate: {
    scaleY: 1,
    transition: { duration: 0.4, ease: cubicSmooth },
  },
  exit: {
    scaleY: 0,
    transition: { duration: 0.4, ease: cubicSmooth, delay: 0.1 },
  },
};

export function PageTransition({ children }: { children: React.ReactNode }) {
  const routerState = useRouterState();
  const locationKey = routerState.location.pathname;
  const [showOverlay, setShowOverlay] = useState(false);
  const [prevKey, setPrevKey] = useState(locationKey);

  useEffect(() => {
    if (locationKey !== prevKey) {
      setShowOverlay(true);
      setPrevKey(locationKey);
      
      const timer = setTimeout(() => {
        setShowOverlay(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [locationKey]); // Hanya bergantung pada locationKey

  return (
    <>
      {/* Route transition overlay */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            key="page-overlay"
            variants={overlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ transformOrigin: "top" }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-foreground"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: 0,
                transition: { duration: 0.4, delay: 0.1, ease: "backOut" },
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="flex h-16 w-16 items-center justify-center border-[3px] border-background bg-brutal-yellow"
            >
              <ChefHat
                className="h-8 w-8 text-foreground"
                strokeWidth={2.5}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page content transition */}
      <AnimatePresence mode="wait">
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
    </>
  );
}
