# Journal

## 2026-05-19
- `/personalizar`: added `z-index: 100` to the sticky header so page elements (e.g. scaled color swatches) can no longer paint over it during scroll.
- `/personalizar`: added `PADDING_COLORS` constant (Negro + Plata) so the wrist padding section only offers the two colors that the physical material comes in, while front/back keep the full 13-color palette.

## 2026-05-16
- Added `CLAUDE.md` with project conventions (fluid design, semantic HTML, accessibility, CSS colocation with `.module.css`).
- Created `JOURNAL.md` to track changes before each commit.
- Hero: swapped product image to `GG-Gloves-black.png` and simplified the subtitle to "Confort y experiencia".
- Added new glove color images (black, blue, brown, white) and removed the old `gg-gloves-v-0.2.png`.
- Product benefits: added `fadeInBenefit` CSS animation triggered by `key={benefitNum}` on the content container, so each benefit transition animates in smoothly.
- Product benefits nav buttons: added fluid sizing with `clamp`, hover opacity, and scale transform for better interactivity.
- Benefits container: added `width: 100%` and `max-width: 745px` to constrain layout.
- Added `/personalizar` page route (`app/personalizar/page.tsx` + `page.module.css`) with a glove customization form: color picker (5 swatches), fabric type (single/double), additional details (neon lines, hair, claws, embroidery), closure type (elastic/magnetic/velcro), logo upload, and name input. Fully accessible with semantic fieldsets, radio/checkbox inputs, and keyboard navigation.
- Fix hydration mismatch: added `suppressHydrationWarning` to `<html>` and `<body>` in `layout.tsx` to suppress attribute differences injected by browser extensions. Moved `returnUrl` computation out of `useMemo` into the `handlePayClick` handler in `stripePaymentElement.tsx` to eliminate a `typeof window` server/client branch that ran during render. Added `suppressHydrationWarning` to the five form inputs and submit button targeted by the Fake Filler extension (`fdprocessedid` attribute injection).
- Hero: added "Pre-ordenar" `<Link>` button navigating to `/personalizar`. Updated grid to 4 rows to accommodate the new element.
- `/personalizar`: expanded color palette from 5 to 12 options, adding Carmesí, Orquídea, Espacio exterior, Rosa Cardo, Vino Profundo, Sombra azul, Lavanda, and Glaciar; renamed "Azul marino" to "Marino".
- `/personalizar`: split the Color section into three independent pickers — Frente, Dorso de la mano, and Acolchado de muñeca — each with the full color palette. State refactored from a single hex string to a `Record<PartId, string>` dictionary. The "Dorso de la mano" picker is only shown when "Doble tela" is selected, since a single fabric has no separate back color.
- `/personalizar`: added responsive two-mode layout. On desktop (≥860px) all options are shown at once in a left column with a sticky 3:4 image placeholder on the right. On mobile (<860px) a step-by-step wizard shows one section at a time, with a progress bar (numbered dots + connecting lines, completed steps are tappable to go back) and an inline 4:3 image placeholder above each step's options; Anterior/Siguiente navigation guides the user through the steps.
