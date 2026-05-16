import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Clock, FileText, BarChart2, Lock, ChevronLeft,
  Play, AlertTriangle, CheckCircle2, TrendingUp,
} from "lucide-react";
import { testAPI, attemptAPI } from "../../lib/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import useAuthStore from "../../stores/useAuthStore";

export default function TestDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [test, setTest] = useState(null);
  const [pastAttempts, setPastAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      testAPI.get(slug),
      attemptAPI.list(),
    ])
      .then(([testRes, attemptsRes]) => {
        setTest(testRes.data.data);
        const all = attemptsRes.data.data || [];
        setPastAttempts(
          all.filter((a) => a.test?.slug === slug || a.test?._id === testRes.data.data?._id)
        );
      })
      .catch((err) => {
        if (err.response?.status === 403) {
          setError("premium");
        } else {
          setError("notfound");
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleStart = async () => {
    setStarting(true);
    try {
      // Navigate to session — TestSession will call startAttempt
      navigate(`/dashboard/tests/${slug}/session`);
    } catch (err) {
      setError(err.response?.data?.error || "Could not start test.");
      setStarting(false);
    }
  };

  const difficultyColor = {
    Beginner: "text-green-400 bg-green-400/10",
    Intermediate: "text-yellow-400 bg-yellow-400/10",
    Advanced: "text-red-400 bg-red-400/10",
    Mixed: "text-[#FE7F2D] bg-[#FE7F2D]/10",
  };

  const scoreColor = (pct) =>
    pct >= 80 ? "#22c55e" : pct >= 60 ? "#eab308" : "#ef4444";

  if (loading) return (
    <DashboardLayout>
      <div className="flex justify-center pt-24">
        <div className="w-8 h-8 border-2 border-[#FE7F2D] border-t-transparent rounded-full animate-spin" />
      </div>
    </DashboardLayout>
  );

  if (error === "notfound") return (
    <DashboardLayout>
      <div className="text-center pt-24">
        <p className="text-[#9B9C9E]">Test not found.</p>
        <Link to="/dashboard/tests" className="btn-primary mt-6 inline-flex">Back to Tests</Link>
      </div>
    </DashboardLayout>
  );

  if (error === "premium") return (
    <DashboardLayout>
      <div className="max-w-md mx-auto text-center pt-24">
        <Lock size={40} className="text-[#FE7F2D] mx-auto mb-5" />
        <h2 className="font-display text-[24px] font-bold text-[#F5F4F2] mb-3" style={{ fontWeight: 700 }}>
          Premium Test
        </h2>
        <p className="text-[#9B9C9E] mb-7">
          This test is available on Rise and Phoenix plans. Upgrade to unlock all tests and courses.
        </p>
        <Link to="/" className="btn-primary">Upgrade Now</Link>
        <Link to="/dashboard/tests" className="btn-ghost ml-3">Back to Tests</Link>
      </div>
    </DashboardLayout>
  );

  const totalQuestions = test?.sections?.reduce(
    (sum, s) => sum + (s.questions?.length || 0), 0
  ) || 0;

  const bestAttempt = pastAttempts.length > 0
    ? pastAttempts.reduce((best, a) =>
        (a.score?.percentage || 0) > (best.score?.percentage || 0) ? a : best
      )
    : null;

  return (
    <DashboardLayout>
      {/* Back link */}
      <Link to="/dashboard/tests"
            className="inline-flex items-center gap-2 text-[13px] text-[#9B9C9E] hover:text-[#FE7F2D] mb-7 transition-colors">
        <ChevronLeft size={15} /> Back to Tests
      </Link>

      <div className="grid lg:grid-cols-[1fr_340px] gap-8">
        {/* ── Left: test info ── */}
        <div className="flex flex-col gap-6">
          {/* Header card */}
          <div className="card p-7">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-[#FE7F2D]/10 flex items-center justify-center flex-shrink-0 text-2xl">
                {test.examType === "SAT" ? "📐" : test.examType === "IELTS" ? "📖" : "📝"}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="pill !text-[10px]">{test.examType}</span>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${difficultyColor[test.difficulty] || ""}`}>
                    {test.difficulty}
                  </span>
                  {test.isPremium && (
                    <span className="text-[10px] font-bold bg-[#FE7F2D]/10 text-[#FE7F2D] px-2.5 py-1 rounded-full">
                      Premium
                    </span>
                  )}
                </div>
                <h1 className="font-display text-[24px] font-bold text-[#F5F4F2] leading-tight" style={{ fontWeight: 700 }}>
                  {test.title}
                </h1>
              </div>
            </div>

            {test.description && (
              <p className="text-[14px] text-[#9B9C9E] leading-relaxed mb-6">{test.description}</p>
            )}

            {/* Quick stats row */}
            <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-5">
              {[
                { icon: FileText, label: "Questions", value: totalQuestions },
                { icon: Clock,    label: "Time Limit", value: test.totalTimeLimit ? `${test.totalTimeLimit} min` : "Untimed" },
                { icon: TrendingUp, label: "Avg Score", value: `${test.averageScore || 0}%` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="text-center">
                  <Icon size={16} className="text-[#FE7F2D] mx-auto mb-1.5" />
                  <p className="font-display text-[18px] font-bold text-[#F5F4F2]" style={{ fontWeight: 700 }}>{value}</p>
                  <p className="text-[11px] text-[#9B9C9E] font-semibold uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sections breakdown */}
          <div className="card p-6">
            <h2 className="font-display text-[16px] font-bold text-[#F5F4F2] mb-4" style={{ fontWeight: 700 }}>
              Test Structure
            </h2>
            <div className="flex flex-col gap-3">
              {test.sections?.map((section, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#FE7F2D]/10 flex items-center justify-center text-[12px] font-bold text-[#FE7F2D]">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[#F5F4F2]">{section.title}</p>
                      {section.instructions && (
                        <p className="text-[12px] text-[#9B9C9E] mt-0.5 line-clamp-1">{section.instructions}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[12px] text-[#9B9C9E] flex-shrink-0">
                    <span>{section.questions?.length || 0} Qs</span>
                    {section.timeLimit && (
                      <span className="flex items-center gap-1"><Clock size={11} /> {section.timeLimit}m</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="card p-6 border-yellow-500/15">
            <div className="flex items-start gap-3">
              <AlertTriangle size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-[#F5F4F2] text-[14px] mb-2">Before you begin</h3>
                <ul className="flex flex-col gap-1.5 text-[13px] text-[#9B9C9E]">
                  <li>• Find a quiet place — you will not be able to pause the test once started.</li>
                  <li>• Ensure a stable internet connection throughout.</li>
                  <li>• Your answers are auto-saved as you go.</li>
                  <li>• You can flag questions and return to them before submitting.</li>
                  {test.totalTimeLimit && <li>• The timer starts as soon as you click <strong className="text-[#F5F4F2]">Start Test</strong>.</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: action + history ── */}
        <div className="flex flex-col gap-5">
          {/* Start card */}
          <div className="card p-6 flex flex-col gap-4">
            {bestAttempt && (
              <div className="flex items-center gap-3 p-3 bg-[#FE7F2D]/8 rounded-xl border border-[#FE7F2D]/15">
                <TrendingUp size={16} className="text-[#FE7F2D] flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-[#9B9C9E]">Your best score</p>
                  <p className="font-display text-[20px] font-bold" style={{ fontWeight: 700, color: scoreColor(bestAttempt.score.percentage) }}>
                    {bestAttempt.score.percentage}%
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={handleStart}
              disabled={starting}
              className="btn-primary justify-center w-full !py-4 !text-[15px] disabled:opacity-60"
            >
              {starting ? (
                <span className="w-5 h-5 border-2 border-[#1a1011] border-t-transparent rounded-full animate-spin" />
              ) : (
                <><Play size={16} fill="currentColor" /> {pastAttempts.length > 0 ? "Retake Test" : "Start Test"}</>
              )}
            </button>

            <p className="text-[11px] text-[#5E5F61] text-center">
              {totalQuestions} questions · {test.totalTimeLimit ? `${test.totalTimeLimit} minutes` : "No time limit"}
            </p>
          </div>

          {/* Past attempts */}
          {pastAttempts.length > 0 && (
            <div className="card p-6">
              <h3 className="font-display text-[15px] font-bold text-[#F5F4F2] mb-4" style={{ fontWeight: 700 }}>
                Attempt History
              </h3>
              <div className="flex flex-col gap-3">
                {pastAttempts
                  .filter((a) => a.status === "completed")
                  .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
                  .slice(0, 6)
                  .map((attempt, i) => (
                    <div key={attempt._id} className="flex items-center justify-between">
                      <div>
                        <p className="text-[12px] font-semibold text-[#F5F4F2]">
                          Attempt #{pastAttempts.length - i}
                        </p>
                        <p className="text-[11px] text-[#5E5F61]">
                          {new Date(attempt.submittedAt).toLocaleDateString("en-GB", {
                            day: "2-digit", month: "short", year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-display text-[17px] font-bold" style={{ fontWeight: 700, color: scoreColor(attempt.score.percentage) }}>
                          {attempt.score.percentage}%
                        </span>
                        <Link
                          to={`/dashboard/tests/review/${attempt._id}`}
                          className="text-[11px] text-[#FE7F2D] hover:underline"
                        >
                          Review
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {test.tags?.length > 0 && (
            <div className="card p-5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#5E5F61] mb-3">Topics Covered</p>
              <div className="flex flex-wrap gap-1.5">
                {test.tags.map((tag) => (
                  <span key={tag} className="text-[11px] font-semibold bg-white/5 text-[#9B9C9E] px-2.5 py-1 rounded-full capitalize">
                    {tag.replace(/-/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
