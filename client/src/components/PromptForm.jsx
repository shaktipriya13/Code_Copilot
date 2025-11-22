import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postGenerate } from "../api.js";
import CodeViewer from "./CodeViewer.jsx";
import Spinner from "./Spinner.jsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default function PromptForm({ languages = [] }) {
  const [prompt, setPrompt] = useState("");
  const [languageId, setLanguageId] = useState(languages[0]?.id || "");
  const [generated, setGenerated] = useState(null);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postGenerate,
    onSuccess: (data) => {
      setGenerated(data.generation);
      setPrompt("");
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
    onError: (err) => {
      alert("Failed: " + (err.message || "Try again"));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim() || !languageId) return;
    mutation.mutate({ prompt: prompt.trim(), languageId: Number(languageId) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-deep-orange-200">
          Generate Code
        </h2>
        <div className="text-sm text-slate-400">
          AI model:{" "}
          <span className="font-medium text-deep-orange-300">
            Gemini 2.5 Flash
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2 text-slate-200">
              What do you want?
            </label>
            <textarea
              rows={6}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Create a debounce hook in React"
              className="w-full p-4 rounded-lg border border-white/100 bg-[rgba(0,0,0,0.55)] font-mono text-sm text-slate-200 resize-y"
              required
            />
            <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
              <div>Tip: be explicit about inputs, outputs & constraints.</div>
              <div className="ml-auto">Characters: {prompt.length}</div>
            </div>
          </div>

          <div className="md:col-span-1 flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-200">
                Language
              </label>
              <select
                value={languageId}
                onChange={(e) => setLanguageId(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg bg-[rgba(0,0,0,0.55)] text-slate-200"
                required
              >
                <option value="">Select language</option>
                {languages.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={mutation.isPending}
                className={`btn-accent w-full ${
                  mutation.isPending ? "opacity-80" : ""
                }`}
                style={{ border: "1px solid #ffffff" }}
              >
                {mutation.isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <Spinner /> Generating…
                  </div>
                ) : (
                  "Generate Code"
                )}
              </button>
            </div>

            <div className="text-xs text-slate-400 mt-2">
              Recent model runs and history are saved in the sidebar — you can
              revisit any snippet.
            </div>
          </div>
        </div>
      </form>

      {generated && (
        <div className="mt-6 border-t pt-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-slate-400">
              Generated {dayjs(generated.createdAt).fromNow()}
            </div>
            <div className="text-sm font-medium text-deep-orange-300">
              ✓ {generated.modelName}
            </div>
          </div>

          <div className="code-wrap">
            <CodeViewer
              code={generated.code || ""}
              languageKey={generated.language?.slug || "plaintext"}
            />
          </div>
        </div>
      )}
    </div>
  );
}
