import Link from "next/link";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { revalidatePath } from "next/cache";
import path from "node:path";

const run = promisify(execFile);

async function createCluster() {
  "use server";
  const script = path.join(process.cwd(), "cluster", "up.sh");
  try {
    await run(script, [], { timeout: 5 * 60 * 1000 });
  } catch {
    // surface via the node status section below
  }
  revalidatePath("/cluster");
}

async function getNodes(): Promise<{ ok: boolean; output: string }> {
  try {
    const { stdout } = await run(
      "kubectl",
      ["--context", "kind-command-vault", "get", "nodes", "-o", "wide"],
      { timeout: 5000 }
    );
    return { ok: true, output: stdout };
  } catch (err) {
    const e = err as { stderr?: string; message?: string };
    return { ok: false, output: e.stderr || e.message || "unknown error" };
  }
}

export const dynamic = "force-dynamic";

export default async function ClusterPage() {
  const { ok, output } = await getNodes();

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
        >
          ← Back
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        ☸️ Local Cluster
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
        kind cluster <code className="font-mono">command-vault</code> — 1 control-plane + 2 workers
      </p>

      <section className="mb-8 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Manage
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Run from the repo root:
        </p>
        <pre className="font-mono text-xs bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-3 overflow-x-auto mb-4">
          ./cluster/up.sh    # create{"\n"}
          ./cluster/down.sh  # delete
        </pre>
        <form action={createCluster}>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 active:bg-blue-800 transition disabled:opacity-60"
            disabled={ok}
          >
            Create Cluster
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Nodes
          </h2>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              ok
                ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
            }`}
          >
            {ok ? "running" : "unavailable"}
          </span>
        </div>
        <pre className="font-mono text-xs bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-3 overflow-x-auto whitespace-pre">
          {output}
        </pre>
      </section>
    </main>
  );
}
