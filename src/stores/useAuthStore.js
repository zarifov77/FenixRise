import { create } from "zustand";
import { authAPI } from "../lib/api";

const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: true,   // true while checking session on mount
  isAuthed: false,

  // ── Boot: called once on app mount ─────────────────────────────
  init: async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return set({ isLoading: false, isAuthed: false });
    try {
      const { data } = await authAPI.me();
      set({ user: data.data, isAuthed: true, isLoading: false });
    } catch {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      set({ user: null, isAuthed: false, isLoading: false });
    }
  },

  // ── Register ───────────────────────────────────────────────────
  register: async (payload) => {
    const { data } = await authAPI.register(payload);
    localStorage.setItem("accessToken",  data.data.accessToken);
    localStorage.setItem("refreshToken", data.data.refreshToken);
    set({ user: data.data.user, isAuthed: true });
    return data;
  },

  // ── Login ──────────────────────────────────────────────────────
  login: async (payload) => {
    const { data } = await authAPI.login(payload);
    localStorage.setItem("accessToken",  data.data.accessToken);
    localStorage.setItem("refreshToken", data.data.refreshToken);
    set({ user: data.data.user, isAuthed: true });
    return data;
  },

  // ── Logout ─────────────────────────────────────────────────────
  logout: async () => {
    try { await authAPI.logout(); } catch (_) {}
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({ user: null, isAuthed: false });
  },

  // ── Update user in store after profile edit ────────────────────
  setUser: (user) => set({ user }),
}));

export default useAuthStore;
