import React, { useEffect, useMemo } from "react";
import { createHighlightedPageHtml } from "../openCodePage";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function PreviewModal({
  open,
  onClose,
  title,
  previewText = "",
  fullText = "",
  filename = "snippet.txt",
  language = "text",
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const openFullInNewTab = () => {
    const html = createHighlightedPageHtml(fullText || "", {
      title: title || filename,
      language: language || "text",
      filename: filename || "snippet.txt",
      theme: "okaidia",
    });
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  };

  const copyFullToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullText || "");
      alert("Full code copied to clipboard");
    } catch {
      alert("Copy failed");
    }
  };

  const memoPreview = useMemo(
    () => previewText || (fullText || "").slice(0, 800),
    [previewText, fullText]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-xl rounded-xl shadow-xl panel-dark"
        style={{ border: "1px solid #ffffff" }}
      >
        <div
          className="flex items-center justify-between px-4 py-2 border-b"
          style={{ borderColor: "#ffffff" }}
        >
          <div className="text-sm font-medium text-deep-orange-200">
            {title || "Preview"}
          </div>
          <button
            onClick={onClose}
            aria-label="Close preview"
            className="px-2 py-1 rounded hover:bg-white/3 text-slate-200"
          >
            ✕
          </button>
        </div>

        <div className="p-4">
          <div
            className="rounded-md font-mono text-sm leading-6 p-1 max-h-48 overflow-auto border"
            style={{ background: "transparent", borderColor: "#ffffff" }}
          >
            <SyntaxHighlighter
              language={language}
              style={okaidia}
              showLineNumbers={false}
              wrapLongLines
              customStyle={{
                margin: 0,
                padding: "0.5rem",
                background: "transparent",
                borderRadius: 6,
              }}
            >
              {memoPreview}
            </SyntaxHighlighter>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={openFullInNewTab}
              className="px-3 py-2 rounded bg-gradient-to-r from-[rgb(255,112,40)] to-[rgb(204,78,0)] text-black hover:opacity-95"
              style={{ border: "1px solid #ffffff" }}
            >
              View full code
            </button>

            <button
              onClick={copyFullToClipboard}
              className="px-3 py-2 rounded border hover:bg-white/3 text-slate-200"
              style={{ border: "1px solid #ffffff" }}
            >
              Copy full code
            </button>

            <a
              onClick={(e) => {
                e.preventDefault();
                const blob = new Blob([fullText || ""], {
                  type: "text/plain;charset=utf-8",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = filename || "snippet.txt";
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
              }}
              href="#"
              className="px-3 py-2 rounded border hover:bg-white/3 text-slate-200 inline-block"
              style={{ border: "1px solid #ffffff" }}
            >
              Download
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
