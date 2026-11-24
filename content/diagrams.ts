import type { Diagram } from "@/components/blog/diagrams";

/** Diagrams used in articles through ```embed blocks. */
export const diagrams: Record<string, Diagram> = {
  "loop-turn": {
    kind: "flow",
    caption: "One turn of the event loop. Microtasks always drain completely; rendering happens only when a frame is due.",
    steps: [
      { title: "One task", note: "timer, input event, message, script" },
      { title: "All microtasks", note: "promise reactions, including ones added while draining", tone: "violet" },
      { title: "Maybe render", note: "requestAnimationFrame, style, layout, paint", tone: "green" },
      { title: "Next turn", note: "or idle callbacks", tone: "gray" },
    ],
  },
  "pixel-pipeline": {
    kind: "flow",
    caption: "Every change enters the pipeline somewhere and pays for all later stages. Transform and opacity can enter at the end.",
    steps: [
      { title: "JavaScript", note: "changes a class or style", tone: "gray" },
      { title: "Style", note: "which rules match?" },
      { title: "Layout", note: "width, top, font-size start here", tone: "red" },
      { title: "Paint", note: "color, box-shadow start here", tone: "violet" },
      { title: "Composite", note: "transform, opacity", tone: "green" },
    ],
  },
  "signal-graph": {
    kind: "flow",
    caption: "Reading records a dependency; writing notifies along the recorded edges. Nothing else runs.",
    steps: [
      { title: "signal", note: "a value and its subscribers" },
      { title: "computed", note: "cached, recalculated only when read after a change", tone: "violet" },
      { title: "effect", note: "touches the outside world: DOM, network, log", tone: "green" },
    ],
  },
  "leak-chain": {
    kind: "flow",
    caption: "A leak is a chain of references from a root. Break any link and the rest can be collected.",
    steps: [
      { title: "window", note: "a GC root", tone: "gray" },
      { title: "Listener", note: "never removed", tone: "red" },
      { title: "Closure", note: "captures the component" },
      { title: "Detached DOM", note: "can't be collected", tone: "violet" },
    ],
  },
  "stream-pipeline": {
    kind: "flow",
    caption: "Each stage asks the previous one for more. When the consumer is slow, the request travels back to the network.",
    steps: [
      { title: "Network", note: "response.body" },
      { title: "Decode", note: "bytes to text" },
      { title: "Split", note: "text to lines", tone: "violet" },
      { title: "Render", note: "for await (…)", tone: "green" },
    ],
  },
  "proxy-trap": {
    kind: "flow",
    caption: "A trap intercepts the operation. Reflect performs the default behaviour with the right receiver.",
    steps: [
      { title: "proxy.name", note: "your code", tone: "gray" },
      { title: "get trap", note: "observe, validate or replace" },
      { title: "Reflect.get", note: "default behaviour, correct this", tone: "violet" },
      { title: "target", note: "the real object", tone: "green" },
    ],
  },
  "rsc-flow": {
    kind: "flow",
    caption: "Server Components run once and send their result. Only Client Components are downloaded and hydrated.",
    steps: [
      { title: "Server", note: "runs components, reads data" },
      { title: "HTML and payload", note: "rendered output plus client references", tone: "violet" },
      { title: "Browser", note: "shows HTML straight away", tone: "gray" },
      { title: "Hydration", note: "client islands only", tone: "green" },
    ],
  },
  "inp-parts": {
    kind: "lanes",
    caption: "INP covers the whole path from input to the next frame. The handler is only the middle part.",
    lanes: [
      {
        label: "One slow interaction",
        bars: [
          { text: "input delay", start: 0, width: 30, tone: "gray" },
          { text: "processing", start: 30, width: 42, tone: "red" },
          { text: "presentation", start: 72, width: 28, tone: "violet" },
        ],
      },
    ],
  },
  "type-pipeline": {
    kind: "flow",
    caption: "Type-level code is a pipeline of small functions from types to types.",
    steps: [
      { title: "Input type", note: '"/users/:id"', tone: "gray" },
      { title: "Template literals", note: "split the string" },
      { title: "Conditional types", note: "branch and recurse", tone: "violet" },
      { title: "Result", note: "{ id: string }", tone: "green" },
    ],
  },
  "worker-lanes": {
    kind: "lanes",
    caption: "The same work. In a worker the main thread stays free for input and frames.",
    lanes: [
      { label: "Without a worker: main thread", bars: [{ text: "parse (page frozen)", start: 5, width: 85, tone: "red" }] },
      { label: "With a worker: main thread", bars: [{ text: "post", start: 5, width: 10, tone: "green" }, { text: "use", start: 86, width: 9, tone: "green" }] },
      { label: "With a worker: worker thread", bars: [{ text: "parse", start: 15, width: 71, tone: "blue" }] },
    ],
  },
  "lcp-parts": {
    kind: "lanes",
    caption: "The four parts of LCP. Optimizing an image only helps the third.",
    lanes: [
      {
        label: "From navigation to the largest paint",
        bars: [
          { text: "TTFB", start: 0, width: 25, tone: "gray" },
          { text: "load delay", start: 25, width: 25, tone: "red" },
          { text: "load", start: 50, width: 22, tone: "blue" },
          { text: "render delay", start: 72, width: 28, tone: "violet" },
        ],
      },
    ],
  },
  "export-pipeline": {
    kind: "flow",
    caption: "How this site goes from Markdown to static hosting.",
    steps: [
      { title: "MDX and JSON", note: "articles and copy", tone: "gray" },
      { title: "next build", note: "server components run here" },
      { title: "out/", note: "HTML, payload, images", tone: "violet" },
      { title: "Checks", note: "tests, axe, Lighthouse", tone: "red" },
      { title: "GitHub Pages", note: "files only, no server", tone: "green" },
    ],
  },
  "state-ladder": {
    kind: "flow",
    caption: "Start at the left and move right only when the current place stops working.",
    steps: [
      { title: "Derive it", note: "no state at all", tone: "green" },
      { title: "Local state", note: "one component" },
      { title: "Lift it", note: "nearest common parent" },
      { title: "URL", note: "shareable, survives reload", tone: "violet" },
      { title: "Server cache", note: "data you don't own", tone: "violet" },
      { title: "Global store", note: "last resort", tone: "red" },
    ],
  },
  "safari-export": {
    kind: "flow",
    caption: "Why the export was blank: the SVG wrapper is the step WebKit refuses to paint.",
    steps: [
      { title: "Chart DOM", note: "divs, canvases, tables", tone: "gray" },
      { title: "Clone", note: "with inlined styles" },
      { title: "SVG foreignObject", note: "WebKit paints nothing", tone: "red" },
      { title: "Canvas", note: "empty", tone: "red" },
      { title: "PNG", note: "blank file", tone: "red" },
    ],
  },
  "tus-sequence": {
    kind: "flow",
    caption: "After a failure the client never guesses. It asks for the stored offset and continues from there.",
    steps: [
      { title: "POST", note: "create, get a URL" },
      { title: "PATCH from 0", note: "send bytes" },
      { title: "Connection lost", note: "server keeps what it has", tone: "red" },
      { title: "HEAD", note: "Upload-Offset: 12163470", tone: "violet" },
      { title: "PATCH from 12163470", note: "until complete", tone: "green" },
    ],
  },
  "trust-boundary": {
    kind: "flow",
    caption: "Validate where data enters. After that the renderer can rely on the type.",
    steps: [
      { title: "Stored string", note: "any shape, any age", tone: "gray" },
      { title: "JSON.parse", note: "may throw", tone: "red" },
      { title: "Shape check", note: "drop invalid items" },
      { title: "Typed value", note: "safe by construction", tone: "violet" },
      { title: "Render", note: "cannot crash on it", tone: "green" },
    ],
  },
  "schema-forms": {
    kind: "flow",
    caption: "Translate the schema, not the form. Every form generated from it is then translated too.",
    steps: [
      { title: "JSON Schema", note: "English titles, from a backend", tone: "gray" },
      { title: "Extract", note: "path → text" },
      { title: "Catalog", note: "fa.json, reviewed by people", tone: "violet" },
      { title: "Localize", note: "copy with translated text" },
      { title: "Form", note: "unchanged generator", tone: "green" },
    ],
  },
  "pr-timeline": {
    kind: "flow",
    caption: "PR #44529, from opening to merge.",
    steps: [
      { title: "22 Sep", note: "opened; changes requested the same day", tone: "gray" },
      { title: "23–25 Sep", note: "lazy loading, table layout, capture size, CORS" },
      { title: "25 Sep", note: "deck.gl overlays share the base map context", tone: "violet" },
      { title: "28–30 Sep", note: "approval, then a Safari report from a reviewer", tone: "red" },
      { title: "1 Oct", note: "merged", tone: "green" },
    ],
  },
};
