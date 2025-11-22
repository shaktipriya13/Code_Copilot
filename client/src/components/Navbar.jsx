import React from "react";

export default function Navbar() {
  return (
    <nav className="w-full py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="
    w-10 h-10 
    rounded-xl 
    flex items-center justify-center 
    text-black 
    font-black 
    shadow-[0_4px_10px_rgba(0,0,0,0.45)] 
  "
            style={{
              background:
                "linear-gradient(135deg, rgb(255,140,60) 0%, rgb(255,100,20) 45%, rgb(31,31,31) 100%)",
              border: "2px solid #ffffff",
              fontFamily:
                "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontWeight: 900,
              fontSize: "18px",
              lineHeight: 1,
              letterSpacing: "0.5px",
            }}
          >
            CC
          </div>

          <div>
            <div className="text-lg font-extrabold text-deep-orange-200">
              Code Copilot
            </div>
            <div className="text-xs text-slate-400">
              Generate code instantly • Gemini 2.5 Flash
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <img
            src="/logo.jpg"
            alt="logo"
            className="w-20 h-20 object-contain drop-shadow-lg"
          />

          <button
            className="btn-accent text-sm px-4 py-2"
            style={{ border: "1px solid #ffffff" }}
          >
            AutomationEdge
          </button>
        </div>
      </div>
    </nav>
  );
}
