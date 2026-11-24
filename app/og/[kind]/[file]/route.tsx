import { ImageResponse } from "next/og";
import { getAllPostMeta } from "@/lib/mdx";
import { getProjects } from "@/lib/projects";
import { coverPalette } from "@/lib/cover";
import { siteConfig } from "@/lib/site";

// A route handler rather than opengraph-image.tsx: static hosts need the .png extension
// in the file name to serve the right content type.
export const dynamic = "force-static";
export const dynamicParams = false;

type Card = { title: string; eyebrow: string; tags: string[] };

function getCard(kind: string, slug: string): Card | undefined {
  if (kind === "blog") {
    const post = getAllPostMeta().find((p) => p.slug === slug);
    return post && { title: post.frontmatter.title, eyebrow: `Article · ${post.readingTime} min read`, tags: post.frontmatter.tags };
  }
  const project = getProjects("en").find((p) => p.slug === slug);
  return project && { title: project.frontmatter.title, eyebrow: "Case study", tags: project.frontmatter.tags };
}

export function generateStaticParams() {
  return [
    ...getAllPostMeta().map((p) => ({ kind: "blog", file: `${p.slug}.png` })),
    ...getProjects("en").map((p) => ({ kind: "projects", file: `${p.slug}.png` })),
  ];
}

export async function GET(_request: Request, { params }: { params: Promise<{ kind: string; file: string }> }) {
  const { kind, file } = await params;
  const slug = file.replace(/\.png$/, "");
  const card = getCard(kind, slug);
  if (!card) return new Response("Not found", { status: 404 });
  const [a, b, c] = coverPalette(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "#fff",
          backgroundColor: "#070b14",
          backgroundImage: `radial-gradient(circle at 88% 8%, ${a}b3, transparent 46%), radial-gradient(circle at 8% 100%, ${b}99, transparent 44%)`,
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#cbd2dc" }}>{card.eyebrow}</div>
        <div style={{ display: "flex", fontSize: card.title.length > 60 ? 58 : 70, fontWeight: 700, lineHeight: 1.12, letterSpacing: -2, maxWidth: 1000 }}>
          {card.title}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 30, fontWeight: 600 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 64,
                height: 64,
                borderRadius: 18,
                fontSize: 26,
                backgroundImage: `linear-gradient(135deg, ${a}, ${c})`,
              }}
            >
              HM
            </div>
            {siteConfig.name}
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {card.tags.slice(0, 3).map((tag) => (
              <div key={tag} style={{ display: "flex", padding: "8px 20px", borderRadius: 999, fontSize: 24, backgroundColor: "rgba(255,255,255,0.14)" }}>
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
