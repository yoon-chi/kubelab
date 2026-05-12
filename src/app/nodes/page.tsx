import Link from "next/link";
import { listNodes, createNode } from "./actions";
import NodeCard from "./NodeCard";

export const dynamic = "force-dynamic";

export default async function NodesPage() {
  const nodes = await listNodes();

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
        🐧 Ubuntu Nodes
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
        Spin up disposable Ubuntu containers and shell into them from the browser.
      </p>

      <section className="mb-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Nodes
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Containers named <code className="font-mono">kubelab-node-*</code> (image: ubuntu:22.04).
          </p>
        </div>
        <form action={createNode}>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
          >
            + Add node
          </button>
        </form>
      </section>

      {nodes.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          No nodes yet. Make sure Docker Desktop is running, then click <strong>Add node</strong>.
        </p>
      ) : (
        <div className="space-y-4">
          {nodes.map((n) => (
            <NodeCard key={n.name} node={n} />
          ))}
        </div>
      )}
    </main>
  );
}
