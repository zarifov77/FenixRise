import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MDiv, MItem, MStagger, MCard } from "../../components/MotionComponents";

// ── Icons (inline SVG to avoid import issues) ─────────────────────
const Icon = ({ d, size = 18, color = "currentColor", fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

// ── Draggable Widget Shell ─────────────────────────────────────────
function DraggableWidget({ id, title, icon, children, onClose, initialX = 80, initialY = 80, width = 320 }) {
  const [pos,     setPos]     = useState({ x: initialX, y: initialY });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const ref    = useRef(null);

  const onMouseDown = e => {
    if (e.target.closest(".widget-no-drag")) return;
    setDragging(true);
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };
  useEffect(() => {
    if (!dragging) return;
    const move = e => setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y });
    const up   = () => setDragging(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup",  up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
  }, [dragging]);

  return (
    <div ref={ref} style={{
      position: "absolute", left: pos.x, top: pos.y, width,
      background: "#fff", borderRadius: 16, boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
      zIndex: 100, userSelect: "none", cursor: dragging ? "grabbing" : "default",
      border: "1px solid rgba(0,0,0,0.07)",
    }}>
      {/* Header */}
      <div onMouseDown={onMouseDown} style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 14px", borderBottom: "1px solid #f0f0f0",
        cursor: dragging ? "grabbing" : "grab", borderRadius: "16px 16px 0 0",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, color: "#666" }}>{icon}</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{title}</span>
        </div>
        <button onClick={onClose} className="widget-no-drag"
                style={{ background: "none", border: "none", cursor: "pointer", color: "#999", fontSize: 18, lineHeight: 1, padding: "0 2px" }}>×</button>
      </div>
      <div className="widget-no-drag" style={{ padding: "14px" }}>
        {children}
      </div>
    </div>
  );
}

