import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Home, History, ChefHat, Bookmark, User, X, Menu } from "lucide-react";

/**
 * FullScreenMenu — Awwwards-style overlay navigation.
 *
 * On open: background wipes in, then each nav link staggers up one-by-one.
 * On close: links stagger out, then background wipes away.
 * Neo-brutalist styling consistent with DapurGabut design system.
 */

type MenuItem = {
  to: "/" | "/history" | "/buat" | "/save" | "/profile";
  label: string;
  icon: typeof Home;
  accent: string;
};

const menuItems: MenuItem[] = [
  { to: "/", label: "HOME", icon: Home, accent: "bg-brutal-yellow" },
  { to: "/buat", label: "BUAT RESEP", icon: ChefHat, accent: "bg-brutal-pink" },
  { to: "/history", label: "HISTORY", icon: History, accent: "bg-brutal-blue" },
  { to: "/save", label: "TERSIMPAN", icon: Bookmark, accent: "bg-brutal-lime" },
  { to: "/profile", label: "PROFIL", icon: User, accent: "bg-brutal-yellow" },
];

const cubicSmooth = [0.76, 0, 0.24, 1] as const;
const easeOut = [0.25, 0.46, 0.45, 0.94] as const;
const easeIn = [0.55, 0.06, 0.68, 0.19] as const;

// Overlay background animation
const overlayVariants = {
  hidden: { clipPath: "circle(0% at calc(100% - 3rem) 2rem)" },
  visible: {
    clipPath: "circle(150% at calc(100% - 3rem) 2rem)",
    transition: { duration: 0.7, ease: cubicSmooth },
  },
  exit: {
    clipPath: "circle(0% at calc(100% - 3rem) 2rem)",
    transition: { duration: 0.5, ease: cubicSmooth, delay: 0.3 },
  },
};

// Container for staggering children
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.3,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

// Individual menu item
const itemVariants = {
  hidden: { opacity: 0, y: 60, rotateX: -15 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: -30,
    transition: {
      duration: 0.3,
      ease: easeIn,
    },
  },
};

export function FullScreenMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Button — neo-brutal hamburger */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative z-[60] flex h-10 w-10 items-center justify-center border-[3px] border-foreground bg-brutal-pink brutal-shadow-sm brutal-hover hover:translate-x-[-2px] hover:translate-y-[-2px] md:hidden"
        aria-label="Buka menu"
      >
        <Menu className="h-5 w-5" strokeWidth={2.5} />
      </button>

      {/* Full-screen overlay rendered outside the DOM hierarchy to avoid transform clipping */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="fullscreen-menu"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-[99999] flex flex-col bg-foreground"
            >
              {/* Header bar */}
              <div className="flex items-center justify-between px-6 py-5">
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0, transition: { delay: 0.4, duration: 0.4 } }}
                  className="flex items-center gap-3"
                >
                  <span className="flex h-10 w-10 items-center justify-center border-[3px] border-background bg-brutal-yellow">
                    <ChefHat className="h-5 w-5 text-foreground" strokeWidth={2.5} />
                  </span>
                  <span className="font-display text-xl tracking-tight text-background">
                    DAPURGABUT
                  </span>
                </motion.span>

                <motion.button
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0, transition: { delay: 0.5, duration: 0.3 } }}
                  onClick={() => setIsOpen(false)}
                  className="flex h-10 w-10 items-center justify-center border-[3px] border-background bg-brutal-pink"
                  aria-label="Tutup menu"
                >
                  <X className="h-5 w-5 text-foreground" strokeWidth={2.5} />
                </motion.button>
              </div>

              {/* Menu items */}
              <motion.nav
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-1 flex-col justify-center gap-2 px-6"
              >
                {menuItems.map(({ to, label, icon: Icon, accent }, idx) => (
                  <motion.div key={to} variants={itemVariants}>
                    <Link
                      to={to}
                      onClick={() => setIsOpen(false)}
                      className="group flex items-center gap-4 py-3"
                    >
                      {/* Number */}
                      <span className="font-display text-lg text-background/30">
                        {String(idx + 1).padStart(2, "0")}
                      </span>

                      {/* Icon badge */}
                      <span
                        className={`flex h-12 w-12 items-center justify-center border-[3px] border-background ${accent} transition-transform group-hover:rotate-6 group-hover:scale-110`}
                      >
                        <Icon className="h-6 w-6 text-foreground" strokeWidth={2.5} />
                      </span>

                      {/* Label */}
                      <span className="font-display text-4xl tracking-tight text-background transition-colors group-hover:text-brutal-yellow md:text-6xl">
                        {label}
                      </span>

                      {/* Hover line */}
                      <motion.div
                        className="ml-auto hidden h-[3px] bg-brutal-yellow md:block"
                        initial={{ width: 0 }}
                        whileHover={{ width: 80 }}
                        transition={{ duration: 0.3 }}
                      />
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>

              {/* Footer tagline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.8, duration: 0.4 } }}
                className="px-6 pb-8 text-center"
              >
                <span className="inline-block border-[3px] border-background bg-brutal-lime px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                  🍳 Masak Apa Aja, Dari Bahan yang Ada
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
