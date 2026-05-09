# Drink Card

@AGENTS.md

A client-only PWA that shows a customized coffee order to a barista. **No backend, no database, no auth, no API routes** — and please don't add any without reason.

## Verify

- `npm run dev` — local dev (service worker is disabled)
- `npm run build` — production build
- `npm run lint` — ESLint (script is just `eslint`)

## Stack

- Next.js 16 App Router · React 19 · TypeScript (strict) · Tailwind v4 via `@tailwindcss/postcss`
- Path alias: `@/*` → repo root (`@/lib/...`, `@/components/...`)
- Persistence: `localStorage`, accessed only through [lib/store.ts](lib/store.ts)
- Sharing: base64url-encoded JSON in URL hash, via [lib/share.ts](lib/share.ts)
- PWA: [app/manifest.ts](app/manifest.ts), [public/sw.js](public/sw.js), [components/service-worker-register.tsx](components/service-worker-register.tsx)

## Invariants — don't break these

- **Persistence goes through [lib/store.ts](lib/store.ts).** Don't touch `localStorage` directly from components. Use `listDrinks`, `getDrink`, `saveDrink`, `deleteDrink`, `upsertImportedDrink`. Every mutation dispatches a `drink-store-change` event; UI reacts via `subscribe()`. Adding a new mutator? It must call `writeStore` so the event fires.
- **All pages are `"use client"`.** There is no server data path here. Don't introduce server components, server actions, or API routes for state — it has to keep working offline.
- **On-disk shape is versioned.** If you change [lib/types.ts](lib/types.ts) `Store`/`Drink`/`ModifierRow`, bump `STORAGE_KEY` and `schemaVersion` together, and make sure existing exports and `/shared#data=...` links still decode (or migrate them).
- **Sharing is server-less.** [lib/share.ts](lib/share.ts) round-trips a `Drink` through a URL hash. Never POST a drink anywhere for sharing.
- **Service worker is production-only.** It registers from [components/service-worker-register.tsx](components/service-worker-register.tsx) only when `NODE_ENV === "production"`. Test offline behavior with `npm run build && npm start`, not `npm run dev`.
- **SSR-safe browser APIs.** Code that touches `window`, `navigator`, `localStorage`, `crypto.randomUUID`, `matchMedia`, etc. must guard with `typeof window === "undefined"` or run inside `useEffect`. For "only render after hydration", use [lib/use-mounted.ts](lib/use-mounted.ts) — that's the project pattern.
- **Tailwind v4, no config file.** Styles import via `@import "tailwindcss"` in [app/globals.css](app/globals.css). There is intentionally no `tailwind.config.{ts,js}` — don't create one. Theme via CSS, not JS config.

## Map

- [app/page.tsx](app/page.tsx) — list of saved drinks
- [app/new/page.tsx](app/new/page.tsx) — create flow
- [app/d/[id]/page.tsx](app/d/[id]/page.tsx) — detail + share
- [app/d/[id]/edit/page.tsx](app/d/[id]/edit/page.tsx) — edit
- [app/d/[id]/show/page.tsx](app/d/[id]/show/page.tsx) — full-screen barista view (uses Wake Lock API)
- [app/shared/page.tsx](app/shared/page.tsx) — landing for incoming `/shared#data=...` links
- [app/settings/page.tsx](app/settings/page.tsx) — JSON export/import, reset
- [components/](components/) — `DrinkCard` (presentational), `DrinkForm`, `ModifierRowEditor`, `InstallPrompt`, `ServiceWorkerRegister`
- [lib/](lib/) — `store.ts` (data + pub/sub), `share.ts` (hash codec), `types.ts`, `use-mounted.ts`
