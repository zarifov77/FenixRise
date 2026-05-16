import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText, Clock, Lock, ChevronRight, Search, BookOpen,
  GraduationCap, BarChart3, Flame, Zap, Target, Award,
  ArrowRight, Sparkles, Timer, Users, Star, Crown,
} from "lucide-react";
import { testAPI } from "../../lib/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { MDiv, MStagger, MItem, MH1, MP, MStat, MOrb, AnimatePresence, motion } from "../../components/MotionComponents";

// ── Exam category config ──────────────────────────────────────────
const EXAM_CATEGORIES = [
  {
    id: "SAT",
    label: "SAT",
    icon: "📐",
    color: "#3b82f6",
    gradient: "linear-gradient(135deg, #3b82f6, #6366f1)",
    description: "Math & Evidence-Based Reading & Writing",
    totalTests: 12,
  },
  {
    id: "IELTS",
    label: "IELTS",
    icon: "📖",
    color: "#22c55e",
    gradient: "linear-gradient(135deg, #22c55e, #10b981)",
    description: "Listening, Reading, Writing & Speaking",
    totalTests: 10,
  },
  {
    id: "TOEFL",
    label: "TOEFL",
    icon: "🌎",
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg, #8b5cf6, #a855f7)",
    description: "Reading, Listening, Speaking & Writing",
    totalTests: 6,
  },
  {
    id: "GRE",
    label: "GRE",
    icon: "🧠",
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b, #f97316)",
    description: "Verbal, Quantitative & Analytical Writing",
    totalTests: 8,
  },
  {
    id: "General",
    label: "General",
    icon: "📚",
    color: "#ec4899",
    gradient: "linear-gradient(135deg, #ec4899, #f43f5e)",
    description: "Mixed practice for all skill levels",
    totalTests: 5,
  },
];

const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced", "Mixed"];

const DIFF_CONFIG = {
  Beginner:     { color: "#22c55e", bg: "rgba(34,197,94,0.12)",  label: "Beginner" },
  Intermediate: { color: "#eab308", bg: "rgba(234,179,8,0.12)",  label: "Intermediate" },
  Advanced:     { color: "#ef4444", bg: "rgba(239,68,68,0.12)",  label: "Advanced" },
  Mixed:        { color: "#FE7F2D", bg: "rgba(254,127,45,0.12)", label: "Mixed" },
};

// ── Stat data for hero section ────────────────────────────────────
const STATS = [
  { icon: BookOpen,      label: "Total Tests",    value: "40+",  color: "#3b82f6" },
  { icon: GraduationCap, label: "Active Students", value: "2.4K", color: "#22c55e" },
  { icon: BarChart3,     label: "Avg. Score",      value: "78%",  color: "#f59e0b" },
  { icon: Flame,         label: "Streak Record",   value: "32d",  color: "#ef4444" },
];

