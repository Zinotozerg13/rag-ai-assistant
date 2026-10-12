import { useState, useRef, useEffect } from "react";
import "./App.css";

const API = "http://localhost:8000";

const CHIPS = [
  "Summarize the main ideas",
  "What are the key conclusions?",
  "List all recommendations",
  "What does this document cover?",
];

// ── types ──────────────────────────────────────────────────────
type LogType  = "info" | "send" | "success" | "error";
type LogEntry     = { id: number; msg: string; type: LogType; time: string };
type ToastEntry   = { id: number; msg: string; type: string };
type DocEntry     = { name: string; status: "indexing" | "done" | "error" };
type MessageEntry = { role: "user" | "ai"; content: string; time: string };

// ── tiny icon set ──────────────────────────────────────────────
const Icons = {
  Logo: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  Upload: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  File: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  Send: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Bot: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
    </svg>
  ),
  User: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Check: () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  XMark: () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Sparkle: () => (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M12 3l1.88 5.76a2 2 0 001.27 1.27L21 12l-5.85 1.97a2 2 0 00-1.27 1.27L12 21l-1.88-5.76a2 2 0 00-1.27-1.27L3 12l5.85-1.97a2 2 0 001.27-1.27L12 3z" />
    </svg>
  ),
  Cloud: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
    </svg>
  ),
};

function Spinner() {
  return <div className="spinner" />;
}

function TypingDots() {
  return (
    <div className="typing-wrap">
      {[0, 1, 2].map((i) => (
        <span key={i} className="dot" style={{ animationDelay: `${i * 0.18}s` }} />
      ))}
    </div>
  );
}

// ── coloured dot for each log type ────────────────────────────
const LOG_COLORS: Record<LogType, { dot: string; text: string }> = {
  info:    { dot: "#888", text: "#555" },
  send:    { dot: "#c4783a", text: "#7a3a0a" },
  success: { dot: "#3d7a52", text: "#1e5c36" },
  error:   { dot: "#a0392a", text: "#7a1a0a" },
};

