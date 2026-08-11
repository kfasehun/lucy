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
- **Deference.** The black canvas and neutral greys defer to the skills. Red is an accent, not a mood — it marks *the one thing to do next* (primary buttons, active state, focus), never whole regions.
- **Depth.** Motion and layering communicate structure, not spectacle: subtle lift on hover, a sheet that rises, a soft backdrop blur. If an animation doesn't explain a relationship, remove it.
- **Craft.** Optical alignment over mathematical. Consistent corner radii. No orphaned pixels. Squircle icons with a real highlight. The seam should be invisible.

## This site's design system (stay inside it)

The tokens already live in `docs/index.html` `:root`. Reuse them — do not invent new values.

- **Color.** Canvas `--bg #000`; surfaces `--surface / --surface-2 / --surface-3`; hairlines `--hair`. Text `--text` / `--muted` / `--dim`. Accent `--red` family — used *sparingly* for the primary action, active state, and focus only.
- **Type.** System font stack (SF on Apple). Headings: heavy weight, tight negative letter-spacing. Labels: 11–13px uppercase, `--dim`. Body: 14–16px, line-height ~1.55.
- **Space.** Consistent rhythm — section padding ~64px, card padding ~22px, control gaps 10–18px. Prefer more space over more lines.
- **Radius.** `--radius` 20 / `--radius-sm` 12 / `--radius-lg` 28 / pills 999. Match neighbours.
- **Motion.** 150–280ms, ease-out. Hover lift, sheet rise, fade. Nothing bouncy or attention-seeking.

### Component rules
- **Primary button** (filled red pill): at most one per view. This is "Get", "Browse skills", "Publish a skill", "Open a pull request".
- **Secondary** (surface + hairline pill): everything else — "View source", "Read".
- **Nav CTA:** the store's single most important action ("Publish a skill") is a visible pill, right-aligned, never a plain text link buried among others.
- **Cards** are tappable, keyboard-focusable (`role=button`, `tabindex=0`, Enter/Space), and lift on hover/focus.
- **Overlays** trap nothing the user can't escape: close button + backdrop click + Esc, body scroll-locked, focus visible.

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
