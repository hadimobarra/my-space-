// Refreshes content/github.json with public pull requests and repository stats.
// If GitHub can't be reached, the committed snapshot stays in place and the build goes on.
import { readFile, writeFile } from "node:fs/promises";

const USER = "hadimobarra";
const MIN_STARS = 500; // keeps training and exercise repositories out
const FILE = new URL("../content/github.json", import.meta.url);

const headers = { Accept: "application/vnd.github+json" };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

async function api(path) {
  const res = await fetch(`https://api.github.com/${path}`, { headers, signal: AbortSignal.timeout(15_000) });
  if (!res.ok) throw new Error(`GitHub ${res.status} for ${path}`);
  return res.json();
}

try {
  const query = encodeURIComponent(`author:${USER} type:pr is:public -user:${USER}`);
  const { items } = await api(`search/issues?q=${query}&per_page=100`);

  const pulls = items
    .map((pr) => {
      const mergedAt = pr.pull_request?.merged_at ?? null;
      return {
        repo: pr.repository_url.replace("https://api.github.com/repos/", ""),
        number: pr.number,
        title: pr.title,
        state: mergedAt ? "merged" : pr.state,
        url: pr.html_url,
        date: (mergedAt ?? pr.created_at).slice(0, 10),
      };
    })
    .filter((pr) => pr.state === "merged" || pr.state === "open");

  const repos = {};
  for (const name of [...new Set(pulls.map((pr) => pr.repo))].sort()) {
    const repo = await api(`repos/${name}`);
    if (repo.stargazers_count >= MIN_STARS) repos[name] = { stars: repo.stargazers_count, forks: repo.forks_count };
  }

  const pullRequests = pulls
    .filter((pr) => repos[pr.repo])
    .sort((a, b) => (a.state === b.state ? b.date.localeCompare(a.date) : a.state === "merged" ? -1 : 1));
  if (pullRequests.length === 0) throw new Error("no pull requests returned");

  const data = { fetchedAt: new Date().toISOString().slice(0, 10), user: USER, repos, pullRequests };
  await writeFile(FILE, JSON.stringify(data, null, 2) + "\n");
  console.log(`content/github.json: ${pullRequests.length} pull requests in ${Object.keys(repos).length} repositories`);
} catch (error) {
  await readFile(FILE); // fail only when there is no snapshot to fall back on
  console.warn(`Keeping the existing content/github.json (${error.message})`);
}
