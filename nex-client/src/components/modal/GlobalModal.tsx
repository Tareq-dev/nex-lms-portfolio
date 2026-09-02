"use client";

import { X } from "lucide-react";

export default function GlobalModal({
  isOpen,
  onClose,
  title,
  children,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* modal */}
      <div
        className="
        relative
        bg-white dark:bg-zinc-900
        w-full md:w-[500px]
        h-full md:h-auto
        md:rounded-2xl
        p-6
        animate-fade
      "
      >
        <div className="flex justify-between mb-6">

          <h2 className="text-xl font-semibold">
            {title}
          </h2>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        {children}

      </div>

    </div>
  );
}