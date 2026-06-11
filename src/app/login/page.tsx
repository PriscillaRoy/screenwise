// src/app/login/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // redirect if already signed in
  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [user, loading, router]);

  if (loading) return null;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-white mb-1">Welcome to Screenwise</h1>
        <p className="text-gray-400 text-sm">Sign in to save movies and get recommendations.</p>
      </div>
      <AuthForm onSuccess={() => router.push("/")} />
    </div>
  );
}