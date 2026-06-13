"use client";

import { useState } from "react";
import Link from "next/link";
import type { Movie, SearchResultItem } from "@/lib/types";
import VideoPlayerModal from "./VideoPlayerModal";

interface Props {
  movie: Movie | SearchResultItem;
  showScore?: boolean;
}

const GENRE_COLORS: Record<string, string> = {
  "Sci-Fi":    "bg-indigo-900/60 text-indigo-300",
  "Horror":    "bg-red-900/60 text-red-300",
  "Thriller":  "bg-orange-900/60 text-orange-300",
  "Crime":     "bg-yellow-900/60 text-yellow-300",
  "Drama":     "bg-purple-900/60 text-purple-300",
  "Action":    "bg-blue-900/60 text-blue-300",
  "Comedy":    "bg-green-900/60 text-green-300",
  "Romance":   "bg-pink-900/60 text-pink-300",
  "Animation": "bg-teal-900/60 text-teal-300",
  "Cartoon":   "bg-teal-900/60 text-teal-300",
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
        <div className="h-1 rounded-full bg-indigo-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// Temporary mapping: movie id → Internet Archive identifier
// Replace with archive_id field from DB once dataset is migrated
const ARCHIVE_MAP: Record<number, string> = {
  1:  "PopeyeTheSailorMeetsSindbadTheSailor_540",
  2:  "PopeyeTheSailorMeetsSindbadTheSailor_540",
  3:  "PopeyeTheSailorMeetsSindbadTheSailor_540",
  4:  "PopeyeTheSailorMeetsSindbadTheSailor_540",
  9:  "PopeyeTheSailorMeetsSindbadTheSailor_540",
  27: "PopeyeTheSailorMeetsSindbadTheSailor_540",
};

export default function MovieCard({ movie, showScore = false }: Props) {
  const [showPlayer, setShowPlayer] = useState(false);
  const similarity = "similarity" in movie ? movie.similarity : null;
  const archiveId = ARCHIVE_MAP[movie.id];

  return (
    <>
      <div className="group relative rounded-xl bg-gray-900 border border-gray-800 hover:border-indigo-500/50 hover:bg-gray-800/80 transition-all duration-200 p-4">

        {/* Genre pill + year */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${genreColor(movie.genre)}`}>
            {movie.genre}
          </span>
          <span className="text-xs text-gray-500">{movie.year}</span>
        </div>

        {/* Title — links to detail page */}
        <Link
          href={`/movie/${movie.id}?title=${encodeURIComponent(movie.title)}`}
          className="block text-white font-semibold text-base leading-snug hover:text-indigo-300 transition-colors line-clamp-2 mb-3"
        >
          {movie.title}
        </Link>

        {/* Score bar */}
        {showScore && similarity !== null && scoreBar(similarity)}

        {/* Watch button — only shown if archive ID exists */}
        {archiveId && (
          <button
            onClick={() => setShowPlayer(true)}
            className="mt-3 w-full flex items-center justify-center gap-2 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-medium hover:bg-indigo-600/40 hover:border-indigo-500/60 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch free
          </button>
        )}
      </div>

      {/* Video player modal */}
      {showPlayer && archiveId && (
        <VideoPlayerModal
          title={movie.title}
          archiveId={archiveId}
          onClose={() => setShowPlayer(false)}
        />
      )}
    </>
  );
}