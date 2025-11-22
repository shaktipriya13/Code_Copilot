import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeViewer({ code = "", languageKey = "plaintext" }) {
  const languageMap = {
    javascript: "javascript",
    js: "javascript",
    typescript: "typescript",
    ts: "typescript",
    python: "python",
    py: "python",
    java: "java",
    cpp: "cpp",
    c: "c",
    "c++": "cpp",
    go: "go",
    rust: "rust",
    ruby: "ruby",
    php: "php",
    swift: "swift",
    kotlin: "kotlin",
    html: "html",
    css: "css",
    json: "json",
    bash: "bash",
    shell: "bash",
    sql: "sql",
    text: "text",
    plaintext: "text",
  };

  const safeLanguage = languageMap[languageKey?.toLowerCase()] || "text";

  if (!code.trim()) {
    return (
      <div className="text-center py-10 text-slate-400">
        No code generated yet
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden border panel-dark">
      <div
        className="px-4 py-2 flex justify-between text-xs text-slate-400"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,110,40,0.06), rgba(0,0,0,0.46))",
          borderBottom: "1px solid #ffffff",
        }}
      >
        <span className="text-deep-orange-200">{safeLanguage}</span>
        <span>{code.trim().split("\n").length} lines</span>
      </div>

      <SyntaxHighlighter
        language={safeLanguage}
        style={oneDark}
        showLineNumbers
        wrapLongLines
        customStyle={{ margin: 0, padding: "1.25rem", background: "#060708" }}
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  );
}
