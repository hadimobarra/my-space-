import type { Element, ElementContent, Root } from "hast";

const COPY_ICON: Element = {
  type: "element",
  tagName: "svg",
  properties: { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", ariaHidden: "true" },
  children: [
    { type: "element", tagName: "rect", properties: { x: "9", y: "9", width: "13", height: "13", rx: "2" }, children: [] },
    { type: "element", tagName: "path", properties: { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" }, children: [] },
  ],
};

const el = (tagName: string, properties: Element["properties"], children: ElementContent[]): Element => ({
  type: "element",
  tagName,
  properties,
  children,
});

const codeOf = (pre: Element) => pre.children.find((c): c is Element => c.type === "element" && c.tagName === "code");

const languageOf = (code?: Element) =>
  ((code?.properties?.className as string[] | undefined) ?? []).find((c) => c.startsWith("language-"))?.slice("language-".length);

const textOf = (node: ElementContent): string =>
  node.type === "text" ? node.value : node.type === "element" ? node.children.map(textOf).join("") : "";

/** Turns ```embed blocks into <embed-slot> markers, which the article component replaces with demos and diagrams. */
export function rehypeEmbeds() {
  return (tree: Root) => {
    tree.children = tree.children.map((node) => {
      if (node.type !== "element" || node.tagName !== "pre") return node;
      const code = codeOf(node);
      return code && languageOf(code) === "embed" ? el("embed-slot", { name: textOf(code).trim() }, []) : node;
    });
  };
}

/** "{2,4-6}" → line numbers. */
function highlightedLines(meta: string): Set<number> {
  const lines = new Set<number>();
  for (const part of meta.match(/\{([\d,\s-]+)\}/)?.[1].split(",") ?? []) {
    const [from, to = from] = part.split("-").map(Number);
    for (let n = from; n <= to; n++) lines.add(n);
  }
  return lines;
}

/** Split highlighted code into lines, re-opening token spans that run across a line break. */
function splitLines(nodes: ElementContent[]): ElementContent[][] {
  let lines: ElementContent[][] = [[]];
  for (const node of nodes) {
    const parts: ElementContent[][] =
      node.type === "text"
        ? node.value.split("\n").map((value) => (value ? [{ type: "text", value }] : []))
        : node.type === "element"
          ? splitLines(node.children).map((children) => (children.length ? [{ ...node, children }] : []))
          : [[node]];
    lines[lines.length - 1].push(...parts[0]);
    lines = lines.concat(parts.slice(1));
  }
  return lines;
}

function markLines(code: Element, marked: Set<number>) {
  const lines = splitLines(code.children);
  if (lines.at(-1)?.length === 0) lines.pop();
  code.children = lines.map((children, i) =>
    el("span", { className: marked.has(i + 1) ? ["line", "line-marked"] : ["line"] }, [...children, { type: "text", value: "\n" }])
  );
}

/**
 * Wraps code blocks with a file name or language label and a copy button, marks lines, and
 * makes wide blocks and tables reachable by keyboard. Done at build time, so articles need no
 * scripts beyond one delegated copy handler.
 *
 *   ```ts title="lib/parse.ts" {3,5-7}
 */
export function rehypeCodeBlocks({ copyLabel }: { copyLabel: string }) {
  const visit = (parent: Root | Element) => {
    parent.children = (parent.children as ElementContent[]).map((node) => {
      if (node.type !== "element") return node;
      if (node.tagName === "table") {
        return el("div", { className: ["table-wrap"], tabIndex: 0 }, [node]);
      }
      if (node.tagName !== "pre") {
        visit(node);
        return node;
      }
      const code = codeOf(node);
      const meta = (code?.data as { meta?: string } | undefined)?.meta ?? "";
      const marked = highlightedLines(meta);
      if (code && marked.size) markLines(code, marked);

      const label = meta.match(/title="([^"]+)"/)?.[1] ?? languageOf(code);
      node.properties = { ...node.properties, tabIndex: 0 };
      return el("div", { className: ["code-block"], dir: "ltr" }, [
        node,
        ...(label ? [el("span", { className: meta.includes("title=") ? ["code-lang", "code-title"] : ["code-lang"] }, [{ type: "text", value: label }])] : []),
        el("button", { type: "button", className: ["code-copy"], dataCopyCode: "", ariaLabel: copyLabel }, [COPY_ICON]),
      ]);
    }) as typeof parent.children;
  };
  return (tree: Root) => visit(tree);
}
