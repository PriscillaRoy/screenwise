// src/app/page.tsx
// Browse page — genre filters + movie grid
// Server component: fetches all movies on load via the API

"use client";

import { useEffect, useState } from "react";
import { search as searchApi } from "@/lib/api";
import type { Movie } from "@/lib/types";
import MovieGrid from "@/components/MovieGrid";
import SearchBar from "@/components/SearchBar";

const GENRES = ["All", "Sci-Fi", "Horror", "Thriller", "Crime", "Drama", "Action", "Comedy", "Romance", "Animation"];

// Fetch all movies by genre via a broad semantic search
// Since we don't have a GET /movies endpoint, we use a broad query
// and filter client-side. For a real app you'd add GET /movies to the backend.
async function fetchMoviesByGenre(genre: string): Promise<Movie[]> {
  const query = genre === "All" ? "popular movie" : genre.toLowerCase() + " film";
  const res = await searchApi.byDescription(query, 20);
  if (genre === "All") return res.results;
  return res.results.filter((m) => m.genre === genre);
}

export default function BrowsePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGenre, setActiveGenre] = useState("All");

  useEffect(() => {
    setLoading(true);
    fetchMoviesByGenre(activeGenre)
      .then(setMovies)
      .finally(() => setLoading(false));
  }, [activeGenre]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* Hero */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
          What do you want to watch?
        </h1>
        <p className="text-gray-400 mb-6 text-lg">
          Describe a mood, a feeling, a plot — find your next movie.
        </p>
        <div className="max-w-2xl mx-auto">
          <SearchBar navigateOnSubmit placeholder="A thriller set in space with a twist ending..." />
        </div>
      </div>

      {/* Genre filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {GENRES.map((genre) => (
          <button
            key={genre}
            onClick={() => setActiveGenre(genre)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeGenre === genre
                ? "bg-indigo-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Grid */}
      <MovieGrid movies={movies} loading={loading} />
    </div>
  );
}