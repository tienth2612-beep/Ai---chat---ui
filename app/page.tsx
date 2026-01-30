"use client";

import { useEffect, useRef, useState } from "react";

/* =====================
   TYPES
===================== */
type Message = {
  role: "user" | "assistant";
  content: string;
  preview?: string;
};

/* =====================
   PAGE
===================== */
export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState("gpt-4o-mini");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  /* =====================
     LOAD HISTORY
  ===================== */
  useEffect(() => {
    const saved = localStorage.getItem("chat-history");
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  /* =====================
     SAVE + SCROLL
  ===================== */
  useEffect(() => {
    localStorage.setItem("chat-history", JSON.stringify(messages));
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* =====================
     SEND MESSAGE
  ===================== */
  async function send() {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    // thêm message user
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          model,
        }),
      });

      const data = await res.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.content,
        preview: data.preview,
      };

      // thêm message assistant (CHỈ 1 LẦN)
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Error occurred. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  /* =====================
     UI
  ===================== */
  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "system-ui" }}>
      {/* ================= SIDEBAR ================= */}
      <aside
        style={{
          width: 260,
          background: "#0f0f0f",
          color: "#fff",
          padding: 16,
        }}
      >
        <h3 style={{ marginBottom: 12 }}>AI Chat</h3>

        <button
          style={{ width: "100%", marginBottom: 16 }}
          onClick={() => setMessages([])}
        >
          + New Chat
        </button>

        <div style={{ fontSize: 12, opacity: 0.6 }}>Chat History</div>
      </aside>

      {/* ================= CHAT ================= */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#f9fafb",
        }}
      >
        {/* Header */}
        <header
          style={{
            padding: 12,
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <strong>Conversation</strong>
          <select value={model} onChange={(e) => setModel(e.target.value)}>
            <option value="gpt-4o-mini">GPT-4o Mini</option>
            <option value="gpt-4o">GPT-4o</option>
          </select>
        </header>

        {/* Messages */}
        <div style={{ flex: 1, padding: 16, overflowY: "auto" }}>
          {messages.length === 0 && (
            <div style={{ opacity: 0.6 }}>
              <h3>Welcome 👋</h3>
              <p>• Ask a question</p>
              <p>• Create an invoice</p>
              <p>• Switch models</p>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div
                style={{
                  textAlign: m.role === "user" ? "right" : "left",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: 12,
                    borderRadius: 8,
                    maxWidth: "80%",
                    background:
                      m.role === "user" ? "#2563eb" : "#e5e7eb",
                    color: m.role === "user" ? "#fff" : "#000",
                  }}
                >
                  {m.content}
                </div>
              </div>

              {/* PREVIEW (invoice/html) */}
              {m.preview && (
                <div
                  style={{
                    marginTop: 8,
                    border: "1px solid #d1d5db",
                    background: "#fff",
                    padding: 8,
                  }}
                  dangerouslySetInnerHTML={{ __html: m.preview }}
                />
              )}
            </div>
          ))}

          {loading && <div>AI is typing...</div>}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <footer
          style={{
            padding: 12,
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            gap: 8,
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type your message..."
            style={{ flex: 1, padding: 10 }}
            disabled={loading}
          />
          <button onClick={send} disabled={loading}>
            Send
          </button>
        </footer>
      </main>
    </div>
  );
}
