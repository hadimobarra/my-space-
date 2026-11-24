---
title: "yield کردن به معنی رسم فریم نیست"
date: "2026-11-24"
---

`await scheduler.yield()` به مرورگر اجازه می‌دهد کار دیگری انجام دهد، اما قول نمی‌دهد آن کار رسم صفحه باشد. در [دمویی](/blog/taming-inp-interaction-to-next-paint/) که فقط yield می‌کرد، فریم بعدی پس از پایان همه کار آمد: ۴۳۵ میلی‌ثانیه بعد. اول منتظر `requestAnimationFrame` بمانید، بعد yield کنید.
