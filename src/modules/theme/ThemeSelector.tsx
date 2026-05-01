"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

/**
 * Theme toggle button — Sun (escuro→claro) / Moon (claro→escuro).
 *
 * Strategy:
 *  1. On mount, reads the .dark class already set by the anti-FOSC inline script.
 *  2. On toggle, updates <html> class and persists to localStorage ('tt-theme').
 *  3. Renders a placeholder before mount to avoid hydration mismatch.
 */
export function ThemeSelector() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    const root = document.documentElement;
    if (next) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem("tt-theme", next ? "dark" : "light");
    } catch {
      /* storage may be blocked */
    }
  }

  /* Placeholder: same size, invisible — prevents layout shift */
  if (!mounted) {
    return <div className="h-8 w-8 rounded-lg" aria-hidden="true" />;
  }

  return (
    <button
      onClick={toggle}
      type="button"
      aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
      title={isDark ? "Tema claro" : "Tema escuro"}
      className="
        flex h-8 w-8 items-center justify-center rounded-lg
        border border-stone-200 bg-white text-stone-500
        transition-all hover:border-stone-300 hover:bg-stone-50 hover:text-stone-700
        dark:border-stone-700 dark:bg-stone-800 dark:text-stone-400
        dark:hover:border-stone-600 dark:hover:bg-stone-700 dark:hover:text-stone-200
      "
    >
      {isDark ? (
        <Sun className="h-3.5 w-3.5" />
      ) : (
        <Moon className="h-3.5 w-3.5" />
      )}
    </button>
  );
}
