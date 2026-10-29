# DECISIONS.md

These are the answers to the open questions in **CODEX_HANDOFF.md, Section 27**. Every item was decided by the project owner on 6 October 2026.

**Rule for Codex:** where this file and CODEX_HANDOFF.md differ, **this file wins**. Anything not covered here follows the spec's [PROPOSED] recommendation. If something is still unclear, ask before building it.

---

## Must decide before Codex (1–12)

### 1. Platform and stack
- **Mobile-first web app.**
- Stack: **React + Vite + TypeScript + React Router + Motion** (`motion/react`).
- Styling: **CSS Modules + CSS variables**. Do not use Tailwind.
- Deploy target: **Vercel**.
- Desktop and tablet show a centred phone-width column of up to 430px (spec Section 16).

### 2. Emotions
- Use the **six emotions from the mascot HTML**, in this order: **Joyful, Calm, Neutral, Anxious, Depleted, Frustrated.**
- Figma's "Down" is renamed **"Depleted"**.
- All labels, titles, blurbs, colours and motion values come from spec Section 5.3.

### 3. Check-in entry point
- The arrow button on the Home **Self Care / "Daily reflection"** card (`14:845`) opens `/check-in`.
- Do not add any new Check-in button to Home.

### 4. "Step 1 of 2"
- Keep the step tracker.
- **Step 2 is a confirmation view.** Tapping "Save Check-In" saves the entry and moves the tracker to "Step 2 of 2" with both segments filled.
- The confirmation view shows:
  - the selected emotion's orb (about 120px, breathing at that emotion's tempo; static under reduced motion)
  - the heading "Check-in saved"
  - the text "Thank you for checking in."
  - a primary button "Back to Home"
- Build it only from existing components and styles.

### 5. Check-in initial state
- **No emotion is pre-selected**, and **no influence tags are pre-selected**. This overrides the Figma, where Sleep and Meditation appear selected.
- Before an emotion is chosen, the detail card shows the title "How are you feeling?" and the text "Choose the companion closest to how you feel."
- "Save Check-In" stays disabled until an emotion is chosen.

### 6. Profile tab
Build a **minimal `/profile` screen** using existing styles (header, 32px white cards, toggle pills). Add a code comment saying "Not in Figma – approved addition". It contains:
- Samantha's avatar and the name "Samantha"
- **Reduce motion:** System / On / Off (overrides the OS setting app-wide)
- **Rain sounds by default:** On / Off
- **Clear my check-ins:** opens an in-page confirmation sheet, then empties the history
- **About:** "Mental Help · UI/UX assignment"
- No accounts, no sign-in and no email field.

### 7. Sessions: what "Days" means, and pricing
- **"Days" means the package length** (the number of sessions in the package).
- **Optimal Pace = 4 days.** The "Optimal Pace" badge shows only when 4 is selected.
- Mock prices, stored in `src/data/mock/pricing.json`:

| Days | Original | Price | Discount (calculated) |
|---|---|---|---|
| 3 | $60 | $45 | −25% |
| 4 | $80 | $59 | −26% |
| 5 | $100 | $72 | −28% |
| 6 | $120 | $85 | −29% |
| 7 | $140 | $98 | −30% |
| 8 | $160 | $110 | −31% |

- Calculate the discount as `round((1 − price / original) × 100)`. Do not hard-code it.
- The wave slider and the day strip control the **same value** and stay in sync (spec 8.3, Option A).
- Default selection when the screen opens: **4 days**.

### 8. Buy Now
**Mock flow only. There is no real payment and no payment SDK.**
1. Buy Now opens a bottom sheet:
   - title "Confirm your plan"
   - text "{n}-day plan · ${price}"
   - buttons "Confirm" and "Not now"
2. Confirm shows a success state: "You're booked in." / "We'll be in touch with next steps."
3. Save the purchase to localStorage (`mh.purchases.v1`).

### 9. Session progress, completed days and locked days
- **Out of scope. Do not build them.**
- Do not add completed or locked day states, session detail, an active-session screen or session progress.

