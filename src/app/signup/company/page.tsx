"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, ArrowRight, Loader2 } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200/30 dark:bg-green-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200/30 dark:bg-emerald-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-200/20 dark:bg-teal-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-green-200/60 dark:border-green-700/60 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Complete Your Signup
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Just one more step to get started with Complyn
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Name Input */}
            <div className="space-y-2">
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Company Name
              </label>
              <div className="relative">
                <input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter your company name"
                  className="w-full px-4 py-4 bg-white/50 dark:bg-gray-700/50 border border-gray-300/60 dark:border-gray-600/60 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm text-lg"
                  required
                  disabled={loading}
                />
                <Building2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This will be displayed on your payslips
              </p>
            </div>

            {/* Submit Button */}
        <button
  type="submit"
  disabled={loading || !companyName.trim()}
  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-md flex items-center justify-center gap-3 text-lg"
>
  {loading ? (
    <>
      <Loader2 className="w-5 h-5 animate-spin" />
      Setting up your account...
    </>
  ) : (
    <>
      Continue to Dashboard
      <ArrowRight className="w-5 h-5" />
    </>
  )}
</button>
          </form>

          {/* Footer Note */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              By continuing, you agree to our{" "}
              <a href="/terms" className="text-green-600 dark:text-green-400 hover:underline font-medium">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-green-600 dark:text-green-400 hover:underline font-medium">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

        {/* Bottom decorative element */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-gradient-to-r from-green-400/30 to-emerald-400/30 rounded-full blur-sm"></div>
      </div>
    </div>
  );
}