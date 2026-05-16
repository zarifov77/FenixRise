import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userAPI, authAPI, courseAPI } from "../../lib/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import useAuthStore from "../../stores/useAuthStore";
import { MDiv, MStagger, MItem, MH1, MP, MStat, MOrb, AnimatePresence, motion } from "../../components/MotionComponents";
import {
  TrendingUp, BookOpen, Play, Clock, Users, Star, Search,
  ChevronRight, Crown, Sparkles, Video, GraduationCap,
  BarChart3, Flame, ArrowRight, Layers, Monitor, Award,
} from "lucide-react";

// ─── Progress ─────────────────────────────────────────────────────
export function Progress() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userAPI.progress()
      .then((r) => setData(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const EXAM_COLORS = { SAT: "#FE7F2D", IELTS: "#3b82f6", TOEFL: "#8b5cf6", General: "#22c55e" };

  if (loading) return (
    <DashboardLayout>
      <div className="flex justify-center pt-20">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
             style={{ borderColor: "var(--pumpkin)", borderTopColor: "transparent" }} />
      </div>
    </DashboardLayout>
  );

  const grouped = data?.grouped || {};

  return (
    <DashboardLayout>
      <MDiv variant="fadeUp" className="mb-8">
        <h1 className="font-display text-[28px] font-extrabold mb-1"
            style={{ fontWeight: 800, color: "var(--text-primary)" }}>My Progress</h1>
        <p className="text-[14px]" style={{ color: "var(--text-secondary)" }}>
          Track your score improvement over time.
        </p>
      </MDiv>

      {Object.keys(grouped).length === 0 ? (
        <MDiv variant="fadeUp" delay={0.2}>
          <div className="card p-12 text-center">
            <TrendingUp size={40} className="mx-auto mb-4" style={{ color: "var(--text-muted)" }} />
            <p className="text-[15px] mb-2" style={{ color: "var(--text-secondary)" }}>No test data yet.</p>
            <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
              Complete some tests to see your progress here.
            </p>
          </div>
        </MDiv>
      ) : (
        <MStagger className="flex flex-col gap-6" staggerDelay={0.1}>
          {Object.entries(grouped).map(([examType, attempts]) => {
            const color = EXAM_COLORS[examType] || "#FE7F2D";
            const best = Math.max(...attempts.map((a) => a.percentage));
            const latest = attempts[attempts.length - 1]?.percentage;
            const first = attempts[0]?.percentage;
            const improvement = latest - first;
            return (
              <MItem key={examType}>
                <motion.div
                  whileHover={{ y: -2, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className="card p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-display text-[18px] font-bold"
                        style={{ fontWeight: 700, color: "var(--text-primary)" }}>{examType}</h2>
                    <div className="flex gap-4 text-[12px]">
                      <span style={{ color: "var(--text-secondary)" }}>
                        Best: <strong style={{ color: "var(--text-primary)" }}>{best}%</strong>
                      </span>
                      <span style={{ color: improvement >= 0 ? "#22c55e" : "#ef4444" }}>
                        {improvement >= 0 ? "+" : ""}{improvement}% vs first
                      </span>
                    </div>
                  </div>
                  <div className="flex items-end gap-2 h-32 mb-5">
                    {attempts.map((a, i) => (
                      <motion.div 
                        key={i} 
                        className="flex-1 flex flex-col items-center gap-1 min-w-0"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.3, type: "spring", stiffness: 300, damping: 24 }}>
                        <span className="text-[10px]" style={{ color: "var(--text-secondary)" }}>{a.percentage}%</span>
                        <div className="w-full rounded-t-lg"
                             style={{ height: `${a.percentage}%`, background: color, opacity: 0.7 + (i / attempts.length) * 0.3 }} />
                        <span className="text-[9px] truncate w-full text-center"
                              style={{ color: "var(--text-muted)" }}>
                          {new Date(a.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex flex-col" style={{ borderTop: "1px solid var(--border)" }}>
                    {[...attempts].reverse().slice(0, 5).map((a, i) => (
                      <motion.div 
                        key={i} 
                        className="flex items-center justify-between py-2.5 text-[13px]"
                        style={{ borderBottom: "1px solid var(--border)" }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.2 }}>
                        <span style={{ color: "var(--text-secondary)" }}>{a.testTitle || "Practice Test"}</span>
                        <span className="font-bold" style={{ color }}>{a.percentage}%</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </MItem>
            );
          })}
        </MStagger>
      )}
    </DashboardLayout>
  );
}

// ─── Settings ─────────────────────────────────────────────────────
export function Settings() {
  const { user, setUser } = useAuthStore();
  const [form, setForm] = useState({
    name: user?.name || "",
    profile: {
      phone: user?.profile?.phone || "",
      city: user?.profile?.city || "",
      bio: user?.profile?.bio || "",
    },
  });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "" });
  const [msg, setMsg] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await userAPI.updateProfile(form);
      setUser(res.data.data);
      setMsg("Profile saved.");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setMsg(err.response?.data?.error || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setSavingPw(true);
    try {
      await authAPI.changePassword(pwForm);
      setPwMsg("Password changed.");
      setPwForm({ currentPassword: "", newPassword: "" });
      setTimeout(() => setPwMsg(""), 3000);
    } catch (err) {
      setPwMsg(err.response?.data?.error || "Failed.");
    } finally {
      setSavingPw(false);
    }
  };

  const FInput = ({ label, value, onChange, type = "text", placeholder = "" }) => (
    <div>
      <label className="text-[12px] font-semibold uppercase tracking-wider block mb-2"
             style={{ color: "var(--text-muted)" }}>
        {label}
      </label>
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        className="form-input"
      />
    </div>
  );

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-display text-[28px] font-extrabold mb-1"
            style={{ fontWeight: 800, color: "var(--text-primary)" }}>Settings</h1>
        <p className="text-[14px]" style={{ color: "var(--text-secondary)" }}>
          Manage your profile and account security.
        </p>
      </div>

      <div className="max-w-xl flex flex-col gap-6">
        {/* Profile form */}
        <form onSubmit={saveProfile} className="card p-6 flex flex-col gap-4">
          <h2 className="font-display text-[17px] font-bold"
              style={{ fontWeight: 700, color: "var(--text-primary)" }}>Profile</h2>
          <FInput label="Full Name" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <FInput label="Phone" value={form.profile.phone} placeholder="+998 XX XXX XX XX"
                  onChange={(e) => setForm({ ...form, profile: { ...form.profile, phone: e.target.value } })} />
          <FInput label="City" value={form.profile.city} placeholder="Tashkent"
                  onChange={(e) => setForm({ ...form, profile: { ...form.profile, city: e.target.value } })} />
          <div>
            <label className="text-[12px] font-semibold uppercase tracking-wider block mb-2"
                   style={{ color: "var(--text-muted)" }}>Bio</label>
            <textarea
              rows={3} value={form.profile.bio} placeholder="Tell us about you…"
              onChange={(e) => setForm({ ...form, profile: { ...form.profile, bio: e.target.value } })}
              className="form-input resize-none"
            />
          </div>
          {msg && <p className="text-[13px] text-green-500">{msg}</p>}
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? "Saving…" : "Save Profile"}
          </button>
        </form>

        {/* Password form */}
        <form onSubmit={savePassword} className="card p-6 flex flex-col gap-4">
          <h2 className="font-display text-[17px] font-bold"
              style={{ fontWeight: 700, color: "var(--text-primary)" }}>Change Password</h2>
          <FInput label="Current Password" type="password" value={pwForm.currentPassword}
                  onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} />
          <FInput label="New Password" type="password" value={pwForm.newPassword}
                  placeholder="Min. 8 characters"
                  onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} />
          {pwMsg && <p className="text-[13px] text-green-500">{pwMsg}</p>}
          <button type="submit" disabled={savingPw} className="btn-primary disabled:opacity-60">
            {savingPw ? "Saving…" : "Change Password"}
          </button>
        </form>

        {/* Account info */}
        <div className="card p-6">
          <h2 className="font-display text-[17px] font-bold mb-4"
              style={{ fontWeight: 700, color: "var(--text-primary)" }}>Account</h2>
          <div className="flex flex-col gap-3 text-[13px]">
            {[
              ["Email", user?.email],
              ["Plan", user?.plan],
              ["Member since", new Date(user?.createdAt).toLocaleDateString()],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2"
                   style={{ borderBottom: "1px solid var(--border)" }}>
                <span style={{ color: "var(--text-secondary)" }}>{k}</span>
                <span style={{ color: k === "Plan" ? "var(--pumpkin)" : "var(--text-primary)", fontWeight: k === "Plan" ? 600 : 400 }}>
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// ─── Course category config ──────────────────────────────────────
const COURSE_CATEGORIES = [
  { id: "All",      label: "All Courses",  icon: "🎯", color: "var(--pumpkin)", gradient: "linear-gradient(135deg, var(--pumpkin), #FFAD60)" },
  { id: "SAT",      label: "SAT Prep",     icon: "📐", color: "#3b82f6", gradient: "linear-gradient(135deg, #3b82f6, #6366f1)" },
  { id: "IELTS",    label: "IELTS Prep",   icon: "📖", color: "#22c55e", gradient: "linear-gradient(135deg, #22c55e, #10b981)" },
  { id: "TOEFL",    label: "TOEFL Prep",   icon: "🌎", color: "#8b5cf6", gradient: "linear-gradient(135deg, #8b5cf6, #a855f7)" },
  { id: "General",  label: "General",      icon: "📚", color: "#ec4899", gradient: "linear-gradient(135deg, #ec4899, #f43f5e)" },
];

const COURSE_STATS = [
  { icon: Video,         label: "Video Lessons",  value: "120+", color: "#3b82f6" },
  { icon: GraduationCap, label: "Enrolled",       value: "1.8K", color: "#22c55e" },
  { icon: Award,         label: "Certificates",   value: "540",  color: "#f59e0b" },
  { icon: Monitor,       label: "Hours of Content", value: "80+", color: "#ef4444" },
];

const LEVEL_COLORS = {
  Beginner:     { color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  Intermediate: { color: "#eab308", bg: "rgba(234,179,8,0.12)" },
  Advanced:     { color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
  Mixed:        { color: "#FE7F2D", bg: "rgba(254,127,45,0.12)" },
};

// ─── CoursesList ──────────────────────────────────────────────────
export function CoursesList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("All");
  const [search, setSearch]   = useState("");

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (filter !== "All") params.examType = filter;
    courseAPI.list(params)
      .then((r) => setCourses(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filter]);

  const filtered = search
    ? courses.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))
    : courses;

  const getCourseThumb = (course) => {
    const firstVideo = course.modules?.[0]?.lessons?.find(l => l.type === "video");
    if (firstVideo?.videoUrl) {
      const ytMatch = firstVideo.videoUrl.match(/(?:v=|\/)([\w-]{11})/);
      if (ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
    }
    return null;
  };

  const getVideoCount = (course) =>
    course.modules?.reduce((s, m) => s + m.lessons.filter(l => l.type === "video").length, 0) || 0;

  const getTotalLessons = (course) =>
    course.modules?.reduce((s, m) => s + m.lessons.length, 0) || 0;

  const getTotalDuration = (course) =>
    course.modules?.reduce((s, m) => s + m.lessons.reduce((ls, l) => ls + (l.durationMinutes || 0), 0), 0) || 0;

  return (
    <DashboardLayout>
      {/* ═══ Hero Section ═══ */}
      <MDiv variant="fadeUp" className="relative overflow-hidden rounded-3xl mb-8 p-8 md:p-10"
            style={{
              background: "linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(59,130,246,0.10) 50%, rgba(139,92,246,0.10) 100%)",
              border: "1px solid var(--glass-border)",
              backdropFilter: "blur(20px)",
            }}>
        <MOrb className="absolute -top-20 -right-20 w-60 h-60 rounded-full"
              style={{ background: "rgba(34,197,94,0.10)", filter: "blur(80px)" }} />
        <MOrb className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full"
              style={{ background: "rgba(59,130,246,0.08)", filter: "blur(80px)" }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 24 }}
              className="px-4 py-1.5 rounded-full text-[11px] font-bold"
              style={{
                background: "linear-gradient(135deg, #22c55e, #10b981)",
                color: "#fff",
                boxShadow: "0 4px 16px rgba(34,197,94,0.3)",
              }}>
              <span className="flex items-center gap-1.5">
                <Video size={12} /> VIDEO COURSES
              </span>
            </motion.div>
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="text-[11px] font-semibold px-3 py-1 rounded-full"
              style={{ background: "var(--pumpkin-soft)", color: "var(--pumpkin)" }}>
              Prep Videos
            </motion.span>
          </div>

          <MH1 delay={0.15} className="font-display text-[32px] md:text-[40px] font-black mb-3"
               style={{ fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Learn with <span className="gradient-text">Video Courses</span>
          </MH1>
          <MP delay={0.25} className="text-[15px] max-w-xl mb-6"
              style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Expert-led video lessons for SAT, IELTS, and more. Watch, practice, and master every topic at your own pace.
          </MP>

          {/* Stats row */}
          <MStagger className="grid grid-cols-2 md:grid-cols-4 gap-3" staggerDelay={0.08}>
            {COURSE_STATS.map(({ icon: Icon, label, value, color }) => (
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

      {/* ═══ Category Cards ═══ */}
      <MDiv variant="fadeUp" delay={0.15} className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-[20px] font-bold"
                style={{ fontWeight: 700, color: "var(--text-primary)" }}>
              Browse by Subject
            </h2>
            <p className="text-[12px]" style={{ color: "var(--text-secondary)" }}>
              Choose an exam type to explore courses
            </p>
          </div>
          {filter !== "All" && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter("All")}
              className="text-[12px] font-semibold px-3 py-1.5 rounded-full transition-all"
              style={{ background: "var(--pumpkin-soft)", color: "var(--pumpkin)" }}>
              Show All
            </motion.button>
          )}
        </div>

        <MStagger className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3" staggerDelay={0.06}>
          {COURSE_CATEGORIES.map((cat) => {
            const isActive = filter === cat.id;
            return (
              <MItem key={cat.id}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setFilter(cat.id)}
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
                  <p className="text-[10px]" style={{ color: isActive ? "rgba(255,255,255,0.8)" : "var(--text-muted)" }}>
                    {cat.id === "All" ? "View all courses" : `${cat.id} preparation`}
                  </p>
                </motion.button>
              </MItem>
            );
          })}
        </MStagger>
      </MDiv>

      {/* ═══ Search ═══ */}
      <div className="mb-6">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-muted)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses by name…"
            className="form-input !rounded-2xl !pl-11 !py-3.5 !text-[14px]"
            style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", backdropFilter: "blur(20px)" }}
          />
        </div>
      </div>

      {/* ═══ Course Cards Grid ═══ */}
      <MDiv variant="fadeUp" delay={0.2}>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 rounded-full"
              style={{ border: "3px solid var(--pumpkin)", borderTopColor: "transparent" }} />
            <p className="text-[13px] mt-4 font-medium" style={{ color: "var(--text-muted)" }}>Loading courses…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-3xl mx-auto mb-5 flex items-center justify-center"
                 style={{ background: "var(--pumpkin-soft)" }}>
              <BookOpen size={32} style={{ color: "var(--pumpkin)" }} />
            </div>
            <p className="text-[18px] font-bold mb-2" style={{ color: "var(--text-primary)" }}>No courses found</p>
            <p className="text-[13px] max-w-sm mx-auto" style={{ color: "var(--text-secondary)" }}>
              Try adjusting your filters or search to find available courses.
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => { setFilter("All"); setSearch(""); }}
              className="btn-primary mt-6 !text-[13px]">
              Clear Filters
            </motion.button>
          </div>
        ) : (
          <MStagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" staggerDelay={0.07}>
            {filtered.map((course) => {
              const cat = COURSE_CATEGORIES.find(c => c.id === course.examType) || COURSE_CATEGORIES[0];
              const thumb = getCourseThumb(course);
              const videoCount = getVideoCount(course);
              const totalLessons = getTotalLessons(course);
              const totalDuration = getTotalDuration(course);
              const levelCfg = LEVEL_COLORS[course.level] || LEVEL_COLORS.Mixed;
              const hasVideo = videoCount > 0 || thumb;

              return (
                <MItem key={course._id}>
                  <motion.div
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}>
                    <Link
                      to={`/dashboard/courses/${course.slug || course._id}`}
                      className="group relative rounded-2xl overflow-hidden block"
                      style={{
                        background: "var(--glass-bg)",
                        border: "1px solid var(--glass-border)",
                        backdropFilter: "blur(20px)",
                        boxShadow: "var(--glass-shadow)",
                      }}>

                      <div className="relative h-44 overflow-hidden"
                           style={{ background: thumb ? "#000" : cat.gradient }}>
                        {thumb ? (
                          <img src={thumb} alt={course.title}
                               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                               loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-5xl opacity-80">{cat.icon}</span>
                          </div>
                        )}

                        {hasVideo && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-300">
                            <div className="w-14 h-14 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300"
                                 style={{
                                   background: "rgba(254,127,45,0.95)",
                                   boxShadow: "0 4px 24px rgba(254,127,45,0.5)",
                                 }}>
                              <Play size={22} className="text-white ml-0.5" fill="white" />
                            </div>
                          </div>
                        )}

                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg"
                                style={{ background: "rgba(0,0,0,0.6)", color: "#fff", backdropFilter: "blur(8px)" }}>
                            {course.examType}
                          </span>
                          {course.isPremium && (
                            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg"
                                  style={{ background: "rgba(245,158,11,0.9)", color: "#fff" }}>
                              <Crown size={9} /> PRO
                            </span>
                          )}
                        </div>

                        {videoCount > 0 && (
                          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold"
                               style={{ background: "rgba(0,0,0,0.7)", color: "#fff", backdropFilter: "blur(8px)" }}>
                            <Play size={10} fill="white" /> {videoCount} videos
                          </div>
                        )}

                        {totalDuration > 0 && (
                          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold"
                               style={{ background: "rgba(0,0,0,0.7)", color: "#fff", backdropFilter: "blur(8px)" }}>
                            <Clock size={10} /> {totalDuration} min
                          </div>
                        )}
                      </div>

                      <div className="p-5 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg"
                                style={{ background: levelCfg.bg, color: levelCfg.color }}>
                            {course.level}
                          </span>
                          {course.averageRating > 0 && (
                            <div className="flex items-center gap-1">
                              <Star size={12} style={{ color: "#f59e0b" }} fill="#f59e0b" />
                              <span className="text-[11px] font-semibold" style={{ color: "var(--text-secondary)" }}>
                                {course.averageRating.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>

                        <h3 className="font-display text-[16px] font-bold leading-tight line-clamp-2"
                            style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                          {course.title}
                        </h3>

                        <p className="text-[12px] leading-relaxed line-clamp-2"
                           style={{ color: "var(--text-secondary)" }}>
                          {course.shortDescription}
                        </p>

                        <div className="flex items-center gap-3 text-[11px]"
                             style={{ color: "var(--text-muted)" }}>
                          <span className="flex items-center gap-1">
                            <Layers size={11} /> {totalLessons} lessons
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={11} /> {course.durationWeeks}w
                          </span>
                          <span className="flex items-center gap-1">
                            <Users size={11} /> {course.totalEnrolled || 0}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-3"
                             style={{ borderTop: "1px solid var(--glass-border)" }}>
                          <div>
                            {course.discountPrice != null ? (
                              <div className="flex items-center gap-2">
                                <span className="font-display text-[16px] font-bold"
                                      style={{ fontWeight: 800, color: "var(--pumpkin)" }}>
                                  {course.discountPrice === 0 ? "Free" : `${course.discountPrice?.toLocaleString()} UZS`}
                                </span>
                                <span className="text-[11px] line-through" style={{ color: "var(--text-muted)" }}>
                                  {course.price?.toLocaleString()} UZS
                                </span>
                              </div>
                            ) : (
                              <span className="font-display text-[16px] font-bold"
                                    style={{ fontWeight: 800, color: course.price === 0 ? "#22c55e" : "var(--text-primary)" }}>
                                {course.price === 0 ? "Free" : `${course.price?.toLocaleString()} UZS`}
                              </span>
                            )}
                          </div>
                          <span className="flex items-center gap-1.5 text-[12px] font-bold transition-all duration-300 group-hover:gap-2.5"
                                style={{ color: "var(--pumpkin)" }}>
                            {course.price === 0 ? "Enroll" : "View"} <ArrowRight size={13} />
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
    </DashboardLayout>
  );
}
