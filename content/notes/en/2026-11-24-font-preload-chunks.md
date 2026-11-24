---
title: "Font preloading works per CSS chunk"
date: "2026-11-24"
---

Two root layouts, one `next/font` each, and the build merged their CSS. Result: every English page preloaded the Persian fonts, and the other way around. Nothing in the code looks wrong. The network panel shows it at once.
