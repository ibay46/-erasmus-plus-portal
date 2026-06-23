# Design — Erasmus+ Portal

A locked design system for this app. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

## Provenance

DNA extracted via `hallmark study` (image mode) from a screenshot of Calendly's
public homepage, used as a structural reference only — macrostructure, hero
archetype, type-pairing role, and colour-anchor band. No copy, imagery, customer
logos, or stated metrics from the source were carried over; all content below
is Erasmus+ Portal's own.

**2026-06-21 amendment** — a second DNA pass was taken from a screenshot of a
music-streaming template demo ("Melodify", a generic marketplace template, not
a real product). Carried over: hero badge-above-headline pattern, a two-tone
headline (body weight + accent-coloured emphasis word), a stat row under the
CTA pair, layered blurred colour-blob backgrounds behind a hero, and a
highlighted/"most popular" emphasis card in pricing-style grids. Explicitly
NOT carried over: the source's literal dark+neon-green palette, any copy,
imagery, logos, or stated numbers — the green hue adopted below was chosen
independently (see Theme) rather than colour-matched to the source.

**2026-06-21 second amendment** — a third DNA pass, taken from a screenshot of
the "UI UX Pro Max" skill's own marketing landing page (a dev-tool site).
Carried over, homepage hero only: a fixed-dark hero section (independent of
the site's light/dark toggle) with two blurred colour blobs, a two-tone
gradient headline (plain text + gradient-accent emphasis line), and a compact
bordered stat-card grid. Also carried over, site-wide per explicit user
instruction: the blue+amber accent pairing itself (see Theme). Explicitly NOT
carried over: the source's own copy, logos, the "powered by" tool-badge row,
or its terminal command snippet content — our hero's terminal-styled box links
to our own real KA210 budget tool, not a copied command.

## Genre

modern-minimal

## Macrostructure family

- **Marketing pages** (`/`, `/danismanlik`, `/araclar`, `/akademi` index pages,
  `/proje-turleri`, `/proje-kutuphanesi`, `/proje-sonuclari` list views):
  **Split Studio** (H2 Split hero — text column + hand-built SVG illustration,
  never a stock photo or screenshot mockup). List/index pages may use the
  **Catalogue** archetype for their grid instead of a Split hero.
- **App / tool pages** (`/admin/**`, `/araclar/ka210-butce-hesaplama`,
  `/araclar/proje-zaman-cizelgesi`, `/araclar/yolluk-bildirimi`, `/akademi/etki-yonetimi/**`):
  **Workbench**. No hero enrichment — the tool's own UI is the content.
- **Content pages** (`/haberler/[slug]`, `/proje-sonuclari/[slug]`,
  `/proje-kutuphanesi/[slug]`, `/proje-turleri/[slug]`): **Long Document**.
  Typography only.

## Theme

Custom — corrected for two critical findings from the pre-redesign audit: pure
white surfaces and a single-font (Inter-only) system.

**2026-06-21 amendment** — accent recoloured from blue to green at the
user's explicit request (Melodify DNA pass, see Provenance). Superseded same
day, see next amendment.

**2026-06-21 second amendment** — accent recoloured again, from green to
blue, plus a new secondary "warm" accent (amber/orange) introduced for
gradients and decorative use, at the user's explicit request (UI UX Pro Max
DNA pass, see Provenance). This is now the current accent system.

- `--color-paper` (`--background`) — light: `oklch(98.5% 0.004 250)` · dark: `oklch(18% 0.006 250)`
- `--color-paper-2` (`--muted`) — light: `oklch(96% 0.006 250)` · dark: `oklch(22% 0.006 250)`
- `--color-ink` (`--foreground`) — light: `oklch(22% 0.01 260)` · dark: `oklch(92% 0.004 250)`
- `--color-ink-2` (`--muted-foreground`) — light: `oklch(50% 0.012 260)` · dark: `oklch(68% 0.01 250)`
- `--color-rule` (`--border`) — light: `oklch(90% 0.006 250)` · dark: `oklch(32% 0.008 250)`
- `--color-accent` (`--accent`) — light: `oklch(60% 0.20 258)` · dark: `oklch(67% 0.19 258)` (blue)
- `--color-accent-warm` (`--accent-warm`) — light: `oklch(72% 0.15 55)` · dark: `oklch(75% 0.14 55)` (amber/orange — gradients, decorative blobs, secondary emphasis; not used for solid CTA fills)
- `--color-accent-ink` (`--accent-foreground`) — `oklch(99% 0 0)` (both modes — white on the blue accent)
- `--color-focus` — = accent (per mode)
- Hero-only decorative blobs (not tokens, one-off): accent + accent-warm blurred
  blobs on a fixed-dark hero background — see homepage, and the "fixed-dark
  hero on an otherwise theme-adaptive site" exception below.

No gradients between paper and accent as a global rule. No pure `#fff` / `#000`
anywhere. Hero-section blurred colour blobs are an explicit, scoped exception
(decorative background only, never under text, never full-bleed across the
whole page).

## Typography

