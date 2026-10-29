# Mental Help (web app)

A mobile-first mental wellness web app: notice how you feel, then do one small thing that helps.
UI/UX project by Elise.

- **Live:** https://mental-help-alpha.vercel.app
- **Figma (hi-fi screens):** https://www.figma.com/design/AUItTBis7M5o89P9dCcskv
- **User flow (FigJam):** https://www.figma.com/board/XrMVrKUKm70fdkMmBLDdpO
- **Presentation:** https://mental-help-presentation-chi.vercel.app

## What is in this repo

This repo holds the **production build** of the app, exactly as it is live on Vercel (including the 29 October 2026 fixes in `docs/FIXES.md`). It is a static site: no install or build step is needed.

```
index.html            entry page (single-page app)
favicon.svg
assets/               compiled JS + CSS (index-mhfix1.*), icons (SVG), photos (JPG)
audio/                calm track (MP3) and rain loop (WAV)
vercel.json           static deploy settings + SPA rewrite (every route -> index.html)
docs/CODEX_HANDOFF.md the full build spec the app was built from
docs/DECISIONS.md     the project owner's answers to the spec's open questions
docs/FIXES.md         fixes applied after launch, and how to carry them into the source
```

The original React source (Vite + TypeScript + React Router + Motion + CSS Modules) was written by Codex and lives in the Codex workspace. It is **not** in this repo. If you add it later, put it in `src/` with its `package.json`, then change `vercel.json` to build with Vite (`"framework": "vite"`, remove the custom install/build/output lines) and apply the three fixes in `docs/FIXES.md` to the source.

## Screens

Home · Check-in (6 emotion orbs, influences, notes, confirmation) · Calm (breathing orb 4/2/6, 10-minute track, rain sounds, sleep timer) · Explore (search, theme filter, save) · Sessions (3 to 8 day packages, mock purchase) · Profile (reduce motion, rain default, clear check-ins).

Data stays on the device (localStorage). No accounts, no backend, no real payments.

## Deploy

Vercel project: **mental-help** in team **UIUX** (`uiux22`). Domains: `mental-help-alpha.vercel.app`, `mental-help-uiux22.vercel.app`.

Connect this repo to that project (Vercel → mental-help → Settings → Git → Connect Git Repository). `vercel.json` makes Vercel serve the files as they are. Every push to `main` then redeploys.

## Design tokens (short)

Font: Plus Jakarta Sans. Colours: primary `#F29BB0`, deep rose `#8F485B`, wine `#713043`, ink `#26181B`, body `#524346`, background `#FFF8F8`, blush `#FFF0F2`. Full tokens: `docs/CODEX_HANDOFF.md` section 23.
