import { isValidElement, type ReactElement, type ReactNode } from "react";
import { brandIcons } from "@/lib/brand-icons";

export const dynamic = "force-static";

type IconElement = ReactElement<{ d?: string; attr?: { viewBox?: string }; children?: ReactNode }>;

/** Collect the path data from a react-icons element tree. */
function paths(node: ReactNode): string {
  if (Array.isArray(node)) return node.map(paths).join("");
  if (!isValidElement(node)) return "";
  const { props } = node as IconElement;
  return (props.d ? `<path d="${props.d}"/>` : "") + paths(props.children);
}

/** One cacheable sprite instead of repeating every icon's path in the HTML and the React payload. */
export function GET() {
  const symbols = Object.values(brandIcons).map(({ id, icon }) => {
    const element = icon({}) as IconElement;
    return `<symbol id="${id}" viewBox="${element.props.attr?.viewBox ?? "0 0 24 24"}">${paths(element.props.children)}</symbol>`;
  });
  return new Response(`<svg xmlns="http://www.w3.org/2000/svg">${symbols.join("")}</svg>`, {
    headers: { "Content-Type": "image/svg+xml" },
  });
}
