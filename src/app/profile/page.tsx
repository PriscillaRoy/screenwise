// src/app/profile/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, loading, signout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  if (loading || !user) return null;

  async function handleSignout() {
    await signout();
    router.push("/");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold text-white">{user.email.split("@")[0]}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{user.email}</p>
        </div>
        <button
          onClick={handleSignout}
          className="text-sm px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
        >
          Sign out
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: "Movies rated", value: "—" },
          { label: "Watch history", value: "—" },
          { label: "Member since", value: "2025" },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl bg-gray-900 border border-gray-800 p-4 text-center">
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Ratings — placeholder for Phase 2 */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-white mb-3">Your ratings</h2>
        <div className="rounded-xl bg-gray-900 border border-gray-800 px-6 py-10 text-center">
          <p className="text-gray-500 text-sm">No ratings yet.</p>
          <p className="text-gray-600 text-xs mt-1">
            Rate movies from their detail page to improve your recommendations.
          </p>
        </div>
      </div>

      {/* Watch history — placeholder for Phase 2 */}
      <div>
        <h2 className="text-base font-semibold text-white mb-3">Watch history</h2>
        <div className="rounded-xl bg-gray-900 border border-gray-800 px-6 py-10 text-center">
          <p className="text-gray-500 text-sm">Nothing watched yet.</p>
        </div>
      </div>
    </div>
  );
}