export default function TestsCollection() {
  const [tests,      setTests]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [examType,   setExamType]   = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [search,     setSearch]     = useState("");
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12 };
    if (examType   !== "All") params.examType   = examType;
    if (difficulty !== "All") params.difficulty = difficulty;

    testAPI.list(params)
      .then((res) => {
        setTests(res.data.data);
        setTotalPages(res.data.pagination?.totalPages || 1);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [examType, difficulty, page]);

  const filtered = search
    ? tests.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
    : tests;

  return (
    <DashboardLayout>
      {/* ═══ Hero Section ═══ */}
      <MDiv variant="fadeUp" className="relative overflow-hidden rounded-3xl mb-8 p-8 md:p-10"
            style={{
              background: "linear-gradient(135deg, rgba(254,127,45,0.15) 0%, rgba(59,130,246,0.10) 50%, rgba(139,92,246,0.10) 100%)",
              border: "1px solid var(--glass-border)",
              backdropFilter: "blur(20px)",
            }}>
        {/* Decorative orbs */}
        <MOrb className="absolute -top-20 -right-20 w-60 h-60 rounded-full"
              style={{ background: "rgba(254,127,45,0.12)", filter: "blur(80px)" }} />
        <MOrb className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full"
              style={{ background: "rgba(59,130,246,0.10)", filter: "blur(80px)" }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 24 }}
              className="px-4 py-1.5 rounded-full text-[11px] font-bold"
              style={{
                background: "linear-gradient(135deg, var(--pumpkin), #FFAD60)",
                color: "#fff",
                boxShadow: "0 4px 16px rgba(254,127,45,0.3)",
              }}>
              <span className="flex items-center gap-1.5">
                <Sparkles size={12} /> AI POWERED
              </span>
            </motion.div>
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="text-[11px] font-semibold px-3 py-1 rounded-full"
              style={{ background: "var(--pumpkin-soft)", color: "var(--pumpkin)" }}>
              Mock Tests
            </motion.span>
          </div>

          <MH1 delay={0.15} className="font-display text-[32px] md:text-[40px] font-black mb-3"
               style={{ fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Practice <span className="gradient-text">Mock Tests</span>
          </MH1>
          <MP delay={0.25} className="text-[15px] max-w-xl mb-6"
              style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Real exam-style questions with instant scoring, detailed explanations, and AI-powered insights to boost your score.
          </MP>

          {/* Stats row */}
          <MStagger className="grid grid-cols-2 md:grid-cols-4 gap-3" staggerDelay={0.08}>
            {STATS.map(({ icon: Icon, label, value, color }) => (
              <MStat key={label}
                     className="flex items-center gap-3 p-3 rounded-xl"
                     style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                     style={{ background: `${color}18`, boxShadow: `0 4px 12px ${color}20` }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <div>
                  <p className="font-display text-[18px] font-bold" style={{ fontWeight: 800, color: "var(--text-primary)" }}>{value}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{label}</p>
                </div>
              </MStat>
            ))}
          </MStagger>
        </div>
      </MDiv>

      {/* ═══ Exam Category Cards ═══ */}
      <MDiv variant="fadeUp" delay={0.15} className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-[20px] font-bold"
                style={{ fontWeight: 700, color: "var(--text-primary)" }}>
              Choose Your Exam
            </h2>
            <p className="text-[12px]" style={{ color: "var(--text-secondary)" }}>
              Select an exam type to filter tests
            </p>
          </div>
          {examType !== "All" && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setExamType("All"); setPage(1); }}
              className="text-[12px] font-semibold px-3 py-1.5 rounded-full transition-all"
              style={{ background: "var(--pumpkin-soft)", color: "var(--pumpkin)" }}>
              Show All
            </motion.button>
          )}
        </div>

        <MStagger className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3" staggerDelay={0.06}>
          <MItem>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setExamType("All"); setPage(1); }}
              className="w-full relative p-4 rounded-2xl text-left overflow-hidden"
              style={{
                background: examType === "All"
                  ? "linear-gradient(135deg, var(--pumpkin), #FFAD60)"
                  : "var(--glass-bg)",
                border: examType === "All" ? "1px solid var(--pumpkin)" : "1px solid var(--glass-border)",
                backdropFilter: "blur(20px)",
                color: examType === "All" ? "#fff" : "var(--text-primary)",
              }}>
              <span className="text-2xl mb-2 block">🎯</span>
              <p className="font-bold text-[14px] mb-0.5">All Tests</p>
              <p className="text-[10px]" style={{ color: examType === "All" ? "rgba(255,255,255,0.8)" : "var(--text-muted)" }}>
                View everything
              </p>
            </motion.button>
          </MItem>

          {EXAM_CATEGORIES.map((cat) => {
            const isActive = examType === cat.id;
            return (
              <MItem key={cat.id}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setExamType(cat.id); setPage(1); }}
                  className="w-full relative p-4 rounded-2xl text-left overflow-hidden"
                  style={{
                    background: isActive ? cat.gradient : "var(--glass-bg)",
                    border: isActive ? `1px solid ${cat.color}` : "1px solid var(--glass-border)",
                    backdropFilter: "blur(20px)",
                    color: isActive ? "#fff" : "var(--text-primary)",
                    boxShadow: isActive ? `0 8px 32px ${cat.color}30` : "none",
                  }}>
                  <span className="text-2xl mb-2 block">{cat.icon}</span>
                  <p className="font-bold text-[14px] mb-0.5">{cat.label}</p>
                  <p className="text-[10px] leading-tight"
                     style={{ color: isActive ? "rgba(255,255,255,0.8)" : "var(--text-muted)" }}>
                    {cat.description}
                  </p>
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-bold"
                       style={{
                         background: isActive ? "rgba(255,255,255,0.2)" : `${cat.color}18`,
                         color: isActive ? "#fff" : cat.color,
                       }}>
                    {cat.totalTests}
                  </div>
                </motion.button>
              </MItem>
            );
          })}
        </MStagger>
      </MDiv>

      {/* ═══ Search & Filters ═══ */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-muted)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search mock tests by name…"
            className="form-input !rounded-2xl !pl-11 !py-3.5 !text-[14px]"
            style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", backdropFilter: "blur(20px)" }}
          />
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          {DIFFICULTIES.map((d) => {
            const dc = DIFF_CONFIG[d];
            const isActive = difficulty === d;
            return (
              <button
                key={d}
                onClick={() => { setDifficulty(d); setPage(1); }}
                className="px-4 py-2.5 rounded-xl text-[12px] font-semibold border transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background:  isActive && dc ? dc.bg : "var(--glass-bg)",
                  borderColor: isActive && dc ? dc.color : "var(--glass-border)",
                  color:       isActive && dc ? dc.color : "var(--text-secondary)",
                  backdropFilter: "blur(20px)",
                }}>
                {d}
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ Test Cards Grid ═══ */}
      <MDiv variant="fadeUp" delay={0.2}>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 rounded-full"
              style={{ border: "3px solid var(--pumpkin)", borderTopColor: "transparent" }} />
            <p className="text-[13px] mt-4 font-medium" style={{ color: "var(--text-muted)" }}>Loading tests…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-3xl mx-auto mb-5 flex items-center justify-center"
                 style={{ background: "var(--pumpkin-soft)" }}>
              <FileText size={32} style={{ color: "var(--pumpkin)" }} />
            </div>
            <p className="text-[18px] font-bold mb-2" style={{ color: "var(--text-primary)" }}>No tests found</p>
            <p className="text-[13px] max-w-sm mx-auto" style={{ color: "var(--text-secondary)" }}>
              Try adjusting your filters or search query to find available mock tests.
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => { setExamType("All"); setDifficulty("All"); setSearch(""); }}
              className="btn-primary mt-6 !text-[13px]">
              Clear Filters
            </motion.button>
          </div>
        ) : (
          <MStagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" staggerDelay={0.06}>
            {filtered.map((test) => {
              const cat = EXAM_CATEGORIES.find(c => c.id === test.examType);
              const diff = DIFF_CONFIG[test.difficulty] || DIFF_CONFIG.Mixed;
              return (
                <MItem key={test._id}>
                  <motion.div
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}>
                    <Link
                      to={`/dashboard/tests/${test.slug}`}
                      className="group relative rounded-2xl overflow-hidden block"
                      style={{
                        background: "var(--glass-bg)",
                        border: "1px solid var(--glass-border)",
                        backdropFilter: "blur(20px)",
                        boxShadow: "var(--glass-shadow)",
                      }}>

                      {/* Top accent bar */}
                      <div className="h-1 w-full"
                           style={{ background: cat?.gradient || "linear-gradient(90deg, var(--pumpkin), #FFAD60)" }} />

                      <div className="p-5 flex flex-col gap-3">
                        {/* Header row */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{cat?.icon || "📝"}</span>
                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg"
                                  style={{ background: cat ? `${cat.color}18` : "var(--pumpkin-soft)", color: cat?.color || "var(--pumpkin)" }}>
                              {test.examType}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {test.isPremium && (
                              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md"
                                    style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}>
                                <Crown size={10} /> PRO
                              </span>
                            )}
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                                  style={{ background: diff.bg, color: diff.color }}>
                              {test.difficulty}
                            </span>
                          </div>
                        </div>

                        {/* Title & description */}
                        <div>
                          <h3 className="font-display text-[16px] font-bold mb-1.5 leading-tight transition-colors"
                              style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                            {test.title}
                          </h3>
                          <p className="text-[12px] leading-relaxed line-clamp-2"
                             style={{ color: "var(--text-secondary)" }}>
                            {test.description}
                          </p>
                        </div>

                        {/* Meta info */}
                        <div className="flex items-center gap-3 text-[11px]"
                             style={{ color: "var(--text-muted)" }}>
                          <span className="flex items-center gap-1">
                            <FileText size={11} /> {test.totalQuestions || "–"} Qs
                          </span>
                          {test.totalTimeLimit && (
                            <span className="flex items-center gap-1">
                              <Timer size={11} /> {test.totalTimeLimit} min
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Users size={11} /> {test.totalAttempts || 0}
                          </span>
                        </div>

                        {/* Bottom row */}
                        <div className="flex items-center justify-between pt-3"
                             style={{ borderTop: "1px solid var(--glass-border)" }}>
                          <div className="flex items-center gap-1.5">
                            {test.averageScore > 0 && (
                              <>
                                <Star size={12} style={{ color: "#f59e0b" }} />
                                <span className="text-[11px] font-semibold" style={{ color: "var(--text-secondary)" }}>
                                  {test.averageScore}% avg
                                </span>
                              </>
                            )}
                          </div>
                          <span className="flex items-center gap-1.5 text-[12px] font-bold transition-all duration-300 group-hover:gap-2.5"
                                style={{ color: "var(--pumpkin)" }}>
                            Start <ArrowRight size={13} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </MItem>
              );
            })}
          </MStagger>
        )}
      </MDiv>

      {/* ═══ Pagination ═══ */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-9 h-9 rounded-xl text-[13px] font-semibold border flex items-center justify-center transition-all disabled:opacity-30"
            style={{
              background: "var(--glass-bg)",
              borderColor: "var(--glass-border)",
              color: "var(--text-secondary)",
              backdropFilter: "blur(20px)",
            }}>
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className="w-9 h-9 rounded-xl text-[13px] font-semibold border transition-all"
              style={{
                background:  page === p ? "linear-gradient(135deg, var(--pumpkin), #FFAD60)" : "var(--glass-bg)",
                borderColor: page === p ? "var(--pumpkin)" : "var(--glass-border)",
                color:       page === p ? "#fff" : "var(--text-secondary)",
                boxShadow:   page === p ? "0 4px 16px rgba(254,127,45,0.3)" : "none",
                backdropFilter: "blur(20px)",
              }}>
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-9 h-9 rounded-xl text-[13px] font-semibold border flex items-center justify-center transition-all disabled:opacity-30"
            style={{
              background: "var(--glass-bg)",
              borderColor: "var(--glass-border)",
              color: "var(--text-secondary)",
              backdropFilter: "blur(20px)",
            }}>
            ›
          </button>
        </div>
      )}
    </DashboardLayout>
  );
}
