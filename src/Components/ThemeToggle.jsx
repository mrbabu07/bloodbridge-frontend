import { Switch, Tooltip } from "antd";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import { useTheme } from "../Context/ThemeContext";

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Tooltip
      title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <div className="flex items-center gap-2">
        <SunOutlined
          style={{
            color: isDarkMode ? "#6b7280" : "#f59e0b",
            fontSize: "16px",
          }}
        />
        <Switch
          checked={isDarkMode}
          onChange={toggleTheme}
          size="small"
          style={{
            backgroundColor: isDarkMode ? "#3b82f6" : "#d1d5db",
          }}
        />
        <MoonOutlined
          style={{
            color: isDarkMode ? "#60a5fa" : "#6b7280",
            fontSize: "16px",
          }}
        />
      </div>
    </Tooltip>
  );
};

export default ThemeToggle;
