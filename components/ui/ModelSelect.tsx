"use client";

export default function ModelSelect({
  model,
  setModel,
}: {
  model: string;
  setModel: (m: string) => void;
}) {
  return (
    <select value={model} onChange={(e) => setModel(e.target.value)}>
      <option value="gpt-4o-mini">GPT-4o Mini</option>
      <option value="gpt-4o">GPT-4o</option>
      <option value="gemini">Gemini (UI)</option>
    </select>
  );
}
