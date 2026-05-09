"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Drink } from "@/lib/types";
import { saveDrink, deleteDrink } from "@/lib/store";
import { ModifierRowEditor } from "./modifier-row-editor";

export function DrinkForm({
  initial,
  mode,
}: {
  initial: Drink;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<Drink>(initial);

  const onSave = () => {
    const saved = saveDrink({
      ...draft,
      name: draft.name.trim(),
      notes: draft.notes?.trim(),
    });
    router.push(`/d/${saved.id}`);
  };

  const onDelete = () => {
    if (!confirm(`Delete "${draft.name || "this drink"}"?`)) return;
    deleteDrink(draft.id);
    router.push("/");
  };

  const canSave = draft.name.trim().length > 0;

  return (
    <div className="space-y-8">
      <Field
        id="drink-name"
        label="What do you call this one?"
        hint="The name you'll spot at a glance — “Morning regular”, “Saturday treat”, etc."
      >
        <input
          id="drink-name"
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          placeholder="Morning regular"
          className="w-full rounded-2xl border border-line bg-cream/80 px-4 py-3.5 font-display text-2xl tracking-display text-ink placeholder:text-mocha/60 focus:border-green focus:outline-none focus:ring-4 focus:ring-green/15 dark:border-night-line dark:bg-night-2/80 dark:text-cream dark:placeholder:text-caramel/60 dark:focus:border-green-2 dark:focus:ring-green-2/15"
        />
      </Field>

      <div>
        <SectionLabel>Modifiers</SectionLabel>
        <p className="mt-1 mb-4 text-[13px] text-ink-soft dark:text-caramel">
          One row per spec. Add the things you always have to repeat.
        </p>
        <ModifierRowEditor
          rows={draft.rows}
          onChange={(rows) => setDraft({ ...draft, rows })}
        />
      </div>

      <Field
        id="drink-notes"
        label="Note for the barista"
        hint="Optional. Stir gently, light foam, blended, the works."
      >
        <textarea
          id="drink-notes"
          value={draft.notes ?? ""}
          onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
          rows={3}
          placeholder="Anything else: blended, light foam on top, etc."
          className="w-full resize-none rounded-2xl border border-line bg-cream/80 px-4 py-3.5 text-[15px] leading-relaxed text-ink placeholder:text-mocha/60 focus:border-green focus:outline-none focus:ring-4 focus:ring-green/15 dark:border-night-line dark:bg-night-2/80 dark:text-cream dark:placeholder:text-caramel/60 dark:focus:border-green-2 dark:focus:ring-green-2/15"
        />
      </Field>

      <div
        aria-hidden
        className="receipt-divider text-line dark:text-night-line"
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={!canSave}
          className="group inline-flex items-center gap-2 rounded-full bg-green px-6 py-3.5 text-[15px] font-semibold text-cream brand-glow transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <path d="M17 21v-8H7v8M7 3v5h8" />
          </svg>
          {mode === "create" ? "Save drink" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full border border-line bg-cream px-5 py-3.5 text-[14px] font-medium text-ink hover:border-ink hover:bg-foam dark:border-night-line dark:bg-night-2 dark:text-cream dark:hover:border-caramel"
        >
          Cancel
        </button>
        {mode === "edit" && (
          <button
            type="button"
            onClick={onDelete}
            className="ml-auto inline-flex items-center gap-1.5 rounded-full px-4 py-3 text-[13px] font-medium text-danger hover:bg-danger/10 hover:text-danger-2 dark:text-danger-2 dark:hover:bg-danger-2/10"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Delete drink
          </button>
        )}
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block font-display text-[18px] font-medium tracking-display text-ink dark:text-cream"
      >
        {label}
      </label>
      {hint && (
        <p className="mb-2 mt-0.5 text-[13px] text-ink-soft dark:text-caramel">
          {hint}
        </p>
      )}
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-display text-[18px] font-medium tracking-display text-ink dark:text-cream">
      {children}
    </h3>
  );
}
