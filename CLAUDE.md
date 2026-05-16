# Tactum Website

E-commerce site for ergonomic computer gloves.

## Project conventions

- **Fluid design** — layouts and type scale with fluid/responsive units (clamp, %, vw), no hard pixel breakpoints where avoidable.
- **Semantic HTML** — use the correct HTML element for its meaning (`<nav>`, `<main>`, `<article>`, `<section>`, `<button>`, etc.).
- **Accessibility** — ARIA attributes where needed, keyboard navigability, sufficient colour contrast.
- **CSS colocation** — each component's styles live in a `.module.css` file next to its `.tsx` file (e.g. `hero.tsx` + `hero.module.css`). Note: existing files currently use plain `.css`; new work should use `.module.css`.

## Before every commit

Append an entry to `JOURNAL.md` with a short description of what changed and why, then include the journal update in the same commit.
