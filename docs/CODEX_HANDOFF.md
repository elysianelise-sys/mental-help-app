# CODEX_HANDOFF.md

**Project:** Mental Help, a mental wellbeing mobile app (UI/UX assignment)
**Version:** 1.0 (spec only, no production code)
**Prepared:** 1 October 2026
**Sources:**

| Source | Role | Location |
|---|---|---|
| Figma file "WEEK10" | **Visual source of truth** for screens, layout, copy, colors, spacing | `figma.com/design/AUItTBis7M5o89P9dCcskv/WEEK10` (page `0:1`) |
| `Calm Mascot Direction.html` | **Mascot and motion source of truth**: emotion states, breathing, orb, badges, wave, session companion, reduced motion | The published "Calm Mascot Direction" page, version 1 |

> **Note on the HTML file.** This spec was checked against version 1 of the published "Calm Mascot Direction" page. If your local copy of `Calm Mascot Direction.html` has since been edited, the HTML values in Sections 5, 13 and 23 may need re-checking.

---

## How to read this document

Every statement is tagged so ChatGPT and Codex never mistake a proposal for something that exists.

| Tag | Meaning |
|---|---|
| **[CONFIRMED – FIGMA]** | Exists in the Figma file as described. Node IDs are given where available. |
| **[CONFIRMED – HTML]** | Defined in `Calm Mascot Direction.html`. |
| **[PROPOSED]** | Not designed. This is a recommendation, and it should only be built if it is approved. |
| **[NEEDS DECISION]** | The design is ambiguous or contradicts itself. You must choose. The open items are collected in Section 27. |

**Precedence rule.** For UI layout, colors, type, spacing and copy, Figma wins. For the mascot, orb, emotion states, breathing and motion, the HTML wins. Where the two conflict, the conflict is listed in Section 27.

---

## 0. Critical findings (read first)

These findings change how the app must be built. Each one is explained in full later in the document.

1. **The Figma frame named "Profile" (`14:1295`) is actually the Check-in screen.** Its header reads "Check-in" and its content is the mood check-in. **There is no Profile or Settings screen in Figma**, even though the bottom nav has a Profile tab.
2. **The "Session" frame (`14:1440`) is a purchase screen titled "Buy Sessions".** It offers a 3–8 day package picker, a "Recommended frequency" slider, a price ($80 → $59, −26%) and a "Buy Now" button. There is **no session detail, active session, completed day, locked day or session-progress screen** in Figma.
3. **"Session - Hover" (`14:1605`) differs from "Session" in only two ways.** The speech bubble is straight (0°) instead of tilted (−8°), and an empty 36px header button is missing. Nothing else changes.
4. **Home has no visible entry point into Check-in.** The likeliest candidate is the "Daily reflection" card, but that is not confirmed.
5. **Figma's check-in carousel has 4 emotions (Joyful, Neutral, Anxious, Down), and the layer numbering skips "2."** The HTML defines 6 (Joyful, Calm, Neutral, Anxious, Depleted, Frustrated). The detail card reads "Calm & Centered", which only exists in the HTML set.
6. **Check-in says "Step 1 of 2", but Step 2 is not designed**, and the only button says "Save Check-In".
7. **No audio files, notifications, calendar, insights, search, Explore detail, checkout or settings screens exist.**
8. **Copy that makes claims about privacy.** Check-in shows "Private & encrypted" and "Voice memo supported". With localStorage and no recording UI, neither claim would be true. See Section 27.
9. **Contrast.** White text on the primary pink `#F29BB0` measures **2.08:1**, which fails WCAG AA. This affects "Save Check-In", "Buy Now" and the selected influence tags. See Section 15.

---

## 1. APP OVERVIEW

### 1.1 Purpose
- **[CONFIRMED – FIGMA]** A calm, supportive wellbeing app. Its features are daily mood check-ins, guided calm audio with breathing, an Explore library of therapist-led content, and purchasable therapist sessions.
- **[CONFIRMED – FIGMA]** The app name appears as **"Mental Help"**: in the Explore H1 (`14:1262`), in the Home header logo layer "Mental Help Pink Logo" (`14:972`), and in the subtitle "Improve your mental health." (`14:1264`).

### 1.2 Target user
- **[CONFIRMED – FIGMA]** The persona is **Samantha** ("Hello, Samantha 👋", `14:825`), an adult who tracks her mood daily, uses evening wind-down audio and considers therapist sessions.
- **[PROPOSED]** The broader audience is young adults to adults managing everyday stress, anxiety, sleep and overthinking. This is inferred from the content: "How do I stop overthinking at night?", "Sleep Rituals", "Anxiety Relief". The app is not aimed at crisis users.

### 1.3 Primary user goal
- **[PROPOSED]** "Notice how I feel, then do one small thing that helps." The core loop is check in → see a supportive reflection → breathe or listen → see your week.

### 1.4 Overall experience and design philosophy
- **[CONFIRMED – FIGMA]** The visual language is soft blush and rose pastel. It uses rounded pills (radius 9999), 32px cards, gentle glows, Plus Jakarta Sans throughout, and low-contrast decorative gradients.
- **[CONFIRMED – HTML]** The motion philosophy is "Make the mascot breathe instead of pose." Mood is shown through **form, light and tempo instead of a face**. The app uses **one body with many states**, and it follows **acknowledge, then soothe** for distressed states.

### 1.5 Role of the mascot
- **[CONFIRMED – FIGMA]** A fluffy 3D lavender cloud appears in the Calm player (`14:1039`), the Sessions hero (`14:2760`) and the header logos ("Calm Logo"). Four separate avatars appear in Check-in.
- **[CONFIRMED – HTML]** These are to be replaced by **one code-native orb** with three roles:
  - **Calm = Pacer.** The orb leads the user's breathing.
  - **Check-in = Mirror.** The orb reflects the selected feeling.
  - **Sessions = Companion.** The orb is awake and buoyant, with one satellite per selected day.

### 1.6 Emotional tone
- **[CONFIRMED – FIGMA]** The tone is warm, gentle and non-judgemental: "Keep your head up.", "Unwind gently.", "Gentle reminder", "Gentle Notes", "Add a gentle thought or reflection...".
- **[CONFIRMED – HTML]** Avoid anything childish. There are no cheeks, mouths or tears, and distressed states settle into calm instead of mirroring distress back.

---

## 2. COMPLETE FIGMA SCREEN INVENTORY

All frames are 390px wide on page `0:1`. Figma contains six frames and no components or component sets. Repeated elements (header, nav, pills, cards) are duplicated per frame, so Codex must turn them into shared components.

### 2.1 Frame list

| # | Figma frame name | Node ID | What it actually is | Size | Bottom nav | Header title |
|---|---|---|---|---|---|---|
| 1 | Home | `14:817` | Home dashboard | 390×1105 | Yes (Home active) | "Home" |
| 2 | Calm | `14:1014` | Guided calm audio player with mascot and breathing cue | 390×884 | Yes (Calm active) | "Calm" |
| 3 | Explore | `14:1146` | Content discovery | 390×974 | Yes (Explore active) | "Explore" |
| 4 | **Profile** | `14:1295` | **Check-in (Step 1 of 2)**, misnamed in Figma | 390×1071 | **No** (sticky CTA instead) | "Check-in" |
| 5 | Session | `14:1440` | **Buy Sessions** purchase screen | 390×980 | Yes (Sessions active) | "Sessions" |
| 6 | Session - Hover | `14:1605` | Buy Sessions with the speech bubble in its hover state | 390×980 | Yes (Sessions active) | "Sessions" |

### 2.2 Per-screen summary

| Screen | Purpose | Entry point | Exit / navigation | Major UI elements | Interactive elements | States in Figma | Missing states |
|---|---|---|---|---|---|---|---|
| **Home** `14:817` | Daily overview and launchpad | App launch; "Home" tab | Bottom nav; card buttons (destinations mostly undefined) | Greeting, calendar and notification buttons, horizontal featured carousel (Self Care, Evening Calm), "Your week at a glance", Weekly Mood card, Energy and Stress cards, Gentle reminder | Calendar, Notifications, Open reflection →, Play calm audio ▶, Insights ›, Energy →, Stress →, Dismiss reminder ✓, carousel scroll, nav | Default only. Friday is "today"; Saturday and Sunday are dimmed future days. Notifications show an unread dot | Loading, empty (new user, no check-ins), reminder dismissed, error |
| **Calm** `14:1014` | Guided audio with breathing | "Calm" tab; probably Home "Evening Calm" ▶ | Back (header), nav | Tag pill "Guided Calm • 10 min", mascot card with glow, breathing cue capsule, track title and therapist, waveform, scrubber, timestamps, rewind 15, play/pause, forward 15, Rain Sounds toggle, Timer (15m) | Back, Play/Pause, ±15s, scrubber, Rain Sounds, Timer | Playing state only (pause icon shown, 04:15 of 10:00, Rain Sounds on) | Paused, loading, error, completed, reduced-motion |
| **Explore** `14:1146` | Discover therapist-led content | "Explore" tab | Back, nav, card buttons (undefined) | Search pill, Preferences gear, H1 "Mental Help", featured stacked card (therapist, prompt, 23 Minutes, 1.2K Users, save ☆, begin +), "Recommended Themes" with category pills, "Evening Grounding" mini card | Search, Preferences, Card options ⋮, Save ☆, Begin +, View all, category pills, Open session → | "Calm Mind" pill selected | Search UI, detail page, saved state, empty/filter result, loading, error |
| **Check-in** `14:1295` | Log current mood, influences and an optional note | **Undefined** (see Section 0, item 4) | Back (header), "Save Check-In →" | Step tracker "Step 1 of 2" with "DAILY RITUAL" badge, 2-segment progress, question, mood companion carousel (4 items), active emotion detail card, influence tags (8), Gentle Notes textarea, sticky CTA | Back, emotion buttons, tag toggles (multi-select), textarea, Save | Sleep and Meditation pre-selected; detail card shows "Calm & Centered" | Emotion selected style, Step 2, saving, saved, error, validation |
| **Buy Sessions** `14:1440` | Choose and buy a therapist session package | "Sessions" tab | Header back, in-page "BACK" pill, Help ?, nav | Speech bubble "Get your mental health in order." (−8°), cloud hero with glow blobs and sparkles, "Recommended frequency" with "Optimal Pace", wave slider with thumb, day strip 3–8 (4 active), assurance row, checkout card ($80 → $59, −26%, "Discount applied", Buy Now) | Back ×2, Help & FAQ, slider thumb, day buttons, Buy Now | 4 Days active | Purchase flow, success, failure, owned or active package, loading |
| **Buy Sessions – Hover** `14:1605` | Hover variant | n/a | same | Same as above | same | Speech bubble at 0° (straight); empty 36px header button `14:1480` absent | n/a |

---

## 3. HOME SCREEN (`14:817`)

### 3.1 Layout
- **[CONFIRMED – FIGMA]** The page background is a vertical gradient from `#FFF5F7` through `#FFF8F8` to `#FFF0F2` on base `#FFF8F8`. Content padding is 20px on the sides, and sections are 24px apart. The max width is 393px.
- **[CONFIRMED – FIGMA]** The sticky header (`14:968`) has a white background at 85%, a 12px backdrop blur, a 1px bottom border `rgba(252,226,231,.4)` and the shadow `0 1px 12px rgba(242,155,176,.12)`. It has 48px top padding (status bar) and a 64px row.
- **[CONFIRMED – FIGMA]** The fixed bottom nav (`14:980`) is described in Section 10.

### 3.2 Element-by-element

| Element | Node | Copy / content | Tap behaviour | Status |
|---|---|---|---|---|
| Header logo | `14:972` | "Mental Help Pink Logo" PNG, 32px circle, ring `rgba(242,155,176,.4)` | None | [CONFIRMED – FIGMA] Not interactive |
| Header title | `14:974` | "Home" (18/26 SemiBold) | None | [CONFIRMED – FIGMA] |
| Profile avatar | `14:1775` | Samantha photo, 36px, 2px ring `#FCE7F3` | **Not defined in Figma.** [PROPOSED] Navigate to `/profile` | [NEEDS DECISION] |
| Greeting | `14:823`, `14:825` | "Hello," (14 Medium `#524346`) / "Samantha 👋" (28/36 ExtraBold, −0.7 tracking) | None | [CONFIRMED – FIGMA]. The name comes from `currentUser.firstName` |
| Calendar button | `14:827` | 44px white circle, calendar icon | **No destination in Figma.** [PROPOSED] Disabled-looking no-op, or a toast saying "Calendar is coming soon" | [NEEDS DECISION] |
| Notifications button | `14:830` | 44px circle, bell, 8px `#8F485B` unread dot with a 2px white ring | **No destination in Figma.** [PROPOSED] Open a simple notifications sheet listing the gentle reminder(s); hide the dot once viewed | [NEEDS DECISION] |
| Featured carousel | `14:836` | Horizontal scroll, 191px tall. Card 1 is 310.8px wide; card 2 peeks in from the right | Swipe or scroll horizontally | [CONFIRMED – FIGMA] |
| Card 1: Self Care | `14:837` | Eyebrow "SELF CARE"; H2 "Keep your head up."; meta "Daily reflection"; 40px button with → (`14:845` "Button - Open reflection") | **Destination undefined.** [PROPOSED] Opens `/check-in`. "Daily reflection" matches Check-in's "DAILY RITUAL" | [NEEDS DECISION] |
| Card 2: Evening Calm | `14:848` | Eyebrow "EVENING CALM"; H2 "Unwind / gently."; meta "5 min audio"; 40px white ▶ button (`14:857` "Button - Play calm audio") | [PROPOSED] Navigate to `/calm` and start playback. **Conflict:** the card says "5 min audio" but the Calm screen says "10 min" | [NEEDS DECISION] |
| Section heading | `14:862` | "Your week at a glance" (18/26 Bold) | None | [CONFIRMED – FIGMA] |
| Insights link | `14:863` | "Insights ›" (12 Bold `#8F485B`) | **No destination.** [PROPOSED] Hide it, or show "Insights are coming soon" | [NEEDS DECISION] |
| Weekly Mood card | `14:867` | Pink dot + "Weekly Mood"; badge "TOP MOOD"; "Calm" + "Consistent for 5 consecutive days"; semicircle gauge SVG (`14:882`); day row Mon–Sun | Not interactive in Figma | [CONFIRMED – FIGMA] Visual. The data rules are [PROPOSED] (Section 6.5) |
| Day row | `14:887` | Mon–Thu: `#F29BB0` dot, Medium. **Fri: `#8F485B` dot, Bold `#8F485B` text (today).** Sat and Sun: `#D7C1C5` dot at 40% opacity (future) | None | [CONFIRMED – FIGMA] |
| Energy card | `14:917` | Icon in 28px `#FFD9E0` circle; "Energy"; → icon; "80"; trend icon "+12% vs last wk" (`#8F485B`); progress 80% `#F29BB0` on `#FFF0F2` | → **destination undefined** | [CONFIRMED – FIGMA] Visual; the data source is [NEEDS DECISION] |
| Stress card | `14:937` | Icon in 28px `#FDD9EC` circle; "Stress"; →; "67"; "-4% lower" (`#725667`); progress 67% `#725667` on `#FFE8EC` | → **destination undefined** | same |
| Gentle reminder | `14:957` | `#FEDAE1` card; 48px round image thumb (`14:959`, a raster of the cloud); "Gentle reminder"; "Take three deep breaths before…" (truncated in Figma) | Card body: [PROPOSED] Open `/calm` | [CONFIRMED – FIGMA] Visual |
| Dismiss reminder | `14:965` | 32px button with a **checkmark** icon. Its layer name is "Button - Dismiss reminder" | [PROPOSED] Mark the reminder done: the card fades and collapses (200ms, opacity and height) and is stored as dismissed for today | [CONFIRMED – FIGMA] The button exists; its behaviour is [PROPOSED] |

