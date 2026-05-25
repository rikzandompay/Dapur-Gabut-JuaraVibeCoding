import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { ArrowLeft, Clock, Flame, Share2, ChefHat, Bookmark, Loader2 } from "lucide-react";
import { fetchRecipe, toggleSaveRecipe, getStoredUser, type RecipeResponse } from "@/lib/api";
import { useState } from "react";

export const Route = createFileRoute("/resep/$slug")({
  beforeLoad: () => {
    if (!getStoredUser()) {
      throw redirect({ to: "/login" });
    }
  },
  component: RecipePage,
  loader: async ({ params }): Promise<{ recipe: RecipeResponse }> => {
    try {
      const id = parseInt(params.slug);
      if (isNaN(id)) throw notFound();
      const recipe = await fetchRecipe(id);
      return { recipe };
    } catch {
      throw notFound();
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.recipe.title ?? "Resep"} — DapurGabut` },
      { name: "description", content: "Resep masakan spesial." },
    ],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-[60vh] items-center justify-center px-4 text-center">
      <div>
        <h1 className="font-display text-4xl">RESEP TIDAK DITEMUKAN</h1>
        <Link to="/history" className="mt-4 inline-block border-[3px] border-foreground bg-brutal-yellow px-4 py-2 font-bold brutal-shadow-sm">
          Kembali ke History
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="flex min-h-[60vh] items-center justify-center px-4 text-center">
      <div>
        <h1 className="font-display text-3xl">GAGAL MEMUAT</h1>
        <button onClick={reset} className="mt-4 border-[3px] border-foreground bg-brutal-pink px-4 py-2 font-bold brutal-shadow-sm">
          Coba lagi
        </button>
      </div>
    </div>
  ),
});

function RecipePage() {
  const { recipe } = Route.useLoaderData();
  const [saved, setSaved] = useState(recipe.is_saved);
  const [isSaving, setIsSaving] = useState(false);
  const inputIngredients = recipe.input_ingredients.split(',').map(i => i.trim());

  const handleToggleSave = async () => {
    setIsSaving(true);
    try {
      await toggleSaveRecipe(recipe.id);
      setSaved(!saved);
    } catch (err) {
      alert("Gagal menyimpan resep.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/history"
          className="inline-flex items-center gap-2 border-[3px] border-foreground bg-card px-4 py-2 text-sm font-bold brutal-shadow-sm brutal-hover hover:translate-x-[-2px] hover:translate-y-[-2px]"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
          Kembali
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleSave}
            disabled={isSaving}
            className={`inline-flex items-center gap-2 border-[3px] border-foreground px-4 py-2 text-sm font-bold brutal-shadow-sm brutal-hover hover:translate-x-[-2px] hover:translate-y-[-2px] disabled:opacity-50 ${saved ? "bg-brutal-pink" : "bg-card"}`}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />
            ) : (
              <Bookmark className={`h-4 w-4 ${saved ? "fill-foreground" : ""}`} strokeWidth={2.5} />
            )}
            {saved ? "Tersimpan" : "Simpan"}
          </button>
          <button className="inline-flex items-center gap-2 border-[3px] border-foreground bg-card px-4 py-2 text-sm font-bold brutal-shadow-sm brutal-hover hover:translate-x-[-2px] hover:translate-y-[-2px]">
            <Share2 className="h-4 w-4" strokeWidth={2.5} />
            Bagi
          </button>
        </div>
      </div>

      <section className="mt-8">
        <span className="inline-block border-[3px] border-foreground bg-brutal-lime px-3 py-1 text-xs font-bold uppercase tracking-wider brutal-shadow-sm">
          Resep AI
        </span>
        <h1 className="mt-4 font-display text-5xl leading-[0.95] md:text-7xl">
          {recipe.title.toUpperCase()}
        </h1>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {[
            { icon: Clock, label: recipe.cooking_time, tint: "bg-brutal-yellow" },
            { icon: ChefHat, label: "AI Generated", tint: "bg-brutal-pink" },
          ].map(({ icon: Icon, label, tint }) => (
            <span
              key={label}
              className={`inline-flex items-center gap-2 border-[3px] border-foreground ${tint} px-3 py-1.5 text-sm font-bold brutal-shadow-sm`}
            >
              <Icon className="h-4 w-4" strokeWidth={2.5} />
              {label}
            </span>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {inputIngredients.map((i) => (
            <span key={i} className="border-2 border-foreground bg-background px-2 py-0.5 text-xs font-bold">
              ✓ {i}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.5fr]">
        <aside className="brutal-card h-fit p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-2xl">BAHAN-BAHAN</h2>
          <ul className="mt-4 divide-y-[3px] divide-foreground">
            {recipe.full_ingredients.map((ing, idx) => (
              <li key={idx} className="flex items-start gap-3 py-3 text-sm">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 shrink-0 border-[3px] border-foreground accent-foreground"
                />
                <div className="flex-1 font-bold">{ing.item}</div>
                <div className="shrink-0 font-bold">{ing.qty}</div>
              </li>
            ))}
          </ul>
        </aside>

        <article className="brutal-card p-6 md:p-8">
          <h2 className="font-display text-2xl">INSTRUKSI</h2>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            Ikuti langkah-langkah berikut.
          </p>
          <ol className="mt-6 space-y-5">
            {recipe.instructions.map((step, idx) => (
              <li key={idx} className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center border-[3px] border-foreground bg-brutal-yellow font-display text-lg brutal-shadow-sm">
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <p className="pt-2 text-[15px] font-medium leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </article>
      </section>
    </main>
  );
}
