import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const QUESTIONS_STORAGE_KEY = "fenixrise_questions";

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

export default function QuestionBank() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
    category: "sat",
    subcategory: "ebrw",
    difficulty: "medium",
    tags: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState({
    category: "all",
    difficulty: "all",
    subcategory: "all",
  });

  useEffect(() => {
    setQuestions(readLocalQuestions());
    setLoading(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.question.trim()) return;

    const newQuestion = {
      id: editingId || String(Date.now()),
      question: formData.question.trim(),
      options: formData.options.filter(opt => opt.trim()),
      correctAnswer: formData.correctAnswer,
      explanation: formData.explanation.trim(),
      category: formData.category,
      subcategory: formData.subcategory,
      difficulty: formData.difficulty,
      tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
      createdAt: editingId ? questions.find(q => q.id === editingId)?.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingId) {
      setQuestions(prev => prev.map(q => q.id === editingId ? newQuestion : q));
      setEditingId(null);
    } else {
      setQuestions(prev => [newQuestion, ...prev]);
    }

    saveLocalQuestions(editingId ? questions.map(q => q.id === editingId ? newQuestion : q) : [newQuestion, ...questions]);
    
    setFormData({
      question: "",
      options: ["", "", ""],
      correctAnswer: 0,
      explanation: "",
      category: "sat",
      subcategory: "ebrw",
      difficulty: "medium",
      tags: "",
    });
  };

  const handleEdit = (question) => {
    setFormData({
      question: question.question,
      options: [...question.options, "", "", ""].slice(0, 4),
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      category: question.category,
      subcategory: question.subcategory,
      difficulty: question.difficulty,
      tags: question.tags.join(", "),
    });
    setEditingId(question.id);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this question?")) {
      const filtered = questions.filter(q => q.id !== id);
      setQuestions(filtered);
      saveLocalQuestions(filtered);
      if (editingId === id) {
        setEditingId(null);
        setFormData({
          question: "",
          options: ["", "", ""],
          correctAnswer: 0,
          explanation: "",
          category: "sat",
          subcategory: "ebrw",
          difficulty: "medium",
          tags: "",
        });
      }
    }
  };

  const filteredQuestions = questions.filter(q => {
    if (filter.category !== "all" && q.category !== filter.category) return false;
    if (filter.difficulty !== "all" && q.difficulty !== filter.difficulty) return false;
    if (filter.subcategory !== "all" && q.subcategory !== filter.subcategory) return false;
    return true;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy": return "#10b981";
      case "medium": return "#f59e0b";
      case "hard": return "#ef4444";
      default: return "var(--text-muted)";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "sat": return "📚";
      case "ielts": return "🎧";
      default: return "📋";
    }
  };

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
        <h1 className="font-display" style={{ margin: 0, color: "var(--text-primary)", fontSize: 28 }}>
          ❓ Question Bank
        </h1>
        <p style={{ color: "var(--text-secondary)", marginTop: 6 }}>
          Create and manage SAT/IELTS questions with difficulty levels and categories
        </p>

        {/* Filters */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--glass-border)",
          borderRadius: 16,
          padding: 20,
          marginBottom: 24,
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
        }}>
          <div>
            <label style={{ display: "block", color: "var(--text-primary)", marginBottom: 8, fontWeight: 500 }}>
              Category
            </label>
            <select
              value={filter.category}
              onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
              style={{
                border: "1px solid var(--border)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 14,
                outline: "none",
              }}
            >
              <option value="all">All Categories</option>
              <option value="sat">SAT</option>
              <option value="ielts">IELTS</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", color: "var(--text-primary)", marginBottom: 8, fontWeight: 500 }}>
              Difficulty
            </label>
            <select
              value={filter.difficulty}
              onChange={(e) => setFilter(prev => ({ ...prev, difficulty: e.target.value }))}
              style={{
                border: "1px solid var(--border)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 14,
                outline: "none",
              }}
            >
              <option value="all">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", color: "var(--text-primary)", marginBottom: 8, fontWeight: 500 }}>
              Subcategory
            </label>
            <select
              value={filter.subcategory}
              onChange={(e) => setFilter(prev => ({ ...prev, subcategory: e.target.value }))}
              style={{
                border: "1px solid var(--border)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 14,
                outline: "none",
              }}
            >
              <option value="all">All Subcategories</option>
              <option value="ebrw">EBRW</option>
              <option value="math">Math</option>
              <option value="m1">Module 1</option>
              <option value="m2">Module 2</option>
              <option value="listening">Listening</option>
              <option value="reading">Reading</option>
              <option value="writing">Writing</option>
              <option value="speaking">Speaking</option>
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <span style={{ color: "var(--text-muted)", fontSize: 14 }}>
              Showing {filteredQuestions.length} of {questions.length} questions
            </span>
          </div>
        </div>

        {/* Question Form */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--glass-border)",
          borderRadius: 16,
          padding: 24,
          marginBottom: 24,
        }}>
          <h3 style={{ margin: "0 0 16px 0", color: "var(--text-primary)" }}>
            {editingId ? "Edit Question" : "Add New Question"}
          </h3>
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", color: "var(--text-primary)", marginBottom: 8, fontWeight: 500 }}>
                Question
              </label>
              <textarea
                value={formData.question}
                onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                placeholder="Enter your question here..."
                rows={3}
                style={{
                  width: "100%",
                  border: "1px solid var(--border)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  borderRadius: 10,
                  padding: "12px 16px",
                  fontSize: 16,
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: "block", color: "var(--text-primary)", marginBottom: 8, fontWeight: 500 }}>
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                style={{
                  width: "100%",
                  border: "1px solid var(--border)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  borderRadius: 10,
                  padding: "12px 16px",
                  fontSize: 16,
                  outline: "none",
                }}
              >
                <option value="sat">SAT</option>
                <option value="ielts">IELTS</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", color: "var(--text-primary)", marginBottom: 8, fontWeight: 500 }}>
                Subcategory
              </label>
              <select
                value={formData.subcategory}
                onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                style={{
                  width: "100%",
                  border: "1px solid var(--border)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  borderRadius: 10,
                  padding: "12px 16px",
                  fontSize: 16,
                  outline: "none",
                }}
              >
                <option value="ebrw">EBRW</option>
                <option value="math">Math</option>
                <option value="m1">Module 1</option>
                <option value="m2">Module 2</option>
                <option value="listening">Listening</option>
                <option value="reading">Reading</option>
                <option value="writing">Writing</option>
                <option value="speaking">Speaking</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", color: "var(--text-primary)", marginBottom: 8, fontWeight: 500 }}>
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                style={{
                  width: "100%",
                  border: "1px solid var(--border)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  borderRadius: 10,
                  padding: "12px 16px",
                  fontSize: 16,
                  outline: "none",
                }}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", color: "var(--text-primary)", marginBottom: 8, fontWeight: 500 }}>
                Correct Answer
              </label>
              <select
                value={formData.correctAnswer}
                onChange={(e) => setFormData(prev => ({ ...prev, correctAnswer: parseInt(e.target.value) }))}
                style={{
                  width: "100%",
                  border: "1px solid var(--border)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  borderRadius: 10,
                  padding: "12px 16px",
                  fontSize: 16,
                  outline: "none",
                }}
              >
                <option value={0}>Option A</option>
                <option value={1}>Option B</option>
                <option value={2}>Option C</option>
                <option value={3}>Option D</option>
              </select>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", color: "var(--text-primary)", marginBottom: 8, fontWeight: 500 }}>
                Answer Options
              </label>
              {formData.options.map((option, index) => (
                <div key={index} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                  <span style={{ color: "var(--text-primary)", fontWeight: 600, width: 60 }}>
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...formData.options];
                      newOptions[index] = e.target.value;
                      setFormData(prev => ({ ...prev, options: newOptions }));
                    }}
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    style={{
                      flex: 1,
                      border: "1px solid var(--border)",
                      background: "var(--bg-secondary)",
                      color: "var(--text-primary)",
                      borderRadius: 8,
                      padding: "10px 12px",
                      fontSize: 14,
                      outline: "none",
                    }}
                  />
                </div>
              ))}
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", color: "var(--text-primary)", marginBottom: 8, fontWeight: 500 }}>
                Explanation
              </label>
              <textarea
                value={formData.explanation}
                onChange={(e) => setFormData(prev => ({ ...prev, explanation: e.target.value }))}
                placeholder="Explain why this answer is correct..."
                rows={2}
                style={{
                  width: "100%",
                  border: "1px solid var(--border)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  borderRadius: 10,
                  padding: "12px 16px",
                  fontSize: 16,
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", color: "var(--text-primary)", marginBottom: 8, fontWeight: 500 }}>
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="algebra, geometry, grammar..."
                style={{
                  width: "100%",
                  border: "1px solid var(--border)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  borderRadius: 10,
                  padding: "12px 16px",
                  fontSize: 16,
                  outline: "none",
                }}
              />
            </div>

            <div style={{ gridColumn: "1 / -1", display: "flex", gap: 12, justifyContent: "flex-end" }}>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      question: "",
                      options: ["", "", ""],
                      correctAnswer: 0,
                      explanation: "",
                      category: "sat",
                      subcategory: "ebrw",
                      difficulty: "medium",
                      tags: "",
                    });
                  }}
                  style={{
                    border: "1px solid var(--border)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-secondary)",
                    borderRadius: 10,
                    padding: "12px 24px",
                    cursor: "pointer",
                    fontSize: 16,
                  }}
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                style={{
                  border: "1px solid var(--glass-border)",
                  background: "var(--pumpkin-soft)",
                  color: "var(--text-primary)",
                  borderRadius: 10,
                  padding: "12px 24px",
                  cursor: "pointer",
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                {editingId ? "Update Question" : "Add Question"}
              </button>
            </div>
          </form>
        </div>

        {/* Questions List */}
        <div style={{ display: "grid", gap: 16 }}>
          {filteredQuestions.length === 0 ? (
            <div style={{
              background: "var(--bg-card)",
              border: "1px solid var(--glass-border)",
              borderRadius: 16,
              padding: 40,
              textAlign: "center",
            }}>
              <p style={{ color: "var(--text-muted)", margin: 0 }}>No questions found.</p>
            </div>
          ) : (
            filteredQuestions.map((question) => (
              <div
                key={question.id}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: 16,
                  padding: 20,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                      <span style={{ fontSize: 20 }}>{getCategoryIcon(question.category)}</span>
                      <h3 style={{ margin: 0, color: "var(--text-primary)", fontSize: 18 }}>
                        {question.question}
                      </h3>
                    </div>
                    
                    <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                      <span
                        style={{
                          background: "var(--pumpkin-soft)",
                          color: "var(--text-primary)",
                          borderRadius: 6,
                          padding: "4px 12px",
                          fontSize: 12,
                          fontWeight: 600,
                          textTransform: "uppercase",
                        }}
                      >
                        {question.category}
                      </span>
                      <span
                        style={{
                          background: "var(--bg-secondary)",
                          color: getDifficultyColor(question.difficulty),
                          borderRadius: 6,
                          padding: "4px 12px",
                          fontSize: 12,
                          fontWeight: 600,
                          textTransform: "uppercase",
                        }}
                      >
                        {question.difficulty}
                      </span>
                      <span
                        style={{
                          background: "var(--bg-secondary)",
                          color: "var(--text-secondary)",
                          borderRadius: 6,
                          padding: "4px 12px",
                          fontSize: 12,
                          fontWeight: 600,
                          textTransform: "uppercase",
                        }}
                      >
                        {question.subcategory}
                      </span>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      {question.options.map((option, index) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            gap: 8,
                            marginBottom: 8,
                            padding: "8px 12px",
                            background: index === question.correctAnswer ? "var(--pumpkin-soft)" : "var(--bg-secondary)",
                            borderRadius: 8,
                            border: index === question.correctAnswer ? "1px solid var(--pumpkin)" : "1px solid var(--border)",
                          }}
                        >
                          <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                            {String.fromCharCode(65 + index)}.
                          </span>
                          <span style={{ color: "var(--text-primary)" }}>
                            {option}
                          </span>
                          {index === question.correctAnswer && (
                            <span style={{ color: "var(--pumpkin)", fontWeight: 600 }}>✓</span>
                          )}
                        </div>
                      ))}
                    </div>

                    {question.explanation && (
                      <div style={{
                        background: "var(--bg-secondary)",
                        borderRadius: 8,
                        padding: 12,
                        marginBottom: 12,
                      }}>
                        <strong style={{ color: "var(--text-primary)" }}>Explanation: </strong>
                        <span style={{ color: "var(--text-secondary)" }}>{question.explanation}</span>
                      </div>
                    )}

                    {question.tags.length > 0 && (
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {question.tags.map((tag, index) => (
                          <span
                            key={index}
                            style={{
                              background: "var(--glass-bg)",
                              color: "var(--text-muted)",
                              borderRadius: 4,
                              padding: "2px 8px",
                              fontSize: 11,
                            }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <button
                      onClick={() => handleEdit(question)}
                      style={{
                        border: "1px solid var(--border)",
                        background: "var(--bg-secondary)",
                        color: "var(--text-primary)",
                        borderRadius: 8,
                        padding: "8px 16px",
                        cursor: "pointer",
                        fontSize: 14,
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(question.id)}
                      style={{
                        border: "1px solid var(--border)",
                        background: "var(--bg-secondary)",
                        color: "#ef4444",
                        borderRadius: 8,
                        padding: "8px 16px",
                        cursor: "pointer",
                        fontSize: 14,
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