### 3.3 Home states

| State | Status | Recommended behaviour |
|---|---|---|
| Default (populated) | [CONFIRMED – FIGMA] | As designed, from mock or persisted data |
| Empty (first launch, no check-ins) | [PROPOSED] | Weekly Mood: "No check-ins yet" plus the helper "Check in once a day to see your week take shape." Gauge empty, all day dots `#D7C1C5`. Hide the TOP MOOD badge |
| Today checked in | [PROPOSED] | Today's dot uses the today style (`#8F485B`) plus a filled marker. The Self Care card meta could read "Checked in today" |
| Reminder dismissed | [PROPOSED] | Card removed until tomorrow. If you prefer it to come back, use an "undo" toast |
| Loading | [PROPOSED] | Local data loads synchronously, so no spinner is needed. If any async loading is added, show skeleton cards in `#FFF0F2` with a pulse. Reduced motion: no pulse |
| Error (corrupt local data) | [PROPOSED] | Reset to empty and show a toast: "We couldn't load your saved check-ins, so we've started fresh." |

---

## 4. CALM / BREATHING EXPERIENCE (`14:1014`)

### 4.1 Layout (top to bottom)

| # | Element | Node | Spec | Status |
|---|---|---|---|---|
| 1 | Header | `14:1016` | Back button (36px white circle with border `#FCE7F3`), "Calm Logo" (36px), title "Calm" | [CONFIRMED – FIGMA] |
| 2 | Tag pill | `14:1031` | `#FFF0F2` background, border `#FBDBE1`, 8px dot `#E86383`, text "Guided Calm • 10 min" (12 SemiBold `#D66F87`) | [CONFIRMED – FIGMA] |
| 3 | Mascot container | `14:1035` | 224px card (radius 24) with a −12px blurred glow `rgba(249,168,212,.5)` around it, holding a 192px cloud PNG (`14:1039`) | [CONFIRMED – FIGMA] Container. **The cloud PNG is replaced by `BreathingOrb`** [CONFIRMED – HTML] |
| 4 | Breathing cue capsule | `14:1040` | `#FFF0F2` pill, border `#FCE7F3`, emoji "💨", text "Breathe out..." (12 SemiBold `#8F485B`) | [CONFIRMED – FIGMA]. The text becomes dynamic (4.4) |
| 5 | Track info | `14:1046` | "Unwind Your Thoughts" (24/32 Bold, `#111827`), "with Gregory Dickinson" • ✓ "Licensed Therapist" (`#8F485B`) | [CONFIRMED – FIGMA] |
| 6 | Waveform | `14:1059` | 18 bars, 6px wide, rounded. Played bars `#8F485B`, near-playhead bars `#F29BB0`, unplayed bars `#FAD6E9` | [CONFIRMED – FIGMA]. Replaced by `BreathWave` [CONFIRMED – HTML], keeping the Figma colors |
| 7 | Scrubber | `14:1078` | 8px track `#FCE2E7`, fill `#F29BB0` (42.5%), 16px thumb `#8F485B` with a 2px white border and shadow | [CONFIRMED – FIGMA] |
| 8 | Timestamps | `14:1082` | "04:15" / "10:00", 12px monospace `#9CA3AF` | [CONFIRMED – FIGMA] |
| 9 | Controls | `14:1088` | Rewind 15 (48px white), Play/Pause (64px, gradient `#F29BB0` → `#F47290` at 45°, shadow `#FBCFE8`), Forward 15 (48px), 28px gap | [CONFIRMED – FIGMA] |
| 10 | Toggles | `14:1106` | "💧 Rain Sounds" with a 6px green `#10B981` active dot; "🌙 Timer (15m)" | [CONFIRMED – FIGMA] |
| 11 | Bottom nav | `14:1879` | Calm active | [CONFIRMED – FIGMA] |

### 4.2 Breathing system [CONFIRMED – HTML]
- **Cycle:** inhale **4s**, hold **2s**, exhale **6s**, for a **12s** total. This is one constant (`BREATH`) shared by the orb, the halo, the wave and the capsule label, so they can never drift apart.
- **Orb scale keyframes:** `[0.84, 1, 1, 0.84]` at times `[0, 4/12, 6/12, 1]`, eased with `easeInOut`, repeating forever while playing.
- **Halo:** opacity `[0.35, 0.85, 0.85, 0.35]` and scale `[0.9, 1.05, 1.05, 0.9]` on the same timing. The blur is baked into a radial gradient and is **never animated**.
- **Orb colors:** Calm emotion: core `#FFF1F4`, mid `#F7C6D4`, edge `#D9C3EE`.
- **Orb fill:** `radial-gradient(circle at 34% 28%, core 0%, mid 48%, edge 100%)`, plus an inset shadow (edge at about 45%), an inset white highlight and an outer drop shadow tinted with the edge color.
- **Orb size in this slot:** about 200px diameter, inside the existing 224px container. [PROPOSED] Keep the Figma container card and glow, and swap only the image for the orb.

### 4.3 Playback ↔ breathing relationship
- **[PROPOSED]** The orb breathes only while the audio is **playing**. When paused, it eases to the rest scale of 0.92 over 0.6s and the capsule shows "Paused".
- **[PROPOSED]** The breathing cycle restarts at inhale every time play is pressed. It is not tied to the audio timestamp.
- **[NEEDS DECISION]** Should the breath cycle be tied to audio scripts (for example, the narrator saying "breathe in" at specific timestamps)? The recommendation is no for this assignment.

### 4.4 Breathing instructions (capsule copy)

| Phase | Copy | Status |
|---|---|---|
| Inhale (0–4s) | "Breathe in..." | Phase names [CONFIRMED – HTML]. The "..." punctuation matches Figma |
| Hold (4–6s) | "Hold..." | [CONFIRMED – HTML] |
| Exhale (6–12s) | "Breathe out..." | [CONFIRMED – FIGMA] |
| Paused | "Paused" | [PROPOSED] |
| Completed | "Session complete" | [PROPOSED] |

The capsule keeps the 💨 emoji from Figma. The label updates at least every 150ms, and the capsule is an `aria-live="polite"` region (Section 15).

### 4.5 Controls behaviour

| Control | Behaviour | Status |
|---|---|---|
| Play/Pause | Toggles playback. The icon swaps between ▶ and ❚❚. The label reads "Play" or "Pause" | Button [CONFIRMED – FIGMA]; behaviour [PROPOSED] |
| Rewind 15 | Seek to `max(0, t − 15)` | [PROPOSED] |
| Forward 15 | Seek to `min(duration, t + 15)`. Reaching the end triggers completion | [PROPOSED] |
| Scrubber | Drag or tap to seek. Arrow keys move ±5s (Section 15) | [PROPOSED] |
| Timestamps | Elapsed on the left, **total duration** on the right (Figma shows "10:00") | [PROPOSED] Right side shows total, not remaining |
| Rain Sounds | Toggles an ambient loop layered under the track. Green dot = on | [PROPOSED]; the default state (on) is [CONFIRMED – FIGMA] |
| Timer (15m) | **Meaning unclear.** The track is 10 min but the timer says 15m | [NEEDS DECISION]. Option A: a sleep timer that stops all audio after N minutes and cycles Off → 5m → 10m → 15m → 30m. Option B: remove it |
| Back (header) | Leave Calm. Audio behaviour is in Section 12.6 | [NEEDS DECISION] |

### 4.6 Completion, restart, exit
- **[PROPOSED] Completion.** When the track ends:
  - Playback stops and the orb settles to 0.92.
  - The capsule reads "Session complete".
  - The play button becomes a ↻ "Replay" button.
  - An optional inline message appears under the title: "Nicely done. Take that calm with you."
  - Nothing else is designed.
- **[PROPOSED] Restart.** Replay seeks to 0 and starts playback again.
- **[PROPOSED] Exit.** Back returns to the previous route, or to `/home` if there is no history.

### 4.7 Reduced motion [CONFIRMED – HTML]
- The orb is static at scale 0.92 and the halo is static at 0.5 opacity.
- The breath wave is drawn once as a static path.
- **The capsule text keeps cycling** through "Breathe in..." / "Hold..." / "Breathe out..." on the 4/2/6 timing, so the breathing guidance stays available without motion.
- Button hover and tap scale effects are removed.

### 4.8 Accessibility (Calm-specific)
- The orb and the wave are decorative (`aria-hidden`).
- The capsule is a live region.
- Every control has an accessible name: "Play", "Pause", "Rewind 15 seconds", "Forward 15 seconds", "Rain sounds, on" or "Rain sounds, off", "Sleep timer".
- The scrubber is a `slider` with `aria-valuetext` such as "4 minutes 15 seconds of 10 minutes".
- See Sections 12 and 15.

---

## 5. EMOTION / CHECK-IN (`14:1295`, misnamed "Profile")

### 5.1 Layout (top to bottom)

| # | Element | Node | Spec | Status |
|---|---|---|---|---|
| 1 | Header | `14:1297` | Back, Calm Logo, title "Check-in", avatar | [CONFIRMED – FIGMA] |
| 2 | Step tracker | `14:1314` | Icon + "Step 1 of 2"; badge "DAILY RITUAL" (`rgba(250,214,233,.6)` background, 11 Bold uppercase `#8F485B`); two 8px segments: active `#F29BB0` with a glow, inactive `#FCE2E7` | [CONFIRMED – FIGMA] |
| 3 | Question | `14:1327`, `14:1329` | "How are you feeling right now?" (28/36 SemiBold, centred) / "Select the companion that best resonates with your headspace today." (14/22) | [CONFIRMED – FIGMA] |
| 4 | Mood companion carousel | `14:1331` | Horizontal scroll, 130px tall. Each item is a 96px-wide button, radius 32, 90% white, holding a 64px `#FFF0F2` circle with a 56px avatar and a 12 SemiBold label | [CONFIRMED – FIGMA] Container. **Avatars are replaced by `EmotionBadge` orbs** [CONFIRMED – HTML] |
| 5 | Active emotion detail card | `14:1364` | `rgba(255,240,242,.9)` background, radius 32, 40px icon circle `#FAD6E9`, title "Calm & Centered" (18 SemiBold), blurb "A tranquil headspace, breathing easily." (14/22) | [CONFIRMED – FIGMA]. [PROPOSED] Replace the 40px icon with a 40px orb of the selected emotion (HTML shows 84px; **use the Figma size of 40px**) |
| 6 | Influences | `14:1375` | "What's influencing this feeling?" / "Select all that apply". 8 pill tags with icons: **Sleep, Meditation** (pre-selected: `#F29BB0` fill, white text, glow); **Work, Family, Health, Social, Finances, Nature** (unselected: `#FFF0F2` fill, border, `#524346` text) | [CONFIRMED – FIGMA] |
| 7 | Gentle Notes | `14:1415` | Label "Gentle Notes" plus "Optional"; textarea (radius 32, `rgba(255,240,242,.8)`, placeholder "Add a gentle thought or reflection..."); footer with mic icon + "Voice memo supported" and "Private & encrypted" | [CONFIRMED – FIGMA]. The footer copy is [NEEDS DECISION] (Section 27) |
| 8 | Sticky CTA | `14:1433` | Full-width pill `#F29BB0`, "Save Check-In" (18 Bold white) with an → icon, over a fade gradient | [CONFIRMED – FIGMA] |

There is **no bottom nav** on this screen [CONFIRMED – FIGMA]. It behaves as a focused flow.

### 5.2 Flow

| Step | Behaviour | Status |
|---|---|---|
| Enter | From [NEEDS DECISION]. The recommended entry is the Home Self Care card →. Route `/check-in` | [PROPOSED] |
| Initial state | **[NEEDS DECISION]** Option A: no emotion selected, the detail card shows a prompt ("Choose the companion closest to how you feel."), and Save is disabled. Option B: Calm pre-selected, matching the Figma detail card. **The recommendation is A**, because pre-selecting a feeling can bias the answer | |
| Select emotion | Tap a badge. It becomes `aria-checked="true"` and gets the selected style (5.4). The detail card updates its title, blurb and orb. Only one emotion can be selected (radio group) | Behaviour [PROPOSED]; the radio pattern is [CONFIRMED – HTML] |
| Influences | Multi-select toggles (`aria-pressed`). Pre-selection of Sleep and Meditation is [NEEDS DECISION]: keep it as a default, start empty, or reuse the last check-in's tags | |
| Note | Optional free text. [PROPOSED] Maximum 500 characters, with a counter at 450 or more | |
| Save | Validates that an emotion is selected, then saves (Section 6) and navigates to **[NEEDS DECISION] Step 2** or `/home` | |
| Step 2 of 2 | **Not designed.** Options: (a) change the tracker to "Step 1 of 1" and remove it; (b) build a minimal Step 2, "Here's something for how you feel", recommending one item (for example Anxious → Calm audio, Depleted → Evening Grounding); (c) treat Step 2 as the confirmation screen | [NEEDS DECISION] |
| Confirmation | [PROPOSED] Return to Home with the toast "Check-in saved. Thank you for checking in." The Weekly Mood card updates | |
| Edit | **Not designed.** [PROPOSED] No editing UI for the assignment. A second check-in on the same day is saved as a new entry (Section 6.4) | [NEEDS DECISION] |
| Back / cancel | If the form has changes, show an in-page confirmation sheet: "Leave without saving?" with the buttons "Keep editing" and "Leave". Otherwise go back | [PROPOSED] |

