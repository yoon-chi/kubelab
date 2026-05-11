"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Concept, ConceptInput } from "@/lib/types";
import ConceptForm from "@/components/ConceptForm";
import Markdown from "@/components/Markdown";
import Toast, { showToast } from "@/components/Toast";

export default function ConceptsPage() {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingConcept, setEditingConcept] = useState<Concept | null>(null);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchConcepts = useCallback(async () => {
    try {
      const res = await fetch("/api/concepts");
      if (!res.ok) throw new Error();
      setConcepts(await res.json());
    } catch {
      showToast("Failed to load concepts", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConcepts();
  }, [fetchConcepts]);

  const grouped = useMemo(() => {
    const map = new Map<string, Concept[]>();
    for (const c of concepts) {
      if (!map.has(c.category)) map.set(c.category, []);
      map.get(c.category)!.push(c);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [concepts]);

  const visibleGroups = useMemo(
    () =>
      selectedCategory
        ? grouped.filter(([c]) => c === selectedCategory)
        : grouped,
    [grouped, selectedCategory]
  );

  const toggleExpanded = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCreate = async (data: ConceptInput) => {
    try {
      const res = await fetch("/api/concepts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setIsFormOpen(false);
      showToast("Concept added!");
      fetchConcepts();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to add concept", "error");
    }
  };

  const handleUpdate = async (data: ConceptInput) => {
    if (!editingConcept) return;
    try {
      const res = await fetch(`/api/concepts/${editingConcept.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setEditingConcept(null);
      setIsFormOpen(false);
      showToast("Concept updated!");
      fetchConcepts();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to update concept", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this concept?")) return;
    try {
      const res = await fetch(`/api/concepts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("Concept deleted!");
      fetchConcepts();
    } catch {
      showToast("Failed to delete concept", "error");
    }
  };

  const openEdit = (concept: Concept) => {
    setEditingConcept(concept);
    setIsFormOpen(true);
  };

  const openCreate = () => {
    setEditingConcept(null);
    setIsFormOpen(true);
  };

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            🧠 Kubernetes Concepts
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {concepts.length} concept{concepts.length !== 1 ? "s" : ""} across{" "}
            {grouped.length} categor{grouped.length !== 1 ? "ies" : "y"}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 active:bg-purple-800 transition shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Concept
        </button>
      </div>

      {grouped.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory("")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition border ${
              selectedCategory === ""
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-purple-400"
            }`}
          >
            All categories
          </button>
          {grouped.map(([category, list]) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition border ${
                selectedCategory === category
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-purple-400"
              }`}
            >
              {category} <span className="opacity-70">({list.length})</span>
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-400">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-300 dark:border-gray-600 border-t-purple-500 rounded-full mb-4" />
          <p>Loading concepts...</p>
        </div>
      ) : concepts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🧠</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            No concepts yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Click &ldquo;Add Concept&rdquo; to capture your first Kubernetes concept note.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {visibleGroups.map(([category, list]) => (
            <section key={category}>
              <div className="flex items-baseline justify-between mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {category}
                </h2>
                <span className="text-xs text-gray-500">
                  {list.length} concept{list.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="space-y-3">
                {list.map((concept) => {
                  const isOpen = expanded.has(concept.id);
                  return (
                    <article
                      key={concept.id}
                      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden"
                    >
                      <header
                        onClick={() => toggleExpanded(concept.id)}
                        className="px-5 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <svg
                            className={`w-4 h-4 text-gray-400 transition-transform ${
                              isOpen ? "rotate-90" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          <h3 className="font-medium text-gray-900 dark:text-white truncate">
                            {concept.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEdit(concept);
                            }}
                            className="text-xs px-2 py-1 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(concept.id);
                            }}
                            className="text-xs px-2 py-1 rounded text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </header>
                      {isOpen && (
                        <div className="px-5 pb-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                          <Markdown>{concept.content}</Markdown>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      <ConceptForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingConcept(null);
        }}
        onSubmit={editingConcept ? handleUpdate : handleCreate}
        editingConcept={editingConcept}
        defaultCategory={selectedCategory || undefined}
      />

      <Toast />
    </main>
  );
}
