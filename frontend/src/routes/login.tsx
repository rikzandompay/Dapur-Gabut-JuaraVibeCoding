import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ChefHat, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, User } from "lucide-react";
import { login, loginGuest } from "@/lib/api";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({
    meta: [
      { title: "Masuk — DapurGabut" },
      { name: "description", content: "Masuk ke akun DapurGabut untuk mulai memasak." },
    ],
  }),
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Email atau password salah.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsGuestLoading(true);
    setError(null);

    try {
      await loginGuest();
      navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal masuk sebagai tamu.");
    } finally {
      setIsGuestLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center border-[3px] border-foreground bg-brutal-yellow brutal-shadow">
              <ChefHat className="h-7 w-7 text-foreground" strokeWidth={2.5} />
            </span>
            <span className="font-display text-3xl tracking-tight">DAPURGABUT</span>
          </div>
          <h1 className="mt-6 font-display text-4xl leading-tight md:text-5xl">
            MASUK KE <span className="bg-brutal-pink px-2">DAPURMU</span>
          </h1>
          <p className="mt-3 text-base font-medium text-muted-foreground">
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="border-b-[3px] border-foreground font-bold hover:bg-brutal-yellow"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>

        {/* Login Card */}
        <div className="mt-8 brutal-card p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="border-[3px] border-foreground bg-brutal-pink p-3 text-center text-sm font-bold">
                ❌ {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-bold uppercase tracking-wider">
                Email
              </label>
              <div className="flex items-center gap-3 border-[3px] border-foreground bg-background px-4 py-3">
                <Mail className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={2.5} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="chef@dapurgabut.com"
                  required
                  className="w-full bg-transparent text-base font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-bold uppercase tracking-wider">
                Password
              </label>
              <div className="flex items-center gap-3 border-[3px] border-foreground bg-background px-4 py-3">
                <Lock className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={2.5} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-transparent text-base font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="shrink-0 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" strokeWidth={2.5} /> : <Eye className="h-5 w-5" strokeWidth={2.5} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || isGuestLoading || !email || !password}
              className="flex w-full items-center justify-center gap-2 border-[3px] border-foreground bg-foreground px-6 py-4 text-lg font-bold text-background brutal-shadow-lg brutal-hover hover:translate-x-[-2px] hover:translate-y-[-2px] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" strokeWidth={2.5} />
                  Sedang masuk...
                </>
              ) : (
                <>
                  MASUK
                  <ArrowRight className="h-6 w-6" strokeWidth={2.5} />
                </>
              )}
            </button>

            {/* Separator */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t-[3px] border-foreground"></div>
              <span className="flex-shrink mx-4 font-bold uppercase tracking-wider text-xs bg-background px-2 border-[3px] border-foreground brutal-shadow-sm py-0.5">atau</span>
              <div className="flex-grow border-t-[3px] border-foreground"></div>
            </div>

            {/* Guest Login */}
            <button
              type="button"
              onClick={handleGuestLogin}
              disabled={isLoading || isGuestLoading}
              className="flex w-full items-center justify-center gap-2 border-[3px] border-foreground bg-brutal-yellow px-6 py-4 text-lg font-bold text-foreground brutal-shadow-lg brutal-hover hover:translate-x-[-2px] hover:translate-y-[-2px] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGuestLoading ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" strokeWidth={2.5} />
                  Membuat Sesi Tamu...
                </>
              ) : (
                <>
                  MASUK SEBAGAI TAMU
                  <User className="h-6 w-6" strokeWidth={2.5} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <span className="inline-block border-[3px] border-foreground bg-brutal-lime px-3 py-1.5 text-xs font-bold uppercase tracking-wider brutal-shadow-sm">
            🍳 Masak Apa Aja, Dari Bahan yang Ada
          </span>
        </div>
      </div>
    </main>
  );
}
