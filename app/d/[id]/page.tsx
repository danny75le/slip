"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Drink } from "@/lib/types";
import { getDrink, subscribe } from "@/lib/store";
import { buildShareUrl } from "@/lib/share";
import { DrinkCard } from "@/components/drink-card";

export default function DrinkDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [drink, setDrink] = useState<Drink | null | undefined>(undefined);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const refresh = () => setDrink(getDrink(id) ?? null);
    refresh();
    return subscribe(refresh);
  }, [id]);

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
        <BackLink href="/" />
        <h1 className="font-display tracking-display mt-6 text-3xl text-ink dark:text-cream">
          That ticket isn&apos;t in the system.
        </h1>
        <p className="mt-2 text-ink-soft dark:text-caramel">
          It may have been deleted.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cream hover:bg-bean dark:bg-cream dark:text-ink dark:hover:bg-foam"
        >
          Back to drinks
        </Link>
      </main>
    );
  }

  const onShare = async () => {
    const url = buildShareUrl(window.location.origin, drink);
    try {
      type NavigatorWithShare = Navigator & {
        share?: (data: { title?: string; url?: string }) => Promise<void>;
      };
      const nav = navigator as NavigatorWithShare;
      if (nav.share) {
        await nav.share({ title: drink.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    } catch {
      // user cancelled — ignore
    }
  };

  return (
    <main className="mx-auto w-full max-w-2xl px-5 pb-16 pt-8 sm:pt-12">
      <BackLink href="/" />

      <div className="mt-6 animate-ink-rise">
        <DrinkCard drink={drink} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_auto]">
        <button
          type="button"
          onClick={() => router.push(`/d/${drink.id}/show`)}
          className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-green px-6 py-3.5 text-[15px] font-semibold text-cream brand-glow transition active:scale-[0.98]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4v6" />
            <path d="m9 7 3-3 3 3" />
            <rect x="4" y="10" width="16" height="11" rx="2" />
          </svg>
          Show across the counter
          <span aria-hidden className="ml-1 transition group-hover:translate-x-0.5">
            →
          </span>
        </button>
        <Link
          href={`/d/${drink.id}/edit`}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-cream px-5 py-3.5 text-[14px] font-medium text-ink hover:border-ink hover:bg-foam dark:border-night-line dark:bg-night-2 dark:text-cream dark:hover:border-caramel"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" />
          </svg>
          Edit
        </Link>
        <button
          type="button"
          onClick={onShare}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-cream px-5 py-3.5 text-[14px] font-medium text-ink hover:border-ink hover:bg-foam dark:border-night-line dark:bg-night-2 dark:text-cream dark:hover:border-caramel"
        >
          {copied ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <path d="m8.59 13.51 6.83 3.98" />
                <path d="m15.41 6.51-6.82 3.98" />
              </svg>
              Share
            </>
          )}
        </button>
      </div>
    </main>
  );
}

function BackLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-mocha hover:text-green dark:text-caramel dark:hover:text-green-2"
    >
      <span aria-hidden>←</span>
      back
    </Link>
  );
}
