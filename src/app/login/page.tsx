"use client";

import React, { useEffect, useState, Suspense } from "react";
import AuthForm from "@/components/AuthForm";
import OAuthButton from "@/components/OAuthButton";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function LoginContent() {
  const search = useSearchParams();
  const verified = search?.get("verified");
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (verified === "1") {
      setInfo("✅ Email verified — you can now sign in.");
    }
  }, [verified]);

  return (
    <main
      className="flex min-h-screen w-full items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url('/payslip background.jpg')" }}
    >
      <div className="w-full max-w-md animate-fadeInUp space-y-8">
        <div className="relative flex justify-center">
          <img
            src="/green_splash.png"
            alt="Green paint stroke"
            className="absolute -top-3 left-0 w-full h-18 opacity-90 -z-10"
            aria-hidden="true"
          />
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Welcome back
          </h1>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-lg">
          {info && (
            <div className="mb-4 rounded-md border border-green-500/30 bg-green-500/20 px-4 py-3 text-center text-sm text-green-300">
              {info}
            </div>
          )}

          <AuthForm mode="login" />

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-600" />
            <div className="text-sm text-gray-400">OR</div>
            <div className="flex-1 h-px bg-gray-600" />
          </div>

          <OAuthButton provider="google" label="Sign in with Google" />
        </div>

        <p className="text-center text-sm text-gray-300">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-green-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center text-gray-400">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
