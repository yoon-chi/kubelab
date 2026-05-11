import Link from "next/link";

export default function Landing() {
  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-3">
          Welcome
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Pick an environment to get started.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/vault"
          className="group rounded-2xl border border-gray-200 dark:border-gray-800 p-8 hover:border-blue-500 dark:hover:border-blue-400 transition shadow-sm hover:shadow-md bg-white dark:bg-gray-900"
        >
          <div className="text-4xl mb-4">⚡</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
            Command Vault
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Save, search, and organize your shell commands.
          </p>
        </Link>

        <Link
          href="/cluster"
          className="group rounded-2xl border border-gray-200 dark:border-gray-800 p-8 hover:border-blue-500 dark:hover:border-blue-400 transition shadow-sm hover:shadow-md bg-white dark:bg-gray-900"
        >
          <div className="text-4xl mb-4">☸️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
            Local Cluster
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            A kind cluster with 1 control-plane and 2 worker nodes.
          </p>
        </Link>

        <Link
          href="/ckad"
          className="group rounded-2xl border border-gray-200 dark:border-gray-800 p-8 hover:border-emerald-500 dark:hover:border-emerald-400 transition shadow-sm hover:shadow-md bg-white dark:bg-gray-900"
        >
          <div className="text-4xl mb-4">🎴</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
            CKAD Scenarios
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Practice scenarios grouped by chapter — question on the front, answer on the back.
          </p>
        </Link>

        <Link
          href="/kubeadm"
          className="group rounded-2xl border border-gray-200 dark:border-gray-800 p-8 hover:border-orange-500 dark:hover:border-orange-400 transition shadow-sm hover:shadow-md bg-white dark:bg-gray-900"
        >
          <div className="text-4xl mb-4">🛠️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400">
            Kubeadm Cluster Guide
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Step-by-step instructions to spin up your own multi-node Kubernetes cluster with kubeadm.
          </p>
        </Link>

        <Link
          href="/kb"
          className="group rounded-2xl border border-gray-200 dark:border-gray-800 p-8 hover:border-indigo-500 dark:hover:border-indigo-400 transition shadow-sm hover:shadow-md bg-white dark:bg-gray-900"
        >
          <div className="text-4xl mb-4">📚</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
            Knowledge Base
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Notes on each kubernetes resource — grouped, searchable, expandable.
          </p>
        </Link>

        <Link
          href="/concepts"
          className="group rounded-2xl border border-gray-200 dark:border-gray-800 p-8 hover:border-purple-500 dark:hover:border-purple-400 transition shadow-sm hover:shadow-md bg-white dark:bg-gray-900"
        >
          <div className="text-4xl mb-4">🧠</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400">
            Concepts
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Notes on kubernetes concepts — networking, scheduling, storage, security and more.
          </p>
        </Link>

        <Link
          href="/cka"
          className="group rounded-2xl border border-gray-200 dark:border-gray-800 p-8 hover:border-emerald-500 dark:hover:border-emerald-400 transition shadow-sm hover:shadow-md bg-white dark:bg-gray-900"
        >
          <div className="text-4xl mb-4">🧭</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
            CKA Scenarios
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Cluster admin scenarios, grouped by chapter and flippable for quick recall.
          </p>
        </Link>
      </div>
    </main>
  );
}
