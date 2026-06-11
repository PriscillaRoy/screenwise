"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface Props {
  initialQuery?: string;
  onSearch?: (query: string) => void; // inline mode — used on /search page
  navigateOnSubmit?: boolean;         // true on home page — navigates to /search
  placeholder?: string;
  autoFocus?: boolean;
}

export default function SearchBar({
  initialQuery = "",
  onSearch,
  navigateOnSubmit = false,
  placeholder = "Describe a movie you want to watch...",
  autoFocus = false,
}: Props) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    if (navigateOnSubmit) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      onSearch?.(trimmed);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center">
        {/* Search icon */}
        <svg
          className="absolute left-4 w-5 h-5 text-gray-500 pointer-events-none"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full pl-12 pr-24 py-3.5 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-sm"
        />

        <button
          type="submit"
          disabled={!query.trim()}
          className="absolute right-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
}
