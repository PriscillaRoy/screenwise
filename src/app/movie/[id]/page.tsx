// src/app/movie/[id]/page.tsx
// Movie detail page — shows movie info + similar movies
// URL: /movie/9?title=Annihilation

"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { search as searchApi } from "@/lib/api";
import type { SearchResultItem } from "@/lib/types";
import MovieCard from "@/components/MovieCard";

const GENRE_COLORS: Record<string, string> = {
  "Sci-Fi":   "bg-indigo-900/40 text-indigo-300 border-indigo-700/40",
  "Horror":   "bg-red-900/40 text-red-300 border-red-700/40",
  "Thriller": "bg-orange-900/40 text-orange-300 border-orange-700/40",
  "Crime":    "bg-yellow-900/40 text-yellow-300 border-yellow-700/40",
  "Drama":    "bg-purple-900/40 text-purple-300 border-purple-700/40",
  "Action":   "bg-blue-900/40 text-blue-300 border-blue-700/40",
  "Comedy":   "bg-green-900/40 text-green-300 border-green-700/40",
};

function genreColor(genre: string) {
  return GENRE_COLORS[genre] ?? "bg-gray-800/40 text-gray-300 border-gray-700/40";
}

export default function MovieDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const movieId = Number(params.id);
  const title = searchParams.get("title") ?? "";

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
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

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