### 5.3 Emotion states [CONFIRMED – HTML]

The canonical values come from `emotions.ts` in the HTML. The CSS demo keyframes in the HTML are illustrative; where they differ, **`emotions.ts` wins** (see the note under the table).

| Key | Badge label | Detail title | Detail blurb | Core → Mid → Edge | Tempo (s per loop) | Float (% vertical drift) | Squash | Settles? | Motion description |
|---|---|---|---|---|---|---|---|---|---|
| `joyful` | Joyful | Light & Open | Buoyant and bright today. | `#FFF4D6` → `#FFD3B0` → `#F6A98F` | 2.6 | 9 (rises) | 0.03 | No | Lifts and stretches slightly upward. The warmest color |
| `calm` | Calm | Calm & Centered | A tranquil headspace, breathing easily. | `#FFF1F4` → `#F7C6D4` → `#D9C3EE` | 6 | 0 | 0 | n/a (home state) | Slow, even scale 0.93 ↔ 1 |
| `neutral` | Neutral | Steady | Nothing pulling hard either way. | `#FFFFFF` → `#EEE3E7` → `#CDBAC2` | 8 | 2 | 0 | No | Barely drifts |
| `anxious` | Anxious | Restless | On edge. Let's slow it down together. | `#F4EEFF` → `#D6CBF2` → `#A9A2DE` | 1.4 | 1 | 0.02 | **Yes** | Restless ripple and small rotation (±2°) |
| `depleted` | Depleted | Running Low | Rest counts as progress. | `#F3ECEF` → `#CDBFC7` → `#9C8494` | 7 | −4 (sinks) | 0.10 | No | Sits low and flattened, dimmer (opacity 0.88) |
| `frustrated` | Frustrated | Heat Near the Surface | Notice it, then let some of it go. | `#FFF0EC` → `#F6B3A6` → `#DC8590` | 1.8 | 0 | 0.04 | **Yes** | Short, dense pulse |

Note: the HTML's CSS demo uses slightly different amplitudes (for example, Depleted translateY 5–7% with scale 1.05–1.07 × 0.91–0.88). Codex should implement the `emotions.ts` parameters, using the keyframe shapes `y: [0, −float%, 0]`, `scaleX: [1, 1 + squash × 0.6, 1]` and `scaleY: [1, 1 − squash, 1]`, plus the Anxious/Frustrated rotation `[0, 2, −2, 1, 0]°`.

**Mapping from Figma names:** Joyful (Figma "Joyful star") → `joyful`; Neutral ("Neutral pebble") → `neutral`; Anxious ("Anxious cloud") → `anxious`; **Down ("Down droplet") → `depleted`** (renamed in the HTML); **Calm** and **Frustrated** are new in the HTML. The final label set is [NEEDS DECISION]: confirm the six HTML labels.

**Order in the carousel.** [PROPOSED] Joyful, Calm, Neutral, Anxious, Depleted, Frustrated (the HTML order). This also fills the missing "2." slot in the Figma layer numbering with Calm.

### 5.4 Per-emotion behaviour details [CONFIRMED – HTML]
- **Appearance.** A circle orb with the gradient fill from 4.2. Badge orb: 52px in code (HTML), shown in Figma's 64px `#FFF0F2` circle slot. [PROPOSED] Use a 56px orb to match the Figma avatar size.
- **Selected state.** A 2px border in primary rose on the 96px badge button, and the background changes to the light blush surface.
  - The HTML used `#E9879F`, which is a presentation colour. Use the Figma primary `#F29BB0` for the border.
  - Use `#FFF0F2` for the surface.
- **Unselected state.** The Figma style: `rgba(255,255,255,.9)` background, border `rgba(252,231,243,.6)`.
- **Hover** (pointer devices only). A one-time wiggle, rotate `[0, −4, 3, −1.5, 0]`° over 0.6s. The badge's idle animation pauses while hovered.
- **Pressed.** Scale 0.94 with a spring (stiffness 420, damping 18).
- **Transition between emotions.** [PROPOSED] Crossfade the detail-card orb colors over 400ms and restart the motion loop on the new tempo. The text swaps without animation.
- **Settling (Anxious, Frustrated).** On selection, the orb shows its own motion. After **3500ms** it switches to the Calm tempo (6s) with float 0 and no rotation.
  - Detail-card helper copy while settling: "Noticing it…", then "Settling into a slower rhythm, breathe with it."
  - This copy is [CONFIRMED – HTML] demo copy and needs a decision to keep it. The recommendation is to keep it.
  - The settling timer resets if the user selects something else.
- **Reduced motion.** No loops, wiggle or scale. The orb is static at its resting shape (Depleted keeps its flattened shape and 0.88 opacity, so the state is still readable). Settling copy still appears.
- **Badges never rely on color alone.** Every badge has a text label and its own distinct motion.

---

## 6. CHECK-IN DATA MODEL

### 6.1 Required fields

| Field | Type | Notes |
|---|---|---|
| `id` | string | A UUID (`crypto.randomUUID()`) |
| `createdAt` | string (ISO 8601) | The device's local time, with its offset |
| `emotion` | `"joyful" \| "calm" \| "neutral" \| "anxious" \| "depleted" \| "frustrated"` | One value |
| `influences` | string[] | May be empty. Allowed values: `"sleep" \| "meditation" \| "work" \| "family" \| "health" \| "social" \| "finances" \| "nature"` |

### 6.2 Optional fields

| Field | Type | Notes |
|---|---|---|
| `note` | string | Maximum 500 characters. Omit it when empty |
| `updatedAt` | string (ISO 8601) | Only if editing is ever added |

Do not store: voice memos (no recording UI exists), location, energy or stress scores (not collected on this screen), or a derived "mood score".

### 6.3 Example

```json
{
  "id": "6f1d1a7e-2c1b-4d8e-9a8f-1b2c3d4e5f60",
  "createdAt": "2026-10-02T21:14:05+08:00",
  "emotion": "anxious",
  "influences": ["sleep", "work"],
  "note": "Big presentation tomorrow."
}
```

### 6.4 Persistence and editing
- **[PROPOSED]** Store check-ins in localStorage under the key `mh.checkins.v1` as an array, newest last, alongside a schema `version: 1`.
- **[PROPOSED]** Allow multiple check-ins per day. Home uses the **latest check-in per day** for the day dots and for "today".
- **[PROPOSED]** Editing and deleting individual entries are out of scope (no UI). The only deletion is "Clear my data" in Profile (Section 11), if approved.

### 6.5 Derived data for Home (Weekly Mood card)
- **Week.** [PROPOSED] Monday to Sunday of the current local week (Figma shows Mon–Sun).
- **Day dot.** Filled `#F29BB0` if that day has a check-in, `#8F485B` with a bold label for today, and `#D7C1C5` at 40% opacity for future days. **[NEEDS DECISION]** Past days without a check-in are not designed. The recommendation is `#D7C1C5` at full opacity.
- **TOP MOOD.** [PROPOSED] The most frequent `emotion` among this week's latest-per-day entries. On a tie, the most recent one wins. Show its label (for example "Calm").
- **"Consistent for N consecutive days".** **[NEEDS DECISION]** Should N be the streak of consecutive days that **have a check-in**, or the streak of days whose **mood equals the top mood**? The recommendation is the first (a check-in streak); it is simpler and more encouraging.
- **Gauge (`14:882`).** **[NEEDS DECISION]** What does the semicircle represent? The recommendation is the share of this week's days that have a check-in.
- **Energy (80) and Stress (67).** **[NEEDS DECISION]** The check-in flow collects neither. The recommendation is static mock values from `mock/insights.json`, labelled as sample data in the code.

---

## 7. EXPLORE (`14:1146`)

### 7.1 Existing content [CONFIRMED – FIGMA]

| Element | Node | Copy / spec | Tap behaviour |
|---|---|---|---|
| Atmosphere | `14:1195`, `14:1199`, `14:1200` | Blush gradient with a grain SVG overlay (20% opacity, overlay blend) and two blurred glow circles | Decorative |
| Search pill | `14:1252` | 🔍 "SEARCH" (12 SemiBold uppercase, 0.6px tracking) | **Undefined.** [PROPOSED] Expands into a text field that filters by title, therapist or theme over the local catalogue |
| Preferences | `14:1257` | 40px gear button | **Undefined.** [PROPOSED] Navigate to `/profile` (preferences) |
| Title | `14:1262`, `14:1264` | "Mental Help" (32/40 Bold `#3C2C30`) / "Improve your mental health." | none |
| Featured card stack | `14:1201` | Two decorative under-sheets (rotated −3° and +1°) beneath the main card (340px wide, rotated −1°, radius 32, 95% white) | **[NEEDS DECISION]** Is the stack swipeable (Tinder-style) or static? The recommendation is static, with an optional "next card" swipe as polish |
| Therapist row | `14:1205` | 44px photo with a verified badge, "Gregory Dickinson", icon + "Therapist", ⋮ "Card options" (32px) | ⋮ **undefined**. [PROPOSED] Hide it, or open a sheet with "Save" / "Not for me" |
| Prompt | `14:1225`, `14:1229` | "How do I stop overthinking at night?" / "Gently unpack cognitive rumination through guided evening thought anchors." | none |
| Meta | `14:1232` | ⏱ "23 Minutes" • 👥 "1.2K Users" | none |
| Save | `14:1245` | 48px `#FFF0F2` circle with a ☆ icon | [PROPOSED] Toggles saved. The filled star state is not designed; use a filled ★ in `#8F485B` with the label "Saved" |
| Begin session | `14:1248` | 56px `#F29BB0` circle with a **+** icon | **[NEEDS DECISION]** The layer is named "Begin session" but the icon is "+" (add). The recommendation is to open the content detail (`/explore/:id`) or play it in the Calm player |
| Section | `14:1269`, `14:1271` | "Recommended Themes" + "View all" | View all **undefined**. [PROPOSED] Hide it, or show the full catalogue list |
| Category pills | `14:1272` | **Calm Mind** (selected: `#F29BB0` fill, `#713043` text), Sleep Rituals, Anxiety Relief, Self Compassion (white, border). Horizontal scroll | [PROPOSED] Single-select filter on the list below |
| Mini card | `14:1281` | 48px `#FAD6E9` circle with 🌙 icon, "Evening Grounding" / "3-step wind down with Dr. Maya", 36px → "Open session" | [PROPOSED] Open detail or player, the same as Begin |

### 7.2 Proposed functionality
- **[PROPOSED] Catalogue.** `mock/content.json` with 4–8 items. Each item has `id`, `title`, `description`, `therapistName`, `therapistRole`, `durationMinutes`, `userCountLabel`, `themes[]`, `audioSrc?` and `featured?`. Gregory Dickinson's item and Evening Grounding are the two confirmed items. Any others are placeholders and must be marked as such.
- **[PROPOSED] Filtering.** The selected pill filters the mini-card list. When no items match, show the empty state (Section 21).
- **[PROPOSED] Detail page `/explore/:id`.** Not designed. If approved, keep it minimal: reuse the featured card layout full-width, then the "Begin" button. **Alternatively, skip the detail page** and have Begin go straight to `/calm?track=:id`. **[NEEDS DECISION]**, with skipping recommended to avoid inventing a screen.
- The Explore bottom nav has Explore active.

---

## 8. SESSIONS ("Buy Sessions", `14:1440`)

> **Important.** Figma shows **only a package-purchase screen.** The items in your brief that were requested but **not designed** are: the Sessions landing list, session detail, active session, completed day, locked day, session progress and completion. These are listed in 8.6 as [NEEDS DECISION] and are not specified as if they exist.

### 8.1 Layout [CONFIRMED – FIGMA]

| # | Element | Node | Spec |
|---|---|---|---|
| 1 | App header | `14:1469` | Back (36px), Calm Logo, "Sessions" (**20/28 Bold `#1F2937`**, which differs from the other headers), an **empty 36px "Button"** (`14:1480`), avatar |
| 2 | In-page header row | `14:2743` | "BACK" pill (← + 11 SemiBold uppercase), title "Buy Sessions" (18 Bold), 32px "?" Help & FAQ |
| 3 | Speech bubble | `14:2851` | Blush card (`rgba(253,226,232,.95)`, border `rgba(244,166,184,.5)`, radius 16), white 24px icon circle, "Get your mental health / in order." (11 Bold `#713043`), with a tail. **Rotated −8°.** Overlaps the top-left of the hero |
| 4 | Hero | `14:2755` | Three blurred glow blobs and a 340×340 cloud PNG (`14:2760`) with a fog fade at the bottom, a "sparkles" glyph (Material Symbols, `#F29BB0`) and a small sparkle icon |
| 5 | Frequency header | `14:2769` | "Recommended frequency" + "Optimal Pace" badge (`#FDE2E8`, `#8F485B`) |
| 6 | Wave slider | `14:2774` | Organic wave SVG track: full track in light pink with a filled portion (0–52.5%) in rose. A 28px thumb (white with a 2px `#F29BB0` border, 12px `#F29BB0` centre, 32px halo `rgba(242,155,176,.4)`) sits at about 52% |
| 7 | Day strip | `14:2783` | Buttons 3, 4, 5, 6, 7, 8 + "Days". Inactive: 48×64, radius 16, `#FFF0F2`, number 18 Bold `#524346`, "Days" 11 Medium at 70% opacity. **Active (4):** 76–84px wide × 67px, white, 2px border `rgba(242,155,176,.4)`, glow, number 22 ExtraBold `#26181B` + 8px `#F29BB0` dot, "Days" 12 Bold `#8F485B`, 24×4 underline bar `#F29BB0` |
| 8 | Assurance row | `14:2818` | ✓ "Licensed therapist" • 🔒 "Confidential & safe" |
| 9 | Checkout card | `14:2831` | White, radius 16. "Total" with ~~$80~~; **$59** (16 ExtraBold) + badge "−26%"; "Discount applied". Buy Now: 56px pill, gradient `#F29BB0` → `#F4A6B8`, bag icon, "Buy Now" (18 Bold white), max width 170px |
| 10 | Bottom nav | `14:1981` | Sessions active |

