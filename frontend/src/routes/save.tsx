import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Bookmark, ArrowRight, ChefHat, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchSavedRecipes, getStoredUser, type RecipeResponse } from "@/lib/api";

export const Route = createFileRoute("/save")({
  beforeLoad: () => {
    if (!getStoredUser()) {
      throw redirect({ to: "/login" });
    }
  },
  component: SavePage,
  head: () => ({
    meta: [{ title: "Tersimpan — DapurGabut" }],
  }),
});

function SavePage() {
  const [items, setItems] = useState<RecipeResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSavedRecipes()
      .then(setItems)
      .catch((err) => setError(err instanceof Error ? err.message : "Gagal memuat resep tersimpan"))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-16">
      <div>
        <span className="inline-block border-[3px] border-foreground bg-brutal-pink px-3 py-1 text-xs font-bold uppercase tracking-wider brutal-shadow-sm">
          <Bookmark className="mr-1 inline h-3 w-3" strokeWidth={3} /> Save
        </span>
        <h1 className="mt-4 font-display text-4xl md:text-5xl">RESEP TERSIMPAN</h1>
        <p className="mt-2 font-medium text-muted-foreground">
          {items.length} resep favorit kamu.
        </p>
      </div>

      {isLoading ? (
        <div className="mt-12 flex items-center justify-center brutal-card p-10">
          <Loader2 className="h-8 w-8 animate-spin" strokeWidth={2.5} />
        </div>
      ) : error ? (
        <div className="mt-12 brutal-card border-destructive bg-brutal-pink p-10 text-center text-destructive font-bold">
          {error}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-12 brutal-card p-10 text-center">
          <div className="mx-auto inline-flex h-16 w-16 items-center justify-center border-[3px] border-foreground bg-brutal-pink">
            <Bookmark className="h-8 w-8" strokeWidth={2.5} />
          </div>
          <h2 className="mt-5 font-display text-2xl">BELUM ADA YANG DISIMPAN</h2>
          <p className="mt-2 font-medium text-muted-foreground">
            Klik tombol Simpan di halaman resep untuk menyimpannya.
          </p>
          <Link
            to="/buat"
            className="mt-6 inline-flex items-center gap-2 border-[3px] border-foreground bg-foreground px-5 py-2.5 text-sm font-bold text-background brutal-shadow brutal-hover hover:translate-x-[-2px] hover:translate-y-[-2px]"
          >
            <ChefHat className="h-4 w-4" strokeWidth={2.5} />
            Cari Resep
          </Link>
        </div>
      ) : (
        <ul className="mt-10 grid gap-5 md:grid-cols-2">
          {items.map((r, idx) => {
            const tints = ["bg-brutal-pink", "bg-brutal-lime", "bg-brutal-yellow", "bg-brutal-blue"];
            const tint = tints[idx % tints.length];
            return (
              <li key={r.id} className={`brutal-card ${tint} brutal-hover hover:translate-x-[-2px] hover:translate-y-[-2px] hover:brutal-shadow-lg`}>
                <Link to="/resep/$slug" params={{ slug: r.id.toString() }} className="block p-5">
                  <div className="flex items-center justify-between">
                    <span className="border-[3px] border-foreground bg-background px-2 py-0.5 text-[10px] font-bold uppercase">
                      {r.cooking_time}
                    </span>
                    <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
                  </div>
                  <h3 className="mt-3 font-display text-2xl leading-tight">{r.title}</h3>
                  <p className="mt-2 text-sm font-medium line-clamp-2">Bahan utama: {r.input_ingredients}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
