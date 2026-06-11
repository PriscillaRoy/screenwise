// src/app/search/page.tsx
// Semantic search page — reads ?q= from URL, fires POST /search

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { search as searchApi } from "@/lib/api";
import { ApiError } from "@/lib/api";
import type { SearchResultItem } from "@/lib/types";
import MovieGrid from "@/components/MovieGrid";
import SearchBar from "@/components/SearchBar";

export default function SearchPage() {
  const params = useSearchParams();
  const initialQuery = params.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [cached, setCached] = useState(false);

  async function runSearch(q: string) {
    if (!q.trim()) return;
    setLoading(true);
    setError("");
    setSearched(true);
    setQuery(q);

    // update URL without navigation
    window.history.replaceState({}, "", `/search?q=${encodeURIComponent(q)}`);

    try {
      const res = await searchApi.byDescription(q, 12);
      setResults(res.results);
      setCached(res.cached);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Search failed. Is the backend running?");
      }
    } finally {
      setLoading(false);
    }
  }

  // run search on initial load if ?q= is present
  useEffect(() => {
    if (initialQuery) runSearch(initialQuery);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* Search bar */}
      <div className="max-w-2xl mb-8">
        <SearchBar
          initialQuery={query}
          onSearch={runSearch}
          autoFocus={!initialQuery}
          placeholder="A heist movie with a clever twist..."
        />
      </div>

      {/* Status line */}
      {searched && !loading && !error && (
        <p className="text-sm text-gray-500 mb-4">
          {results.length} result{results.length !== 1 ? "s" : ""} for{" "}
          <span className="text-gray-300">"{query}"</span>
          {cached && <span className="ml-2 text-indigo-400/60 text-xs">cached</span>}
        </p>
      )}

      {error && (
        <p className="text-sm text-red-400 bg-red-900/20 border border-red-800/50 rounded-lg px-4 py-3 mb-4">
          {error}
        </p>
      )}

      {/* Results */}
      <MovieGrid movies={results} showScore loading={loading} />

      {/* Empty state before any search */}
      {!searched && !loading && (
        <div className="text-center py-20">
          <p className="text-gray-600 text-lg">Describe what you're in the mood for.</p>
          <p className="text-gray-700 text-sm mt-1">
            Try "a slow burn psychological thriller" or "feel-good movie about friendship"
          </p>
        </div>
      )}
    </div>
  );
}