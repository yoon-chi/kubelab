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

      <div className="grid gap-6 sm:grid-cols-2">
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
      </div>
    </main>
  );
}
