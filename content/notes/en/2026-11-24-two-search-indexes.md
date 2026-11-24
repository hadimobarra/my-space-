---
title: "Two Pagefind instances share one memory"
date: "2026-11-24"
---

Persian pages here search a Persian and an English index. Creating two instances from one Pagefind bundle made the Persian search fail in 8 of 15 test runs: they share one WebAssembly state. Building two separate bundles, one per language, passed 30 of 30.
