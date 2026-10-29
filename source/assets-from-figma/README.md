# assets-from-figma

These files were exported from the Figma file "WEEK10" on 6 October 2026.

Codex: use these files in place of the placeholders listed in `public/assets/PLACEHOLDERS.md`. Copy them into `src/assets/` (or `public/assets/`) as the project prefers. Do not hot-link Figma.

## Icons (`icons/`, 47 SVGs)

- Every icon uses `fill="currentColor"` (or `stroke="currentColor"`), so its colour comes from the CSS `color` of the parent element. Set the colour with tokens; the original Figma colours are listed below.
- Each file keeps its Figma size (`width`/`height`) and `viewBox`, so it can be scaled freely.
- 46 icons were exported directly from Figma and checked against Figma's own export. **`play.svg` was redrawn**, because its vector in Figma (`14:859`) is corrupted and cannot be exported. It is a plain play triangle at the original 11×14 size.
- The 9 Explore icons (therapist, more, clock, users, star, plus, search, settings, moon) come from the card that is rotated −1° in Figma, so they carry that slight tilt. This is invisible at icon size.

| File | Where it's used (Figma node) | Figma colour |
|---|---|---|
| calendar.svg | Home: Calendar button (14:828) | #524346 |
| bell.svg | Home: Notifications button (14:831) | #524346 |
| arrow-right.svg | Home: Open reflection; Explore: Open session; Check-in: Save CTA arrow | #8F485B (muted variant #D7C1C5 on Energy/Stress cards) |
| play.svg | Home: Evening Calm ▶; Calm: play state | #725667 on Home; see contrast rules for Calm |
| chevron-right.svg | Home: "Insights ›" | #8F485B |
| energy.svg | Home: Energy card | #8F485B |
| stress.svg | Home: Stress card | #725667 |
| trend-up.svg / trend-down.svg | Home: Energy/Stress trends | #8F485B / #725667 |
| check.svg | Home: Dismiss reminder | #8F485B |
| nav-home / nav-sessions / nav-explore / nav-calm / nav-profile | Bottom nav | active #B84D6B, inactive #75636A (DECISIONS item 18) |
| back.svg | Header back button (stroke icon, 20px) | #374151 → use #524346 (DECISIONS item 19) |
| back-small.svg | Sessions: "BACK" pill | #26181B |
| verified.svg | Calm: "Licensed Therapist" | #8F485B |
| rewind-15.svg / forward-15.svg | Calm: ±15s buttons (stroke + "15" outlined) | #4B5563 → #524346 |
| pause.svg | Calm: Play/Pause (pause state) | white → #713043 (DECISIONS item 18) |
| verified-badge.svg | Explore: tick on therapist avatar badge | white on #8F485B circle |
| therapist.svg | Explore: "Therapist" label icon | #8F485B |
| more.svg | Explore: card options ⋮ | #524346 |
| clock.svg / users.svg | Explore: "23 Minutes" / "1.2K Users" | #8F485B |
| star.svg | Explore: Save (outline) | #8F485B |
| plus.svg | Explore: Begin session | #713043 (DECISIONS item 18) |
| search.svg / settings.svg | Explore: Search pill / Preferences | #524346 |
| moon.svg | Explore: Evening Grounding card | #8F485B |
| step.svg | Check-in: "Step 1 of 2" | #8F485B |
| tag-sleep … tag-nature (8) | Check-in: influence tags | unselected #524346, selected #713043 |
| help.svg | Sessions: Help & FAQ | #524346 |
| shield-check.svg | Sessions: "Licensed therapist" | #8F485B |
| lock.svg | Sessions: "Confidential & safe" | #8F485B |
| discount-tag.svg | Sessions: "−26%" badge | #8F485B |
| bag.svg | Sessions: Buy Now | #713043 (DECISIONS item 18) |
| bubble-icon.svg | Sessions: speech bubble icon | #8F485B |
| sparkle-small.svg | Sessions: hero sparkle decoration (14:2764) | #F29BB0 |

The second sparkle on the Sessions hero (`14:2762`) is the **Material Symbols Outlined "sparkles"** font glyph, not a vector. Use `sparkle-small.svg` at 18px in `#F29BB0` in its place.

## Photos (`photos/`)

| File | Use | Size |
|---|---|---|
| samantha.jpg | User avatar (header, Profile) | 72×72. This is the original in Figma, so it's sharp at 36px on 2x screens |
| gregory.jpg | Therapist avatar (Explore card) | 161×88. Crop to a circle with `object-fit: cover` |

These are the original image files from Figma. Figma holds no higher-resolution versions.

## Not included (by decision)
- The cloud mascot PNGs, the four check-in avatar PNGs, the Gentle reminder thumbnail and both old logo PNGs are retired. Use code (orb, `LogoMark`) instead (DECISIONS items 11 and 13, and spec Section 14).
- The Explore grain texture is not included. Use a CSS noise overlay at 20% opacity, or leave it out.
