import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Flag, ChevronLeft, ChevronRight, Clock, Send, AlertTriangle, Sun, Moon, Highlighter } from "lucide-react";
import { testAPI } from "../../lib/api";
import useTestStore from "../../stores/useTestStore";
import useThemeStore from "../../stores/useThemeStore";

export default function TestSession() {
  const { slug }     = useParams();
  const navigate     = useNavigate();
  const store        = useTestStore();
  const { theme, toggle } = useThemeStore();

  const [loadingTest, setLoadingTest]       = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [timeLeft, setTimeLeft]             = useState(null);
  const [showNav, setShowNav]               = useState(false);

  useEffect(() => {
    testAPI.get(slug)
      .then(async (res) => {
        const test = res.data.data;
        await store.startSession(test._id, test);
        if (test.totalTimeLimit) setTimeLeft(test.totalTimeLimit * 60);
      })
      .catch(() => navigate("/dashboard/tests"))
      .finally(() => setLoadingTest(false));
    return () => {};
  }, [slug]);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft]);

  const formatTime = (s) => {
    if (s === null) return "–";
    const m = Math.floor(s / 60), sec = s % 60;
    return `${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
  };

  const handleSubmit = async () => {
    const aid = store.attemptId;
    try { await store.submit(); navigate(`/dashboard/tests/review/${aid}`); }
    catch (e) { console.error(e); }
  };

  if (loadingTest || !store.test) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--test-bg)" }}>
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--pumpkin)", borderTopColor: "transparent" }}/>
    </div>
  );

  const { test, currentSection, currentQuestion, answers, flagged } = store;
  const section  = test.sections[currentSection];
  const question = section?.questions[currentQuestion];
  const qId      = question?._id;

  const allQs    = test.sections.flatMap((s, si) => s.questions.map((q, qi) => ({ q, si, qi })));
  const globalIdx = allQs.findIndex(x => x.si === currentSection && x.qi === currentQuestion) + 1;
  const totalQs   = allQs.length;
  const answered  = Object.keys(answers).length;
  const timeWarn  = timeLeft !== null && timeLeft < 300;

  const isSelected = (optId) => answers[qId] === optId;
  const isFlagged  = flagged.has(qId);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--test-bg)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── TOP BAR (matches screenshot) ── */}
      <header className="h-14 flex items-center justify-between px-6 border-b flex-shrink-0"
              style={{ background: "var(--test-header)", borderColor: "var(--border)" }}>
        {/* Left */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/dashboard/tests")}
                  className="flex items-center gap-1.5 text-[13px] font-semibold transition-colors"
                  style={{ color: "var(--text-secondary)" }}>
            <ChevronLeft size={16} /> Exit
          </button>

          <div className="h-5 w-px" style={{ background: "var(--border)" }}/>

          <span className="text-[13px] font-bold uppercase tracking-widest px-3 py-1 rounded"
                style={{ background: "var(--pumpkin-glow)", color: "var(--pumpkin)" }}>
            {test.examType} {section?.title}
          </span>
        </div>

        {/* Center — question counter */}
        <div className="flex items-center gap-3">
          <button onClick={() => store.prevQuestion()}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: "var(--test-q-unanswered)", color: "var(--text-secondary)" }}>
            <ChevronLeft size={14}/>
          </button>
          <span className="font-display text-[15px] font-bold min-w-[70px] text-center"
                style={{ color: "var(--text-primary)" }}>
            {globalIdx} / {totalQs}
          </span>
          <button onClick={() => store.nextQuestion()}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: "var(--test-q-unanswered)", color: "var(--text-secondary)" }}>
            <ChevronRight size={14}/>
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Timer */}
          {timeLeft !== null && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-bold"
                 style={{
                   background: timeWarn ? "rgba(239,68,68,0.12)" : "var(--test-q-unanswered)",
                   color: timeWarn ? "#ef4444" : "var(--text-primary)",
                 }}>
              <Clock size={13}/> {formatTime(timeLeft)}
            </div>
          )}

          {/* Theme toggle */}
          <button onClick={toggle} className="theme-toggle" title="Toggle theme">
            {theme === "dark" ? <Sun size={15}/> : <Moon size={15}/>}
          </button>

          {/* Question map toggle */}
          <button onClick={() => setShowNav(v => !v)}
                  className="text-[12px] font-semibold px-3 py-1.5 rounded-full border transition-all"
                  style={{ borderColor: "var(--border)", color: "var(--text-secondary)", background: "var(--test-q-unanswered)" }}>
            Question Map
          </button>

          {/* Submit */}
          <button onClick={() => setShowSubmitModal(true)} className="btn-primary !py-2 !px-5 !text-[12px]">
            <Send size={13}/> Submit
          </button>
        </div>
      </header>

      {/* ── QUESTION MAP DROPDOWN ── */}
      {showNav && (
        <div className="border-b px-6 py-4 flex flex-wrap gap-1.5"
             style={{ background: "var(--test-nav-bg)", borderColor: "var(--border)" }}>
          {allQs.map(({ q, si, qi }, idx) => {
            const id = q._id;
            const isAns  = answers[id] !== undefined;
            const isFlag = flagged.has(id);
            const isCur  = si === currentSection && qi === currentQuestion;
            return (
              <button key={id || idx} onClick={() => { store.goToQuestion(si, qi); setShowNav(false); }}
                      className="w-8 h-8 rounded-lg text-[12px] font-bold transition-all"
                      style={{
                        background: isCur ? "var(--test-q-current)" : isFlag ? "var(--test-q-flagged)" : isAns ? "var(--test-q-answered)" : "var(--test-q-unanswered)",
                        color: isCur ? "white" : isFlag ? "#92400e" : isAns ? "var(--pumpkin)" : "var(--text-muted)",
                      }}>
                {idx + 1}
              </button>
            );
          })}
          <div className="flex items-center gap-4 ml-4 text-[11px]" style={{ color: "var(--text-muted)" }}>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ background: "var(--test-q-answered)" }}/>Answered
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ background: "var(--test-q-flagged)" }}/>Flagged
            </span>
          </div>
        </div>
      )}

      {/* ── MAIN TWO-COLUMN LAYOUT ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* LEFT — Passage */}
        <div className="w-1/2 overflow-y-auto border-r p-8"
             style={{ borderColor: "var(--border)", background: "var(--test-bg)" }}>
          {question?.passage?.text ? (
            <>
              {section.instructions && (
                <p className="text-[12px] font-bold uppercase tracking-widest mb-4"
                   style={{ color: "var(--text-muted)" }}>
                  {section.instructions}
                </p>
              )}
              <div className="rounded-2xl p-6 leading-relaxed text-[14px]"
                   style={{
                     background: "var(--test-passage)",
                     color: "var(--text-primary)",
                     border: "1px solid var(--border)",
                     lineHeight: "1.8",
                   }}>
                {question.passage.text}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full" style={{ color: "var(--text-muted)" }}>
              <p className="text-[14px]">No passage for this question.</p>
            </div>
          )}
        </div>

        {/* RIGHT — Question + Options */}
        <div className="w-1/2 overflow-y-auto p-8 flex flex-col gap-6"
             style={{ background: "var(--test-bg)" }}>

          {/* Section label */}
          <p className="text-[11px] font-bold uppercase tracking-widest"
             style={{ color: "var(--pumpkin)" }}>
            {section?.title}
          </p>

          {/* Question text */}
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-[15px] font-semibold leading-relaxed flex-1"
                style={{ color: "var(--text-primary)", lineHeight: "1.7" }}>
              <span className="font-bold mr-2" style={{ color: "var(--pumpkin)" }}>{globalIdx}.</span>
              {question?.questionText}
            </h2>
            <button onClick={() => store.toggleFlag(qId)}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all"
                    style={{
                      borderColor: isFlagged ? "#f59e0b" : "var(--border)",
                      background:  isFlagged ? "rgba(245,158,11,0.10)" : "transparent",
                      color:       isFlagged ? "#f59e0b" : "var(--text-muted)",
                    }}>
              <Flag size={12}/> {isFlagged ? "Flagged" : "Flag"}
            </button>
          </div>

          {/* MCQ / True-False options */}
          {["mcq", "true_false"].includes(question?.type) && (
            <div className="flex flex-col gap-3">
              {question.options.map((opt) => {
                const sel = isSelected(opt.id);
                return (
                  <button key={opt.id}
                          onClick={() => store.saveAnswer(qId, opt.id, currentSection)}
                          className="flex items-start gap-4 p-4 rounded-2xl border text-left transition-all duration-150"
                          style={{
                            background:   sel ? "var(--test-option-selected-bg)"   : "var(--test-option)",
                            borderColor:  sel ? "var(--test-option-selected-border)" : "var(--test-option-border)",
                            color:        "var(--test-option-text)",
                          }}>
                    <span className="w-8 h-8 rounded-xl flex items-center justify-center text-[13px] font-bold flex-shrink-0 transition-all"
                          style={{
                            background: sel ? "var(--test-label-selected)" : "var(--test-label-bg)",
                            color:      sel ? "var(--test-label-selected-text)" : "var(--text-secondary)",
                          }}>
                      {opt.id}
                    </span>
                    <span className="text-[14px] leading-relaxed pt-1">{opt.text}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Fill blank */}
          {question?.type === "fill_blank" && (
            <input value={answers[qId] || ""}
                   onChange={e => store.saveAnswer(qId, e.target.value, currentSection)}
                   placeholder="Type your answer…"
                   className="w-full px-4 py-3 rounded-xl text-[14px] outline-none transition-colors"
                   style={{
                     background: "var(--test-option)",
                     border: "1px solid var(--test-option-border)",
                     color: "var(--test-option-text)",
                   }}/>
          )}

          {/* Essay */}
          {question?.type === "essay" && (
            <textarea rows={8} value={answers[qId] || ""}
                      onChange={e => store.saveAnswer(qId, e.target.value, currentSection)}
                      placeholder="Write your response here…"
                      className="w-full px-4 py-3 rounded-xl text-[14px] outline-none resize-none transition-colors"
                      style={{
                        background: "var(--test-option)",
                        border: "1px solid var(--test-option-border)",
                        color: "var(--test-option-text)",
                      }}/>
          )}

          {/* Next / Prev */}
          <div className="flex items-center justify-between pt-2 border-t mt-auto"
               style={{ borderColor: "var(--border)" }}>
            <button onClick={store.prevQuestion} className="btn-ghost !py-2.5 !px-5 !text-[13px]">
              <ChevronLeft size={15}/> Previous
            </button>
            <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
              {answered}/{totalQs} answered
            </span>
            <button onClick={store.nextQuestion} className="btn-primary !py-2.5 !px-5 !text-[13px]">
              Next <ChevronRight size={15}/>
            </button>
          </div>
        </div>
      </div>

      {/* ── SUBMIT MODAL ── */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.65)" }}>
          <div className="rounded-2xl p-7 max-w-sm w-full shadow-2xl border"
               style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
            <AlertTriangle size={30} className="mb-4" style={{ color: "var(--pumpkin)" }}/>
            <h3 className="font-display text-[20px] font-bold mb-2" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
              Submit Test?
            </h3>
            <p className="text-[14px] mb-2" style={{ color: "var(--text-secondary)" }}>
              You've answered <strong style={{ color: "var(--text-primary)" }}>{answered}</strong> of{" "}
              <strong style={{ color: "var(--text-primary)" }}>{totalQs}</strong> questions.
            </p>
            {answered < totalQs && (
              <p className="text-[13px] text-yellow-500 mb-3">
                ⚠️ {totalQs - answered} question(s) unanswered.
              </p>
            )}
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowSubmitModal(false)} className="btn-ghost flex-1 justify-center !py-3">
                Go Back
              </button>
              <button onClick={handleSubmit} disabled={store.isSubmitting}
                      className="btn-primary flex-1 justify-center !py-3 disabled:opacity-60">
                {store.isSubmitting
                  ? <span className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "white", borderTopColor: "transparent" }}/>
                  : "Submit Test"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
