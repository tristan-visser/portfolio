# Design system

## Direction

**Field Notes + Swiss discipline.** A warm, editorial surface with the information density of a technical index. The site should feel made by a person who reads, writes and builds software, not generated from a SaaS landing-page template.

The work is the proof. The design gets out of the way of the project titles, case studies and links.

## Audience

- Recruiters and hiring managers scanning for a graduate software engineering role.
- Engineers who will open the case studies, GitHub and live demos.
- People who received the link from a CV, LinkedIn or email.

The first five seconds should answer: who is this, what do they build, what proof is there, and how do I contact them.

## Visual system

### Colour

| Token          | Value            | Use                                             |
| -------------- | ---------------- | ----------------------------------------------- |
| `paper`        | warm off-white   | Page background                                 |
| `paper-raised` | slightly lighter | Inputs, raised surfaces                         |
| `paper-deep`   | warm grey-beige  | Banded sections, code backgrounds               |
| `ink`          | near-black       | Primary text, dark bands                        |
| `ink-soft`     | dark warm grey   | Body copy on paper                              |
| `muted`        | mid warm grey    | Metadata, captions                              |
| `rule`         | ink at 16%       | Hairline dividers                               |
| `rule-strong`  | ink at 30%       | Hover underlines, stronger rules                |
| `accent`       | rust/vermilion   | Section numbers, links, availability dot, hover |
| `accent-dark`  | darker rust      | Text links on paper, focus states               |
| `accent-soft`  | pale rust        | Warning callouts                                |

One accent only. No gradients. No purple. No glassmorphism. No decorative shadows.

### Typography

- **Display:** Newsreader, weight 400. Used for the name, page titles, project titles, pull quotes and serif body moments. Italic is used for one accent word or phrase, not every heading.
- **Body:** Source Sans 3, weights 400, 500 and 600. Used for paragraphs, UI, forms and labels.
- **Mono:** system monospace (`ui-monospace`, SF Mono, Menlo, Consolas). Used for section numbers, metadata, stack lists, dates and small uppercase labels.

No third custom font. The system mono is part of the platform, not a download.

### Type scale

| Role          | Size                          | Notes                    |
| ------------- | ----------------------------- | ------------------------ |
| Hero name     | `clamp(4rem, 12vw, 9rem)`     | Two lines, tight leading |
| Page title    | `clamp(2.5rem, 5vw, 4rem)`    | Serif, normal weight     |
| Project title | `clamp(1.75rem, 3vw, 2.5rem)` | Serif, normal weight     |
| Body          | 17px / 1.6                    | Source Sans 3            |
| Small         | 14px / 1.55                   | Metadata and dense copy  |
| Label         | 11px / 1.6                    | Uppercase, tracked, mono |

### Grid and spacing

- Page width: 1180px.
- Gutters: `clamp(1rem, 4vw, 2rem)`.
- Section rhythm: `clamp(3.5rem, 6vw, 5.5rem)`.
- 12-column mental model; hero uses 8/4, project index uses a 5-column table on desktop and a stacked layout below 1024px.
- Hairline rules instead of cards. Sharp corners. No rounded cards.
- The project index is the signature component: number, title, summary, stack, year, arrow.

### Motion

- Native cross-document view transitions where supported (progressive enhancement; no JS).
- Hover shifts on arrows and rows, 150-250ms.
- No scroll hijacking, no custom cursor, no parallax, no every-element fade-in.
- `prefers-reduced-motion` disables transitions and smooth scrolling.

### Imagery

- Real screenshots of real work. No fake browser chrome, fake dashboards or AI-generated UI.
- Images have a 1px rule, no rounded corners, a mono caption and explicit dimensions.
- If a project has no useful screenshot, use typography and a system diagram instead of pretending.
- Portrait: use a real photo on the About page only if it is good. No stock photos.

### Iconography

- Inline SVG only, 1.6px stroke, square caps.
- Icons support text; they are not the only label except where an accessible name is provided.
- No icon fonts, no emoji as UI.

## Voice

- First person, plain, specific.
- Short sentences. Concrete nouns and verbs.
- No "passionate", "innovative", "seamless", "crafting digital experiences", "not just X, but Y".
- No invented metrics, testimonials or job titles.
- Say what was built, what was hard, what was decided and what changed.
- Admit limits. "In progress" is a valid status.

## Component rules

- **Header:** name and TV mark, four links, CV button. Non-sticky. Mobile uses a native `<details>` menu.
- **Footer:** dark ink band, contact CTA, email, social links, location, availability, privacy.
- **Project row:** entire row is a link; title is a heading; status is visible text; stack and year are metadata; 44px minimum target.
- **Case study:** title, summary, metadata sidebar, prose with decision logs and figures. No decorative hero if there is no real image.
- **Forms:** visible labels, native validation, 44px controls, a `role="status"` region, a privacy note and an email fallback.
- **Links:** underlined or clearly bordered; hover changes colour and decoration; focus is always visible.

## Accessibility target

WCAG 2.2 AA:

- Semantic landmarks, one `h1` per page, sequential headings.
- Keyboard complete, visible focus, no focus traps, focus not obscured by sticky UI.
- 24×24px minimum targets; 44px for primary actions.
- 4.5:1 body text contrast; 3:1 large text and UI boundaries.
- 200% zoom and 320px reflow without horizontal scrolling.
- Reduced motion respected.
- Form errors and status messages announced.
- No colour-only meaning.

## Performance budget

- Initial JS: under 30 KB gzip (the current site has a single small JS bundle).
- Fonts: two families, five files, under 120 KB total.
- HTML: under 30 KB per page.
- LCP: under 1.5s on a mid-range phone/4G target; Lighthouse mobile 95+.
- CLS: under 0.05.
- INP: under 100ms.
- No third-party scripts except Turnstile on the contact page and optional Cloudflare Web Analytics.

## Anti-references

- Purple-blue gradient hero.
- Inter everywhere.
- Three identical feature cards.
- Fake product UI built from divs.
- Skill meters and logo walls.
- Testimonial carousels with no real testimonials.
- Full-screen intro animations, custom cursors, scroll-jacking.
- Dark terminal aesthetic as the whole identity.
- "Passionate about technology" copy.

## Theme

Light only for v1. One excellent theme is better than two half-tested ones. A dark theme can be added later through semantic tokens, but it is not a launch requirement.
