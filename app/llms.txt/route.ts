import { trustLabels } from "@/components/site/trust-badge";
import { claims } from "@/content/catalog";
import { getDictionary } from "@/lib/dictionary";
import { getAllPostMeta } from "@/lib/mdx";
import { getProjects } from "@/lib/projects";
import { absoluteUrl, siteConfig } from "@/lib/seo";

export const dynamic = "force-static";

/** A plain-text biography for AI systems, with the same trust labels people see. */
export function GET() {
  const t = getDictionary("en");
  const link = (href: string) => (href.startsWith("/") ? absoluteUrl(href) : href);
  const text = `# ${siteConfig.name}

> ${t.seo.description}

Location: ${t.contact.locationValue}. ${t.hero.available}. Contact: ${siteConfig.links.email}

## Claims and their proof

Labels: "Public proof" can be checked by anyone, "Confirmed by a colleague" comes from a published recommendation, "My word" has no public proof.

${claims.map((c) => `- [${trustLabels[c.trust].en}] ${c.text.en} (${c.when.en})${c.proofs.length ? ` Proof: ${c.proofs.map((p) => link(p.href)).join(" ")}` : ""}`).join("\n")}

## Case studies

${getProjects("en").map((p) => `- [${p.frontmatter.title}](${absoluteUrl(`/projects/${p.slug}/`)}): ${p.frontmatter.summary}`).join("\n")}

## Articles

${getAllPostMeta().map((p) => `- [${p.frontmatter.title}](${absoluteUrl(`/blog/${p.slug}/`)}): ${p.frontmatter.description}`).join("\n")}

## About this site

- [Résumé](${absoluteUrl("/resume/")})
- [How AI was used](${absoluteUrl("/ai/")})
- [Corrections](${absoluteUrl("/corrections/")})
`;
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
