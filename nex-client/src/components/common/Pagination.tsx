"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationItem = number | "left-ellipsis" | "right-ellipsis";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function createPaginationItems(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "right-ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "left-ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "left-ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "right-ellipsis",
    totalPages,
  ];
}

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = "",
}: PaginationProps) {
  if (totalItems === 0) return null;

  const safeItemsPerPage = Math.max(1, itemsPerPage);

  const totalPages = Math.ceil(totalItems / safeItemsPerPage);

  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  const startItem = (safeCurrentPage - 1) * safeItemsPerPage + 1;

  const endItem = Math.min(safeCurrentPage * safeItemsPerPage, totalItems);

  const paginationItems = createPaginationItems(safeCurrentPage, totalPages);

  const changePage = (page: number) => {
    if (page < 1 || page > totalPages || page === safeCurrentPage) {
      return;
    }

    onPageChange(page);
  };

  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-900 ${className}`}
    >
      <p className="text-center text-sm text-slate-500 sm:text-left dark:text-zinc-400">
        Showing{" "}
        <span className="font-semibold text-slate-900 dark:text-white">
          {startItem}
        </span>
        {" – "}
        <span className="font-semibold text-slate-900 dark:text-white">
          {endItem}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-slate-900 dark:text-white">
          {totalItems}
        </span>{" "}
        items
      </p>

      <nav
        aria-label="Pagination navigation"
        className="flex flex-wrap items-center justify-center gap-1.5"
      >
        <button
          type="button"
          disabled={safeCurrentPage === 1}
          onClick={() => changePage(safeCurrentPage - 1)}
          aria-label="Go to previous page"
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-white disabled:hover:text-slate-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 dark:disabled:hover:border-zinc-700 dark:disabled:hover:bg-zinc-800 dark:disabled:hover:text-zinc-300"
        >
          <ChevronLeft aria-hidden="true" size={15} />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {paginationItems.map((item) => {
          if (typeof item !== "number") {
            return (
              <span
                key={item}
                className="flex h-9 w-9 items-center justify-center text-sm text-slate-400 dark:text-zinc-500"
              >
                …
              </span>
            );
          }

          const isActive = item === safeCurrentPage;

          return (
            <button
              type="button"
              key={item}
              onClick={() => changePage(item)}
              aria-label={`Go to page ${item}`}
              aria-current={isActive ? "page" : undefined}
              className={`flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-xs font-bold transition ${
                isActive
                  ? "border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                  : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
              }`}
            >
              {item}
            </button>
          );
        })}

        <button
          type="button"
          disabled={safeCurrentPage === totalPages}
          onClick={() => changePage(safeCurrentPage + 1)}
          aria-label="Go to next page"
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-white disabled:hover:text-slate-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 dark:disabled:hover:border-zinc-700 dark:disabled:hover:bg-zinc-800 dark:disabled:hover:text-zinc-300"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight aria-hidden="true" size={15} />
        </button>
      </nav>
    </div>
  );
}
