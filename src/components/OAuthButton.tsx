// src/components/OAuthButton.tsx
"use client";
import { signIn } from "next-auth/react";
import React from "react";

export default function OAuthButton({ provider = "google", label }: { provider?: string; label?: string }) {
  return (
    <button
      onClick={() =>
        signIn(provider, {
          callbackUrl: "/dashboard", // change target after login
        })
      }
      className="w-full flex items-center justify-center gap-2 border py-2 px-3 rounded-md hover:bg-black text-white"
      aria-label={`Sign in with ${provider}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M21 12.23c0-.6-.05-1.18-.15-1.74H12v3.3h4.84c-.21 1.12-.84 2.06-1.8 2.7v2.24H18.8c2.05-1.89 3.2-4.67 3.2-7.5z" fill="#4285F4"/>
        <path d="M12 22c2.43 0 4.47-.8 5.96-2.17l-2.92-2.24c-.82.55-1.88.87-3.04.87-2.34 0-4.32-1.58-5.03-3.72H4.03v2.33C5.5 19.9 8.57 22 12 22z" fill="#34A853"/>
        <path d="M6.97 13.74A6.01 6.01 0 016.97 12c0-.6.12-1.17.33-1.71V7.96H4.03A9.99 9.99 0 002 12c0 1.6.36 3.12 1.03 4.46l3.94-2.72z" fill="#FBBC05"/>
        <path d="M12 6.4c1.32 0 2.5.45 3.43 1.34l2.57-2.5C16.44 3.94 14.43 3 12 3 8.57 3 5.5 5.1 4.03 7.96l3.27 2.33C7.68 8 9.66 6.4 12 6.4z" fill="#EA4335"/>
      </svg>
      <span>{label ?? `Continue with ${provider[0].toUpperCase() + provider.slice(1)}`}</span>
    </button>
  );
}