### 10. Audio
- There are no audio files yet. Use **silent-timer mode** (spec 12.5): the player, progress, breathing and completion all run on a real-time silent timer, using `durationSec` from `tracks.json`.
- Structure the code so MP3s can be dropped into `/public/audio/tracks/` and `/public/audio/ambient/` later, with no code changes apart from adding `src` to `tracks.json`.
- **Audio pauses when the user leaves `/calm`** and resumes from the same position when they return. There is no mini-player.

### 11. Logos (this overrides the "don't replace logos" rule)
- **Replace both logos with the code-drawn orb mark (`LogoMark` SVG)** from the mascot HTML, on **every** screen header:
  - "Mental Help Pink Logo" on Home (`14:972`)
  - "Calm Logo" on the Calm, Explore, Check-in and Sessions headers
- Keep the existing **containers** exactly as in Figma:
  - Home: 32px circle with the ring `rgba(242,155,176,.4)`.
  - Other screens: 36px circle with fill `#FCE7F3` and border `rgba(251,207,232,.6)`.
- Swap only the image inside. Use `alt="Mental Help"`.
- Also use `LogoMark` for the favicon.
- Do not use the old logo PNGs.

### 12. Privacy and feature copy on Check-in
- Change "Private & encrypted" to **"Stored only on this device"**.
- **Remove** "Voice memo supported" and its mic icon.

---

## Implementation details (13–24)

### 13. Undesigned Home buttons
- **Calendar, Insights, Energy → and Stress →** show a toast: "{Feature} is coming soon." For example: "Calendar is coming soon.", "Insights are coming soon.", "Energy details are coming soon.", "Stress details are coming soon."
- **Notifications** opens a small bottom sheet:
  - It lists today's Gentle reminder ("Take three deep breaths before your next task.").
  - If the reminder has been dismissed, the sheet says "You're all caught up."
  - Opening the sheet clears the unread dot.
- **Profile avatar** (in any header) → `/profile`.
- **Evening Calm ▶** → `/calm` and starts playback.
- **Gentle reminder card body** → `/calm`.
- **Dismiss reminder (✓)** hides the card for the rest of the day and shows the toast "Nice. Reminder done for today." with an "Undo" action.

### 14. Explore
- **Begin (+)** on the featured card and the **Evening Grounding →** button open the **Calm player** with that content (`/calm?track=:id`). There is no detail page.
- **Search works.** Tapping the SEARCH pill expands it into a text field. It filters the content list by title, therapist name or theme.
  - No results: "No matches for "{query}"."
  - Clearing the field or pressing Esc collapses the pill.
- **Theme pills** filter the content list. Only one can be selected at a time.
  - Empty result: "Nothing here yet. Try another theme."
- **Save (☆)** toggles saved. The saved state is a filled ★ in `#8F485B`, with the toast "Saved" or "Removed from saved". Persist it in `mh.saved.v1`.
- **Card options (⋮)** and **View all** show the toast "This is coming soon."
- **Preferences (⚙)** → `/profile`.
- The featured card stack is **static** (no swiping).
- Content: only the two items from Figma (Gregory Dickinson's "How do I stop overthinking at night?" and Dr. Maya's "Evening Grounding"). Do not invent more.

### 15. Timer and duration
- The Calm track is **10 minutes**. Change the Home Evening Calm card from "5 min audio" to **"10 min audio"**.
- **Timer** is a sleep timer. Each tap cycles Off → 5m → 10m → 15m → 30m → Off. The label reads "Timer (Off)" or "Timer (15m)", and so on.
  - Default: Off.
  - When the timer runs out, all audio stops and the toast "Timer finished." appears.

### 16. Weekly Mood rules
- **Week:** Monday to Sunday of the current local week.
- **Day dots:**
  - A day with a check-in is `#F29BB0`.
  - Today is `#8F485B` with a bold label.
  - Future days are `#D7C1C5` at 40% opacity.
  - Past days without a check-in are `#D7C1C5` at full opacity.
- **TOP MOOD:** the most frequent emotion this week, counting the latest check-in per day. On a tie, the most recent one wins.
- **"Consistent for N consecutive days":** the number of **consecutive days, ending today or yesterday, that have at least one check-in**.
  - When N = 1, say "1 day".
  - When N = 0, show "Check in today to start a streak."
