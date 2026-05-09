"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Drink } from "@/lib/types";
import { listDrinks, subscribe } from "@/lib/store";
import { InstallPrompt } from "@/components/install-prompt";

export default function HomePage() {
  const [drinks, setDrinks] = useState<Drink[] | null>(null);

  useEffect(() => {
    const refresh = () => setDrinks(listDrinks());
    refresh();
    return subscribe(refresh);
  }, []);

  return (
    <main className="relative mx-auto w-full max-w-2xl px-5 pb-32 pt-8 sm:pt-14 md:max-w-5xl md:px-8">
      <header className="mb-10 flex items-end justify-between gap-6">
        <div>
          <p className="small-caps text-[11px] font-medium text-mocha dark:text-caramel">
            est. for your usual
          </p>
          <h1 className="font-display tracking-display mt-1 text-[44px] font-medium leading-[0.95] text-ink sm:text-[56px] md:text-[72px] dark:text-cream">
            Drink
            <span className="italic text-gold">.</span>
            <br className="md:hidden" />
            <span className="italic font-light text-ink-soft md:ml-2 dark:text-caramel">
              Card
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/new"
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-green px-5 py-3 text-[14px] font-semibold text-cream brand-glow transition hover:bg-green-2 active:scale-[0.98]"
          >
            <span aria-hidden className="text-base leading-none">+</span>
            New drink
          </Link>
        <Link
          href="/settings"
          aria-label="Settings"
          className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-cream text-ink-soft transition hover:border-green hover:text-green dark:border-night-line dark:bg-night-2 dark:text-caramel"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:rotate-45"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </Link>
        </div>
      </header>

      <div className="mb-8">
        <InstallPrompt />
      </div>

      {drinks === null && (
        <p className="font-mono text-xs uppercase tracking-widest text-mocha dark:text-caramel">
          brewing…
        </p>
      )}

      {drinks?.length === 0 && <EmptyState />}

      {drinks && drinks.length > 0 && (
        <>
          <div className="mb-4 flex items-baseline justify-between">
            <p className="small-caps text-[11px] text-mocha dark:text-caramel">
              the menu — {drinks.length}
              {drinks.length === 1 ? " card" : " cards"}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-mocha/60 dark:text-caramel/60">
              tap to open
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {drinks.map((d, i) => (
              <DrinkRow key={d.id} drink={d} index={i} />
            ))}
          </ul>
        </>
      )}

      <Link
        href="/new"
        aria-label="New drink"
        className="animate-brand-pulse fixed bottom-6 right-5 z-30 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green text-cream brand-glow transition active:scale-95 sm:right-8 sm:h-[72px] sm:w-[72px] md:hidden"
      >
        <span className="font-display text-3xl leading-none">+</span>
        <span className="sr-only">New drink</span>
      </Link>
    </main>
  );
}

function DrinkRow({ drink, index }: { drink: Drink; index: number }) {
  const summary = drink.rows
    .slice(0, 3)
    .map((r) => `${r.label}: ${r.value}`)
    .filter((s) => s.replace(/[: ]/g, "").length > 0);

  const orderNo = String(index + 1).padStart(3, "0");

  return (
    <li
      className="animate-ink-rise"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <Link
        href={`/d/${drink.id}`}
        className="group relative block overflow-hidden rounded-[20px] border border-line bg-cream/90 px-5 py-5 ticket-shadow backdrop-blur transition hover:-translate-y-0.5 hover:border-green/50 dark:border-night-line dark:bg-night-2/80 dark:hover:border-green-2/60"
      >
        <span className="pointer-events-none absolute inset-y-3 left-3 w-[3px] rounded-full bg-green/70 transition group-hover:bg-green dark:bg-green-2/70" />

        <div className="ml-3 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-widest text-mocha dark:text-caramel">
              order № {orderNo}
            </p>
            <h2 className="font-display tracking-display mt-1 truncate text-2xl font-medium text-ink sm:text-3xl dark:text-cream">
              {drink.name || "Untitled drink"}
            </h2>
            {summary.length > 0 && (
              <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-ink-soft dark:text-caramel">
                {summary.map((s, i) => (
                  <span key={i}>
                    {i > 0 && (
                      <span className="mx-2 text-green/70">◦</span>
                    )}
                    {s}
                  </span>
                ))}
                {drink.rows.length > 3 && (
                  <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-mocha dark:text-caramel">
                    +{drink.rows.length - 3} more
                  </span>
                )}
              </p>
            )}
          </div>
          <span
            aria-hidden
            className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink-soft transition group-hover:border-green group-hover:bg-green group-hover:text-cream dark:border-night-line dark:text-caramel"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </span>
        </div>
      </Link>
    </li>
  );
}

function EmptyState() {
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-dashed border-line bg-cream/70 px-6 py-12 text-center ticket-shadow dark:border-night-line dark:bg-night-2/60">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 flex justify-center pt-6"
      >
        <SteamingCup />
      </div>
      <div className="relative mt-32">
        <p className="small-caps text-[11px] text-mocha dark:text-caramel">
          a clean counter
        </p>
        <h2 className="font-display tracking-display mt-2 text-3xl font-medium italic text-ink dark:text-cream">
          No drinks yet.
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-[14px] leading-relaxed text-ink-soft dark:text-caramel">
          Add your first card and never describe a venti-half-sweet-oat-with-extra-foam from
          memory again.
        </p>
        <div
          aria-hidden
          className="receipt-divider my-6 mx-auto w-40 text-line dark:text-night-line"
        />
        <p className="font-mono text-[10px] uppercase tracking-widest text-mocha dark:text-caramel">
          tap the green button below ↘
        </p>
      </div>
    </div>
  );
}

function SteamingCup() {
  return (
    <div className="relative h-24 w-24">
      <span
        aria-hidden
        className="absolute left-7 top-0 block h-6 w-1 rounded-full bg-mocha/40 dark:bg-caramel/40"
        style={{ animation: "steam-rise 2.4s ease-in-out infinite" }}
      />
      <span
        aria-hidden
        className="absolute left-12 top-1 block h-7 w-1 rounded-full bg-mocha/30 dark:bg-caramel/30"
        style={{ animation: "steam-rise 2.6s ease-in-out infinite 400ms" }}
      />
      <span
        aria-hidden
        className="absolute left-[68px] top-0 block h-5 w-1 rounded-full bg-mocha/40 dark:bg-caramel/40"
        style={{ animation: "steam-rise 2.2s ease-in-out infinite 800ms" }}
      />
      <svg
        viewBox="0 0 96 80"
        className="absolute inset-x-0 bottom-0 mx-auto h-16 w-24 text-ink-soft dark:text-caramel"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 28h56v22a18 18 0 0 1-18 18H32a18 18 0 0 1-18-18z" />
        <path d="M70 34h6a8 8 0 0 1 0 16h-6" />
        <path d="M14 76h56" />
      </svg>
    </div>
  );
}
