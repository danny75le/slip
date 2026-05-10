"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Drink } from "@/lib/types";
import { upsertImportedDrink } from "@/lib/store";
import { decodeDrinkFromHash } from "@/lib/share";
import { DrinkCard } from "@/components/drink-card";
import { useMounted } from "@/lib/use-mounted";

export default function SharedDrinkPage() {
  const router = useRouter();
  const mounted = useMounted();
  const [saved, setSaved] = useState(false);

  const drink: Drink | null | undefined = useMemo(() => {
    if (!mounted) return undefined;
    return decodeDrinkFromHash(window.location.hash) ?? null;
  }, [mounted]);

  if (drink === undefined) {
    return (
      <main className="mx-auto w-full max-w-2xl px-5 pt-10">
        <p className="font-mono text-xs uppercase tracking-widest text-mocha dark:text-caramel">
          brewing…
        </p>
      </main>
    );
  }

  if (drink === null) {
    return (
      <main className="mx-auto w-full max-w-2xl px-5 pt-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-mocha hover:text-green dark:text-caramel dark:hover:text-green-2"
        >
          <span aria-hidden>←</span>
          home
        </Link>
        <h1 className="font-display tracking-display mt-6 text-3xl text-ink dark:text-cream">
          That share link is empty or invalid.
        </h1>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cream hover:bg-bean dark:bg-cream dark:text-ink dark:hover:bg-foam"
        >
          Go home
        </Link>
      </main>
    );
  }

  const onSave = () => {
    upsertImportedDrink(drink);
    setSaved(true);
    router.push(`/d/${drink.id}`);
  };

  return (
    <main className="mx-auto w-full max-w-2xl px-5 pb-16 pt-8 sm:pt-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-mocha hover:text-green dark:text-caramel dark:hover:text-green-2"
      >
        <span aria-hidden>←</span>
        home
      </Link>

      <div className="mt-6 mb-6">
        <p className="small-caps text-[11px] text-mocha dark:text-caramel">
          someone passed you a card
        </p>
        <h1 className="font-display tracking-display mt-1 text-[36px] font-medium italic leading-[1] text-ink sm:text-[44px] dark:text-cream">
          A drink, on the house.
        </h1>
      </div>

      <div className="animate-ink-rise">
        <DrinkCard drink={drink} />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={saved}
          className="inline-flex items-center gap-2 rounded-full bg-green px-6 py-3.5 text-[15px] font-semibold text-cream brand-glow disabled:opacity-50"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <path d="M17 21v-8H7v8M7 3v5h8" />
          </svg>
          {saved ? "Saved" : "Save to my drinks"}
        </button>
      </div>
    </main>
  );
}
