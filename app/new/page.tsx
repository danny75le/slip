"use client";

import Link from "next/link";
import { useMemo } from "react";
import { newDrink } from "@/lib/store";
import { DrinkForm } from "@/components/drink-form";

export default function NewDrinkPage() {
  const initial = useMemo(() => newDrink(), []);

  return (
    <main className="mx-auto w-full max-w-2xl px-5 pb-16 pt-8 sm:pt-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-mocha hover:text-green dark:text-caramel dark:hover:text-green-2"
      >
        <span aria-hidden>←</span>
        back
      </Link>

      <div className="mt-6 mb-8">
        <p className="small-caps text-[11px] text-mocha dark:text-caramel">
          a new card
        </p>
        <h1 className="font-display tracking-display mt-1 text-[40px] font-medium leading-[0.98] text-ink sm:text-[52px] dark:text-cream">
          Compose your{" "}
          <span className="italic text-gold">order</span>.
        </h1>
        <p className="mt-3 max-w-md text-[14px] text-ink-soft dark:text-caramel">
          Name it, list the modifiers the barista needs, and you&apos;re done.
          Lives only on this device — no account, no cloud.
        </p>
      </div>

      <DrinkForm initial={initial} mode="create" />
    </main>
  );
}
