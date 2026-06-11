// src/lib/api.ts
// Single fetch wrapper — all HTTP concerns live here.
// Components never call fetch() directly.
// Base URL comes from env — swap for prod by changing NEXT_PUBLIC_API_URL.

import type {
  SearchResponse,
  SimilarResponse,
  AuthResponse,
  SignupResponse,
  User,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// ── Token helpers ──────────────────────────────────────────────────────────
// localStorage is fine for a portfolio demo.
// Production note: httpOnly cookies + CSRF protection would replace this
// to eliminate the XSS attack surface.

export function getToken(): string | null {
  if (typeof window === "undefined") return null; // SSR guard
  return localStorage.getItem("token");
}

export function setToken(token: string): void {
  localStorage.setItem("token", token);
}

export function clearToken(): void {
  localStorage.removeItem("token");
}

// ── Custom error class ─────────────────────────────────────────────────────
// Carries HTTP status so callers can branch on 401 vs 404 vs 500.

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

// ── Core request wrapper ───────────────────────────────────────────────────
// Injects auth header automatically when a token exists.
// Throws ApiError on non-2xx so callers don't need to check res.ok.

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.detail ?? res.statusText);
  }

  return res.json() as Promise<T>;
}

// ── Auth endpoints ─────────────────────────────────────────────────────────

export const auth = {
  signup: (email: string, password: string) =>
    request<SignupResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  signin: (email: string, password: string) =>
    request<AuthResponse>("/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  signout: () =>
    request<{ message: string }>("/auth/signout", { method: "POST" }),

  me: () => request<User>("/auth/me"),
};

// ── Search endpoints ───────────────────────────────────────────────────────

export const search = {
  // POST /search — semantic search by natural language description
  byDescription: (query: string, top_k = 8) =>
    request<SearchResponse>("/search", {
      method: "POST",
      body: JSON.stringify({ query, top_k }),
    }),

  // GET /similar/{id} — movies similar to a given movie
  // TODO: confirm exact response shape from backend and update SimilarResponse
    similar: (title: string, id: number, top_k = 6) =>
    request<SimilarResponse>(
        `/similar/${encodeURIComponent(title)}?id=${id}&top_k=${top_k}`),
};


// ── Movie endpoints ────────────────────────────────────────────────────────
// Add /recommend, /explain, /recommend/personalized as pages need them

export const movies = {
  recommend: (movieId: number) =>
    request<SimilarResponse>(`/recommend/${movieId}`),
};``