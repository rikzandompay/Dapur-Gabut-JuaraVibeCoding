/**
 * API client for communicating with the Laravel backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// ── Types ──────────────────────────────────────────────

export type FullIngredient = {
  qty: string;
  item: string;
};

export type RecipeSuggestion = {
  title: string;
  description: string;
  cooking_time: string;
  difficulty: string;
};

export type RecipeResponse = {
  id: number;
  title: string;
  input_ingredients: string;
  full_ingredients: FullIngredient[];
  instructions: string[];
  cooking_time: string;
  is_saved: boolean;
  created_at: string;
  updated_at: string;
};

export type UserData = {
  id: number;
  name: string;
  email: string;
};

export type AuthResponse = {
  user: UserData;
  token: string;
};

// ── Helpers ────────────────────────────────────────────

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('dapurgabut:token');
}

function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('dapurgabut:token', token);
}

export function clearToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('dapurgabut:token');
  localStorage.removeItem('dapurgabut:user');
}

export function getStoredUser(): UserData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('dapurgabut:user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function storeAuth(data: AuthResponse): void {
  setToken(data.token);
  if (typeof window !== 'undefined') {
    localStorage.setItem('dapurgabut:user', JSON.stringify(data.user));
  }
}

function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const json = await response.json();

  if (!response.ok || !json.success) {
    // Handle validation errors
    if (json.errors) {
      const firstError = Object.values(json.errors)[0];
      throw new Error(Array.isArray(firstError) ? firstError[0] as string : json.message || 'Terjadi kesalahan.');
    }
    throw new Error(json.message || 'Terjadi kesalahan.');
  }

  return json.data as T;
}

// ── Auth API ───────────────────────────────────────────

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await handleResponse<AuthResponse>(response);
  storeAuth(data);
  return data;
}

export async function loginGuest(): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/login/guest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
  });

  const data = await handleResponse<AuthResponse>(response);
  storeAuth(data);
  return data;
}

export async function register(
  name: string,
  email: string,
  password: string,
  password_confirmation: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ name, email, password, password_confirmation }),
  });

  const data = await handleResponse<AuthResponse>(response);
  storeAuth(data);
  return data;
}

export async function logout(): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: authHeaders(),
    });
  } finally {
    clearToken();
  }
}

// ── Recipe API ─────────────────────────────────────────

/**
 * Step 1: Get 3 recipe suggestions from AI.
 */
export async function getRecipeSuggestions(ingredients: string): Promise<RecipeSuggestion[]> {
  const response = await fetch(`${API_BASE_URL}/recipes/suggestions`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ ingredients }),
  });

  return handleResponse<RecipeSuggestion[]>(response);
}

/**
 * Step 2: Generate full recipe for the selected suggestion.
 */
export async function generateRecipe(ingredients: string, title: string): Promise<RecipeResponse> {
  const response = await fetch(`${API_BASE_URL}/recipes`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ ingredients, title }),
  });

  return handleResponse<RecipeResponse>(response);
}

/**
 * Toggle save status of a recipe.
 */
export async function toggleSaveRecipe(id: number): Promise<RecipeResponse> {
  const response = await fetch(`${API_BASE_URL}/recipes/${id}/toggle-save`, {
    method: 'POST',
    headers: authHeaders(),
  });

  return handleResponse<RecipeResponse>(response);
}

/**
 * Fetch saved recipes from the backend.
 */
export async function fetchSavedRecipes(): Promise<RecipeResponse[]> {
  const response = await fetch(`${API_BASE_URL}/recipes/saved`, {
    headers: authHeaders(),
  });

  const json = await response.json();
  if (!response.ok || !json.success) {
    if (response.status === 401) {
      throw new Error('Silakan login terlebih dahulu.');
    }
    throw new Error('Gagal memuat resep tersimpan.');
  }

  return json.data.data;
}

/**
 * Fetch recipe history from the backend.
 */
export async function fetchRecipeHistory(): Promise<RecipeResponse[]> {
  const response = await fetch(`${API_BASE_URL}/recipes`, {
    headers: authHeaders(),
  });

  const json = await response.json();
  if (!response.ok || !json.success) {
    if (response.status === 401) {
      throw new Error('Silakan login terlebih dahulu untuk melihat history.');
    }
    throw new Error('Gagal memuat riwayat resep.');
  }

  return json.data.data;
}

/**
 * Fetch a single recipe by ID.
 */
export async function fetchRecipe(id: number): Promise<RecipeResponse> {
  const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
    headers: authHeaders(),
  });

  return handleResponse<RecipeResponse>(response);
}
