import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = "alaba-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem(THEME_STORAGE_KEY)) as Theme | null;
    if (stored === "light" || stored === "dark") return stored;
    if (typeof window !== "undefined") {
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" : "light";
    }
    return "dark";
  });

  const setTheme = (t: Theme) => setThemeState(t);
  const toggleTheme = () => setThemeState((prev) => (prev === "dark" ? "light" : "dark"));

  useEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.classList.toggle("dark", theme === "dark");
    }
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [theme]);

  const value = useMemo(() => ({ theme, toggleTheme, setTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}


