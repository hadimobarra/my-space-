# hadimobarra.github.io

Source for my portfolio and blog: **https://hadimobarra.github.io**

Next.js 16 (App Router, static export), React 19, TypeScript and Tailwind CSS 4. English at `/`, Persian (RTL) at `/fa/`. Sections are server components; animation is CSS.

## Structure

```
app/(en), app/(fa)   Root layout and routes per language (thin files)
app/                 Shared: RSS, sitemap, manifest, social images, icon sprite, 404
components/
  pages/             One component per page, used by both languages
  sections/          Home page sections
  layout/            HTML shell, header, footer, command menu
  blog/ projects/    Article and case study components, upload demo
  shared/            Small building blocks
content/blog/        Articles (.mdx, English)
content/projects/    Case studies (.mdx, one file per language)
content/github.json  Open-source activity (generated)
lib/                 Locale, dictionary, SEO, MDX and data helpers
locales/             en.json and fa.json: all page copy
scripts/             GitHub data, JavaScript budget, static server
tests/               Playwright: smoke, features, SEO, accessibility
```

Most text changes are made in `locales/*.json` and `content/`. A case study needs a file with the same name in `content/projects/en` and `content/projects/fa`.

## Development

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint
npm run build        # static site in ./out
npm start            # serve ./out on http://127.0.0.1:4173
npm run typecheck
npm run budget       # JavaScript budget (after build)
npm test             # Playwright (after build); PW_CHANNEL=chrome uses installed Chrome
npm run data:github  # refresh content/github.json
```

## Deployment

Every push to `main`, and a weekly schedule, runs `.github/workflows/deploy.yml`. It calls `ci.yml` (lint, types, build, budget, tests, Lighthouse) and then publishes `out/` to the `gh-pages` branch of `hadimobarra/hadimobarra.github.io`.

| Secret | Purpose |
|---|---|
| `DEPLOY_TOKEN` | Fine-grained token with **Contents: Read and write** on `hadimobarra/hadimobarra.github.io` |
| `WEB3FORMS_ACCESS_KEY` | Access key for the contact form |

| Variable (optional) | Purpose |
|---|---|
| `BOOKING_URL` | Calendar link for the 20-minute call. Without it, the button opens a pre-filled email |
| `GOATCOUNTER_CODE` | Your `CODE.goatcounter.com` site code. Without it, no analytics run |
