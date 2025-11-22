import React from "react";

export default function Navbar() {
  return (
    <nav className="w-full py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg bg-gradient-to-br from-[rgb(204,78,0)] via-[rgb(255,112,40)] to-[#1f1f1f] 
                       flex items-center justify-center text-black font-bold shadow-md"
            style={{ border: "1px solid #ffffff" }}
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