### 8.2 Mascot hero → SessionCompanion [CONFIRMED – HTML]
- Replace the cloud PNG with `SessionCompanion`:
  - A 320px box with a **176px Joyful orb** breathing on the 4/2/6 cycle.
  - **One 18px satellite orb (Calm fill) per selected day**, on a 128px orbit radius, evenly spaced and starting at 12 o'clock.
  - The whole ring rotates 360° every 60s (linear).
  - Satellites spring in (stiffness 180, damping 17) with a 40ms stagger.
- Changing the day count re-keys the satellites, so they animate in fresh.
- Whole companion: hover scale 1.02 and tap scale 0.97, with a spring (260/16).
- Keep the Figma glow blobs and fog fade. **Remove** the raster's baked-in sky, the "RKLES" wordmark and the sparkles that belong to the image. [NEEDS DECISION] Whether to keep the separate Figma sparkle glyphs (`14:2762`, `14:2764`); the recommendation is to keep them as subtle decoration.
- Reduced motion: no rotation, breathing or springs. Satellites are shown statically at their positions.

### 8.3 How the controls work functionally

| Control | Behaviour | Status |
|---|---|---|
| Day strip (3–8) | Single-select (radio group). Selecting a value updates `selectedDays`, the satellites, the slider thumb position and the price | Visual [CONFIRMED – FIGMA]; behaviour [PROPOSED] |
| Wave slider | **[NEEDS DECISION]** Two controls appear to set the same value. **Option A (recommended):** the slider is a second input for `selectedDays` and snaps to 3–8; dragging it updates the strip, and tapping the strip moves the thumb. Option B: the slider is a read-only indicator of where the "Optimal Pace" sits | |
| "Optimal Pace" badge | [PROPOSED] Shown when `selectedDays` equals the recommended value. **[NEEDS DECISION]** Which value is recommended? Figma implies 4 | |
| What "Days" means | **[NEEDS DECISION]** "Recommended frequency" + "4 Days" could mean 4 sessions per week, or a 4-day package. This changes the copy and the price logic | |
| Price | **[NEEDS DECISION]** Only 4 days = $80 → $59 (−26%) is shown. Prices for 3, 5, 6, 7 and 8 must be supplied. [PROPOSED] Put a price table in `mock/pricing.json`, and calculate the percentage as `round((1 − price/original) × 100)` | |
| Buy Now | **[NEEDS DECISION]** No checkout is designed. **Recommendation:** a mock purchase with no real payment. Show an in-page confirmation sheet ("Confirm 4-day plan for $59?" → "Confirm" / "Not now"), then a success state "You're booked in. We'll be in touch with next steps." and store the purchase in localStorage | |
| BACK pill vs header back | **[NEEDS DECISION]** There are two back buttons. The recommendation is to keep the header back (a consistent pattern) and remove the "BACK" pill, or make both go to the previous route | |
| Help & FAQ | **Undefined.** [PROPOSED] Open a bottom sheet with 3–4 static FAQs | |
| Empty header button `14:1480` | Probably a leftover "Favorite" button (the parent layer is named "Right: Favorite Button + Samantha's Avatar"). **Do not render it** | [PROPOSED] |

### 8.4 Benefits / assurance
- **[CONFIRMED – FIGMA]** This is a static row: ✓ "Licensed therapist" • 🔒 "Confidential & safe". It is not interactive.

### 8.5 Sessions states in Figma
- Default (4 Days selected), and the hover variant (Section 9).

### 8.6 Requested but not designed [NEEDS DECISION]

| Requested item | Exists? | Minimal option if you want it |
|---|---|---|
| Sessions landing (list of sessions) | No. The Sessions tab opens Buy Sessions | Keep it as is: the tab = Buy Sessions |
| Session detail | No | Skip |
| Active session (live therapist session) | No | Skip. Real therapy sessions cannot be simulated meaningfully |
| Completed day / locked day | No | If you want a "plan progress" concept, the day buttons could show completed (check) and locked (lock, 40% opacity) states. **This is a new design and needs a Figma decision first** |
| Session progress / completion | No | Skip, or after a mock purchase show "4-day plan · Day 0 of 4" under the checkout card (new design) |

---

## 9. SESSION INTERACTION STATES

| State | Element | Visual change | Functional change | Status |
|---|---|---|---|---|
| Default | Speech bubble | Rotated **−8°** | none | [CONFIRMED – FIGMA] `14:2851` |
| Hover | Speech bubble | Rotates to **0°** (straight). Size otherwise the same | none | [CONFIRMED – FIGMA] `14:1805` in the "Session - Hover" frame. [PROPOSED] Trigger it while the pointer is over the hero or companion, and animate over 300ms with a spring |
| Hover (mobile) | n/a | Touch has no hover. [PROPOSED] Apply the straightened bubble briefly on **press** of the companion (tap), then return | [PROPOSED] |
| Default | Day button | `#FFF0F2`, 48×64 | Selectable | [CONFIRMED – FIGMA] |
| Selected | Day button | White, wider (about 76–84px), border, glow, larger number, dot and underline bar | `selectedDays` = value | [CONFIRMED – FIGMA] |
| Pressed | Day button / Buy Now / companion | Not in Figma. [PROPOSED] Scale 0.96 over 100ms | | [PROPOSED] |
| Focus | All controls | Not in Figma. [PROPOSED] A 2px `#8F485B` outline with a 3px offset | | [PROPOSED] |
| Disabled | Buy Now | Not in Figma. [PROPOSED] 50% opacity while a confirmation is open or a purchase is in progress | | [PROPOSED] |
| Completed / Locked | Day button | **Not in Figma** | | [NEEDS DECISION] (8.6) |
| Header difference | Empty 36px button | Present in "Session", absent in "Hover" | Not rendered in either (8.3) | [CONFIRMED – FIGMA] |

---

## 10. NAVIGATION

### 10.1 Bottom navigation [CONFIRMED – FIGMA]
- **Frame.** Fixed to the bottom, 390px wide, 95% white with a 12px blur, a top border `rgba(252,226,231,.6)`, **top corners radius 24**, shadow `0 −4px 20px rgba(242,155,176,.15)`, padding 11px top and 24px bottom (home indicator), and a 128×12 spacer.
- **Items (in order):** Home, Sessions, Explore, Calm, Profile. Each item has an icon in a 40×28 pill and an 11px label.
- **Active item:** pill background `#FCDDE4`, label 11 Bold `#B84D6B`.
- **Inactive item:** no pill, label 11 Medium `#8D7A80`.
- **Shown on:** Home, Calm, Explore and Sessions. **Hidden on:** Check-in.
- **Profile tab:** **No screen exists.** [NEEDS DECISION] (Section 11).

### 10.2 Navigation map

```
/home                          [CONFIRMED – FIGMA]
├─ Self Care card →            → /check-in            [PROPOSED – NEEDS DECISION]
├─ Evening Calm ▶              → /calm (autoplay)     [PROPOSED]
├─ Gentle reminder card        → /calm                [PROPOSED]
├─ Notifications               → notifications sheet  [PROPOSED – NEEDS DECISION]
├─ Calendar                    → none / coming soon   [NEEDS DECISION]
├─ Insights / Energy / Stress  → none / coming soon   [NEEDS DECISION]
└─ Avatar                      → /profile             [PROPOSED]

/check-in                      [CONFIRMED – FIGMA, frame "Profile"]
└─ Save Check-In               → /home (+ toast) or Step 2   [NEEDS DECISION]

/calm                          [CONFIRMED – FIGMA]

/sessions  (Buy Sessions)      [CONFIRMED – FIGMA]
├─ Help ?                      → FAQ sheet            [PROPOSED]
└─ Buy Now                     → confirm sheet → success state  [PROPOSED – NEEDS DECISION]

/explore                       [CONFIRMED – FIGMA]
├─ Search                      → inline search        [PROPOSED]
├─ Preferences ⚙               → /profile             [PROPOSED]
├─ Begin + / Open →            → /calm?track=:id  or /explore/:id   [NEEDS DECISION]
└─ View all                    → none / list          [NEEDS DECISION]

/profile                       [PROPOSED – not designed]
```

### 10.3 Back behaviour
- **[PROPOSED]** The header back button calls `navigate(-1)`. If there is no history (for example on a deep link), it navigates to `/home`.
- **[NEEDS DECISION]** The Calm, Explore and Sessions screens are **tab roots** but show a back button in Figma. The recommendation is to keep the button visible (it matches Figma) and use the fallback rule above.
- Check-in back: confirm before discarding changes (5.2).

### 10.4 Modals and sheets
- **[PROPOSED]** All undesigned secondary UI uses one reusable **BottomSheet**: notifications, FAQ, purchase confirmation, leave-without-saving and card options.
  - Style: white, top radius 32, 20px padding, dim overlay `rgba(38,24,27,.35)`.
  - Behaviour: closes on overlay tap or Esc, traps focus, and returns focus to the trigger when closed.
  - Never use the browser's `alert` or `confirm`.

### 10.5 Exiting a session / navigating while audio plays
- See 12.6. **[NEEDS DECISION]** The recommended default is to **pause when leaving `/calm`**, because there is no designed mini-player.

---

## 11. PROFILE / SETTINGS

- **[CONFIRMED – FIGMA]** **No Profile or Settings screen exists.** The frame named "Profile" is Check-in. The Profile tab, the header avatar and the Explore ⚙ have no destination.
- **[NEEDS DECISION]** Choose one:
  - **A (recommended, minimal):** build a simple `/profile` from existing components (header, 32px cards, toggle pills), clearly marked as an addition beyond the Figma file. Contents:
    - **Profile:** avatar, "Samantha", a static email placeholder.
    - **Preferences:**
      - Reduce motion: System / On / Off
      - Ambient rain default: On / Off
      - Daily reminder: On / Off (UI only, no real notifications)
    - **Your data:** "Clear my check-ins" with in-page confirmation.
    - **About:** app version and the assignment credit.
  - **B:** the Profile tab shows "Profile is coming soon" and nothing else.
  - **C:** remove the Profile tab (this changes the Figma nav, so it is not recommended).
- Accessibility settings: only **Reduce motion** is proposed. Text size follows the OS and browser.
- Do not build accounts, sign-in or cloud sync.

---
## 12. AUDIO SYSTEM

### 12.1 Assets
- **[CONFIRMED]** **No audio files exist** in Figma or in the HTML.
- **[PROPOSED]** Structure the audio as a manifest so files can be added later without code changes:
  - `public/audio/tracks/unwind-your-thoughts.mp3`
  - `public/audio/ambient/rain-loop.mp3`
  - `src/data/tracks.json` with the fields `id`, `title`, `therapist`, `therapistRole`, `durationSec` (fallback), `src`, `ambientDefault: "rain"`
- **[NEEDS DECISION]** Where the audio comes from. The user supplies royalty-free files (recommended), or the app uses **simulated playback** (12.5).

### 12.2 Engine
- **[PROPOSED]** A single global `AudioProvider` that owns two `HTMLAudioElement`s: a **track** element and an **ambient** element (loop = true, volume 0.35 relative to the track).
- The track element is created once and survives route changes.
- Use `preload="metadata"`, and read the duration from the file. Fall back to `durationSec` from the manifest.

### 12.3 Behaviour table

| Action | Behaviour |
|---|---|
| Play | `track.play()`. If Rain Sounds is on, also play the ambient loop. This must start from a user tap (browser autoplay rules). The "Evening Calm ▶" button on Home counts as the user gesture, so autoplay on arrival at `/calm` is allowed. If `play()` rejects, show the play button in its paused state |
| Pause | Pause both elements. The orb rests |
| Restart | `currentTime = 0`, then play |
| Seek / ±15s | Clamp to `[0, duration]` |
| Progress | Update from `timeupdate`, throttled to rAF, for the scrubber and timestamps. The wave clip uses `currentTime / duration` |
| Completion | On `ended`: stop the ambient loop, set status to `completed` (4.6), and record a `calmSessionsCompleted` count (optional, for a later "Insights") |
| Volume | **No volume control in Figma.** [PROPOSED] Rely on device volume. No in-app slider |
| Mute | Not designed. Rain Sounds off removes the ambient layer. [PROPOSED] No master mute |
| Rain Sounds toggle | Starts or stops the ambient loop immediately, and persists the choice in preferences |
| Timer | [NEEDS DECISION] (4.5) |
| Load failure | On `error` or a stalled load over 8s: status `error`. Show the inline message "We couldn't load this audio. Check your connection and try again." with a "Try again" button. The orb stays static. The capsule shows breathing guidance on the silent timer, so the user can still breathe along |
| Missing file (placeholder mode) | See 12.5 |

### 12.4 Audio state shape
`{ trackId, status: 'idle' | 'loading' | 'playing' | 'paused' | 'completed' | 'error', currentTime, duration, ambientOn, sleepTimerMin | null }`

### 12.5 Placeholder / simulated audio
- **[PROPOSED]** If a track has no `src`, the player runs a **silent timer** at real time, using `durationSec`. All the UI works: progress, breathing, completion.
- A small note under the title, "Preview mode – audio coming soon", is [NEEDS DECISION]. The recommendation is to show it only in development builds.

### 12.6 Navigation while playing
- **[NEEDS DECISION]**
  - **A (recommended):** pause automatically when leaving `/calm`, and resume from the same position when the user returns.
  - **B:** keep playing in the background. This needs a mini-player that is not in Figma, so it is not recommended.
- Whichever option is chosen, playback pauses when the tab is hidden **only if** the browser forces it; nothing extra is added.

---

## 13. MASCOT / MOTION SYSTEM [CONFIRMED – HTML unless tagged]

