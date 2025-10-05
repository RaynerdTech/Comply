// src/components/AuthForm.tsx
"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";

type Mode = "signup" | "login";

export default function AuthForm({ mode }: { mode: Mode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // Your handleSignup and handleLogin functions remain unchanged...
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Signup failed");
      setMsg("Verification email sent — check your inbox.");
    } catch (err: any) {
      setMsg(err.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      } as any);
      if ((result as any)?.error) {
        setMsg((result as any).error);
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      setMsg(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  // The JSX is updated for the new design
  return (
    // The outer div with card styles has been removed, as the page now handles it.
    <form onSubmit={mode === "signup" ? handleSignup : handleLogin} className="space-y-4">
      <h2 className="text-center text-xl font-semibold text-white">
        {mode === "signup" ? "Create Company Account" : "Sign In"}
      </h2>

      {mode === "signup" && (
        <>
          <div>
            <label htmlFor="companyName" className="sr-only">Company name</label>
            <input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required placeholder="Company Name" className="mt-1 block w-full appearance-none rounded-md bg-white/10 px-3 py-2 text-white placeholder-gray-400 shadow-sm ring-1 ring-inset ring-white/10 transition focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-400 sm:text-sm"/>
          </div>

          <div>
            <label htmlFor="name" className="sr-only">Your name</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your Name" className="mt-1 block w-full appearance-none rounded-md bg-white/10 px-3 py-2 text-white placeholder-gray-400 shadow-sm ring-1 ring-inset ring-white/10 transition focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-400 sm:text-sm"/>
          </div>
        </>
      )}

      <div>
        <label htmlFor="email" className="sr-only">Email</label>
        <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} required type="email" placeholder="Email Address" className="mt-1 block w-full appearance-none rounded-md bg-white/10 px-3 py-2 text-white placeholder-gray-400 shadow-sm ring-1 ring-inset ring-white/10 transition focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-400 sm:text-sm"/>
      </div>

      <div>
        <label htmlFor="password" className="sr-only">Password</label>
        <input id="password" value={password} onChange={(e) => setPassword(e.target.value)} required type="password" placeholder="Password" className="mt-1 block w-full appearance-none rounded-md bg-white/10 px-3 py-2 text-white placeholder-gray-400 shadow-sm ring-1 ring-inset ring-white/10 transition focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-400 sm:text-sm"/>
      </div>

      {msg && <div className="text-sm text-yellow-300">{msg}</div>}

      <div>
        <button disabled={loading} type="submit" className="flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? "Please wait..." : mode === "signup" ? "Create Account" : "Sign In"}
        </button>
      </div>
    </form>
  );
}