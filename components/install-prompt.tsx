"use client";

import { useState } from "react";
import { useMounted } from "@/lib/use-mounted";

const DISMISSED_KEY = "drink-card.install-prompt-dismissed.v1";

function isIosSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isIos = /iPhone|iPad|iPod/.test(ua);
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
  return isIos && isSafari;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  type IosNavigator = Navigator & { standalone?: boolean };
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as IosNavigator).standalone === true
  );
}

export function InstallPrompt() {
  const mounted = useMounted();
  const [dismissed, setDismissed] = useState(false);

  if (!mounted) return null;
  if (dismissed) return null;
  if (window.localStorage.getItem(DISMISSED_KEY) === "1") return null;
  if (!isIosSafari()) return null;
  if (isStandalone()) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-cream/90 px-4 py-4 ticket-shadow sm:px-5 dark:border-night-line dark:bg-night-2/90">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-3 left-3 w-[3px] rounded-full bg-green"
      />
      <div className="ml-3 flex items-start gap-4">
        <span
          aria-hidden
          className="mt-0.5 hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green/10 text-green sm:inline-flex dark:bg-green-2/15 dark:text-green-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 17V3" />
            <path d="m7 8 5-5 5 5" />
            <path d="M5 21h14" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <p className="small-caps text-[10px] text-green dark:text-green-2">
            tip · install the card
          </p>
          <p className="mt-0.5 text-[14px] font-medium text-ink dark:text-cream">
            Add Drink Card to your Home Screen.
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-ink-soft dark:text-caramel">
            In Safari, tap{" "}
            <span className="inline-flex h-[18px] w-[18px] -translate-y-[1px] items-center justify-center rounded-md border border-current/40 align-middle text-[10px]">
              ↑
            </span>{" "}
            then choose <em className="font-medium">Add to Home Screen</em>.
            Saved drinks stay safe and the app opens offline.
          </p>
          <button
            type="button"
            onClick={() => {
              window.localStorage.setItem(DISMISSED_KEY, "1");
              setDismissed(true);
            }}
            className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-mocha hover:text-green dark:text-caramel dark:hover:text-green-2"
          >
            don&apos;t show again
          </button>
        </div>
      </div>
    </div>
  );
}
