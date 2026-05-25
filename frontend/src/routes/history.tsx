import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { History as HistoryIcon, Trash2, ArrowRight, ChefHat, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchRecipeHistory, getStoredUser, type RecipeResponse } from "@/lib/api";

export const Route = createFileRoute("/history")({
  beforeLoad: () => {
    if (!getStoredUser()) {
      throw redirect({ to: "/login" });
    }
  },
  component: HistoryPage,
  head: () => ({
    meta: [{ title: "History — DapurGabut" }],
  }),
});

function timeAgo(dateString: string) {
  const ts = new Date(dateString).getTime();
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s} detik lalu`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} mnt lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  return `${Math.floor(h / 24)} hari lalu`;
}

function HistoryPage() {
  const [items, setItems] = useState<RecipeResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecipeHistory()
      .then(setItems)
      .catch((err) => setError(err instanceof Error ? err.message : "Gagal memuat history"))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-block border-[3px] border-foreground bg-brutal-blue px-3 py-1 text-xs font-bold uppercase tracking-wider brutal-shadow-sm">
            <HistoryIcon className="mr-1 inline h-3 w-3" strokeWidth={3} /> History
          </span>
          <h1 className="mt-4 font-display text-4xl md:text-5xl">RIWAYAT RESEP</h1>
          <p className="mt-2 font-medium text-muted-foreground">
            Resep yang sudah kamu simpan.
          </p>
        </div>
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
        <EmptyState />
      ) : (
        <ul className="mt-10 grid gap-5 md:grid-cols-2">
          {items.map((recipe, idx) => {
            const tints = ["bg-brutal-yellow", "bg-brutal-lime", "bg-brutal-pink", "bg-brutal-blue"];
            const tint = tints[idx % tints.length];
            const ingredientsList = recipe.input_ingredients.split(',').map(i => i.trim());
            return (
              <li key={recipe.id} className="brutal-card brutal-hover hover:translate-x-[-2px] hover:translate-y-[-2px] hover:brutal-shadow-lg">
                <Link
                  to="/resep/$slug"
                  params={{ slug: recipe.id.toString() }}
                  className="block p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className={`border-[3px] border-foreground ${tint} px-2 py-0.5 text-[10px] font-bold uppercase`}>
                      {timeAgo(recipe.created_at)}
                    </span>
                    <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
                  </div>
                  <h3 className="mt-3 font-display text-2xl leading-tight">{recipe.title}</h3>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {ingredientsList.slice(0, 6).map((i) => (
                      <span key={i} className="border-2 border-foreground bg-background px-2 py-0.5 text-xs font-bold">
                        {i}
                      </span>
                    ))}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}

function EmptyState() {
  return (
    <div className="mt-12 brutal-card p-10 text-center">
      <div className="mx-auto inline-flex h-16 w-16 items-center justify-center border-[3px] border-foreground bg-brutal-yellow">
        <HistoryIcon className="h-8 w-8" strokeWidth={2.5} />
      </div>
      <h2 className="mt-5 font-display text-2xl">BELUM ADA HISTORY</h2>
      <p className="mt-2 font-medium text-muted-foreground">Generate resep pertamamu sekarang.</p>
      <Link
        to="/buat"
        className="mt-6 inline-flex items-center gap-2 border-[3px] border-foreground bg-foreground px-5 py-2.5 text-sm font-bold text-background brutal-shadow brutal-hover hover:translate-x-[-2px] hover:translate-y-[-2px]"
      >
        <ChefHat className="h-4 w-4" strokeWidth={2.5} />
        Buat Resep
      </Link>
    </div>
  );
}
