import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ChefHat, Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { register } from "@/lib/api";

export const Route = createFileRoute("/register")({
  component: Register,
  head: () => ({
    meta: [
      { title: "Daftar — DapurGabut" },
      { name: "description", content: "Buat akun DapurGabut dan mulai eksplor resep." },
    ],
  }),
});

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) return;

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await register(name, email, password, confirmPassword);
      navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat akun. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center border-[3px] border-foreground bg-brutal-yellow brutal-shadow">
              <ChefHat className="h-7 w-7 text-foreground" strokeWidth={2.5} />
            </span>
            <span className="font-display text-3xl tracking-tight">DAPURGABUT</span>
          </Link>
          <h1 className="mt-6 font-display text-4xl leading-tight md:text-5xl">
            GABUNG <span className="bg-brutal-lime px-2">DAPURGABUT</span>
          </h1>
          <p className="mt-3 text-base font-medium text-muted-foreground">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="border-b-[3px] border-foreground font-bold hover:bg-brutal-yellow"
            >
              Masuk di sini
            </Link>
          </p>
        </div>

        {/* Register Card */}
        <div className="mt-8 brutal-card p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="border-[3px] border-foreground bg-brutal-pink p-3 text-center text-sm font-bold">
                ❌ {error}
              </div>
            )}

            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-bold uppercase tracking-wider">
                Nama Lengkap
              </label>
              <div className="flex items-center gap-3 border-[3px] border-foreground bg-background px-4 py-3">
                <User className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={2.5} />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Chef Rikzan"
                  required
                  className="w-full bg-transparent text-base font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="reg-email" className="block text-sm font-bold uppercase tracking-wider">
                Email
              </label>
              <div className="flex items-center gap-3 border-[3px] border-foreground bg-background px-4 py-3">
                <Mail className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={2.5} />
                <input
                  id="reg-email"
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
              <label htmlFor="reg-password" className="block text-sm font-bold uppercase tracking-wider">
                Password
              </label>
              <div className="flex items-center gap-3 border-[3px] border-foreground bg-background px-4 py-3">
                <Lock className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={2.5} />
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 karakter"
                  required
                  minLength={8}
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

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="block text-sm font-bold uppercase tracking-wider">
                Konfirmasi Password
              </label>
              <div className="flex items-center gap-3 border-[3px] border-foreground bg-background px-4 py-3">
                <Lock className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={2.5} />
                <input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ketik ulang password"
                  required
                  minLength={8}
                  className="w-full bg-transparent text-base font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !name || !email || !password || !confirmPassword}
              className="flex w-full items-center justify-center gap-2 border-[3px] border-foreground bg-foreground px-6 py-4 text-lg font-bold text-background brutal-shadow-lg brutal-hover hover:translate-x-[-2px] hover:translate-y-[-2px] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" strokeWidth={2.5} />
                  Membuat akun...
                </>
              ) : (
                <>
                  BUAT AKUN
                  <ArrowRight className="h-6 w-6" strokeWidth={2.5} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <span className="inline-block border-[3px] border-foreground bg-brutal-yellow px-3 py-1.5 text-xs font-bold uppercase tracking-wider brutal-shadow-sm">
            ⚡ Resep instan dari bahan dapurmu
          </span>
        </div>
      </div>
    </main>
  );
}