### 13.1 Components
- **`Orb`.** The base visual: a circle with the radial gradient fill and shadows. Props: `emotion`, `size`.
- **`BreathingOrb`.** An Orb with the halo and the breath cycle (Calm, Sessions).
- **`EmotionBadge`.** A badge button with a looping emotion motion (Check-in).
- **`SessionCompanion`.** A BreathingOrb (Joyful) with orbiting satellites (Sessions).
- **`BreathWave`.** An SVG wave whose amplitude follows the breath cycle (Calm).
- **`LogoMark`.** A static SVG orb with closed-eye arcs (header logo). **[NEEDS DECISION]** whether to use it (Section 14).

### 13.2 Breathing cycle

| Phase | Duration | Orb scale | Halo opacity | Halo scale | Easing |
|---|---|---|---|---|---|
| Inhale | 4s | 0.84 → 1.00 | 0.35 → 0.85 | 0.90 → 1.05 | easeInOut |
| Hold | 2s | 1.00 | 0.85 | 1.05 | n/a |
| Exhale | 6s | 1.00 → 0.84 | 0.85 → 0.35 | 1.05 → 0.90 | easeInOut |
| Paused / reduced motion | n/a | 0.92 (0.6s ease to rest) | 0.5 | 1.0 | n/a |

### 13.3 Emotion motion
See the table in 5.3 for tempo, float, squash and settling. Every loop uses easeInOut and repeats forever.

### 13.4 BreathWave
- Width matches the waveform slot (334px in Figma). Height 40px.
- One path is sampled every 6px.
- The y value is computed as: centre + sin(x/20 + t·1.3) × (3 + 9·breath) × envelope.
  - `breath` = 0.5 − 0.5·cos(2π·t/12)
  - `envelope` = sin(π·x/W), which tapers the ends
- **Colors:** HTML uses back `#F9D5DE` and front `#9B5C78`. **Use the Figma colours:** back (unplayed) `#FAD6E9`, front (played) `#8F485B`.
- The played portion is a clip rectangle whose width is `progress × W`.
- Only one per-frame loop runs per screen, and it is paused when playback is paused, the component is offscreen or the tab is hidden.

### 13.5 Interaction motion
- Badge hover wiggle: 0.6s.
- Tap scale 0.94 (badge), 0.97 (companion), [PROPOSED] 0.96 (buttons).
- Springs: badge 420/18, companion 260/16, satellites 180/17.
- [PROPOSED] Detail-card emotion crossfade 400ms. Reminder dismiss 200ms. Bottom sheet slide 280ms with ease-out `cubic-bezier(.2,.8,.2,1)`.

### 13.6 Performance rules [CONFIRMED – HTML]
- Animate **only `transform` and `opacity`**. Blur is static, and `filter` is never animated.
- At most one per-frame loop per screen (the wave).
- Pause loops when offscreen (`useInView`) or when the tab is hidden.
- Use the library **Motion** (`motion/react`). `framer-motion` is also acceptable.

### 13.7 Reduced motion (global rule)
- Detect it with `prefers-reduced-motion`, overridden by the app preference (System / On / Off).
- When it is on:
  - No loops, springs, wiggles, orbit rotation or wave animation.
  - The orb is static at its rest scale. Emotion shapes stay readable through static color, size and shape.
  - Breath text still cycles.
  - Transitions become instant or 0–100ms opacity fades only.

---

## 14. ASSET STRATEGY

| Asset | Existing? | Generate image? | Build in code? | Source | Notes |
|---|---|---|---|---|---|
| Calm player mascot (cloud PNG `14:1039`) | Yes (raster) | **No** | **Yes**, `BreathingOrb` (calm) | HTML | Replaces the raster per the HTML direction |
| Sessions hero mascot (cloud PNG `14:2760`, with "RKLES") | Yes (raster) | **No** | **Yes**, `SessionCompanion` | HTML | Drop the raster; it has a stray wordmark baked in |
| Check-in avatars ×4 (`14:1334`, `14:1347`, `14:1353`, `14:1359`) | Yes (inconsistent rasters) | **No** | **Yes**, `EmotionBadge` ×6 | HTML | One component handles all six states |
| Detail card icon (`14:1366`) | Yes (SVG icon) | No | **Yes**, a small Orb for the selected emotion | HTML + Figma size | [PROPOSED] |
| Emotion selected / hover / pressed / settling states | No | No | **Yes** | HTML | Code-only |
| Breathing animation, halo, glow | Glow exists (CSS blur) | No | **Yes** | HTML + Figma | |
| Waveform bars (`14:1059`) | Yes (18 rectangles) | No | **Yes**, `BreathWave` | HTML, with Figma colours | |
| Wave slider track (`14:2775`) | Yes (2 SVG vectors) | No | **Yes**: export the SVG path, or regenerate it in code | Figma | Must support a dynamic fill split |
| Weekly Mood gauge (`14:882`) | Yes (SVG) | No | **Yes**, an SVG arc driven by data | Figma | |
| Progress bars, day dots, step segments, tags, pills | Yes (CSS) | No | **Yes** | Figma | |
| Satellites / session progress | No | No | **Yes** | HTML | |
| Explore grain overlay (`14:1197`) | Yes (SVG) | No | **Use existing**: export the SVG, or use a CSS noise SVG | Figma | Decorative |
| Glow blobs (Explore, Sessions, Calm) | Yes (CSS blur) | No | **Yes** | Figma | |
| UI icons (calendar, bell, arrows, play, rewind and forward 15, nav icons, tag icons, etc.) | Yes (SVG) | No | Use existing exported SVGs | Figma | Export each SVG from Figma and commit it. Asset URLs from the Figma API expire after 7 days |
| Emoji glyphs (👋 💨 💧 🌙) | Yes (text) | No | Text | Figma | Rendering varies by platform; acceptable |
| Header logo, Home ("Mental Help Pink Logo" `14:972`) | Yes (PNG) | No | Use existing **or** `LogoMark` SVG | Figma / HTML | **[NEEDS DECISION]** The HTML proposes an SVG orb mark; your brief says "don't replace logos" |
| Header logo, other screens ("Calm Logo" `14:1022`, `14:1778`, `14:1784`, `14:1787`) | Yes (PNG, 3D cloud) | No | Use existing **or** `LogoMark` SVG | Figma / HTML | Same decision. Note that Home uses a different logo from the other screens |
| User avatar "Samantha" (`14:1775` etc.) | Yes (photo) | No | n/a | **Use existing** | Export and commit |
| Therapist photo, Gregory Dickinson (`14:1208`) | Yes (photo) | No | n/a | **Use existing** | |
| Gentle reminder thumbnail (`14:959`) | Yes (raster of the cloud) | No | **Yes**, a 48px Orb in the user's latest emotion, or Calm | HTML | [PROPOSED] Replacement; the HTML recommends it |
| Sparkles on the Sessions hero (`14:2762`, `14:2764`) | Yes (glyph + SVG) | No | Use existing | Figma | Keep or drop: [NEEDS DECISION] (8.2) |
| App icon / favicon / PWA icons | No | Optional | **Yes**, render from `LogoMark` or export the existing logo | Figma / HTML | Not needed for the assignment |
| Marketing / portfolio cover still | No | **Optional only** | No | HTML Prompt 3.1 | Only if you want a presentation image |

---

## 15. ACCESSIBILITY

### 15.1 Colour contrast (measured against WCAG 2.2 AA)

| Pair (from Figma) | Ratio | AA normal text (4.5) | Where |
|---|---|---|---|
| White on `#F29BB0` | **2.08** | **Fail** | "Save Check-In", "Buy Now", selected tags, Play icon |
| White on `#F47290` (play gradient end) | 2.74 | Fail (icon: 3:1 needed, fail) | Play/Pause |
| `#713043` on `#F29BB0` | 4.57 | Pass | Selected "Calm Mind" pill |
| `#26181B` on `#F29BB0` | 8.21 | Pass | Alternative for CTA text |
| `#D66F87` on `#FFF0F2` | **2.93** | **Fail** | "Guided Calm • 10 min" pill text |
| `#9CA3AF` on `#FFF8F8` | **2.42** | **Fail** | Calm timestamps |
| `#8D7A80` on white | **4.02** | **Fail** (11px) | Inactive nav labels |
| `#B84D6B` on white | 4.87 | Pass | Active nav label |
| `#524346` on `#FFF8F8` | 8.90 | Pass | Body |
| `#857276` on white | 4.50 | Borderline pass | Muted text |
| `#8F485B` on `#FFF0F2` / white | 5.85 / 6.47 | Pass | Links, badges |

- **[NEEDS DECISION]** Fix the failing pairs (Section 27). This changes Figma colours slightly.
- Recommended minimal changes:
  - CTA and selected-tag text → `#713043` (the same as the existing selected-pill style). Or keep white text and darken the button to about `#C2566F`.
  - Tag pill text → `#8F485B`.
  - Timestamps → `#6B7280` (4.61).
  - Inactive nav labels → `#75636A` or darker.

### 15.2 Typography
- Respect the user's font scaling by using `rem`. Do not shrink text below 11px.
- Allow headings to wrap: Figma uses `whitespace-nowrap`, which will clip at 320px (Section 16).
- Avoid ALL-CAPS for long text. The existing uppercase eyebrows (11px with letter-spacing) are fine.

### 15.3 Touch targets (minimum 44×44)
- Below the minimum in Figma: Dismiss reminder (32), Help & FAQ (32), Card options ⋮ (32), header back (36), avatar (36), Open session → (36), Open reflection (40), Play calm audio (40), Preferences (40), day buttons (48 wide, OK).
- **[PROPOSED]** Keep the visual sizes and extend the **hit area** to 44×44 with padding or a pseudo-element. This requires no visual change.

### 15.4 Semantics

| UI | Element / role |
|---|---|
| Bottom nav | `<nav aria-label="Main">` with links; `aria-current="page"` on the active item |
| Emotion carousel | `role="radiogroup"` with the label "How are you feeling right now?"; each badge is `role="radio"` with `aria-checked` |
| Influence tags | `<button aria-pressed>` inside a `group` with the label "What's influencing this feeling?" |
| Day strip | `role="radiogroup"` with the label "Number of days"; each day is a radio, labelled "4 days" |
| Wave slider / scrubber | `role="slider"` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow` and `aria-valuetext`. Arrow keys ±1 day (Sessions) or ±5s (Calm) |
| Featured carousel (Home) | `region` labelled "Featured"; the cards are focusable articles |
| Gentle reminder dismiss | `button` with the label "Mark reminder as done" |
| Notifications | `button` with the label "Notifications, 1 unread" |
| Breathing capsule | `aria-live="polite"`. To avoid chatter, announce phase changes only while playing |
| Decorative orbs, glows, wave, grain | `aria-hidden="true"` |
| Bottom sheets | `role="dialog"`, `aria-modal="true"`, focus trap, Esc closes |
| Images | Avatars and photos get `alt` text ("Samantha", "Gregory Dickinson"). Logos get `alt="Mental Help"` |

### 15.5 Reduced motion
See 13.7. It must be honoured on every screen.

### 15.6 Audio accessibility and non-audio alternatives
- **[PROPOSED]** The breath capsule provides visual and screen-reader guidance that does not depend on audio.
- Captions or transcripts: **[NEEDS DECISION]**. The recommendation is a "Transcript" expandable section under the track info if the audio has spoken content.
- Never autoplay without a user gesture.

### 15.7 Error messaging
Errors are inline, in plain language, with a next step. Use `role="alert"` for blocking errors and `role="status"` for confirmations (toasts). Do not rely on colour alone.

---

## 16. RESPONSIVE BEHAVIOUR

The design is a **390px** phone canvas (max width 393). **Do not redesign it for larger screens.**

| Width | Behaviour |
|---|---|
| **320px** | Side padding 16px (instead of 20). Headings wrap (remove `nowrap`): "How are you feeling right now?", "Unwind Your Thoughts", the Explore prompt. The Explore featured card becomes `width: calc(100% − 32px)`, with the 340px max kept. The day strip scrolls horizontally (scroll-snap) or shrinks inactive buttons to 44px wide. The Energy/Stress row stays two columns (each about 136px). The check-in emotion carousel and tags wrap or scroll as designed. The Calm controls gap shrinks from 28 to 20px |
| **375px** | As at 390, with 20px padding. The featured carousel peek narrows |
| **390px** | **Reference.** Pixel-match Figma |
| **414px / 430px** | Same layout. The content column fills the width up to 430px. Extra width goes to card widths, not to new columns |
| **Tablet (≥ 600px)** | [PROPOSED] Centre a **430px app column** on the page background `#FFF8F8`. The bottom nav stays inside the column. No multi-column layouts |
| **Desktop (≥ 1024px)** | [PROPOSED] Same centred 430px column, optionally inside a soft device frame for presentation. Hover states apply (Section 9) |

Respect safe-area insets: the header adds `env(safe-area-inset-top)` and the nav adds `env(safe-area-inset-bottom)`, replacing Figma's fixed 48px and 24px where possible. Use `100dvh` and avoid `100vh`.

---

## 17. COMPONENT ARCHITECTURE [PROPOSED]

