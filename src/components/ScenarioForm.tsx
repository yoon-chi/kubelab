"use client";

import { useState, useEffect, useRef } from "react";
import { Scenario, ScenarioInput } from "@/lib/types";

type ScenarioFormData = Omit<ScenarioInput, "exam">;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ScenarioFormData) => void;
  editingCard?: Scenario | null;
  knownChapters: string[];
  defaultChapter?: string;
}

export default function ScenarioForm({
  isOpen,
  onClose,
  onSubmit,
  editingCard,
  knownChapters,
  defaultChapter,
}: Props) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [chapter, setChapter] = useState("");
  const questionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editingCard) {
      setQuestion(editingCard.question);
      setAnswer(editingCard.answer);
      setChapter(editingCard.chapter);
    } else {
      setQuestion("");
      setAnswer("");
      setChapter(defaultChapter || "");
    }
  }, [editingCard, isOpen, defaultChapter]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => questionRef.current?.focus(), 100);
    }
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
    onSubmit({ question, answer, chapter: chapter.trim() });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-700 rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {editingCard ? "Edit Scenario" : "Add Scenario"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Chapter
            </label>
            <input
              type="text"
              list="ckad-chapter-options"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              placeholder="e.g. Pods, Services, ConfigMaps"
              maxLength={100}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
            />
            <datalist id="ckad-chapter-options">
              {knownChapters.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            <p className="text-xs text-gray-400 mt-1">
              Used to group cards. Leave blank for &ldquo;Uncategorized&rdquo;.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Question <span className="text-red-500">*</span>
            </label>
            <textarea
              ref={questionRef}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What do you want to be able to recall?"
              required
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Answer <span className="text-red-500">*</span>
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="The answer that goes on the back"
              required
              rows={5}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 font-mono text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition resize-none"
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
              className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 active:bg-emerald-800 transition"
            >
              {editingCard ? "Save Changes" : "Add Scenario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
