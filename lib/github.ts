import data from "@/content/github.json";

export interface GithubPullRequest {
  repo: string;
  number: number;
  title: string;
  state: "merged" | "open";
  url: string;
  /** Merge date for merged PRs, creation date for open ones. */
  date: string;
}

interface GithubData {
  fetchedAt: string;
  user: string;
  repos: Record<string, { stars: number; forks: number }>;
  pullRequests: GithubPullRequest[];
}

/** Snapshot written by scripts/fetch-github.mjs; CI refreshes it before every build. */
export const github = data as GithubData;

export const mergedPullRequests = github.pullRequests.filter((pr) => pr.state === "merged");
