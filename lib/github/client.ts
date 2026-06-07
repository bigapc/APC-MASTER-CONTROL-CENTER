import { repositories } from "./repositories";
import type { GitHubRepoStatus, GitHubWorkflow, GitHubDeployment } from "./types";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const BASE = "https://api.github.com";

function githubHeaders() {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${GITHUB_TOKEN}`;
  }

  return headers;
}

async function githubFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: githubHeaders(),
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return null;
    }

    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getRepoStatus(owner: string, name: string): Promise<GitHubRepoStatus> {
  type GHRepo = { default_branch: string; visibility: string };
  type GHCommit = { commit: { author: { date: string } } };

  const [repo, commit] = await Promise.all([
    githubFetch<GHRepo>(`/repos/${owner}/${name}`),
    githubFetch<GHCommit>(`/repos/${owner}/${name}/commits/HEAD`),
  ]);

  return {
    name,
    owner,
    branch: repo?.default_branch ?? "main",
    status: repo ? "live" : "unknown",
    lastCommit: commit?.commit?.author?.date ?? "N/A",
    visibility: (repo?.visibility as "public" | "private") ?? "private",
  };
}

export async function getAllRepoStatuses(): Promise<GitHubRepoStatus[]> {
  return Promise.all(repositories.map((repo) => getRepoStatus(repo.owner, repo.name)));
}

export async function getWorkflowRuns(owner: string, name: string): Promise<GitHubWorkflow[]> {
  type GHRun = { id: number; name: string | null; conclusion: string | null; status: string | null; created_at: string };
  type GHRuns = { workflow_runs: GHRun[] };

  const data = await githubFetch<GHRuns>(`/repos/${owner}/${name}/actions/runs?per_page=5`);

  if (!data) {
    return [];
  }

  return data.workflow_runs.map((run) => ({
    id: String(run.id),
    name: run.name ?? "Workflow",
    repo: `${owner}/${name}`,
    status: mapWorkflowStatus(run.conclusion ?? run.status),
    runAt: run.created_at,
  }));
}

export async function getAllWorkflowRuns(): Promise<GitHubWorkflow[]> {
  const results = await Promise.all(
    repositories.map((repo) => getWorkflowRuns(repo.owner, repo.name))
  );

  return results.flat().sort((a, b) => Date.parse(b.runAt) - Date.parse(a.runAt));
}

export async function getDeployments(owner: string, name: string): Promise<GitHubDeployment[]> {
  type GHDeployment = { id: number; environment: string; sha: string; created_at: string; statuses_url: string };
  type GHStatus = { state: string };

  const deployments = await githubFetch<GHDeployment[]>(`/repos/${owner}/${name}/deployments?per_page=5`);

  if (!deployments) {
    return [];
  }

  return Promise.all(
    deployments.map(async (dep) => {
      const statuses = await githubFetch<GHStatus[]>(
        `/repos/${owner}/${name}/deployments/${dep.id}/statuses`
      );

      const latestState = statuses?.[0]?.state;

      return {
        id: String(dep.id),
        repo: `${owner}/${name}`,
        environment: dep.environment,
        status: mapDeployStatus(latestState),
        deployedAt: dep.created_at,
        sha: dep.sha.slice(0, 7),
      };
    })
  );
}

export async function getAllDeployments(): Promise<GitHubDeployment[]> {
  const results = await Promise.all(
    repositories.map((repo) => getDeployments(repo.owner, repo.name))
  );

  return results.flat().sort((a, b) => Date.parse(b.deployedAt) - Date.parse(a.deployedAt));
}

function mapWorkflowStatus(value: string | null): GitHubWorkflow["status"] {
  switch (value) {
    case "success":
      return "success";
    case "failure":
    case "cancelled":
      return "failure";
    case "in_progress":
      return "in_progress";
    case "queued":
    case "waiting":
      return "pending";
    default:
      return "unknown";
  }
}

function mapDeployStatus(value: string | undefined): GitHubDeployment["status"] {
  switch (value) {
    case "success":
    case "active":
      return "active";
    case "failure":
    case "error":
      return "failed";
    case "pending":
    case "in_progress":
      return "pending";
    default:
      return "unknown";
  }
}
