import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchHistory } from "../api.js";
import Pagination from "./Pagination.jsx";
import dayjs from "dayjs";
import { createHighlightedPageHtml } from "../openCodePage";

export default function HistoryFeed() {
  const [page, setPage] = useState(1);
  const limit = 6;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["history", page],
    queryFn: () => fetchHistory(page, limit),
    keepPreviousData: true,
    staleTime: 1000 * 30,
  });

  const generations = data?.data ?? [];
  const total = data?.total ?? 0;

  if (isLoading)
    return <div className="text-sm text-slate-400">Loading history…</div>;
  if (isError)
    return <div className="text-rose-400 text-sm">Failed to load history</div>;
  if (generations.length === 0)
    return (
      <div className="text-sm text-slate-400">
        No history yet. Generate your first snippet!
      </div>
    );

  const mapLanguageForPrism = (lang) => {
    if (!lang) return "text";
    const l = String(lang).toLowerCase();
    const map = {
      "c++": "cpp",
      "c#": "csharp",
      cs: "csharp",
      js: "javascript",
      ts: "typescript",
      py: "python",
      sh: "bash",
      shell: "bash",
      bash: "bash",
      json: "json",
      html: "html",
      css: "css",
      cpp: "cpp",
    };
    return map[l] || l;
  };

  const getPreviewText = (code = "", maxLines = 8) => {
    const lines = String(code || "").split("\n");
    if (lines.length <= maxLines) return code;
    const preview = lines.slice(0, maxLines).join("\n");
    return preview + "\n\n...";
  };

  const developerScreenshot =
    "/mnt/data/404fdf30-c897-4e60-9ea0-19ac7609f811.png";

  const openFullInNewTab = (gen) => {
    const code = gen.code || "";
    const rawLang = gen.language?.slug || gen.language?.name || "text";
    const prismLang = mapLanguageForPrism(rawLang);

    const html = createHighlightedPageHtml(code, {
      title: gen.prompt || `snippet.${prismLang}`,
      language: prismLang,
      filename: `snippet.${prismLang === "text" ? "txt" : prismLang}`,
      theme: "okaidia",
      screenshotUrl: gen.screenshot || developerScreenshot,
    });

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  };

  return (
    <>
      <div className="space-y-4">
        {generations.map((g) => (
          <div
            key={g.id}
            className="rounded-lg p-4 bg-glass hover:shadow-lg transition"
            style={{ border: "1px solid #ffffff" }}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="font-medium text-sm text-deep-orange-200">
                {g.language?.name ?? "Unknown"}
              </span>
              <span className="text-xs text-slate-400">
                {dayjs(g.createdAt).format("MMM D, YYYY HH:mm")}
              </span>
            </div>

            <p className="text-sm text-slate-300 line-clamp-2 mb-3 font-mono">
              {g.prompt}
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => openFullInNewTab(g)}
                className="text-sm text-deep-orange-200 hover:underline flex items-center gap-2"
              >
                ▶ View code →
              </button>

              <button
                onClick={() => {
                  navigator.clipboard
                    ?.writeText(g.code || "")
                    .then(() => alert("Code copied to clipboard"))
                    .catch(() => alert("Copy failed"));
                }}
                className="text-sm text-slate-300 hover:text-slate-100"
                title="Copy code"
              >
                Copy
              </button>

              <button
                onClick={() => {
                  const blob = new Blob([g.code || ""], {
                    type: "text/plain;charset=utf-8",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `snippet.${mapLanguageForPrism(
                    g.language?.slug || "txt"
                  )}`;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  URL.revokeObjectURL(url);
                }}
                className="text-sm text-slate-300 hover:text-slate-100"
              >
                Download
              </button>
            </div>
          </div>
        ))}

        <Pagination page={page} setPage={setPage} total={total} limit={limit} />
      </div>
    </>
  );
}
