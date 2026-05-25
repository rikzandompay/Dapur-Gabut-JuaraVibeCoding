import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ChefHat, History, Bookmark, Zap, ArrowRight, Sparkles, Star } from "lucide-react";
import { getStoredUser } from "@/lib/api";
import { RevealUp, RevealScale, RevealSlide } from "@/components/RevealUp";
import { InfiniteMarquee } from "@/components/InfiniteMarquee";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (!getStoredUser()) {
      throw redirect({ to: "/login" });
    }
  },
  component: Home,
  head: () => ({
    meta: [
      { title: "DapurGabut — Resep dari Bahan Dapurmu" },
      { name: "description", content: "Pembuat resep neo-brutalist. Cepat, jujur, lezat." },
    ],
  }),
});

function Home() {
  return (
    <main>
      {/* ═══════════════════════════════════════════════════
          HERO SECTION — Big title + animated card preview
          ═══════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <RevealUp delay={0}>
              <span className="inline-block border-[3px] border-foreground bg-brutal-yellow px-3 py-1 text-xs font-bold uppercase tracking-wider brutal-shadow-sm">
                Resep ⚡ Instan
              </span>
            </RevealUp>

            <RevealUp delay={0.15}>
              <h1 className="mt-5 font-display text-5xl leading-[0.95] md:text-7xl">
                MASAK <span className="bg-brutal-pink px-2">APA AJA</span> DARI BAHAN YANG ADA.
              </h1>
            </RevealUp>

            <RevealUp delay={0.3}>
              <p className="mt-5 max-w-md text-base font-medium text-muted-foreground md:text-lg">
                Ketik bahan yang kamu punya. DapurGabut bikinin resep — jujur, cepat, dan tanpa basa-basi.
              </p>
            </RevealUp>

            <RevealUp delay={0.45}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/buat"
                  className="group inline-flex items-center gap-2 border-[3px] border-foreground bg-foreground px-6 py-3 text-base font-bold text-background brutal-shadow brutal-hover hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0_0_oklch(0_0_0)]"
                >
                  <ChefHat className="h-5 w-5 transition-transform group-hover:rotate-12" strokeWidth={2.5} />
                  Mulai Bikin
                </Link>
                <Link
                  to="/history"
                  className="inline-flex items-center gap-2 border-[3px] border-foreground bg-card px-6 py-3 text-base font-bold brutal-shadow-sm brutal-hover hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_oklch(0_0_0)]"
                >
                  Lihat History
                  <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
                </Link>
              </div>
            </RevealUp>
          </div>

          {/* Animated preview card */}
          <RevealScale delay={0.3}>
            <div className="relative">
              <motion.div
                className="brutal-card rotate-2 p-6"
                whileHover={{ rotate: -1, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <div className="font-display text-2xl">NASI GORENG BAYAM</div>
                <div className="mt-2 text-sm font-medium text-muted-foreground">18 menit · 2 porsi · Mudah</div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Telur", "Nasi", "Bayam"].map((t, i) => (
                    <motion.span
                      key={t}
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 + i * 0.1, duration: 0.4, type: "spring" }}
                      className="border-[3px] border-foreground bg-brutal-lime px-3 py-1 text-sm font-bold"
                    >
                      {t}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="brutal-card absolute -bottom-6 -left-4 bg-brutal-blue p-4 text-sm font-bold"
                initial={{ rotate: 0 }}
                whileInView={{ rotate: -3 }}
                whileHover={{ rotate: 3, scale: 1.1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                ⚡ Generated in 0.4s
              </motion.div>
            </div>
          </RevealScale>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FEATURES SECTION — 3 cards with scroll reveal
          ═══════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-4 md:px-6">
        <RevealUp>
          <div className="mb-8 text-center">
            <span className="inline-block border-[3px] border-foreground bg-brutal-lime px-3 py-1 text-xs font-bold uppercase tracking-wider brutal-shadow-sm">
              <Sparkles className="mr-1 inline h-3 w-3" strokeWidth={3} />
              Fitur Unggulan
            </span>
          </div>
        </RevealUp>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: Zap, title: "CEPAT", desc: "Resep keluar dalam hitungan detik.", accent: "bg-brutal-yellow" },
            { icon: History, title: "HISTORY", desc: "Semua resep yang pernah kamu generate, tersimpan.", accent: "bg-brutal-pink" },
            { icon: Bookmark, title: "SAVE", desc: "Pin favoritmu, akses kapan aja.", accent: "bg-brutal-blue" },
          ].map(({ icon: Icon, title, desc, accent }, idx) => (
            <RevealUp key={title} delay={idx * 0.15}>
              <motion.div
                className="brutal-card p-6 brutal-hover"
                whileHover={{
                  translateX: -4,
                  translateY: -4,
                  boxShadow: "10px 10px 0 0 oklch(0 0 0)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <motion.span
                  className={`inline-flex h-12 w-12 items-center justify-center border-[3px] border-foreground ${accent}`}
                  whileHover={{ rotate: 12, scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Icon className="h-6 w-6" strokeWidth={2.5} />
                </motion.span>
                <h3 className="mt-4 font-display text-2xl">{title}</h3>
                <p className="mt-2 text-sm font-medium text-muted-foreground">{desc}</p>
              </motion.div>
            </RevealUp>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          TESTIMONIAL/STATS SECTION
          ═══════════════════════════════════════════════════ */}
      <section className="mx-auto mt-20 max-w-6xl px-4 md:px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { num: "500+", label: "Resep Di-generate", color: "bg-brutal-yellow" },
            { num: "99%", label: "Chef Puas", color: "bg-brutal-pink" },
            { num: "0.4s", label: "Rata-rata Waktu", color: "bg-brutal-lime" },
          ].map(({ num, label, color }, idx) => (
            <RevealSlide key={label} direction={idx % 2 === 0 ? "left" : "right"} delay={idx * 0.1}>
              <div className={`brutal-card ${color} p-8 text-center`}>
                <motion.div
                  className="font-display text-5xl md:text-6xl"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 100 }}
                >
                  {num}
                </motion.div>
                <div className="mt-2 text-sm font-bold uppercase tracking-wider">{label}</div>
              </div>
            </RevealSlide>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          INFINITE MARQUEE — Partners section
          ═══════════════════════════════════════════════════ */}
      <InfiniteMarquee />

      {/* ═══════════════════════════════════════════════════
          CTA FOOTER SECTION
          ═══════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <RevealUp>
          <div className="brutal-card p-8 text-center md:p-12">
            <motion.div
              className="mx-auto inline-flex h-16 w-16 items-center justify-center border-[3px] border-foreground bg-brutal-yellow"
              whileInView={{ rotate: [0, 12, -12, 0] }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <Star className="h-8 w-8 text-foreground" strokeWidth={2.5} />
            </motion.div>
            <h2 className="mt-6 font-display text-4xl text-foreground md:text-5xl">
              SIAP MASAK <span className="bg-brutal-pink px-2">HARI INI?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base font-medium text-muted-foreground">
              Langsung coba. Nggak perlu ribet. Tinggal ketik bahan, AI yang kerja.
            </p>
            <div className="mt-8">
              <Link
                to="/buat"
                className="inline-flex items-center gap-2 border-[3px] border-foreground bg-brutal-lime px-8 py-4 text-lg font-bold text-foreground brutal-shadow-lg brutal-hover hover:translate-x-[-3px] hover:translate-y-[-3px]"
              >
                <ChefHat className="h-6 w-6" strokeWidth={2.5} />
                MULAI SEKARANG
              </Link>
            </div>
          </div>
        </RevealUp>
      </section>
    </main>
  );
}
