# Fixes applied after launch (29 October 2026)

These were first applied directly to the production build because the source was not available. **They are now all in the source (`source/`) and the root build is generated from it**, so a rebuild keeps them. Items 1 to 3 are the first round; items 4 onward are the 29 October desktop review (see also the "Updates after review" section in `DECISIONS.md`).

## 1. Close (X) icons rendered as solid squares

**Where:** notifications sheet close, toast dismiss, purchase sheet close, Explore search close.

**Cause:** the shared `Icon` component draws icons with a CSS mask: `mask: url(${src}) center / contain no-repeat`. The close icon is an inline SVG data URI that contains `'` characters, so the unquoted `url()` was invalid. Browsers dropped the mask and painted the whole span, which is a square.

**Fix:** quote the URL in both `mask` and `WebkitMask`:

```ts
mask: `url("${src}") center / contain no-repeat`,
WebkitMask: `url("${src}") center / contain no-repeat`,
```

## 2. Check-in: last companions could not be reached

**Cause:** the six emotion badges were in a horizontal scroll strip with negative side margins. With a mouse (no sideways scroll) or Safari (ignores end padding in scrolling flex rows), the last badges were cut off.

**Fix (CSS module for the Check-in page, `.carousel`):** show all six in a 3 × 2 grid.

```css
.carousel { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px;
            overflow: visible; scroll-snap-type: none; margin: 0 0 12px; padding: 4px 0 9px; }
.carousel :global(.emotion-badge) { width: auto; min-width: 0; height: 124px; }
```

## 3. Check-in detail card: orb jumped, and a pink circle showed behind it

**Cause:** when the emotion changed, `AnimatePresence` kept the old orb while the new one entered. Both were in normal flow inside the 40px slot, so they stacked vertically and the card jumped. The slot also had a flat pink background (`#FAD6E9`) that peeked out when an orb squashed or sank (for example Depleted).

**Fix (`.detailOrbSlot`):** make the slot a positioning box, overlap its children, and only show the placeholder before an emotion is chosen.

```css
.detailOrbSlot { position: relative; display: block; width: 48px; height: 48px; flex: 0 0 48px; overflow: visible; }
.detailOrbSlot > * { position: absolute; inset: 0; display: grid; place-items: center; }
.detailOrbSlot:has(.orb) { background: transparent; }
.detailOrbSlot:not(:has(.orb)) {
  background: radial-gradient(circle at 34% 28%, #fff 0%, #fbe2ec 48%, #f3c3d6 100%);
  box-shadow: inset -6px -8px 16px #8f485b1f;
}
```

## 4. Gradient seams on desktop

**Cause:** page containers (Home, Explore, Sessions, Calm, Profile) were capped at `max-width: 393px` inside the 430px app frame, so Explore's own gradient stopped about 18px short of each side and showed a seam. The frame also had its own gradient that did not line up with the page.

**Fix:** remove the 393px cap on those five containers; draw one fixed gradient behind the whole app (`body::before`) and make `.app-frame` transparent.

## 5. Home cards: no way to reach the second card with a mouse, and a hard clip at the edge

**Cause:** the Featured row is a horizontal scroller. A mouse has no sideways scroll, and the row bled to the 393px container, not to the frame edge.

**Fix:** the cap removal (#4) lets the row bleed to the frame edge. The row can now be dragged with a mouse, and two dots below it jump between cards (`mhCar` helper plus `.carousel-dots` in the Home component).

## 6. Sessions: duplicate Back button

The page had a header back arrow and a second "BACK" pill. The pill is removed (header arrow stays) and the "Buy Sessions" title is left-aligned.

## 7. Confirm sheet: duplicate "Not now" button

The sheet already has a close (X). "Not now" is removed and Confirm is full width.

## 8. Explore: "View all" did nothing, and search focus drew a square outline

- "View all" now toggles to "Show less" and wraps all four theme pills so none is cut off (`xa` state, `.themes-expanded`).
- The search input's square focus outline is replaced with a soft ring around the whole pill (`:focus-within`).

## 9. Explore: theme pills can be dragged, and every theme has content

- The theme pills row can be dragged with a mouse (`source/src/hooks/useDragScroll.ts`, also used by the Home cards).
- Anxiety Relief and Self Compassion were empty. `content.json` now has 11 sessions across the four themes, and each has a matching entry in `tracks.json` (silent-timer mode, like the other placeholder tracks).
- Search now looks across all themes instead of only the selected one.
