import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CheckCircle2, XCircle, MinusCircle, Trophy,
  Clock, BarChart2, ChevronDown, ChevronUp,
  RotateCcw, Home, BookOpen,
} from "lucide-react";
import { attemptAPI } from "../../lib/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

export default function TestReview() {
  const { attemptId } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedQ, setExpandedQ] = useState(null);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    attemptAPI.review(attemptId)
      .then((r) => setAttempt(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [attemptId]);

  if (loading) return (
    <DashboardLayout>
      <div className="flex justify-center pt-24">
        <div className="w-8 h-8 border-2 border-[#FE7F2D] border-t-transparent rounded-full animate-spin" />
      </div>
    </DashboardLayout>
  );

  if (!attempt) return (
    <DashboardLayout>
      <div className="text-center pt-24 text-[#9B9C9E]">Attempt not found.</div>
    </DashboardLayout>
  );

  const pct = attempt.score?.percentage || 0;
  const scoreColor = pct >= 80 ? "#22c55e" : pct >= 60 ? "#eab308" : "#ef4444";
  const scoreLabel = pct >= 80 ? "Excellent 🎉" : pct >= 60 ? "Good Job 👍" : "Keep Practising 💪";

  const formatTime = (s) => {
    if (!s) return "—";
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
  };

  // Group answers by section
  const sectionAnswers = (attempt.test?.sections || []).map((sec, si) => ({
    ...sec,
    answers: (attempt.answers || []).filter((a) => a.sectionIndex === si),
  }));

  const correctCount = (attempt.answers || []).filter((a) => a.isCorrect === true).length;
  const incorrectCount = (attempt.answers || []).filter((a) => a.isCorrect === false).length;
  const skippedCount = (attempt.test?.sections || [])
    .reduce((s, sec) => s + sec.questions.length, 0) - attempt.answers.length;

  return (
    <DashboardLayout>
      {/* Score hero */}
      <div className="card p-8 mb-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: `radial-gradient(ellipse at 50% 0%, ${scoreColor}12, transparent 70%)` }} />

        <div className="relative z-10">
          <p className="text-[13px] font-semibold text-[#9B9C9E] uppercase tracking-widest mb-3">
            {attempt.test?.title}
          </p>

          {/* Score ring */}
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 mb-4 relative"
               style={{ borderColor: scoreColor }}>
            <div>
              <p className="font-display text-[36px] font-extrabold leading-none" style={{ fontWeight: 800, color: scoreColor }}>
                {pct}%
              </p>
              <p className="text-[11px] text-[#9B9C9E] text-center">Score</p>
            </div>
          </div>

          <p className="font-display text-[20px] font-bold text-[#F5F4F2] mb-6" style={{ fontWeight: 700 }}>
            {scoreLabel}
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto">
            {[
              { icon: CheckCircle2, label: "Correct",   value: correctCount,   color: "#22c55e" },
              { icon: XCircle,      label: "Incorrect", value: incorrectCount, color: "#ef4444" },
              { icon: MinusCircle,  label: "Skipped",   value: Math.max(0, skippedCount), color: "#9B9C9E" },
              { icon: Clock,        label: "Time",       value: formatTime(attempt.timeTakenSeconds), color: "#FE7F2D" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-white/4 rounded-2xl p-4">
                <Icon size={18} className="mx-auto mb-2" style={{ color }} />
                <p className="font-display text-[20px] font-bold text-[#F5F4F2]" style={{ fontWeight: 700, color }}>
                  {value}
                </p>
                <p className="text-[11px] text-[#9B9C9E]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section scores */}
      {attempt.sectionScores?.length > 0 && (
        <div className="card p-6 mb-6">
          <h2 className="font-display text-[16px] font-bold text-[#F5F4F2] mb-4" style={{ fontWeight: 700 }}>
            Section Breakdown
          </h2>
          <div className="flex flex-col gap-3">
            {attempt.sectionScores.map((sec) => (
              <div key={sec.sectionIndex}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[13px] font-semibold text-[#F5F4F2]">{sec.sectionTitle}</p>
                  <p className="text-[13px] font-bold" style={{
                    color: sec.percentageScore >= 80 ? "#22c55e" : sec.percentageScore >= 60 ? "#eab308" : "#ef4444"
                  }}>
                    {sec.correctCount}/{sec.totalCount} · {sec.percentageScore}%
                  </p>
                </div>
                <div className="bg-white/5 rounded-full h-2 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                       style={{
                         width: `${sec.percentageScore}%`,
                         background: sec.percentageScore >= 80 ? "#22c55e" : sec.percentageScore >= 60 ? "#eab308" : "#ef4444",
                       }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section tabs */}
      {sectionAnswers.length > 1 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {sectionAnswers.map((sec, i) => (
            <button key={i} onClick={() => setActiveSection(i)}
                    className={`px-4 py-2 rounded-full text-[12px] font-semibold border transition-all
                      ${activeSection === i
                        ? "bg-[#FE7F2D] border-[#FE7F2D] text-[#1a1011]"
                        : "border-white/7 text-[#9B9C9E] bg-[#28292A] hover:border-[#FE7F2D]/30"}`}>
              {sec.title}
            </button>
          ))}
        </div>
      )}

      {/* Question review */}
      <div className="card p-6 mb-6">
        <h2 className="font-display text-[16px] font-bold text-[#F5F4F2] mb-5" style={{ fontWeight: 700 }}>
          Question Review — {sectionAnswers[activeSection]?.title}
        </h2>

        <div className="flex flex-col gap-3">
          {(sectionAnswers[activeSection]?.questions || []).map((q, qi) => {
            const answerEntry = attempt.answers?.find(
              (a) => a.question?._id === q._id || a.question === q._id
            );
            const isCorrect = answerEntry?.isCorrect;
            const isOpen = expandedQ === qi;

            return (
              <div key={q._id || qi} className={`rounded-2xl border transition-all duration-200 overflow-hidden
                ${isCorrect === true  ? "border-green-500/20 bg-green-500/4"
                : isCorrect === false ? "border-red-500/20 bg-red-500/4"
                : "border-white/7 bg-white/2"}`}>

                {/* Question header */}
                <button
                  onClick={() => setExpandedQ(isOpen ? null : qi)}
                  className="w-full flex items-start gap-4 p-4 text-left"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {isCorrect === true  && <CheckCircle2 size={18} className="text-green-400" />}
                    {isCorrect === false && <XCircle      size={18} className="text-red-400"   />}
                    {isCorrect === null  && <MinusCircle  size={18} className="text-[#9B9C9E]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#9B9C9E] mb-1">Q{qi + 1}</p>
                    <p className="text-[14px] text-[#F5F4F2] line-clamp-2 leading-relaxed">
                      {q.questionText}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-[#5E5F61]">
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {/* Expanded detail */}
                {isOpen && (
                  <div className="px-4 pb-5 flex flex-col gap-4 border-t border-white/5 pt-4">
                    {/* Passage snippet */}
                    {q.passage?.text && (
                      <div className="bg-[#28292A] rounded-xl p-4 text-[13px] text-[#9B9C9E] leading-relaxed line-clamp-4">
                        {q.passage.text}
                      </div>
                    )}

                    {/* Options */}
                    {q.options?.length > 0 && (
                      <div className="flex flex-col gap-2">
                        {q.options.map((opt) => {
                          const isGiven   = String(answerEntry?.givenAnswer) === opt.id;
                          const isCorrectOpt = String(q.correctAnswer) === opt.id
                            || (Array.isArray(q.correctAnswer) && q.correctAnswer.includes(opt.id));

                          return (
                            <div key={opt.id}
                                 className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] border transition-all
                                   ${isCorrectOpt ? "bg-green-500/10 border-green-500/30 text-green-300"
                                   : isGiven      ? "bg-red-500/10 border-red-500/30 text-red-300"
                                   : "bg-white/3 border-white/5 text-[#9B9C9E]"}`}>
                              <span className={`w-6 h-6 rounded-lg text-[11px] font-bold flex items-center justify-center flex-shrink-0
                                ${isCorrectOpt ? "bg-green-500/20 text-green-300"
                                : isGiven      ? "bg-red-500/20 text-red-300"
                                : "bg-white/5"}`}>
                                {opt.id}
                              </span>
                              <span>{opt.text}</span>
                              {isCorrectOpt && <CheckCircle2 size={13} className="ml-auto text-green-400 flex-shrink-0" />}
                              {isGiven && !isCorrectOpt && <XCircle size={13} className="ml-auto text-red-400 flex-shrink-0" />}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Fill blank answer */}
                    {q.type === "fill_blank" && (
                      <div className="flex flex-col gap-2 text-[13px]">
                        <div className="flex items-center gap-2">
                          <span className="text-[#9B9C9E]">Your answer:</span>
                          <span className={isCorrect ? "text-green-300 font-semibold" : "text-red-300 font-semibold"}>
                            {answerEntry?.givenAnswer || "—"}
                          </span>
                        </div>
                        {!isCorrect && (
                          <div className="flex items-center gap-2">
                            <span className="text-[#9B9C9E]">Correct answer:</span>
                            <span className="text-green-300 font-semibold">
                              {Array.isArray(q.correctAnswer) ? q.correctAnswer[0] : q.correctAnswer}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Explanation */}
                    {q.explanation && (
                      <div className="bg-[#FE7F2D]/6 border border-[#FE7F2D]/15 rounded-xl p-4">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#FE7F2D] mb-1.5">Explanation</p>
                        <p className="text-[13px] text-[#9B9C9E] leading-relaxed">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <Link to={`/dashboard/tests/${attempt.test?.slug}`} className="btn-primary">
          <RotateCcw size={15} /> Retake Test
        </Link>
        <Link to="/dashboard/tests" className="btn-ghost">
          <BookOpen size={15} /> Browse More Tests
        </Link>
        <Link to="/dashboard" className="btn-ghost">
          <Home size={15} /> Dashboard
        </Link>
      </div>
    </DashboardLayout>
  );
}
