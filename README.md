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
content/blog/        Articles (.mdx, English); translations in content/blog/fa
content/notes/        Short notes (.md, one folder per language)
content/catalog.ts    Career claims, their proof and trust label
content/glossary.json Persian data terms
content/diagrams.ts  Diagrams used in articles
content/projects/    Case studies (.mdx, one file per language)
content/github.json  Open-source activity (generated)
lib/                 Locale, dictionary, SEO, MDX and data helpers
locales/             en.json and fa.json: all page copy
scripts/             GitHub data, search index, JavaScript budget, static server
tests/               Playwright: smoke, features, SEO, accessibility
```

Most text changes are made in `locales/*.json` and `content/`. A case study needs a file with the same name in `content/projects/en` and `content/projects/fa`.

### Writing an article

```mdx
---
title: "…"
description: "…"
date: "2026-11-24"
updated: "2026-12-01"   # optional
tags: ["Performance"]   # a tag with two or more articles gets a topic page
featured: true          # optional
---
```

- Code blocks accept a file name and marked lines: ` ```ts title="lib/a.ts" {2,4-6} `
- Demos and diagrams: a ` ```embed ` block containing a name from `components/blog/article-body.tsx` or `content/notes/        Short notes (.md, one folder per language)
content/catalog.ts    Career claims, their proof and trust label
content/glossary.json Persian data terms
content/diagrams.ts`
- Learning paths are listed in `lib/series.ts`
- A Persian version uses the same file name in `content/blog/fa`

## Development

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint
npm run build        # static site and search index in ./out
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
| `GISCUS_CATEGORY_ID` | Category id for embedded comments. Install the [giscus app](https://github.com/apps/giscus) first. Without it, articles link to Discussions |
| `BUTTONDOWN_USER` | Buttondown user name for email subscriptions. Without it, only RSS is shown |
| `GOATCOUNTER_CODE` | Your `CODE.goatcounter.com` site code. Without it, no analytics run |
