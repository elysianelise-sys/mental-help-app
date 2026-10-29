# Fixes applied after launch (29 October 2026)

These were applied directly to the production build (`assets/index-mhfix1.js` and `assets/index-mhfix1.css`) because the source was not available at the time. If the React source is added to this repo, apply the same three changes there, or the next build will undo them.

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