function ActivityLog({ logs, onClear }: { logs: LogEntry[]; onClear: () => void }) {
  const logRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  return (
    <div className="log-panel">
      <div className="log-header">
        <span className="section-label" style={{ margin: 0 }}>Activity Log</span>
        {logs.length > 0 && (
          <button className="log-clear" onClick={onClear}>clear</button>
        )}
      </div>
      <div className="log-body" ref={logRef}>
        {logs.length === 0 ? (
          <p className="log-empty">Nothing yet. Upload a file to see activity.</p>
        ) : (
          logs.map((l) => (
            <div key={l.id} className="log-row">
              <span className="log-dot" style={{ background: LOG_COLORS[l.type]?.dot }} />
              <span className="log-time">{l.time}</span>
              <span className="log-msg" style={{ color: LOG_COLORS[l.type]?.text }}>{l.msg}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function DocItem({ name, status }: { name: string; status: DocEntry["status"] }) {
  return (
    <div className="doc-item">
      <div className="doc-icon"><Icons.File /></div>
      <span className="doc-name">{name}</span>
      {status === "indexing" && <Spinner />}
      {status === "done"     && <div className="doc-badge doc-badge--done"><Icons.Check /></div>}
      {status === "error"    && <div className="doc-badge doc-badge--error"><Icons.XMark /></div>}
    </div>
  );
}

function Toast({ toasts }: { toasts: ToastEntry[] }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.type}`}>
          {t.type === "success" && <Icons.Check />}
          {t.type === "error"   && <Icons.XMark />}
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

function Message({ msg }: { msg: MessageEntry }) {
  const isUser = msg.role === "user";
  return (
    <div className={`message ${isUser ? "message--user" : "message--ai"}`}>
      <div className={`msg-avatar ${isUser ? "msg-avatar--user" : "msg-avatar--ai"}`}>
        {isUser ? <Icons.User /> : <Icons.Bot />}
      </div>
      <div className={`msg-body ${isUser ? "msg-body--user" : ""}`}>
        <div className={`msg-bubble ${isUser ? "msg-bubble--user" : "msg-bubble--ai"}`}>
          {msg.content}
        </div>
        <span className="msg-time">{msg.time}</span>
      </div>
    </div>
  );
}

// ── main app ───────────────────────────────────────────────────
export default function App() {
  const [docs,          setDocs]          = useState<DocEntry[]>([]);
  const [messages,      setMessages]      = useState<MessageEntry[]>([]);
  const [input,         setInput]         = useState("");
  const [loading,       setLoading]       = useState(false);
  const [uploading,     setUploading]     = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragging,      setDragging]      = useState(false);
  const [toasts,        setToasts]        = useState<ToastEntry[]>([]);
  const [logs,          setLogs]          = useState<LogEntry[]>([]);

  const chatRef     = useRef<HTMLDivElement>(null);
  const fileRef     = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const toastId     = useRef(0);
  const logId       = useRef(0);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);

  // ── helpers ────────────────────────────────────────────────
  const now = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const addLog = (msg: string, type: LogType = "info") => {
    const id = ++logId.current;
    setLogs((l) => [...l, { id, msg, type, time: now() }]);
  };

  const addToast = (msg: string, type = "info") => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const pdfs = Array.from(files).filter((f) => f.type === "application/pdf");
    setSelectedFiles(pdfs);
    if (pdfs.length) {
      pdfs.forEach((f) => addLog(`📄 File selected: ${f.name} (${(f.size / 1024).toFixed(1)} KB)`, "info"));
    }
  };

  // ── upload ─────────────────────────────────────────────────
  const uploadFiles = async () => {
    if (!selectedFiles.length) return;
    setUploading(true);

    for (const file of selectedFiles) {
      setDocs((d) => [...d.filter((x) => x.name !== file.name), { name: file.name, status: "indexing" }]);

      addLog(`⬆️  Sending "${file.name}" to backend…`, "send");

      const form = new FormData();
      form.append("file", file);

      try {
        addLog(`🔗 POST ${API}/upload`, "info");
        const res = await fetch(`${API}/upload`, { method: "POST", body: form });

        if (!res.ok) {
          addLog(`❌ Server replied with status ${res.status}`, "error");
          throw new Error();
        }

        const data = await res.json();
        addLog(`✅ Backend says: "${data.message}"`, "success");
        addLog(`📦 "${file.name}" is now indexed in FAISS`, "success");

        setDocs((d) => d.map((x) => x.name === file.name ? { ...x, status: "done" } : x));
        addToast(`${file.name} indexed`, "success");

      } catch {
        addLog(`❌ Upload failed for "${file.name}" — is backend running?`, "error");
        setDocs((d) => d.map((x) => x.name === file.name ? { ...x, status: "error" } : x));
        addToast(`Failed: ${file.name}`, "error");
      }
    }

    setSelectedFiles([]);
    setUploading(false);
  };

  // ── ask question ───────────────────────────────────────────
  const sendQuestion = async (q?: string) => {
    const question = (q ?? input).trim();
    if (!question || loading) return;
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    setMessages((m) => [...m, { role: "user", content: question, time: now() }]);
    addLog(`💬 Question sent: "${question.slice(0, 60)}${question.length > 60 ? "…" : ""}"`, "send");
    setLoading(true);

    try {
      addLog(`🔗 POST ${API}/ask`, "info");
      const res  = await fetch(`${API}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      addLog(`✅ Answer received (${data.answer.length} chars)`, "success");
      setMessages((m) => [...m, { role: "ai", content: data.answer, time: now() }]);
    } catch {
      addLog(`❌ Could not reach backend at ${API}`, "error");
      setMessages((m) => [
        ...m,
        { role: "ai", content: "⚠️ Could not reach the backend at localhost:8000. Make sure your FastAPI server is running.", time: now() },
      ]);
    }
    setLoading(false);
  };

  const hasDocs      = docs.some((d) => d.status === "done");
  const indexedCount = docs.filter((d) => d.status === "done").length;

  // ── render ─────────────────────────────────────────────────
  return (
    <div className="app">

      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-mark"><Icons.Logo /></div>
          <div>
            <div className="logo-name">Lumina</div>
            <div className="logo-sub">Document Intelligence</div>
          </div>
        </div>

        {/* upload zone */}
        <div className="sidebar-section">
          <p className="section-label">Upload PDF</p>
          <div
            className={`upload-zone ${dragging ? "upload-zone--drag" : ""}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
          >
            <input ref={fileRef} type="file" accept=".pdf" multiple style={{ display: "none" }}
              onChange={(e) => handleFiles(e.target.files)} />
            <div className="upload-cloud"><Icons.Cloud /></div>
            {selectedFiles.length > 0 ? (
              <p className="upload-selected">{selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""} ready</p>
            ) : (
              <>
                <p className="upload-cta"><span className="upload-link">Choose files</span> or drag & drop</p>
                <p className="upload-hint">PDF only</p>
              </>
            )}
          </div>
          <button
            className={`upload-btn ${selectedFiles.length && !uploading ? "upload-btn--active" : ""}`}
            onClick={uploadFiles}
            disabled={!selectedFiles.length || uploading}
          >
            {uploading ? <><Spinner /> Indexing…</> : <><Icons.Upload /> Index Documents</>}
          </button>
        </div>

        {/* indexed docs */}
        <div className="doc-list">
          <div className="doc-list-header">
            <span className="section-label" style={{ margin: 0 }}>Knowledge Base</span>
            {docs.length > 0 && <span className="doc-count">{indexedCount}</span>}
          </div>
          {docs.length === 0
            ? <p className="doc-empty">No documents yet.<br />Upload a PDF to begin.</p>
            : docs.map((d) => <DocItem key={d.name} name={d.name} status={d.status} />)
          }
        </div>

        {/* live activity log */}
        <ActivityLog logs={logs} onClear={() => setLogs([])} />

        <div className="sidebar-footer">
          <span className="footer-label">Model</span>
          <span className="footer-value">llama-3.3-70b · Groq</span>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="main">
        <div className="topbar">
          <div className={`status-dot ${hasDocs ? "status-dot--on" : ""}`} />
          <span className="topbar-text">
            {hasDocs
              ? `${indexedCount} document${indexedCount > 1 ? "s" : ""} indexed · ready`
              : "Upload documents to start chatting"}
          </span>
          {hasDocs && <span className="topbar-model">FAISS · MiniLM-L6-v2</span>}
        </div>

        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Icons.Sparkle /></div>
            <h2 className="empty-heading">Ask anything about<br />your documents</h2>
            <p className="empty-sub">
              Upload PDFs on the left, then ask questions in natural language.
              Lumina finds answers from your indexed knowledge base.
            </p>
            <div className="chips">
              {CHIPS.map((c) => (
                <button key={c} className="chip" onClick={() => sendQuestion(c)}>{c}</button>
              ))}
            </div>
          </div>
        ) : (
          <div ref={chatRef} className="chat">
            {messages.map((m, i) => <Message key={i} msg={m} />)}
            {loading && (
              <div className="message message--ai">
                <div className="msg-avatar msg-avatar--ai"><Icons.Bot /></div>
                <div className="msg-bubble msg-bubble--ai"><TypingDots /></div>
              </div>
            )}
          </div>
        )}

        <div className="input-area">
          <div className="input-wrap">
            <textarea
              ref={textareaRef}
              className="input-box"
              value={input}
              placeholder={hasDocs ? "Ask a question about your documents…" : "Upload a PDF first…"}
              disabled={!hasDocs || loading}
              rows={1}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendQuestion(); }
              }}
            />
            <button
              className={`send-btn ${input.trim() && hasDocs && !loading ? "send-btn--active" : ""}`}
              onClick={() => sendQuestion()}
              disabled={!input.trim() || !hasDocs || loading}
            >
              {loading ? <Spinner /> : <Icons.Send />}
            </button>
          </div>
          <p className="input-hint">Enter to send · Shift+Enter for new line</p>
        </div>
      </main>

      <Toast toasts={toasts} />
    </div>
  );
}