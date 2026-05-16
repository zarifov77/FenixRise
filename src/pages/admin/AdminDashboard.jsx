import { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });
api.interceptors.request.use(c => {
  const t = localStorage.getItem("accessToken");
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

function StatCard({ label, value, icon, color = "#FE7F2D", sub }) {
  return (
    <div style={{
      background: "var(--glass-bg, #fff)", backdropFilter: "blur(20px)",
      border: "1px solid var(--glass-border, #eee)", borderRadius: 20, padding: 24,
    }}>
      <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
      <p style={{ fontSize: 30, fontWeight: 800, color: "var(--text-primary, #1a1a1a)", margin: 0, lineHeight: 1 }}>{value ?? "—"}</p>
      <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
                  color: "var(--text-muted, #999)", margin: "8px 0 0" }}>{label}</p>
      {sub && <p style={{ fontSize: 12, color: "var(--text-secondary, #666)", marginTop: 4 }}>{sub}</p>}
    </div>
  );
}

function BarChart({ data, valueKey = "count", labelKey = "_id", color = "#FE7F2D", height = 120 }) {
  if (!data?.length) return (
    <div style={{ height, display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--text-muted, #999)", fontSize: 13 }}>
      No data yet — events will appear as users interact with the platform
    </div>
  );
  const max = Math.max(...data.map(d => d[valueKey] || 0), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height }}>
      {data.slice(-30).map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, height: "100%" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
            <div style={{
              width: "100%", borderRadius: "4px 4px 0 0",
              background: color,
              height: `${((d[valueKey] || 0) / max) * 100}%`,
              minHeight: 2,
              transition: "height 0.5s ease",
            }} title={`${d[labelKey]}: ${d[valueKey]}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const [overview,  setOverview]  = useState(null);
  const [dau,       setDau]       = useState([]);
  const [regs,      setRegs]      = useState([]);
  const [tests,     setTests]     = useState([]);
  const [events,    setEvents]    = useState([]);
  const [topUsers,  setTopUsers]  = useState([]);
  const [plans,     setPlans]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [days,      setDays]      = useState(30);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      api.get("/analytics/overview"),
      api.get(`/analytics/dau?days=${days}`),
      api.get(`/analytics/registrations?days=${days}`),
      api.get(`/analytics/tests?days=${days}`),
      api.get(`/analytics/events?start=${daysAgo(days)}`),
      api.get("/analytics/top-users"),
      api.get("/analytics/plans"),
    ]).then(([ov, d, r, t, e, u, p]) => {
      setOverview(ov.data.data);
      setDau(d.data.data      || []);
      setRegs(r.data.data     || []);
      setTests(t.data.data    || []);
      setEvents(e.data.data   || []);
      setTopUsers(u.data.data || []);
      setPlans(p.data.data    || []);
    }).catch(err => {
      setError(err.response?.data?.error || err.message);
    }).finally(() => setLoading(false));
  }, [days]);

  const EVENT_LABELS = {
    login: "Login", logout: "Logout", register: "Register",
    test_started: "Test Started", test_finished: "Test Finished",
    question_answered: "Question Answered",
    whiteboard_created: "Whiteboard Created",
    note_created: "Note Created",
    advisor_message_sent: "AI Advisor Message",
    roadmap_day_completed: "Roadmap Day Done",
    university_favourited: "University Saved",
    page_view: "Page View",
  };

  const riseUsers    = plans.find(p => p.plan === "rise")?.users    || 0;
  const phoenixUsers = plans.find(p => p.plan === "phoenix")?.users || 0;
  const estRevenue   = (riseUsers * 149000) + (phoenixUsers * 299000);

  return (
    <div style={{ padding: "0" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary, #1a1a1a)", margin: 0 }}>
            📊 Analytics Dashboard
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary, #666)", marginTop: 4 }}>
            Live platform data — {loading ? "loading..." : "up to date"}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[7, 14, 30].map(d => (
            <button key={d} onClick={() => setDays(d)} style={{
              padding: "8px 16px", borderRadius: 10, border: "1px solid var(--border, #eee)",
              cursor: "pointer", fontSize: 13, fontWeight: 600,
              background: days === d ? "#FE7F2D" : "var(--bg-card, #fff)",
              color: days === d ? "#fff" : "var(--text-secondary, #666)",
            }}>
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                      borderRadius: 14, padding: "14px 18px", marginBottom: 20, color: "#ef4444", fontSize: 13 }}>
          ⚠️ API Error: {error}
          <br/>
          <span style={{ opacity: 0.7 }}>
            Make sure the backend is running and analytics routes are registered in app.js
          </span>
        </div>
      )}

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 60 }}>
          <div style={{ width: 36, height: 36, border: "3px solid #FE7F2D",
                        borderTopColor: "transparent", borderRadius: "50%",
                        animation: "spin 0.8s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
            <StatCard label="Events (30d)"    value={overview?.totalEvents?.toLocaleString() || "0"} icon="📈" color="#3b82f6" />
            <StatCard label="Logins Today"    value={overview?.todayLogins  || "0"}                   icon="👥" color="#FE7F2D" />
            <StatCard label="Tests Completed" value={overview?.totalTests?.toLocaleString()   || "0"} icon="📝" color="#22c55e" />
            <StatCard label="Avg Test Score"  value={`${overview?.avgScore || 0}%`}                   icon="⭐" color="#8b5cf6" />
          </div>

          {/* Charts */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
            {[
              { title: "Daily Active Users",   sub: `Last ${days} days`, data: dau,   vk: "count", lk: "date",  color: "#3b82f6" },
              { title: "New Registrations",    sub: `Last ${days} days`, data: regs,  vk: "count", lk: "_id",   color: "#FE7F2D" },
              { title: "Tests Completed/day",  sub: `Last ${days} days`, data: tests, vk: "count", lk: "_id",   color: "#22c55e" },
            ].map(({ title, sub, data, vk, lk, color }) => (
              <div key={title} style={{
                background: "var(--glass-bg, #fff)", backdropFilter: "blur(20px)",
                border: "1px solid var(--glass-border, #eee)", borderRadius: 20, padding: 20,
              }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary, #1a1a1a)", margin: "0 0 4px" }}>{title}</p>
                <p style={{ fontSize: 11, color: "var(--text-muted, #999)", margin: "0 0 12px" }}>{sub}</p>
                <BarChart data={data} valueKey={vk} labelKey={lk} color={color} />
              </div>
            ))}
          </div>

          {/* Bottom row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>

            {/* Event breakdown */}
            <div style={{ background: "var(--glass-bg, #fff)", backdropFilter: "blur(20px)",
                          border: "1px solid var(--glass-border, #eee)", borderRadius: 20, padding: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary, #1a1a1a)", margin: "0 0 16px" }}>
                Event Breakdown
              </p>
              {events.length === 0 ? (
                <p style={{ fontSize: 13, color: "var(--text-muted, #999)" }}>No events tracked yet</p>
              ) : events.slice(0, 8).map((e, i) => {
                const max = events[0]?.count || 1;
                return (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: "var(--text-secondary, #666)" }}>
                        {EVENT_LABELS[e._id] || e._id}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary, #1a1a1a)" }}>
                        {e.count}
                      </span>
                    </div>
                    <div style={{ height: 5, borderRadius: 99, background: "var(--bg-secondary, #f5f5f5)", overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 99, background: "#FE7F2D",
                                    width: `${(e.count / max) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Top users */}
            <div style={{ background: "var(--glass-bg, #fff)", backdropFilter: "blur(20px)",
                          border: "1px solid var(--glass-border, #eee)", borderRadius: 20, padding: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary, #1a1a1a)", margin: "0 0 16px" }}>
                Top Users by Activity
              </p>
              {topUsers.length === 0 ? (
                <p style={{ fontSize: 13, color: "var(--text-muted, #999)" }}>No user data yet</p>
              ) : topUsers.map((u, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%",
                                background: "linear-gradient(135deg,#FE7F2D,#FFAD60)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary, #1a1a1a)",
                                margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {u.email || "Unknown"}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--text-muted, #999)", margin: 0 }}>
                      {u.events} events
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Plan distribution + revenue */}
            <div style={{ background: "var(--glass-bg, #fff)", backdropFilter: "blur(20px)",
                          border: "1px solid var(--glass-border, #eee)", borderRadius: 20, padding: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary, #1a1a1a)", margin: "0 0 16px" }}>
                Plan Distribution
              </p>
              {[
                { plan: "free",    label: "Free",      color: "var(--text-muted, #999)" },
                { plan: "rise",    label: "Rise ✦",    color: "#FE7F2D"                 },
                { plan: "phoenix", label: "Phoenix 🔥", color: "#8b5cf6"                },
              ].map(({ plan, label, color }) => {
                const found = plans.find(p => p.plan === plan);
                const count = found?.users || 0;
                const total = plans.reduce((s, p) => s + (p.users || 0), 0) || 1;
                return (
                  <div key={plan} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 13, color: "var(--text-secondary, #666)", fontWeight: 600 }}>{label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color }}>{count} users</span>
                    </div>
                    <div style={{ height: 8, borderRadius: 99, background: "var(--bg-secondary, #f5f5f5)", overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 99, background: color,
                                    width: `${(count / total) * 100}%`, transition: "width 0.7s ease" }} />
                    </div>
                  </div>
                );
              })}

              <div style={{ marginTop: 20, padding: 16, borderRadius: 14,
                            background: "rgba(254,127,45,0.1)", border: "1px solid #FE7F2D" }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                            color: "#FE7F2D", margin: "0 0 6px" }}>
                  Est. Monthly Revenue
                </p>
                <p style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary, #1a1a1a)", margin: 0 }}>
                  {estRevenue.toLocaleString()} UZS
                </p>
                <p style={{ fontSize: 11, color: "var(--text-muted, #999)", margin: "4px 0 0" }}>
                  Rise × {riseUsers} + Phoenix × {phoenixUsers}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
