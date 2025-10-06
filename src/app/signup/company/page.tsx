"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CompanySignupPage() {
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/complete-google-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName }),
        credentials: "include",
      });

      const body = await res.json();

      if (!res.ok) {
        alert(body.error || "Something went wrong");
        setLoading(false);
        return;
      }

      // Ask server for fresh DB user (authoritative)
      const meRes = await fetch("/api/auth/me", { credentials: "include" });
      const meJson = await meRes.json();
      const user = meJson?.user;

      if (user && user.status === "active" && user.companyId) {
        router.replace("/dashboard");
      } else {
        // shouldn't normally happen, but show a friendly message
        alert("Signup completed but session not ready yet. Please reload.");
      }
    } catch (err) {
      console.error(err);
      alert("Unexpected error, check console.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-12 space-y-4">
      <h1 className="text-2xl font-bold">Complete Your Signup</h1>
      <p className="text-gray-600">Please add your company name to continue.</p>

      <input
        type="text"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        placeholder="Company Name"
        className="w-full border p-2 rounded"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        {loading ? "Saving..." : "Continue"}
      </button>
    </form>
  );
}