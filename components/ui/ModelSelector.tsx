"use client";

export default function ModelSelector({ model, setModel }: any) {
  return (
    <select value={model} onChange={(e) => setModel(e.target.value)}>
      <option value="gpt4o">GPT-4o</option>
      <option value="claude">Claude-style</option>
      <option value="gemini">Gemini-style</option>
    </select>
  );
}
