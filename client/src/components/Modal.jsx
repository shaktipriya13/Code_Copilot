import React, { useEffect } from "react";
export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative z-10 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden panel-dark"
        style={{ border: "1px solid #ffffff" }}
      >
        <div
          className="flex items-center justify-between px-5 py-3 border-b"
          style={{ borderColor: "#ffffff" }}
        >
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-deep-orange-200">
              {title || "Code"}
            </h3>
            <div className="text-xs text-slate-400">
              Press <span className="font-medium">Esc</span> to close
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="rounded px-2 py-1 hover:bg-white/3 text-slate-200"
          >
            ✕
          </button>
        </div>

        <div className="p-4 max-h-[70vh] overflow-auto">{children}</div>
      </div>
    </div>
  );
}
