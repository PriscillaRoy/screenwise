"use client";

import Link from "next/link";
import type { Movie, SearchResultItem } from "@/lib/types";

interface Props {
  movie: Movie | SearchResultItem;
  showScore?: boolean;
}

const GENRE_COLORS: Record<string, string> = {
  "Sci-Fi":   "bg-indigo-900/60 text-indigo-300",
  "Horror":   "bg-red-900/60 text-red-300",
  "Thriller": "bg-orange-900/60 text-orange-300",
  "Crime":    "bg-yellow-900/60 text-yellow-300",
  "Drama":    "bg-purple-900/60 text-purple-300",
  "Action":   "bg-blue-900/60 text-blue-300",
  "Comedy":   "bg-green-900/60 text-green-300",
  "Romance":  "bg-pink-900/60 text-pink-300",
  "Animation":"bg-teal-900/60 text-teal-300",
};

function genreColor(genre: string) {
  return GENRE_COLORS[genre] ?? "bg-gray-800 text-gray-300";
}

function scoreBar(score: number) {
  const pct = Math.round(score * 100);
  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Match</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1 rounded-full bg-gray-800">
        <div
          className="h-1 rounded-full bg-indigo-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function MovieCard({ movie, showScore = false }: Props) {
  const similarity = "similarity" in movie ? movie.similarity : null;

  return (
    <Link
      href={`/movie/${movie.id}?title=${encodeURIComponent(movie.title)}`}
      className="group block rounded-xl bg-gray-900 border border-gray-800 hover:border-indigo-500/50 hover:bg-gray-800/80 transition-all duration-200 p-4"
    >
      {/* Genre pill + year */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${genreColor(movie.genre)}`}>
          {movie.genre}
        </span>
        <span className="text-xs text-gray-500">{movie.year}</span>
      </div>

      {/* Title */}
      <h3 className="text-white font-semibold text-base leading-snug group-hover:text-indigo-300 transition-colors line-clamp-2">
        {movie.title}
      </h3>

      {/* Score bar — only on search/similar results */}
      {showScore && similarity !== null && scoreBar(similarity)}
    </Link>
  );
}
