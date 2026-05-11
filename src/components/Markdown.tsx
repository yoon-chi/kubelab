"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  children: string;
}

export default function Markdown({ children }: Props) {
  return (
    <div className="markdown text-sm text-gray-800 dark:text-gray-200 leading-relaxed space-y-3">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => <h1 className="text-xl font-bold mt-2 mb-2 text-gray-900 dark:text-white" {...props} />,
          h2: (props) => <h2 className="text-lg font-semibold mt-2 mb-2 text-gray-900 dark:text-white" {...props} />,
          h3: (props) => <h3 className="text-base font-semibold mt-2 mb-1 text-gray-900 dark:text-white" {...props} />,
          h4: (props) => <h4 className="text-sm font-semibold mt-2 mb-1 text-gray-900 dark:text-white" {...props} />,
          p: (props) => <p className="leading-relaxed" {...props} />,
          ul: (props) => <ul className="list-disc list-outside pl-6 space-y-1" {...props} />,
          ol: (props) => <ol className="list-decimal list-outside pl-6 space-y-1" {...props} />,
          li: (props) => <li className="leading-relaxed" {...props} />,
          strong: (props) => <strong className="font-semibold text-gray-900 dark:text-white" {...props} />,
          em: (props) => <em className="italic" {...props} />,
          a: (props) => (
            <a
              className="text-indigo-600 dark:text-indigo-400 underline hover:no-underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          blockquote: (props) => (
            <blockquote
              className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400"
              {...props}
            />
          ),
          code: ({ className, children, ...props }) => {
            const isBlock = /language-/.test(className || "");
            if (isBlock) {
              return (
                <code className={`${className} block`} {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code
                className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-[0.85em] text-pink-600 dark:text-pink-400"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: (props) => (
            <pre
              className="bg-gray-900 dark:bg-gray-950 text-gray-100 rounded-lg p-4 overflow-x-auto font-mono text-xs leading-relaxed"
              {...props}
            />
          ),
          table: (props) => (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm" {...props} />
            </div>
          ),
          th: (props) => (
            <th
              className="border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-left font-semibold bg-gray-50 dark:bg-gray-800"
              {...props}
            />
          ),
          td: (props) => (
            <td className="border border-gray-300 dark:border-gray-700 px-3 py-1.5 align-top" {...props} />
          ),
          hr: () => <hr className="border-gray-200 dark:border-gray-700 my-4" />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
