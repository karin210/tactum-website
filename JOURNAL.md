# Journal

## 2026-05-16
- Added `CLAUDE.md` with project conventions (fluid design, semantic HTML, accessibility, CSS colocation with `.module.css`).
- Created `JOURNAL.md` to track changes before each commit.
- Hero: swapped product image to `GG-Gloves-black.png` and simplified the subtitle to "Confort y experiencia".
- Added new glove color images (black, blue, brown, white) and removed the old `gg-gloves-v-0.2.png`.
- Product benefits: added `fadeInBenefit` CSS animation triggered by `key={benefitNum}` on the content container, so each benefit transition animates in smoothly.
- Product benefits nav buttons: added fluid sizing with `clamp`, hover opacity, and scale transform for better interactivity.
- Benefits container: added `width: 100%` and `max-width: 745px` to constrain layout.
- Added `/personalizar` page route (`app/personalizar/page.tsx` + `page.module.css`) with a glove customization form: color picker (5 swatches), fabric type (single/double), additional details (neon lines, hair, claws, embroidery), closure type (elastic/magnetic/velcro), logo upload, and name input. Fully accessible with semantic fieldsets, radio/checkbox inputs, and keyboard navigation.
