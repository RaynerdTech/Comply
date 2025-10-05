"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200/50 dark:border-gray-700/50 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-4 px-4 text-left focus:outline-none hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors duration-200 rounded-lg"
      >
        <span className="font-semibold text-[var(--color-text)] text-base">{title}</span>
        <ChevronDown
          className={`w-5 h-5 text-[var(--color-text)] transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-4">{children}</div>
      </div>
    </div>
  );
}

export interface AccordionProps {
  children: React.ReactNode;
  className?: string;
}

export default function Accordion({ children, className = "" }: AccordionProps) {
  return (
    <div className={`w-full rounded-xl border border-gray-200/60 dark:border-gray-700/60 bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm shadow-sm ${className}`}>
      {children}
    </div>
  );
}