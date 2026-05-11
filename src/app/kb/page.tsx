"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Note, NoteInput } from "@/lib/types";
import NoteForm from "@/components/NoteForm";
import Markdown from "@/components/Markdown";
import Toast, { showToast } from "@/components/Toast";

export default function KnowledgeBasePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedResource, setSelectedResource] = useState<string>("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch("/api/notes");
      if (!res.ok) throw new Error();
      setNotes(await res.json());
    } catch {
      showToast("Failed to load notes", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const grouped = useMemo(() => {
    const map = new Map<string, Note[]>();
    for (const n of notes) {
      if (!map.has(n.resource)) map.set(n.resource, []);
      map.get(n.resource)!.push(n);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [notes]);

  const visibleGroups = useMemo(
    () =>
      selectedResource
        ? grouped.filter(([r]) => r === selectedResource)
        : grouped,
    [grouped, selectedResource]
  );

  const toggleExpanded = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCreate = async (data: NoteInput) => {
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setIsFormOpen(false);
      showToast("Note added!");
      fetchNotes();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to add note", "error");
    }
  };

  const handleUpdate = async (data: NoteInput) => {
    if (!editingNote) return;
    try {
      const res = await fetch(`/api/notes/${editingNote.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setEditingNote(null);
      setIsFormOpen(false);
      showToast("Note updated!");
      fetchNotes();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to update note", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this note?")) return;
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("Note deleted!");
      fetchNotes();
    } catch {
      showToast("Failed to delete note", "error");
    }
  };

  const openEdit = (note: Note) => {
    setEditingNote(note);
    setIsFormOpen(true);
  };

  const openCreate = () => {
    setEditingNote(null);
    setIsFormOpen(true);
  };

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            📚 Kubernetes Resource Knowledge Base
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {notes.length} note{notes.length !== 1 ? "s" : ""} across{" "}
            {grouped.length} k8s resource{grouped.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 active:bg-indigo-800 transition shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Note
        </button>
      </div>

      {grouped.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedResource("")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition border ${
              selectedResource === ""
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-400"
            }`}
          >
            All resources
          </button>
          {grouped.map(([resource, list]) => (
            <button
              key={resource}
              onClick={() => setSelectedResource(resource)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition border ${
                selectedResource === resource
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-400"
              }`}
            >
              {resource} <span className="opacity-70">({list.length})</span>
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-400">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-300 dark:border-gray-600 border-t-indigo-500 rounded-full mb-4" />
          <p>Loading notes...</p>
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            No notes yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Click &ldquo;Add Note&rdquo; to capture your first note about a Kubernetes resource.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {visibleGroups.map(([resource, list]) => (
            <section key={resource}>
              <div className="flex items-baseline justify-between mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {resource}
                </h2>
                <span className="text-xs text-gray-500">
                  {list.length} note{list.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="space-y-3">
                {list.map((note) => {
                  const isOpen = expanded.has(note.id);
                  return (
                    <article
                      key={note.id}
                      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden"
                    >
                      <header
                        onClick={() => toggleExpanded(note.id)}
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
                            {note.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEdit(note);
                            }}
                            className="text-xs px-2 py-1 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(note.id);
                            }}
                            className="text-xs px-2 py-1 rounded text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </header>
                      {isOpen && (
                        <div className="px-5 pb-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                          <Markdown>{note.content}</Markdown>
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

      <NoteForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingNote(null);
        }}
        onSubmit={editingNote ? handleUpdate : handleCreate}
        editingNote={editingNote}
        defaultResource={selectedResource || undefined}
      />

      <Toast />
    </main>
  );
}
