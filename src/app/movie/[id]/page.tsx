// src/app/movie/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { search as searchApi } from "@/lib/api";
import type { SearchResultItem } from "@/lib/types";
import MovieCard from "@/components/MovieCard";

export default function MovieDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const movieId = Number(params.id);
  const title = searchParams.get("title") ?? "";
  const fromSearch = searchParams.get("from") === "search";
  const fromQuery = searchParams.get("q") ?? "";

  const [similar, setSimilar] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!title || !movieId) return;
    setLoading(true);
    searchApi
      .similar(title, movieId, 6)
      .then((res) => setSimilar(res.results))
      .catch(() => setError("Could not load similar movies."))
      .finally(() => setLoading(false));
  }, [movieId, title]);

  if (!title) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Movie not found.</p>
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm mt-4 inline-block">
          ← Back to browse
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Browse
        </Link>
        {fromSearch && fromQuery && (
          <>
            <span className="text-gray-700">/</span>
            <Link
              href={`/search?q=${encodeURIComponent(fromQuery)}`}
              className="text-sm text-gray-500 hover:text-white transition-colors"
            >
              Search
            </Link>
          </>
        )}
        <span className="text-gray-700">/</span>
        <span className="text-sm text-gray-400 truncate max-w-[200px]">{title}</span>
      </div>

      {/* Movie header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">{title}</h1>
        <p className="text-gray-500 text-sm">Movie #{movieId}</p>
      </div>

      {/* Similar movies */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">
          Similar to <span className="text-indigo-400">{title}</span>
        </h2>

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-gray-900 border border-gray-800 p-4 animate-pulse">
                <div className="flex justify-between mb-3">
                  <div className="h-5 w-16 rounded-full bg-gray-800" />
                  <div className="h-5 w-10 rounded bg-gray-800" />
                </div>
                <div className="h-4 w-3/4 rounded bg-gray-800 mb-2" />
                <div className="h-4 w-1/2 rounded bg-gray-800" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="text-sm text-red-400 bg-red-900/20 border border-red-800/50 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {similar.map((m) => (
              <MovieCard key={m.id} movie={m} showScore />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}