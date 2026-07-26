import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import useAuthStore from "../../stores/useAuthStore";

const BOARDS_KEY = "fenixrise_boards";
const PLAN_LIMITS = { free: 3, rise: 20, phoenix: Infinity };

function loadBoards() {
  try {
    const raw = JSON.parse(localStorage.getItem(BOARDS_KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function saveBoards(boards) {
  localStorage.setItem(BOARDS_KEY, JSON.stringify(boards));
}

function PaywallModal({ onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "var(--glass-bg)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 460, background: "var(--bg-card)", border: "1px solid var(--glass-border)", borderRadius: 20, padding: 24 }}>
        <h2 className="font-display" style={{ fontSize: 20, color: "var(--text-primary)", marginBottom: 8 }}>Board limit reached</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 18 }}>
          Upgrade your plan to create more whiteboards and keep all your study plans organized.
        </p>
        <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>
          {[
            { name: "Rise ✦", desc: "Up to 20 boards" },
            { name: "Phoenix 🔥", desc: "Unlimited boards" },
          ].map(plan => (
            <div key={plan.name} style={{ border: "1px solid var(--border)", borderRadius: 12, background: "var(--bg-secondary)", padding: 12 }}>
              <p style={{ color: "var(--text-primary)", fontWeight: 700, margin: 0 }}>{plan.name}</p>
              <p style={{ color: "var(--pumpkin)", fontSize: 12, margin: 0 }}>{plan.desc}</p>
            </div>
          ))}
        </div>
            <Link to="/#features" onClick={onClose} style={{ display: "block", textAlign: "center", textDecoration: "none", background: "var(--pumpkin-soft)", color: "var(--text-primary)", border: "1px solid var(--glass-border)", borderRadius: 12, padding: "10px 14px", fontWeight: 700, marginBottom: 8 }}>
          Upgrade plan
        </Link>
        <button onClick={onClose} style={{ width: "100%", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
          Maybe later
        </button>
      </div>
    </div>
  );
}

export default function WhiteboardList() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const plan = user?.plan || "free";
  const limit = PLAN_LIMITS[plan] ?? 3;
  const [boards, setBoards] = useState(loadBoards);
  const [showPaywall, setShowPaywall] = useState(false);

  const usageText = useMemo(() => {
    const maxText = Number.isFinite(limit) ? limit : "∞";
    const label = `${plan.charAt(0).toUpperCase()}${plan.slice(1)} plan`;
    return `${label}: ${boards.length}/${maxText} boards used`;
  }, [boards.length, limit, plan]);

  const canCreate = !Number.isFinite(limit) || boards.length < limit;

  const createBoard = () => {
    if (!canCreate) {
      setShowPaywall(true);
      return;
    }
    const id = String(Date.now());
    const next = [{ id, title: `Board ${boards.length + 1}`, createdAt: Date.now() }, ...boards];
    setBoards(next);
    saveBoards(next);
    navigate(`/dashboard/whiteboard/${id}`);
  };

  const deleteBoard = (id) => {
    const filtered = boards.filter(b => b.id !== id);
    setBoards(filtered);
    saveBoards(filtered);
    localStorage.removeItem(`fenixrise_canvas_${id}`);
    localStorage.removeItem(`fenixrise_widgets_${id}`);
    localStorage.removeItem(`fenixrise_text_${id}`);
  };

  const renameBoard = (id) => {
    const current = boards.find(b => b.id === id);
    const title = window.prompt("Rename board", current?.title || "");
    if (!title) return;
    const next = boards.map(b => (b.id === id ? { ...b, title: title.trim() || b.title } : b));
    setBoards(next);
    saveBoards(next);
  };

  return (
    <DashboardLayout>
      <style>{`
        .glass-card {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .glass-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
          border-color: var(--pumpkin-soft);
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-fade-up { animation: fadeUp 0.55s ease both; }
        .delay-1 { animation-delay: 0.06s; }
        .delay-2 { animation-delay: 0.12s; }
        .delay-3 { animation-delay: 0.18s; }
        .delay-4 { animation-delay: 0.24s; }
        .delay-5 { animation-delay: 0.30s; }
        .delay-6 { animation-delay: 0.36s; }
      `}</style>
      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div className="anim-fade-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div>
            <h1 className="font-display" style={{ color: "var(--text-primary)", fontSize: 28, margin: 0 }}>Whiteboards</h1>
            <p style={{ color: "var(--text-secondary)", margin: "4px 0 0 0" }}>Organize separate boards for each subject or goal.</p>
          </div>
          <button onClick={createBoard} style={{ background: "var(--pumpkin-soft)", color: "var(--text-primary)", border: "1px solid var(--glass-border)", borderRadius: 12, padding: "10px 14px", cursor: "pointer", fontWeight: 700 }}>
            New Board
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
          {boards.map(board => {
            const preview = localStorage.getItem(`fenixrise_canvas_${board.id}`);
            const delayClass = `delay-${(boards.findIndex(b => b.id === board.id) % 6) + 1}`;
            return (
              <div key={board.id} className={`glass-card anim-fade-up ${delayClass}`} style={{ overflow: "hidden" }}>
                <button onClick={() => navigate(`/dashboard/whiteboard/${board.id}`)} style={{ width: "100%", border: "none", background: "var(--bg-secondary)", cursor: "pointer", padding: 0 }}>
                  <div style={{ height: 140, borderBottom: "1px solid var(--glass-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {preview ? (
                      <img src={preview} alt={board.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ color: "var(--text-muted)" }}>No preview yet</span>
                    )}
                  </div>
                </button>
                <div style={{ padding: 12 }}>
                  <p style={{ margin: 0, color: "var(--text-primary)", fontWeight: 700 }}>{board.title}</p>
                  <p style={{ margin: "2px 0 10px 0", color: "var(--text-muted)", fontSize: 12 }}>
                    {new Date(board.createdAt).toLocaleDateString()}
                  </p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => renameBoard(board.id)} style={{ flex: 1, background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 10, padding: "8px 10px", cursor: "pointer", color: "var(--text-secondary)" }}>
                      ✏ Rename
                    </button>
                    <button onClick={() => deleteBoard(board.id)} style={{ flex: 1, background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 10, padding: "8px 10px", cursor: "pointer", color: "var(--text-secondary)" }}>
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {canCreate && (
            <button className="glass-card anim-fade-up delay-5" onClick={createBoard} style={{ minHeight: 228, background: "transparent", border: "2px dashed var(--border)", borderRadius: 16, cursor: "pointer", color: "var(--text-secondary)" }}>
              + Add new
            </button>
          )}
        </div>

        <div className="glass-card anim-fade-up delay-6" style={{ marginTop: 18, borderRadius: 12, padding: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>{usageText}</span>
            <span style={{ color: "var(--pumpkin)", fontSize: 13, fontWeight: 700 }}>
              {Number.isFinite(limit) ? `${boards.length}/${limit}` : `${boards.length}/∞`}
            </span>
          </div>
          <div style={{ height: 8, borderRadius: 999, background: "var(--bg-secondary)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: Number.isFinite(limit) ? `${Math.min(100, (boards.length / limit) * 100)}%` : "15%", background: "var(--pumpkin)", transition: "width 0.25s ease" }} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
