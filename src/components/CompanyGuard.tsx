"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CompanyGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    const checkAccess = async () => {
      if (!session?.user?.email) {
        router.replace("/login");
        return;
      }

      try {
        // ✅ Always get latest user info from DB
        const res = await fetch("/api/auth/user");
        const data = await res.json();
        const user = data?.user;

        if (!user) {
          router.replace("/login");
          return;
        }

        // ✅ If no company or still pending, go complete setup
        if (!user.companyId || user.status === "pending") {
          router.replace("/signup/company");
          return;
        }

        setAllowed(true);
      } catch (err) {
        console.error("Error checking company:", err);
        router.replace("/login");
      }
    };

    checkAccess();
  }, [session, status, router]);

  if (status === "loading" || !allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Checking your access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