- **Gauge:** the share of this week's days so far that have a check-in.
- **Energy (80, +12% vs last wk) and Stress (67, −4% lower):** static sample values from `src/data/mock/insights.json`.

### 17. Demo data
- **Yes.** On first launch, seed **5 sample check-ins, Monday to Friday of the current week, mostly Calm**, so Home looks like the Figma.
- Seed only once, using a flag in localStorage.
- "Clear my check-ins" in Profile removes the samples too.

### 18. Contrast fixes (WCAG AA)
| Element | Change |
|---|---|
| Text and icons on the primary pink buttons ("Save Check-In", "Buy Now", "Back to Home", selected influence tags, selected theme pill, Play/Pause icon, Begin + icon) | `#713043` (keep the pink fills) |
| "Guided Calm • 10 min" tag pill text | `#8F485B` |
| Inactive nav labels and icons | `#75636A` |
| Calm timestamps | `#725667` (see item 19) |

Make no other colour changes.

### 19. Unify greys to the brand colours
Replace the cool greys on the Calm and Sessions screens:
- `#111827` and `#1F2937` → `#26181B`
- `#6B7280`, `#4B5563` and `#374151` → `#524346`
- `#9CA3AF` → `#725667`

### 20. Back buttons (updated 6 October 2026)
- **Every top-left back button goes to Home (`/home`), wherever the user came from.** This replaces the earlier "go to the previous screen" behaviour (spec Section 10.3).
- This covers the header back button on Calm, Explore, Check-in, Sessions and Profile, and the in-page "BACK" pill on Buy Sessions.
- Check-in: if there are unsaved changes, still show the "Leave without saving?" sheet first. "Leave" then goes to Home.
- Calm: leaving still pauses the audio and keeps its position (item 10).
- The browser's own back button and swipe gestures are unchanged.

### 21. Sessions sparkles
- **Keep** the sparkle decorations (`14:2762`, `14:2764`) beside the orb companion.
- Remove everything else that belonged to the old cloud image, including the "RKLES" wordmark.

### 22. Check-in draft
- Keep the in-progress check-in (emotion, tags, note) in **sessionStorage**, so it survives a refresh but not closing the tab.
- Clear it after a successful save, or when the user chooses "Leave" in the leave-confirmation sheet.

### 23. Gentle reminder text
- Full sentence: **"Take three deep breaths before your next task."**
- On Home it can still truncate with "…" to one line, as in Figma.

### 24. Check-ins per day
- **Multiple check-ins per day are allowed.** All of them are saved.
- Home (day dots, top mood, streak) uses the **most recent check-in for each day**.

---

## Unchanged (from the spec)
- **Images:** generate none. All mascot, emotion, breathing, progress and session visuals are built in code.
- **Retired:** the cloud PNGs, the four check-in avatar PNGs, the Gentle reminder raster and both old logo PNGs.
- **Existing assets still used:** the Samantha and Gregory Dickinson photos, the UI icons, the Explore grain texture and the Sessions sparkles. Export these from Figma and commit them. Do not hot-link Figma URLs.
- **Always on:** reduced motion, accessibility (spec Section 15) and the "What Codex should not do" list (spec Section 25).

---

## Updates after review (29 October 2026)

The project owner changed these decisions after testing the live app. **Where this section and the numbered items above differ, this section wins.**

- **Explore content (replaces item 14, "only two items"):** every theme now has 2 to 3 sessions, using only the two existing therapists (Gregory Dickinson and Dr. Maya). The first session for a theme is the big card, the rest are listed below it. Search looks across all themes.
- **View all (replaces item 14):** toggles to "Show less" and shows all four themes wrapped, instead of a "coming soon" toast.
- **Buy Sessions back (replaces item 20 for this screen):** only the header back arrow. The in-page "BACK" pill is removed.
- **Confirm your plan sheet (replaces item 8):** one close (X) and a full-width "Confirm". The "Not now" button is removed.
- **Home cards:** can be dragged with a mouse, with two dots below to jump between them.
- **Search field:** soft ring around the whole pill when focused, no square outline.
- **Pages fill the 430px frame** on desktop with one continuous gradient behind the app.
