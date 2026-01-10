import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./Routes/Router";
import "./index.css";
import { AuthProvider } from "./Context/AuthProvider";
import { ThemeProvider, useTheme } from "./Context/ThemeContext";
import { SocketProvider } from "./Context/SocketContext";
import { Toaster } from "react-hot-toast";
import { ConfigProvider, theme as antdTheme } from "antd";

// Theme-aware wrapper that re-renders on theme change
const ThemeAwareApp = () => {
  const { isDarkMode } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode
          ? antdTheme.darkAlgorithm
          : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: "#dc2626",
          colorBgContainer: isDarkMode ? "#1f2937" : "#ffffff",
          colorBgElevated: isDarkMode ? "#374151" : "#ffffff",
          colorBgLayout: isDarkMode ? "#111827" : "#f9fafb",
          colorBorder: isDarkMode ? "#374151" : "#e5e7eb",
          colorText: isDarkMode ? "#f3f4f6" : "#1f2937",
          colorTextSecondary: isDarkMode ? "#9ca3af" : "#6b7280",
          borderRadius: 12,
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
        components: {
          Button: {
            borderRadius: 10,
            controlHeight: 42,
            primaryShadow: "0 4px 14px rgba(220, 38, 38, 0.25)",
          },
          Card: {
            borderRadius: 16,
            colorBgContainer: isDarkMode ? "#1f2937" : "#ffffff",
          },
          Input: {
            borderRadius: 10,
            controlHeight: 44,
            colorBgContainer: isDarkMode ? "#374151" : "#ffffff",
            colorBorder: isDarkMode ? "#4b5563" : "#d1d5db",
          },
          Select: {
            borderRadius: 10,
            controlHeight: 44,
            colorBgContainer: isDarkMode ? "#374151" : "#ffffff",
            colorBgElevated: isDarkMode ? "#1f2937" : "#ffffff",
          },
          Menu: {
            darkItemBg: "transparent",
            itemBg: "transparent",
            colorBgContainer: isDarkMode ? "#1f2937" : "#ffffff",
          },
          Table: {
            colorBgContainer: isDarkMode ? "#1f2937" : "#ffffff",
            headerBg: isDarkMode ? "#374151" : "#f9fafb",
          },
          Modal: {
            colorBgElevated: isDarkMode ? "#1f2937" : "#ffffff",
            borderRadius: 16,
          },
          Drawer: {
            colorBgElevated: isDarkMode ? "#1f2937" : "#ffffff",
          },
          Dropdown: {
            colorBgElevated: isDarkMode ? "#1f2937" : "#ffffff",
          },
          Form: {
            labelColor: isDarkMode ? "#f3f4f6" : "#374151",
          },
          Collapse: {
            colorBgContainer: isDarkMode ? "#1f2937" : "#ffffff",
            headerBg: isDarkMode ? "#374151" : "#f9fafb",
          },
          Pagination: {
            colorBgContainer: isDarkMode ? "#374151" : "#ffffff",
          },
          DatePicker: {
            colorBgContainer: isDarkMode ? "#374151" : "#ffffff",
            colorBgElevated: isDarkMode ? "#1f2937" : "#ffffff",
          },
          Statistic: {
            colorTextDescription: isDarkMode ? "#9ca3af" : "#6b7280",
          },
        },
      }}
    >
      <AuthProvider>
        <SocketProvider>
          <RouterProvider router={router} />
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              style: {
                background: isDarkMode ? "#374151" : "#ffffff",
                color: isDarkMode ? "#f3f4f6" : "#1f2937",
                borderRadius: "12px",
                border: isDarkMode ? "1px solid #4b5563" : "1px solid #e5e7eb",
              },
            }}
          />
        </SocketProvider>
      </AuthProvider>
    </ConfigProvider>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <ThemeAwareApp />
    </ThemeProvider>
  );
};

createRoot(document.getElementById("root")).render(<App />);
