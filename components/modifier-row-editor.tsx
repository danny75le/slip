"use client";

import { ModifierRow } from "@/lib/types";
import { newRow } from "@/lib/store";

const COMMON_LABELS = [
  "Size",
  "Temperature",
  "Milk",
  "Espresso",
  "Syrup",
  "Sweetener",
  "Foam",
  "Ice",
  "Whip",
  "Topping",
];

const QUICK_ADD = COMMON_LABELS.slice(0, 6);

export function ModifierRowEditor({
  rows,
  onChange,
}: {
  rows: ModifierRow[];
  onChange: (rows: ModifierRow[]) => void;
}) {
  const update = (id: string, patch: Partial<ModifierRow>) =>
    onChange(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const remove = (id: string) => onChange(rows.filter((r) => r.id !== id));

  const move = (id: string, dir: -1 | 1) => {
    const idx = rows.findIndex((r) => r.id === id);
    const target = idx + dir;
    if (idx < 0 || target < 0 || target >= rows.length) return;
    const next = rows.slice();
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  };

  const add = (label = "") => onChange([...rows, newRow(label)]);

  return (
    <div className="space-y-3">
      {rows.length === 0 && (
        <div className="rounded-2xl border border-dashed border-line bg-cream/50 px-4 py-5 text-center dark:border-night-line dark:bg-night-2/50">
          <p className="text-[13px] text-ink-soft dark:text-caramel">
            No modifiers yet — start with a quick chip below.
          </p>
        </div>
      )}

      {rows.map((row, i) => (
        <div
          key={row.id}
          className="group relative overflow-hidden rounded-2xl border border-line bg-cream/90 ticket-shadow transition focus-within:border-green focus-within:ring-4 focus-within:ring-green/10 dark:border-night-line dark:bg-night-2/90 dark:focus-within:border-green-2 dark:focus-within:ring-green-2/10"
        >
          <span
            className="pointer-events-none absolute inset-y-3 left-3 w-[3px] rounded-full bg-line dark:bg-night-line group-focus-within:bg-green dark:group-focus-within:bg-green-2"
            aria-hidden
          />
          <div className="grid grid-cols-1 gap-2 px-4 py-3 pl-6 sm:grid-cols-[10rem_1fr] sm:items-center">
            <div className="relative">
              <span
                aria-hidden
                className="font-mono pointer-events-none absolute -top-1 left-0 text-[9px] uppercase tracking-[0.22em] text-mocha/70 dark:text-caramel/70"
              >
                {String(i + 1).padStart(2, "0")} · label
              </span>
              <input
                list="modifier-labels"
                value={row.label}
                onChange={(e) =>
                  update(row.id, { label: e.target.value })
                }
                placeholder="Size"
                className="w-full border-none bg-transparent px-0 pt-3 font-mono text-[12px] uppercase tracking-[0.18em] text-ink placeholder:text-mocha/50 focus:outline-none dark:text-cream dark:placeholder:text-caramel/50"
              />
            </div>
            <div className="relative">
              <span
                aria-hidden
                className="font-mono pointer-events-none absolute -top-1 left-0 text-[9px] uppercase tracking-[0.22em] text-mocha/70 dark:text-caramel/70"
              >
                value
              </span>
              <input
                value={row.value}
                onChange={(e) =>
                  update(row.id, { value: e.target.value })
                }
                placeholder="Grande"
                className="w-full border-none bg-transparent px-0 pt-3 font-display text-[20px] font-medium tracking-display text-ink placeholder:text-mocha/50 focus:outline-none dark:text-cream dark:placeholder:text-caramel/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-1 border-t border-dashed border-line px-3 py-1.5 text-xs dark:border-night-line">
            <button
              type="button"
              onClick={() => move(row.id, -1)}
              disabled={i === 0}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-mocha hover:bg-ink/5 disabled:opacity-25 dark:text-caramel dark:hover:bg-cream/5"
              aria-label="Move up"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m18 15-6-6-6 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => move(row.id, 1)}
              disabled={i === rows.length - 1}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-mocha hover:bg-ink/5 disabled:opacity-25 dark:text-caramel dark:hover:bg-cream/5"
              aria-label="Move down"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <span className="flex-1" />
            <button
              type="button"
              onClick={() => remove(row.id)}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-danger hover:bg-danger/10 hover:text-danger-2 dark:text-danger-2 dark:hover:bg-danger-2/10"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
              remove
            </button>
          </div>
        </div>
      ))}

      <datalist id="modifier-labels">
        {COMMON_LABELS.map((l) => (
          <option key={l} value={l} />
        ))}
      </datalist>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => add()}
          className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-cream hover:bg-bean dark:bg-cream dark:text-ink dark:hover:bg-foam"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add row
        </button>
        <span
          aria-hidden
          className="font-mono text-[10px] uppercase tracking-[0.22em] text-mocha/70 dark:text-caramel/70"
        >
          or quick add
        </span>
        {QUICK_ADD.map((label) => (
          <button
            type="button"
            key={label}
            onClick={() => add(label)}
            className="inline-flex items-center gap-1 rounded-full border border-line bg-cream px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft hover:border-green hover:bg-green/10 hover:text-green dark:border-night-line dark:bg-night-2 dark:text-caramel dark:hover:border-green-2 dark:hover:bg-green-2/10 dark:hover:text-green-2"
          >
            <span aria-hidden>+</span>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
