"use client";

interface Props {
  tags: string[];
  selectedTag: string;
  onSelect: (tag: string) => void;
}

export default function TagFilter({ tags, selectedTag, onSelect }: Props) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect("")}
        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
          selectedTag === ""
            ? "bg-blue-600 text-white"
            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
        }`}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onSelect(tag === selectedTag ? "" : tag)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            selectedTag === tag
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
