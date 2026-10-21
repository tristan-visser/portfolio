# Architecture decisions

## ADR-001: Astro 7, static output, Cloudflare adapter

**Decision:** Use Astro 7 with the official Cloudflare adapter. Pages are pre-rendered; the contact route opts into on-demand rendering with `export const prerender = false`.

**Why:** A portfolio is content, not an app. Astro ships HTML by default, has first-class content collections, image optimisation and a fonts API. The Cloudflare adapter lets the same project own one small API route without turning every page into a server render.

**Alternatives rejected:** Next.js (ships a React runtime and hydrates content pages), a hand-rolled static site (reimplements routing, content validation, image optimisation), a site builder (less control, template-shaped).

## ADR-002: Tailwind CSS 4 with design tokens

**Decision:** Use Tailwind CSS 4 via `@tailwindcss/vite`, with the design system expressed as `@theme` tokens and a small set of component classes.

**Why:** Fast, consistent iteration without a runtime. Tokens keep colour, type, spacing and motion in one place. The final CSS is small because it only includes used utilities.

**Alternatives rejected:** CSS-in-JS (runtime cost), a component library (generic visual language), hand-written CSS for every component (slow and inconsistent).

## ADR-003: Cloudflare Workers static assets

**Decision:** Deploy the site as a Worker with static assets. Connect the custom domain through Wrangler routes. Use a `www` redirect at the edge.

**Why:** Static asset requests are free and unlimited on Workers, the site is served from Cloudflare's edge, and custom domains provision DNS and certificates automatically. It also keeps the door open for the contact API and future server features.

**Alternatives rejected:** Cloudflare Pages (Workers is the current platform direction), Vercel/Netlify (another dependency, bandwidth limits).

## ADR-004: Contact form through a Worker, Turnstile and Cloudflare Email Service

**Decision:** `POST /api/contact/` validates the payload, checks a honeypot, verifies a Turnstile token, and sends a plain-text email through the `send_email` binding. The destination is `contact@tristanvisser.co.za`, forwarded to Gmail by Email Routing.

**Why:** No third-party form service, no database, no message content stored on the server. Turnstile blocks bots without a puzzle in most cases. Email Routing and sending to a verified destination are free on the current plan.

**Alternatives rejected:** `mailto:` only (worse for recruiters), Formspree (external dependency, privacy trade-off), a database-backed inbox (unnecessary state and maintenance).

## ADR-005: Minimal client JavaScript

**Decision:** No React, Vue or Svelte. Use Astro components, CSS and two small scripts: the mobile menu uses native `<details>`, and the contact form uses a small bundled script.

**Why:** The site is static content. Every byte of framework runtime is a cost with no user benefit. The one interactive surface is the form, and it does not need a framework.

**Alternatives rejected:** A React island for the form (adds 100 KB+ for one form), a client-side router (breaks the static model).

## ADR-006: Astro Fonts API, two families

**Decision:** Load Newsreader (400 normal + italic) and Source Sans 3 (400, 500, 600) through the Astro Fonts API. Preload only the two 400 normal files. Use system monospace for metadata.

**Why:** Self-hosted fonts, automatic fallback metrics, no Google Fonts request. Reducing variants from eleven files to five cut the Lighthouse LCP from 2.8s to 2.0s on the home page.

**Alternatives rejected:** Google Fonts CDN (privacy and extra connection), five weights per family (bandwidth with no visual benefit), a third custom mono font (unnecessary).

## ADR-007: Content collections with a placeholder guard

**Decision:** Projects live in `src/content/projects` with a Zod schema. Placeholder entries set `placeholder: true`. `scripts/check-content.mjs` fails `pnpm build` if placeholders remain; `pnpm build:preview` explicitly allows them. Placeholder pages also render `noindex`.

**Why:** It is easy to forget that demo content is still on a site. The guard makes it impossible to ship fake projects by accident.

**Alternatives rejected:** Trusting a checklist, removing the placeholder pages before launch (loses the layout reference).

## ADR-008: GitHub Actions for quality and deployment

**Decision:** Use GitHub Actions for formatting, linting, type checking, unit tests, build, Playwright/axe, Lighthouse and production deployment. The deploy job runs only on `main`, after the quality job passes, using a scoped Cloudflare token stored in repository secrets. The token can only edit Workers scripts and routes.

**Why:** It keeps CI and deployment in one place, gives test and Lighthouse reports next to the code, and is fully automatable with the account token available. The deploy token is narrowly scoped and only lives in GitHub's secret store. Workers Builds is a good alternative, but it requires a one-time dashboard connection and a user-scoped API token, which is more setup for a one-person project.

**Alternatives rejected:** Workers Builds (excellent, but needs a user-scoped token and dashboard connection), deploying from a laptop (easy to forget and not reproducible), a broad account token in GitHub secrets (unnecessary blast radius).

## ADR-009: Light theme only for v1

**Decision:** Ship one excellent warm light theme. Do not add a theme toggle yet.

**Why:** A toggle doubles the CSS and testing surface. Recruiters do not grade the toggle; they grade the work. The light theme also pairs better with screenshots. Semantic tokens make a dark theme possible later.

**Alternatives rejected:** A half-tested dark mode, forcing dark mode on everyone.

## ADR-010: Privacy-friendly analytics only

**Decision:** Use Cloudflare Web Analytics if analytics is needed. No advertising cookies, no tracking pixels, no session recording.

**Why:** It answers the only question that matters for a portfolio (are people visiting?) without a cookie banner or a privacy burden. The privacy notice explains it.

**Alternatives rejected:** Google Analytics (cookie banner, data sharing), Plausible/Umami (another service to run or pay for).
