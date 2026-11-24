import { ArrowUpRight, BookMarked, GitFork, GitMerge, GitPullRequest, Star } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import type { Dictionary } from "@/lib/dictionary";
import { formatDate, formatNumber } from "@/lib/format";
import { github } from "@/lib/github";
import type { Locale } from "@/lib/locale";

export function OpenSource({ locale, t }: { locale: Locale; t: Dictionary }) {
  const os = t.openSource;
  const descriptions = new Map(os.repos.map((r) => [r.name, r.description]));
  const repos = Object.entries(github.repos).sort(([, a], [, b]) => b.stars - a.stars);

  return (
    <SectionWrapper id="open-source" eyebrow={t.eyebrows["open-source"]} title={os.title} subtitle={os.subtitle}>
      <div className="grid md:grid-cols-2 gap-6">
        {repos.map(([name, repo]) => (
          <article key={name} className="reveal glass-card rounded-2xl p-6 md:p-7 flex flex-col">
            <h3 className="flex items-center gap-2 text-base font-semibold font-mono mb-3 min-w-0">
              <BookMarked size={16} className="text-muted shrink-0" />
              <a href={`https://github.com/${name}`} dir="ltr" className="hover:text-primary transition-colors break-all">{name}</a>
            </h3>
            {descriptions.has(name) && <p className="text-sm text-muted leading-relaxed mb-4">{descriptions.get(name)}</p>}
            <p className="flex items-center gap-5 text-xs text-muted mb-5">
              <span className="flex items-center gap-1"><Star size={13} aria-hidden /> {formatNumber(repo.stars, locale)} {os.stars}</span>
              <span className="flex items-center gap-1"><GitFork size={13} aria-hidden /> {formatNumber(repo.forks, locale)} {os.forks}</span>
            </p>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">{os.pullRequests}</h4>
            <ul className="divide-y divide-border border-t border-border">
              {github.pullRequests.filter((pr) => pr.repo === name).map((pr) => {
                const merged = pr.state === "merged";
                const Icon = merged ? GitMerge : GitPullRequest;
                return (
                  <li key={pr.number}>
                    <a href={pr.url} data-track={`pr-${pr.number}`} className="group flex items-start gap-3 py-3">
                      <Icon size={16} aria-hidden className={merged ? "text-violet mt-0.5 shrink-0" : "text-accent mt-0.5 shrink-0"} />
                      <span className="min-w-0 flex-1">
                        <span dir="ltr" lang="en" className="block text-start text-sm font-medium group-hover:text-primary transition-colors break-words">{pr.title}</span>
                        <span className="block text-xs text-muted mt-0.5">
                          <bdi>#{pr.number}</bdi> · {merged ? os.merged : os.open} · {formatDate(pr.date, locale)}
                        </span>
                      </span>
                      <ArrowUpRight size={15} aria-hidden className="text-muted mt-0.5 shrink-0 rtl:-scale-x-100" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </div>
      <p className="mt-8 text-center text-xs text-muted">
        {os.updated} <time dateTime={github.fetchedAt}>{formatDate(github.fetchedAt, locale)}</time>
        {" · "}
        <a href={`https://github.com/search?q=author%3A${github.user}+type%3Apr&type=pullrequests`} className="font-medium text-primary underline underline-offset-2">
          {os.viewAll}
        </a>
      </p>
    </SectionWrapper>
  );
}