```
App
├─ providers/
│  ├─ PreferencesProvider     (reducedMotion, ambientDefault, reminder)  → persistent
│  ├─ CheckInProvider         (history, add, clear)                      → persistent
│  ├─ AudioProvider           (single audio engine, status, controls)    → session
│  └─ PurchaseProvider        (mock purchases)                           → persistent
├─ layout/
│  ├─ AppShell                (430px column, safe areas, toasts, sheet host)
│  ├─ AppHeader               (variant: "home" | "sub"; back, logo, title, avatar)
│  └─ BottomNav               (5 tabs, active state)
├─ ui/  (reusable, design-system)
│  ├─ Button (variants: primary-pill, icon-circle-44/40/36/32, text-link)
│  ├─ Pill / Tag (variants: eyebrow, status, filter, toggle, influence)
│  ├─ Card (variants: feature-gradient, white-32, blush, checkout-16)
│  ├─ ProgressBar, StepSegments, DayDots, Gauge
│  ├─ BottomSheet, Toast, InlineError, EmptyState, Skeleton
│  └─ SegmentedDayStrip
├─ mascot/  (reusable, motion system, from HTML)
│  ├─ emotions.ts  (EMOTIONS, BREATH constants, orbFill)
│  ├─ Orb, BreathingOrb, EmotionBadge, SessionCompanion, BreathWave, LogoMark
│  └─ useBreathPhase, useReducedMotionPref
├─ features/  (page-specific)
│  ├─ home/      HomePage, GreetingRow, FeaturedCarousel, WeeklyMoodCard, MetricCard, GentleReminder
│  ├─ checkin/   CheckInPage, EmotionCarousel, EmotionDetailCard, InfluenceTags, GentleNotes, SaveBar
│  ├─ calm/      CalmPage, BreathCue, TrackInfo, Scrubber, PlaybackControls, AmbientToggles, CompletionPanel
│  ├─ sessions/  BuySessionsPage, SpeechBubble, FrequencySlider (wave), DayStrip, AssuranceRow, CheckoutCard, PurchaseSheet
│  ├─ explore/   ExplorePage, SearchPill, FeaturedStackCard, ThemePills, ContentMiniCard
│  └─ profile/   ProfilePage (only if approved)
└─ data/
   ├─ storage.ts (versioned localStorage get/set with try/catch)
   ├─ selectors.ts (weekly mood, streak, top mood)
   └─ mock/ (user.json, tracks.json, content.json, pricing.json, insights.json, faqs.json)
```

**Reusable vs page-specific:**
- Reusable: everything in `ui/` and `mascot/`, `AppHeader` and `BottomNav`.
- Page-specific: `features/*`.
- Rule: if two screens show the same element (pills, 32px cards, icon circles, the header), it is one component with variants. It must not be duplicated per screen.

---

## 18. STATE MANAGEMENT [PROPOSED]

| State | Scope | Persistence | Owner |
|---|---|---|---|
| `currentUser` `{ firstName: "Samantha", avatarSrc }` | Global | Static mock | `mock/user.json` |
| `checkInHistory: CheckIn[]` | Global | **localStorage** `mh.checkins.v1` | CheckInProvider |
| Check-in draft (`selectedEmotion`, `influences`, `note`) | Local to `/check-in` | Temporary (lost on leave, after confirmation) | CheckInPage |
| `settlingEmotion` timer | Local to EmotionBadge / detail card | Temporary | component |
| `audioState` (12.4) | Global | Temporary. [PROPOSED] Remember `lastPosition` per track in sessionStorage | AudioProvider |
| `ambientOn` | Global | localStorage (preference) | PreferencesProvider |
| `selectedDays` | Local to `/sessions` | Temporary (default = recommended value) | BuySessionsPage |
| `purchases[]` `{ id, days, price, createdAt }` | Global | localStorage `mh.purchases.v1` | PurchaseProvider |
| `savedContentIds[]` | Global | localStorage `mh.saved.v1` | small hook |
| `dismissedReminders` `{ [dateISO]: true }` | Global | localStorage `mh.reminders.v1` | small hook |
| `notificationsSeen` | Global | localStorage | small hook |
| `preferences` `{ reducedMotion: 'system' \| 'on' \| 'off', ambientDefault, dailyReminder }` | Global | localStorage `mh.prefs.v1` | PreferencesProvider |
| `exploreFilter`, `searchQuery` | Local to `/explore` | Temporary | ExplorePage |

Use **React Context + `useReducer`**, with no extra state library. Zustand is acceptable only if Context becomes awkward.

---

## 19. DATA / STORAGE [PROPOSED]

- **Recommendation for the assignment:** static JSON mocks plus localStorage. No backend, no auth and no network APIs.
- **`storage.ts`:**
  - Exposes `read<T>(key, fallback)` and `write(key, value)`.
  - Every value is wrapped as `{ version, data }`.
  - Uses try/catch on every call, because private mode or a full quota can throw.
  - On a parse failure or version mismatch, returns the fallback and logs a warning (Section 21).
- **Seeding:**
  - **[NEEDS DECISION]** Seed demo data on first launch so Home looks like Figma (5 check-ins Mon–Fri, top mood Calm)? The recommendation is **yes, behind a "Demo data" flag**, with "Clear my check-ins" available.
- **Upgrade path to a backend later:**
  - Keep all reads and writes behind repository functions such as `checkInRepo.list()`, `.add()` and `.clear()`.
  - Swap their implementation for REST or Supabase or Firebase calls.
  - Add `userId` and server timestamps, and move mocks to API endpoints.
  - UI components never touch localStorage directly.

---

## 20. ROUTING [PROPOSED]

| Route | Screen | Status |
|---|---|---|
| `/` | Redirect to `/home` | [PROPOSED] |
| `/home` | Home | Figma `14:817` |
| `/check-in` | Check-in | Figma `14:1295` |
| `/calm` | Calm player. Optional `?track=:id` (default `unwind-your-thoughts`) | Figma `14:1014` |
| `/sessions` | Buy Sessions | Figma `14:1440` |
| `/explore` | Explore | Figma `14:1146` |
| `/explore/:id` | Content detail | **[NEEDS DECISION]** (7.2). Only add it if approved |
| `/profile` | Profile / preferences | **[NEEDS DECISION]** (11) |
| `*` | Not found → "This page drifted away." + "Go home" | [PROPOSED] |

Notifications, FAQ, purchase confirmation and card options are **sheets, not routes**. Use React Router v6+ (or the framework router if a framework is chosen in Section 27).

---
## 21. ERROR / EMPTY / LOADING STATES [PROPOSED]

None of these are designed in Figma. All of them reuse existing card and pill styles.

| Situation | Where | Behaviour | Microcopy |
|---|---|---|---|
| Audio unavailable / failed | Calm | Inline error under the track info; the play button becomes "Try again"; the breath capsule keeps guiding on a silent timer | "We couldn't load this audio. Check your connection and try again." / button "Try again" |
| Audio loading | Calm | The play button shows a subtle spinner ring (static ring if reduced motion); the scrubber is disabled | "Loading…" (screen-reader only) |
| No check-in history | Home Weekly Mood | Empty gauge, grey dots, no TOP MOOD badge | Title "No check-ins yet" · "Check in once a day to see your week take shape." · link "Check in now" |
| Content unavailable / no results | Explore list | EmptyState card | "Nothing here yet. Try another theme." / with search: "No matches for "{query}"." |
| Loading (any async) | Any | Skeleton blocks in `#FFF0F2`, radius matching the target | n/a |
| Save failure | Check-in | Keep the form filled; inline `role="alert"` above the CTA | "Your check-in didn't save. Please try again." |
| Validation: no emotion | Check-in | Save disabled; helper text under the carousel once the user tries to save | "Choose the companion closest to how you feel." |
| Interrupted session (left mid-track) | Calm | Resume at the stored position (sessionStorage) | toast "Picking up where you left off." |
| Refresh mid-check-in | Check-in | Draft is lost (no persistence). [NEEDS DECISION] whether to keep the draft in sessionStorage; the recommendation is yes | n/a |
| Missing or corrupt local data | App start | Reset that key to empty; one-time toast | "We couldn't load your saved check-ins, so we've started fresh." |
| Storage unavailable (private mode) | Save actions | Keep data in memory for the session; one-time banner | "Your check-ins will only be kept until you close this tab." |
| Purchase failure (mock) | Sessions | Inline error in the sheet | "Something went wrong with your booking. You haven't been charged." |
| Not found route | `*` | Full-page EmptyState | "This page drifted away." / "Go home" |

---

## 22. MICROCOPY

### 22.1 Existing copy, to be preserved [CONFIRMED – FIGMA]

| Screen | Copy |
|---|---|
| Home | "Home" · "Hello," · "Samantha 👋" · "SELF CARE" · "Keep your head up." · "Daily reflection" · "EVENING CALM" · "Unwind gently." · "5 min audio" · "Your week at a glance" · "Insights" · "Weekly Mood" · "TOP MOOD" · "Calm" · "Consistent for 5 consecutive days" · "Mon Tue Wed Thu Fri Sat Sun" · "Energy" · "80" · "+12% vs last wk" · "Stress" · "67" · "-4% lower" · "Gentle reminder" · "Take three deep breaths before…" |
| Calm | "Calm" · "Guided Calm • 10 min" · "💨 Breathe out..." · "Unwind Your Thoughts" · "with Gregory Dickinson" · "Licensed Therapist" · "04:15" · "10:00" · "15" (rewind and forward labels) · "💧 Rain Sounds" · "🌙 Timer (15m)" |
| Explore | "Explore" · "SEARCH" · "Mental Help" · "Improve your mental health." · "Gregory Dickinson" · "Therapist" · "How do I stop overthinking at night?" · "Gently unpack cognitive rumination through guided evening thought anchors." · "23 Minutes" · "1.2K Users" · "Recommended Themes" · "View all" · "Calm Mind" · "Sleep Rituals" · "Anxiety Relief" · "Self Compassion" · "Evening Grounding" · "3-step wind down with Dr. Maya" |
| Check-in | "Check-in" · "Step 1 of 2" · "DAILY RITUAL" · "How are you feeling right now?" · "Select the companion that best resonates with your headspace today." · "Joyful" · "Neutral" · "Anxious" · "Down" · "Calm & Centered" · "A tranquil headspace, breathing easily." · "What's influencing this feeling?" · "Select all that apply" · "Sleep" · "Meditation" · "Work" · "Family" · "Health" · "Social" · "Finances" · "Nature" · "Gentle Notes" · "Optional" · "Add a gentle thought or reflection..." · "Voice memo supported" · "Private & encrypted" · "Save Check-In" |
| Sessions | "Sessions" · "BACK" · "Buy Sessions" · "Get your mental health in order." · "Recommended frequency" · "Optimal Pace" · "3…8" · "Days" · "Licensed therapist" · "Confidential & safe" · "Total" · "$80" · "$59" · "-26%" · "Discount applied" · "Buy Now" |
| Nav | "Home" · "Sessions" · "Explore" · "Calm" · "Profile" |

Notes on existing copy:
- "Take three deep breaths before…" is truncated in Figma. **[NEEDS DECISION]** The full sentence is needed. Suggestion: "Take three deep breaths before your next task."
- "Down" becomes "Depleted" per the HTML: [NEEDS DECISION] (5.3).
- "Private & encrypted" and "Voice memo supported": [NEEDS DECISION] (Section 27).

### 22.2 Emotion copy [CONFIRMED – HTML]
See the table in 5.3 (badge label, detail title, blurb). Settling copy: "Noticing it…" → "Settling into a slower rhythm, breathe with it."

### 22.3 Breathing instructions
"Breathe in..." [CONFIRMED – HTML] · "Hold..." [CONFIRMED – HTML] · "Breathe out..." [CONFIRMED – FIGMA] · "Paused" [PROPOSED] · "Session complete" [PROPOSED]

### 22.4 New copy [PROPOSED]

| Context | Copy |
|---|---|
| Check-in saved (toast) | "Check-in saved. Thank you for checking in." |
| Leave check-in sheet | Title "Leave without saving?" · body "Your check-in won't be kept." · buttons "Keep editing" / "Leave" |
| Calm completion | "Nicely done. Take that calm with you." · button "Replay" |
| Reminder done (toast) | "Nice. Reminder done for today." · "Undo" |
| Purchase confirm sheet | "Confirm your plan" · "{n}-day plan · ${price}" · "Confirm" / "Not now" |
| Purchase success | "You're booked in." · "We'll be in touch with next steps." |
| Coming soon (undesigned features) | "{Feature} is coming soon." |
| Saved content | "Saved" / "Removed from saved" |
| Empty Weekly Mood | "No check-ins yet" · "Check in once a day to see your week take shape." |
| Errors | See Section 21 |

---

## 23. DESIGN TOKENS

### 23.1 Colours [CONFIRMED – FIGMA]

| Token (proposed name) | Value | Used for |
|---|---|---|
| `--bg` | `#FFF8F8` | Page background |
| `--bg-gradient` | `#FFF5F7` → `#FFF8F8` → `#FFF0F2` (vertical) | Home main background |
| `--surface` | `#FFFFFF` | Cards, buttons |
| `--surface-blush` | `#FFF0F2` | Pills, inactive day buttons, tag pills, inner circles |
| `--surface-blush-2` | `#FCE2E7` | Borders, step track, scrubber track, TOP MOOD badge |
| `--surface-rose` | `#FFD9E0` | Energy icon background |
| `--surface-pink` | `#FDD9EC` / `#FAD6E9` | Stress icon background, detail icon, mini card icon, unplayed wave |
| `--surface-reminder` | `#FEDAE1` | Gentle reminder card |
| `--surface-badge` | `#FDE2E8` | Optimal Pace, discount badge, speech bubble |
| `--surface-track` | `#FFE8EC` | Stress bar track, Open session button |
| `--border-soft` | `#FCE7F3` / `#FBDBE1` / `rgba(252,226,231,.6)` | Card and button borders |
| `--primary` | `#F29BB0` | CTAs, selected tags, progress, dots, selected pill |
| `--primary-gradient-play` | `#F29BB0` → `#F47290` (45°) | Play/Pause |
| `--primary-gradient-buy` | `#F29BB0` → `#F4A6B8` (to right) | Buy Now |
| `--brand-deep` | `#8F485B` | Links, badges text, today dot, scrubber thumb, played wave |
| `--brand-plum` | `#725667` | Stress bar, "EVENING CALM" text |
| `--brand-wine` | `#713043` | Text on primary (selected pill), speech bubble text |
| `--ink` | `#26181B` | Headings |
| `--ink-explore` | `#3C2C30` | Explore H1 |
| `--text` | `#524346` | Body |
| `--text-muted` | `#857276` | Strikethrough price, placeholder base |
| `--nav-inactive` | `#8D7A80` | Inactive nav labels and icons |
| `--nav-active` | `#B84D6B` | Active nav label |
| `--nav-active-bg` | `#FCDDE4` | Active nav pill |
| `--dot-off` | `#D7C1C5` | Future days, separators |
| `--accent-tag-dot` / `--accent-tag-text` | `#E86383` / `#D66F87` | Calm tag pill |
| `--success` | `#10B981` | Rain Sounds active dot |
| Calm-screen greys | `#111827`, `#6B7280`, `#9CA3AF`, `#4B5563`, `#374151`; Sessions header `#1F2937` | **Inconsistent with the brand ink.** [NEEDS DECISION] Map them to `--ink` and `--text`, or keep them as in Figma. The recommendation is to keep them (Figma is the source of truth) unless you approve unifying |
| Shadows tint | `rgba(143,72,91,.06–.12)`, `rgba(242,155,176,.12–.55)` | See 23.5 |

