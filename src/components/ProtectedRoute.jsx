import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";

export default function ProtectedRoute({ children }) {
  const { isAuthed, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 border-2 rounded-full animate-spin"
            style={{ borderColor: "var(--pumpkin)", borderTopColor: "transparent" }}
          />
          <p className="text-sm font-sans" style={{ color: "var(--text-muted)" }}>Loading…</p>
        </div>
      </div>
    );
  }

  if (!isAuthed) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
