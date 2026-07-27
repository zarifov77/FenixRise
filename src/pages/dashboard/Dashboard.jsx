import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, FileText, Target, Flame, ArrowRight, BookOpen, Map } from "lucide-react";
import { userAPI } from "../../lib/api";
import useAuthStore from "../../stores/useAuthStore";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { UNIVERSITIES as UNIVERSITY_LIST } from "./Universities";

export default function Dashboard() {
  const { user }              = useAuthStore();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [favUniIds, setFavUniIds] = useState([]);

  useEffect(() => {
    userAPI.dashboard()
      .then(r => setData(r.data.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("fenixrise_fav_unis") || "[]");
    setFavUniIds(Array.isArray(saved) ? saved : []);
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  };

  const scoreColor = p => p >= 70 ? "#22c55e" : p >= 50 ? "#eab308" : "#ef4444";

  const stats          = data?.stats          || {};
  const roadmap        = data?.roadmap        || {};
  const recentAttempts = data?.recentAttempts || [];
  const enrolled       = data?.enrolledCourses|| [];
  const favUniversities = UNIVERSITY_LIST.filter(u => favUniIds.includes(u.id));
  const savedCount      = favUniversities.length || data?.targetUniversities?.length || 0;
  const storedExamDates = (() => {
    try {
      return JSON.parse(localStorage.getItem("fenixrise_exam_dates") || "{}");
    } catch (error) {
      return {};
    }
  })();
  const examDates = roadmap?.examDates || storedExamDates;
  const formatExamDate = value => value ? new Date(value).toLocaleDateString() : "Not set";
  const examDateText = roadmap?.examDate
    ? new Date(roadmap.examDate).toLocaleDateString()
    : null;

  const STATS = [
    { label:"Saved universities", value: savedCount || "—", icon: Map, color:"var(--pumpkin)" },
    { label:"Next deadline", value: roadmap?.nextDeadline ? "1 item" : "No date", icon: Target, color:"#3b82f6" },
    { label:"Recent tests", value: recentAttempts.length || "—", icon: FileText, color:"#22c55e" },
    { label:"Enrolled courses", value: enrolled.length || "—", icon: BookOpen, color:"#f97316" },
  ];

  return (
    <DashboardLayout>
      <style>{`
        .glass-card {
          background: var(--glass-bg, rgba(255,255,255,0.07));
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border, rgba(255,255,255,0.12));
          border-radius: 20px;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .glass-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
          border-color: var(--glass-border-hover, rgba(254,127,45,0.3));
        }
        [data-theme="light"] .glass-card {
          --glass-bg: rgba(255,255,255,0.75);
          --glass-border: rgba(0,0,0,0.08);
          --glass-border-hover: rgba(209,106,16,0.35);
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
        }
        [data-theme="dark"] .glass-card {
          --glass-bg: rgba(255,255,255,0.05);
          --glass-border: rgba(255,255,255,0.10);
          --glass-border-hover: rgba(254,127,45,0.35);
          box-shadow: 0 4px 24px rgba(0,0,0,0.3);
        }
        .stat-chip {
          background: var(--glass-bg, rgba(255,255,255,0.07));
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border, rgba(255,255,255,0.12));
          border-radius: 20px;
          padding: 20px;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .stat-chip:hover { transform: translateY(-2px); }
        .dashboard-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 8px 14px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(22px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fade-up { animation: fadeUp 0.55s ease forwards; }
        .fade-up-1 { animation: fadeUp 0.55s 0.05s ease both; }
        .fade-up-2 { animation: fadeUp 0.55s 0.12s ease both; }
        .fade-up-3 { animation: fadeUp 0.55s 0.19s ease both; }
        .fade-up-4 { animation: fadeUp 0.55s 0.26s ease both; }
        .fade-up-5 { animation: fadeUp 0.55s 0.33s ease both; }
      `}</style>

      <div className="mb-8 fade-up">
        <p className="text-[13px] mb-1" style={{ color:"var(--text-muted)" }}>{greeting()},</p>
        <h1 className="font-display text-[32px]" style={{ fontWeight:800, color:"var(--text-primary)", lineHeight:1.05 }}>
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="mt-3 text-[14px] max-w-3xl" style={{ color:"var(--text-secondary)" }}>
          Today we’ll help you move one step closer to the university applications you want — from test practice to deadlines and target schools.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STATS.map(({ label, value, icon: Icon, color }, i) => (
          <div key={label} className={`stat-chip fade-up-${i+1}`}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4" style={{ background:`${color}18` }}>
              <Icon size={17} style={{ color }} />
            </div>
            <p className="font-display text-[26px] font-extrabold leading-none mb-1" style={{ fontWeight:800, color:"var(--text-primary)" }}>
              {value}
            </p>
            <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color:"var(--text-muted)" }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.8fr_1fr] gap-5">
        <div className="flex flex-col gap-5">
          <div className="glass-card p-6 fade-up-3">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] mb-2" style={{ color:"var(--text-muted)" }}>
                  Target universities
                </p>
                <h2 className="font-display text-[22px] font-bold" style={{ color:"var(--text-primary)" }}>
                  Choose your target universities
                </h2>
                <p className="text-[13px] mt-3" style={{ color:"var(--text-secondary)", maxWidth:560 }}>
                  Add the universities you want to apply to and the dashboard will show the best scores, deadlines, and recommendations.
                </p>
              </div>
              <Link to="/dashboard/universities" className="btn-primary !py-3 !px-6 !text-[14px]" style={{ whiteSpace:"nowrap" }}>
                Add university
              </Link>
            </div>

            {/* Favourite Universities - Horizontal Cards */}
            {favUniversities.length > 0 && (
              <div className="mt-5 mb-5">
                <p className="text-[11px] uppercase tracking-[0.24em] mb-3" style={{ color:"var(--text-muted)" }}>
                  Saved universities ({favUniversities.length})
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favUniversities.slice(0, 3).map((u) => (
                    <Link 
                      key={u.id} 
                      to={`/dashboard/universities`}
                      className="group relative h-[120px] rounded-2xl overflow-hidden transition-all hover:scale-[1.02]"
                      style={{ background:"var(--bg-secondary)" }}>
                      {/* Background gradient based on rank */}
                      <div 
                        className="absolute inset-0"
                        style={{ 
                          background: u.rank <= 5 
                            ? "linear-gradient(135deg, rgba(254,127,45,0.15), rgba(59,130,246,0.1))" 
                            : "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.1))"
                        }} 
                      />
                      {/* Content */}
                      <div className="relative z-10 h-full flex flex-col justify-between p-4">
                        <div className="flex items-start justify-between">
                          <span className="text-2xl">{u.flag}</span>
                          <span 
                            className="text-[11px] font-bold px-2 py-1 rounded-lg"
                            style={{ background:"rgba(254,127,45,0.15)", color:"var(--pumpkin)" }}>
                            #{u.rank}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-display text-[16px] font-bold leading-tight" style={{ color:"var(--text-primary)" }}>
                            {u.short}
                          </h4>
                          <p className="text-[12px] mt-0.5" style={{ color:"var(--text-secondary)" }}>
                            {u.city}, {u.country}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                  {favUniversities.length > 3 && (
                    <Link 
                      to="/dashboard/universities?favs=1"
                      className="h-[120px] rounded-2xl flex flex-col items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                      style={{ background:"var(--bg-secondary)", border:"2px dashed var(--border)" }}>
                      <span className="text-2xl">+{favUniversities.length - 3}</span>
                      <span className="text-[12px] font-medium" style={{ color:"var(--text-muted)" }}>View all</span>
                    </Link>
                  )}
                </div>
              </div>
            )}

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-3xl p-4" style={{ background:"rgba(59,130,246,0.08)", border:"1px solid rgba(59,130,246,0.12)" }}>
                <p className="text-[11px] uppercase tracking-[0.18em] mb-2" style={{ color:"#3b82f6" }}>
                  SAT date
                </p>
                <p className="text-[20px] font-bold" style={{ color:"var(--text-primary)" }}>
                  {formatExamDate(examDates.SAT)}
                </p>
              </div>
              <div className="rounded-3xl p-4" style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.12)" }}>
                <p className="text-[11px] uppercase tracking-[0.18em] mb-2" style={{ color:"#dc2626" }}>
                  IELTS date
                </p>
                <p className="text-[20px] font-bold" style={{ color:"var(--text-primary)" }}>
                  {formatExamDate(examDates.IELTS)}
                </p>
              </div>
              <div className="rounded-3xl p-4" style={{ background:"rgba(159,122,234,0.08)", border:"1px solid rgba(159,122,234,0.12)" }}>
                <p className="text-[11px] uppercase tracking-[0.18em] mb-2" style={{ color:"#7c3aed" }}>
                  {examDates.other?.name ? `${examDates.other.name} date` : "Other exam"}
                </p>
                <p className="text-[20px] font-bold" style={{ color:"var(--text-primary)" }}>
                  {formatExamDate(examDates.other?.date)}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 fade-up-4">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] mb-2" style={{ color:"var(--text-muted)" }}>
                  Deadlines
                </p>
                <h3 className="font-display text-[18px] font-bold" style={{ color:"var(--text-primary)" }}>
                  Upcoming deadlines
                </h3>
              </div>
              <Link to="/dashboard/roadmap" className="text-[12px] font-semibold" style={{ color:"var(--pumpkin)" }}>
                View roadmap →
              </Link>
            </div>
            {roadmap?.nextDeadline ? (
              <div className="space-y-4">
                <div className="rounded-3xl border border-[rgba(255,255,255,0.08)] p-4" style={{ background:"var(--bg-secondary)" }}>
                  <p className="text-[12px] uppercase tracking-[0.2em] mb-2" style={{ color:"var(--text-muted)" }}>
                    {roadmap.nextDeadline.university || "Upcoming"}
                  </p>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[15px] font-semibold" style={{ color:"var(--text-primary)" }}>
                        {roadmap.nextDeadline.title || "Application deadline"}
                      </p>
                      <p className="text-[12px] mt-1" style={{ color:"var(--text-secondary)" }}>
                        {roadmap.nextDeadline.description || "Submit applications and documents."}
                      </p>
                    </div>
                    <span className="dashboard-pill" style={{ background:"rgba(254,127,45,0.10)", color:"var(--pumpkin)" }}>
                      {roadmap.nextDeadline.date || "No date"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="mb-3 text-3xl">📅</div>
                <p className="text-[14px] mb-4" style={{ color:"var(--text-secondary)" }}>
                  Add your first deadline to keep your applications on track.
                </p>
                <Link to="/dashboard/roadmap" className="btn-primary !py-3 !px-6 !text-[14px]">
                  Add deadline
                </Link>
              </div>
            )}
          </div>

          <div className="glass-card p-6 fade-up-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] mb-2" style={{ color:"var(--text-muted)" }}>
                  Performance
                </p>
                <h3 className="font-display text-[18px] font-bold" style={{ color:"var(--text-primary)" }}>
                  Recent tests
                </h3>
              </div>
              <Link to="/dashboard/tests" className="text-[12px] font-semibold" style={{ color:"var(--pumpkin)" }}>
                Browse tests →
              </Link>
            </div>
            {recentAttempts.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🧠</div>
                <p className="text-[14px] mb-4" style={{ color:"var(--text-secondary)" }}>
                  No tests taken yet — start a practice session today.
                </p>
                <Link to="/dashboard/tests" className="btn-primary !py-3 !px-6 !text-[14px]">
                  Start a test
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentAttempts.slice(0, 3).map((attempt) => (
                  <div key={attempt._id} className="flex items-center justify-between gap-4 rounded-3xl p-4" style={{ background:"var(--bg-secondary)" }}>
                    <div>
                      <p className="text-[13px] font-semibold" style={{ color:"var(--text-primary)" }}>
                        {attempt.test?.title || "Practice test"}
                      </p>
                      <p className="text-[11px] mt-1" style={{ color:"var(--text-muted)" }}>
                        {attempt.test?.examType || "SAT"} · {new Date(attempt.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[18px] font-bold" style={{ color:scoreColor(attempt.score?.percentage ?? 0) }}>
                        {attempt.score?.percentage ?? 0}%
                      </p>
                      <Link to={`/dashboard/tests/review/${attempt._id}`} className="text-[11px] font-semibold" style={{ color:"var(--pumpkin)" }}>
                        Review
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="glass-card p-6 fade-up-3" style={{ minHeight:280 }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] mb-2" style={{ color:"var(--text-muted)" }}>
                  Focus
                </p>
                <h3 className="font-display text-[18px] font-bold" style={{ color:"var(--text-primary)" }}>
                  Your next step
                </h3>
              </div>
              <span className="dashboard-pill" style={{ background:"rgba(34,197,94,0.10)", color:"#22c55e" }}>
                Ready
              </span>
            </div>
            <div className="space-y-3">
              <div className="rounded-3xl p-4" style={{ background:"var(--bg-secondary)" }}>
                <p className="text-[12px] uppercase tracking-[0.2em] mb-1" style={{ color:"var(--text-muted)" }}>Priority</p>
                <p className="font-semibold" style={{ color:"var(--text-primary)" }}>
                  {roadmap?.nextDeadline ? `Review ${roadmap.nextDeadline.title || "your next deadline"}` : "Set your first application deadline"}
                </p>
              </div>
              <div className="rounded-3xl p-4" style={{ background:"var(--bg-secondary)" }}>
                <p className="text-[12px] uppercase tracking-[0.2em] mb-1" style={{ color:"var(--text-muted)" }}>Study plan</p>
                <p className="font-semibold" style={{ color:"var(--text-primary)" }}>
                  {recentAttempts.length > 0 ? "Use your recent test feedback to guide your next session." : "Start with one timed practice test to build momentum."}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 fade-up-4">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] mb-2" style={{ color:"var(--text-muted)" }}>
                  Quick actions
                </p>
                <h3 className="font-display text-[18px] font-bold" style={{ color:"var(--text-primary)" }}>
                  Jump to your tools
                </h3>
              </div>
            </div>
            <div className="grid gap-3">
              {[
                { to:"/dashboard/tests", label:"Take a practice test", icon:"📝" },
                { to:"/dashboard/roadmap", label:"Build your roadmap", icon:"🗺️" },
                { to:"/dashboard/universities", label:"Explore universities", icon:"🎓" },
                { to:"/dashboard/notebook", label:"Open your notebook", icon:"📓" },
              ].map(({ to, label, icon }) => (
                <Link key={to} to={to}
                      className="flex items-center gap-3 rounded-3xl px-4 py-3 transition-all"
                      style={{ background:"var(--bg-secondary)", color:"var(--text-primary)" }}>
                  <span className="text-lg">{icon}</span>
                  <span className="font-semibold">{label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 fade-up-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] mb-2" style={{ color:"var(--text-muted)" }}>
                  Courses
                </p>
                <h3 className="font-display text-[18px] font-bold" style={{ color:"var(--text-primary)" }}>
                  Enrolled courses
                </h3>
              </div>
              <Link to="/dashboard/courses" className="text-[12px] font-semibold" style={{ color:"var(--pumpkin)" }}>
                Browse →
              </Link>
            </div>
            {enrolled.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-[14px]" style={{ color:"var(--text-secondary)" }}>
                  You haven’t enrolled in any courses yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {enrolled.slice(0, 3).map((item) => (
                  <div key={item.course?._id || item.id} className="flex items-center justify-between gap-3 rounded-3xl p-4" style={{ background:"var(--bg-secondary)" }}>
                    <div>
                      <p className="font-semibold" style={{ color:"var(--text-primary)" }}>{item.course?.title || item.name}</p>
                      <p className="text-[12px]" style={{ color:"var(--text-muted)" }}>{item.course?.university || item.provider}</p>
                    </div>
                    <span className="text-[12px] font-semibold" style={{ color:"var(--pumpkin)" }}>
                      {item.progress ?? "0"}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card p-6 fade-up-5">
            <p className="text-[11px] uppercase tracking-[0.24em] mb-2" style={{ color:"var(--text-muted)" }}>
              Coming soon
            </p>
            <h3 className="font-display text-[18px] font-bold" style={{ color:"var(--text-primary)" }}>
              More tools are on the way
            </h3>
            <div className="mt-4 space-y-2">
              {[
                { label: "Live mentor sessions", status: "Coming soon" },
                { label: "Scholarship matching", status: "Coming soon" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl border px-3 py-3" style={{ borderColor:"var(--border)", background:"var(--bg-secondary)" }}>
                  <span className="text-[13px]" style={{ color:"var(--text-secondary)" }}>{item.label}</span>
                  <span className="dashboard-pill" style={{ background:"rgba(254,127,45,0.10)", color:"var(--pumpkin)" }}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
