import type { NodeInfo } from "./actions";
import { startNode, stopNode, deleteNode } from "./actions";

export default function NodeCard({ node }: { node: NodeInfo }) {
  const running = node.state === "running";

  return (
    <section className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
      <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <h3 className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
            {node.name}
          </h3>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              running
                ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            {node.state}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {node.status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {running ? (
            <form action={stopNode.bind(null, node.name)}>
              <button className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 text-xs hover:bg-gray-50 dark:hover:bg-gray-800">
                Stop
              </button>
            </form>
          ) : (
            <form action={startNode.bind(null, node.name)}>
              <button className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 text-xs hover:bg-gray-50 dark:hover:bg-gray-800">
                Start
              </button>
            </form>
          )}
          <form action={deleteNode.bind(null, node.name)}>
            <button className="px-3 py-1.5 rounded-md border border-red-300 dark:border-red-900 text-red-700 dark:text-red-400 text-xs hover:bg-red-50 dark:hover:bg-red-950">
              Delete
            </button>
          </form>
        </div>
      </div>

    </section>
  );
}
