# hadimobarra.github.io

Source for my portfolio and blog: **https://hadimobarra.github.io**

A single Next.js 16 app (App Router, static export) with React 19, TypeScript, Tailwind CSS 4, Framer Motion and English/Persian (RTL) i18n.

## Structure

```
app/            Routes: home page, /blog, /blog/[slug], RSS, sitemap, robots, manifest
components/
  sections/     Home page sections (hero, about, projects, experience…)
  blog/         Blog listing and post components
  layout/       Header, theme toggle, command menu, scroll progress
  shared/       Reusable animation and UI helpers
  ui/           Base UI primitives (button, card, input…)
content/blog/   Blog posts (.mdx)
lib/            SEO config, i18n setup, MDX loader, store, utils
locales/        en.json and fa.json: all page copy lives here
public/         Static files: images, resume.pdf, og.jpg
types/          Shared TypeScript types
```

Most text changes (bio, projects, experience) are made in `locales/en.json` and `locales/fa.json`, not in components.

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build   # static site in ./out
```

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the static export and publishes `out/` to the `gh-pages` branch of `hadimobarra/hadimobarra.github.io`.

Required repository secrets:

| Secret | Purpose |
|---|---|
| `DEPLOY_TOKEN` | Fine-grained token with **Contents: Read and write** on `hadimobarra/hadimobarra.github.io` |
| `WEB3FORMS_ACCESS_KEY` | Access key for the contact form |
