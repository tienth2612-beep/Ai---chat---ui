"use client";

import { useState } from "react";

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState("gpt-4o-mini");
  const [invoiceHTML, setInvoiceHTML] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          model,
        }),
      });

      const data = await res.json();

      if (data.type === "html") {
        // invoice
        setInvoiceHTML(data.content);
        setMessages([
          ...nextMessages,
          { role: "ai", content: "📄 Đã tạo hóa đơn" },
        ]);
      } else {
        // chat
        setMessages([
          ...nextMessages,
          { role: "ai", content: data.content },
        ]);
      }
    } catch {
      setMessages([
        ...nextMessages,
        { role: "ai", content: "❌ Lỗi hệ thống" },
      ]);
    }

    setLoading(false);
  }

  return (
    <div style={styles.container}>
      {/* LEFT: CHAT */}
      <div style={styles.chatPanel}>
        <div style={styles.header}>
          <span style={styles.title}>AI Assistant</span>

          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            style={styles.select}
          >
            <option value="gpt-4o-mini">GPT-4o mini</option>
            <option value="gpt-4o">GPT-4o</option>
          </select>
        </div>

        <div style={styles.messages}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                ...styles.message,
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                background:
                  m.role === "user" ? "#2563eb" : "#f3f4f6",
                color: m.role === "user" ? "#fff" : "#111",
              }}
            >
              {m.content}
            </div>
          ))}
        </div>

        <div style={styles.inputBox}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập yêu cầu..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            style={styles.input}
          />
          <button onClick={sendMessage} style={styles.button}>
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>

      {/* RIGHT: INVOICE */}
      <div style={styles.invoicePanel}>
        <div style={styles.invoiceHeader}>Invoice Preview</div>

        {invoiceHTML ? (
          <iframe
            srcDoc={invoiceHTML}
            style={styles.iframe}
            title="invoice"
          />
        ) : (
          <div style={styles.placeholder}>
            Chưa có hóa đơn
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "Inter, Arial, sans-serif",
    background: "#fafafa",
  },

  chatPanel: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #e5e7eb",
    background: "#fff",
  },

  header: {
    padding: "12px 16px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontWeight: 600,
    fontSize: 16,
  },

  select: {
    padding: "6px 8px",
    borderRadius: 6,
    border: "1px solid #ccc",
  },

  messages: {
    flex: 1,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    overflowY: "auto",
  },

  message: {
    maxWidth: "70%",
    padding: "10px 14px",
    borderRadius: 12,
    fontSize: 14,
    lineHeight: 1.4,
  },

  inputBox: {
    display: "flex",
    padding: 12,
    borderTop: "1px solid #e5e7eb",
    gap: 8,
  },

  input: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 14,
  },

  button: {
    padding: "0 16px",
    borderRadius: 8,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },

  invoicePanel: {
    width: "45%",
    display: "flex",
    flexDirection: "column",
    background: "#f9fafb",
  },

  invoiceHeader: {
    padding: 12,
    fontWeight: 600,
    borderBottom: "1px solid #e5e7eb",
  },

  iframe: {
    flex: 1,
    border: "none",
    background: "#fff",
  },

  placeholder: {
    padding: 24,
    color: "#888",
  },
};
