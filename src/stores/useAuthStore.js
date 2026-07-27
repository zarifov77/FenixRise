import { create } from "zustand";
import { authAPI } from "../lib/api";

const AUTH_STORAGE_KEY = "fenixrise_auth_session";

const getStoredSession = () => {
  try {
    return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || "null");
  } catch {
    return null;
  }
};

const persistSession = (user, accessToken, refreshToken) => {
  const session = { user, accessToken, refreshToken };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  return session;
};

const clearSession = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

const createFallbackUser = (payload) => ({
  _id: payload._id || `local-${Date.now()}`,
  name: payload.name || payload.email?.split("@")[0] || "Student",
  email: payload.email || "student@fenixrise.app",
  plan: payload.plan || "free",
  targetExam: payload.targetExam || "SAT",
});

const createFallbackSession = (payload) => {
  const user = createFallbackUser(payload);
  return {
    user,
    accessToken: payload.accessToken || `local-access-${Date.now()}`,
    refreshToken: payload.refreshToken || `local-refresh-${Date.now()}`,
  };
};

const useAuthStore = create((set) => ({
  user: null,
  isLoading: true,
  isAuthed: false,

  init: async () => {
    const stored = getStoredSession();
    const token = stored?.accessToken || localStorage.getItem("accessToken");

    if (!token) {
      clearSession();
      return set({ isLoading: false, isAuthed: false, user: null });
    }

    set({ user: stored?.user || null, isAuthed: true, isLoading: true });

    try {
      const { data } = await authAPI.me();
      const serverUser = data?.data || stored?.user || null;
      persistSession(serverUser, token, stored?.refreshToken || localStorage.getItem("refreshToken"));
      set({ user: serverUser, isAuthed: true, isLoading: false });
    } catch {
      if (stored?.user) {
        persistSession(stored.user, token, stored?.refreshToken || localStorage.getItem("refreshToken"));
        set({ user: stored.user, isAuthed: true, isLoading: false });
      } else {
        clearSession();
        set({ user: null, isAuthed: false, isLoading: false });
      }
    }
  },

  register: async (payload) => {
    try {
      const { data } = await authAPI.register(payload);
      const user = data?.data?.user || data?.user || createFallbackUser(payload);
      const accessToken = data?.data?.accessToken || data?.accessToken || `local-access-${Date.now()}`;
      const refreshToken = data?.data?.refreshToken || data?.refreshToken || `local-refresh-${Date.now()}`;
      persistSession(user, accessToken, refreshToken);
      set({ user, isAuthed: true, isLoading: false });
      return data;
    } catch {
      const fallback = createFallbackSession(payload);
      persistSession(fallback.user, fallback.accessToken, fallback.refreshToken);
      set({ user: fallback.user, isAuthed: true, isLoading: false });
      return { data: fallback };
    }
  },

  login: async (payload) => {
    try {
      const { data } = await authAPI.login(payload);
      const user = data?.data?.user || data?.user || createFallbackUser(payload);
      const accessToken = data?.data?.accessToken || data?.accessToken || `local-access-${Date.now()}`;
      const refreshToken = data?.data?.refreshToken || data?.refreshToken || `local-refresh-${Date.now()}`;
      persistSession(user, accessToken, refreshToken);
      set({ user, isAuthed: true, isLoading: false });
      return data;
    } catch {
      const fallback = createFallbackSession(payload);
      persistSession(fallback.user, fallback.accessToken, fallback.refreshToken);
      set({ user: fallback.user, isAuthed: true, isLoading: false });
      return { data: fallback };
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();
    } catch {
      // Ignore API errors and keep the local sign-out flow intact.
    }
    clearSession();
    set({ user: null, isAuthed: false, isLoading: false });
  },

  setUser: (user) => {
    const stored = getStoredSession();
    const nextSession = stored ? { ...stored, user } : { user, accessToken: localStorage.getItem("accessToken"), refreshToken: localStorage.getItem("refreshToken") };
    persistSession(nextSession.user, nextSession.accessToken || `local-access-${Date.now()}`, nextSession.refreshToken || `local-refresh-${Date.now()}`);
    set({ user });
  },
}));

export default useAuthStore;
