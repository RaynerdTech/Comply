"use client";

import { Lock, Crown } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface UpgradeOverlayProps {
  children: React.ReactNode;
  featureName?: string;
  size?: "sm" | "md" | "lg";
}

export default function UpgradeOverlay({ 
  children, 
  featureName = "this feature",
  size = "md" 
}: UpgradeOverlayProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const isLoggedIn = !!session; // temporarily use this instead of pro plan

  // If logged in → unlock
  if (isLoggedIn) return <>{children}</>;

  const sizeClasses = {
    sm: "py-2 px-3 text-xs",
    md: "py-3 px-4 text-sm", 
    lg: "py-4 px-6 text-base"
  };

  return (
    <div className="relative group">
      {/* Slightly dimmed locked content */}
      <div className="opacity-70 select-none transition-all duration-300 group-hover:opacity-80">
        {children}
      </div>

      {/* Overlay that redirects to login */}
      <div
        onClick={() => router.push("/login?redirect=/")}
        className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl cursor-pointer transition-all duration-300 hover:bg-white/90 dark:hover:bg-gray-900/90 border-2 border-dashed border-gray-300/60 dark:border-gray-600/60"
      >
        <div className={`text-center ${sizeClasses[size]}`}>
          <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
          
          <div className="flex items-center justify-center gap-1 mb-1">
            <Crown className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            <span className="font-semibold text-amber-700 dark:text-amber-300">
              Pro Feature
            </span>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Login to unlock {featureName}
          </p>
          
          <button
            onClick={() => router.push("/login?redirect=/")}
            className="px-4 py-1.5 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors duration-200 text-xs"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
