---
title: "Yielding is not a frame"
date: "2026-11-24"
---

`await scheduler.yield()` lets the browser do something else. It doesn't promise that the something is a paint. In a [demo](/blog/taming-inp-interaction-to-next-paint/) that only yielded, the next frame came after all the work, 435 ms later. Wait for `requestAnimationFrame` first, then yield.
