"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Drink } from "@/lib/types";
import { getDrink, subscribe } from "@/lib/store";

export default function BaristaViewPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [drink, setDrink] = useState<Drink | null | undefined>(undefined);
  const [dark, setDark] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const refresh = () => setDrink(getDrink(id) ?? null);
    refresh();
    return subscribe(refresh);
  }, [id]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    type WakeLock = { release: () => Promise<void> };
    type WakeLockNavigator = Navigator & {
      wakeLock?: { request: (type: "screen") => Promise<WakeLock> };
    };
    const nav = navigator as WakeLockNavigator;
    let lock: WakeLock | null = null;
    nav.wakeLock
      ?.request("screen")
      .then((l) => {
        lock = l;
      })
      .catch(() => {});
    return () => {
      lock?.release().catch(() => {});
    };
  }, []);

  if (!drink) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream text-ink dark:bg-night dark:text-cream">
        <p className="font-mono text-xs uppercase tracking-widest">
          {drink === null ? "drink not found." : "brewing…"}
        </p>
      </main>
    );
  }

  const surface = dark
    ? "bg-night text-cream"
    : "bg-cream text-ink";
  const muted = dark ? "text-caramel" : "text-mocha";
  const lineColor = dark ? "border-night-line" : "border-line";
  const divColor = dark ? "divide-night-line" : "divide-line";

  const time = now.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className={`min-h-screen ${surface}`}>
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-5 pb-10 pt-6 sm:px-8">
        <div className="mb-5 flex items-center justify-between text-[11px]">
          <button
            type="button"
            onClick={() => router.back()}
            className={`font-mono uppercase tracking-[0.22em] ${muted} hover:opacity-70`}
          >
            ← back
          </button>
          <div className="flex items-center gap-1 rounded-full border border-current/20 p-1">
            <button
              type="button"
              onClick={() => setDark(false)}
              aria-pressed={!dark}
              className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-widest transition ${
                !dark
                  ? "bg-ink text-cream"
                  : "text-caramel"
              }`}
            >
              ☀ light
            </button>
            <button
              type="button"
              onClick={() => setDark(true)}
              aria-pressed={dark}
              className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-widest transition ${
                dark
                  ? "bg-cream text-ink"
                  : "text-mocha"
              }`}
            >
              ☾ dark
            </button>
          </div>
        </div>

        <div
          className={`flex items-center justify-between border-y border-dashed py-2 font-mono text-[10px] uppercase tracking-[0.22em] ${muted} ${lineColor}`}
        >
          <span>order ticket</span>
          <span>#{drink.id.slice(0, 6).toUpperCase()}</span>
          <span className="tabular-nums">{time}</span>
        </div>

        <div className="mt-8 sm:mt-12">
          <p
            className={`small-caps text-[11px] ${muted}`}
            style={{ animationDelay: "0ms" }}
          >
            for the counter
          </p>
          <h1
            className="font-display tracking-display animate-ink-rise mt-2 break-words text-[56px] font-medium leading-[0.92] sm:text-[88px] md:text-[104px]"
            style={{ animationDelay: "60ms" }}
          >
            {drink.name || "Untitled slip"}
          </h1>
        </div>

        <ul className={`mt-10 divide-y divide-dashed ${divColor}`}>
          {drink.rows.map((r, i) => (
            <li
              key={r.id}
              className="animate-ink-rise grid grid-cols-[auto_minmax(7rem,10rem)_1fr] items-baseline gap-4 py-4 sm:grid-cols-[auto_14rem_1fr] sm:gap-6 sm:py-5"
              style={{ animationDelay: `${120 + i * 70}ms` }}
            >
              <span
                className={`font-mono text-base ${muted} tabular-nums`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={`text-2xl font-medium sm:text-3xl ${muted}`}
              >
                {r.label || "—"}
              </span>
              <span className="font-display text-[34px] font-semibold leading-tight tracking-display sm:text-[48px]">
                {r.value || "—"}
              </span>
            </li>
          ))}
        </ul>

        {drink.notes && drink.notes.trim().length > 0 && (
          <div
            className={`animate-ink-rise mt-10 rounded-3xl border-2 px-6 py-5 ${
              dark
                ? "border-gold-2/70 bg-gold-2/15"
                : "border-gold/60 bg-gold/[0.10]"
            }`}
            style={{ animationDelay: `${160 + drink.rows.length * 70}ms` }}
          >
            <div
              className={`small-caps mb-2 text-[11px] font-bold ${
                dark ? "text-gold-2" : "text-gold"
              }`}
            >
              ⚑ note for the counter
            </div>
            <p className="whitespace-pre-wrap text-[22px] leading-snug sm:text-[28px]">
              {drink.notes}
            </p>
          </div>
        )}

        <div className="flex-1" />

        <div
          className={`mt-12 border-t border-dashed pt-3 text-center font-mono text-[10px] uppercase tracking-[0.22em] ${muted} ${lineColor}`}
        >
          screen will stay awake · thank you 𓍢
        </div>
      </div>
    </div>
  );
}
