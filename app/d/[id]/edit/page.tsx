"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Drink } from "@/lib/types";
import { getDrink, subscribe } from "@/lib/store";
import { DrinkForm } from "@/components/drink-form";

export default function EditDrinkPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [drink, setDrink] = useState<Drink | null | undefined>(undefined);

  useEffect(() => {
    const refresh = () => setDrink(getDrink(id) ?? null);
    refresh();
    return subscribe(refresh);
  }, [id]);

  return (
    <main className="mx-auto w-full max-w-2xl px-5 pb-16 pt-8 sm:pt-12">
      <Link
        href={`/d/${id}`}
        className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-mocha hover:text-green dark:text-caramel dark:hover:text-green-2"
      >
        <span aria-hidden>←</span>
        back
      </Link>

      <div className="mt-6 mb-8">
        <p className="small-caps text-[11px] text-mocha dark:text-caramel">
          revise the recipe
        </p>
        <h1 className="font-display tracking-display mt-1 text-[40px] font-medium leading-[0.98] text-ink sm:text-[52px] dark:text-cream">
          Edit{" "}
          <span className="italic text-gold">card</span>.
        </h1>
      </div>

      {drink === undefined && (
        <p className="font-mono text-xs uppercase tracking-widest text-mocha dark:text-caramel">
          brewing…
        </p>
      )}
      {drink === null && (
        <p className="text-ink-soft dark:text-caramel">
          That ticket isn&apos;t in the system. It may have been deleted.
        </p>
      )}
      {drink && <DrinkForm initial={drink} mode="edit" />}
    </main>
  );
}
