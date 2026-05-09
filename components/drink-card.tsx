import { Drink } from "@/lib/types";

export function DrinkCard({ drink }: { drink: Drink }) {
  const ts = drink.updatedAt || drink.createdAt;
  const stampStr = ts
    ? new Date(ts)
        .toLocaleDateString(undefined, {
          year: "2-digit",
          month: "short",
          day: "2-digit",
        })
        .toUpperCase()
    : "FRESH";

  return (
    <article className="relative overflow-hidden rounded-[24px] border border-line bg-cream/95 ticket-shadow dark:border-night-line dark:bg-night-2/95">
      <div className="relative px-6 pb-7 pt-7 sm:px-8 sm:pt-8">
        <header className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="small-caps text-[11px] text-mocha dark:text-caramel">
              barista order ticket
            </p>
            <h2 className="font-display tracking-display mt-2 break-words text-[34px] font-medium leading-[0.98] text-ink sm:text-[42px] dark:text-cream">
              {drink.name || (
                <span className="italic text-mocha dark:text-caramel">
                  Untitled drink
                </span>
              )}
            </h2>
          </div>
          <div
            aria-hidden
            className="animate-stamp shrink-0 select-none rounded-full border-[2.5px] border-gold/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-gold dark:border-gold-2/80 dark:text-gold-2"
          >
            {stampStr}
          </div>
        </header>

        <p className="font-mono mt-3 text-[10px] uppercase tracking-[0.22em] text-mocha dark:text-caramel">
          ╴ {drink.rows.length} modifier
          {drink.rows.length === 1 ? "" : "s"} ╶ ready to read
        </p>

        <div
          aria-hidden
          className="receipt-divider mt-6 text-line dark:text-night-line"
        />

        {drink.rows.length > 0 ? (
          <dl className="mt-2 divide-y divide-dashed divide-line dark:divide-night-line">
            {drink.rows.map((row, i) => (
              <div
                key={row.id}
                className="grid grid-cols-[5.5rem_1fr] items-baseline gap-3 py-3 sm:grid-cols-[7rem_1fr] sm:gap-5"
              >
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-mocha dark:text-caramel">
                  <span className="text-green/70 dark:text-green-2/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>{" "}
                  {row.label || "—"}
                </dt>
                <dd className="font-display text-[22px] font-medium leading-tight text-ink sm:text-[26px] dark:text-cream">
                  {row.value || (
                    <span className="italic text-mocha dark:text-caramel">
                      —
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="mt-4 italic text-ink-soft dark:text-caramel">
            No modifiers — just the name.
          </p>
        )}

        {drink.notes && drink.notes.trim().length > 0 && (
          <div className="relative mt-6 rounded-2xl border border-gold/40 bg-gold/[0.10] px-4 py-3.5 dark:border-gold-2/45 dark:bg-gold-2/[0.10]">
            <p className="small-caps mb-1 text-[10px] font-semibold text-gold dark:text-gold-2">
              note for the barista
            </p>
            <p className="whitespace-pre-wrap text-[15px] leading-snug text-ink dark:text-cream">
              {drink.notes}
            </p>
          </div>
        )}

        <div
          aria-hidden
          className="receipt-divider mt-7 text-line dark:text-night-line"
        />
        <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-mocha dark:text-caramel">
          <span>thank you · be kind</span>
          <span className="tabular-nums">
            #{drink.id.slice(0, 6).toUpperCase()}
          </span>
        </div>
      </div>

      <div
        aria-hidden
        className="h-3 w-full"
        style={{
          background:
            "radial-gradient(circle at 7px 12px, transparent 5px, var(--card-edge) 5px) repeat-x",
          backgroundSize: "14px 12px",
        }}
      />
    </article>
  );
}