### 23.2 Emotion / orb colours [CONFIRMED – HTML]
See the table in 5.3. These are used only for the orb, badges, satellites and LogoMark.

### 23.3 Typography [CONFIRMED – FIGMA]
- **Family:** **Plus Jakarta Sans** (Google Fonts), weights 400, 500, 600, 700 and 800, with the fallback `system-ui, sans-serif`.
- **Timestamps:** Figma uses Liberation Mono. [PROPOSED] Use `ui-monospace, SFMono-Regular, Menlo, monospace`.

| Style | Size / line height | Weight | Tracking | Example |
|---|---|---|---|---|
| Display | 32/40 | 700 | −0.8px | "Mental Help" |
| H1 greeting | 28/36 | 800 | −0.7px | "Samantha 👋" |
| H2 question | 28/36 | 600 | −0.7px | "How are you feeling right now?" |
| Prompt | 28/35 | 600 | 0 | Explore card |
| Track title | 24/32 | 700 | −0.6px | "Unwind Your Thoughts" |
| Card title | 22/27.5 | 800 | 0 | "Keep your head up." |
| Active day number | 22/30 | 800 | 0 | "4" |
| Header title (Sessions) | 20/28 | 700 | −0.5px | "Sessions" |
| Header title / section | 18/26 | 600–700 | 0 / −0.45px | "Home", "Your week at a glance" |
| CTA | 18/26 | 700 | +0.45px | "Save Check-In" |
| Stat | 16/24 or 16/16 | 800 | −0.4px | "Calm", "80", "$59" |
| Body | 14/20–22 | 400–600 | 0 | Subtitles, tags |
| Small | 12/16–18 | 500–700 | 0 | Meta, buttons |
| Eyebrow | 11/14 | 700 | +0.55px, UPPERCASE | "SELF CARE" |
| Nav label | 11/13.75 | 500 (700 active) | 0 | "Home" |

### 23.4 Spacing, radius and size [CONFIRMED – FIGMA]
- **Page gutters:** 20px (Home, Explore, Check-in, Sessions sections); 24px (Calm content, headers).
- **Card padding:** 24px plus a 1px border (Figma 25); compact cards 16px plus 1px (Figma 17).
- **Section gaps:** 24 (Home), 16, 12, 8, 4, 6.
- **Radii:** pill 9999 · card 32 · Calm mascot card 24 · nav top corners 24 · day buttons, checkout card and speech bubble 16.
- **Icon buttons:** 44 (Home header), 40, 36, 32. **CTA height:** 56–58. **Play button:** 64. **Secondary playback buttons:** 48.
- **Header:** status bar 48 + row 64 (Home), or 48 + 36 + 12 bottom (other screens).
- **Nav:** padding 11 top and 24 bottom; items 56 wide with a 14.2 gap; icon pill 40×28.

### 23.5 Shadows [CONFIRMED – FIGMA]

| Name | Value |
|---|---|
| card | `0 8px 24px rgba(143,72,91,.08)` (and `.06` variant) |
| card-lifted | `0 18px 36px rgba(143,72,91,.12)` (Explore card) |
| button-soft | `0 4px 8px rgba(143,72,91,.06)` |
| cta | `0 8px 12px rgba(242,155,176,.45)`; Buy Now `0 10px 12px rgba(242,155,176,.45)` |
| fab | `0 8px 10px rgba(242,155,176,.55)` (Begin) |
| header | `0 1px 12px rgba(242,155,176,.12)` |
| nav | `0 −4px 20px rgba(242,155,176,.15)` |
| inset-soft | `inset 0 2px 4px rgba(0,0,0,.05)` |

### 23.6 Buttons [CONFIRMED – FIGMA]
- **Primary pill:** `--primary` fill, white 18 Bold text (see the contrast decision), radius 9999, cta shadow.
- **Icon circle:** white or 90% white fill, 1px soft border, soft shadow.
- **Filter or tag pill:** selected = `--primary` fill; unselected = white or `--surface-blush` with a border.
- **Text link:** 12 Bold `--brand-deep` with a chevron.

### 23.7 Icons [CONFIRMED – FIGMA]
- The icons are SVG vectors that appear to come from the Material Symbols Rounded family. The Sessions sparkle uses the Material Symbols Outlined font.
- **[PROPOSED]** Export them from Figma as SVG, or use `material-symbols` if every glyph matches. Do not hand-draw them.

### 23.8 Motion tokens [CONFIRMED – HTML unless noted]
- `breath.inhale` = 4s, `breath.hold` = 2s, `breath.exhale` = 6s, `breath.total` = 12s
- `orb.scale` = 0.84 / 1.0 / rest 0.92
- `emotion.tempo` = joyful 2.6 · calm 6 · neutral 8 · anxious 1.4 · depleted 7 · frustrated 1.8 (seconds)
- `settle.delay` = 3500ms
- `badge.hoverWiggle` = 0.6s · `tap.badge` = 0.94 · `tap.companion` = 0.97
- `spring.badge` = 420/18 · `spring.companion` = 260/16 · `spring.satellite` = 180/17
- `orbit.period` = 60s · `satellite.stagger` = 40ms
- [PROPOSED] `fade` = 200ms · `crossfade` = 400ms · `sheet` = 280ms `cubic-bezier(.2,.8,.2,1)` · `press` = 100ms scale 0.96

---

## 24. CODEX IMPLEMENTATION PLAN

Each phase ends with a working, runnable app. No phase may start on an item marked **MUST DECIDE** in Section 27 until it is decided.

### Phase 1 — Project setup
- **Components:** none (scaffold only).
- **State/data:** `src/data/mock/*.json` placeholders.
- **Assets:** export icons, avatars, the therapist photo and the logos from Figma into `src/assets/`.
- **Dependencies:** chosen stack (Section 27) · React Router · `motion` · ESLint/Prettier · Vitest + Testing Library.
- **Acceptance:** `npm run dev` starts; `npm run build` passes; there are no console errors; the folder structure matches Section 17.

### Phase 2 — Design system
- **Components:** tokens (CSS variables from Section 23), font loading, `Button`, `Pill`, `Card`, `ProgressBar`, `StepSegments`, `BottomSheet`, `Toast`, `EmptyState`, `Skeleton`, plus the `mascot/` set (`emotions.ts`, `Orb`, `BreathingOrb`, `EmotionBadge`, `BreathWave`, `SessionCompanion`, `useBreathPhase`, `useReducedMotionPref`).
- **State/data:** PreferencesProvider (reduced motion).
- **Assets:** none generated.
- **Dependencies:** Phase 1.
- **Acceptance:** a hidden `/dev/kitchen-sink` route (dev only) shows every component variant and all six emotion badges. Reduced motion stops every loop. Colors match Figma hex values exactly.

### Phase 3 — Navigation
- **Components:** `AppShell`, `AppHeader` (home and sub variants), `BottomNav`, route table (Section 20), `NotFound`.
- **State/data:** none.
- **Dependencies:** Phase 2.
- **Acceptance:** all five tabs route correctly, the active styles match Figma, back uses the history fallback, the nav is hidden on `/check-in`, and safe-area insets work.

### Phase 4 — Home
- **Components:** `GreetingRow`, `FeaturedCarousel`, `WeeklyMoodCard` (`Gauge`, `DayDots`), `MetricCard` ×2, `GentleReminder`.
- **State/data:** `currentUser`, `checkInHistory` (read), selectors, `insights.json`, `dismissedReminders`.
- **Dependencies:** Phases 3 and 2. For CheckInProvider, a read-only stub is enough.
- **Acceptance:** pixel-close to `14:817` at 390px. The empty state works. Dismissing the reminder persists across reloads. Undesigned buttons follow the decisions in Section 27.

### Phase 5 — Check-in
- **Components:** `CheckInPage`, `EmotionCarousel` (6 × `EmotionBadge`), `EmotionDetailCard`, `InfluenceTags`, `GentleNotes`, `SaveBar`, leave-confirm sheet.
- **State/data:** draft (local), `CheckInProvider.add()`, storage `mh.checkins.v1`.
- **Dependencies:** Phases 2 and 3.
- **Acceptance:**
  - Radio-group keyboard support.
  - Selected styles render.
  - Anxious and Frustrated settle after 3.5s.
  - Save is disabled until an emotion is chosen.
  - Saving persists the entry, returns to Home and updates the Weekly Mood card.
  - Reduced motion is respected.

### Phase 6 — Calm
- **Components:** `CalmPage`, `BreathingOrb` in the Figma container, `BreathCue`, `TrackInfo`, `BreathWave` + `Scrubber`, `PlaybackControls`, `AmbientToggles`, `CompletionPanel`, error panel.
- **State/data:** `AudioProvider`, `tracks.json`, ambient preference.
- **Assets:** audio files, or silent-timer mode (12.5).
- **Dependencies:** Phase 2.
- **Acceptance:**
  - Play, pause, ±15s, seek and replay all work.
  - The breath cue text matches the orb phase (4/2/6).
  - Completion state appears.
  - The error state appears when the `src` is broken.
  - Leaving `/calm` follows the decision in 12.6.
  - Reduced motion is honoured, with the text still cycling.

### Phase 7 — Sessions
- **Components:** `BuySessionsPage`, `SpeechBubble` (−8° → 0° hover/press), `SessionCompanion`, `FrequencySlider`, `DayStrip`, `AssuranceRow`, `CheckoutCard`, `PurchaseSheet`, FAQ sheet.
- **State/data:** `selectedDays` (local), `pricing.json`, `PurchaseProvider`.
- **Dependencies:** Phase 2.
- **Acceptance:**
  - Selecting a day updates the satellites, the slider and the price.
  - The slider is keyboard-operable.
  - Buy Now runs the mock confirm → success flow and persists the purchase.
  - The empty header button is not rendered.
  - Reduced motion stops orbit and breathing.

### Phase 8 — Explore
- **Components:** `ExplorePage`, `SearchPill` (+ inline search if approved), `FeaturedStackCard`, `ThemePills`, `ContentMiniCard`, `EmptyState`.
- **State/data:** `content.json`, `savedContentIds`, filter/search (local).
- **Dependencies:** Phase 2. Phase 6 too, if Begin plays audio.
- **Acceptance:** the pills filter the list, saving toggles and persists, the empty state appears for no results, and Begin follows the decision in 7.2.

### Phase 9 — Profile
- **Components:** only if Option A in Section 11 is approved: `ProfilePage` with preference toggles and Clear data.
- **State/data:** `preferences`, `CheckInProvider.clear()`.
- **Dependencies:** Phases 2 and 3.
- **Acceptance:** toggles persist; Reduce motion overrides the system setting; Clear data asks for in-page confirmation and empties the history.

### Phase 10 — Persistence
- **Components:** `storage.ts` hardening, the demo-data seed flag, migrations.
- **State/data:** all persistent keys (Section 18).
- **Acceptance:** reloading keeps all user data; corrupt JSON falls back gracefully with a toast; private-mode fallback works; no direct localStorage calls exist outside `storage.ts`.

### Phase 11 — Accessibility
- **Components:** focus styles, hit-area extensions, live regions, sheet focus traps, contrast fixes (as decided).
- **Acceptance:** axe shows no serious or critical issues; the app is fully keyboard-navigable; it works with VoiceOver/TalkBack on the main flows; all touch targets are at least 44×44.

### Phase 12 — QA / polish
- **Work:** responsive passes at 320, 375, 390, 414 and 430 plus desktop; visual comparison against Figma screenshots; performance check (no long tasks from animation; transform and opacity only); Section 26 checklist.
- **Acceptance:** every box in Section 26 is ticked.

---

## 25. WHAT CODEX SHOULD NOT DO

- Don't redesign the UI or "improve" layouts, colours, spacing or copy beyond what this spec states.
- Don't change Figma spacing, radii or type sizes, except for the responsive rules in Section 16 and any accessibility fixes that have been approved.
- Don't replace the logos unless the LogoMark decision (Section 27) says so.
- Don't generate or add raster mascot or emotion images. The orb, badges, companion and wave are code.
- Don't use the old cloud PNGs or the four avatar PNGs in the new UI.
- Don't add a backend, authentication, databases, analytics, payment SDKs or push notifications.
- Don't over-engineer: no Redux, no micro-frontends, no SSR requirement, no i18n framework.
- Don't duplicate components per screen (header, nav, pills, cards, icon buttons).
- Don't hard-code each screen as one big absolutely-positioned block, which is how the Figma export looks. Use flex and grid layout.
- Don't animate `filter`, `box-shadow`, `width` or `height` in loops. Use only transform and opacity.
- Don't remove or bypass reduced-motion support.
- Don't remove accessibility semantics, labels or focus styles.
- Don't present undesigned features as finished. Use the agreed "coming soon" or hidden behaviour.
- Don't claim "encrypted" storage, or show "Voice memo supported", unless it is actually implemented (Section 27).
- Don't autoplay audio without a user gesture.
- Don't use browser `alert`, `confirm` or `prompt`.
- Don't hot-link Figma asset URLs. They expire after 7 days, so download and commit the files.
- Don't invent prices, therapists or content and present them as real. Mark mock data as mock.

---

## 26. ACCEPTANCE CRITERIA

### App and build
- [ ] The app launches with `npm run dev`, and `npm run build` succeeds without warnings that matter
- [ ] There are no console errors or warnings during the main flows
- [ ] There are no broken images or icons, and every asset is committed locally
- [ ] Plus Jakarta Sans loads, with a fallback

### Navigation
- [ ] The bottom nav shows Home, Sessions, Explore, Calm and Profile, with the Figma active and inactive styles
- [ ] Every tab routes correctly; `/` redirects to `/home`; unknown routes show NotFound
- [ ] Back returns to the previous screen, or to `/home` if there is no history
- [ ] The nav is hidden on Check-in, and the sticky Save CTA stays visible above the safe area

