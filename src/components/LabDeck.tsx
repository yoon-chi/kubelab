"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Exam, Lab as LabType, LabInput } from "@/lib/types";
import Lab from "@/components/Lab";
import LabForm from "@/components/LabForm";
import Toast, { showToast } from "@/components/Toast";

const UNCATEGORIZED = "Uncategorized";

interface Props {
  exam: Exam;
  title: string;
  emoji: string;
}

export default function LabDeck({ exam, title, emoji }: Props) {
  const [cards, setCards] = useState<LabType[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<LabType | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCards = useCallback(async () => {
    try {
      const res = await fetch(`/api/labs?exam=${exam}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCards(data);
    } catch {
      showToast("Failed to load labs", "error");
    } finally {
      setLoading(false);
    }
  }, [exam]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const grouped = useMemo(() => {
    const map = new Map<string, LabType[]>();
    for (const c of cards) {
      const key = c.chapter?.trim() ? c.chapter : UNCATEGORIZED;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(c);
    }
    return Array.from(map.entries()).sort(([a], [b]) => {
      if (a === UNCATEGORIZED) return 1;
      if (b === UNCATEGORIZED) return -1;
      return a.localeCompare(b);
    });
  }, [cards]);

  const knownChapters = useMemo(
    () => grouped.map(([c]) => c).filter((c) => c !== UNCATEGORIZED),
    [grouped]
  );

  const visibleGroups = useMemo(
    () => (selectedChapter ? grouped.filter(([c]) => c === selectedChapter) : grouped),
    [grouped, selectedChapter]
  );

  const handleCreate = async (data: Omit<LabInput, "exam">) => {
    try {
      const res = await fetch("/api/labs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, exam }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      setIsFormOpen(false);
      showToast("Lab added!");
      fetchCards();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to add lab", "error");
    }
  };

  const handleUpdate = async (data: Omit<LabInput, "exam">) => {
    if (!editingCard) return;
    try {
      const res = await fetch(`/api/labs/${editingCard.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, exam }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      setEditingCard(null);
      setIsFormOpen(false);
      showToast("Lab updated!");
      fetchCards();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to update lab", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this lab?")) return;
    try {
      const res = await fetch(`/api/labs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("Lab deleted!");
      fetchCards();
    } catch {
      showToast("Failed to delete lab", "error");
    }
  };

  const openEdit = (card: LabType) => {
    setEditingCard(card);
    setIsFormOpen(true);
  };

  const openCreate = () => {
    setEditingCard(null);
    setIsFormOpen(true);
  };

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {emoji} {title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {cards.length} lab{cards.length !== 1 ? "s" : ""} across{" "}
            {grouped.length} chapter{grouped.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 active:bg-emerald-800 transition shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Lab
        </button>
      </div>

      {grouped.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedChapter("")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition border ${
              selectedChapter === ""
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-emerald-400"
            }`}
          >
            All chapters
          </button>
          {grouped.map(([chapter, list]) => (
            <button
              key={chapter}
              onClick={() => setSelectedChapter(chapter)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition border ${
                selectedChapter === chapter
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-emerald-400"
              }`}
            >
              {chapter} <span className="opacity-70">({list.length})</span>
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-400">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-300 dark:border-gray-600 border-t-emerald-500 rounded-full mb-4" />
          <p>Loading labs...</p>
        </div>
      ) : cards.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">{emoji}</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            No labs yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Click &ldquo;Add Lab&rdquo; to create your first lab.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {visibleGroups.map(([chapter, list]) => (
            <section key={chapter}>
              <div className="flex items-baseline justify-between mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {chapter}
                </h2>
                <span className="text-xs text-gray-500">
                  {list.length} lab{list.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {list.map((card) => (
                  <Lab
                    key={card.id}
                    card={card}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <LabForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCard(null);
        }}
        onSubmit={editingCard ? handleUpdate : handleCreate}
        editingCard={editingCard}
        knownChapters={knownChapters}
        defaultChapter={selectedChapter || undefined}
      />

      <Toast />
    </main>
  );
}
