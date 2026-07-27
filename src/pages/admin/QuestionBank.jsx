import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const QUESTIONS_STORAGE_KEY = "fenixrise_questions";
const SUBJECT_OPTIONS = [
  { value: "sat-math", label: "SAT Math" },
  { value: "sat-ebrw", label: "SAT EBRW" },
  { value: "ielts", label: "IELTS" },
];

const TOPIC_OPTIONS = {
  "sat-math": [
    "Algebra",
    "Advanced Math",
    "Problem Solving",
    "Geometry",
    "Statistics",
    "Trigonometry",
  ],
  "sat-ebrw": [
    "Reading Comprehension",
    "Grammar & Usage",
    "Rhetoric",
    "Argument Analysis",
    "Vocabulary in Context",
  ],
  "ielts": [
    "Listening",
    "Reading",
    "Writing",
    "Speaking",
    "Vocabulary",
  ],
};

const DIFFICULTY_OPTIONS = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const initialFormState = {
  question: "",
  options: ["", "", "", ""],
  correctAnswer: 0,
  explanation: "",
  subject: "sat-math",
  topic: TOPIC_OPTIONS["sat-math"][0],
  difficulty: "medium",
  tags: "",
};

function readLocalQuestions() {
  try {
    const parsed = JSON.parse(localStorage.getItem(QUESTIONS_STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocalQuestions(questions) {
  localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(questions));
}

function validateQuestion(formData) {
  const errors = {};
  if (!formData.question.trim()) errors.question = "Question text is required.";
  if (!formData.topic.trim()) errors.topic = "Choose a topic.";

  const filledOptions = formData.options.map((option) => option.trim()).filter(Boolean);
  if (filledOptions.length < 2) {
    errors.options = "Add at least two answer choices.";
  }

  if (formData.correctAnswer < 0 || formData.correctAnswer >= formData.options.length) {
    errors.correctAnswer = "Select a valid correct answer.";
  }

  if (formData.options[formData.correctAnswer]?.trim() === "") {
    errors.correctAnswer = "The correct answer must have a value.";
  }

  return errors;
}

export default function QuestionBank() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState({
    subject: "all",
    difficulty: "all",
    topic: "all",
  });
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    setQuestions(readLocalQuestions());
    setLoading(false);
  }, []);

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validateQuestion(formData);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatusMessage("Please complete the highlighted fields before saving.");
      return;
    }

    const normalizedOptions = formData.options.map((option) => option.trim()).filter(Boolean);
    const nextQuestion = {
      id: editingId || String(Date.now()),
      question: formData.question.trim(),
      options: normalizedOptions,
      correctAnswer: formData.correctAnswer,
      explanation: formData.explanation.trim(),
      subject: formData.subject,
      topic: formData.topic.trim(),
      difficulty: formData.difficulty,
      tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      createdAt: editingId ? questions.find((question) => question.id === editingId)?.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const nextQuestions = editingId
      ? questions.map((question) => (question.id === editingId ? nextQuestion : question))
      : [nextQuestion, ...questions];

    setQuestions(nextQuestions);
    saveLocalQuestions(nextQuestions);
    setStatusMessage(editingId ? "Question updated successfully." : "Question added successfully.");
    resetForm();
  };

  const handleEdit = (question) => {
    setFormData({
      question: question.question,
      options: [...question.options, "", "", "", ""].slice(0, 4),
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      subject: question.subject,
      topic: question.topic,
      difficulty: question.difficulty,
      tags: question.tags.join(", "),
    });
    setEditingId(question.id);
    setErrors({});
    setStatusMessage("Editing existing question. Update the details and save.");
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this question from your local bank?")) return;

    const filtered = questions.filter((question) => question.id !== id);
    setQuestions(filtered);
    saveLocalQuestions(filtered);
    if (editingId === id) resetForm();
    setStatusMessage("Question removed.");
  };

  const filteredQuestions = questions.filter((question) => {
    if (filter.subject !== "all" && question.subject !== filter.subject) return false;
    if (filter.difficulty !== "all" && question.difficulty !== filter.difficulty) return false;
    if (filter.topic !== "all" && question.topic !== filter.topic) return false;
    return true;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ color: "var(--text-muted)" }}>Loading questions...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
          <div>
            <h1 className="font-display" style={{ margin: 0, color: "var(--text-primary)", fontSize: 28 }}>
              Question Bank
            </h1>
            <p style={{ color: "var(--text-secondary)", marginTop: 6 }}>
              Add, edit, and organize questions for SAT Math, SAT EBRW, or IELTS prep.
            </p>
          </div>
          <button
            type="button"
            onClick={resetForm}
            className="btn-ghost"
            style={{ padding: "10px 14px" }}
          >
            Clear form
          </button>
        </div>

        {statusMessage && (
          <div style={{ marginBottom: 16, padding: "10px 12px", borderRadius: 12, background: "rgba(254,127,45,0.10)", color: "var(--text-primary)", border: "1px solid rgba(254,127,45,0.20)" }}>
            {statusMessage}
          </div>
        )}

        <div style={{ display: "grid", gap: 24, gridTemplateColumns: "minmax(300px, 430px) 1fr" }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--glass-border)", borderRadius: 18, padding: 20 }}>
            <h2 className="font-display" style={{ color: "var(--text-primary)", fontSize: 20, marginBottom: 8 }}>
              {editingId ? "Edit question" : "Add a new question"}
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 16 }}>
              Keep the form short and structured so it is easy to reuse in your study bank.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
              <div>
                <label style={{ display: "block", color: "var(--text-primary)", marginBottom: 6, fontWeight: 600 }}>Question</label>
                <textarea
                  value={formData.question}
                  onChange={(e) => setFormData((prev) => ({ ...prev, question: e.target.value }))}
                  placeholder="Type the question prompt"
                  rows={3}
                  className="form-input"
                  style={{ resize: "vertical" }}
                />
                {errors.question && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.question}</p>}
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                <div>
                  <label style={{ display: "block", color: "var(--text-primary)", marginBottom: 6, fontWeight: 600 }}>Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => {
                      const nextSubject = e.target.value;
                      const nextTopic = TOPIC_OPTIONS[nextSubject]?.[0] || "";
                      setFormData((prev) => ({ ...prev, subject: nextSubject, topic: nextTopic }));
                    }}
                    className="form-input"
                  >
                    {SUBJECT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", color: "var(--text-primary)", marginBottom: 6, fontWeight: 600 }}>Topic</label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData((prev) => ({ ...prev, topic: e.target.value }))}
                    className="form-input"
                  >
                    {TOPIC_OPTIONS[formData.subject]?.map((topic) => (
                      <option key={topic} value={topic}>{topic}</option>
                    ))}
                  </select>
                  {errors.topic && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.topic}</p>}
                </div>
              </div>

              <div>
                <label style={{ display: "block", color: "var(--text-primary)", marginBottom: 6, fontWeight: 600 }}>Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData((prev) => ({ ...prev, difficulty: e.target.value }))}
                  className="form-input"
                >
                  {DIFFICULTY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", color: "var(--text-primary)", marginBottom: 6, fontWeight: 600 }}>Choices</label>
                <div style={{ display: "grid", gap: 8 }}>
                  {formData.options.map((option, index) => (
                    <div key={`${index}-${option}`} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ width: 24, color: "var(--text-secondary)" }}>{String.fromCharCode(65 + index)}</span>
                      <input
                        value={option}
                        onChange={(e) => {
                          const nextOptions = [...formData.options];
                          nextOptions[index] = e.target.value;
                          setFormData((prev) => ({ ...prev, options: nextOptions }));
                        }}
                        placeholder={`Choice ${String.fromCharCode(65 + index)}`}
                        className="form-input"
                      />
                    </div>
                  ))}
                </div>
                {errors.options && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.options}</p>}
              </div>

              <div>
                <label style={{ display: "block", color: "var(--text-primary)", marginBottom: 6, fontWeight: 600 }}>Correct answer</label>
                <select
                  value={formData.correctAnswer}
                  onChange={(e) => setFormData((prev) => ({ ...prev, correctAnswer: Number(e.target.value) }))}
                  className="form-input"
                >
                  {formData.options.map((_, index) => (
                    <option key={index} value={index}>{String.fromCharCode(65 + index)}</option>
                  ))}
                </select>
                {errors.correctAnswer && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.correctAnswer}</p>}
              </div>

              <div>
                <label style={{ display: "block", color: "var(--text-primary)", marginBottom: 6, fontWeight: 600 }}>Explanation</label>
                <textarea
                  value={formData.explanation}
                  onChange={(e) => setFormData((prev) => ({ ...prev, explanation: e.target.value }))}
                  placeholder="Brief explanation for the answer"
                  rows={3}
                  className="form-input"
                  style={{ resize: "vertical" }}
                />
              </div>

              <div>
                <label style={{ display: "block", color: "var(--text-primary)", marginBottom: 6, fontWeight: 600 }}>Tags</label>
                <input
                  value={formData.tags}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                  placeholder="algebra, timed-practice"
                  className="form-input"
                />
              </div>

              <button type="submit" className="btn-primary justify-center">
                {editingId ? "Save question" : "Add question"}
              </button>
            </form>
          </div>

          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--glass-border)", borderRadius: 18, padding: 16 }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
                <div>
                  <label style={{ display: "block", color: "var(--text-primary)", marginBottom: 6, fontWeight: 600 }}>Subject</label>
                  <select
                    value={filter.subject}
                    onChange={(e) => setFilter((prev) => ({ ...prev, subject: e.target.value }))}
                    className="form-input !py-2"
                  >
                    <option value="all">All subjects</option>
                    {SUBJECT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", color: "var(--text-primary)", marginBottom: 6, fontWeight: 600 }}>Difficulty</label>
                  <select
                    value={filter.difficulty}
                    onChange={(e) => setFilter((prev) => ({ ...prev, difficulty: e.target.value }))}
                    className="form-input !py-2"
                  >
                    <option value="all">All levels</option>
                    {DIFFICULTY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", color: "var(--text-primary)", marginBottom: 6, fontWeight: 600 }}>Topic</label>
                  <select
                    value={filter.topic}
                    onChange={(e) => setFilter((prev) => ({ ...prev, topic: e.target.value }))}
                    className="form-input !py-2"
                  >
                    <option value="all">All topics</option>
                    {Object.values(TOPIC_OPTIONS).flat().map((topic) => (
                      <option key={topic} value={topic}>{topic}</option>
                    ))}
                  </select>
                </div>
              </div>

              <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
                Showing {filteredQuestions.length} of {questions.length} questions
              </p>
            </div>

            {filteredQuestions.length === 0 ? (
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--glass-border)", borderRadius: 18, padding: 20, textAlign: "center" }}>
                <p style={{ color: "var(--text-secondary)" }}>No questions yet. Add your first one to build the bank.</p>
              </div>
            ) : (
              filteredQuestions.map((question) => (
                <div key={question.id} style={{ background: "var(--bg-card)", border: "1px solid var(--glass-border)", borderRadius: 18, padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: "var(--text-primary)", fontWeight: 700, marginBottom: 6 }}>{question.question}</p>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                        <span className="dashboard-pill" style={{ background: "rgba(254,127,45,0.10)", color: "var(--pumpkin)" }}>
                          {SUBJECT_OPTIONS.find((option) => option.value === question.subject)?.label || question.subject}
                        </span>
                        <span className="dashboard-pill" style={{ background: "rgba(59,130,246,0.10)", color: "#3b82f6" }}>
                          {question.topic}
                        </span>
                        <span className="dashboard-pill" style={{ background: "rgba(34,197,94,0.10)", color: "#22c55e" }}>
                          {question.difficulty}
                        </span>
                      </div>
                      <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                        Correct answer: {String.fromCharCode(65 + question.correctAnswer)}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button type="button" onClick={() => handleEdit(question)} className="btn-ghost" style={{ padding: "8px 10px" }}>
                        Edit
                      </button>
                      <button type="button" onClick={() => handleDelete(question.id)} className="btn-ghost" style={{ padding: "8px 10px", color: "#ef4444" }}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
