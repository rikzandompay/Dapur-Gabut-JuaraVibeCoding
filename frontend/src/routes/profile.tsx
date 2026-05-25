import { createFileRoute, redirect } from "@tanstack/react-router";
import { User, Bookmark, History as HistoryIcon, Settings, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchRecipeHistory, fetchSavedRecipes, getStoredUser } from "@/lib/api";

export const Route = createFileRoute("/profile")({
  beforeLoad: () => {
    if (!getStoredUser()) {
      throw redirect({ to: "/login" });
    }
  },
  component: Profile,
  head: () => ({ meta: [{ title: "Profile — DapurGabut" }] }),
});

function Profile() {
  const user = getStoredUser();
  const [historyCount, setHistoryCount] = useState<number | null>(null);
  const [savedCount, setSavedCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadStats() {
      try {
        const [history, saved] = await Promise.all([
          fetchRecipeHistory(),
          fetchSavedRecipes(),
        ]);
        if (active) {
          setHistoryCount(history.length);
          setSavedCount(saved.length);
        }
      } catch (err) {
        console.error("Gagal memuat statistik profil:", err);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadStats();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-16">
      <div className="brutal-card p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center border-[3px] border-foreground bg-brutal-yellow brutal-shadow">
            <User className="h-10 w-10" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-display text-3xl md:text-4xl">{user?.name || "CHEF KAMU"}</h1>
            <p className="mt-1 text-sm font-bold text-muted-foreground">{user?.email || "chef@dapurgabut.com"}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Stat
          icon={HistoryIcon}
          label="Total Generate"
          value={historyCount}
          isLoading={isLoading}
          tint="bg-brutal-lime"
        />
        <Stat
          icon={Bookmark}
          label="Tersimpan"
          value={savedCount}
          isLoading={isLoading}
          tint="bg-brutal-pink"
        />
      </div>

      <div className="mt-6 brutal-card p-6">
        <div className="flex items-center gap-3">
          <Settings className="h-5 w-5" strokeWidth={2.5} />
          <h2 className="font-display text-xl">PENGATURAN</h2>
        </div>
        <ul className="mt-5 divide-y-[3px] divide-foreground">
          {["Notifikasi", "Bahasa", "Tema", "Bantuan"].map((label) => (
            <li key={label} className="flex items-center justify-between py-3 font-bold">
              {label}
              <span className="text-xs font-bold text-muted-foreground">Segera</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  isLoading,
  tint,
}: {
  icon: typeof User;
  label: string;
  value: number | null;
  isLoading: boolean;
  tint: string;
}) {
  return (
    <div className={`brutal-card ${tint} p-6 relative`}>
      <Icon className="h-6 w-6" strokeWidth={2.5} />
      <div className="mt-3 font-display text-5xl flex items-center gap-2">
        {isLoading ? (
          <Loader2 className="h-10 w-10 animate-spin" strokeWidth={2.5} />
        ) : (
          value ?? 0
        )}
      </div>
      <div className="mt-1 text-sm font-bold uppercase tracking-wider">{label}</div>
    </div>
  );
}
