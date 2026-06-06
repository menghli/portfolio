# Portfolio 2026 — Design System

---

## Principles

1. **Warm minimalism** — cream base, no pure whites
2. **One accent, used sparingly** — `#487089` only on interactive confirmation (CTAs, send button, `>_` cursor, active nav pill)
3. **Editorial typography** — Serif display for personality, Mono for structure, Sans for readability
4. **Stroke over shadow** — all surface relationships expressed with rules, never elevation
5. **Pill-shaped affordances** — all buttons and tags are pills; shape signals interactivity
6. **Ink on linen** — visible dark borders define elements like a product label, not subtle separators

---

## Color — 12 Tokens

| Token | Hex | Opacity | Usage |
|---|---|---|---|
| `Surface/Background` | `#F7F6F4` | 100% | Page background — warm cream |
| `Surface/Dark` | `#1A1A1A` | 100% | Ticker bar bg |
| `Text/Default` | `#333333` | 100% | Primary text, headings, body |
| `Text/Secondary` | `#6B6B6B` | 100% | Descriptions, placeholders, labels, footer |
| `Accent/Default` | `#487089` | 100% | CTA fills, send button, `>_` cursor, active nav pill only |
| `Accent/Light` | `#E8EFF4` | 100% | Accent hover tint, Design Approach image placeholder |
| `Accent/Warm` | `#F0ECE8` | 100% | Image placeholders — warm tone (default) |
| `Accent/Cool` | `#EEE8F0` | 100% | Image placeholders — cool tone (accent sections) |
| `Border/Default` | `#333333` | 100% | All strokes at 1px or 1.5px |
| `Special/White` | `#FFFFFF` | 80% | Avatar bg, icon-only pill bg |
| `Special/Glow` | `#C8D8E4` | 80% | Testimonial radial blur only |
| `Special/Gradient` | — | — | Linear gradient — hero background blob |

**Accent gate:** `Accent/Default` must not appear on decorative, structural, or label elements — only interactive confirmation.

**Note:** `Text/Default` and `Border/Default` share the same hex `#333333` but are separate tokens — text uses `Text/Default`, strokes always reference `Border/Default`.

---

## Typography — 3 Families

| Family | Role |
|---|---|
| **DM Serif Display** Regular | Hero name injection — used once only |
| **DM Sans** Regular / Medium | All headings, body, UI text |
| **DM Mono** Regular / Medium | All UI labels — nav, pills, tags, ticker, footer |

### 8 Text Styles

| Style | Font | Size | Weight | Line Height | Tracking | Case |
|---|---|---|---|---|---|---|
| `Hero` | DM Serif Display | 52px | Regular | 72px | 0 | — |
| `H2` | DM Sans | 44px | Medium | 58px | −0.5px | — |
| `H3` | DM Sans | 20px | Regular | 28px | 0 | — |
| `Body-Regular` | DM Sans | 16px | Regular | AUTO | 0 | — |
| `Body-Small` | DM Sans | 14px | Regular | 18px | +0.27px | — |
| `Nav` | DM Mono | 12px | Medium | 18px | +1.5px | — |
| `Label` | DM Mono | 12px | Medium | AUTO | +2px | UPPER |
| `Button` | DM Mono | 12px | Regular | AUTO | −3% | UPPER |

### Hero Headline Pattern
Inline mix on one line: `"Hi, I'm "` (DM Sans Regular 52px) + `"Menghan"` (DM Serif Display / `Hero` style) + `" —"` (DM Sans Regular 52px). Serif injection used once only.

### Style Usage Guide
- `Hero` — name in hero headline only
- `H2` — section headings ("Projects", "About", "Selected Work")
- `H3` — card titles, column titles
- `Body-Regular` — descriptors, testimonial quote, chat messages
- `Body-Small` — card descriptors, about body copy, sublines
- `Nav` — navigation links, column number labels (`01 — BACKGROUND`)
- `Label` — section eyebrow labels ("SELECTED WORK"), attribution lines
- `Button` — all pill text (ghost and filled), ticker bar

---

## Borders

| Weight | Usage |
|---|---|
| `1px #333333` | Ghost pills, tag chips, avatar frames |
| `1.5px #333333` | Cards, input bar, section dividers, carousel buttons, column separators |

No shadows. Ever.

---

## Border Radius

| Value | Used for |
|---|---|
| `999px` | All pills, send button, chat input, carousel nav |
| `20px` | Standard project cards |
| `top: 9999px, bottom: 20px` | Arch card — reserved accent shape, use once |
| `0px` | Featured editorial project frame |

---

## Spacing

| Token | Value |
|---|---|
| Page margin | `48px` |
| Hero content max-width | `689px` |
| Section bottom padding | `96px` |
| Card inner padding | `24px` |
| Pill gap | `10px` |
| Nav link gap | `32px` |

Paragraph spacing between any two consecutive body paragraphs is `8px`.

---

## Writing Style and Tone

Writing is calm, direct, and specific. Sentences are kept short. No filler phrases, no restatements of the same point across consecutive sentences. Findings and outcomes lead with the concrete result, followed by the evidence or context. Personal stories (methodology rationale, challenges, learnings) are written in first person and focus on what changed as a result of an action, not just the action itself.

Avoid: em dashes, "straightforward", "genuinely", hyperbolic qualifiers, closing sentences that summarize what the paragraph already showed, and passive constructions where the author's agency is clear.

Tone is confident but not self-promotional. The reader is assumed to be a hiring manager scanning quickly. Every sentence should earn its place.

---

## What to Avoid

- No drop shadows
- No `#FFFFFF` at page level — use `#F7F6F4`
- No `#487089` on anything non-interactive
- No light grey borders — always `#333333`
- No rounded stroke caps/joins on icons — square cap, miter join only
- Arch card is a one-time accent, never the default shape
