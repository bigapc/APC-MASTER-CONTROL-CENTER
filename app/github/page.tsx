import {
  getAllRepoStatuses,
  getAllWorkflowRuns,
  getAllDeployments,
} from "@/lib/github/client";
import { repositories } from "@/lib/github/repositories";
import type { GitHubRepoStatus, GitHubWorkflow, GitHubDeployment } from "@/lib/github/types";

const STATUS_COLOR: Record<GitHubRepoStatus["status"], string> = {
  live: "text-green-400",
  degraded: "text-yellow-400",
  offline: "text-red-400",
  unknown: "text-zinc-400",
};

const WORKFLOW_COLOR: Record<GitHubWorkflow["status"], string> = {
  success: "text-green-400",
  failure: "text-red-400",
  in_progress: "text-yellow-400",
  pending: "text-zinc-400",
  unknown: "text-zinc-500",
};

const DEPLOY_COLOR: Record<GitHubDeployment["status"], string> = {
  active: "text-green-400",
  failed: "text-red-400",
  pending: "text-yellow-400",
  unknown: "text-zinc-500",
};

function fmt(iso: string) {
  if (!iso || iso === "N/A") return "N/A";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const TOKEN_PRESENT = Boolean(process.env.GITHUB_TOKEN);

export default async function GithubPage() {
  const fallbackStatuses: GitHubRepoStatus[] = repositories.map((r) => ({
    name: r.name,
    owner: r.owner,
    branch: "main",
    status: "unknown",
    lastCommit: "N/A",
    visibility: "private",
  }));

  const [statuses, workflows, deployments] = await Promise.all([
    getAllRepoStatuses().catch(() => fallbackStatuses),
    getAllWorkflowRuns().catch(() => [] as GitHubWorkflow[]),
    getAllDeployments().catch(() => [] as GitHubDeployment[]),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black">GitHub Repository Status</h1>
          <p className="text-zinc-400 mt-1">
            Live status for all APC-connected repositories
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
            TOKEN_PRESENT
              ? "bg-green-900/50 text-green-300"
              : "bg-zinc-800 text-zinc-400"
          }`}
        >
          {TOKEN_PRESENT ? "GitHub Token Active" : "Demo Mode — No Token"}
        </span>
      </div>

      {/* Repository Status */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-200">Repositories</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {statuses.map((repo) => (
            <div
              key={repo.name}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-2"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-black text-white text-sm">
                  {repo.owner}/{repo.name}
                </h3>
                <span className={`text-xs font-bold uppercase ${STATUS_COLOR[repo.status]}`}>
                  {repo.status}
                </span>
              </div>
              <div className="text-xs text-zinc-400 space-y-1">
                <div>Branch: <span className="text-zinc-200">{repo.branch}</span></div>
                <div>Visibility: <span className="text-zinc-200">{repo.visibility}</span></div>
                <div>Last Commit: <span className="text-zinc-200">{fmt(repo.lastCommit)}</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow Runs */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-200">Recent Workflow Runs</h2>
        {workflows.length === 0 ? (
          <p className="text-zinc-500 text-sm">
            No workflow runs — set GITHUB_TOKEN to fetch live CI data.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full text-sm">
              <thead className="bg-zinc-900 text-zinc-400 text-left text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Workflow</th>
                  <th className="px-4 py-3">Repository</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Run At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 bg-zinc-950">
                {workflows.slice(0, 15).map((wf) => (
                  <tr key={wf.id} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="px-4 py-3 text-zinc-200">{wf.name}</td>
                    <td className="px-4 py-3 text-zinc-400">{wf.repo}</td>
                    <td className={`px-4 py-3 font-bold uppercase text-xs ${WORKFLOW_COLOR[wf.status]}`}>
                      {wf.status}
                    </td>
                    <td className="px-4 py-3 text-zinc-400">{fmt(wf.runAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Deployments */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-200">Deployments</h2>
        {deployments.length === 0 ? (
          <p className="text-zinc-500 text-sm">
            No deployments found — set GITHUB_TOKEN to fetch live deployment data.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full text-sm">
              <thead className="bg-zinc-900 text-zinc-400 text-left text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Repository</th>
                  <th className="px-4 py-3">Environment</th>
                  <th className="px-4 py-3">SHA</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Deployed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 bg-zinc-950">
                {deployments.slice(0, 15).map((dep) => (
                  <tr key={dep.id} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="px-4 py-3 text-zinc-400">{dep.repo}</td>
                    <td className="px-4 py-3 text-zinc-200">{dep.environment}</td>
                    <td className="px-4 py-3 font-mono text-zinc-400">{dep.sha}</td>
                    <td className={`px-4 py-3 font-bold uppercase text-xs ${DEPLOY_COLOR[dep.status]}`}>
                      {dep.status}
                    </td>
                    <td className="px-4 py-3 text-zinc-400">{fmt(dep.deployedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
