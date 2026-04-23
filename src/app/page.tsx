"use client";

import { useState, useEffect, useCallback } from "react";
import { Command, CommandInput } from "@/lib/types";
import CommandCard from "@/components/CommandCard";
import CommandForm from "@/components/CommandForm";
import SearchBar from "@/components/SearchBar";
import TagFilter from "@/components/TagFilter";
import Toast, { showToast } from "@/components/Toast";

export default function Home() {
  const [commands, setCommands] = useState<Command[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCommand, setEditingCommand] = useState<Command | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCommands = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedTag) params.set("tag", selectedTag);
      const res = await fetch(`/api/commands?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCommands(data);
    } catch {
      showToast("Failed to load commands", "error");
    } finally {
      setLoading(false);
    }
  }, [search, selectedTag]);

  const fetchTags = useCallback(async () => {
    try {
      const res = await fetch("/api/tags");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTags(data);
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchCommands();
  }, [fetchCommands]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const handleCreate = async (data: CommandInput) => {
    try {
      const res = await fetch("/api/commands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      setIsFormOpen(false);
      showToast("Command added!");
      fetchCommands();
      fetchTags();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to add command", "error");
    }
  };

  const handleUpdate = async (data: CommandInput) => {
    if (!editingCommand) return;
    try {
      const res = await fetch(`/api/commands/${editingCommand.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      setEditingCommand(null);
      setIsFormOpen(false);
      showToast("Command updated!");
      fetchCommands();
      fetchTags();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to update command", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this command?")) return;
    try {
      const res = await fetch(`/api/commands/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("Command deleted!");
      fetchCommands();
      fetchTags();
    } catch {
      showToast("Failed to delete command", "error");
    }
  };

  const openEdit = (cmd: Command) => {
    setEditingCommand(cmd);
    setIsFormOpen(true);
  };

  const openCreate = () => {
    setEditingCommand(null);
    setIsFormOpen(true);
  };

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            ⚡ Command Vault
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {commands.length} command{commands.length !== 1 ? "s" : ""} saved
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 active:bg-blue-800 transition shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Command
        </button>
      </div>

      {/* Search & Filter */}
      <div className="space-y-4 mb-8">
        <SearchBar value={search} onChange={setSearch} />
        <TagFilter tags={tags} selectedTag={selectedTag} onSelect={setSelectedTag} />
      </div>

      {/* Command Grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full mb-4" />
          <p>Loading commands...</p>
        </div>
      ) : commands.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            {search || selectedTag ? "No matching commands" : "No commands yet"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {search || selectedTag
              ? "Try adjusting your search or filters"
              : 'Click "Add Command" to save your first command'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {commands.map((cmd) => (
            <CommandCard
              key={cmd.id}
              command={cmd}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      <CommandForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCommand(null);
        }}
        onSubmit={editingCommand ? handleUpdate : handleCreate}
        editingCommand={editingCommand}
      />

      <Toast />
    </main>
  );
}
