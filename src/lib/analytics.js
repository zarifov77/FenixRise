import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });
api.interceptors.request.use(c => {
  const t = localStorage.getItem("accessToken");
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});

// ── Track any event from anywhere in the frontend ─────────────────
export const track = async (event, metadata = {}) => {
  try {
    await api.post("/analytics/track", { event, metadata });
  } catch (e) {
    // Silently fail — never block UI for analytics
  }
};

// ── Shorthand helpers ─────────────────────────────────────────────
export const trackWhiteboardCreated = (boardId, boardTitle) =>
  track("whiteboard_created", { extra: { boardId, boardTitle } });

export const trackNoteCreated = (noteId, tags) =>
  track("note_created", { extra: { noteId, tags } });

export const trackAdvisorMessage = () =>
  track("advisor_message_sent");

export const trackUniversityFavourited = (universityName) =>
  track("university_favourited", { extra: { universityName } });

export const trackRoadmapDayCompleted = (dayNumber, examType) =>
  track("roadmap_day_completed", { extra: { dayNumber, examType } });

export const trackStudyTime = (seconds, page) =>
  track("study_time", { duration: seconds, page });

export const trackPageView = (page) =>
  track("page_view", { page });

// ── Auto page view tracker hook ───────────────────────────────────
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function usePageTracking() {
  const location = useLocation();
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);
}
