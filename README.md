# Slip

A client-only PWA for saving favorite customized restaurant orders — drinks
and food, any restaurant — and showing them across the counter. Built with
[Next.js](https://nextjs.org) 16 (App Router), React 19, TypeScript, and
Tailwind CSS v4. No backend, no accounts: orders live in `localStorage` and
sharing encodes the order in a URL hash.

## Requirements

- Node.js `>=20.9.0` (recommended: see [`.nvmrc`](./.nvmrc))
- npm

## Getting started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Edit [`app/page.tsx`](./app/page.tsx) — the page hot-reloads on save.

## Scripts

| Command             | Description                                    |
| ------------------- | ---------------------------------------------- |
| `npm run dev`       | Start the dev server (Turbopack).              |
| `npm run build`     | Build the production bundle.                   |
| `npm run start`     | Run the production server (after `build`).     |
| `npm run lint`      | Run ESLint.                                    |
| `npm run typecheck` | Run TypeScript in `--noEmit` mode.             |

## Project structure

```
app/                  # App Router routes, layouts, and styles
public/               # Static assets served at the site root
.github/workflows/    # CI: lint, typecheck, build on push and PR
next.config.ts        # Next.js configuration
```

## Deployment

The simplest path to production is the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme). See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for self-hosted options.

## License

[MIT](./LICENSE)
