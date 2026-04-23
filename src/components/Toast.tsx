"use client";

import { useEffect, useState } from "react";

interface ToastMessage {
  id: number;
  text: string;
  type: "success" | "error";
}

let toastId = 0;
let addToastFn: ((text: string, type: "success" | "error") => void) | null = null;

export function showToast(text: string, type: "success" | "error" = "success") {
  addToastFn?.(text, type);
}

export default function Toast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    addToastFn = (text, type) => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, text, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    };
    return () => {
      addToastFn = null;
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium animate-slide-up ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.text}
        </div>
      ))}
    </div>
  );
}
