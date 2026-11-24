// Full-text search. scripts/build-search.mjs indexes ./out; the index is downloaded on first use.

interface Pagefind {
  options: (options: object) => Promise<void>;
  init: () => Promise<void>;
  search: (query: string) => Promise<{ results: { data: () => Promise<{ url: string; plain_excerpt: string; meta: { title?: string } }> }[] } | null>;
}

export interface SearchHit {
  url: string;
  title: string;
  excerpt: string;
}

async function loadIndex(language: string): Promise<Pagefind | null> {
  try {
    const path = `/pagefind/${language}/pagefind.js`;
    const pagefind: Pagefind = await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ path);
    await pagefind.options({ baseUrl: "/" });
    await pagefind.init();
    return pagefind;
  } catch {
    return null; // no index in development
  }
}

let loading: Promise<(Pagefind | null)[]> | undefined;

/** The index of the page's own language, then the English one, which holds most articles. */
function load() {
  loading ??= Promise.all([...new Set([document.documentElement.lang, "en"])].map(loadIndex));
  return loading;
}

export async function searchSite(query: string, limit = 8): Promise<SearchHit[]> {
  const found = await Promise.all((await load()).map((index) => index?.search(query)));
  const results = found.flatMap((f) => f?.results.slice(0, limit) ?? []).slice(0, limit);
  const pages = await Promise.all(results.map((r) => r.data()));
  return pages.map((p) => ({ url: p.url, title: p.meta.title ?? p.url, excerpt: p.plain_excerpt }));
}
