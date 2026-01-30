"use client";

import { useEffect, useState } from "react";
import ModelSelect from "./ModelSelect";
import InvoicePreview from "./InvoicePreview";
import { parseInvoice } from "@/Lib/invoice";
export default function ChatWindow() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [model, setModel] = useState("gpt-4o-mini");
  const [invoice, setInvoice] = useState<any[] | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("chat");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("chat", JSON.stringify(messages));
  }, [messages]);

  function send() {
    if (!input) return;

    const newMsgs = [...messages, { role: "user", content: input }];
    setMessages(newMsgs);

    const items = parseInvoice(input);
    if (items.length > 0) {
      setInvoice(items);
    } else {
      setInvoice(null);
    }

    // fake AI response
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            items.length > 0
              ? "I have created the invoice based on your data."
              : "Hello! How can I help you?",
        },
      ]);
    }, 600);

    setInput("");
  }

  return (
    <section className="chat">
      <div className="chat-header">
        <strong>AI Assistant</strong>
        <ModelSelect model={model} setModel={setModel} />
      </div>

      <div className="messages">
        {messages.map((m, i) => (
          <p key={i}>
            <b>{m.role}:</b> {m.content}
          </p>
        ))}
        {invoice && <InvoicePreview items={invoice} />}
      </div>

      <div className="input-box">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something or create an invoice..."
        />
        <button onClick={send}>Send</button>
      </div>
    </section>
  );
}
