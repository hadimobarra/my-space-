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

/**
 * Wraps code blocks with a language label and copy button, and makes wide blocks and
 * tables reachable by keyboard. Done at build time so articles need no extra scripts
 * beyond one delegated copy handler.
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
      const code = node.children.find((c): c is Element => c.type === "element" && c.tagName === "code");
      const classes = (code?.properties?.className as string[] | undefined) ?? [];
      const lang = classes.find((c) => c.startsWith("language-"))?.slice("language-".length);
      node.properties = { ...node.properties, tabIndex: 0 };
      return el("div", { className: ["code-block"], dir: "ltr" }, [
        node,
        ...(lang ? [el("span", { className: ["code-lang"] }, [{ type: "text", value: lang }])] : []),
        el("button", { type: "button", className: ["code-copy"], dataCopyCode: "", ariaLabel: copyLabel }, [COPY_ICON]),
      ]);
    }) as typeof parent.children;
  };
  return (tree: Root) => visit(tree);
}
