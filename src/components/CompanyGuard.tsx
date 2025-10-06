"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CompanyGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function check() {
      try {
        // 🔹 Step 1: get user
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const json = await res.json();
        if (!mounted) return;

        const user = json?.user;
        if (!user) {
          router.replace("/login");
          return;
        }

        // 🔹 Step 2: fallback check if user has company in DB
        let hasCompany = !!user.companyId;
        if (!hasCompany) {
          const companyRes = await fetch(`/api/company/by-user?email=${user.email}`, {
            credentials: "include",
          });
          if (companyRes.ok) {
            const companyJson = await companyRes.json();
            if (companyJson?.company?._id) {
              hasCompany = true;
            }
          }
        }

        // 🔹 Step 3: decide routing
        if (!hasCompany) {
          router.replace("/signup/company");
          return;
        }

        // ✅ User verified
        setAllowed(true);
      } catch (err) {
        console.error("CompanyGuard error:", err);
        router.replace("/login");
      } finally {
        if (mounted) setChecking(false);
      }
    }

    check();
    return () => {
      mounted = false;
    };
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Checking your access...
          </p>
        </div>
      </div>
    );
  }

  if (!allowed) return null;

  return <>{children}</>;
}
