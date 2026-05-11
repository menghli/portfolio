# Design System — Core Foundations
 
---
 
## Typography
 
Import from Google Fonts: Playfair Display, DM Sans, DM Mono
 
| Role         | Font             | Weight | Size / Line Height |
|--------------|------------------|--------|--------------------|
| Heading 1    | Playfair Display | 600    | 36px / 48px        |
| Heading 2    | Playfair Display | 500    | 26px / 32px        |
| Body Heading | DM Sans          | 500    | 22px / 26px        |
| Body         | DM Sans          | 400    | 18px / 24px        |
| Button       | DM Sans          | 500    | 18px / 24px        |
| Caption      | DM Sans          | 300    | 14px / 18px        |
| Mono / Tags  | DM Mono          | 400    | 14px / 20px        |
 
Usage rules:
- Playfair Display for page and section headings only
- DM Sans for all body copy, labels, and UI text
- DM Mono for metadata tags, captions, and code
---
 
## Color
 
| Role           | Token          | Hex       |
|----------------|----------------|-----------|
| Title text     | --dark-1       | #1a1a1a   |
| Body text      | --dark-2       | #2e2e2e   |
| Subtitle text  | --dark-3       | #666666   |
| Dividers       | --gray         | #c4c4c4   |
| Background     | --background   | #fafafa   |
| White          | --white        | #ffffff   |
| Primary        | --primary      | #487089   |
 
Background gradient — soft pastel radial blobs fading to white in the center:
- Top-left:     mint     #e8f5f0
- Top-right:    pink     #fce8f0
- Bottom-right: lavender #ebe8fc
- Center:       fades to #fafafa
---
 
## Border Radius
 
| Use              | Value  |
|------------------|--------|
| Large cards      | 4px    |
| Small thumbnails | 2px    |
| Tags / labels    | 100px  |
 
---
 
## Spacing
 
| Use                       | Value                         |
|---------------------------|-------------------------------|
| Page horizontal padding   | 48px (desktop), 24px (mobile) |
| Max content width         | 1100px, centered              |
| Hero top padding          | 140px                         |
| Between sections          | 80px                          |
| Between project rows      | 64px                          |
| Between text elements     | 12–16px                       |
 
---
 
## Grid
 
Single-column content layout, max 1100px wide, centered.
 
Project rows use a 2-column internal split:
- Left col:  45% — text content (tag, title, description)
- Right col: 55% — image / visual
- Gap between cols: 48px
---
 
## Dividers
 
- Weight: 1px
- Color: --gray (#c4c4c4)
- Full content width
- Used between project rows only
---
 
## Overall Style Notes
 
- Generous whitespace throughout — when in doubt, add more breathing room
- Left-aligned text, never centered (except the floating nav)
- Minimal use of color — primary #487089 used sparingly for tags and accents only
- No shadows except on the floating nav
- No decorative elements beyond the mosaic break and background gradient
