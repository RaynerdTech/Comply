"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="w-full bg-[var(--color-custom-bg)] border-b border-border shadow-sm sticky top-0 z-50 transition-colors duration-300">
      
      {/* Beta Banner - Top on mobile */}
      <div className="md:hidden w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-1 px-4">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-bold animate-pulse">STILL IN BETA</span>
          <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="text-2xl font-bold flex items-center gap-1">
            Complyn <span className="text-primary">●</span>
          </Link>
          
          {/* Beta Badge - Hidden on mobile, visible on desktop */}
          <div className="hidden md:flex relative">
            <span className="px-2 py-1 text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-full shadow-md animate-pulse">
              STILL IN BETA
            </span>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/signup"
            className="px-3 py-2 md:px-4 md:py-2 rounded-lg bg-gradient-to-r from-primary to-secondary
                       text-white no-underline font-medium shadow hover:scale-105 active:scale-95
                       transition-transform duration-200 text-sm md:text-base whitespace-nowrap"
          >
            Upgrade for More
          </Link>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}