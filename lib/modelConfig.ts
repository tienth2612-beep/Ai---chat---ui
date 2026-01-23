export function getModelConfig(model: string) {
  switch (model) {
    case "phi3":
      return {
        temperature: 0,
        systemChat: `
Bạn là trợ lý.
Chỉ trả lời 1 câu ngắn.
Không giải thích.
Không ví dụ.
        `,
        systemInvoice: `
Chỉ trả JSON.
Không giải thích.
Không markdown.
        `
      };

    case "mistral":
      return {
        temperature: 0.1,
        systemChat: `
Answer briefly. One sentence only.
        `,
        systemInvoice: `
Return ONLY valid JSON. No explanation.
        `
      };

    default: // llama3
      return {
        temperature: 0,
        systemChat: `
Bạn trả lời ngắn gọn, đúng trọng tâm.
        `,
        systemInvoice: `
Chỉ JSON. Không text. Không markdown.
        `
      };
  }
}
