import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const BUGS_STORAGE_KEY = "fenixrise_bug_reports";

function readLocalBugs() {
  try {
    const parsed = JSON.parse(localStorage.getItem(BUGS_STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocalBugs(bugs) {
  localStorage.setItem(BUGS_STORAGE_KEY, JSON.stringify(bugs));
}

export default function BugReports() {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/bugs", {
          headers: {
            ...(localStorage.getItem("accessToken")
              ? { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
              : {}),
          },
        });
        if (!response.ok) throw new Error("Backend unavailable");
        const data = await response.json();
        const items = Array.isArray(data?.data) ? data.data : [];
        setBugs(items);
      } catch {
        setBugs(readLocalBugs());
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const markFixed = async (id) => {
    const next = bugs.map((bug) => (bug._id === id || bug.id === id ? { ...bug, status: "fixed" } : bug));
    setBugs(next);
    saveLocalBugs(next);
    await fetch(`/api/bugs/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(localStorage.getItem("accessToken")
          ? { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
          : {}),
      },
      body: JSON.stringify({ status: "fixed" }),
    }).catch(() => {});
  };

  const deleteBug = async (id) => {
    const next = bugs.filter((bug) => (bug._id || bug.id) !== id);
    setBugs(next);
    saveLocalBugs(next);
    await fetch(`/api/bugs/${id}`, {
      method: "DELETE",
      headers: {
        ...(localStorage.getItem("accessToken")
          ? { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
          : {}),
      },
    }).catch(() => {});
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <h1 className="font-display" style={{ margin: 0, color: "var(--text-primary)", fontSize: 28 }}>
          Bug Reports
        </h1>
        <p style={{ color: "var(--text-secondary)", marginTop: 6 }}>
          All submitted bug reports from users.
        </p>

        {loading ? (
          <p style={{ color: "var(--text-muted)" }}>Loading reports...</p>
        ) : bugs.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>No bug reports yet.</p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {bugs.map((bug) => {
              const id = bug._id || bug.id;
              return (
                <div
                  key={id}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--glass-border)",
                    borderRadius: 14,
                    padding: 14,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                    <h3 style={{ margin: 0, color: "var(--text-primary)", fontSize: 16 }}>{bug.title}</h3>
                    <span
                      style={{
                        border: "1px solid var(--border)",
                        background: "var(--bg-secondary)",
                        color: bug.status === "fixed" ? "var(--text-secondary)" : "var(--pumpkin)",
                        borderRadius: 999,
                        padding: "4px 10px",
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: "capitalize",
                      }}
                    >
                      {bug.status || "new"}
                    </span>
                  </div>
                  <p style={{ color: "var(--text-secondary)", marginTop: 8, marginBottom: 8 }}>
                    {bug.description}
                  </p>
                  <p style={{ color: "var(--text-muted)", margin: 0, fontSize: 12 }}>
                    Page: {bug.pageUrl || "-"}
                  </p>
                  <p style={{ color: "var(--text-muted)", marginTop: 4, marginBottom: 12, fontSize: 12 }}>
                    {bug.createdAt ? new Date(bug.createdAt).toLocaleString() : "-"}
                  </p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => markFixed(id)}
                      style={{
                        border: "1px solid var(--border)",
                        background: "var(--pumpkin-soft)",
                        color: "var(--text-primary)",
                        borderRadius: 9,
                        padding: "8px 10px",
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                    >
                      Mark as fixed
                    </button>
                    <button
                      onClick={() => deleteBug(id)}
                      style={{
                        border: "1px solid var(--border)",
                        background: "var(--bg-secondary)",
                        color: "var(--text-secondary)",
                        borderRadius: 9,
                        padding: "8px 10px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
