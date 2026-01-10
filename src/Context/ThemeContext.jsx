import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("bloodbridge_theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    localStorage.setItem("bloodbridge_theme", isDarkMode ? "dark" : "light");

    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "#1a1a2e";
      document.body.style.color = "#e4e4e7";
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "#ffffff";
      document.body.style.color = "#1f2937";
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const theme = {
    isDarkMode,
    colors: isDarkMode
      ? {
          background: "#1a1a2e",
          surface: "#16213e",
          surfaceHover: "#1f2b4d",
          primary: "#dc2626",
          text: "#e4e4e7",
          textSecondary: "#a1a1aa",
          border: "#374151",
          card: "#16213e",
        }
      : {
          background: "#ffffff",
          surface: "#f9fafb",
          surfaceHover: "#f3f4f6",
          primary: "#dc2626",
          text: "#1f2937",
          textSecondary: "#6b7280",
          border: "#e5e7eb",
          card: "#ffffff",
        },
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
