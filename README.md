# Mental Help (web app)

A mobile-first mental wellness web app: notice how you feel, then do one small thing that helps.
UI/UX project by Elise.

- **Live:** https://mental-help-alpha.vercel.app
- **Figma (hi-fi screens):** https://www.figma.com/design/AUItTBis7M5o89P9dCcskv
- **User flow (FigJam):** https://www.figma.com/board/XrMVrKUKm70fdkMmBLDdpO
- **Presentation:** https://mental-help-presentation-chi.vercel.app

## What is in this repo

The repo root is the **production build** (what Vercel serves, with no install or build step). The full **React source** is in `source/`.

```
index.html            entry page (single-page app), generated from source/
favicon.svg
assets/               compiled JS + CSS (hashed names), icons (SVG), photos (JPG)
audio/                calm track (MP3) and rain loop (WAV)
vercel.json           static deploy settings + SPA rewrite (every route -> index.html)
source/               the Vite + React + TypeScript project (src/, package.json, public/, scripts/)
docs/CODEX_HANDOFF.md the full build spec the app was built from
docs/DECISIONS.md     the owner's decisions, including the 29 October updates
docs/FIXES.md         fixes applied after launch (all are in source/)
```

### Changing the app

```
cd source
pnpm install
pnpm dev          # local preview
pnpm build        # writes source/dist
```

Then copy the contents of `source/dist/` over the repo root (replace `index.html`, `assets/`, `audio/`, `favicon.svg`), delete any old `assets/index-*` files that are no longer referenced, commit and push.

## Screens

Home · Check-in (6 emotion orbs, influences, notes, confirmation) · Calm (breathing orb 4/2/6, 10-minute track, rain sounds, sleep timer) · Explore (search, theme filter, save) · Sessions (3 to 8 day packages, mock purchase) · Profile (reduce motion, rain default, clear check-ins).

Data stays on the device (localStorage). No accounts, no backend, no real payments.

## Deploy

Vercel project: **mental-help** in team **UIUX** (`uiux22`). Domains: `mental-help-alpha.vercel.app`, `mental-help-uiux22.vercel.app`.

Connect this repo to that project (Vercel → mental-help → Settings → Git → Connect Git Repository). `vercel.json` makes Vercel serve the files as they are. Every push to `main` then redeploys.

## Design tokens (short)

Font: Plus Jakarta Sans. Colours: primary `#F29BB0`, deep rose `#8F485B`, wine `#713043`, ink `#26181B`, body `#524346`, background `#FFF8F8`, blush `#FFF0F2`. Full tokens: `docs/CODEX_HANDOFF.md` section 23.
