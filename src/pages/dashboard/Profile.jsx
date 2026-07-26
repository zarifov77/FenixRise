import { useState, useEffect } from "react";
import {
  Camera, Edit3, Save, X, Trophy, Target, TrendingUp,
  BookOpen, Map, Star, Award, CheckCircle2, Clock,
  Flame, GraduationCap, Share2, Copy, Check, Heart,
  ArrowRight, Plus,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";
import { userAPI, attemptAPI } from "../../lib/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { MDiv, MItem, MStagger, MCard, motion } from "../../components/MotionComponents";
import { UNIVERSITIES } from "./Universities";

// ── Avatar colour from initials ──────────────────────────────────
const avatarGradient = (name = "") => {
  const colors = [
    ["#FE7F2D","#FFAD60"], ["#3b82f6","#60a5fa"],
    ["#8b5cf6","#a78bfa"], ["#22c55e","#4ade80"],
    ["#ef4444","#f87171"], ["#f59e0b","#fbbf24"],
  ];
  const idx = (name.charCodeAt(0) || 0) % colors.length;
  return `linear-gradient(135deg, ${colors[idx][0]}, ${colors[idx][1]})`;
};

// ── Achievement definitions ───────────────────────────────────────
const ACHIEVEMENTS = [
  { id:"first_test",   icon:"🎯", title:"First Step",      desc:"Completed your first test",          condition: (s) => s.totalTests >= 1 },
  { id:"five_tests",   icon:"📝", title:"Test Taker",       desc:"Completed 5 practice tests",         condition: (s) => s.totalTests >= 5 },
  { id:"ten_tests",    icon:"🏆", title:"Test Champion",    desc:"Completed 10 practice tests",        condition: (s) => s.totalTests >= 10 },
  { id:"high_score",   icon:"⭐", title:"High Achiever",    desc:"Scored 80%+ on any test",            condition: (s) => s.avgScore >= 80 },
  { id:"perfect",      icon:"💯", title:"Perfectionist",    desc:"Scored 100% on any test",            condition: (s) => s.avgScore >= 100 },
  { id:"roadmap",      icon:"🗺️", title:"Planner",          desc:"Created your study roadmap",         condition: (_, r) => r?.totalMilestones > 0 },
  { id:"halfway",      icon:"🔥", title:"Halfway There",    desc:"50% roadmap complete",               condition: (_, r) => r?.progressPercent >= 50 },
  { id:"finished",     icon:"🎓", title:"Roadmap Master",   desc:"Completed your full roadmap",        condition: (_, r) => r?.progressPercent >= 100 },
  { id:"sat_target",   icon:"📐", title:"SAT Ready",        desc:"Set a SAT target score",             condition: (s) => s.currentSatScore > 0 },
  { id:"ielts_target", icon:"📖", title:"IELTS Ready",      desc:"Set an IELTS target score",          condition: (s) => s.currentIeltsScore > 0 },
];

export default function Profile() {
  const { user, setUser } = useAuthStore();

  const [dashData,    setDashData]    = useState(null);
  const [attempts,    setAttempts]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [editing,     setEditing]     = useState(false);
  const [copied,      setCopied]      = useState(false);
  const [activeTab,   setActiveTab]   = useState("overview");

  const [form, setForm] = useState({
    name:    user?.name    || "",
    profile: {
      bio:           user?.profile?.bio           || "",
      city:          user?.profile?.city          || "",
      phone:         user?.profile?.phone         || "",
      targetUniversities: user?.profile?.targetUniversities || [],
    },
    scores: {
      sat:   user?.scores?.sat   || "",
      ielts: user?.scores?.ielts || "",
      toefl: user?.scores?.toefl || "",
    },
  });
  const [saving, setSaving] = useState(false);
  const [msg,    setMsg]    = useState("");
  const [uniInput, setUniInput] = useState("");
  const [favUnis, setFavUnis] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const purchaseRequest = useMemo(() => {
    // Support navigate state when redirected from Pricing
    return location.state?.plan ? location.state : null;
  }, [location.state]);

  // Load favorites from localStorage
  useEffect(() => {
    const loadFavs = () => {
      try {
        const favIds = JSON.parse(localStorage.getItem("fenixrise_fav_unis")) || [];
        const favData = UNIVERSITIES.filter(u => favIds.includes(u.id));
        setFavUnis(favData);
      } catch {
        setFavUnis([]);
      }
    };
    loadFavs();
    // Listen for storage changes
    window.addEventListener("storage", loadFavs);
    return () => window.removeEventListener("storage", loadFavs);
  }, []);

  useEffect(() => {
    Promise.all([userAPI.dashboard(), attemptAPI.list()])
      .then(([d, a]) => {
        setDashData(d.data.data);
        setAttempts(a.data.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await userAPI.updateProfile({ name: form.name, profile: form.profile });
      await userAPI.updateScores({ sat: Number(form.scores.sat) || null, ielts: Number(form.scores.ielts) || null, toefl: Number(form.scores.toefl) || null });
      setUser(res.data.data);
      setEditing(false);
      setMsg("Profile saved!");
      setTimeout(() => setMsg(""), 3000);
    } catch (e) { setMsg("Save failed."); }
    finally { setSaving(false); }
  };

  const copyProfileLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/dashboard/profile`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats  = dashData?.stats  || {};
  const roadmap= dashData?.roadmap|| null;

  const earnedAchievements = ACHIEVEMENTS.filter(a => a.condition(stats, roadmap));
  const lockedAchievements = ACHIEVEMENTS.filter(a => !a.condition(stats, roadmap));

  const completedAttempts = attempts.filter(a => a.status === "completed");
  const bestScore = completedAttempts.length > 0
    ? Math.max(...completedAttempts.map(a => a.score?.percentage || 0))
    : 0;

  const initials = user?.name?.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2) || "?";

  const planBadge = { free:"Free", rise:"Rise ✦", phoenix:"Phoenix 🔥" };
  const planColor = { free:"var(--text-muted)", rise:"var(--pumpkin)", phoenix:"var(--pumpkin)" };

  const TABS = [
    { id:"overview",  label:"Overview"     },
    { id:"scores",    label:"Scores"       },
    { id:"activity",  label:"Activity"     },
    { id:"achievements", label:"Achievements" },
  ];

  if (loading) return (
    <DashboardLayout>
      <div className="flex justify-center pt-24">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
             style={{ borderColor:"var(--pumpkin)", borderTopColor:"transparent" }}/>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <style>{`
        .profile-glass {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
        }
        .tab-btn { padding:8px 18px; border-radius:100px; font-size:13px; font-weight:600; border:1px solid transparent; cursor:pointer; transition:all 0.2s; }
        .tab-btn.active { background:var(--pumpkin); color:#fff; }
        .tab-btn:not(.active) { background:var(--bg-secondary); color:var(--text-secondary); border-color:var(--border); }
        .tab-btn:not(.active):hover { border-color:var(--pumpkin); color:var(--pumpkin); }
        .score-box { background:var(--bg-secondary); border:1px solid var(--border); border-radius:16px; padding:16px; text-align:center; }
        .achievement-card { background:var(--bg-secondary); border:1px solid var(--border); border-radius:16px; padding:16px; display:flex; align-items:center; gap:12px; transition:all 0.2s; }
        .achievement-card:hover { border-color:var(--pumpkin); transform:translateY(-1px); }
        .achievement-card.locked { opacity:0.4; filter:grayscale(1); }
      `}</style>

      {/* Toast */}
      {msg && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl text-[13px] font-semibold shadow-xl"
             style={{ background:"var(--pumpkin)", color:"#fff" }}>{msg}</div>
      )}

      {/* ── PROFILE HEADER ── */}
      <MDiv variant="fadeUp" className="profile-glass p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Avatar */}
          <motion.div 
            className="relative flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}>
            <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-[28px] font-bold"
                 style={{ background: avatarGradient(user?.name), color:"#fff", fontFamily:"'Syne',sans-serif" }}>
              {initials}
            </div>
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background:"var(--pumpkin)", border:"2px solid var(--bg)" }}>
              <span style={{ fontSize:10, color:"#fff" }}>🔥</span>
            </motion.div>
          </motion.div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {editing ? (
              <input value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))}
                     className="form-input !text-[22px] !font-bold !mb-3" style={{ fontFamily:"'Syne',sans-serif" }}/>
            ) : (
              <h1 className="font-display text-[26px] font-bold mb-1"
                  style={{ fontWeight:800, color:"var(--text-primary)" }}>{user?.name}</h1>
            )}

            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="text-[12px] font-bold px-3 py-1 rounded-full"
                    style={{ background:"var(--pumpkin-soft)", color: planColor[user?.plan] || "var(--pumpkin)" }}>
                {planBadge[user?.plan] || "Free"}
              </span>
              {user?.profile?.city && (
                <span className="text-[13px]" style={{ color:"var(--text-muted)" }}>
                  📍 {user.profile.city}
                </span>
              )}
              <span className="text-[13px]" style={{ color:"var(--text-muted)" }}>
                🗓 Joined {new Date(user?.createdAt).toLocaleDateString("en-GB",{month:"long",year:"numeric"})}
              </span>
            </div>

            {editing ? (
              <textarea rows={2} value={form.profile.bio}
                        onChange={e => setForm(f=>({...f,profile:{...f.profile,bio:e.target.value}}))}
                        placeholder="Write a short bio…"
                        className="form-input resize-none !text-[14px]"/>
            ) : (
              <p className="text-[14px] leading-relaxed" style={{ color:"var(--text-secondary)" }}>
                {user?.profile?.bio || "No bio yet. Click Edit to add one."}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-shrink-0">
            {editing ? (
              <>
                <button onClick={() => setEditing(false)} className="btn-ghost !py-2 !px-4 !text-[13px]">
                  <X size={14}/> Cancel
                </button>
                <button onClick={saveProfile} disabled={saving} className="btn-primary !py-2 !px-4 !text-[13px]">
                  {saving ? <span className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{borderColor:"#fff",borderTopColor:"transparent"}}/> : <><Save size={14}/> Save</>}
                </button>
              </>
            ) : (
              <>
                <button onClick={copyProfileLink} className="btn-ghost !py-2 !px-3 !text-[13px]">
                  {copied ? <Check size={14}/> : <Copy size={14}/>}
                </button>
                <button onClick={() => setEditing(true)} className="btn-primary !py-2 !px-4 !text-[13px]">
                  <Edit3 size={14}/> Edit Profile
                </button>
              </>
            )}
          </div>
        </div>

        {/* Quick stat strip */}
        <MStagger className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-7 pt-6"
             style={{ borderTop:"1px solid var(--glass-border)" }}>
          {[
            { label:"Tests Taken",     value: stats.totalTests    || 0,   icon:"📝" },
            { label:"Avg Score",       value: `${stats.avgScore   || 0}%`,icon:"📊" },
            { label:"Best Score",      value: `${bestScore}%`,            icon:"⭐" },
            { label:"Achievements",    value: earnedAchievements.length,  icon:"🏆" },
          ].map(({ label, value, icon }) => (
            <MItem key={label} className="text-center">
              <motion.span 
                whileHover={{ scale: 1.3, rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
                className="text-2xl block mb-1 cursor-default">{icon}</motion.span>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="font-display text-[22px] font-bold" 
                style={{ fontWeight:700, color:"var(--text-primary)" }}>{value}</motion.p>
              <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color:"var(--text-muted)" }}>{label}</p>
            </MItem>
          ))}
        </MStagger>
      </MDiv>

      {/* ── TABS ── */}
      {/* Complete Your Purchase (appears when redirected from Pricing) */}
      {purchaseRequest && (
        <div className="profile-glass p-6 mb-6">
          <h2 className="font-display text-[18px] font-bold mb-3" style={{ color: "var(--text-primary)" }}>Complete Your Purchase</h2>
          <p className="text-[14px] mb-4" style={{ color: "var(--text-secondary)" }}>
            You're about to purchase the <strong>{purchaseRequest.name}</strong> plan for <strong>{purchaseRequest.price} UZS</strong>.
          </p>
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <div className="flex-1 text-[14px]" style={{ color: "var(--text-secondary)" }}>
              <p className="mb-2">We'll contact you to discuss payment options and next steps. Use the button on the right to email our team, or reply to the confirmation we'll send.</p>
              <p className="mb-2">If you have questions, mention your preferred payment method and best contact time.</p>
            </div>
            <div className="w-full md:w-64">
              <a href={`mailto:hello@fenixrise.uz?subject=Purchase%20Request%20-%20${encodeURIComponent(purchaseRequest.name)}&body=I%20would%20like%20to%20purchase%20the%20${encodeURIComponent(purchaseRequest.name)}%20plan.`}
                 className="btn-primary w-full py-3 text-center inline-block">
                Contact for Payment
              </a>
              <button onClick={() => navigate('/pricing')} className="btn-ghost w-full mt-3 py-2">
                Back to Pricing
              </button>
            </div>
          </div>
        </div>
      )}
      <MStagger className="flex gap-2 flex-wrap mb-6">
        {TABS.map(t => (
          <MItem key={t.id}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(t.id)}
              className={`tab-btn ${activeTab===t.id?"active":""}`}>
              {t.label}
              {t.id==="achievements" && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: activeTab==="achievements"?"rgba(255,255,255,0.25)":"var(--pumpkin-soft)", color: activeTab==="achievements"?"#fff":"var(--pumpkin)" }}>
                  {earnedAchievements.length}
                </motion.span>
              )}
            </motion.button>
          </MItem>
        ))}
      </MStagger>

      {/* ── TAB CONTENT ── */}

      {/* Overview */}
      {activeTab === "overview" && (
        <MDiv variant="fadeUp" delay={0.05} className="grid lg:grid-cols-[1fr_320px] gap-5">
          <div className="flex flex-col gap-5">
            {/* Roadmap progress */}
            <MCard className="profile-glass p-6">
              <div className="flex items-center gap-3 mb-5">
                <motion.div 
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center" 
                  style={{ background:"var(--pumpkin-soft)" }}>
                  <Map size={17} style={{ color:"var(--pumpkin)"}}/>
                </motion.div>
                <h2 className="font-display text-[17px] font-bold" style={{ fontWeight:700, color:"var(--text-primary)" }}>Roadmap Progress</h2>
              </div>
              {roadmap && roadmap.totalMilestones > 0 ? (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 rounded-full h-3 overflow-hidden" style={{ background:"var(--bg-secondary)" }}>
                      <div className="h-full rounded-full transition-all duration-700"
                           style={{ width:`${roadmap.progressPercent}%`, background:"linear-gradient(90deg,var(--pumpkin),#FFAD60)" }}/>
                    </div>
                    <span className="font-bold text-[15px]" style={{ color:"var(--pumpkin)" }}>{roadmap.progressPercent}%</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {[
                      ["Target",  roadmap.targetExam  || "—"],
                      ["Goal",    roadmap.targetScore  || "—"],
                      ["Current", roadmap.currentScore || "—"],
                    ].map(([l,v]) => (
                      <div key={l} className="score-box">
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color:"var(--text-muted)" }}>{l}</p>
                        <p className="font-display text-[18px] font-bold" style={{ fontWeight:700, color:"var(--text-primary)" }}>{v}</p>
                      </div>
                    ))}
                  </div>
                  <Link to="/dashboard/roadmap" className="btn-ghost !text-[12px] !py-2 w-full justify-center mt-4">
                    View Full Roadmap →
                  </Link>
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-[14px] mb-4" style={{ color:"var(--text-secondary)" }}>No roadmap created yet.</p>
                  <Link to="/dashboard/roadmap" className="btn-primary !text-[13px] !py-2.5 !px-5">
                    Create Roadmap ✨
                  </Link>
                </div>
              )}
            </MCard>

            {/* Recent activity */}
            <MCard className="profile-glass p-6">
              <div className="flex items-center gap-3 mb-5">
                <motion.div 
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center" 
                  style={{ background:"rgba(59,130,246,0.12)" }}>
                  <Clock size={17} style={{ color:"#3b82f6"}}/>
                </motion.div>
                <h2 className="font-display text-[17px] font-bold" style={{ fontWeight:700, color:"var(--text-primary)" }}>Recent Activity</h2>
              </div>
              {completedAttempts.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-6">
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-3xl mb-2">📝</motion.div>
                  <p className="text-[14px]" style={{ color:"var(--text-secondary)" }}>
                    No activity yet. Take a test to see your history.
                  </p>
                </motion.div>
              ) : (
                <MStagger className="flex flex-col gap-1">
                  {completedAttempts.slice(0,5).map(a => (
                    <MItem key={a._id}>
                      <motion.div 
                        whileHover={{ x: 4 }}
                        className="flex items-center justify-between py-3"
                        style={{ borderBottom:"1px solid var(--border)", cursor:"pointer" }}
                        onClick={() => navigate(`/dashboard/tests/review/${a._id}`)}>
                        <div>
                          <p className="text-[13px] font-semibold" style={{ color:"var(--text-primary)" }}>{a.test?.title || "Practice Test"}</p>
                          <p className="text-[11px]" style={{ color:"var(--text-muted)" }}>
                            {new Date(a.submittedAt).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}
                          </p>
                        </div>
                        <motion.span 
                          whileHover={{ scale: 1.1 }}
                          className="font-display text-[17px] font-bold"
                          style={{ fontWeight:700, color: a.score?.percentage>=70?"#22c55e":a.score?.percentage>=50?"#eab308":"#ef4444" }}>
                          {a.score?.percentage || 0}%
                        </motion.span>
                      </motion.div>
                    </MItem>
                  ))}
                </MStagger>
              )}
            </MCard>
          </div>

          {/* Right: target universities + info */}
          <div className="flex flex-col gap-5">
            <MDiv variant="fadeUp" delay={0.1} className="profile-glass p-6">
              <div className="flex items-center gap-3 mb-5">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer"
                  style={{ background:"rgba(139,92,246,0.12)" }}
                  onClick={() => navigate("/dashboard/universities")}>
                  <GraduationCap size={17} style={{ color:"#8b5cf6" }}/>
                </motion.div>
                <h2 className="font-display text-[16px] font-bold" style={{ fontWeight:700, color:"var(--text-primary)" }}>
                  Target Universities
                </h2>
                {favUnis.length > 0 && (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="ml-auto text-[11px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "var(--pumpkin-soft)", color: "var(--pumpkin)" }}>
                    {favUnis.length}
                  </motion.span>
                )}
              </div>
              
              {favUnis.length > 0 ? (
                <MStagger className="flex flex-col gap-3">
                  {favUnis.slice(0, 4).map((uni, i) => (
                    <MItem key={uni.id}>
                      <motion.div 
                        whileHover={{ x: 4, scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="flex items-center gap-3 p-3 rounded-xl cursor-pointer"
                        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
                        onClick={() => navigate(`/dashboard/universities?uni=${uni.id}`)}>
                        <span className="text-2xl">{uni.flag}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                            {uni.short}
                          </p>
                          <p className="text-[11px] truncate" style={{ color: "var(--text-muted)" }}>
                            {uni.country} · Rank #{uni.rank}
                          </p>
                        </div>
                        <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                          <Heart size={14} fill="#ef4444" stroke="#ef4444" />
                        </motion.div>
                      </motion.div>
                    </MItem>
                  ))}
                  {favUnis.length > 4 && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate("/dashboard/universities?favs=1")}
                      className="mt-2 text-[12px] font-semibold text-center py-2 rounded-xl"
                      style={{ background: "var(--glass-bg)", color: "var(--pumpkin)", border: "1px dashed var(--glass-border)" }}>
                      +{favUnis.length - 4} more favourites →
                    </motion.button>
                  )}
                </MStagger>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-center py-6">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-4xl mb-3">
                    🎓
                  </motion.div>
                  <p className="text-[13px] mb-1" style={{ color:"var(--text-primary)" }}>No favourite universities yet</p>
                  <p className="text-[12px] mb-4" style={{ color:"var(--text-secondary)" }}>Save universities to track your goals</p>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/dashboard/universities")}
                    className="btn-primary !py-2.5 !px-5 !text-[12px] flex items-center gap-2 mx-auto">
                    <Plus size={14}/> Explore Universities
                  </motion.button>
                </motion.div>
              )}
            </MDiv>

            {/* Account info */}
            <MCard className="profile-glass p-6">
              <h2 className="font-display text-[16px] font-bold mb-4" style={{ fontWeight:700, color:"var(--text-primary)" }}>Account</h2>
              {[
                ["Email",    user?.email],
                ["Plan",     planBadge[user?.plan] || "Free"],
                ["City",     user?.profile?.city   || "—"],
                ["Member",   new Date(user?.createdAt).toLocaleDateString("en-GB",{month:"long",year:"numeric"})],
              ].map(([k,v]) => (
                <div key={k} className="flex justify-between py-2.5" style={{ borderBottom:"1px solid var(--border)" }}>
                  <span className="text-[13px]" style={{ color:"var(--text-secondary)" }}>{k}</span>
                  <span className="text-[13px] font-semibold" style={{ color: k==="Plan"?"var(--pumpkin)":"var(--text-primary)" }}>{v}</span>
                </div>
              ))}
              {editing && (
                <div className="mt-4">
                  <label className="text-[11px] font-bold uppercase tracking-wider block mb-1.5" style={{ color:"var(--text-muted)" }}>City</label>
                  <input className="form-input !text-[13px]" value={form.profile.city} placeholder="Tashkent"
                         onChange={e => setForm(f=>({...f,profile:{...f.profile,city:e.target.value}}))}/>
                </div>
              )}
            </MCard>
          </div>
        </MDiv>
      )}

      {/* Scores tab */}
      {activeTab === "scores" && (
        <div className="profile-glass p-7 anim-fade-up">
          <h2 className="font-display text-[20px] font-bold mb-6" style={{ fontWeight:700, color:"var(--text-primary)" }}>
            My Test Scores
          </h2>
          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {[
              { key:"sat",   label:"SAT",   range:"400–1600", icon:"📐", color:"#3b82f6" },
              { key:"ielts", label:"IELTS",  range:"0–9",     icon:"📖", color:"var(--pumpkin)" },
              { key:"toefl", label:"TOEFL",  range:"0–120",   icon:"📝", color:"#8b5cf6" },
            ].map(({ key, label, range, icon, color }) => (
              <div key={key} className="score-box" style={{ borderColor:"var(--border)" }}>
                <span style={{ fontSize:32, display:"block", marginBottom:12 }}>{icon}</span>
                <p className="text-[12px] font-bold uppercase tracking-wider mb-1" style={{ color:"var(--text-muted)" }}>{label}</p>
                {editing ? (
                  <input type="number" className="form-input !text-center !text-[20px] !font-bold"
                         placeholder={range} value={form.scores[key]}
                         onChange={e => setForm(f=>({...f,scores:{...f.scores,[key]:e.target.value}}))}/>
                ) : (
                  <p className="font-display text-[36px] font-bold" style={{ fontWeight:800, color: user?.scores?.[key] ? color : "var(--text-muted)" }}>
                    {user?.scores?.[key] || "—"}
                  </p>
                )}
                <p className="text-[11px] mt-1" style={{ color:"var(--text-muted)" }}>{range}</p>
              </div>
            ))}
          </div>

          {!editing && (
            <button onClick={() => setEditing(true)} className="btn-primary !py-3 !px-6">
              <Edit3 size={15}/> Update My Scores
            </button>
          )}
          {editing && (
            <div className="flex gap-3">
              <button onClick={() => setEditing(false)} className="btn-ghost !py-3 !px-6"><X size={15}/> Cancel</button>
              <button onClick={saveProfile} disabled={saving} className="btn-primary !py-3 !px-6">
                {saving ? "Saving…" : <><Save size={15}/> Save Scores</>}
              </button>
            </div>
          )}

          {/* Score history */}
          {completedAttempts.length > 0 && (
            <div className="mt-8">
              <h3 className="font-display text-[16px] font-bold mb-4" style={{ fontWeight:700, color:"var(--text-primary)" }}>
                Test History
              </h3>
              <div className="flex flex-col gap-2">
                {completedAttempts.map(a => (
                  <div key={a._id} className="flex items-center justify-between p-4 rounded-xl"
                       style={{ background:"var(--bg-secondary)", border:"1px solid var(--border)" }}>
                    <div>
                      <p className="text-[13px] font-semibold" style={{ color:"var(--text-primary)" }}>{a.test?.title}</p>
                      <p className="text-[11px]" style={{ color:"var(--text-muted)" }}>
                        {a.test?.examType} · {new Date(a.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-display text-[20px] font-bold"
                            style={{ fontWeight:700, color:a.score?.percentage>=70?"#22c55e":a.score?.percentage>=50?"#eab308":"#ef4444" }}>
                        {a.score?.percentage}%
                      </span>
                      <Link to={`/dashboard/tests/review/${a._id}`}
                            className="text-[11px] font-semibold" style={{ color:"var(--pumpkin)" }}>Review →</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Activity tab */}
      {activeTab === "activity" && (
        <div className="profile-glass p-7 anim-fade-up">
          <h2 className="font-display text-[20px] font-bold mb-6" style={{ fontWeight:700, color:"var(--text-primary)" }}>
            Activity History
          </h2>
          {completedAttempts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📝</div>
              <p className="text-[16px] font-semibold mb-2" style={{ color:"var(--text-primary)" }}>No activity yet</p>
              <p className="text-[14px] mb-6" style={{ color:"var(--text-secondary)" }}>Take your first test to start tracking your progress.</p>
              <Link to="/dashboard/tests" className="btn-primary">Browse Tests</Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {completedAttempts.map((a, i) => (
                <div key={a._id} className="flex items-center gap-4 p-4 rounded-xl transition-all"
                     style={{ background:"var(--bg-secondary)", border:"1px solid var(--border)" }}
                     onMouseEnter={e => e.currentTarget.style.borderColor="var(--pumpkin)"}
                     onMouseLeave={e => e.currentTarget.style.borderColor="var(--border)"}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                       style={{ background:"var(--pumpkin-soft)" }}>
                    {a.test?.examType === "SAT" ? "📐" : a.test?.examType === "IELTS" ? "📖" : "📝"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold" style={{ color:"var(--text-primary)" }}>
                      {a.test?.title || "Practice Test"}
                    </p>
                    <p className="text-[12px]" style={{ color:"var(--text-muted)" }}>
                      {a.test?.examType} · {new Date(a.submittedAt).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}
                      {a.timeTakenSeconds && ` · ${Math.round(a.timeTakenSeconds/60)} min`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="font-display text-[20px] font-bold"
                         style={{ fontWeight:700, color:a.score?.percentage>=70?"#22c55e":a.score?.percentage>=50?"#eab308":"#ef4444" }}>
                        {a.score?.percentage}%
                      </p>
                      <p className="text-[10px]" style={{ color:"var(--text-muted)" }}>{a.score?.raw} pts</p>
                    </div>
                    <Link to={`/dashboard/tests/review/${a._id}`} className="btn-ghost !py-1.5 !px-3 !text-[11px]">
                      Review
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Achievements tab */}
      {activeTab === "achievements" && (
        <div className="anim-fade-up">
          <div className="profile-glass p-6 mb-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                   style={{ background:"linear-gradient(135deg,var(--pumpkin),#FFAD60)" }}>
                🏆
              </div>
              <div>
                <p className="font-display text-[22px] font-bold" style={{ fontWeight:800, color:"var(--text-primary)" }}>
                  {earnedAchievements.length} / {ACHIEVEMENTS.length} Unlocked
                </p>
                <p className="text-[13px]" style={{ color:"var(--text-secondary)" }}>
                  Keep studying to unlock more achievements
                </p>
                <div className="mt-2 rounded-full h-2 overflow-hidden w-48" style={{ background:"var(--bg-secondary)" }}>
                  <div className="h-full rounded-full" style={{ width:`${(earnedAchievements.length/ACHIEVEMENTS.length)*100}%`, background:"linear-gradient(90deg,var(--pumpkin),#FFAD60)" }}/>
                </div>
              </div>
            </div>
          </div>

          <h3 className="font-display text-[16px] font-bold mb-3" style={{ fontWeight:700, color:"var(--text-primary)" }}>
            Unlocked ✅
          </h3>
          <div className="grid sm:grid-cols-2 gap-3 mb-7">
            {earnedAchievements.length === 0 ? (
              <div className="col-span-2 text-center py-8" style={{ color:"var(--text-muted)" }}>
                No achievements yet — take your first test!
              </div>
            ) : earnedAchievements.map(a => (
              <div key={a.id} className="achievement-card">
                <span style={{ fontSize:28 }}>{a.icon}</span>
                <div>
                  <p className="text-[14px] font-bold" style={{ color:"var(--text-primary)" }}>{a.title}</p>
                  <p className="text-[12px]" style={{ color:"var(--text-secondary)" }}>{a.desc}</p>
                </div>
                <CheckCircle2 size={18} className="ml-auto flex-shrink-0" style={{ color:"#22c55e" }}/>
              </div>
            ))}
          </div>

          <h3 className="font-display text-[16px] font-bold mb-3" style={{ fontWeight:700, color:"var(--text-primary)" }}>
            Locked 🔒
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {lockedAchievements.map(a => (
              <div key={a.id} className="achievement-card locked">
                <span style={{ fontSize:28 }}>{a.icon}</span>
                <div>
                  <p className="text-[14px] font-bold" style={{ color:"var(--text-primary)" }}>{a.title}</p>
                  <p className="text-[12px]" style={{ color:"var(--text-secondary)" }}>{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
