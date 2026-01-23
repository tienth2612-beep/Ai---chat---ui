// BẮT BUỘC chạy Node.js
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import {Ollama} from "ollama";

/* =========================
   INIT OLLAMA (CHUẨN)
========================= */
const ollama = new Ollama({
  host: "http://127.0.0.1:11434",
});
/* =========================
   INVOICE DETECT
========================= */
function isInvoiceRequest(text: string) {
  return /invoice|hóa đơn/i.test(text);
}

/* =========================
   PARSE INVOICE (KHÔNG RANDOM SAI)
========================= */
function parseInvoice(text: string) {
  // Người mua: bắt sau từ "cho"
  const buyerMatch = text.match(/cho\s+(anh|chị)?\s*([A-Za-zÀ-ỹ]+)/i);
  const buyer = buyerMatch ? buyerMatch[2] : "Khách hàng";

  const productMap: Record<string, string> = {
    "máy tính": "Máy tính",
    "laptop": "Laptop",
    "tivi": "Tivi",
    "tủ lạnh": "Tủ lạnh",
    "loa": "Loa",
    "điện thoại": "Điện thoại",
  };

  const itemRegex =
    /(\d+)?\s*(máy tính|laptop|tivi|tủ lạnh|loa|điện thoại).*?giá\s*(\d+)/gi;

  const items: any[] = [];
  let m;

  while ((m = itemRegex.exec(text))) {
    items.push({
      name: productMap[m[2]],
      qty: m[1] ? Number(m[1]) : 1,
      price: Number(m[3]),
    });
  }

  return { buyer, items };
}

/*RANDOM INVOICE KHI USER KHÔNG NHẬP DỮ LIỆU */
function randomInvoice() {
  const names = ["Nam", "Việt", "An", "Minh", "Hùng"];
  const products = [
    { name: "Laptop", price: 8000 },
    { name: "Tivi", price: 6000 },
    { name: "Tủ lạnh", price: 7000 },
    { name: "Điện thoại", price: 5000 },
  ];

  const buyer = names[Math.floor(Math.random() * names.length)];
  const count = 1 + Math.floor(Math.random() * 2);

  const items = Array.from({ length: count }).map(() => {
    const p = products[Math.floor(Math.random() * products.length)];
    return { ...p, qty: 1 };
  });

  return { buyer, items };
}

/* BUILD HTML INVOICE KHI USER NHẬP DỮ LIỆU */
function buildInvoiceHTML(buyer: string, items: any[]) {
  let total = 0;

  const rows = items
    .map((i) => {
      const sum = i.qty * i.price;
      total += sum;
      return `
      <tr>
        <td>${i.name}</td>
        <td>${i.qty}</td>
        <td>${i.price}</td>
        <td>${sum}</td>
      </tr>`;
    })
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>Invoice</title>
<style>
body{font-family:Arial;padding:20px}
table{width:100%;border-collapse:collapse;margin-top:12px}
th,td{border:1px solid #ccc;padding:8px;text-align:left}
th{background:#f3f3f3}
.total{font-weight:bold}
</style>
</head>
<body>
<h2>HÓA ĐƠN</h2>
<p><b>Người mua:</b> ${buyer}</p>
<p><b>Ngày:</b> ${new Date().toLocaleDateString()}</p>

<table>
<tr>
<th>Sản phẩm</th>
<th>Số lượng</th>
<th>Đơn giá</th>
<th>Thành tiền</th>
</tr>
${rows}
<tr class="total">
<td colspan="3">TỔNG</td>
<td>${total}</td>
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
  const { messages, model } = await req.json();
  const last = messages[messages.length - 1]?.content || "";

  /* ===== INVOICE ===== */
  if (isInvoiceRequest(last)) {
    let data = parseInvoice(last);

    // CHỈ RANDOM KHI USER KHÔNG NHẬP GIÁ
    if (data.items.length === 0) {
      data = randomInvoice();
    }

    const html = buildInvoiceHTML(data.buyer, data.items);

    return NextResponse.json({
      type: "html",
      content: html,
    });
  }

  /* ===== CHAT (NGẮN – ĐÚNG TRỌNG TÂM) ===== */
  const res = await ollama.chat({
    model: model || "llama3",
    messages: [
      {
        role: "system",
        content:
          "Bạn là trợ lý tiếng Việt. Trả lời đúng trọng tâm, không lan man, không giải thích thừa.",
      },
      ...messages,
    ],
  });

  return NextResponse.json({
    type: "text",
    content: res.message?.content || "",
  });
}
