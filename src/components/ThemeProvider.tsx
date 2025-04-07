
import React, { createContext, useContext, useEffect, useState } from "react";

type AccentColor = "purple" | "blue" | "green" | "orange" | "pink";

interface ThemeContextType {
  theme: "light" | "dark";
  accentColor: AccentColor;
  toggleTheme: () => void;
  setAccentColor: (color: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">(
    localStorage.getItem("theme") as "light" | "dark" || "light"
  );
  
  const [accentColor, setAccentColor] = useState<AccentColor>(
    localStorage.getItem("accentColor") as AccentColor || "purple"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
    
    // Update accent color CSS variables
    const colors: Record<AccentColor, { DEFAULT: string; light: string; dark: string }> = {
      purple: { DEFAULT: "#8B5CF6", light: "#A78BFA", dark: "#7C3AED" },
      blue: { DEFAULT: "#0EA5E9", light: "#38BDF8", dark: "#0284C7" },
      green: { DEFAULT: "#10B981", light: "#34D399", dark: "#059669" },
      orange: { DEFAULT: "#F97316", light: "#FB923C", dark: "#EA580C" },
      pink: { DEFAULT: "#EC4899", light: "#F472B6", dark: "#DB2777" }
    };
    
    const selected = colors[accentColor];
    document.documentElement.style.setProperty("--primary", selected.DEFAULT);
    document.documentElement.style.setProperty("--primary-light", selected.light);
    document.documentElement.style.setProperty("--primary-dark", selected.dark);
    
    localStorage.setItem("accentColor", accentColor);
  }, [theme, accentColor]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, accentColor, toggleTheme, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
