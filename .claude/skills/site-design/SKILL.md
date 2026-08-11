---
name: site-design
description: Use when editing, reviewing, extending, or judging the Lucy store website (docs/index.html) or any visual/UX work on it — adding a section, changing layout, styling a component, or deciding whether the page is easy to use. Applies Dieter Rams' ten principles and Jony Ive's clarity / deference / depth so the site stays simple, honest, obvious, and consistent. Trigger on "make the site nicer", "improve the UX", "redesign", "is this usable", "design review", "clean this up", or any change to the store's look, layout, or copy.
---

# Site design — Rams & Ive, applied to the Lucy store

The store exists to do one thing well: **let a seller find a skill and install it in under a minute.** Every design decision serves that, or it goes. This skill is the standard to hold new work to.

## North star

> **Less, but better.** — Dieter Rams
> **Simplicity is not the absence of clutter; it is bringing order to complexity. The interface defers to the content.** — Jony Ive

Three tests to apply to any change, in order:
1. **Does it help the seller get a skill installed?** If not, it is decoration — cut it.
2. **Is the primary action on this view obvious within one second?** One clear primary action per view; everything else is quieter.
3. **Could it be simpler?** Remove until it breaks, then add back the last thing.

## Rams' ten principles as a working checklist

Apply these when adding or reviewing anything on the page.

1. **Useful before beautiful.** Every element earns its place by function. A pretty panel that informs nothing is removed.
2. **Understandable.** The design explains itself — no manual. Labels say what happens ("Get" downloads; "Publish a skill" opens the form). Icons support words, never replace them.
3. **Unobtrusive.** The UI is a tool, not a statement. Neutral canvas, restrained motion, content forward. Chrome recedes; skills stand out.
4. **Honest.** Never imply more than is true. The Performance section literally says "this is early signal, not proof." No fake scarcity, no vanity metrics, no dark patterns.
5. **Long-lasting.** Avoid trend-chasing effects that date fast. System fonts, simple geometry, one accent. It should look right in three years.
6. **Thorough to the last detail.** Focus rings, hover states, empty states, error states, keyboard paths, `:focus-visible`, `aria-label`s, tab order. Details are the design.
7. **As little design as possible.** When torn between adding and removing — remove. Whitespace is a feature. A blank area is not a problem to fill.

## Ive's themes → practical rules

- **Clarity.** Type does the work: a clear scale, generous line-height, real hierarchy (one big heading, quiet labels, readable body). Text is legible at a glance; contrast is never decorative.
- **Deference.** The warm paper canvas and ink defer to the skills. Terracotta is an accent, not a mood — it marks *the one thing to do next* (primary buttons, active state, focus, the italic word in the headline), never whole regions.
- **Depth.** Motion and layering communicate structure, not spectacle: subtle lift on hover, a sheet that rises, a soft backdrop blur. If an animation doesn't explain a relationship, remove it.
- **Craft.** Optical alignment over mathematical. Consistent corner radii. No orphaned pixels. Squircle icons with a real highlight. The seam should be invisible.

## This site's design system — warm editorial (stay inside it)

The identity is **paper & ink, editorial**: warm cream paper, ink type, a considered warm-accent trio, a display serif doing the talking, and a whisper of paper grain. It should read like a design annual, not a dark-mode SaaS template. Tokens live in `docs/index.html` `:root` — reuse them; do not invent values or reintroduce the old black/red theme.

- **Color.** Canvas `--paper #F1E8D7`; panels `--paper-2`; raised `--card #FAF4E7`. Type `--ink #211B14` / `--ink-soft` / `--muted`. Hairlines `--line` / `--line-strong`. Accents, warm and disciplined: `--terra #C0492C` (primary — the one thing to do next), `--ochre` (highlight / "New"), `--forest #3C5340` (calm / "Core"). Icons are flat warm tiles with cream glyphs. Never a cool blue/grey; never pure black or pure white.
- **Type.** `--display` **Fraunces** (serif) for headlines, section titles, card titles, big numbers, and the italic "why" line — this is where the design lives. `--sans` **Instrument Sans** for body/lede/buttons. `--mono` **Space Mono** for eyebrows, slugs, tags, labels, nav links, meta. The accent word in the H1 is Fraunces *italic* terracotta.
- **Texture.** A fixed paper-grain overlay at ~4–5% multiply. Subtle — it kills digital sterility without being noticed.
- **Space.** Generous, editorial. Section padding ~62px, card padding ~24px, wrap padding 32px. Whitespace is the point.
- **Radius.** Softer than print but not pill-happy: cards/panels ~14px, tiles/inputs ~8–10px, icon squircles ~15px, buttons ~5–6px. Round pills only for role chips.
- **Motion.** 150–280ms ease-out. Card lift, sheet rise, fade. Nothing bouncy.

### Component rules
- **Primary button** (filled terracotta): at most one per view — "Browse skills", "Open a pull request". Hover → `--terra-deep`.
- **GET / install** is a filled **ink** pill (mono, uppercase); hover → terracotta. Secondary actions are ink-outline or plain underlined links.
- **Nav CTA:** the store's single most important action ("Publish a skill") is a filled terracotta pill, right-aligned, mono uppercase — never a plain text link buried among others.
- **Tags/badges:** mono uppercase, hairline outline. Core = forest, New = ochre, roles = ink-outline.
- **Cards** use a Fraunces title, mono slug, sans summary, a Fraunces-italic "why" line, and a mono footer. Tappable, keyboard-focusable (`role=button`, `tabindex=0`, Enter/Space), lift on hover/focus.
- **Overlays** are cream sheets over a warm ink scrim; escape via close button + backdrop click + Esc, body scroll-locked, focus visible.
- **Contrast:** ink on paper is the workhorse. Keep small terracotta/muted text at readable weight/size; never grey-on-grey for anything that must be read.

Fonts load from Google Fonts in the `<head>`. If offline robustness is ever needed, self-host them — but keep Fraunces / Instrument Sans / Space Mono as the identity.

## Pre-ship review checklist

Run this before committing any UI change:

- [ ] **One obvious primary action** on the view; secondary actions are visually quieter.
- [ ] Nothing added that doesn't help install-a-skill (cut decoration).
- [ ] Uses existing tokens (color/space/radius/type) — no stray hex or one-off sizes.
- [ ] Reads top-to-bottom with a clear hierarchy; labels say what happens.
- [ ] **Keyboard:** everything reachable and operable; visible `:focus-visible` ring.
- [ ] **States** handled: hover, empty, loading, error, and the mobile (<720px) layout.
- [ ] Contrast is legible (not grey-on-grey for anything that must be read).
- [ ] Honest — no claim the data doesn't support, no manipulation.
- [ ] Removed one thing. If you couldn't, look again.

## How to use this skill

When asked to change or judge the site: open `docs/index.html`, make the change **inside the existing token/component system**, then walk the checklist above out loud and fix what fails before showing it. When proposing a redesign, lead with what to *remove*, not what to add. Verify visually (render `docs/` and screenshot desktop + mobile widths) — details only show at real size.
