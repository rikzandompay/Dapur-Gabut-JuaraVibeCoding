import { useEffect, useState } from "react";
import type { Recipe } from "./recipes";

export type HistoryEntry = {
  recipe: Recipe;
  ingredients: string[];
  createdAt: number;
};

const HISTORY_KEY = "dapurgabut:history";
const SAVED_KEY = "dapurgabut:saved";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, val: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(val));
  window.dispatchEvent(new CustomEvent("dapurgabut:store", { detail: { key } }));
}

export function useHistory() {
  const [items, setItems] = useState<HistoryEntry[]>([]);
  useEffect(() => {
    setItems(read<HistoryEntry[]>(HISTORY_KEY, []));
    const onChange = () => setItems(read<HistoryEntry[]>(HISTORY_KEY, []));
    window.addEventListener("dapurgabut:store", onChange);
    return () => window.removeEventListener("dapurgabut:store", onChange);
  }, []);
  return items;
}

export function addToHistory(entry: HistoryEntry) {
  const list = read<HistoryEntry[]>(HISTORY_KEY, []);
  const next = [entry, ...list.filter((e) => e.recipe.slug !== entry.recipe.slug)].slice(0, 50);
  write(HISTORY_KEY, next);
}

export function clearHistory() {
  write<HistoryEntry[]>(HISTORY_KEY, []);
}

export function useSaved() {
  const [items, setItems] = useState<Recipe[]>([]);
  useEffect(() => {
    setItems(read<Recipe[]>(SAVED_KEY, []));
    const onChange = () => setItems(read<Recipe[]>(SAVED_KEY, []));
    window.addEventListener("dapurgabut:store", onChange);
    return () => window.removeEventListener("dapurgabut:store", onChange);
  }, []);
  return items;
}

export function toggleSaved(recipe: Recipe) {
  const list = read<Recipe[]>(SAVED_KEY, []);
  const exists = list.some((r) => r.slug === recipe.slug);
  const next = exists ? list.filter((r) => r.slug !== recipe.slug) : [recipe, ...list];
  write(SAVED_KEY, next);
  return !exists;
}

export function isSaved(slug: string) {
  return read<Recipe[]>(SAVED_KEY, []).some((r) => r.slug === slug);
}
