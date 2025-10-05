"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />; // prevent flicker

  const current = resolvedTheme ?? theme ?? "system";

  const toggleTheme = () => {
    if (current === "dark") setTheme("light");
    else if (current === "light") setTheme("dark");
    else setTheme("dark"); // system → dark
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={`Theme: ${current}`}
      className="relative flex items-center justify-center w-9 h-9 rounded-full 
                 bg-gray-100 dark:bg-gray-800 hover:ring-2 hover:ring-primary 
                 transition-all duration-300 ease-in-out group"
    >
      <span className="absolute opacity-100 scale-100 transition-all duration-300 
                       group-hover:scale-110 group-hover:opacity-90">
        {current === "dark" ? <Sun size={18} /> : current === "light" ? <Moon size={18} /> : <Monitor size={18} />}
      </span>
    </button>
  );
}
