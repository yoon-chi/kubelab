"use client";

import { useState, useEffect } from "react";
import { Scenario as ScenarioType } from "@/lib/types";

interface Props {
  card: ScenarioType;
  onEdit: (card: ScenarioType) => void;
  onDelete: (id: number) => void;
}

export default function Scenario({ card, onEdit, onDelete }: Props) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(false);
  }, [card.id]);

  return (
    <div className="[perspective:1200px] h-64">
      <div
        onClick={() => setFlipped((f) => !f)}
        className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] cursor-pointer ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front */}
        <div className={`absolute inset-0 [backface-visibility:hidden] rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition p-5 flex flex-col ${flipped ? "invisible" : ""}`}>
          <div className="flex items-start justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
              Question
            </span>
            <span className="text-xs text-gray-400">click to flip</span>
          </div>
          <div className="flex-1 overflow-y-auto text-gray-900 dark:text-white whitespace-pre-wrap">
            {card.question}
          </div>
          <CardFooter card={card} onEdit={onEdit} onDelete={onDelete} />
        </div>

        {/* Back */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 shadow-sm p-5 flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              Answer
            </span>
            <span className="text-xs text-gray-400">click to flip</span>
          </div>
          <div className="flex-1 overflow-y-auto text-gray-900 dark:text-white whitespace-pre-wrap font-mono text-sm">
            {card.answer}
          </div>
          <CardFooter card={card} onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>
    </div>
  );
}

function CardFooter({
  card,
  onEdit,
  onDelete,
}: {
  card: ScenarioType;
  onEdit: (card: ScenarioType) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-gray-100 dark:border-gray-700/50">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(card);
        }}
        className="text-xs px-2 py-1 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        Edit
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(card.id);
        }}
        className="text-xs px-2 py-1 rounded text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
      >
        Delete
      </button>
    </div>
  );
}
