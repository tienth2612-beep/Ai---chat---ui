"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  type: "text" | "html";
  content: string;
};

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState("llama3");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      role: "user",
      type: "text",
      content: input,
    };

    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [...messages, userMsg],
      }),
    });

    const data = await res.json();

    setMessages((m) => [
      ...m,
      { role: "assistant", type: data.type, content: data.content },
    ]);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow flex flex-col h-[85vh]">

        <div className="p-4 border-b flex justify-between">
          <b>AI Chat & Invoice</b>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="border px-2 py-1"
          >
            <option value="llama3">Llama3</option>
            <option value="mistral">Mistral</option>
          </select>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-3 rounded max-w-[80%] ${
                m.role === "user"
                  ? "ml-auto bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              {m.type === "html" ? (
                <div dangerouslySetInnerHTML={{ __html: m.content }} />
              ) : (
                m.content
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            className="flex-1 border px-3 py-2"
            placeholder="Nhập tin nhắn hoặc invoice..."
          />
          <button
            onClick={send}
            className="bg-blue-600 text-white px-4"
          >
            Gửi
          </button>
        </div>

      </div>
    </div>
  );
}
