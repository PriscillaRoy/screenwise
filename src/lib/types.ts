// src/lib/types.ts
// Single source of truth for all API shapes.
// Derived from live API responses — do not guess field names.

export interface Movie {
  id: number;
  title: string;
  genre: string;
  year: number;
}

export interface SearchResultItem extends Movie {
  similarity: number;
}

export interface SearchResponse {
  query: string;
  backend: string;
  results: SearchResultItem[];
  cached: boolean;
}

export interface SimilarResponse {
  query: string;          // "Annihilation (2018)"
  results: SearchResultItem[];  // same shape as search — id, title, genre, year, similarity
  cached: boolean;
}

export interface AuthResponse {
  user_id: string;               // UUID
  email: string;
  access_token: string;
  token_type: "bearer";
}

export interface SignupResponse {
  message: string;
  user_id: string;
  email: string;
}

export interface User {
  user_id: string;               // UUID — matches /auth/me response
  email: string;
}

export interface ApiErrorBody {
  detail: string;
}