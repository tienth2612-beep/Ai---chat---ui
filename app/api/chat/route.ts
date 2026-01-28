// BẮT BUỘC: dùng Node runtime
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/* =========================
   HELPER: nhận diện invoice
========================= */
function isInvoiceRequest(text: string) {
  const t = text.toLowerCase();
  return t.includes("invoice") || t.includes("hóa đơn");
}

/* =========================
   HELPER: parse invoice linh hoạt
========================= */
function parseInvoiceFromText(text: string) {
  // Tên người mua (nếu có)
  const buyerMatch =
    text.match(/anh\s+([a-zA-ZÀ-ỹ]+)/i) ||
    text.match(/chị\s+([a-zA-ZÀ-ỹ]+)/i) ||
    text.match(/cho\s+([a-zA-ZÀ-ỹ]+)/i);

  const buyer = buyerMatch ? buyerMatch[1] : "Khách hàng";

  // Bắt sản phẩm + giá (ví dụ: tivi giá 3000)
  const itemRegex =
    /([a-zA-ZÀ-ỹ\s]+?)\s*(?:giá|=)\s*(\d+)/gi;

  const items: { name: string; price: number; qty: number }[] = [];

  let match;
  while ((match = itemRegex.exec(text)) !== null) {
    items.push({
      name: match[1].trim(),
      price: Number(match[2]),
      qty: 1,
    });
  }

  // Nếu user chỉ nói "tạo invoice" → mock dữ liệu khác nhau mỗi lần
  if (items.length === 0) {
    const samples = [
      [
        { name: "Tivi Samsung", price: 3000, qty: 1 },
        { name: "Tủ lạnh LG", price: 2000, qty: 1 },
      ],
      [
        { name: "Laptop Dell", price: 1500, qty: 2 },
      ],
      [
        { name: "Điện thoại iPhone", price: 2500, qty: 1 },
        { name: "Tai nghe", price: 300, qty: 2 },
      ],
    ];
    const random =
      samples[Math.floor(Math.random() * samples.length)];
    return { buyer, items: random };
  }

  return { buyer, items };
}

/* =========================
   HELPER: build invoice HTML
========================= */
function buildInvoiceHTML(
  buyer: string,
  items: { name: string; price: number; qty: number }[]
) {
  let total = 0;

  const rows = items
    .map((i) => {
      const sum = i.price * i.qty;
      total += sum;
      return `
        <tr>
          <td>${i.name}</td>
          <td>${i.qty}</td>
          <td>${i.price.toLocaleString()} đ</td>
          <td>${sum.toLocaleString()} đ</td>
        </tr>
      `;
    })
    .join("");

  return `
<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8" />
<title>Invoice</title>
<style>
body { font-family: Arial; padding: 24px; background:#f9fafb }
h2 { margin-bottom: 8px }
table { width:100%; border-collapse:collapse; margin-top:16px; background:white }
th, td { border:1px solid #ddd; padding:8px }
th { background:#f3f4f6 }
.total { font-weight:bold }
</style>
</head>
<body>
<h2>HÓA ĐƠN BÁN HÀNG</h2>
<p><b>Khách hàng:</b> ${buyer}</p>
<p><b>Ngày:</b> ${new Date().toLocaleDateString("vi-VN")}</p>

<table>
<tr>
  <th>Sản phẩm</th>
  <th>Số lượng</th>
  <th>Đơn giá</th>
  <th>Thành tiền</th>
</tr>
${rows}
<tr class="total">
  <td colspan="3">TỔNG CỘNG</td>
  <td>${total.toLocaleString()} đ</td>
</tr>
</table>
</body>
</html>
`;
}

/* =========================
   API HANDLER
========================= */
export async function POST(req: Request) {
  try {
    const { messages = [], model } = await req.json();

    const lastUser =
      messages[messages.length - 1]?.content || "";

    // ===== CASE 1: INVOICE =====
    if (isInvoiceRequest(lastUser)) {
      const data = parseInvoiceFromText(lastUser);
      const html = buildInvoiceHTML(data.buyer, data.items);

      return NextResponse.json({
        type: "html",
        content: html,
      });
    }

    // ===== FIX CỨNG ROLE =====
    const safeMessages = messages.map((m: any) => ({
      role: m.role === "ai" ? "assistant" : m.role,
      content: m.content,
    }));

    // ===== CASE 2: CHAT =====
    const res = await openai.chat.completions.create({
      model: model || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Bạn là trợ lý tiếng Việt. Trả lời đúng trọng tâm, tự nhiên, không lan man.",
        },
        ...safeMessages,
      ],
    });

    return NextResponse.json({
      type: "text",
      content: res.choices[0].message.content,
    });
  } catch (err) {
    console.error("API ERROR:", err);
    return NextResponse.json(
      {
        type: "text",
        content: "Hệ thống tạm lỗi, vui lòng thử lại.",
      },
      { status: 500 }
    );
  }
}
