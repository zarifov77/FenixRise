import { create } from "zustand";

const useThemeStore = create((set) => ({
  theme: localStorage.getItem("fenixrise-theme") || "dark",
  toggle: () =>
    set((state) => {
      const next = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("fenixrise-theme", next);
      document.documentElement.setAttribute("data-theme", next);
      return { theme: next };
    }),
  init: () => {
    const saved = localStorage.getItem("fenixrise-theme") || "dark";
    document.documentElement.setAttribute("data-theme", saved);
    set({ theme: saved });
  },
}));

export default useThemeStore;
