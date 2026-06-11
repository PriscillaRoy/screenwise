"use client";

import type { Movie, SearchResultItem } from "@/lib/types";
import MovieCard from "./MovieCard";

interface Props {
  movies: (Movie | SearchResultItem)[];
  showScore?: boolean;
  loading?: boolean;
}

function SkeletonCard() {
  return (
    <div className="rounded-xl bg-gray-900 border border-gray-800 p-4 animate-pulse">
      <div className="flex justify-between mb-3">
        <div className="h-5 w-16 rounded-full bg-gray-800" />
        <div className="h-5 w-10 rounded bg-gray-800" />
      </div>
      <div className="h-4 w-3/4 rounded bg-gray-800 mb-2" />
      <div className="h-4 w-1/2 rounded bg-gray-800" />
    </div>
  );
}

export default function MovieGrid({ movies, showScore = false, loading = false }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">No movies found.</p>
        <p className="text-gray-600 text-sm mt-1">Try a different search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {movies.map((m) => (
        <MovieCard key={m.id} movie={m} showScore={showScore} />
      ))}
    </div>
  );
}
