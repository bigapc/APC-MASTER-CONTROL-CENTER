export interface GitHubRepoStatus {
  name: string;
  owner: string;
  branch: string;
  status: "live" | "degraded" | "offline" | "unknown";
  lastCommit: string;
  visibility: "public" | "private";
}

export interface GitHubWorkflow {
  id: string;
  name: string;
  repo: string;
  status: "success" | "failure" | "in_progress" | "pending" | "unknown";
  runAt: string;
}

export interface GitHubDeployment {
  id: string;
  repo: string;
  environment: string;
  status: "active" | "failed" | "pending" | "unknown";
  deployedAt: string;
  sha: string;
}
