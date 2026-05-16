import { useEffect, useState } from "react";
import {
  CheckCircle2, Circle, Target, Calendar, Trophy,
  ChevronRight, ChevronLeft, Flame, Clock, ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { roadmapAPI } from "../../lib/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { MDiv, MStagger, MItem, MH1, MP, MStat, MOrb, motion } from "../../components/MotionComponents";
import { useAnimateIn } from "../../hooks/useAnimateIn";

// Add glow animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes glow {
    0% { box-shadow: 0 0 5px rgba(254, 127, 45, 0.3); }
    50% { box-shadow: 0 0 20px rgba(254, 127, 45, 0.4); }
    100% { box-shadow: 0 0 5px rgba(254, 127, 45, 0.3); }
  }
  .animate-glow {
    animation: glow 2s ease-in-out infinite;
  }
`;
document.head.appendChild(style);

// ── Type metadata ─────────────────────────────────────────────────
const TYPE_META = {
  study:         { color:"#3b82f6", bg:"rgba(59,130,246,0.1)",  icon:"📚", label:"Study"        },
  practice_test: { color:"#FE7F2D", bg:"rgba(254,127,45,0.1)", icon:"📝", label:"Practice Test" },
  review:        { color:"#eab308", bg:"rgba(234,179,8,0.1)",   icon:"🔍", label:"Review"        },
  application:   { color:"#8b5cf6", bg:"rgba(139,92,246,0.1)", icon:"🎓", label:"Application"   },
  deadline:      { color:"#ef4444", bg:"rgba(239,68,68,0.1)",  icon:"⏰", label:"Deadline"      },
  milestone:     { color:"#22c55e", bg:"rgba(34,197,94,0.1)",  icon:"🏆", label:"Milestone"     },
};

// ── Build adaptive plan based on scores and time ───────────────────────
const buildAdaptivePlan = (exams, currentScores, targetScores, examDate, hoursPerDay) => {
  const selectedExams = Array.isArray(exams) ? exams : [exams];
  const today = new Date();
  const exam = new Date(examDate);
  const daysUntilExam = Math.max(1, Math.ceil((exam - today) / (1000 * 60 * 60 * 24)));
  
  const SAT_MODULES = [
    { id:"algebra", name:"Heart of Algebra", icon:"📐", topics:["Linear equations", "Inequalities", "Systems of equations"] },
    { id:"psda", name:"Problem Solving & Data Analysis", icon:"📊", topics:["Ratios", "Percentages", "Statistics", "Probability"] },
    { id:"passport", name:"Passport to Advanced Math", icon:"🚀", topics:["Quadratics", "Functions", "Polynomials"] },
    { id:"geo_trig", name:"Geometry & Trigonometry", icon:"📐", topics:["Circles", "Triangles", "Trigonometry"] },
    { id:"reading", name:"Reading & Writing", icon:"📖", topics:["Evidence", "Inference", "Vocabulary", "Grammar"] },
  ];

  const IELTS_MODULES = [
    { id:"listening", name:"Listening", icon:"🎧", topics:["Section 1-4", "Note completion", "Multiple choice"] },
    { id:"reading", name:"Reading", icon:"📖", topics:["True/False/NG", "Matching headings", "Summary completion"] },
    { id:"writing", name:"Writing", icon:"✍️", topics:["Task 1: Graphs", "Task 2: Essays", "Cohesion"] },
    { id:"speaking", name:"Speaking", icon:"🎤", topics:["Part 1: Intro", "Part 2: Long turn", "Part 3: Discussion"] },
  ];

  const calculateScoreGap = (current, target) => {
    const curr = Number(current) || 0;
    const tgt = Number(target) || 0;
    return tgt - curr;
  };

  const getPriorityModules = (exam, currentScore, targetScore) => {
    const gap = calculateScoreGap(currentScore, targetScore);
    const modules = exam === "SAT" ? SAT_MODULES : IELTS_MODULES;
    
    // If gap is large (>200 for SAT, >2 for IELTS), prioritize all modules
    if ((exam === "SAT" && gap > 200) || (exam === "IELTS" && gap > 2)) {
      return modules;
    }
    
    // If gap is moderate, focus on hardest modules
    return modules.slice(0, 3);
  };

  const generateDailyPlan = (day, exam, modules, isPracticeTestDay) => {
    if (isPracticeTestDay) {
      return {
        day,
        title: `Full ${exam} Practice Test`,
        type: "practice_test",
        description: "Complete full test under timed conditions. Review mistakes immediately after.",
        modules: modules.map(m => m.name).join(", "),
        questions: exam === "SAT" ? "154 questions" : "4 sections",
        duration: exam === "SAT" ? "3h 15m" : "2h 45m",
      };
    }

    const module = modules[day % modules.length];
    return {
      day,
      title: `${module.name} - ${module.topics[day % module.topics.length]}`,
      type: "study",
      description: `Focus on ${module.topics[day % module.topics.length]}. Complete practice questions and review key concepts.`,
      modules: module.name,
      questions: `${Math.floor(hoursPerDay * 10)} questions`,
      duration: `${hoursPerDay}h`,
    };
  };

  const plan = [];
  const practiceTestInterval = Math.max(5, Math.floor(daysUntilExam / 6)); // Practice test every 5-7 days

  for (let i = 0; i < daysUntilExam; i++) {
    const dayNum = i + 1;
    const isPracticeTestDay = (dayNum % practiceTestInterval === 0) || dayNum === daysUntilExam;
    
    if (selectedExams.includes("SAT") && selectedExams.includes("IELTS")) {
      const satPriority = getPriorityModules("SAT", currentScores.SAT, targetScores.SAT);
      const ieltsPriority = getPriorityModules("IELTS", currentScores.IELTS, targetScores.IELTS);
      
      // Alternate between SAT and IELTS
      if (i % 2 === 0) {
        plan.push(generateDailyPlan(dayNum, "SAT", satPriority, isPracticeTestDay && i % (practiceTestInterval * 2) === 0));
      } else {
        plan.push(generateDailyPlan(dayNum, "IELTS", ieltsPriority, isPracticeTestDay && (i + 1) % (practiceTestInterval * 2) === 0));
      }
    } else if (selectedExams.includes("SAT")) {
      const priority = getPriorityModules("SAT", currentScores.SAT, targetScores.SAT);
      plan.push(generateDailyPlan(dayNum, "SAT", priority, isPracticeTestDay));
    } else if (selectedExams.includes("IELTS")) {
      const priority = getPriorityModules("IELTS", currentScores.IELTS, targetScores.IELTS);
      plan.push(generateDailyPlan(dayNum, "IELTS", priority, isPracticeTestDay));
    }
  }

  return plan;
};

// ── Multi-step setup wizard ───────────────────────────────────────
const STEPS = [
  { title: "Choose Your Exam", subtitle: "Select which test(s) you're preparing for" },
  { title: "Target Score", subtitle: "What score do you want to achieve?" },
  { title: "Current Score", subtitle: "What's your current score (if you've taken it)?" },
  { title: "Exam Date", subtitle: "When are you planning to take the test?" },
  { title: "Study Hours", subtitle: "How many hours per day can you study?" },
  { title: "Review & Generate", subtitle: "Confirm your choices and create your roadmap" },
];

function SetupWizard({ onComplete = () => {} }) {
  const [step, setStep]     = useState(0);
  const [form, setForm]     = useState({
    exams: ["SAT"],
    targetScore: { SAT:"", IELTS:"" },
    currentScore:{ SAT:"", IELTS:"" },
    examDates: { SAT:"", IELTS:"", other:{ name:"", date:"" } },
    hoursPerDay:2,
  });
  const [saving, setSaving] = useState(false);
  const [ref, vis]          = useAnimateIn(0.01);

  const SAT_SCORE_OPTIONS  = [400,500,600,700,800,900,1000,1100,1200,1300,1400,1500,1600];
  const IELTS_SCORE_OPTIONS= [0,0.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9];
  const HOURS_OPTIONS      = [0.5,1,1.5,2,2.5,3,4];
  
  const isValidSATScore = val => {
    const num = Number(val);
    return !isNaN(num) && num >= 400 && num <= 1600 && num % 10 === 0;
  };
  
  const isValidIELTSBand = val => {
    const num = Number(val);
    if (isNaN(num) || num < 0 || num > 9) return false;
    const decimal = (num * 10) % 10;
    return decimal === 0 || decimal === 5;
  };

  const isScoreTypingAllowed = (exam, value) => {
    if (value === "") return true;
    if (exam === "SAT") {
      return /^[0-9]{0,4}$/.test(value);
    }
    if (exam === "IELTS") {
      return /^\d{0,1}(?:\.\d?)?$/.test(value);
    }
    return true;
  };

  const selectedExams = form.exams;
  const isSAT   = selectedExams.includes("SAT");
  const isIELTS = selectedExams.includes("IELTS");
  const scoreOptions = {
    SAT: [400,500,600,700,800,900,1000,1100,1200,1300,1400,1500,1600],
    IELTS: [4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9],
  };
  const scoreLabel = exam => exam === "SAT" ? "SAT Score" : "IELTS Band";
  const scorePlaceholder = exam => exam === "SAT" ? "e.g. 1100" : "e.g. 5.5";
  const formatDate = value => value ? new Date(value).toLocaleDateString() : "Not set";
  const calculateDaysUntil = (date) => {
    if (!date) return "Not set";
    const today = new Date();
    const exam = new Date(date);
    const days = Math.max(1, Math.ceil((exam - today) / (1000 * 60 * 60 * 24)));
    return `${days} days`;
  };

  const canNext = () => {
    if (step === 0) return selectedExams.length > 0;
    if (step === 1) {
      const allValid = selectedExams.every(exam => {
        const score = form.targetScore[exam];
        if (score === "") return false;
        const validator = exam === "SAT" ? isValidSATScore : isValidIELTSBand;
        return validator(score);
      });
      return allValid;
    }
    if (step === 2) {
      const allValid = selectedExams.every(exam => {
        const score = form.currentScore[exam];
        if (score === "") return true; // Allow blank for current score
        const validator = exam === "SAT" ? isValidSATScore : isValidIELTSBand;
        return validator(score);
      });
      return allValid;
    }
    if (step === 3) {
      if (isSAT && !form.examDates.SAT) return false;
      if (isIELTS && !form.examDates.IELTS) return false;
      return true;
    }
    if (step === 4) return true;
    return true;
  };

  const handleGenerate = async () => {
    if (saving || step !== STEPS.length - 1 || !canNext()) return;
    setSaving(true);
    try {
      const targetExam = selectedExams.length === 2 ? "Both" : selectedExams[0];
      const primaryExamDate = form.examDates.SAT || form.examDates.IELTS || form.examDates.other?.date || "";
      
      const targetScorePayload = selectedExams.length === 1
        ? Number(form.targetScore[selectedExams[0]]) || null
        : null;
      const currentScorePayload = selectedExams.length === 1
        ? Number(form.currentScore[selectedExams[0]]) || null
        : null;

      const today = new Date();
      const exam = new Date(primaryExamDate);
      const daysUntilExam = Math.max(1, Math.ceil((exam - today) / (1000 * 60 * 60 * 24)));

      await roadmapAPI.update({
        targetExam,
        targetScore: targetScorePayload,
        currentScore: currentScorePayload,
        examDates: form.examDates,
        totalDays: daysUntilExam,
        startDate: today.toISOString(),
        examDate: primaryExamDate,
        hoursPerDay: form.hoursPerDay,
      });
      localStorage.setItem("fenixrise_exam_dates", JSON.stringify({
        ...form.examDates,
        targetScore: form.targetScore,
        currentScore: form.currentScore,
        daysUntilExam,
        hoursPerDay: form.hoursPerDay,
      }));
      
      const plan = buildAdaptivePlan(selectedExams, form.currentScore, form.targetScore, primaryExamDate, form.hoursPerDay);
      for (const item of plan) {
        await roadmapAPI.addMilestone({
          day: item.day,
          week: Math.ceil(item.day / 7),
          title: item.title,
          type: item.type,
          description: item.description,
          modules: item.modules,
          questions: item.questions,
          duration: item.duration,
          order: item.day,
        });
      }
      onComplete();
    } catch (e) {
      console.error("Roadmap generate error:", e);
      const responseDetail = e?.response?.data ? JSON.stringify(e.response.data) : null;
      const message = e?.response?.data?.message || responseDetail || e.message || "Unable to generate your roadmap right now. Please try again.";
      window.alert(message);
    } finally {
      setSaving(false);
    }
  };

  const progress = ((step) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg">

        <div className="mb-8">
          <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider mb-3"
               style={{ color:"var(--text-muted)" }}>
            <span>Step {step+1} of {STEPS.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="rounded-full h-1.5 overflow-hidden" style={{ background:"var(--bg-secondary)" }}>
            <motion.div 
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ background:"linear-gradient(90deg,var(--pumpkin),#FFAD60)" }} />
          </div>
        </div>

        <div className="card p-8">
          <h2 className="font-display text-[26px] font-bold mb-1"
              style={{ fontWeight:700, color:"var(--text-primary)" }}>
            {STEPS[step].title}
          </h2>
          <p className="text-[14px] mb-8" style={{ color:"var(--text-secondary)" }}>
            {STEPS[step].subtitle}
          </p>

          {step === 0 && (
            <div className="flex flex-col gap-3">
              {[
                { val:"SAT",   emoji:"📐", desc:"US university entrance exam (400–1600)" },
                { val:"IELTS", emoji:"📖", desc:"English proficiency for UK/EU/AUS (0–9)" },
              ].map(({ val, emoji, desc }) => {
                const selected = selectedExams.includes(val);
                return (
                  <button key={val}
                          onClick={() => setForm(f => {
                            const has = f.exams.includes(val);
                            const nextExams = has
                              ? f.exams.length > 1 ? f.exams.filter(e => e !== val) : f.exams
                              : [...f.exams, val];
                            return { ...f, exams: nextExams };
                          })}
                          className="flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all"
                          style={{
                            borderColor: selected ? "var(--pumpkin)" : "var(--border)",
                            background:  selected ? "var(--pumpkin-soft)" : "var(--bg-secondary)",
                          }}>
                    <span className="text-3xl">{emoji}</span>
                    <div>
                      <p className="font-display text-[18px] font-bold" style={{ fontWeight:700, color:"var(--text-primary)" }}>{val}</p>
                      <p className="text-[13px]" style={{ color:"var(--text-secondary)" }}>{desc}</p>
                    </div>
                    {selected && (
                      <CheckCircle2 size={22} className="ml-auto" style={{ color:"var(--pumpkin)" }} />
                    )}
                  </button>
                );
              })}
              <p className="text-[12px] mt-2" style={{ color:"var(--text-muted)" }}>
                You can study SAT, IELTS, or both together. The roadmap will adapt to the selection.
              </p>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              {selectedExams.map(exam => {
                const currentTarget = form.targetScore[exam] || "";
                const validator = exam === "SAT" ? isValidSATScore : isValidIELTSBand;
                return (
                  <div key={exam}>
                    <p className="text-[12px] font-bold uppercase tracking-wider mb-3" style={{ color:"var(--text-muted)" }}>
                      Target {scoreLabel(exam)}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {scoreOptions[exam].map(s => (
                        <button key={s} onClick={() => setForm(f => ({
                          ...f,
                          targetScore: { ...f.targetScore, [exam]: String(s) },
                        }))}
                                className="px-4 py-2.5 rounded-xl text-[14px] font-bold border-2 transition-all"
                                style={{
                                  borderColor: currentTarget === String(s) ? "var(--pumpkin)" : "var(--border)",
                                  background:  currentTarget === String(s) ? "var(--pumpkin)" : "var(--bg-secondary)",
                                  color:       currentTarget === String(s) ? "#fff"           : "var(--text-secondary)",
                                }}>
                          {s}
                        </button>
                      ))}
                    </div>
                    <div>
                      <input type="text" className="form-input" placeholder={scorePlaceholder(exam)}
                             value={currentTarget}
                             onChange={e => {
                               const val = e.target.value;
                               if (isScoreTypingAllowed(exam, val)) {
                                 setForm(f => ({
                                   ...f,
                                   targetScore: { ...f.targetScore, [exam]: val },
                                 }));
                               }
                             }} />
                      {currentTarget && !validator(currentTarget) && (
                        <p className="text-[11px] mt-1" style={{ color:"#ef4444" }}>
                          {exam === "SAT" ? "SAT scores must be between 400–1600 in multiples of 10" : "IELTS bands must be between 0–9 in 0.5 increments"}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {selectedExams.map(exam => {
                const currentValue = form.currentScore[exam] || "";
                const validator = exam === "SAT" ? isValidSATScore : isValidIELTSBand;
                return (
                  <div key={exam}>
                    <p className="text-[12px] font-bold uppercase tracking-wider mb-3" style={{ color:"var(--text-muted)" }}>
                      Current {scoreLabel(exam)} (leave blank if you haven't taken it yet)
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {scoreOptions[exam].map(s => (
                        <button key={s} onClick={() => setForm(f => ({
                          ...f,
                          currentScore: { ...f.currentScore, [exam]: String(s) },
                        }))}
                                className="px-4 py-2.5 rounded-xl text-[14px] font-bold border-2 transition-all"
                                style={{
                                  borderColor: currentValue === String(s) ? "var(--pumpkin)" : "var(--border)",
                                  background:  currentValue === String(s) ? "var(--pumpkin)" : "var(--bg-secondary)",
                                  color:       currentValue === String(s) ? "#fff"           : "var(--text-secondary)",
                                }}>
                          {s}
                        </button>
                      ))}
                    </div>
                    <div>
                    <input type="text" className="form-input" placeholder={scorePlaceholder(exam)}
                           value={currentValue}
                           onChange={e => {
                             const val = e.target.value;
                             if (isScoreTypingAllowed(exam, val)) {
                               setForm(f => ({
                                 ...f,
                                 currentScore: { ...f.currentScore, [exam]: val },
                               }));
                             }
                           }} />
                      {currentValue && !validator(currentValue) && (
                        <p className="text-[11px] mt-1" style={{ color:"#ef4444" }}>
                          {exam === "SAT" ? "SAT scores must be between 400–1600 in multiples of 10" : "IELTS bands must be between 0–9 in 0.5 increments"}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <p className="text-[12px] font-bold uppercase tracking-wider mb-3" style={{ color:"var(--text-muted)" }}>
                Exam dates
              </p>
              {isSAT && (
                <div>
                  <p className="text-[12px] font-semibold mb-2" style={{ color:"var(--text-primary)" }}>SAT date</p>
                  <input type="date" className="form-input" value={form.examDates.SAT}
                         onChange={e => setForm(f => ({ ...f, examDates: { ...f.examDates, SAT: e.target.value } }))} />
                </div>
              )}
              {isIELTS && (
                <div>
                  <p className="text-[12px] font-semibold mb-2" style={{ color:"var(--text-primary)" }}>IELTS date</p>
                  <input type="date" className="form-input" value={form.examDates.IELTS}
                         onChange={e => setForm(f => ({ ...f, examDates: { ...f.examDates, IELTS: e.target.value } }))} />
                </div>
              )}
              <div>
                <p className="text-[12px] font-semibold mb-2" style={{ color:"var(--text-primary)" }}>Other test</p>
                <input type="text" className="form-input mb-3" placeholder="Test name (e.g. GRE, TOEFL)"
                       value={form.examDates.other.name}
                       onChange={e => setForm(f => ({
                         ...f,
                         examDates: { ...f.examDates, other: { ...f.examDates.other, name: e.target.value } },
                       }))} />
                <input type="date" className="form-input" value={form.examDates.other.date}
                       onChange={e => setForm(f => ({
                         ...f,
                         examDates: { ...f.examDates, other: { ...f.examDates.other, date: e.target.value } },
                       }))} />
              </div>
              <p className="text-[12px]" style={{ color:"var(--text-secondary)" }}>
                Add the exam date for each test so your roadmap and dashboard stay on schedule.
              </p>
            </div>
          )}

          {step === 4 && (
            <div>
              <p className="text-[12px] font-bold uppercase tracking-wider mb-4" style={{ color:"var(--text-muted)" }}>
                Hours per day
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {HOURS_OPTIONS.map(h => (
                  <button key={h} onClick={() => setForm(f=>({...f,hoursPerDay:h}))}
                          className="px-4 py-3 rounded-xl text-[15px] font-bold border-2 transition-all min-w-[72px]"
                          style={{
                            borderColor: form.hoursPerDay===h ? "var(--pumpkin)" : "var(--border)",
                            background:  form.hoursPerDay===h ? "var(--pumpkin)" : "var(--bg-secondary)",
                            color:       form.hoursPerDay===h ? "#fff"           : "var(--text-secondary)",
                          }}>
                    {h}h
                  </button>
                ))}
              </div>
              <div className="p-4 rounded-xl flex items-start gap-3"
                   style={{ background:"var(--bg-secondary)", border:"1px solid var(--border)" }}>
                <Clock size={18} className="flex-shrink-0 mt-0.5" style={{ color:"var(--pumpkin)" }} />
                <div>
                  <p className="text-[13px] font-semibold mb-1" style={{ color:"var(--text-primary)" }}>
                    {form.hoursPerDay >= 3 ? "Intensive" : form.hoursPerDay >= 2 ? "Balanced" : "Light"} schedule
                  </p>
                  <p className="text-[12px]" style={{ color:"var(--text-secondary)" }}>
                    {form.hoursPerDay >= 3
                      ? "Maximum improvement speed. Great for dedicated students."
                      : form.hoursPerDay >= 2
                      ? "Best balance of depth and sustainability."
                      : "Suitable for busy schedules. Progress may be slower."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="flex flex-col gap-4">
              {[
                ["Target Exam",   selectedExams.length === 2 ? "Both" : selectedExams[0]],
                ["Target Score",  selectedExams.map(exam => `${exam}: ${form.targetScore[exam] || "—"}`).join(" | ")],
                ["Current Score", selectedExams.map(exam => `${exam}: ${form.currentScore[exam] || "Not set"}`).join(" | ")],
                ["SAT Date",      formatDate(form.examDates.SAT)],
                ["IELTS Date",    formatDate(form.examDates.IELTS)],
                ["Other exam",    form.examDates.other.name ? `${form.examDates.other.name}: ${formatDate(form.examDates.other.date)}` : "Not set"],
                ["Daily Study",   `${form.hoursPerDay} hours/day`],
                ["Time to Exam",  calculateDaysUntil(form.examDates.SAT || form.examDates.IELTS || form.examDates.other?.date)],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between items-center py-3"
                     style={{ borderBottom:"1px solid var(--border)" }}>
                  <span className="text-[13px]" style={{ color:"var(--text-secondary)" }}>{label}</span>
                  <span className="text-[14px] font-bold" style={{ color:"var(--text-primary)" }}>{val}</span>
                </div>
              ))}
              <div className="mt-2 p-4 rounded-xl" style={{ background:"var(--pumpkin-soft)", border:"1px solid var(--pumpkin)" }}>
                <p className="text-[13px] font-semibold mb-1" style={{ color:"var(--text-primary)" }}>
                  🎯 Your {selectedExams.length === 2 ? "Both" : selectedExams[0]} roadmap will include:
                </p>
                <p className="text-[12px]" style={{ color:"var(--text-secondary)" }}>
                  Personalised daily plan · adaptive practice tests · smart module focus · progress tracking
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button onClick={() => setStep(s=>s-1)} className="btn-ghost !py-3 !px-5">
                <ChevronLeft size={16} /> Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button onClick={() => canNext() && setStep(s=>s+1)}
                      disabled={!canNext()}
                      className="btn-primary flex-1 justify-center !py-3 disabled:opacity-50">
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button type="button" onClick={handleGenerate} disabled={saving}
                      className="btn-primary flex-1 justify-center !py-3 disabled:opacity-60">
                {saving
                  ? <span className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                          style={{ borderColor:"white",borderTopColor:"transparent" }}/>
                  : "✨ Generate My Roadmap"}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Roadmap() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [viewMode, setViewMode] = useState("all"); // "all", "SAT", "IELTS"
  const [savedData, setSavedData] = useState(null);

  const load = () => {
    roadmapAPI.get()
      .then(r => setRoadmap(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
    
    // Load saved exam data
    try {
      const data = JSON.parse(localStorage.getItem("fenixrise_exam_dates") || "{}");
      setSavedData(data);
    } catch (error) {
      console.error("Error loading saved data:", error);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return (
    <DashboardLayout>
      <div className="flex justify-center pt-20">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
             style={{ borderColor:"var(--pumpkin)", borderTopColor:"transparent" }}/>
      </div>
    </DashboardLayout>
  );

  const hasRoadmap = roadmap && roadmap.totalMilestones > 0 && !creating;

  if (!hasRoadmap) return (
    <DashboardLayout>
      <SetupWizard onComplete={() => {
        setCreating(false);
        setLoading(true);
        load();
      }} />
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header with progress tracking */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="font-display text-[32px] font-bold mb-2">
                My Study Roadmap
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-[14px]" style={{ color:"var(--text-secondary)" }}>
                Personalised plan to achieve your target score
              </motion.p>
            </div>
            <motion.button 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCreating(true)} 
              className="btn-primary !py-2 !px-4 text-[13px] font-semibold">
              Create New Roadmap
            </motion.button>
          </div>

          {/* Exam Toggle Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-2 mb-6">
            <button
              onClick={() => setViewMode("all")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${
                viewMode === "all" 
                  ? "btn-primary" 
                  : "btn-ghost"
              }`}>
              All
            </button>
            <button
              onClick={() => setViewMode("SAT")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${
                viewMode === "SAT" 
                  ? "btn-primary" 
                  : "btn-ghost"
              }`}>
              SAT
            </button>
            <button
              onClick={() => setViewMode("IELTS")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${
                viewMode === "IELTS" 
                  ? "btn-primary" 
                  : "btn-ghost"
              }`}>
              IELTS
            </button>
          </motion.div>

          {/* Progress Cards */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Days Remaining Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="glass-card p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:"var(--pumpkin-soft)" }}>
                  <Calendar size={20} style={{ color:"var(--pumpkin)" }} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color:"var(--text-muted)" }}>
                    Days to Exam
                  </p>
                  <p className="text-[24px] font-bold" style={{ color:"var(--text-primary)" }}>
                    {viewMode === "IELTS" 
                      ? (savedData?.IELTS ? Math.max(1, Math.ceil((new Date(savedData.IELTS) - new Date()) / (1000 * 60 * 60 * 24))) : "—")
                      : viewMode === "SAT"
                        ? (savedData?.SAT ? Math.max(1, Math.ceil((new Date(savedData.SAT) - new Date()) / (1000 * 60 * 60 * 24))) : "—")
                        : (savedData?.SAT || savedData?.IELTS || roadmap.examDate 
                          ? Math.max(1, Math.ceil((new Date(savedData?.SAT || savedData?.IELTS || roadmap.examDate) - new Date()) / (1000 * 60 * 60 * 24))) 
                          : "—")}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                {savedData?.SAT && (
                  <p className="text-[12px]" style={{ color:"var(--text-secondary)" }}>
                    <span style={{ color:"var(--pumpkin)" }}>SAT:</span> {new Date(savedData.SAT).toLocaleDateString("en-US", { month:"short", day:"numeric" })} 
                    <span className="text-[11px] ml-1" style={{ color:"var(--text-muted)" }}>
                      ({Math.max(1, Math.ceil((new Date(savedData.SAT) - new Date()) / (1000 * 60 * 60 * 24)))} days)
                    </span>
                  </p>
                )}
                {savedData?.IELTS && (
                  <p className="text-[12px]" style={{ color:"var(--text-secondary)" }}>
                    <span style={{ color:"#3b82f6" }}>IELTS:</span> {new Date(savedData.IELTS).toLocaleDateString("en-US", { month:"short", day:"numeric" })}
                    <span className="text-[11px] ml-1" style={{ color:"var(--text-muted)" }}>
                      ({Math.max(1, Math.ceil((new Date(savedData.IELTS) - new Date()) / (1000 * 60 * 60 * 24)))} days)
                    </span>
                  </p>
                )}
                {!savedData?.SAT && !savedData?.IELTS && roadmap.examDate && (
                  <p className="text-[12px]" style={{ color:"var(--text-secondary)" }}>
                    {new Date(roadmap.examDate).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" })}
                  </p>
                )}
                {!savedData?.SAT && !savedData?.IELTS && !roadmap.examDate && (
                  <p className="text-[12px]" style={{ color:"var(--text-secondary)" }}>
                    No exam dates set
                  </p>
                )}
              </div>
            </motion.div>

            {/* Target Score Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
              className="glass-card p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:"rgba(34,197,94,0.1)" }}>
                  <Target size={20} style={{ color:"#22c55e" }} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color:"var(--text-muted)" }}>
                    Target Score
                  </p>
                  <p className="text-[24px] font-bold" style={{ color:"var(--text-primary)" }}>
                    {viewMode === "IELTS" ? (savedData?.targetScore?.IELTS || roadmap.targetScore || "—") : viewMode === "SAT" ? (savedData?.targetScore?.SAT || roadmap.targetScore || "—") : (savedData?.targetScore?.SAT || savedData?.targetScore?.IELTS || roadmap.targetScore || "—")}
                  </p>
                </div>
              </div>
              <p className="text-[12px]" style={{ color:"var(--text-secondary)" }}>
                {viewMode === "IELTS" ? `IELTS: ${savedData?.targetScore?.IELTS || "—"}` : viewMode === "SAT" ? `SAT: ${savedData?.targetScore?.SAT || "—"}` : savedData?.targetScore?.SAT ? `SAT: ${savedData.targetScore.SAT}` : savedData?.targetScore?.IELTS ? `IELTS: ${savedData.targetScore.IELTS}` : roadmap.targetExam || "—"}
              </p>
            </motion.div>

            {/* Current Progress Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
              className="glass-card p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:"rgba(59,130,246,0.1)" }}>
                  <Flame size={20} style={{ color:"#3b82f6" }} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color:"var(--text-muted)" }}>
                    Current Score
                  </p>
                  <p className="text-[24px] font-bold" style={{ color:"var(--text-primary)" }}>
                    {viewMode === "IELTS" ? (savedData?.currentScore?.IELTS || roadmap.currentScore || "—") : viewMode === "SAT" ? (savedData?.currentScore?.SAT || roadmap.currentScore || "—") : (savedData?.currentScore?.SAT || savedData?.currentScore?.IELTS || roadmap.currentScore || "—")}
                  </p>
                </div>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background:"var(--bg-secondary)" }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: viewMode === "IELTS" ? (savedData?.currentScore?.IELTS && savedData?.targetScore?.IELTS ? `${Math.min(100, (savedData.currentScore.IELTS / savedData.targetScore.IELTS) * 100)}%` : "0%") : viewMode === "SAT" ? (savedData?.currentScore?.SAT && savedData?.targetScore?.SAT ? `${Math.min(100, (savedData.currentScore.SAT / savedData.targetScore.SAT) * 100)}%` : "0%") : (savedData?.currentScore?.SAT && savedData?.targetScore?.SAT ? `${Math.min(100, (savedData.currentScore.SAT / savedData.targetScore.SAT) * 100)}%` : savedData?.currentScore?.IELTS && savedData?.targetScore?.IELTS ? `${Math.min(100, (savedData.currentScore.IELTS / savedData.targetScore.IELTS) * 100)}%` : "0%") }}
                  transition={{ duration: 1, delay: 1 }}
                  className="h-full rounded-full"
                  style={{ background:"linear-gradient(90deg,var(--pumpkin),#FFAD60)" }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Study Plan Timeline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-[20px] font-bold mb-1" style={{ color:"var(--text-primary)" }}>
                Your Study Plan
              </h2>
              <p className="text-[13px]" style={{ color:"var(--text-secondary)" }}>
                {roadmap.totalMilestones || 0} days • {savedData?.hoursPerDay || roadmap.hoursPerDay || 2}h daily study
              </p>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="space-y-3">
            {roadmap.milestones && roadmap.milestones.length > 0 ? (
              roadmap.milestones
                .filter(milestone => {
                  if (viewMode === "all") return true;
                  if (viewMode === "SAT") return milestone.title?.includes("SAT");
                  if (viewMode === "IELTS") return milestone.title?.includes("IELTS");
                  return true;
                })
                .slice(0, 20)
                .map((milestone, index) => {
                  const meta = TYPE_META[milestone.type] || TYPE_META.study;
                  return (
                    <motion.div 
                      key={milestone.id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + (index * 0.05) }}
                      whileHover={{ scale: 1.01 }}
                      className="flex items-start gap-4 p-4 rounded-xl transition-all"
                      style={{ background:"var(--bg-secondary)", border:"1px solid var(--border)" }}>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:meta.bg }}>
                        <span className="text-xl">{meta.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-1">
                          <div>
                            <p className="text-[12px] font-bold uppercase tracking-wider mb-1" style={{ color:meta.color }}>
                              Day {milestone.day} • {meta.label}
                            </p>
                            <h4 className="font-semibold text-[15px]" style={{ color:"var(--text-primary)" }}>
                              {milestone.title}
                            </h4>
                          </div>
                          {milestone.questions && (
                            <span className="dashboard-pill text-[11px] px-2 py-1 rounded-lg whitespace-nowrap" style={{ background:meta.bg, color:meta.color }}>
                              {milestone.questions}
                            </span>
                          )}
                        </div>
                        <p className="text-[13px]" style={{ color:"var(--text-secondary)" }}>
                          {milestone.description}
                        </p>
                        {milestone.duration && (
                          <p className="text-[11px] mt-2" style={{ color:"var(--text-muted)" }}>
                            ⏱️ {milestone.duration}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })
            ) : (
              <div className="text-center py-12">
                <p className="text-[14px]" style={{ color:"var(--text-secondary)" }}>
                  No study plan found. Create a new roadmap to get started.
                </p>
              </div>
            )}
          </motion.div>

          {roadmap.milestones && roadmap.milestones.length > 20 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="mt-4 text-center">
              <p className="text-[12px]" style={{ color:"var(--text-muted)" }}>
                +{roadmap.milestones.length - 20} more days in your plan
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
