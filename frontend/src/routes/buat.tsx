import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState, type KeyboardEvent } from "react";
import { Plus, X, ChefHat, Search, Clock, Loader2, Flame, ArrowRight, RotateCcw, Save } from "lucide-react";
import {
  getRecipeSuggestions,
  generateRecipe,
  toggleSaveRecipe,
  getStoredUser,
  type RecipeSuggestion,
  type RecipeResponse,
} from "@/lib/api";

export const Route = createFileRoute("/buat")({
  beforeLoad: () => {
    if (!getStoredUser()) {
      throw redirect({ to: "/login" });
    }
  },
  component: Buat,
  head: () => ({
    meta: [
      { title: "Buat Resep — DapurGabut" },
      { name: "description", content: "Masukkan bahan dan generate resep." },
    ],
  }),
});

const SUGGESTIONS = ["Tomat", "Bawang Putih", "Ayam", "Tahu", "Wortel", "Jahe"];

type Step = "input" | "picking" | "result";

function Buat() {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState<string[]>(["Telur", "Nasi", "Bayam"]);
  const [input, setInput] = useState("");

  // Step states
  const [step, setStep] = useState<Step>("input");
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
  const [suggestions, setSuggestions] = useState<RecipeSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [recipe, setRecipe] = useState<RecipeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const addIngredient = (value: string) => {
    const v = value.trim();
    if (!v) return;
    if (ingredients.some((i) => i.toLowerCase() === v.toLowerCase())) return;
    setIngredients([...ingredients, v]);
    setInput("");
  };

  const removeIngredient = (value: string) =>
    setIngredients(ingredients.filter((i) => i !== value));

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addIngredient(input);
    } else if (e.key === "Backspace" && !input && ingredients.length) {
      setIngredients(ingredients.slice(0, -1));
    }
  };

  // Step 1: Get 3 recipe suggestions
  const handleGetSuggestions = async () => {
    if (ingredients.length === 0) return;

    setIsLoadingSuggestions(true);
    setError(null);
    setSuggestions([]);
    setRecipe(null);
    setSelectedIndex(null);

    try {
      const result = await getRecipeSuggestions(ingredients.join(", "));
      setSuggestions(result);
      setStep("picking");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mendapatkan saran resep.");
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Step 2: Generate full recipe for selected suggestion
  const handleSelectRecipe = async (index: number) => {
    const selected = suggestions[index];
    if (!selected) return;

    setSelectedIndex(index);
    setIsLoadingRecipe(true);
    setError(null);

    try {
      const result = await generateRecipe(ingredients.join(", "), selected.title);
      setRecipe(result);
      setStep("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal generate resep.");
      setSelectedIndex(null);
    } finally {
      setIsLoadingRecipe(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (!recipe) return;
    setIsSaving(true);
    try {
      await toggleSaveRecipe(recipe.id);
      navigate({ to: "/save" });
    } catch (err) {
      alert("Gagal menyimpan resep: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to start
  const handleReset = () => {
    setStep("input");
    setSuggestions([]);
    setRecipe(null);
    setSelectedIndex(null);
    setError(null);
  };

  const CARD_COLORS = [
    { bg: "bg-brutal-yellow", icon: "bg-brutal-pink" },
    { bg: "bg-brutal-lime", icon: "bg-brutal-blue" },
    { bg: "bg-brutal-pink", icon: "bg-brutal-yellow" },
    { bg: "bg-brutal-blue", icon: "bg-brutal-lime" },
  ];

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-16">
      {/* Header */}
      <div className="text-center">
        <span className="inline-block border-[3px] border-foreground bg-brutal-lime px-3 py-1 text-xs font-bold uppercase tracking-wider brutal-shadow-sm">
          Buat Resep
        </span>
        <h1 className="mt-5 font-display text-4xl leading-tight md:text-6xl">
          BAHAN APA YANG <span className="bg-brutal-yellow px-2">KAMU PUNYA?</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base font-medium text-muted-foreground">
          Ketik bahan satu per satu. Tekan Enter atau koma untuk menambah.
        </p>
      </div>

      {/* Ingredient Input */}
      <div className="mt-10 brutal-card p-4 md:p-5">
        <label className="flex items-center gap-3 border-[3px] border-foreground bg-background px-4 py-3">
          <Search className="h-5 w-5 shrink-0" strokeWidth={2.5} />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="contoh: tomat"
            disabled={step !== "input"}
            className="w-full bg-transparent text-base font-medium text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={() => addIngredient(input)}
            disabled={step !== "input"}
            className="flex h-10 w-10 shrink-0 items-center justify-center border-[3px] border-foreground bg-brutal-yellow brutal-shadow-sm brutal-hover hover:translate-x-[-2px] hover:translate-y-[-2px] disabled:opacity-50"
            aria-label="Tambah bahan"
          >
            <Plus className="h-4 w-4" strokeWidth={3} />
          </button>
        </label>

        {ingredients.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {ingredients.map((ing, idx) => {
              const colors = ["bg-brutal-lime", "bg-brutal-pink", "bg-brutal-blue", "bg-brutal-yellow"];
              const color = colors[idx % colors.length];
              return (
                <span
                  key={ing}
                  className={`inline-flex items-center gap-2 border-[3px] border-foreground ${color} px-3 py-1.5 text-sm font-bold brutal-shadow-sm`}
                >
                  {ing}
                  {step === "input" && (
                    <button
                      onClick={() => removeIngredient(ing)}
                      className="flex h-4 w-4 items-center justify-center hover:text-destructive"
                      aria-label={`Hapus ${ing}`}
                    >
                      <X className="h-4 w-4" strokeWidth={3} />
                    </button>
                  )}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Add (only on input step) */}
      {step === "input" && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="font-bold">Cepat tambah:</span>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => addIngredient(s)}
              className="border-[3px] border-foreground bg-card px-3 py-1 font-bold brutal-hover hover:bg-brutal-yellow hover:translate-x-[-1px] hover:translate-y-[-1px] hover:brutal-shadow-sm"
            >
              + {s}
            </button>
          ))}
        </div>
      )}

      {/* Generate Button (Step 1) */}
      {step === "input" && (
        <div className="mt-10 text-center">
          <button
            onClick={handleGetSuggestions}
            disabled={ingredients.length === 0 || isLoadingSuggestions}
            className="inline-flex items-center gap-2 border-[3px] border-foreground bg-foreground px-8 py-4 text-lg font-bold text-background brutal-shadow-lg brutal-hover hover:translate-x-[-2px] hover:translate-y-[-2px] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoadingSuggestions ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" strokeWidth={2.5} />
                AI sedang mikir...
              </>
            ) : (
              <>
                <ChefHat className="h-6 w-6" strokeWidth={2.5} />
                GENERATE RESEP
              </>
            )}
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-8 brutal-card border-destructive bg-brutal-pink p-5 text-center">
          <p className="text-lg font-bold">❌ Gagal</p>
          <p className="mt-2 text-sm font-medium">{error}</p>
          <button
            onClick={step === "input" ? handleGetSuggestions : handleReset}
            className="mt-4 border-[3px] border-foreground bg-foreground px-5 py-2 text-sm font-bold text-background brutal-shadow-sm brutal-hover hover:translate-x-[-2px] hover:translate-y-[-2px]"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          STEP 2: Pick a Recipe from 3 Suggestions
          ═══════════════════════════════════════════════════ */}
      {step === "picking" && suggestions.length > 0 && (
        <div className="mt-12">
          <div className="text-center">
            <span className="inline-block border-[3px] border-foreground bg-brutal-yellow px-3 py-1 text-xs font-bold uppercase tracking-wider brutal-shadow-sm">
              Pilih Resep ✨
            </span>
            <h2 className="mt-4 font-display text-3xl md:text-4xl">
              AI PUNYA <span className="bg-brutal-pink px-2">{suggestions.length} IDE</span> BUAT KAMU
            </h2>
            <p className="mt-2 text-base font-medium text-muted-foreground">
              Klik resep yang kamu mau, AI akan buatkan detail lengkapnya.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {suggestions.map((suggestion, idx) => {
              const colors = CARD_COLORS[idx % CARD_COLORS.length];
              const isSelected = selectedIndex === idx;
              const isDisabled = isLoadingRecipe && !isSelected;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectRecipe(idx)}
                  disabled={isLoadingRecipe}
                  className={`group text-left brutal-card p-5 brutal-hover hover:translate-x-[-3px] hover:translate-y-[-3px] hover:brutal-shadow-lg disabled:cursor-not-allowed ${
                    isSelected ? "ring-4 ring-foreground translate-x-[-3px] translate-y-[-3px] brutal-shadow-lg" : ""
                  } ${isDisabled ? "opacity-40" : ""}`}
                >
                  {/* Number badge */}
                  <span
                    className={`inline-flex h-10 w-10 items-center justify-center border-[3px] border-foreground ${colors.icon} font-display text-lg brutal-shadow-sm`}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>

                  {/* Title */}
                  <h3 className="mt-3 font-display text-xl leading-tight">
                    {suggestion.title.toUpperCase()}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-sm font-medium text-muted-foreground leading-relaxed">
                    {suggestion.description}
                  </p>

                  {/* Meta badges */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className={`inline-flex items-center gap-1.5 border-[3px] border-foreground ${colors.bg} px-2 py-1 text-xs font-bold`}>
                      <Clock className="h-3 w-3" strokeWidth={3} />
                      {suggestion.cooking_time}
                    </span>
                    <span className="inline-flex items-center gap-1.5 border-[3px] border-foreground bg-card px-2 py-1 text-xs font-bold">
                      <Flame className="h-3 w-3" strokeWidth={3} />
                      {suggestion.difficulty}
                    </span>
                  </div>

                  {/* Loading indicator */}
                  {isSelected && isLoadingRecipe && (
                    <div className="mt-4 flex items-center gap-2 text-sm font-bold">
                      <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />
                      Memasak resep...
                    </div>
                  )}

                  {/* Hover CTA */}
                  {!isLoadingRecipe && (
                    <div className="mt-4 flex items-center gap-1 text-sm font-bold opacity-50 group-hover:opacity-100">
                      Pilih ini
                      <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Back button */}
          {!isLoadingRecipe && (
            <div className="mt-6 text-center">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 border-[3px] border-foreground bg-card px-5 py-2 text-sm font-bold brutal-shadow-sm brutal-hover hover:translate-x-[-2px] hover:translate-y-[-2px]"
              >
                <RotateCcw className="h-4 w-4" strokeWidth={2.5} />
                Ganti Bahan
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          STEP 3: Full Recipe Result
          ═══════════════════════════════════════════════════ */}
      {step === "result" && recipe && (
        <div className="mt-12 space-y-6">
          {/* Header */}
          <div className="brutal-card p-6 md:p-8 relative">
            <span className="inline-block border-[3px] border-foreground bg-brutal-lime px-3 py-1 text-xs font-bold uppercase tracking-wider brutal-shadow-sm">
              Resep Untukmu ✨
            </span>
            <h2 className="mt-4 font-display text-3xl leading-tight md:text-5xl">
              {recipe.title.toUpperCase()}
            </h2>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 border-[3px] border-foreground bg-brutal-yellow px-3 py-1.5 text-sm font-bold brutal-shadow-sm">
                <Clock className="h-4 w-4" strokeWidth={2.5} />
                {recipe.cooking_time}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {ingredients.map((i) => (
                <span key={i} className="border-2 border-foreground bg-background px-2 py-0.5 text-xs font-bold">
                  ✓ {i}
                </span>
              ))}
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveRecipe}
              disabled={isSaving}
              className="absolute top-6 right-6 inline-flex items-center gap-2 border-[3px] border-foreground bg-card px-4 py-2 text-sm font-bold brutal-shadow-sm brutal-hover hover:translate-x-[-2px] hover:translate-y-[-2px] hover:bg-brutal-pink disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />
              ) : (
                <Save className="h-4 w-4" strokeWidth={2.5} />
              )}
              <span className="hidden sm:inline">Simpan</span>
            </button>
          </div>

          {/* Bahan & Instruksi */}
          <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
            <aside className="brutal-card h-fit p-6 lg:sticky lg:top-24">
              <h3 className="font-display text-2xl">BAHAN-BAHAN</h3>
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
              <h3 className="font-display text-2xl">INSTRUKSI</h3>
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                Ikuti langkah-langkah berikut.
              </p>
              <ol className="mt-6 space-y-5">
                {recipe.instructions.map((s, idx) => (
                  <li key={idx} className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center border-[3px] border-foreground bg-brutal-yellow font-display text-lg brutal-shadow-sm">
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                    <p className="pt-2 text-[15px] font-medium leading-relaxed">{s}</p>
                  </li>
                ))}
              </ol>

              {/* Footer actions */}
              <div className="mt-8 flex flex-col items-start gap-3 border-[3px] border-foreground bg-brutal-lime p-5 brutal-shadow sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-display text-lg">SELAMAT MENIKMATI!</div>
                  <div className="text-xs font-bold">Resep dari AI, kreasi dapurmu.</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 border-[3px] border-foreground bg-foreground text-background px-4 py-2 text-sm font-bold brutal-shadow-sm brutal-hover hover:translate-x-[-2px] hover:translate-y-[-2px]"
                  >
                    <RotateCcw className="h-4 w-4" strokeWidth={2.5} />
                    Buat Resep Baru
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      )}
    </main>
  );
}
