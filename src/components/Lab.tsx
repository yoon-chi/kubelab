"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Lab as LabType } from "@/lib/types";

interface Props {
  card: LabType;
  onEdit: (card: LabType) => void;
  onDelete: (id: number) => void;
}

export default function Lab({ card, onEdit, onDelete }: Props) {
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
          <div className="flex-1 overflow-y-auto text-gray-900 dark:text-white text-sm markdown-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children, ...props }) {
                  const isBlock = /\n/.test(String(children));
                  if (isBlock) {
                    return (
                      <pre className="bg-gray-900 text-gray-100 rounded p-3 overflow-x-auto text-xs my-2">
                        <code className={className} {...props}>{children}</code>
                      </pre>
                    );
                  }
                  return (
                    <code className="bg-gray-200 dark:bg-gray-800 rounded px-1 py-0.5 text-xs font-mono" {...props}>
                      {children}
                    </code>
                  );
                },
                pre({ children }) {
                  return <>{children}</>;
                },
                h1: ({ children }) => <h1 className="text-lg font-bold mt-2 mb-1">{children}</h1>,
                h2: ({ children }) => <h2 className="text-base font-bold mt-2 mb-1">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-bold mt-2 mb-1">{children}</h3>,
                ul: ({ children }) => <ul className="list-disc list-inside my-1 space-y-0.5">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside my-1 space-y-0.5">{children}</ol>,
                p: ({ children }) => <p className="my-1">{children}</p>,
                a: ({ children, href }) => (
                  <a href={href} target="_blank" rel="noreferrer" className="text-emerald-700 dark:text-emerald-300 underline">
                    {children}
                  </a>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-emerald-400 pl-3 italic my-2 text-gray-700 dark:text-gray-300">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <table className="border-collapse my-2 text-xs">{children}</table>
                ),
                th: ({ children }) => <th className="border border-gray-300 dark:border-gray-700 px-2 py-1 font-semibold">{children}</th>,
                td: ({ children }) => <td className="border border-gray-300 dark:border-gray-700 px-2 py-1">{children}</td>,
              }}
            >
              {card.answer}
            </ReactMarkdown>
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
  card: LabType;
  onEdit: (card: LabType) => void;
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
