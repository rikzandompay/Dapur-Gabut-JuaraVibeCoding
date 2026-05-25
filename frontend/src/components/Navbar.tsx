import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Home, History, ChefHat, Bookmark, User } from "lucide-react";
import { FullScreenMenu } from "./FullScreenMenu";

type NavItem = {
  to: "/" | "/history" | "/buat" | "/save" | "/profile";
  label: string;
  icon: typeof Home;
  exact?: boolean;
  primary?: boolean;
};

const items: NavItem[] = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/history", label: "History", icon: History },
  { to: "/buat", label: "Buat", icon: ChefHat, primary: true },
  { to: "/save", label: "Save", icon: Bookmark },
  { to: "/profile", label: "Profile", icon: User },
];

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="sticky top-0 z-50 border-b-[3px] border-foreground bg-background/95 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <motion.span
            whileHover={{ rotate: 12, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="flex h-10 w-10 items-center justify-center border-[3px] border-foreground bg-brutal-yellow brutal-shadow-sm"
          >
            <ChefHat className="h-5 w-5 text-foreground" strokeWidth={2.5} />
          </motion.span>
          <span className="font-display text-xl tracking-tight">DAPURGABUT</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1.5 md:flex md:gap-2">
          {items.map(({ to, label, icon: Icon, primary, exact }, idx) => (
            <motion.div
              key={to}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx + 0.3, duration: 0.4 }}
            >
              <Link
                to={to}
                activeOptions={{ exact: !!exact }}
                className={[
                  "group inline-flex items-center gap-2 border-[3px] border-foreground px-2.5 py-2 text-sm font-bold brutal-hover md:px-4",
                  primary ? "bg-brutal-pink" : "bg-card",
                  "hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_0_oklch(0_0_0)]",
                  "data-[status=active]:bg-brutal-lime data-[status=active]:shadow-[4px_4px_0_0_oklch(0_0_0)]",
                ].join(" ")}
              >
                <Icon className="h-4 w-4" strokeWidth={2.5} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Mobile: Full-screen menu trigger */}
        <FullScreenMenu />
      </div>
    </motion.header>
  );
}
