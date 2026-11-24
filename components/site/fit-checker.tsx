"use client";

import { useState } from "react";
import { Check, HelpCircle, X } from "lucide-react";

export interface FitSkill {
  name: string;
  trust: "public" | "colleague" | "self";
  claims: { id: string; text: string }[];
}

export interface FitLabels {
  paste: string;
  check: string;
  proven: string;
  word: string;
  missing: string;
  none: string;
  years: string;
  yearsOk: string;
  yearsShort: string;
  nothing: string;
}

/** Other names a job description may use for a skill in the catalog. */
const aliases: Record<string, string[]> = {
  React: ["react", "react.js", "reactjs"], TypeScript: ["typescript", "ts"], JavaScript: ["javascript", "js", "es6"], "Next.js": ["next.js", "nextjs"],
  Redux: ["redux"], "Redux Saga": ["redux saga", "redux-saga"], Zustand: ["zustand"], "Tailwind CSS": ["tailwind"], "Material UI": ["material ui", "mui"],
  "Ant Design": ["ant design", "antd"], Jest: ["jest"], Playwright: ["playwright"], Testing: ["testing", "unit tests", "e2e"], Accessibility: ["accessibility", "a11y", "wcag"],
  Performance: ["performance", "core web vitals"], "CI/CD": ["ci/cd", "continuous integration"], "GitHub Actions": ["github actions"], Docker: ["docker"], Nginx: ["nginx"],
  Webpack: ["webpack"], Sass: ["sass", "scss"], CSS: ["css", "css3"], i18n: ["i18n", "internationalization", "localization"], RTL: ["rtl", "right-to-left"],
  "Access control": ["access control", "rbac", "permissions"], ETL: ["etl", "data pipelines", "pipelines"], "Data catalog": ["data catalog", "metadata"], "Apache Superset": ["superset"],
  OpenMetadata: ["openmetadata"], "Open source": ["open source", "open-source"], "Technical writing": ["technical writing", "documentation"], Communication: ["communication"],
  Teamwork: ["teamwork", "collaboration"], "Code review": ["code review", "code reviews"], "Server components": ["server components", "rsc"], WebGL: ["webgl"], YAML: ["yaml"], "JSON Schema": ["json schema"],
};

/** Common requirements that are not in the catalog, so the answer can be an honest "no". */
const others = ["Angular", "Vue", "Svelte", "Node.js", "Express", "NestJS", "GraphQL", "Python", "Java", "Kotlin", "Swift", "React Native", "Flutter", "Go", "Rust", "C#", ".NET", "PHP", "Ruby", "AWS", "Azure", "GCP", "Kubernetes", "Terraform", "PostgreSQL", "MySQL", "MongoDB", "Kafka", "Spark", "Airflow", "dbt", "Snowflake", "Figma", "Storybook", "Cypress", "D3", "Three.js", "Vite", "Electron", "Machine learning", "Remix", "Astro", "WebSocket", "Microservices"];

const found = (text: string, term: string) => new RegExp(`(^|[^a-z0-9])${term.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}($|[^a-z0-9+#])`).test(text);

export function FitChecker({ skills, years, labels, catalogHref }: { skills: FitSkill[]; years: number; labels: FitLabels; catalogHref: string }) {
  const [text, setText] = useState("");
  const [checked, setChecked] = useState("");

  const job = checked.toLowerCase();
  const matched = checked ? skills.filter((s) => (aliases[s.name] ?? [s.name]).some((a) => found(job, a))) : [];
  const proven = matched.filter((s) => s.trust !== "self");
  const word = matched.filter((s) => s.trust === "self");
  const missing = checked ? others.filter((o) => found(job, o)) : [];
  const asked = Math.max(0, ...[...job.matchAll(/(\d{1,2})\s*\+?\s*(?:years|yrs)/g)].map((m) => Number(m[1])).filter((n) => n < 30));

  const groups = [
    { title: labels.proven, items: proven, Icon: Check, color: "text-accent" },
    { title: labels.word, items: word, Icon: HelpCircle, color: "text-amber-600 dark:text-amber-400" },
  ];

  return (
    <div>
      <label className="block text-sm font-semibold mb-2" htmlFor="job">{labels.paste}</label>
      <textarea id="job" dir="auto" value={text} onChange={(e) => setText(e.target.value)} rows={9} className="w-full rounded-2xl border border-border bg-background p-4 text-sm" />
      <button type="button" onClick={() => setChecked(text)} disabled={!text.trim()} data-track="fit-check" className="btn-gradient mt-3 h-11 px-6 rounded-full text-sm font-semibold disabled:opacity-50">{labels.check}</button>

      <div aria-live="polite">
        {checked && matched.length + missing.length === 0 && <p className="mt-8 text-muted">{labels.nothing}</p>}
        {checked && matched.length + missing.length > 0 && (
          <div className="mt-10 space-y-9">
            {groups.map(({ title, items, Icon, color }) => (
              <section key={title}>
                <h2 className="text-lg font-bold mb-3">{title} ({items.length})</h2>
                {items.length === 0 && <p className="text-sm text-muted">{labels.none}</p>}
                <ul className="space-y-3">
                  {items.map((s) => (
                    <li key={s.name} className="flex gap-3 text-sm">
                      <Icon size={17} aria-hidden className={`${color} mt-0.5 shrink-0`} />
                      <span>
                        <strong>{s.name}</strong>
                        <span className="block text-muted">
                          {s.claims.slice(0, 2).map((c, i) => (
                            <span key={c.id}>{i > 0 && " · "}<a href={`${catalogHref}#${c.id}`} className="underline underline-offset-4 decoration-border hover:text-primary">{c.text}</a></span>
                          ))}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            <section>
              <h2 className="text-lg font-bold mb-3">{labels.missing} ({missing.length})</h2>
              {missing.length === 0 ? <p className="text-sm text-muted">{labels.none}</p> : (
                <ul className="flex flex-wrap gap-2">
                  {missing.map((m) => <li key={m} className="inline-flex items-center gap-1.5 text-sm rounded-full border border-border px-3 py-1"><X size={14} aria-hidden className="text-rose-600" /> {m}</li>)}
                </ul>
              )}
            </section>
            {asked > 0 && <p className="text-sm">{labels.years.replace("{asked}", String(asked)).replace("{have}", String(years))} {asked <= years ? labels.yearsOk : labels.yearsShort}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