// ── WIDGET: Todo ──────────────────────────────────────────────────
function TodoWidget({ id, onClose }) {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Review SAT math formulas", done: false },
    { id: 2, text: "IELTS reading practice", done: true },
  ]);
  const [input, setInput] = useState("");

  const add = () => {
    if (!input.trim()) return;
    setTasks(t => [...t, { id: Date.now(), text: input, done: false }]);
    setInput("");
  };
  const toggle = id => setTasks(t => t.map(x => x.id === id ? { ...x, done: !x.done } : x));
  const remove = id => setTasks(t => t.filter(x => x.id !== id));

  return (
    <DraggableWidget id={id} title="Tasks" icon="☑" onClose={onClose} initialX={60} initialY={120} width={300}>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
               onKeyDown={e => e.key === "Enter" && add()}
               placeholder="Add task..."
               style={{ flex: 1, border: "1px solid #e5e5e5", borderRadius: 8, padding: "7px 10px", fontSize: 13, outline: "none" }} />
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={add}
          style={{ background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: 16, fontWeight: 700 }}>+</motion.button>
      </div>
      <div style={{ maxHeight: 220, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
        {tasks.map(t => (
          <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 4px", borderRadius: 8 }}
               onMouseEnter={e => e.currentTarget.style.background = "#f9f9f9"}
               onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)}
                   style={{ width: 16, height: 16, accentColor: "#e85d04", cursor: "pointer" }} />
            <span style={{ flex: 1, fontSize: 13, color: t.done ? "#aaa" : "#333",
                           textDecoration: t.done ? "line-through" : "none" }}>{t.text}</span>
            <button onClick={() => remove(t.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#ddd", fontSize: 16, padding: 0 }}>×</button>
          </div>
        ))}
      </div>
    </DraggableWidget>
  );
}

// ── WIDGET: Pomodoro ──────────────────────────────────────────────
function PomodoroWidget({ id, onClose }) {
  const MODES = { "Focus": 25*60, "Short Break": 5*60, "Long Break": 15*60 };
  const [mode,    setMode]    = useState("Focus");
  const [secs,    setSecs]    = useState(25*60);
  const [running, setRunning] = useState(false);
  const [count,   setCount]   = useState(0);

  useEffect(() => {
    setSecs(MODES[mode]);
    setRunning(false);
  }, [mode]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSecs(s => {
      if (s <= 1) { setRunning(false); setCount(c => c + 1); return MODES[mode]; }
      return s - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [running, mode]);

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const pct  = 1 - secs / MODES[mode];
  const r    = 54;
  const circ = 2 * Math.PI * r;

  return (
    <DraggableWidget id={id} title="Pomodoro" icon="⏱" onClose={onClose} initialX={120} initialY={160} width={280}>
      {/* Mode tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {Object.keys(MODES).map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            flex: 1, padding: "6px 4px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600,
            background: mode === m ? "#1a1a1a" : "#f0f0f0",
            color: mode === m ? "#fff" : "#666",
          }}>{m}</button>
        ))}
      </div>

      {/* Circle timer */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 16 }}>
        <div style={{ position: "relative", width: 140, height: 140 }}>
          <svg width={140} height={140} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={70} cy={70} r={r} fill="none" stroke="#f0f0f0" strokeWidth={6} />
            <circle cx={70} cy={70} r={r} fill="none" stroke="#1a1a1a" strokeWidth={6}
                    strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
                    style={{ transition: "stroke-dashoffset 0.5s ease" }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: "#1a1a1a", letterSpacing: -1 }}>{fmt(secs)}</span>
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={mode}
              style={{ fontSize: 11, color: "#999", marginTop: 2 }}>⏱ {mode}</motion.span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <button onClick={() => { setSecs(MODES[mode]); setRunning(false); }}
                style={{ background: "#f0f0f0", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", fontSize: 16 }}>↺</button>
        <button onClick={() => setRunning(r => !r)}
                style={{ background: "#1a1a1a", border: "none", borderRadius: "50%", width: 48, height: 48, cursor: "pointer", color: "#fff", fontSize: 18 }}>
          {running ? "⏸" : "▶"}
        </button>
        <span style={{ fontSize: 13, color: "#999" }}>🍅 {count}</span>
      </div>
    </DraggableWidget>
  );
}

// ── WIDGET: Note ──────────────────────────────────────────────────
function NoteWidget({ id, onClose }) {
  const [text, setText] = useState("");
  return (
    <DraggableWidget id={id} title="Note" icon="📄" onClose={onClose} initialX={500} initialY={100} width={340}>
      <textarea value={text} onChange={e => setText(e.target.value)}
                placeholder="Write your notes here..."
                style={{ width: "100%", minHeight: 200, border: "none", outline: "none", resize: "none",
                         fontSize: 13, lineHeight: 1.7, color: "#333", fontFamily: "inherit", background: "transparent" }} />
    </DraggableWidget>
  );
}

// ── WIDGET: Rich Text ───────────────────────────────────────────────
function RichTextWidget({ id, onClose }) {
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("Sans");
  const [textColor, setTextColor] = useState("#1a1a1a");
  const [showFormat, setShowFormat] = useState(true);
  const textareaRef = useRef(null);

  const FONT_SIZES = [12, 14, 16, 20, 24, 32, 40, 56, 72];
  const FONT_FAMILIES = [
    { label: "Sans", value: "'Inter', sans-serif" },
    { label: "Serif", value: "Georgia, serif" },
    { label: "Mono", value: "'Courier New', monospace" },
    { label: "Cursive", value: "'Brush Script MT', cursive" },
  ];
  const COLORS = [
    { color: "#1a1a1a", border: true },
    { color: "#555555", border: true },
    { color: "#ef4444", border: false },
    { color: "#3b82f6", border: false },
    { color: "#22c55e", border: false },
    { color: "#f97316", border: false },
    { color: "#8b5cf6", border: false },
    { color: "#eab308", border: false },
    { color: "#ffffff", border: true },
  ];

  const currentFont = FONT_FAMILIES.find(f => f.label === fontFamily)?.value || FONT_FAMILIES[0].value;

  return (
    <DraggableWidget id={id} title="Text" icon="T" onClose={onClose} initialX={400} initialY={150} width={340}>
      <div className="widget-no-drag" style={{ position: "relative" }}>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => setText(e.target.value)}
          onFocus={() => setShowFormat(true)}
          placeholder="Yozing..."
          style={{
            width: "100%",
            minHeight: 120,
            border: "none",
            outline: "none",
            resize: "none",
            fontSize: fontSize,
            lineHeight: 1.5,
            color: textColor,
            fontFamily: currentFont,
            background: "transparent",
          }}
        />

        {/* Formatting popup */}
        {showFormat && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              marginTop: 8,
              background: "#fff",
              borderRadius: 16,
              padding: "14px",
              boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
              border: "1px solid #eee",
              zIndex: 200,
            }}>
            {/* Font size */}
            <div style={{ marginBottom: 10 }}>
              <p style={{ fontSize: 11, color: "#999", margin: "0 0 8px", fontWeight: 500 }}>O&apos;lcham: {fontSize}px</p>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {FONT_SIZES.map(s => (
                  <button
                    key={s}
                    onClick={() => setFontSize(s)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: 8,
                      border: "none",
                      cursor: "pointer",
                      fontSize: 11,
                      fontWeight: 600,
                      background: fontSize === s ? "#1a1a1a" : "#f0f0f0",
                      color: fontSize === s ? "#fff" : "#555",
                      minWidth: 28,
                    }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Font family */}
            <div style={{ marginBottom: 10 }}>
              <p style={{ fontSize: 11, color: "#999", margin: "0 0 8px", fontWeight: 500 }}>Shrift</p>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {FONT_FAMILIES.map(f => (
                  <button
                    key={f.label}
                    onClick={() => setFontFamily(f.label)}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 8,
                      border: "none",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                      background: fontFamily === f.label ? "#1a1a1a" : "#f0f0f0",
                      color: fontFamily === f.label ? "#fff" : "#555",
                      fontFamily: f.value,
                    }}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div style={{ marginBottom: 10 }}>
              <p style={{ fontSize: 11, color: "#999", margin: "0 0 8px", fontWeight: 500 }}>Rang</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {COLORS.map(c => (
                  <button
                    key={c.color}
                    onClick={() => setTextColor(c.color)}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: c.color,
                      border: textColor === c.color ? "2px solid #1a1a1a" : c.border ? "1px solid #ddd" : "none",
                      cursor: "pointer",
                      padding: 0,
                      boxShadow: c.color === "#ffffff" ? "inset 0 0 0 1px #ddd" : "none",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Close button */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
              <button
                onClick={() => setShowFormat(false)}
                style={{
                  padding: "5px 14px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  background: "#e0e7ff",
                  color: "#3b82f6",
                }}>
                Yop&apos;q
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </DraggableWidget>
  );
}

// ── WIDGET: YouTube ───────────────────────────────────────────────
function YouTubeWidget({ id, onClose }) {
  const [url,    setUrl]    = useState("");
  const [videoId, setVideoId] = useState("");

  const load = () => {
    const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
    if (match) setVideoId(match[1]);
  };

  return (
    <DraggableWidget id={id} title="YouTube" icon="▶" onClose={onClose} initialX={160} initialY={220} width={420}>
      {videoId ? (
        <div>
          <iframe width="100%" height={220} src={`https://www.youtube.com/embed/${videoId}`}
                  frameBorder={0} allowFullScreen style={{ borderRadius: 10 }} />
          <motion.button 
            whileHover={{ x: -3 }}
            onClick={() => setVideoId("")}
            style={{ marginTop: 8, fontSize: 12, color: "#999", background: "none", border: "none", cursor: "pointer" }}>
            ← Another video
          </motion.button>
        </div>
      ) : (
        <div>
          <div style={{ height: 140, background: "#f5f5f5", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 40, opacity: 0.3 }}>▶</span>
          </div>
          <p style={{ fontSize: 12, color: "#999", textAlign: "center", marginBottom: 10 }}>Enter YouTube URL</p>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && load()}
                   placeholder="https://youtube.com/watch?v=..."
                   style={{ flex: 1, border: "1px solid #e5e5e5", borderRadius: 8, padding: "8px 10px", fontSize: 12, outline: "none" }} />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={load}
              style={{ background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
              Load
            </motion.button>
          </div>
        </div>
      )}
    </DraggableWidget>
  );
}

// ── WIDGET: Sticky Note ───────────────────────────────────────────
function StickyWidget({ id, onClose, color = "#FEF08A" }) {
  const [text, setText] = useState("");
  return (
    <DraggableWidget id={id} title="Sticky" icon="🗒" onClose={onClose} initialX={700} initialY={200} width={220}>
      <textarea value={text} onChange={e => setText(e.target.value)}
                placeholder="Write here..."
                style={{ width: "100%", minHeight: 140, border: "none", outline: "none", resize: "none",
                         fontSize: 14, lineHeight: 1.6, color: "#333", fontFamily: "inherit",
                         background: color, borderRadius: 8, padding: 10 }} />
      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
        {["#FEF08A","#86EFAC","#93C5FD","#FDA4AF","#FCA5A1"].map(c => (
          <button key={c} onClick={() => {}} style={{ width: 20, height: 20, borderRadius: "50%", background: c, border: "2px solid rgba(0,0,0,0.1)", cursor: "pointer" }} />
        ))}
      </div>
    </DraggableWidget>
  );
}

// ── WIDGET: Flashcard ─────────────────────────────────────────────
function FlashcardWidget({ id, onClose }) {
  const cards = [
    { q: "What is the quadratic formula?", a: "x = (-b ± √(b²-4ac)) / 2a" },
    { q: "Define 'ubiquitous'", a: "Present, appearing, or found everywhere" },
    { q: "IELTS band 7 writing requirement?", a: "Task achievement, coherence, vocabulary, grammar all at band 7+" },
  ];
  const [idx,    setIdx]    = useState(0);
  const [flipped, setFlipped] = useState(false);

  return (
    <DraggableWidget id={id} title="Flashcard" icon="🃏" onClose={onClose} initialX={400} initialY={300} width={300}>
      <div onClick={() => setFlipped(f => !f)} style={{
        minHeight: 120, background: flipped ? "#1a1a1a" : "#f8f8f8", borderRadius: 12,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16, cursor: "pointer", marginBottom: 12, transition: "all 0.3s ease",
      }}>
        <p style={{ fontSize: 14, textAlign: "center", color: flipped ? "#fff" : "#333", lineHeight: 1.5 }}>
          {flipped ? cards[idx].a : cards[idx].q}
        </p>
      </div>
      <p style={{ fontSize: 11, color: "#aaa", textAlign: "center", marginBottom: 10 }}>
        {flipped ? "Answer" : "Question"} · tap to flip
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setIdx(i => (i - 1 + cards.length) % cards.length); setFlipped(false); }}
          style={{ flex: 1, padding: "7px", background: "#f0f0f0", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>← Previous</motion.button>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setIdx(i => (i + 1) % cards.length); setFlipped(false); }}
          style={{ flex: 1, padding: "7px", background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>Next →</motion.button>
      </div>
      <p style={{ fontSize: 11, color: "#bbb", textAlign: "center", marginTop: 8 }}>{idx + 1} / {cards.length}</p>
    </DraggableWidget>
  );
}

// ── WIDGET: Calculator ────────────────────────────────────────────
function CalcWidget({ id, onClose }) {
  const [expr, setExpr] = useState("");
  const [result, setResult] = useState("");
  const btns = ["C","(",")","/","7","8","9","×","4","5","6","-","1","2","3","+","0",".","⌫","="];

  const press = b => {
    if (b === "C")  { setExpr(""); setResult(""); return; }
    if (b === "=")  { try { setResult(String(eval(expr.replace("×","*")))); } catch { setResult("Error"); } return; }
    if (b === "⌫") { setExpr(e => e.slice(0,-1)); return; }
    setExpr(e => e + b);
    setResult("");
  };

  return (
    <DraggableWidget id={id} title="Calculator" icon="🧮" onClose={onClose} initialX={620} initialY={150} width={220}>
      <div style={{ background: "#f8f8f8", borderRadius: 10, padding: "10px 12px", marginBottom: 10, minHeight: 52, textAlign: "right" }}>
        <div style={{ fontSize: 12, color: "#aaa", minHeight: 16 }}>{expr || "0"}</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a" }}>{result || " "}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>
        {btns.map(b => (
          <button key={b} onClick={() => press(b)} style={{
            padding: "11px 0", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600,
            background: b === "=" ? "#1a1a1a" : b === "C" ? "#fee2e2" : ["×","/","-","+"].includes(b) ? "#f0f0f0" : "#fff",
            color: b === "=" ? "#fff" : b === "C" ? "#ef4444" : "#333",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}>{b}</button>
        ))}
      </div>
    </DraggableWidget>
  );
}

// ── WIDGET GALLERY DATA ───────────────────────────────────────────
const WIDGET_CATALOG = [
  { id:"todo",       label:"Tasks",        desc:"To-do list",                 icon:"☑",  category:"MAIN"     },
  { id:"pomodoro",   label:"Pomodoro",     desc:"Focus timer",                icon:"⏱",  category:"MAIN"     },
  { id:"note",       label:"Note",         desc:"Take notes",                 icon:"📄",  category:"MAIN"     },
  { id:"richtext",   label:"Text",         desc:"Rich text with formatting",  icon:"T",   category:"MAIN"     },
  { id:"sticky",     label:"Sticky",       desc:"Colorful notes",             icon:"🗒",  category:"MAIN"     },
  { id:"flashcard",  label:"Flashcards",   desc:"Study cards",                icon:"🃏",  category:"LEARNING" },
  { id:"calc",       label:"Calculator",   desc:"Math calculator",            icon:"🧮",  category:"MAIN"     },
  { id:"youtube",    label:"YouTube",      desc:"Watch videos",               icon:"▶",  category:"MEDIA"    },
];

// ── Main Whiteboard Page ──────────────────────────────────────────
export default function Whiteboard() {
  const navigate   = useNavigate();
  const { boardId = "default" } = useParams();
  const canvasStorageKey = `fenixrise_canvas_${boardId}`;
  const widgetsStorageKey = `fenixrise_widgets_${boardId}`;
  const textStorageKey = `fenixrise_text_${boardId}`;
  const canvasRef  = useRef(null);
  const [tool,     setTool]     = useState("pen");  // pen | eraser | select | hand
  const [color,    setColor]    = useState("#1a1a1a");
  const [size,     setSize]     = useState(2.5);
  const [drawing,  setDrawing]  = useState(false);
  const [history,  setHistory]  = useState([]);
  const [redoStack,setRedoStack]= useState([]);
  const [zoom,     setZoom]     = useState(100);
  const [title,    setTitle]    = useState("My Whiteboard");
  const [editTitle,setEditTitle]= useState(false);
  const [showWidgetGallery, setShowWidgetGallery] = useState(false);
  const [widgetSearch, setWidgetSearch] = useState("");
  const [activeWidgets, setActiveWidgets] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(`fenixrise_widgets_${boardId}`) || "[]");
    } catch {
      return [];
    }
  });
  const [selectedWidget, setSelectedWidget] = useState(null);
  const lastPt = useRef(null);
  const shapeStart = useRef(null);
  const savedImageData = useRef(null);
  const [showShapePicker, setShowShapePicker] = useState(false);
  const [shapeType, setShapeType] = useState("rect");
  const [shapeFillColor, setShapeFillColor] = useState("transparent");
  const [shapeStrokeColor, setShapeStrokeColor] = useState("#1a1a1a");
  const [shapeStrokeWidth, setShapeStrokeWidth] = useState(2);
  const [shapeFilled, setShapeFilled] = useState(false);
  // Canvas text elements
  const [textElements, setTextElements] = useState([]);
  const [activeTextId, setActiveTextId] = useState(null);
  const [textFontSize, setTextFontSize] = useState(16);
  const [textFontFamily, setTextFontFamily] = useState("Sans");
  const [textColor, setTextColor] = useState("#1a1a1a");
  const [showTextFormat, setShowTextFormat] = useState(false);
  const textRefs = useRef({});
  const formatPopupRef = useRef(null);
  const historyRef = useRef([]);
  const redoRef = useRef([]);

  useEffect(() => { historyRef.current = history; }, [history]);
  useEffect(() => { redoRef.current = redoStack; }, [redoStack]);

  const getCanvasData = useCallback(() => {
    const canvas = canvasRef.current;
    return canvas ? canvas.toDataURL() : "";
  }, []);

  const drawCanvasFromData = useCallback((imageData) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!imageData) return;
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = imageData;
  }, []);

  const persistBoard = useCallback((snapshot, nextTitle = title) => {
    localStorage.setItem(canvasStorageKey, snapshot.imageData || "");
    localStorage.setItem(textStorageKey, JSON.stringify(snapshot.textElements || []));
    const boards = (() => {
      try {
        return JSON.parse(localStorage.getItem("fenixrise_boards") || "[]");
      } catch {
        return [];
      }
    })();
    const nextBoards = boards.map(b => (b.id === boardId ? { ...b, title: nextTitle } : b));
    localStorage.setItem("fenixrise_boards", JSON.stringify(nextBoards));
  }, [title, canvasStorageKey, textStorageKey, boardId]);

  const commitSnapshot = useCallback((nextTextElements = textElements, nextTitle = title) => {
    const snapshot = { imageData: getCanvasData(), textElements: nextTextElements };
    const last = historyRef.current[historyRef.current.length - 1];
    if (
      last &&
      last.imageData === snapshot.imageData &&
      JSON.stringify(last.textElements) === JSON.stringify(snapshot.textElements)
    ) return;
    setHistory(prev => [...prev, snapshot]);
    setRedoStack([]);
    persistBoard(snapshot, nextTitle);
  }, [getCanvasData, textElements, title, persistBoard]);

  // Auto-focus newly created text element
  useEffect(() => {
    if (activeTextId && textRefs.current[activeTextId]) {
      textRefs.current[activeTextId].focus();
    }
  }, [activeTextId]);

  // Deselect text when clicking outside canvas text / popup
  useEffect(() => {
    const handler = e => {
      if (
        e.target.closest('.canvas-text') ||
        e.target.closest('.text-format-popup') ||
        e.target.closest('button[title="Text"]') ||
        e.target.closest('button')?.closest('[title="Text"]')
      ) return;
      setActiveTextId(null);
      setShowTextFormat(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    try {
      setActiveWidgets(JSON.parse(localStorage.getItem(widgetsStorageKey) || "[]"));
    } catch {
      setActiveWidgets([]);
    }
  }, [widgetsStorageKey]);

  // ── Canvas setup ─────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    // Canvas is transparent to show the dot grid background
    ctx.clearRect(0,0,canvas.width,canvas.height);

    const savedCanvas = localStorage.getItem(canvasStorageKey);
    if (savedCanvas) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = savedCanvas;
    }
    const savedText = (() => {
      try {
        return JSON.parse(localStorage.getItem(textStorageKey) || "[]");
      } catch {
        return [];
      }
    })();
    setTextElements(savedText);

    const boards = (() => {
      try {
        return JSON.parse(localStorage.getItem("fenixrise_boards") || "[]");
      } catch {
        return [];
      }
    })();
    const boardMeta = boards.find(b => b.id === boardId);
    if (boardMeta?.title) setTitle(boardMeta.title);

    setHistory([{ imageData: savedCanvas || getCanvasData(), textElements: savedText }]);
    setRedoStack([]);
  }, [canvasStorageKey, textStorageKey, drawCanvasFromData, boardId, getCanvasData]);

  useEffect(() => {
    const latest = historyRef.current[historyRef.current.length - 1] || { imageData: getCanvasData(), textElements };
    persistBoard(latest, title);
  }, [title, textElements, getCanvasData, persistBoard]);

  const getPos = e => {
    const r = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const startDraw = e => {
    if (tool === "pen" || tool === "erase") {
      setDrawing(true);
      const ctx = canvasRef.current.getContext("2d");
      const pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      lastPt.current = pos;
      setRedoStack([]);
    } else if (tool === "shape") {
      setDrawing(true);
      const pos = getPos(e);
      shapeStart.current = pos;
      lastPt.current = pos;
      const ctx = canvasRef.current.getContext("2d");
      savedImageData.current = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
      setRedoStack([]);
    } else if (tool === "text") {
      // If clicking on an existing text element, let it handle focus naturally
      if (e.target.closest('.canvas-text')) return;
      if (e.target.closest('.text-format-popup')) return;

      const pos = getPos(e);
      const newId = Date.now();
      const next = [...textElements, {
        id: newId,
        x: pos.x,
        y: pos.y,
        text: "",
        fontSize: textFontSize,
        fontFamily: textFontFamily,
        color: textColor
      }];
      setTextElements(next);
      setActiveTextId(newId);
      setShowTextFormat(true);
      commitSnapshot(next);
    }
  };

  const draw = e => {
    if (!drawing) return;
    const ctx = canvasRef.current.getContext("2d");
    const pos = getPos(e);
    if (tool === "pen" || tool === "erase") {
      ctx.lineWidth   = tool === "erase" ? size * 6 : size;
      ctx.lineCap     = "round";
      ctx.lineJoin    = "round";
      if (tool === "erase") {
        ctx.globalCompositeOperation = "destination-out";
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = color;
      }
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      lastPt.current = pos;
    } else if (tool === "shape") {
      if (savedImageData.current) {
        ctx.putImageData(savedImageData.current, 0, 0);
      }
      drawShape(ctx, shapeStart.current, pos);
      lastPt.current = pos;
    }
  };

  const endDraw = () => {
    if (!drawing) return;
    setDrawing(false);
    const canvas = canvasRef.current;
    if (tool === "shape") {
      const ctx = canvasRef.current.getContext("2d");
      if (savedImageData.current) {
        ctx.putImageData(savedImageData.current, 0, 0);
      }
      const end = lastPt.current || shapeStart.current;
      drawShape(ctx, shapeStart.current, end);
    }
    commitSnapshot();
    localStorage.setItem(canvasStorageKey, canvas.toDataURL());
  };

  const undo = () => {
    const current = historyRef.current;
    if (current.length <= 1) return;
    const previousSnapshot = current[current.length - 2];
    const poppedSnapshot = current[current.length - 1];
    setRedoStack(r => [poppedSnapshot, ...r]);
    setHistory(h => h.slice(0, -1));
    setTextElements(previousSnapshot.textElements || []);
    drawCanvasFromData(previousSnapshot.imageData || "");
    persistBoard(previousSnapshot);
  };

  const redo = () => {
    if (redoRef.current.length === 0) return;
    const next = redoRef.current[0];
    setHistory(h => [...h, next]);
    setRedoStack(r => r.slice(1));
    setTextElements(next.textElements || []);
    drawCanvasFromData(next.imageData || "");
    persistBoard(next);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);
    setTextElements([]);
    const blankSnapshot = { imageData: canvas.toDataURL(), textElements: [] };
    setHistory([blankSnapshot]);
    setRedoStack([]);
    persistBoard(blankSnapshot);
    localStorage.removeItem(canvasStorageKey);
    localStorage.removeItem(textStorageKey);
  };

  const exportPng = () => {
    const link = document.createElement("a");
    link.download = `${title}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const addWidget = (widgetId) => {
    setActiveWidgets(w => {
      const updatedWidgets = [...w, { id: Date.now(), type: widgetId }];
      localStorage.setItem(widgetsStorageKey, JSON.stringify(updatedWidgets));
      return updatedWidgets;
    });
    setShowWidgetGallery(false);
    setWidgetSearch("");
  };

  const removeWidget = (id) => setActiveWidgets(w => {
    const filteredWidgets = w.filter(x => x.id !== id);
    localStorage.setItem(widgetsStorageKey, JSON.stringify(filteredWidgets));
    return filteredWidgets;
  });

  const TOOLS = [
    { id:"select", icon:"⬆", title:"Select" },
    { id:"pen",    icon:"✏", title:"Pen"   },
    { id:"shape",  icon:"⬜", title:"Shape"   },
    { id:"erase",  icon:"◻", title:"Erase"},
    { id:"hand",   icon:"✋", title:"Move"},
    { id:"sticky-tool", icon:"🗒", title:"Sticky" },
    { id:"text",   icon:"T",  title:"Text"   },
  ];

  const COLORS = ["#1a1a1a","#ef4444","#f97316","#eab308","#22c55e","#3b82f6","#8b5cf6","#ec4899","#fff"];

  const filteredCatalog = WIDGET_CATALOG.filter(w =>
    !widgetSearch || w.label.toLowerCase().includes(widgetSearch.toLowerCase()) ||
    w.desc.toLowerCase().includes(widgetSearch.toLowerCase())
  );
  const categories = [...new Set(filteredCatalog.map(w => w.category))];

  const cursorStyle = { pen:"crosshair", erase:"cell", hand:"grab", select:"default", text:"text", shape:"crosshair" }[tool] || "crosshair";

  const fontMap = {
    Sans: "'Inter', sans-serif",
    Serif: "Georgia, serif",
    Mono: "'Courier New', monospace",
    Cursive: "'Brush Script MT', cursive",
  };

  const drawShape = (ctx, start, end) => {
    ctx.save();
    ctx.lineWidth = shapeStrokeWidth;
    ctx.strokeStyle = shapeStrokeColor;
    ctx.fillStyle = shapeFillColor;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const x = Math.min(start.x, end.x);
    const y = Math.min(start.y, end.y);
    const w = Math.abs(end.x - start.x);
    const h = Math.abs(end.y - start.y);
    ctx.beginPath();
    switch (shapeType) {
      case "rect":
        if (shapeFilled) ctx.fillRect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);
        break;
      case "circle": {
        const cx = (start.x + end.x) / 2;
        const cy = (start.y + end.y) / 2;
        const r = Math.sqrt(w * w + h * h) / 2;
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        if (shapeFilled) ctx.fill();
        ctx.stroke();
        break;
      }
      case "diamond":
        ctx.moveTo((start.x + end.x) / 2, start.y);
        ctx.lineTo(end.x, (start.y + end.y) / 2);
        ctx.lineTo((start.x + end.x) / 2, end.y);
        ctx.lineTo(start.x, (start.y + end.y) / 2);
        ctx.closePath();
        if (shapeFilled) ctx.fill();
        ctx.stroke();
        break;
      case "triangle":
        ctx.moveTo((start.x + end.x) / 2, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.lineTo(start.x, end.y);
        ctx.closePath();
        if (shapeFilled) ctx.fill();
        ctx.stroke();
        break;
      case "star": {
        const cx = (start.x + end.x) / 2;
        const cy = (start.y + end.y) / 2;
        const outerR = Math.min(w, h) / 2;
        const innerR = outerR * 0.4;
        for (let i = 0; i < 10; i++) {
          const angle = (Math.PI / 5) * i - Math.PI / 2;
          const radius = i % 2 === 0 ? outerR : innerR;
          const px = cx + Math.cos(angle) * radius;
          const py = cy + Math.sin(angle) * radius;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        if (shapeFilled) ctx.fill();
        ctx.stroke();
        break;
      }
      case "ellipse": {
        const ecx = (start.x + end.x) / 2;
        const ecy = (start.y + end.y) / 2;
        ctx.ellipse(ecx, ecy, w / 2, h / 2, 0, 0, Math.PI * 2);
        if (shapeFilled) ctx.fill();
        ctx.stroke();
        break;
      }
      case "arrow": {
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        const angle = Math.atan2(end.y - start.y, end.x - start.x);
        const headLen = Math.min(12, Math.sqrt(w * w + h * h) / 4);
        ctx.beginPath();
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(end.x - headLen * Math.cos(angle - Math.PI / 6), end.y - headLen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(end.x - headLen * Math.cos(angle + Math.PI / 6), end.y - headLen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
        break;
      }
      case "line":
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        break;
    }
    ctx.restore();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{ position:"relative", width:"100vw", height:"100vh", display:"flex", flexDirection:"column", fontFamily:"'Inter', sans-serif", overflow:"hidden" }}>

      {/* ── TOP BAR ── */}
      <motion.div 
        initial={{ y: -52, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.1 }}
        style={{
        height: 52, display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 16px", borderBottom:"1px solid #e8e8e8", background:"#fff", flexShrink:0, zIndex:200,
      }}>
        {/* Left */}
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={() => navigate("/dashboard")}
                  style={{ background:"none", border:"none", cursor:"pointer", color:"#666", fontSize:18, display:"flex", alignItems:"center" }}>
            ←
          </button>
          <div style={{ width:32, height:32, borderRadius:10, background:"linear-gradient(135deg,#818cf8,#6366f1)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          {editTitle ? (
            <input value={title} onChange={e => setTitle(e.target.value)}
                   onBlur={() => setEditTitle(false)} onKeyDown={e => e.key==="Enter" && setEditTitle(false)}
                   autoFocus style={{ fontSize:14, fontWeight:500, border:"1px solid #e5e5e5", borderRadius:8, padding:"4px 10px", outline:"none", minWidth:200 }} />
          ) : (
            <span onClick={() => setEditTitle(true)}
                  style={{ fontSize:14, fontWeight:500, color:"#333", cursor:"text", padding:"4px 8px",
                           borderRadius:6, border:"1px solid transparent" }}
                  onMouseEnter={e => e.target.style.borderColor="#e5e5e5"}
                  onMouseLeave={e => e.target.style.borderColor="transparent"}>
              {title}
            </span>
          )}
        </div>

        {/* Right */}
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <motion.button 
            onClick={() => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
              } else {
                document.exitFullscreen();
              }
            }}
            whileHover={{ scale: 1.05, backgroundColor: "#f5f5f5" }}
            whileTap={{ scale: 0.95 }}
            style={{ display:"flex", alignItems:"center", gap:6, background:"transparent", border:"none", cursor:"pointer",
                           fontSize:13, color:"#666", padding:"8px 12px", borderRadius:10, fontWeight:500 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
            Fullscreen
          </motion.button>
          <motion.button 
            onClick={exportPng}
            whileHover={{ scale: 1.05, backgroundColor: "#f5f5f5" }}
            whileTap={{ scale: 0.95 }}
            style={{ display:"flex", alignItems:"center", gap:6, background:"transparent", border:"1px solid #e5e5e5",
                           cursor:"pointer", fontSize:13, color:"#333", padding:"8px 14px", borderRadius:10, fontWeight:500 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export PNG
          </motion.button>
          <motion.button 
            onClick={() => setShowWidgetGallery(true)}
            whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(99,102,241,0.4)" }}
            whileTap={{ scale: 0.95 }}
            style={{ display:"flex", alignItems:"center", gap:8, background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
                           color:"#fff", border:"none", borderRadius:12, padding:"10px 18px", cursor:"pointer", fontSize:13, fontWeight:600 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Widget
          </motion.button>
        </div>
      </motion.div>

      {/* ── CANVAS AREA ── */}
      <div style={{ flex:1, position:"relative", overflow:"hidden", background:"#f0f0f0" }}>
        {/* Zoomable content container */}
        <motion.div 
          style={{ 
            position:"absolute", 
            inset:0, 
            transformOrigin:"center center",
            cursor:cursorStyle,
            boxShadow: "0 20px 60px rgba(0,0,0,0.1), 0 8px 20px rgba(0,0,0,0.06)",
            borderRadius: 16,
            overflow: "hidden",
          }}
          animate={{ scale: zoom / 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}>
          
          {/* Dot grid */}
          <div style={{
            position:"absolute", inset:0, pointerEvents:"none",
            backgroundImage:"radial-gradient(circle, #d8d8d8 0.8px, transparent 0.8px)",
            backgroundSize:"28px 28px",
          }}/>

          {/* Canvas */}
          <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", touchAction:"none" }}
                  onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw} />

          {/* Canvas text elements */}
          {textElements.map(te => {
            const isActive = te.id === activeTextId;
            return (
              <div key={te.id} data-text-id={te.id} style={{ position: "absolute", left: te.x, top: te.y, zIndex: isActive ? 150 : 105 }}>
                {/* Placeholder */}
                {te.text === "" && (
                  <span dir="ltr" style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    fontSize: te.fontSize,
                    fontFamily: fontMap[te.fontFamily] || fontMap.Sans,
                    color: "#ccc",
                    pointerEvents: "none",
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    maxWidth: 320,
                    lineHeight: 1.5,
                    userSelect: "none",
                    textAlign: "left",
                    direction: "ltr",
                  }}>
                    write there
                  </span>
                )}
                <div
                  ref={el => { textRefs.current[te.id] = el; }}
                  className="canvas-text"
                  contentEditable
                  suppressContentEditableWarning
                  onMouseDown={e => {
                    if (tool !== "erase") return;
                    e.preventDefault();
                    e.stopPropagation();
                    const next = textElements.filter(t => t.id !== te.id);
                    setTextElements(next);
                    setActiveTextId(null);
                    setShowTextFormat(false);
                    commitSnapshot(next);
                  }}
                  onInput={e => {
                    const val = e.target?.innerText ?? "";
                    setTextElements(prev => prev.map(t => t.id === te.id ? {...t, text: val} : t));
                  }}
                  onBlur={e => {
                    const val = e.target?.innerText ?? "";
                    const next = textElements.map(t => t.id === te.id ? { ...t, text: val } : t);
                    setTextElements(next);
                    commitSnapshot(next);
                  }}
                  onFocus={() => {
                    setActiveTextId(te.id);
                    setTextFontSize(te.fontSize);
                    setTextFontFamily(te.fontFamily);
                    setTextColor(te.color);
                    setShowTextFormat(true);
                  }}
                  dir="ltr"
                  style={{
                    position: "relative",
                    fontSize: te.fontSize,
                    fontFamily: fontMap[te.fontFamily] || fontMap.Sans,
                    color: te.color,
                    minWidth: 50,
                    outline: "none",
                    cursor: "text",
                    background: "transparent",
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    maxWidth: 320,
                    lineHeight: 1.5,
                    textAlign: "left",
                    direction: "ltr",
                    unicodeBidi: "embed",
                  }}
                ></div>
              </div>
            );
          })}

          {/* Text format popup */}
          {showTextFormat && activeTextId && (() => {
            const te = textElements.find(t => t.id === activeTextId);
            if (!te) return null;
            const FONT_SIZES = [12, 14, 16, 20, 24, 32, 40, 56, 72];
            const FONT_FAMILIES = ["Sans", "Serif", "Mono", "Cursive"];
            const COLORS = [
              { color: "#1a1a1a", border: true },
              { color: "#555555", border: true },
              { color: "#ef4444", border: false },
              { color: "#3b82f6", border: false },
              { color: "#22c55e", border: false },
              { color: "#f97316", border: false },
              { color: "#8b5cf6", border: false },
              { color: "#eab308", border: false },
              { color: "#ffffff", border: true },
            ];
            return (
              <motion.div
                ref={formatPopupRef}
                key={activeTextId}
                className="text-format-popup"
                initial={{ opacity: 0, y: 5, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                style={{
                  position: "absolute",
                  left: te.x,
                  top: te.y + te.fontSize * 2 + 8,
                  background: "#fff",
                  borderRadius: 16,
                  padding: "14px",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                  border: "1px solid #eee",
                  zIndex: 200,
                  minWidth: 220,
                }}>
                {/* Font size */}
                <div style={{ marginBottom: 10 }}>
                  <p style={{ fontSize: 11, color: "#999", margin: "0 0 8px", fontWeight: 500 }}>O&apos;lcham: {te.fontSize}px</p>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    {FONT_SIZES.map(s => (
                      <button
                        key={s}
                        onClick={() => {
                          const next = textElements.map(t => t.id === activeTextId ? {...t, fontSize: s} : t);
                          setTextElements(next);
                          setTextFontSize(s);
                          commitSnapshot(next);
                        }}
                        style={{
                          padding: "4px 8px",
                          borderRadius: 8,
                          border: "none",
                          cursor: "pointer",
                          fontSize: 11,
                          fontWeight: 600,
                          background: te.fontSize === s ? "#1a1a1a" : "#f0f0f0",
                          color: te.fontSize === s ? "#fff" : "#555",
                          minWidth: 28,
                        }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font family */}
                <div style={{ marginBottom: 10 }}>
                  <p style={{ fontSize: 11, color: "#999", margin: "0 0 8px", fontWeight: 500 }}>Shrift</p>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    {FONT_FAMILIES.map(f => (
                      <button
                        key={f}
                        onClick={() => {
                          const next = textElements.map(t => t.id === activeTextId ? {...t, fontFamily: f} : t);
                          setTextElements(next);
                          setTextFontFamily(f);
                          commitSnapshot(next);
                        }}
                        style={{
                          padding: "4px 10px",
                          borderRadius: 8,
                          border: "none",
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 600,
                          background: te.fontFamily === f ? "#1a1a1a" : "#f0f0f0",
                          color: te.fontFamily === f ? "#fff" : "#555",
                        }}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color */}
                <div style={{ marginBottom: 10 }}>
                  <p style={{ fontSize: 11, color: "#999", margin: "0 0 8px", fontWeight: 500 }}>Rang</p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {COLORS.map(c => (
                      <button
                        key={c.color}
                        onClick={() => {
                          const next = textElements.map(t => t.id === activeTextId ? {...t, color: c.color} : t);
                          setTextElements(next);
                          setTextColor(c.color);
                          commitSnapshot(next);
                        }}
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          background: c.color,
                          border: te.color === c.color ? "2px solid #1a1a1a" : c.border ? "1px solid #ddd" : "none",
                          cursor: "pointer",
                          padding: 0,
                          boxShadow: c.color === "#ffffff" ? "inset 0 0 0 1px #ddd" : "none",
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Close button */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
                  <button
                    onClick={() => setShowTextFormat(false)}
                    style={{
                      padding: "5px 14px",
                      borderRadius: 8,
                      border: "none",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                      background: "#e0e7ff",
                      color: "#3b82f6",
                    }}>
                    exit
                  </button>
                </div>
              </motion.div>
            );
          })()}

          {/* Active widgets rendered on top */}
        <AnimatePresence>
        {activeWidgets.map((w, index) => {
          const offset = index * 30;
          const widgetComponent = (() => {
            if (w.type === "todo")      return <TodoWidget       key={w.id} id={w.id} onClose={() => removeWidget(w.id)} />;
            if (w.type === "pomodoro")  return <PomodoroWidget   key={w.id} id={w.id} onClose={() => removeWidget(w.id)} />;
            if (w.type === "note")      return <NoteWidget       key={w.id} id={w.id} onClose={() => removeWidget(w.id)} />;
            if (w.type === "richtext")  return <RichTextWidget   key={w.id} id={w.id} onClose={() => removeWidget(w.id)} />;
            if (w.type === "sticky")    return <StickyWidget     key={w.id} id={w.id} onClose={() => removeWidget(w.id)} />;
            if (w.type === "flashcard") return <FlashcardWidget  key={w.id} id={w.id} onClose={() => removeWidget(w.id)} />;
            if (w.type === "calc")      return <CalcWidget       key={w.id} id={w.id} onClose={() => removeWidget(w.id)} />;
            if (w.type === "youtube")   return <YouTubeWidget    key={w.id} id={w.id} onClose={() => removeWidget(w.id)} />;
            return null;
          })();
          return widgetComponent ? (
            <motion.div
              key={w.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25, delay: index * 0.05 }}>
              {widgetComponent}
            </motion.div>
          ) : null;
        })}
        </AnimatePresence>
        </motion.div>
      </div>

      {/* ── BOTTOM BAR (Zoom | Toolbar | Page) ── */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.2 }}
        style={{ position: "absolute", bottom: 20, left: 20, right: 20, zIndex: 301,
                display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Left: Zoom controls */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.3 }}
          style={{ display:"flex", alignItems:"center", gap:4, background:"#fff",
                    borderRadius:10, padding:"6px 10px", boxShadow:"0 2px 12px rgba(0,0,0,0.08)", border:"1px solid #eee" }}>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setZoom(z => Math.max(25,z-10))}
            style={{ background:"none", border:"none", cursor:"pointer", width:26, height:26, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </motion.button>
          <span style={{ fontSize:13, fontWeight:500, color:"#333", minWidth:36, textAlign:"center" }}>{zoom}%</span>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setZoom(z => Math.min(300,z+10))}
            style={{ background:"none", border:"none", cursor:"pointer", width:26, height:26, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: "#f5f5f5" }}
            whileTap={{ scale: 0.9 }}
            style={{ background:"none", border:"none", cursor:"pointer", width:26, height:26, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:6, marginLeft:2 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </motion.button>
        </motion.div>

        {/* Center: Toolbar */}
        <motion.div 
          style={{ display:"flex", alignItems:"center", gap:2, background:"rgba(255,255,255,0.95)", borderRadius:16,
                      padding:"6px 8px", boxShadow:"0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
                      border:"1px solid rgba(0,0,0,0.06)", backdropFilter:"blur(12px)" }}>
        {/* Undo */}
        <ToolbarBtn onClick={undo} title="Undo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7v6h6"/>
            <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
          </svg>
        </ToolbarBtn>
        {/* Redo */}
        <ToolbarBtn onClick={redo} title="Redo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 7v6h-6"/>
            <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/>
          </svg>
        </ToolbarBtn>

        <div style={{ width:1, height:20, background:"#e8e8e8", margin:"0 4px" }}/>

        {/* Select */}
        <ToolbarBtn onClick={() => { setTool("select"); setShowShapePicker(false); }} active={tool === "select"} activeBg="#3b82f6">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        </ToolbarBtn>
        {/* Hand */}
        <ToolbarBtn onClick={() => { setTool("hand"); setShowShapePicker(false); }} active={tool === "hand"} activeBg="#3b82f6">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/>
            <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/>
            <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/>
            <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
          </svg>
        </ToolbarBtn>
        {/* Pen */}
        <ToolbarBtn onClick={() => { setTool("pen"); setShowShapePicker(false); }} active={tool === "pen"} activeBg="#f97316">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
          </svg>
        </ToolbarBtn>
        {/* Shape/Square - toggles picker */}
        <ToolbarBtn onClick={() => { setTool("shape"); setShowShapePicker(v => !v); }} active={tool === "shape"} activeBg="#3b82f6">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2"/>
          </svg>
        </ToolbarBtn>
        {/* Eraser */}
        <ToolbarBtn onClick={() => { setTool("erase"); setShowShapePicker(false); }} active={tool === "erase"} activeBg="#3b82f6">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/>
            <path d="M22 21H7"/>
            <path d="m5 11 9 9"/>
          </svg>
        </ToolbarBtn>

        <div style={{ width:1, height:20, background:"#e8e8e8", margin:"0 4px" }}/>

        {/* Sticky Note */}
        <ToolbarBtn onClick={() => { setTool("sticky-tool"); setShowShapePicker(false); }} active={tool === "sticky-tool"} activeBg="#3b82f6">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
            <line x1="9" x2="15" y1="9" y2="9"/>
            <line x1="9" x2="15" y1="13" y2="13"/>
          </svg>
        </ToolbarBtn>
        {/* Text */}
        <ToolbarBtn onClick={() => { setTool("text"); setShowShapePicker(false); setShowTextFormat(true); }} active={tool === "text"} activeBg="#3b82f6">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/>
          </svg>
        </ToolbarBtn>
        </motion.div>

        {/* Right: Page counter */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.3 }}
          style={{ display:"flex", alignItems:"center", gap:4, background:"#fff",
                    borderRadius:10, padding:"6px 10px", boxShadow:"0 2px 12px rgba(0,0,0,0.08)", border:"1px solid #eee" }}>
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: "#f5f5f5" }}
            whileTap={{ scale: 0.9 }}
            style={{ background:"none", border:"none", cursor:"pointer", width:26, height:26, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </motion.button>
          <span style={{ fontSize:13, fontWeight:500, color:"#333", minWidth:40, textAlign:"center" }}>1 / 1</span>
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: "#f5f5f5" }}
            whileTap={{ scale: 0.9 }}
            style={{ background:"none", border:"none", cursor:"pointer", width:26, height:26, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: "#f5f5f5" }}
            whileTap={{ scale: 0.9 }}
            style={{ background:"none", border:"none", cursor:"pointer", width:26, height:26, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:6, marginLeft:2 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* ── SHAPE PICKER POPUP ── */}
      {showShapePicker && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          style={{
            position: "absolute",
            bottom: 76,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 302,
            background: "#fff",
            borderRadius: 16,
            padding: "16px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
            border: "1px solid #eee",
            minWidth: 260,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}>
          {/* Shape row */}
          <div>
            <p style={{ fontSize: 11, color: "#999", margin: "0 0 8px", fontWeight: 500 }}>Shakl</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {[
                { id: "rect", icon: <rect x="5" y="5" width="14" height="14" rx="2" fill={shapeType === "rect" ? "#fff" : "none"} stroke="currentColor" strokeWidth="2"/> },
                { id: "circle", icon: <circle cx="12" cy="12" r="7" fill={shapeType === "circle" ? "#fff" : "none"} stroke="currentColor" strokeWidth="2"/> },
                { id: "diamond", icon: <polygon points="12,5 19,12 12,19 5,12" fill={shapeType === "diamond" ? "#fff" : "none"} stroke="currentColor" strokeWidth="2"/> },
                { id: "triangle", icon: <polygon points="12,5 19,19 5,19" fill={shapeType === "triangle" ? "#fff" : "none"} stroke="currentColor" strokeWidth="2"/> },
                { id: "star", icon: <polygon points="12,2 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8" fill={shapeType === "star" ? "#fff" : "none"} stroke="currentColor" strokeWidth="2"/> },
                { id: "ellipse", icon: <><circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="2" fill={shapeType === "ellipse" ? "#fff" : "currentColor"}/></> },
                { id: "arrow", icon: <><line x1="4" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2"/><polyline points="12 8 16 12 12 16" fill="none" stroke="currentColor" strokeWidth="2"/></> },
                { id: "line", icon: <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2"/> },
              ].map(s => (
                <button key={s.id} onClick={() => setShapeType(s.id)}
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    border: shapeType === s.id ? "none" : "1px solid #e5e5e5",
                    background: shapeType === s.id ? "#3b82f6" : "#fff",
                    color: shapeType === s.id ? "#fff" : "#555",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                  }}>
                  <svg width="20" height="20" viewBox="0 0 24 24">{s.icon}</svg>
                </button>
              ))}
            </div>
          </div>

          {/* Stroke color */}
          <div>
            <p style={{ fontSize: 11, color: "#999", margin: "0 0 8px", fontWeight: 500 }}>Chiziq rangi</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["#1a1a1a", "#ef4444", "#3b82f6", "#22c55e", "#f97316", "#8b5cf6", "#eab308", "#ffffff"].map(c => (
                <button key={c} onClick={() => setShapeStrokeColor(c)}
                  style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: c === "#ffffff" ? "#fff" : c,
                    border: shapeStrokeColor === c ? "2px solid #1a1a1a" : "1px solid #ddd",
                    cursor: "pointer",
                    padding: 0,
                    boxShadow: c === "#ffffff" ? "inset 0 0 0 1px #ddd" : "none",
                  }}/>
              ))}
            </div>
          </div>

          {/* Fill */}
          <div>
            <p style={{ fontSize: 11, color: "#999", margin: "0 0 8px", fontWeight: 500 }}>To'ldirish</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
              {/* No fill */}
              <button onClick={() => { setShapeFilled(false); }}
                style={{
                  width: 22, height: 22, borderRadius: "50%",
                  background: "#fff",
                  border: !shapeFilled ? "2px solid #1a1a1a" : "1px solid #ddd",
                  cursor: "pointer",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
              {["#1a1a1a", "#ef4444", "#3b82f6", "#22c55e", "#f97316", "#8b5cf6", "#eab308"].map(c => (
                <button key={c} onClick={() => { setShapeFillColor(c); setShapeFilled(true); }}
                  style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: c,
                    border: shapeFilled && shapeFillColor === c ? "2px solid #1a1a1a" : "1px solid #ddd",
                    cursor: "pointer",
                    padding: 0,
                  }}/>
              ))}
            </div>
          </div>

          {/* Thickness */}
          <div>
            <p style={{ fontSize: 11, color: "#999", margin: "0 0 8px", fontWeight: 500 }}>Qalinlik: {shapeStrokeWidth}px</p>
            <input type="range" min="1" max="20" value={shapeStrokeWidth}
              onChange={e => setShapeStrokeWidth(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#3b82f6", cursor: "pointer" }}/>
          </div>
        </motion.div>
      )}

      {/* ── WIDGET GALLERY MODAL ── */}
      <AnimatePresence>
      {showWidgetGallery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position:"fixed", inset:0, zIndex:500, display:"flex", alignItems:"center", justifyContent:"center",
                      background:"rgba(0,0,0,0.4)", backdropFilter:"blur(4px)" }}
             onClick={e => e.target === e.currentTarget && setShowWidgetGallery(false)}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{ background:"#fff", borderRadius:20, width:900, maxWidth:"92vw", maxHeight:"85vh",
                        display:"flex", flexDirection:"column", overflow:"hidden", boxShadow:"0 24px 80px rgba(0,0,0,0.2)" }}>
            {/* Modal header */}
            <div style={{ padding:"20px 24px", borderBottom:"1px solid #f0f0f0", display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#e0e7ff,#c7d2fe)",
                            display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>✦</div>
              <div>
                <h2 style={{ fontSize:18, fontWeight:700, color:"#1a1a1a", margin:0 }}>Add Widget</h2>
                <p style={{ fontSize:13, color:"#999", margin:0 }}>Add tools to your whiteboard</p>
              </div>
              <button onClick={() => setShowWidgetGallery(false)}
                      style={{ marginLeft:"auto", background:"none", border:"none", cursor:"pointer", fontSize:22, color:"#999" }}>×</button>
            </div>

            <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
              {/* Left: catalog */}
              <div style={{ flex:1, padding:"16px 20px", overflowY:"auto" }}>
                {/* Search */}
                <div style={{ position:"relative", marginBottom:16 }}>
                  <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#aaa", fontSize:14 }}>🔍</span>
                  <input value={widgetSearch} onChange={e => setWidgetSearch(e.target.value)}
                         placeholder="Search widgets..."
                         style={{ width:"100%", border:"2px solid #e5e5e5", borderRadius:12, padding:"10px 12px 10px 36px",
                                  fontSize:14, outline:"none", boxSizing:"border-box" }}
                         onFocus={e => e.target.style.borderColor="#818cf8"}
                         onBlur={e => e.target.style.borderColor="#e5e5e5"}/>
                </div>

                {/* Widget grid by category */}
                {categories.map(cat => (
                  <div key={cat}>
                    <p style={{ fontSize:11, fontWeight:700, color:"#aaa", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8, marginTop:8 }}>{cat}</p>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
                      {filteredCatalog.filter(w => w.category === cat).map(w => (
                        <button key={w.id} onClick={() => { setSelectedWidget(w); }}
                                style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px",
                                         borderRadius:12, border: selectedWidget?.id===w.id ? "2px solid #818cf8" : "1px solid #f0f0f0",
                                         background: selectedWidget?.id===w.id ? "#f5f3ff" : "#fff",
                                         cursor:"pointer", textAlign:"left", transition:"all 0.15s" }}
                                onMouseEnter={e => { if(selectedWidget?.id!==w.id) e.currentTarget.style.background="#fafafa"; }}
                                onMouseLeave={e => { if(selectedWidget?.id!==w.id) e.currentTarget.style.background="#fff"; }}>
                          <div style={{ width:36, height:36, borderRadius:10, background:"#f5f5f5",
                                        display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
                            {w.icon}
                          </div>
                          <div>
                            <p style={{ fontSize:13, fontWeight:600, color:"#1a1a1a", margin:0 }}>{w.label}</p>
                            <p style={{ fontSize:11, color:"#999", margin:0 }}>{w.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right: preview */}
              <div style={{ width:280, borderLeft:"1px solid #f0f0f0", padding:"20px 20px", display:"flex", flexDirection:"column" }}>
                <p style={{ fontSize:11, fontWeight:700, color:"#aaa", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:12 }}>PREVIEW</p>
                {selectedWidget ? (
                  <>
                    <div style={{ flex:1, background:"#f8f8f8", borderRadius:14, display:"flex", flexDirection:"column",
                                  alignItems:"center", justifyContent:"center", padding:20, marginBottom:16, minHeight:180 }}>
                      <span style={{ fontSize:48, marginBottom:12 }}>{selectedWidget.icon}</span>
                      <p style={{ fontSize:14, fontWeight:600, color:"#333", margin:0, textAlign:"center" }}>{selectedWidget.label}</p>
                      <p style={{ fontSize:12, color:"#999", margin:"4px 0 0", textAlign:"center" }}>{selectedWidget.desc}</p>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                      <div style={{ width:32, height:32, borderRadius:10, background:"#f0f0f0",
                                    display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>
                        {selectedWidget.icon}
                      </div>
                      <div>
                        <p style={{ fontSize:13, fontWeight:600, color:"#1a1a1a", margin:0 }}>{selectedWidget.label}</p>
                        <p style={{ fontSize:11, color:"#999", margin:0 }}>{selectedWidget.desc}</p>
                      </div>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => addWidget(selectedWidget.id)}
                      style={{ background:"linear-gradient(135deg,#818cf8,#6366f1)", color:"#fff", border:"none",
                                     borderRadius:12, padding:"12px 0", cursor:"pointer", fontSize:14, fontWeight:600, width:"100%" }}>
                      + Add to Whiteboard
                    </motion.button>
                  </>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", color:"#ccc", fontSize:13 }}>
                    Select a widget
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Helper components ─────────────────────────────────────────────
function ToolBtn({ icon, onClick, active, title, activeColor="#e85d04" }) {
  return (
    <motion.button 
      onClick={onClick} 
      title={title}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      style={{
        width:36, height:36, borderRadius:10, border:"none", cursor:"pointer", fontSize:16,
        display:"flex", alignItems:"center", justifyContent:"center",
        background: active ? activeColor : "transparent",
        color: active ? "#fff" : "#555",
      }}
      onMouseEnter={e => { if(!active) e.currentTarget.style.background="#f5f5f5"; }}
      onMouseLeave={e => { if(!active) e.currentTarget.style.background="transparent"; }}>
      {icon}
    </motion.button>
  );
}
function Divider() {
  return <div style={{ width:1, height:24, background:"#e8e8e8", margin:"0 4px" }}/>;
}

function ToolbarBtn({ children, onClick, active, activeBg = "#f97316", title }) {
  return (
    <motion.button 
      onClick={onClick} 
      title={title}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      style={{
        width:36, height:36, borderRadius:10, border:"none", cursor:"pointer",
        display:"flex", alignItems:"center", justifyContent:"center",
        background: active ? activeBg : "transparent",
        color: active ? "#fff" : "#555",
        transition: "all 0.15s ease",
      }}>
      {children}
    </motion.button>
  );
}
