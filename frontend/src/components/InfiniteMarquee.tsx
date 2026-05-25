import { motion } from "framer-motion";
import { ChefHat, Flame, Utensils, Leaf, Coffee, IceCream } from "lucide-react";
import { RevealUp } from "./RevealUp";

/**
 * InfiniteMarquee — Partners/brands infinite horizontal scroll.
 *
 * Uses Framer Motion's `animate` prop with infinite repeat to create
 * a seamless looping marquee. Items are duplicated so the loop has
 * no visible seam.
 *
 * Neo-brutalist style: thick borders, bold colors, icon+text combo.
 */

type Partner = {
  name: string;
  icon: typeof ChefHat;
  accent: string;
};

const partners: Partner[] = [
  { name: "DapurGabut", icon: ChefHat, accent: "bg-brutal-yellow" },
  { name: "PedasGila", icon: Flame, accent: "bg-brutal-pink" },
  { name: "NasiUduk.id", icon: Utensils, accent: "bg-brutal-lime" },
  { name: "VeganBro", icon: Leaf, accent: "bg-brutal-blue" },
  { name: "KopiLuwak", icon: Coffee, accent: "bg-brutal-yellow" },
  { name: "EsKrimLab", icon: IceCream, accent: "bg-brutal-pink" },
];

function MarqueeItem({ partner }: { partner: Partner }) {
  const Icon = partner.icon;
  return (
    <div className="mx-3 flex shrink-0 items-center gap-3 border-[3px] border-foreground bg-card px-5 py-3 brutal-shadow-sm brutal-hover hover:translate-x-[-2px] hover:translate-y-[-2px] hover:brutal-shadow">
      <span
        className={`flex h-10 w-10 items-center justify-center border-[3px] border-foreground ${partner.accent}`}
      >
        <Icon className="h-5 w-5 text-foreground" strokeWidth={2.5} />
      </span>
      <span className="font-display text-lg tracking-tight whitespace-nowrap">
        {partner.name.toUpperCase()}
      </span>
    </div>
  );
}

export function InfiniteMarquee() {
  // Duplicate the items for seamless loop
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section className="mt-20 overflow-hidden border-y-[3px] border-foreground bg-background py-6">
      <RevealUp>
        <div className="mb-6 text-center">
          <span className="inline-block border-[3px] border-foreground bg-brutal-blue px-3 py-1 text-xs font-bold uppercase tracking-wider brutal-shadow-sm">
            Partners & Teman Dapur
          </span>
        </div>
      </RevealUp>

      {/* Row 1: Left to Right */}
      <div className="relative flex overflow-hidden py-2">
        <motion.div
          className="flex shrink-0"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
        >
          {duplicatedPartners.map((partner, idx) => (
            <MarqueeItem key={`row1-${idx}`} partner={partner} />
          ))}
        </motion.div>
      </div>

      {/* Row 2: Right to Left (reversed) */}
      <div className="relative mt-3 flex overflow-hidden py-2">
        <motion.div
          className="flex shrink-0"
          animate={{ x: ["-50%", "0%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear",
            },
          }}
        >
          {[...duplicatedPartners].reverse().map((partner, idx) => (
            <MarqueeItem key={`row2-${idx}`} partner={partner} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
