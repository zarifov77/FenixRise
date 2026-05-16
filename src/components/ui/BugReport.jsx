import { useMemo, useState } from "react";
import useAuthStore from "../../stores/useAuthStore";

const BUGS_STORAGE_KEY = "fenixrise_bug_reports";

function readLocalBugs() {
  try {
    const parsed = JSON.parse(localStorage.getItem(BUGS_STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function BugReport() {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const pageUrl = useMemo(() => window.location.href, [open]);

  const submitBug = async (event) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    if (!trimmedTitle || !trimmedDescription) return;

    const report = {
      id: String(Date.now()),
      title: trimmedTitle,
      description: trimmedDescription,
      pageUrl: window.location.href,
      userEmail: user?.email || "",
      status: "new",
      createdAt: new Date().toISOString(),
    };

    const local = readLocalBugs();
    localStorage.setItem(BUGS_STORAGE_KEY, JSON.stringify([report, ...local]));

    fetch("/api/bugs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(localStorage.getItem("accessToken")
          ? { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
          : {}),
      },
      body: JSON.stringify(report),
    }).catch(() => {
      // Do not block UX if backend bug endpoint is unavailable.
    });

    setOpen(false);
    setTitle("");
    setDescription("");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          right: 20,
          bottom: 20,
          zIndex: 400,
          width: 46,
          height: 46,
          borderRadius: "50%",
          border: "1px solid var(--glass-border)",
          background: "var(--pumpkin-soft)",
          color: "var(--text-primary)",
          cursor: "pointer",
          fontSize: 20,
          boxShadow: "0 10px 24px var(--glass-bg)",
        }}
        title="Report a bug"
      >
        🐛
      </button>

      {open && (
        <div
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 500,
            background: "var(--glass-bg)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <form
            onSubmit={submitBug}
            style={{
              width: "100%",
              maxWidth: 520,
              background: "var(--bg-card)",
              border: "1px solid var(--glass-border)",
              borderRadius: 18,
              padding: 18,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <h3 className="font-display" style={{ margin: 0, color: "var(--text-primary)" }}>
              Report a Bug
            </h3>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What went wrong?"
              style={{
                border: "1px solid var(--border)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                borderRadius: 10,
                padding: "10px 12px",
                outline: "none",
              }}
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the bug in detail..."
              rows={5}
              style={{
                border: "1px solid var(--border)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                borderRadius: 10,
                padding: "10px 12px",
                outline: "none",
                resize: "vertical",
                fontFamily: "inherit",
              }}
            />
            <input
              value={pageUrl}
              readOnly
              style={{
                border: "1px solid var(--border)",
                background: "var(--bg-secondary)",
                color: "var(--text-muted)",
                borderRadius: 10,
                padding: "10px 12px",
                outline: "none",
              }}
            />
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 12 }}>
              Please describe what you expected vs what happened.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{
                  border: "1px solid var(--border)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-secondary)",
                  borderRadius: 10,
                  padding: "9px 12px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  border: "1px solid var(--glass-border)",
                  background: "var(--pumpkin-soft)",
                  color: "var(--text-primary)",
                  borderRadius: 10,
                  padding: "9px 12px",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}

      {showToast && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 76,
            zIndex: 550,
            border: "1px solid var(--glass-border)",
            background: "var(--bg-card)",
            color: "var(--text-primary)",
            borderRadius: 10,
            padding: "10px 14px",
          }}
        >
          Bug reported! Thank you 🙏
        </div>
      )}
    </>
  );
}
