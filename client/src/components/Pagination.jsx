import React from "react";

export default function Pagination({ page, setPage, total = 0, limit = 10 }) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="flex items-center justify-between mt-3">
      <div className="text-sm text-slate-400">
        Page {page} of {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
          className="px-3 py-1 border rounded disabled:opacity-50 text-slate-200 border-white/100 hover:bg-white/2"
        >
          Prev
        </button>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50 text-slate-200 border-white/100 hover:bg-white/2"
        >
          Next
        </button>
      </div>
    </div>
  );
}
