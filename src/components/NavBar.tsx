// src/components/NavBar.tsx
"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function NavBar() {
  const { user, signout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  async function handleSignout() {
    await signout();
    router.push("/");
  }

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur border-b border-gray-800/60">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link
          href="/"
          className="text-white font-semibold text-lg tracking-tight hover:text-indigo-400 transition-colors shrink-0"
        >
          Screenwise
        </Link>

        {/* Center search pill */}
        <Link
          href="/search"
          className={`hidden sm:flex items-center gap-2 flex-1 max-w-sm px-4 py-1.5 rounded-full border text-sm transition-colors ${
            isActive("/search")
              ? "bg-gray-800 border-indigo-500/50 text-gray-300"
              : "bg-gray-900 border-gray-700 text-gray-500 hover:border-gray-600 hover:text-gray-300"
          }`}
        >
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          Describe a movie...
        </Link>

        {/* Right — auth */}
        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <>
              <Link
                href="/profile"
                className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
                  isActive("/profile")
                    ? "text-white bg-gray-800"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                {user.email.split("@")[0]}
              </Link>
              <button
                onClick={handleSignout}
                className="text-sm px-3 py-1.5 rounded-md text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm px-4 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
}
