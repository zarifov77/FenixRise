import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import ReactMarkdown from "react-markdown";

const DAILY_LIMITS = { free: 5, rise: 30, phoenix: 999 };
const USAGE_KEY = "fenixrise_advisor_usage";
const CHATS_KEY = "fenixrise_advisor_chats";
const ACTIVE_CHAT_KEY = "fenixrise_advisor_active_chat";

const WELCOME_MESSAGE = {
  role: "assistant",
  content:
    "Hi! I am your FenixRise AI Advisor.\n\nI can help you with:\n• SAT and IELTS preparation\n• University selection and admissions strategy\n• Scholarships and funding options\n• Personal statement planning\n• Study plans and timeline strategy\n\nAsk me anything to get started.",
};

const SUGGESTIONS = [
  "How do I improve my SAT Math score from 650 to 750?",
  "What IELTS score do I need for Oxford University?",
  "Write me a personal statement outline for Computer Science",
  "Compare MIT vs Stanford for engineering",
  "How many months do I need to prepare for IELTS 7.0?",
];

function getUsage() {
  try {
    const raw = JSON.parse(localStorage.getItem(USAGE_KEY) || "{}");
    const today = new Date().toDateString();
    if (raw.date !== today) return { date: today, count: 0 };
    return raw;
  } catch {
    return { date: new Date().toDateString(), count: 0 };
  }
}

function bumpUsage() {
  const usage = getUsage();
  const next = { ...usage, count: usage.count + 1 };
  localStorage.setItem(USAGE_KEY, JSON.stringify(next));
  return next.count;
}

function loadChats() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CHATS_KEY) || "[]");
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [{
        id: String(Date.now()),
        title: "New Chat",
        messages: [WELCOME_MESSAGE],
        updatedAt: Date.now(),
      }];
    }
    return parsed;
  } catch {
    return [{
      id: String(Date.now()),
      title: "New Chat",
      messages: [WELCOME_MESSAGE],
      updatedAt: Date.now(),
    }];
  }
}

function saveChats(chats) {
  localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
}

function Message({ msg, initials }) {
  const isUser = msg.role === "user";
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: 16, animation: "fadeUp 0.3s ease both" }}>
      {!isUser && (
        <div style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          flexShrink: 0,
          background: "var(--pumpkin-soft)",
          border: "1px solid var(--glass-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-primary)",
          marginRight: 10,
          marginTop: 2,
        }}>🤖</div>
      )}
      <div style={{
        maxWidth: "72%",
        background: isUser ? "var(--pumpkin-soft)" : "var(--bg-card)",
        color: "var(--text-primary)",
        borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        padding: "12px 16px",
        fontSize: 14,
        lineHeight: 1.7,
        border: "1px solid var(--glass-border)",
        whiteSpace: "pre-wrap",
      }}>
        <ReactMarkdown>
          {msg.content}
        </ReactMarkdown>
      </div>
      {isUser && (
        <div style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          flexShrink: 0,
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-primary)",
          marginLeft: 10,
          marginTop: 2,
          fontWeight: 700,
        }}>
          {initials}
        </div>
      )}
    </div>
  );
}

