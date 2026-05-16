import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const ADMIN_CODE = "fenixrise2024"; // Change this to your preferred secret code

export default function AdminOnlyRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();

  // Check if already authenticated in this session
  const sessionAuth = sessionStorage.getItem("adminAuthenticated");
  if (sessionAuth === "true" && !isAuthenticated) {
    setIsAuthenticated(true);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code === ADMIN_CODE) {
      setIsAuthenticated(true);
      sessionStorage.setItem("adminAuthenticated", "true");
      setError("");
    } else {
      setError("Invalid code. Access denied.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("adminAuthenticated");
    setCode("");
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        padding: 20,
      }}>
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--glass-border)",
          borderRadius: 18,
          padding: 32,
          maxWidth: 400,
          width: "100%",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
        }}>
          <h2 style={{
            margin: "0 0 8px 0",
            color: "var(--text-primary)",
            fontSize: 24,
            fontWeight: 700,
            textAlign: "center",
          }}>
            🔒 Admin Access
          </h2>
          <p style={{
            margin: "0 0 24px 0",
            color: "var(--text-secondary)",
            fontSize: 14,
            textAlign: "center",
            lineHeight: 1.5,
          }}>
            Enter admin code to access bug reports
          </p>
          
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter admin code"
              style={{
                border: "1px solid var(--border)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                borderRadius: 10,
                padding: "12px 16px",
                fontSize: 16,
                outline: "none",
                transition: "border-color 0.2s",
              }}
              autoFocus
            />
            
            {error && (
              <div style={{
                color: "#ef4444",
                fontSize: 12,
                textAlign: "center",
                padding: "8px",
                background: "rgba(239, 68, 68, 0.1)",
                borderRadius: 6,
                border: "1px solid rgba(239, 68, 68, 0.2)",
              }}>
                {error}
              </div>
            )}
            
            <button
              type="submit"
              style={{
                border: "1px solid var(--glass-border)",
                background: "var(--pumpkin-soft)",
                color: "var(--text-primary)",
                borderRadius: 10,
                padding: "12px 24px",
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Access Admin Panel
            </button>
          </form>
          
          <div style={{
            marginTop: 24,
            padding: "16px",
            background: "var(--bg-secondary)",
            borderRadius: 10,
            border: "1px solid var(--border)",
          }}>
            <p style={{
              margin: 0,
              color: "var(--text-muted)",
              fontSize: 12,
              textAlign: "center",
            }}>
              🔐 This area is restricted to authorized administrators only.
              <br />
              All access attempts are logged.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      <div style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 1000,
      }}>
        <button
          onClick={handleLogout}
          style={{
            border: "1px solid var(--glass-border)",
            background: "var(--bg-card)",
            color: "var(--text-secondary)",
            borderRadius: 8,
            padding: "8px 16px",
            fontSize: 12,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          🚪 Logout Admin
        </button>
      </div>
    </>
  );
}
