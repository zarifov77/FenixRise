import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const ESSAYS_STORAGE_KEY = "fenixrise_essays";
const WHITEBOARDS_STORAGE_KEY = "fenixrise_whiteboards";

function readLocalEssays() {
  try {
    const parsed = JSON.parse(localStorage.getItem(ESSAYS_STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readLocalWhiteboards() {
  try {
    const parsed = JSON.parse(localStorage.getItem(WHITEBOARDS_STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function UserContentReview() {
  const [essays, setEssays] = useState([]);
  const [whiteboards, setWhiteboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("essays");
  const [selectedContent, setSelectedContent] = useState(null);

  useEffect(() => {
    setEssays(readLocalEssays());
    setWhiteboards(readLocalWhiteboards());
    setLoading(false);
  }, []);

  const handleDeleteEssay = (id) => {
    if (confirm("Are you sure you want to delete this essay?")) {
      const filtered = essays.filter(e => e.id !== id);
      setEssays(filtered);
      localStorage.setItem(ESSAYS_STORAGE_KEY, JSON.stringify(filtered));
      setSelectedContent(null);
    }
  };

  const handleDeleteWhiteboard = (id) => {
    if (confirm("Are you sure you want to delete this whiteboard?")) {
      const filtered = whiteboards.filter(w => w.id !== id);
      setWhiteboards(filtered);
      localStorage.setItem(WHITEBOARDS_STORAGE_KEY, JSON.stringify(filtered));
      setSelectedContent(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ color: "var(--text-muted)" }}>Loading user content...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h1 className="font-display" style={{ margin: 0, color: "var(--text-primary)", fontSize: 28 }}>
          📊 User Content Review
        </h1>
        <p style={{ color: "var(--text-secondary)", marginTop: 6 }}>
          Monitor and review user-generated essays and whiteboards
        </p>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, borderBottom: "1px solid var(--glass-border)" }}>
          <button
            onClick={() => setActiveTab("essays")}
            style={{
              border: "none",
              background: activeTab === "essays" ? "var(--pumpkin-soft)" : "transparent",
              color: "var(--text-primary)",
              borderRadius: "8px 8px 0 0",
              padding: "12px 24px",
              cursor: "pointer",
              fontSize: 16,
              fontWeight: 600,
              borderBottom: activeTab === "essays" ? "2px solid var(--pumpkin)" : "none",
            }}
          >
            📝 Essays ({essays.length})
          </button>
          <button
            onClick={() => setActiveTab("whiteboards")}
            style={{
              border: "none",
              background: activeTab === "whiteboards" ? "var(--pumpkin-soft)" : "transparent",
              color: "var(--text-primary)",
              borderRadius: "8px 8px 0 0",
              padding: "12px 24px",
              cursor: "pointer",
              fontSize: 16,
              fontWeight: 600,
              borderBottom: activeTab === "whiteboards" ? "2px solid var(--pumpkin)" : "none",
            }}
          >
            🎨 Whiteboards ({whiteboards.length})
          </button>
        </div>

        {/* Essays Tab */}
        {activeTab === "essays" && (
          <div>
            {essays.length === 0 ? (
              <div style={{
                background: "var(--bg-card)",
                border: "1px solid var(--glass-border)",
                borderRadius: 16,
                padding: 40,
                textAlign: "center",
              }}>
                <p style={{ color: "var(--text-muted)", margin: 0 }}>No essays submitted yet.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 16 }}>
                {essays.map((essay) => (
                  <div
                    key={essay.id}
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--glass-border)",
                      borderRadius: 16,
                      padding: 20,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20 }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: "0 0 8px 0", color: "var(--text-primary)", fontSize: 18 }}>
                          {essay.title || "Untitled Essay"}
                        </h3>
                        <p style={{
                          margin: "0 0 12px 0",
                          color: "var(--text-secondary)",
                          fontSize: 14,
                          lineHeight: 1.5,
                          maxHeight: 100,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}>
                          {essay.content || essay.text || "No content"}
                        </p>
                        <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--text-muted)" }}>
                          <span>👤 {essay.userEmail || essay.userName || "Anonymous"}</span>
                          <span>📅 {essay.createdAt ? new Date(essay.createdAt).toLocaleDateString() : "Unknown"}</span>
                          <span>📊 {essay.wordCount || essay.content?.length || 0} words</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <button
                          onClick={() => setSelectedContent({ ...essay, type: 'essay' })}
                          style={{
                            border: "1px solid var(--border)",
                            background: "var(--bg-secondary)",
                            color: "var(--text-primary)",
                            borderRadius: 8,
                            padding: "8px 16px",
                            cursor: "pointer",
                            fontSize: 14,
                          }}
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteEssay(essay.id)}
                          style={{
                            border: "1px solid var(--border)",
                            background: "var(--bg-secondary)",
                            color: "#ef4444",
                            borderRadius: 8,
                            padding: "8px 16px",
                            cursor: "pointer",
                            fontSize: 14,
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Whiteboards Tab */}
        {activeTab === "whiteboards" && (
          <div>
            {whiteboards.length === 0 ? (
              <div style={{
                background: "var(--bg-card)",
                border: "1px solid var(--glass-border)",
                borderRadius: 16,
                padding: 40,
                textAlign: "center",
              }}>
                <p style={{ color: "var(--text-muted)", margin: 0 }}>No whiteboards created yet.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                {whiteboards.map((board) => (
                  <div
                    key={board.id}
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--glass-border)",
                      borderRadius: 16,
                      padding: 16,
                    }}
                  >
                    <h3 style={{ margin: "0 0 8px 0", color: "var(--text-primary)", fontSize: 16 }}>
                      {board.title || "Untitled Whiteboard"}
                    </h3>
                    <p style={{
                      margin: "0 0 12px 0",
                      color: "var(--text-secondary)",
                      fontSize: 12,
                      minHeight: 60,
                    }}>
                      {board.description || "No description"}
                    </p>
                    <div style={{ display: "flex", gap: 8, fontSize: 11, color: "var(--text-muted)", marginBottom: 12 }}>
                      <span>👤 {board.userEmail || board.userName || "Anonymous"}</span>
                      <span>📅 {board.createdAt ? new Date(board.createdAt).toLocaleDateString() : "Unknown"}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => setSelectedContent({ ...board, type: 'whiteboard' })}
                        style={{
                          border: "1px solid var(--border)",
                          background: "var(--bg-secondary)",
                          color: "var(--text-primary)",
                          borderRadius: 6,
                          padding: "6px 12px",
                          cursor: "pointer",
                          fontSize: 12,
                          flex: 1,
                        }}
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteWhiteboard(board.id)}
                        style={{
                          border: "1px solid var(--border)",
                          background: "var(--bg-secondary)",
                          color: "#ef4444",
                          borderRadius: 6,
                          padding: "6px 12px",
                          cursor: "pointer",
                          fontSize: 12,
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content Detail Modal */}
        {selectedContent && (
          <div
            onClick={(e) => e.target === e.currentTarget && setSelectedContent(null)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1000,
              background: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <div style={{
              background: "var(--bg-card)",
              border: "1px solid var(--glass-border)",
              borderRadius: 18,
              padding: 24,
              maxWidth: 600,
              width: "100%",
              maxHeight: "80vh",
              overflow: "auto",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ margin: 0, color: "var(--text-primary)", fontSize: 20 }}>
                  {selectedContent.type === 'essay' ? '📝 Essay' : '🎨 Whiteboard'}
                </h3>
                <button
                  onClick={() => setSelectedContent(null)}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "var(--text-secondary)",
                    fontSize: 24,
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>
              </div>
              
              <div style={{ marginBottom: 16 }}>
                <h4 style={{ margin: "0 0 8px 0", color: "var(--text-primary)" }}>
                  {selectedContent.title || "Untitled"}
                </h4>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>
                  <span>👤 {selectedContent.userEmail || selectedContent.userName || "Anonymous"}</span>
                  <span style={{ marginLeft: 16 }}>📅 {selectedContent.createdAt ? new Date(selectedContent.createdAt).toLocaleString() : "Unknown"}</span>
                </div>
              </div>
              
              <div style={{
                background: "var(--bg-secondary)",
                borderRadius: 12,
                padding: 16,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                color: "var(--text-primary)",
                fontSize: 14,
                lineHeight: 1.6,
              }}>
                {selectedContent.type === 'essay' 
                  ? (selectedContent.content || selectedContent.text || "No content")
                  : (selectedContent.description || "No description")
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
