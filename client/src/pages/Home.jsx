import React from "react";
import PromptForm from "../components/PromptForm.jsx";
import HistoryFeed from "../components/HistoryFeed.jsx";

export default function Home({ languages }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
      <div className="lg:col-span-2">
        <div className="bg-glass rounded-xl shadow-lg p-8 border-white/100">
          <PromptForm languages={languages} />
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-glass/85 backdrop-blur-md rounded-xl shadow-lg p-6 border-white/100 h-[340px] overflow-y-auto custom-scroll">
          <h2 className="text-xl font-bold text-deep-orange-200 mb-4">
            Recent Generations
          </h2>
          <HistoryFeed />
        </div>
      </div>
    </div>
  );
}
