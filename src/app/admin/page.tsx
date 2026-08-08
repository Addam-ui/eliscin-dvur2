"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Icon } from "@/components/Icons";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error ?? "Přihlášení se nepodařilo.");
        setLoading(false);
        return;
      }

      // `dalsi` drží stránku, na kterou majitelka původně mířila.
      const next = searchParams.get("dalsi");
      router.replace(next && next.startsWith("/admin") ? next : "/admin/kalendar");
      router.refresh();
    } catch {
      setError("Spojení se serverem selhalo.");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm rounded-3xl border border-linen bg-cream p-8 shadow-lift sm:p-10"
    >
      <div className="flex justify-center">
        <Image
          src="/logo/eliscin-dvur-logo-dark.png"
          alt="Eliščin dvůr"
          width={370}
          height={86}
          priority
          className="h-10 w-auto"
        />
      </div>

      <h1 className="mt-8 text-center font-display text-2xl text-ink">Správa rezervací</h1>
      <p className="mt-2 text-center text-sm text-ink-soft">
        Zadejte heslo pro přístup ke kalendáři obsazenosti.
      </p>

      <div className="mt-7">
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
          Heslo
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          autoFocus
          required
          className="w-full rounded-xl border border-linen bg-sand/50 px-4 py-3 text-ink transition-colors focus:border-forest focus:outline-none"
        />
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-clay-pale px-4 py-3 text-sm text-clay">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || password.length === 0}
        className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-full bg-forest px-6 py-3.5 font-semibold text-cream transition-colors hover:bg-forest-deep disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Icon name="spinner" size={18} className="animate-spin" />
            Přihlašuji…
          </>
        ) : (
          <>
            <Icon name="key" size={18} />
            Přihlásit se
          </>
        )}
      </button>

      <Link
        href="/"
        className="mt-6 block text-center text-sm text-ink-faint transition-colors hover:text-forest"
      >
        ← Zpět na web
      </Link>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-16">
      <Suspense
        fallback={
          <div className="flex items-center gap-3 text-ink-faint">
            <Icon name="spinner" size={20} className="animate-spin" />
            Načítám…
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
