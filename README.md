# Quantum Basics website

Marketing site and learner portal for Quantum Basics Nigeria Limited, including the
Academy learning portal (auth, course catalogue, per-user progress).

## Stack

- [TanStack Start](https://tanstack.com/start) (React, file-based routing, SSR)
- TypeScript 7
- Tailwind CSS v4
- [Supabase](https://supabase.com) (auth, Postgres, RLS)
- Deployed as a Cloudflare Worker via [Nitro](https://nitro.build)

## Development

Requires Node.js 22+ and [pnpm](https://pnpm.io).

```sh
pnpm install
cp .env.example .env   # fill in your Supabase project's URL and keys
pnpm dev
```

The dev server runs at `http://localhost:8080`.

## Scripts

- `pnpm dev` — start the dev server
- `pnpm build` — production build (outputs to `.output/`)
- `pnpm build:dev` — development-mode build, useful for debugging build-only issues
- `pnpm preview` — preview a production build locally
- `pnpm format` — run Prettier
- `pnpm exec tsc --noEmit` — typecheck

## Academy auth

Email/password sign-in works out of the box against your Supabase project. Google
sign-in additionally requires the Google provider to be configured under
**Authentication → Providers** in your Supabase dashboard.

## No ESLint (for now)

This project runs TypeScript 7 (the new Go-based compiler). `typescript-eslint`
hasn't shipped support for it yet — it hard-errors when it detects TS >=7.0
([tracking issue](https://github.com/typescript-eslint/typescript-eslint/issues/10940)).
Rather than hold the project back on TypeScript 6, ESLint and its plugins were
removed. `pnpm exec tsc --noEmit` and `pnpm format` (Prettier) still cover
type errors and formatting. Re-add ESLint once `typescript-eslint` supports TS 7.

