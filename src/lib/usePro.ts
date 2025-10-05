// src/lib/usePro.ts
"use client";

import { useEffect, useState, useCallback } from "react";

export function usePro() {
  const [isPro, setIsPro] = useState(false);

  // Load from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("complyn.pro");
      setIsPro(stored === "true");
    }
  }, []);

  // Toggle helper
  const togglePro = useCallback(() => {
    if (typeof window !== "undefined") {
      const newStatus = !isPro;
      localStorage.setItem("complyn.pro", newStatus.toString());
      setIsPro(newStatus);
    }
  }, [isPro]);

  return { isPro, togglePro };
}
