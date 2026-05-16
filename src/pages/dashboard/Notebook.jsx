import { useState, useEffect } from "react";
import { Search, Plus, Tag, Trash2, Edit3, Save, X, Hash, BookOpen } from "lucide-react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { MDiv, MStagger, MItem, motion } from "../../components/MotionComponents";

// ── Persist to localStorage ───────────────────────────────────────
const STORAGE_KEY = "fenixrise_notebook";

const loadNotes = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
};
const saveNotes = (notes) => localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));

const SAMPLE_NOTES = [
  {
    id: "1",
    title: "Why I Want to Study Computer Science",
    body: "From a young age, technology fascinated me. Growing up in Tashkent, I saw how software could transform lives — from mobile banking to e-government services. I want to be part of that transformation...",
    tags: ["personal-statement", "CS", "MIT"],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "2",
    title: "Common App Essay Draft #1",
    body: "The summer I turned 16, our family lost everything in a flood. In chaos that followed, I found organising relief efforts for our neighbourhood — and discovered something unexpected about...",
    tags: ["common-app", "personal-statement", "draft"],
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export default function Notebook() {
  const [notes,      setNotes]      = useState(() => {
    const stored = loadNotes();
    return stored.length > 0 ? stored : SAMPLE_NOTES;
  });
  const [search,     setSearch]     = useState("");
  const [tagFilter,  setTagFilter]  = useState("");
  const [editing,    setEditing]    = useState(null); // note id being edited
  const [creating,   setCreating]   = useState(false);
  const [form,       setForm]       = useState({ title: "", body: "", tags: "" });
  const [selected,   setSelected]   = useState(null); // note being viewed

  useEffect(() => { saveNotes(notes); }, [notes]);

  // All unique tags
  const allTags = [...new Set(notes.flatMap(n => n.tags))].sort();

  // Filter
  const filtered = notes.filter(n => {
    const q = search.toLowerCase().replace(/^#/, "");
    const matchSearch = !q || n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q) || n.tags.some(t => t.toLowerCase().includes(q));
    const matchTag    = !tagFilter || n.tags.includes(tagFilter);
    return matchSearch && matchTag;
  });

  const openCreate = () => {
    setCreating(true);
    setEditing(null);
    setSelected(null);
    setForm({ title: "", body: "", tags: "" });
  };

  const openEdit = (note) => {
    setEditing(note.id);
    setCreating(false);
    setForm({ title: note.title, body: note.body, tags: note.tags.join(", ") });
  };

  const saveNote = () => {
    const tags = form.tags.split(",").map(t => t.trim().toLowerCase().replace(/\s+/g, "-")).filter(Boolean);
    if (creating) {
      const note = { id: Date.now().toString(), title: form.title, body: form.body, tags, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      setNotes(prev => [note, ...prev]);
      setSelected(note.id);
    } else {
      setNotes(prev => prev.map(n => n.id === editing ? { ...n, title: form.title, body: form.body, tags, updatedAt: new Date().toISOString() } : n));
    }
    setCreating(false);
    setEditing(null);
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (selected === id) setSelected(null);
  };

  const viewNote = notes.find(n => n.id === selected);
  const isWriting = creating || editing;

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-120px)] gap-5 overflow-hidden">

        {/* ── LEFT: list panel ── */}
        <div className="w-[300px] flex-shrink-0 flex flex-col gap-3">
          {/* Header */}
          <MDiv variant="fadeUp" className="flex items-center justify-between">
            <h1 className="font-display text-[20px] font-bold"
                style={{ fontWeight: 700, color: "var(--text-primary)" }}>
              My Notebook
            </h1>
            <motion.button onClick={openCreate} className="btn-primary !py-2 !px-3 !text-[12px]"
                           whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Plus size={14} /> New
            </motion.button>
          </MDiv>

          {/* Search */}
          <MDiv variant="fadeUp" delay={0.1}>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color: "var(--text-muted)" }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="#hashtag or keyword…"
                className="form-input !py-2 !text-[13px] pl-9"
              />
            </div>
          </MDiv>

          {/* Tag cloud */}
          {allTags.length > 0 && (
            <MDiv variant="fadeUp" delay={0.2}>
              <div className="flex flex-wrap gap-1.5">
                {allTags.map(tag => (
                  <motion.button key={tag}
                          onClick={() => setTagFilter(tagFilter === tag ? "" : tag)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all border"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          style={{
                            background:  tagFilter === tag ? "var(--pumpkin)" : "var(--bg-card)",
                            borderColor: tagFilter === tag ? "var(--pumpkin)" : "var(--border)",
                            color:       tagFilter === tag ? "#fff"           : "var(--text-secondary)",
                          }}>
                    <Hash size={9} /> {tag}
                  </motion.button>
                ))}
              </div>
            </MDiv>
          )}

          {/* Note list */}
          <MStagger className="flex flex-col gap-2 overflow-y-auto flex-1" staggerDelay={0.05}>
            {filtered.length === 0 ? (
              <MDiv variant="fadeUp" delay={0.3} className="text-center py-8">
                <BookOpen size={28} className="mx-auto mb-2" style={{ color: "var(--text-muted)" }} />
                <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>No notes found.</p>
              </MDiv>
            ) : filtered.map(note => (
              <MItem key={note.id}>
                <motion.div
                     onClick={() => { setSelected(note.id); setCreating(false); setEditing(null); }}
                     className="card p-4 cursor-pointer transition-all"
                     whileHover={{ scale: 1.02, x: 4 }}
                     whileTap={{ scale: 0.98 }}
                     style={{
                       borderColor: selected === note.id ? "var(--pumpkin)" : "var(--border)",
                       background: selected === note.id ? "var(--pumpkin-soft)" : "var(--bg-card)",
                     }}>
                  <p className="font-semibold text-[13px] truncate mb-1"
                     style={{ color: "var(--text-primary)" }}>{note.title}</p>
                  <p className="text-[11px] line-clamp-2 mb-2" style={{ color: "var(--text-muted)" }}>
                    {note.body}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {note.tags.slice(0, 3).map(t => (
                      <span key={t} className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                            style={{ background: "var(--pumpkin-soft)", color: "var(--pumpkin)" }}>
                        #{t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </MItem>
            ))}
          </MStagger>
        </div>

        {/* ── RIGHT: editor / viewer ── */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 300, damping: 24 }}
          className="flex-1 card flex flex-col overflow-hidden">
          {isWriting ? (
            /* Editor */
            <div className="flex flex-col h-full p-6 gap-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-[16px] font-bold" style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                  {creating ? "New Note" : "Edit Note"}
                </h2>
                <div className="flex gap-2">
                  <motion.button onClick={() => { setCreating(false); setEditing(null); }} className="btn-ghost !py-2 !px-3 !text-[12px]"
                                 whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    <X size={14} /> Cancel
                  </motion.button>
                  <motion.button onClick={saveNote} className="btn-primary !py-2 !px-4 !text-[12px]"
                                 whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    <Save size={14} /> Save
                  </motion.button>
                </div>
              </div>

              <input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Note title…"
                className="form-input !text-[18px] !font-bold !py-3"
                style={{ fontFamily: "'Syne', sans-serif" }}
              />

              <textarea
                value={form.body}
                onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                placeholder="Write your essay, notes, or ideas here…"
                className="form-input flex-1 resize-none !text-[14px] !leading-relaxed"
                style={{ minHeight: 280 }}
              />

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider block mb-2"
                       style={{ color: "var(--text-muted)" }}>
                  Hashtags (comma separated)
                </label>
                <div className="relative">
                  <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2"
                       style={{ color: "var(--text-muted)" }} />
                  <input
                    value={form.tags}
                    onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                    placeholder="personal-statement, MIT, draft-1"
                    className="form-input pl-9 !text-[13px]"
                  />
                </div>
                <p className="text-[11px] mt-1.5" style={{ color: "var(--text-muted)" }}>
                  Search by typing #hashtag in the search bar
                </p>
              </div>
            </div>
          ) : viewNote ? (
            /* Viewer */
            <div className="flex flex-col h-full p-6 overflow-y-auto">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <h2 className="font-display text-[22px] font-bold mb-2"
                      style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                    {viewNote.title}
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {viewNote.tags.map(t => (
                      <span key={t} className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: "var(--pumpkin-soft)", color: "var(--pumpkin)" }}>
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <motion.button onClick={() => openEdit(viewNote)} className="btn-ghost !py-2 !px-3 !text-[12px]"
                                 whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    <Edit3 size={13} /> Edit
                  </motion.button>
                  <motion.button onClick={() => deleteNote(viewNote.id)}
                          className="btn-ghost !py-2 !px-3 !text-[12px]"
                          style={{ color: "#ef4444", borderColor: "rgba(239,68,68,0.3)" }}
                          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    <Trash2 size={13} />
                  </motion.button>
                </div>
              </div>

              <p className="text-[14px] leading-[1.9] whitespace-pre-wrap flex-1"
                 style={{ color: "var(--text-primary)" }}>
                {viewNote.body}
              </p>

              <p className="text-[11px] mt-6 pt-4" style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}>
                Last updated {new Date(viewNote.updatedAt).toLocaleDateString("en-GB", { day:"numeric", month:"long", year:"numeric" })}
              </p>
            </div>
          ) : (
            /* Empty state */
            <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5, type: "spring", stiffness: 300, damping: 24 }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                style={{ background: "var(--bg-secondary)" }}>
                📝
              </motion.div>
              <h3 className="font-display text-[18px] font-bold" style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                Your Notebook
              </h3>
              <p className="text-[14px] max-w-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Store your essay drafts, notes, and ideas. Use hashtags to organise and find them instantly.
              </p>
              <motion.button onClick={openCreate} className="btn-primary"
                             whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Plus size={15} /> Create First Note
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
