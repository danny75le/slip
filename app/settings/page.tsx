"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { exportJson, importJson, resetAll } from "@/lib/store";

export default function SettingsPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{
    tone: "good" | "bad";
    text: string;
  } | null>(null);

  const onExport = () => {
    const blob = new Blob([exportJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const stamp = new Date().toISOString().slice(0, 10);
    a.download = `drink-card-export-${stamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ tone: "good", text: "Backup downloaded." });
  };

  const onImport = async (file: File) => {
    try {
      const text = await file.text();
      const { added } = importJson(text);
      setMessage({
        tone: "good",
        text: `Imported ${added} drink${added === 1 ? "" : "s"}.`,
      });
    } catch (e) {
      setMessage({
        tone: "bad",
        text:
          "Import failed: " +
          (e instanceof Error ? e.message : "unknown error"),
      });
    }
  };

  const onReset = () => {
    if (!confirm("Delete ALL drinks? This cannot be undone.")) return;
    resetAll();
    setMessage({ tone: "good", text: "All drinks deleted." });
  };

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
          back of house
        </p>
        <h1 className="font-display tracking-display mt-1 text-[40px] font-medium leading-[0.98] text-ink sm:text-[52px] dark:text-cream">
          Settings<span className="italic text-gold">.</span>
        </h1>
      </div>

      {message && (
        <div
          className={`animate-ink-rise mb-6 flex items-start gap-3 rounded-2xl border px-4 py-3 text-[14px] ${
            message.tone === "good"
              ? "border-green/30 bg-green/[0.07] text-ink dark:border-green-2/40 dark:bg-green-2/[0.10] dark:text-cream"
              : "border-danger/40 bg-danger/[0.08] text-ink dark:border-danger-2/50 dark:bg-danger-2/[0.10] dark:text-cream"
          }`}
        >
          <span
            className={`font-mono text-[10px] uppercase tracking-[0.22em] ${
              message.tone === "good"
                ? "text-green dark:text-green-2"
                : "text-danger dark:text-danger-2"
            }`}
          >
            {message.tone === "good" ? "ok" : "err"}
          </span>
          <span className="flex-1">{message.text}</span>
        </div>
      )}

      <Section
        eyebrow="01 · backup"
        title="Keep your drinks safe"
        body="Drink Card lives only on this device. Export a JSON backup anytime, and reimport it on a new phone."
      >
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onExport}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[14px] font-medium text-cream hover:bg-bean dark:bg-cream dark:text-ink dark:hover:bg-foam"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <path d="m7 10 5 5 5-5" />
              <path d="M12 15V3" />
            </svg>
            Export drinks (.json)
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-cream px-5 py-3 text-[14px] font-medium text-ink hover:border-ink hover:bg-foam dark:border-night-line dark:bg-night-2 dark:text-cream dark:hover:border-caramel"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <path d="m17 8-5-5-5 5" />
              <path d="M12 3v12" />
            </svg>
            Import from file
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onImport(f);
              e.target.value = "";
            }}
          />
        </div>
      </Section>

      <DangerZone onReset={onReset} />

      <p className="mt-10 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-mocha/70 dark:text-caramel/70">
        ⨳ no servers · no accounts · just you and the cup
      </p>
    </main>
  );
}

function Section({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-line bg-cream/90 px-5 py-6 ticket-shadow sm:px-7 dark:border-night-line dark:bg-night-2/90">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mocha dark:text-caramel">
        {eyebrow}
      </p>
      <h2 className="font-display tracking-display mt-1 text-[28px] font-medium leading-tight text-ink sm:text-[32px] dark:text-cream">
        {title}
      </h2>
      <p className="mt-2 mb-5 text-[14px] leading-relaxed text-ink-soft dark:text-caramel">
        {body}
      </p>
      {children}
    </section>
  );
}

function DangerZone({ onReset }: { onReset: () => void }) {
  return (
    <section className="mt-6 overflow-hidden rounded-[24px] border-2 border-dashed border-danger/40 bg-danger/[0.05] px-5 py-6 sm:px-7 dark:border-danger-2/50 dark:bg-danger-2/[0.07]">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-danger dark:text-danger-2">
        02 · danger zone
      </p>
      <h2 className="font-display tracking-display mt-1 text-[28px] font-medium leading-tight text-ink sm:text-[32px] dark:text-cream">
        Wipe the counter clean
      </h2>
      <p className="mt-2 mb-5 text-[14px] leading-relaxed text-ink-soft dark:text-caramel">
        Deletes every drink on this device. Make sure you have a backup.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-2 rounded-full bg-danger px-5 py-3 text-[14px] font-semibold text-cream shadow-md shadow-danger/30 hover:bg-danger-2"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
        Reset all data
      </button>
    </section>
  );
}