export default function Advisor() {
  const { user } = useAuthStore();
  const initials = user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U";
  const plan = user?.plan || "free";
  const limit = DAILY_LIMITS[plan] || 5;

  const [usage, setUsage] = useState(getUsage());
  const [chats, setChats] = useState(loadChats);
  const [activeChatId, setActiveChatId] = useState(() => localStorage.getItem(ACTIVE_CHAT_KEY));
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, chatId: null, chatTitle: "" });
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const remaining = Math.max(0, limit - usage.count);
  const isGeminiKeyMissing = !String(import.meta.env.VITE_GEMINI_KEY || "").trim();

  const activeChat = useMemo(
    () => chats.find(chat => chat.id === activeChatId) || chats[0],
    [chats, activeChatId]
  );

  useEffect(() => {
    if (!activeChat && chats.length) setActiveChatId(chats[0].id);
  }, [activeChat, chats]);

  useEffect(() => {
    if (activeChatId) localStorage.setItem(ACTIVE_CHAT_KEY, activeChatId);
  }, [activeChatId]);

  useEffect(() => {
    saveChats(chats);
  }, [chats]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages, loading]);

  const updateActiveChatMessages = (nextMessages, titleOverride) => {
    setChats(prev => prev.map(chat => {
      if (chat.id !== activeChat.id) return chat;
      const firstUser = nextMessages.find(m => m.role === "user");
      const nextTitle = titleOverride || (firstUser ? firstUser.content.slice(0, 32) : chat.title);
      return { ...chat, title: nextTitle || "New Chat", messages: nextMessages, updatedAt: Date.now() };
    }));
  };

  const createNewChat = () => {
    const next = {
      id: String(Date.now()),
      title: "New Chat",
      messages: [WELCOME_MESSAGE],
      updatedAt: Date.now(),
    };
    setChats(prev => [next, ...prev]);
    setActiveChatId(next.id);
    setInput("");
    setErrorText("");
  };

  const confirmDeleteChat = (id, title) => {
    setDeleteConfirm({ show: true, chatId: id, chatTitle: title || "New Chat" });
  };

  const deleteChat = (id) => {
    const filtered = chats.filter(chat => chat.id !== id);
    if (filtered.length === 0) {
      const fallback = {
        id: String(Date.now()),
        title: "New Chat",
        messages: [WELCOME_MESSAGE],
        updatedAt: Date.now(),
      };
      setChats([fallback]);
      setActiveChatId(fallback.id);
      return;
    }
    setChats(filtered);
    if (activeChatId === id) setActiveChatId(filtered[0].id);
  };

  const executeDelete = () => {
    if (deleteConfirm.chatId) {
      deleteChat(deleteConfirm.chatId);
      setDeleteConfirm({ show: false, chatId: null, chatTitle: "" });
    }
  };

  const sendMessage = async (text) => {
    if (!activeChat) return;
    const content = (text || input).trim();
    if (!content || loading) return;

    setErrorText("");
    if (remaining <= 0) {
      setErrorText("Daily prompt limit reached. Upgrade your plan or wait until midnight reset.");
      return;
    }

    const userMsg = { role: "user", content };
    const nextMessages = [...activeChat.messages, userMsg];
    updateActiveChatMessages(nextMessages);
    setInput("");
    setLoading(true);

    const newCount = bumpUsage();
    setUsage({ date: new Date().toDateString(), count: newCount });

    try {
      let reply = "";
      if (isGeminiKeyMissing) {
        throw new Error("API key not configured. Add VITE_GEMINI_KEY to your .env file and restart the dev server.");
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: "You are FenixRise AI Advisor — expert university admissions coach for students in Uzbekistan. Specialise in SAT, IELTS, university selection, scholarships, personal statements. Be specific and actionable. Reply in same language as student (Uzbek or English)." }]
            },
            contents: nextMessages
              .filter(m => m.role !== "system")
              .map(m => ({
                role: m.role === "assistant" ? "model" : "user",
                parts: [{ text: m.content }],
              })),
            generationConfig: { maxOutputTokens: 1000, temperature: 0.7 },
          }),
        }
      );

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, please try again.";

      updateActiveChatMessages([...nextMessages, { role: "assistant", content: reply }]);
    } catch (error) {
      const message = String(error?.message || "");
      // More specific quota error detection - only match actual quota/rate limit errors
      const isQuotaError = /quota|429|rate limit|resource.*exhausted|too many requests/i.test(message) &&
        !/invalid|unauthorized|permission|key/i.test(message);

      let errorContent;
      let errorTextContent;

      if (isQuotaError) {
        if (plan === "phoenix") {
          errorContent = "⚠️ AI service is temporarily experiencing high demand. Please wait a moment and try again.";
          errorTextContent = "AI service temporarily unavailable. Please try again.";
        } else {
          errorContent = "⚠️ AI is temporarily busy due to high demand. Please wait 1 minute and try again.";
          errorTextContent = "Daily prompt limit reached or service busy. Please try again later.";
        }
      } else {
        errorContent = "Something went wrong while contacting AI. Please try again in a moment.";
        errorTextContent = error?.message || "Request failed.";
      }

      updateActiveChatMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: errorContent,
        },
      ]);
      setErrorText(errorTextContent);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <DashboardLayout>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <div style={{ height: "calc(100vh - 130px)", display: "flex", gap: 20 }}>
        <div style={{ width: 280, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          {isGeminiKeyMissing && (
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--glass-border)", borderRadius: 12, padding: 10, color: "var(--text-secondary)", fontSize: 12 }}>
              API key not configured. Add VITE_GEMINI_KEY to your .env file and restart the dev server.
            </div>
          )}
          <div style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: 16, padding: 14 }}>
            <p style={{ color: "var(--text-primary)", margin: 0, fontWeight: 700 }}>Daily prompts</p>
            <p style={{ color: "var(--text-secondary)", margin: "4px 0 8px 0", fontSize: 12, textTransform: "capitalize" }}>{plan} plan</p>
            <div style={{ height: 6, borderRadius: 999, background: "var(--bg-secondary)", overflow: "hidden", marginBottom: 8 }}>
              <div style={{ height: "100%", width: limit === 999 ? "10%" : `${Math.min(100, (usage.count / limit) * 100)}%`, background: "var(--pumpkin)" }} />
            </div>
            <p style={{ color: "var(--text-muted)", margin: 0, fontSize: 12 }}>
              {usage.count} / {limit === 999 ? "∞" : limit} used today
            </p>
            {plan === "free" && (
              <Link to="/#features" style={{ display: "block", marginTop: 10, textDecoration: "none", textAlign: "center", color: "var(--text-primary)", background: "var(--pumpkin-soft)", border: "1px solid var(--glass-border)", borderRadius: 10, padding: "8px 10px", fontSize: 12, fontWeight: 700 }}>
                Upgrade plan
              </Link>
            )}
          </div>

          <div style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: 16, padding: 12, display: "flex", flexDirection: "column", gap: 8, minHeight: 260 }}>
            <button onClick={createNewChat} style={{ width: "100%", border: "1px solid var(--glass-border)", background: "var(--pumpkin-soft)", color: "var(--text-primary)", borderRadius: 10, padding: "9px 10px", cursor: "pointer", fontWeight: 700 }}>
              + New topic
            </button>
            <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
              {chats
                .slice()
                .sort((a, b) => b.updatedAt - a.updatedAt)
                .map(chat => {
                  const isActive = chat.id === activeChat?.id;
                  return (
                    <div key={chat.id} style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => setActiveChatId(chat.id)}
                        style={{
                          flex: 1,
                          border: "1px solid var(--border)",
                          background: isActive ? "var(--pumpkin-soft)" : "var(--bg-secondary)",
                          color: "var(--text-primary)",
                          borderRadius: 10,
                          padding: "8px 10px",
                          cursor: "pointer",
                          textAlign: "left",
                          fontSize: 12,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {chat.title || "New Chat"}
                      </button>
                      <button
                        onClick={() => confirmDeleteChat(chat.id, chat.title)}
                        style={{ border: "1px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text-secondary)", borderRadius: 10, padding: "8px 10px", cursor: "pointer" }}
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--glass-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 className="font-display" style={{ margin: 0, color: "var(--text-primary)", fontSize: 16 }}>FenixRise AI Advisor</h2>
              <p style={{ margin: "2px 0 0 0", color: "var(--text-secondary)", fontSize: 12 }}>Use separate chats for separate topics.</p>
            </div>
            {errorText && <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{errorText}</span>}
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
            {(activeChat?.messages || []).map((msg, index) => (
              <Message key={`${index}-${msg.role}`} msg={msg} initials={initials} />
            ))}
            {loading && <p style={{ color: "var(--text-secondary)", margin: 0 }}>Thinking…</p>}
            <div ref={bottomRef} />
          </div>

          {(activeChat?.messages?.length || 0) <= 1 && !loading && (
            <div style={{ padding: "0 16px 12px", display: "flex", flexWrap: "wrap", gap: 8 }}>
              {SUGGESTIONS.slice(0, 4).map((s, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(s)}
                  disabled={remaining <= 0}
                  style={{
                    border: "1px solid var(--border)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-secondary)",
                    borderRadius: 999,
                    padding: "8px 12px",
                    fontSize: 12,
                    cursor: remaining <= 0 ? "not-allowed" : "pointer",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div style={{ padding: 14, borderTop: "1px solid var(--glass-border)", background: "var(--bg-secondary)", display: "flex", gap: 10 }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={remaining <= 0 ? "Daily limit reached. Upgrade for more prompts." : "Ask your question in English... (Enter to send)"}
              disabled={remaining <= 0 || loading}
              rows={2}
              style={{
                flex: 1,
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "10px 12px",
                background: "var(--bg-card)",
                color: "var(--text-primary)",
                outline: "none",
                resize: "none",
                fontFamily: "inherit",
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading || remaining <= 0}
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                border: "1px solid var(--border)",
                background: "var(--pumpkin-soft)",
                color: "var(--text-primary)",
                cursor: "pointer",
                              }}
            >
              ↑
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm.show && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--glass-border)",
            borderRadius: 16,
            padding: 24,
            maxWidth: 400,
            width: "90%",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
          }}>
            <h3 style={{ margin: "0 0 12px 0", color: "var(--text-primary)", fontSize: 18 }}>
              Delete Chat
            </h3>
            <p style={{ margin: "0 0 20px 0", color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.5 }}>
              Are you sure you want to delete "<strong>{deleteConfirm.chatTitle}</strong>"? This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button
                onClick={() => setDeleteConfirm({ show: false, chatId: null, chatTitle: "" })}
                style={{
                  border: "1px solid var(--border)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  borderRadius: 10,
                  padding: "10px 20px",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                style={{
                  border: "1px solid var(--glass-border)",
                  background: "var(--pumpkin-soft)",
                  color: "var(--text-primary)",
                  borderRadius: 10,
                  padding: "10px 20px",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
