import { Sun, Moon } from "lucide-react";
import useThemeStore from "../../stores/useThemeStore";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggle } = useThemeStore();
  return (
    <button
      onClick={toggle}
      className={`theme-toggle ${className}`}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark"
        ? <Sun size={16} />
        : <Moon size={16} />}
    </button>
  );
}
