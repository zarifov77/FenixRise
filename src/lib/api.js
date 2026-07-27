import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

// ── Attach access token to every request ─────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auto-refresh on 401 ───────────────────────────────────────────
let isRefreshing = false;
let failedQueue = [];

const redirectToLogin = () => {
  const currentPath = window.location.pathname;
  if (currentPath === "/login" || currentPath === "/register") return;
  window.history.pushState({}, "", "/login");
  window.dispatchEvent(new PopStateEvent("popstate"));
};

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve(token)));
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      if (original.url?.includes("/auth/me") || original.url?.includes("/auth/login") || original.url?.includes("/auth/register")) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            return api(original);
          })
          .catch((err) => Promise.reject(err));
      }

      original._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        isRefreshing = false;
        // No refresh token — clear auth and redirect
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        redirectToLogin();
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        const { accessToken, refreshToken: newRefresh } = data.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefresh);
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        processQueue(null, accessToken);
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        redirectToLogin();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ── Typed API helpers ─────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login:    (data) => api.post("/auth/login", data),
  logout:   ()     => api.post("/auth/logout"),
  me:       ()     => api.get("/auth/me"),
  changePassword: (data) => api.patch("/auth/change-password", data),
};

export const userAPI = {
  dashboard:     () => api.get("/users/dashboard"),
  progress:      () => api.get("/users/progress"),
  updateProfile: (data) => api.patch("/users/profile", data),
  updateScores:  (data) => api.patch("/users/scores", data),
};

export const testAPI = {
  list:    (params) => api.get("/tests", { params }),
  get:     (slug)   => api.get(`/tests/${slug}`),
  answers: (slug)   => api.get(`/tests/${slug}/answers`),
};

export const attemptAPI = {
  start:   (testId) => api.post("/attempts/start", { testId }),
  answer:  (id, data) => api.patch(`/attempts/${id}/answer`, data),
  submit:  (id)     => api.post(`/attempts/${id}/submit`),
  review:  (id)     => api.get(`/attempts/${id}/review`),
  list:    ()       => api.get("/attempts"),
};

export const courseAPI = {
  list:   (params) => api.get("/courses", { params }),
  get:    (slug)   => api.get(`/courses/${slug}`),
  enroll: (id)     => api.post(`/courses/${id}/enroll`),
};

const ROADMAP_STORAGE_KEY = "fenixrise_roadmap_data";

const getLocalRoadmapData = () => {
  try {
    const stored = localStorage.getItem(ROADMAP_STORAGE_KEY);
    if (!stored) return { totalMilestones: 0, milestones: [], targetExam: "", targetScore: null, currentScore: null, examDate: null, examDates: { SAT: "", IELTS: "", other:{ name:"", date:"" } } };
    return JSON.parse(stored);
  } catch (error) {
    return { totalMilestones: 0, milestones: [], targetExam: "", targetScore: null, currentScore: null, examDate: null, examDates: { SAT: "", IELTS: "", other:{ name:"", date:"" } } };
  }
};

const saveLocalRoadmapData = (data) => {
  localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(data));
  return data;
};

const mergeLocalRoadmapData = (patch) => {
  const current = getLocalRoadmapData();
  const merged = { ...current, ...patch, totalMilestones: current.milestones?.length ?? 0 };
  return saveLocalRoadmapData(merged);
};

const addLocalMilestone = (data) => {
  const current = getLocalRoadmapData();
  const milestone = {
    _id: data._id || `local-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    week: data.week,
    title: data.title,
    type: data.type,
    description: data.description,
    order: data.order,
    isCompleted: data.isCompleted ?? false,
  };
  const milestones = [...(current.milestones || []), milestone];
  const next = saveLocalRoadmapData({ ...current, milestones, totalMilestones: milestones.length });
  return { data: milestone, next };
};

const updateLocalMilestone = (id, patch) => {
  const current = getLocalRoadmapData();
  const milestones = (current.milestones || []).map((milestone) => milestone._id === id ? { ...milestone, ...patch } : milestone);
  saveLocalRoadmapData({ ...current, milestones });
  return milestones.find((milestone) => milestone._id === id);
};

const deleteLocalMilestone = (id) => {
  const current = getLocalRoadmapData();
  const milestones = (current.milestones || []).filter((milestone) => milestone._id !== id);
  saveLocalRoadmapData({ ...current, milestones, totalMilestones: milestones.length });
  return true;
};

const isOfflineError = (error) => !error.response;

export const roadmapAPI = {
  get: () => api.get("/roadmap").catch((error) => {
    if (isOfflineError(error)) {
      return Promise.resolve({ data: { data: getLocalRoadmapData() } });
    }
    return Promise.reject(error);
  }),
  update: (data) => api.patch("/roadmap", data).catch((error) => {
    if (isOfflineError(error)) {
      return Promise.resolve({ data: { data: mergeLocalRoadmapData(data) } });
    }
    return Promise.reject(error);
  }),
  addMilestone: (data) => api.post("/roadmap/milestones", data).catch((error) => {
    if (isOfflineError(error)) {
      return Promise.resolve({ data: { data: addLocalMilestone(data).data } });
    }
    return Promise.reject(error);
  }),
  updateMilestone: (id, data) => api.patch(`/roadmap/milestones/${id}`, data).catch((error) => {
    if (isOfflineError(error)) {
      return Promise.resolve({ data: { data: updateLocalMilestone(id, data) } });
    }
    return Promise.reject(error);
  }),
  deleteMilestone: (id) => api.delete(`/roadmap/milestones/${id}`).catch((error) => {
    if (isOfflineError(error)) {
      return Promise.resolve({ data: { data: deleteLocalMilestone(id) } });
    }
    return Promise.reject(error);
  }),
};

export default api;