- **Display:** Cabinet Grotesk (Fontshare, free), weight 700 for `h1`/hero, 600 for `h2`/`h3`. Headings only.
- **Body:** Inter (kept — deliberate continuity choice for a large, already-shipped Turkish-content site; this resolves the prior "Inter-everywhere" finding because Inter is no longer also carrying display).
- **Outlier:** none yet (no third face introduced).
- Display tracking: `-0.02em`.
- Type scale anchor: `--text-display: clamp(2.5rem, 4.5vw + 1rem, 4.5rem)` (capped lower than Hallmark's default ceiling — this is a consulting/info site, not a poster).

## Spacing

Existing Tailwind v4 default scale is kept (no semantic `--space-*` tokens
introduced) to avoid a site-wide spacing refactor. New components should still
prefer Tailwind's spacing scale consistently (`gap-*`, `p-*`) over arbitrary
values.

## Motion

- Easings: `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`. No spring/bounce anywhere (modern-minimal, not Hum).
- Reveal pattern: none by default. At most one orchestrated fade-up on the homepage hero on first load.
- Reduced-motion fallback: opacity-only, ≤150ms (already in `globals.css`).

## Microinteractions stance

- Silent success, no celebratory toasts.
- Hover delay 800ms / focus delay 0ms on any future tooltip.
- Card hover = border colour shift only (no scale, no shadow glow) — already the existing convention; kept.

## CTA voice

- **Primary:** solid `--color-accent` fill, `rounded-lg` (slightly softer than the prior `rounded-md`), `accent-foreground` text, no shadow.
- **Secondary:** `--color-rule` outline, transparent fill, hover → `--color-paper-2` background.
- Never two primary (filled) CTAs side by side.

## Per-page allowances

- Marketing pages MAY use one Tier-B hand-built SVG illustration per page. No stock photography, no AI-illustration look, no screenshot-in-a-fake-browser-frame.
- App/tool pages MUST NOT use enrichment.
- Content pages: typography only, plus whatever PDF/Excel/Word previews the editor embeds.

## What pages MUST share

- The `Logo` component (icon + "Erasmus+ Portal" wordmark) — unchanged.
- The accent blue and its restrained placement (CTAs, links, focus rings — not large fills).
- Cabinet Grotesk for headings, Inter for body, site-wide.
- The `.btn` CTA voice above.
- `Header` and `Footer` — identical on every page (no per-page nav variation).

## What pages MAY differ on

- Macrostructure within their family (e.g. a marketing page can be Split Studio or Catalogue; both still use the system's type/colour/CTA voice).
- Whether a Tier-B SVG illustration is present.

## Nav / Footer archetypes

- **Nav:** N1b-canonical (wordmark · grouped links · account link · primary CTA pill-ish button). The existing `Header.tsx` link set and structure are kept; only the visual language (button radius, spacing, type) changes.
- **Footer:** Ft5 Statement — one short closing line + a compact link row + legal line. Replaces the prior generic two-zone footer.

## Rollout status

- **Phase 1:** `app/globals.css` tokens, `app/layout.tsx` font loading, `Header.tsx`, `Footer.tsx`, `app/page.tsx` (homepage).
- **Phase 2:** site-wide CTA voice consistency sweep — every primary (`rounded-md bg-accent`) and secondary (`rounded-md border border-border`) button across all ~45 remaining pages and tool components updated to `rounded-lg`, matching the CTA voice declared above. Headings on every page already inherit Cabinet Grotesk and the corrected paper/accent tokens automatically via the global `h1,h2,h3` rule in `globals.css` — no per-page font/colour edits were needed.
- **Phase 3:** the three flagged list pages each got a distinct, non-shared structure (kill-the-shared-tail discipline):
  - `/proje-turleri` — genuine **Catalogue** treatment: grouped by action-type family (Akredite ve Hareketlilik / Gençlik Katılımı / Ortaklıklar / Diğer), mono-label group headers + hairline divider per group, instead of one flat 12-item grid.
  - `/proje-kutuphanesi` — asymmetric featured layout: newest entry gets a 2-col/2-row tinted feature block, the rest sit in a tighter grid beside/below it.
  - `/haberler` — featured-story + list pattern: most recent post as a left-biased lede, older posts as a divided text list, with a right-rail linking to category pages (no duplicated cards).
- **Phase 4:** the four content-detail page types (`/haberler/[slug]`, `/proje-sonuclari/[slug]`, `/proje-kutuphanesi/[slug]`, `/proje-turleri/[slug]`) moved off dead-centre: each now uses a `lg:grid-cols-[10rem_1fr]` layout with a sticky left meta-rail (category/year/type/country as labelled micro-data, not section eyebrows) beside the prose column, instead of a single centred column. Admin pages and the small `/admin` and `/araclar` navigational index grids were deliberately left as plain equal-card grids — they're genuine sitemaps (Workbench family, no enrichment), not marketing feature-grids, so the "identical feature grid" anti-pattern doesn't apply there.

## Exports

### tokens.css mapping

The existing token names in `app/globals.css` (`--background`, `--foreground`,
`--muted`, `--muted-foreground`, `--card`, `--border`, `--accent`,
`--accent-foreground`) are kept as-is and re-pointed to the values above —
no renaming, so no other component needs to change to pick up the system.
