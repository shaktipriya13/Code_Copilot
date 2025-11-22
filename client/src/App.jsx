import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLanguages } from "./api.js";
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";

export default function App() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["languages"],
    queryFn: fetchLanguages,
    staleTime: 1000 * 60 * 5,
  });

  const languages = data?.languages || [];

  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center bg-app-hero">
        <div className="text-center">
          <div className="loader mx-auto mb-4" />
          <div className="text-lg font-semibold text-deep-orange-300">
            Loading Code Copilot...
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen grid place-items-center p-4 bg-app-hero">
        <div className="card max-w-xl">
          <h2 className="text-xl font-bold mb-2 text-rose-400">
            Failed to load
          </h2>
          <p className="text-slate-300">
            Could not fetch languages from backend.
          </p>
          {error && (
            <p className="text-sm text-rose-300 mt-2">{error.message}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12 bg-app-hero text-slate-100">
      <Navbar />
      <div className="max-w-6xl mx-auto">
        <header className="mt-6 mb-8 p-6 rounded-xl card">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-deep-orange-200">
                Code Copilot
              </h1>
              <p className="text-slate-300 mt-1">
                Generate code instantly — modern AI code assistant
              </p>
            </div>
          </div>
        </header>

        <Home languages={languages} />
      </div>
      <div className="text-center font-medium mt-2 mb-0">
        Designed & Created by Shakti Priya 🧡
      </div>
    </div>
  );
}