### Home
- [ ] The greeting shows the user's first name
- [ ] The featured carousel scrolls horizontally, and both cards match Figma
- [ ] Self Care → and Evening Calm ▶ go to the decided destinations
- [ ] The Weekly Mood card reflects stored check-ins: day dots, today highlight, top mood, streak text
- [ ] The empty state appears when there is no history
- [ ] Energy and Stress cards render from the decided source
- [ ] Dismissing the Gentle reminder hides it for the day and persists across reloads
- [ ] Calendar, Notifications and Insights follow the decided behaviour, with no dead taps that give no feedback

### Check-in
- [ ] Six emotion badges render as code orbs, with labels
- [ ] Only one emotion can be selected; arrow keys move the selection; `aria-checked` updates
- [ ] The detail card updates its title, blurb and orb for the selected emotion
- [ ] Anxious and Frustrated settle to the calm rhythm after 3.5s, with settling copy; the timer resets when the selection changes
- [ ] Influence tags toggle with `aria-pressed`, and the default selection matches the decision
- [ ] The note is optional and limited to 500 characters
- [ ] Save is disabled until an emotion is chosen; saving persists the entry and confirms
- [ ] Leaving with unsaved changes asks for in-page confirmation

### Data persistence
- [ ] Check-ins, preferences, purchases, saved content and dismissed reminders survive a reload
- [ ] Corrupt or missing storage falls back gracefully with a toast
- [ ] "Clear my check-ins" (if built) empties the history after confirmation

### Calm and breathing
- [ ] The orb breathes on the 4s/2s/6s cycle only while playing, and rests at 0.92 when paused
- [ ] The capsule text matches the orb phase exactly: "Breathe in..." / "Hold..." / "Breathe out..."
- [ ] The BreathWave animates while playing, its played portion matches progress, and it uses the Figma colours
- [ ] Play/pause, ±15s and scrubbing work; the timestamps are correct
- [ ] The Rain Sounds toggle starts and stops the ambient loop, and the choice persists
- [ ] The completion state appears at the end, and Replay restarts
- [ ] The error state appears when the audio fails, and breathing guidance still works
- [ ] Silent-timer mode works when no audio file exists
- [ ] Leaving `/calm` follows the decided audio behaviour

### Sessions
- [ ] The day strip selects 3–8, and the active style matches Figma
- [ ] The satellites equal the selected days and animate in (static under reduced motion)
- [ ] The wave slider and the day strip stay in sync (if Option A is chosen)
- [ ] The price, the strikethrough price and the percentage update from `pricing.json`
- [ ] The speech bubble rotates from −8° to 0° on hover (pointer) or press (touch)
- [ ] Buy Now → confirmation sheet → success; the purchase persists; there is no real payment
- [ ] The empty header button is not rendered

### Explore
- [ ] The featured card, theme pills and mini card match Figma
- [ ] Theme pills filter the list, and the empty state shows when nothing matches
- [ ] Save toggles and persists
- [ ] Begin and Open follow the decided destination
- [ ] Search behaves as decided

### Profile
- [ ] It behaves as decided in Section 11. If built, the reduced-motion preference overrides the system setting app-wide

### Motion and reduced motion
- [ ] With OS reduced motion (or the app setting) on, there are no loops, springs, orbit, wiggle or wave animation anywhere
- [ ] Breathing text guidance still works under reduced motion
- [ ] Only transform and opacity are animated

### Accessibility
- [ ] All interactive elements are reachable by keyboard and have a visible focus style
- [ ] Every icon-only button has an accessible name
- [ ] Every touch target is at least 44×44, by hit area
- [ ] Decided contrast fixes are applied, and axe shows no serious or critical issues
- [ ] Sheets trap focus, close on Esc and restore focus

### Responsive
- [ ] There is no horizontal page scroll at 320, 375, 390, 414 or 430px
- [ ] Headings wrap instead of clipping at 320px
- [ ] Tablet and desktop show a centred column of up to 430px, without layout changes

---

## 27. OPEN QUESTIONS / BLOCKERS

### MUST DECIDE BEFORE CODEX
1. **Platform and stack.**
   - Options: a mobile-first **web app** (React + Vite + TypeScript + React Router + Motion; deployable to Vercel, which matches your project note) **or** a native app (Expo / React Native).
   - The HTML motion code assumes React DOM. **Recommendation:** the web app.
   - Also decide the styling approach: CSS Modules with CSS variables, or Tailwind. Figma's export is in Tailwind syntax, but either works.
2. **Emotion set.** Confirm the six HTML emotions (Joyful, Calm, Neutral, Anxious, Depleted, Frustrated) replace the four in Figma, and confirm "Down" → "Depleted".
3. **Check-in entry point.** Which Home element opens Check-in? (The recommendation is the Self Care card "Daily reflection" →.)
4. **Check-in "Step 1 of 2".** Remove the step tracker, build a minimal Step 2, or make Step 2 a confirmation screen?
5. **Check-in initial state.** Start with no emotion selected (recommended) or with Calm pre-selected? Should Sleep and Meditation be pre-selected?
6. **Profile tab.** Option A (minimal preferences screen), B (coming soon) or C (remove the tab)?
7. **Sessions meaning and pricing.** Does "4 Days" mean days per week or a package length? Prices are needed for 3, 5, 6, 7 and 8. Which value is "Optimal Pace"?
8. **Buy Now.** Mock confirm → success flow (recommended), or a "coming soon" message?
9. **Session progress / completed / locked days.** These are not designed. Confirm they are **out of scope**, or design them in Figma first.
10. **Audio source.** Will you supply audio files, or should the app use silent-timer mode? And should audio pause when the user leaves `/calm` (recommended)?
11. **Logos.** Keep the existing PNG logos (your rule: "don't replace logos"), or adopt the HTML `LogoMark` SVG? Also note that Home uses "Mental Help Pink Logo" while the other screens use "Calm Logo". Keep both as they are?
12. **Privacy and feature claims in the copy.** "Private & encrypted" and "Voice memo supported". Remove them, reword them (for example, "Stored only on this device"), or implement them? **The recommendation is to reword or remove them**, since localStorage isn't encrypted and there is no recorder.

### CAN BE DECIDED DURING IMPLEMENTATION
13. Undesigned Home buttons: Calendar, Notifications, Insights, Energy →, Stress → (coming soon, a sheet, or hidden).
14. Explore: is the card stack static or swipeable; what do Begin (+), card options ⋮, View all and Search do; is there a detail page or a direct play?
15. The Timer (15m) behaviour on Calm, and the 5 min vs 10 min mismatch between the Home card and Calm.
16. Weekly Mood rules: the streak definition, what the gauge means, past days with no check-in, and Energy/Stress as mock data.
17. Seeding demo data on first launch (recommended, behind a flag).
18. Contrast fixes: which colour adjustments to apply (15.1).
19. Unifying the Calm and Sessions grey text colours with the brand ink, or keeping them as in Figma.
20. Two back buttons on Sessions.
21. Whether to keep the Sessions sparkle glyphs.
22. Whether to keep the check-in draft in sessionStorage across a refresh.
23. The full text of "Take three deep breaths before…".
24. Multiple check-ins per day (recommended: allowed; Home uses the latest).

### OPTIONAL POLISH
25. A swipe gesture on the Explore card stack.
26. A transcript section for audio.
27. A tablet or desktop device frame for presentation.
28. A "Replay" celebration on completion (subtle, and off under reduced motion).
29. A PWA manifest and app icon generated from the logo.
30. Haptics (`navigator.vibrate`) on save. This is Android only and should be off by default.

---

## 28. FINAL IMPLEMENTATION SUMMARY

| Item | Summary |
|---|---|
| **Already exists** | Six Figma frames: Home, Calm, Explore, Check-in (misnamed "Profile"), Buy Sessions, and its hover variant. All copy, colours, type, radii, shadows and icons. The complete mascot and motion system in the HTML: 6 emotions, the 4/2/6 breath, orb, badges, companion, wave, reduced-motion rules |
| **Fully specified here** | Layout and behaviour for Home, Calm, Check-in, Buy Sessions and Explore; the check-in data model; audio engine; motion system; tokens; component tree; state; storage; routes; accessibility; responsive rules; acceptance criteria |
| **Needs assets** | Exported Figma SVG icons, avatar and therapist photos, and logos (existing). **Audio files** (to be supplied, or simulated). **No generated images are required** |
| **Build in code** | Every mascot and emotion visual, breathing, halo, wave, satellites, all selected, hover, pressed and settling states, progress bars, gauge, day dots, step segments and glows |
| **Missing (not designed)** | Profile/Settings, Check-in Step 2, Check-in entry point, notifications, calendar, insights, search UI, Explore detail, checkout, session detail, active session, session progress, completed and locked days, every empty, loading and error state, and focus styles |
| **ChatGPT should handle** | Turning the Section 27 decisions into final rules. Reviewing architecture (Sections 17–20). Writing the mock JSON content (tracks, content, pricing, FAQs). Edge-case logic (streak, top mood, week boundaries, timezones). Debugging Codex output. Writing test cases from Section 26. Accessibility review |
| **Codex should handle** | Implementing Phases 1–12, exporting and committing assets, building components, tests and responsive and accessibility fixes, all against this spec |
| **You need to provide** | Answers to the 12 MUST-DECIDE items. Audio files (or approval of silent mode). Prices for 3–8 days. The full Gentle reminder sentence. Confirmation of the emotion labels. Any extra Explore content you want shown (otherwise only the two Figma items appear) |
| **Recommended next step** | Answer the 12 MUST-DECIDE questions (paste Section 27 into ChatGPT and record your answers in a short `DECISIONS.md`). Then give Codex this file plus `DECISIONS.md` and start the Codex Quick Start below |

---

## FINAL ASSET GENERATION DECISION

### GENERATE THESE ASSETS
**None are required.** Every mascot, emotion, breathing and progress visual can be built in code, as the HTML specifies.

Optional, only if you want them for presentation and not for the app:
- **Portfolio or App Store cover still (1 image).**
  - Why generate it: a marketing image benefits from rendered material quality (frosted vinyl, subsurface glow) that is impractical in CSS, and it is never animated or state-driven.
  - Where it appears: assignment presentation or store listing only, never inside the app UI.
  - Size: 1:1 at 2048px, or 4:5 at 1600×2000.
  - Style: HTML Prompt 3.1 (frosted translucent cloud-pebble, blush `#F9D5DE` → lilac `#E6DAF2`, peach `#FFD9C7` core).
  - Transparency: not needed (flat `#FFF6F8` background).
  - States: one image, used for one purpose.

### BUILD THESE IN CODE
- Breathing orb (Calm) with halo and the 4/2/6 cycle
- Six emotion badges and every state: idle loop, selected, hover wiggle, pressed, settling, reduced motion
- Detail-card emotion orb
- Session companion (Joyful orb) with satellites per day, orbit, springs
- Speech bubble −8° → 0° hover/press
- BreathWave (replaces the 18 static bars) and the scrubber
- Wave frequency slider with dynamic fill and thumb
- Weekly Mood gauge, day dots, Energy/Stress progress bars
- Step segments, tag toggles, filter pills, day strip states
- Glow blobs, gradients, card shadows
- Gentle reminder thumbnail (mini orb)
- Skeletons, empty states, toasts, bottom sheets
- `LogoMark` SVG (only if approved in Section 27)

### USE EXISTING ASSETS
- UI icons: all SVG icons in the frames (header, nav, playback, tags, metrics, arrows), exported from Figma
- Samantha avatar photo (`14:1775` and repeats)
- Gregory Dickinson therapist photo (`14:1208`)
- Logos: "Mental Help Pink Logo" (`14:972`) and "Calm Logo" (`14:1022` and repeats), unless replaced by decision
- Explore grain texture SVG (`14:1197`)
- Sessions sparkle glyph and icon (`14:2762`, `14:2764`), if kept
- Emoji glyphs in the copy (👋 💨 💧 🌙)

**Retire (do not use):** the cloud mascot PNGs (`14:1039`, `14:2760`, `14:1669`), the four check-in avatar PNGs (`14:1334`, `14:1347`, `14:1353`, `14:1359`), and the gentle reminder raster (`14:959`).

---

## FINAL CODEX QUICK START

Do these in order. Do not start until the 12 MUST-DECIDE items in Section 27 are answered.

1. **Scaffold** the chosen stack (recommended: Vite + React + TypeScript), add React Router, `motion`, ESLint/Prettier and Vitest. Commit.
2. **Create the folder structure** from Section 17, and add empty mock JSON files: `user`, `tracks`, `content`, `pricing`, `insights`, `faqs`.
3. **Export Figma assets** (icons, avatars, therapist photo, logos, grain) into `src/assets/`, named by purpose, and commit them. Do not hot-link Figma URLs.
4. **Implement design tokens** (Section 23) as CSS variables, load Plus Jakarta Sans and set the base styles.
5. **Build `storage.ts`** with versioned keys and safe fallbacks, and the four providers (Preferences, CheckIn, Audio stub, Purchase).
6. **Build the mascot module:** `emotions.ts` (the exact values in 5.3 and 13.2), `Orb`, `BreathingOrb`, `useBreathPhase` and `useReducedMotionPref`. Verify them on a dev-only kitchen-sink route.
7. **Build the shared UI:** `Button`, `Pill`, `Card`, `ProgressBar`, `StepSegments`, `BottomSheet`, `Toast`, `EmptyState`.
8. **Build `AppShell`, `AppHeader` and `BottomNav`**, and wire up the routes from Section 20 with placeholder pages.
9. **Build Check-in end to end:** `EmotionBadge` ×6, detail card with settling, tags, notes, validation and save to storage. This is the core data flow.
10. **Build Home:** greeting, featured carousel, Weekly Mood (driven by selectors), metric cards and Gentle reminder dismiss. Confirm it updates after a check-in.
11. **Build the AudioProvider** (track + ambient, silent-timer fallback, error state). Then build Calm: orb in the Figma container, breath cue, `BreathWave`, scrubber, controls, Rain Sounds, completion.
12. **Build Buy Sessions:** `SessionCompanion`, speech bubble states, day strip, frequency slider sync, pricing from JSON, mock purchase sheet.
13. **Build Explore:** featured card, theme filter, mini cards, save toggle, and the decided Begin and Search behaviour.
14. **Build Profile** (if approved), apply accessibility (Section 15), and complete the responsive passes (Section 16).
15. **Run the Section 26 checklist**, fix any failures, and produce a short QA report listing anything that is still open.
