import { useEffect, useRef } from "react";

/**
 * SmoothScroll — Lightweight wrapper that enables CSS-based smooth scrolling.
 * 
 * Previously used Lenis with requestAnimationFrame loop which caused
 * "Page Unresponsive" freezes in production when combined with
 * Framer Motion animations. Replaced with CSS-only approach.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Use CSS smooth scrolling instead of JS-based Lenis
    document.documentElement.style.scrollBehavior = "smooth";

    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  return <>{children}</>;
}
