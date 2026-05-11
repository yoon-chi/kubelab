"use client";

import { useState, useEffect, useRef } from "react";
import { Concept, ConceptInput, KUBERNETES_CONCEPTS } from "@/lib/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ConceptInput) => void;
  editingConcept?: Concept | null;
  defaultCategory?: string;
}

export default function ConceptForm({
  isOpen,
  onClose,
  onSubmit,
  editingConcept,
  defaultCategory,
}: Props) {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingConcept) {
      setCategory(editingConcept.category);
      setTitle(editingConcept.title);
      setContent(editingConcept.content);
    } else {
      const fallback = defaultCategory && (KUBERNETES_CONCEPTS as readonly string[]).includes(defaultCategory)
        ? defaultCategory
        : "Workloads";
      setCategory(fallback);
      setTitle("");
      setContent("");
    }
  }, [editingConcept, isOpen, defaultCategory]);

  useEffect(() => {
    if (isOpen) setTimeout(() => titleRef.current?.focus(), 100);
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ category, title: title.trim(), content });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-700 rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {editingConcept ? "Edit Concept" : "Add Concept"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Concept category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            >
              {KUBERNETES_CONCEPTS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. How kube-proxy implements ClusterIP"
              required
              maxLength={255}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Markdown supported. Write what you want to remember."
              required
              rows={12}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-y"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 active:bg-purple-800 transition"
            >
              {editingConcept ? "Save Changes" : "Add Concept"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
