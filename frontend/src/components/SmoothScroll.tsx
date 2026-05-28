import { useEffect, useRef } from "react";
import Lenis from "lenis";

/**
 * SmoothScroll — Global Lenis provider.
 * Wraps children and activates silky-smooth, inertia-based scrolling
 * across the entire page. Uses requestAnimationFrame for 60fps updates.
 *
 * Falls back to native scroll if Lenis fails to initialize.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Skip Lenis on server during SSR
    if (typeof window === "undefined") return;

    let animFrameId: number;

    try {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 2,
        infinite: false,
      });

      lenisRef.current = lenis;

      function raf(time: number) {
        lenis.raf(time);
        animFrameId = requestAnimationFrame(raf);
      }

      animFrameId = requestAnimationFrame(raf);

      return () => {
        cancelAnimationFrame(animFrameId);
        lenis.destroy();
        lenisRef.current = null;
        // Ensure scroll is re-enabled if Lenis is destroyed
        document.documentElement.classList.remove("lenis-stopped");
        document.documentElement.style.overflow = "";
      };
    } catch (e) {
      console.warn("Lenis failed to initialize, using native scroll:", e);
      // Ensure native scrolling works if Lenis fails
      document.documentElement.style.overflow = "";
      return () => {};
    }
  }, []);

  return <>{children}</>;
}
