# Karma Morgan - portfolio site

Personal portfolio for Karma Morgan, graphic designer. Built from her printed
2023-2026 portfolio: the projects, copy, scopes and years are hers, and every
image is exported from that document.

## Stack

- Next.js 16 (App Router, Turbopack) + TypeScript
- Tailwind CSS v4, tokens defined in `app/globals.css`
- Motion (`motion/react`) for entrance, scroll parallax and hover
- Phosphor Icons
- Fonts via `next/font`: Rubik (heavy rounded display caps) and Jost (light
  geometric body), chosen to match the printed portfolio's type

## Design notes

- **Black-locked.** The portfolio is pure black with white type and airbrushed
  chrome, so the site commits to one theme instead of shipping light and dark.
  The background is true `#000` on purpose: the star sprites are JPEGs matted on
  black, and they sit seamlessly on the page because of it.
- **Star and lettering sprites** (`public/brand/`) are cropped straight from the
  document. They are composited with `mix-blend-screen` and feathered with the
  `.matte` utility so no JPEG edge shows.
- **The index** (numbered scallop badges, dotted leaders) is a rebuild of the
  portfolio's printed contents page.

## Editing content

Everything visible lives in `content/site.ts`. Components read from it; they do
not hold copy of their own.

### Placeholders to replace before launch

| What | Where | Current value |
| --- | --- | --- |
| Email | `content/site.ts` → `person.email` | `hello@example.com` |
| Social links | `content/site.ts` → `elsewhere` | all `#` |

There is no domain or public profile yet, so those are intentionally fake. The
real contact details from the PDF are deliberately **not** published here.

## Assets

`assets/` holds the source PDF and is git-ignored (it is ~100 MB). The web
exports in `public/work` and `public/brand` are generated from it and are
committed.

## Local development

```bash
npm install
npm run dev
```

## Deployment

Deployed on Vercel from the `main` branch of the GitHub remote. Pushes to `main`
ship to production; pull requests get preview URLs.
