---
title: "Next.js metadata replaces, it doesn't merge"
date: "2026-11-24"
---

Set `openGraph` in a page and you lose the layout's social image. Set `alternates` and you lose the RSS link. And a page that sets neither inherits the layout's canonical URL, so my blog index told search engines it was the homepage. One function that returns everything fixed all three.
