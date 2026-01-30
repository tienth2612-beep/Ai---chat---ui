import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/* =====================
   HELPERS
===================== */
function randomInvoice() {
  const buyers = ["John Doe", "Alex Nguyen", "Michael Tran"];
  const products = [
    { name: "Television", price: 3000 },
    { name: "Refrigerator", price: 2000 },
    { name: "Washing Machine", price: 1500 },
  ];

  const items = products.map((p) => ({
    ...p,
    qty: Math.floor(Math.random() * 3) + 1,
  }));

  const total = items.reduce(
    (s, i) => s + i.qty * i.price,
    0
  );

  return buildInvoiceHTML(
    buyers[Math.floor(Math.random() * buyers.length)],
    items
  );
}

function parseInvoiceFromText(text: string) {
  // ==== BUYER (KHÔNG LAN MAN) ====
  const buyerMatch = text.match(
    /(anh|chị|ông|bà)\s+([a-zA-ZÀ-ỹ\s]+?)\s+(mua|đặt)/i
  );

  const buyer = buyerMatch
    ? buyerMatch[2].trim()
    : "Customer";

  // ==== ITEMS ====
  const itemRegex =
    /(\d+)\s+([a-zA-ZÀ-ỹ\s]+?)\s+giá\s+(\d+)/gi;

  const items: {
    name: string;
    qty: number;
    price: number;
  }[] = [];

  let match;
  while ((match = itemRegex.exec(text)) !== null) {
    items.push({
      qty: Number(match[1]),
      name: match[2].trim(),
      price: Number(match[3]),
    });
  }

  if (items.length === 0) return null;

  return buildInvoiceHTML(buyer, items);
}

function buildInvoiceHTML(
  buyer: string,
  items: { name: string; qty: number; price: number }[]
) {
  const total = items.reduce(
    (s, i) => s + i.qty * i.price,
    0
  );

  return `
  <div style="font-family:Arial;padding:16px">
    <h2>Invoice</h2>
    <p><b>Buyer:</b> ${buyer}</p>
    <p><b>Date:</b> ${new Date().toLocaleDateString()}</p>

    <table border="1" cellpadding="8" cellspacing="0" width="100%">
      <tr>
        <th>Product</th>
        <th>Quantity</th>
        <th>Price</th>
        <th>Total</th>
      </tr>
      ${items
        .map(
          (i) => `
        <tr>
          <td>${i.name}</td>
          <td>${i.qty}</td>
          <td>$${i.price}</td>
          <td>$${i.qty * i.price}</td>
        </tr>`
        )
        .join("")}
      <tr>
        <td colspan="3"><b>Grand Total</b></td>
        <td><b>$${total}</b></td>
      </tr>
    </table>
  </div>
  `;
}

/* =====================
   API
===================== */
export async function POST(req: Request) {
  const { messages, model } = await req.json();
  const lastUser = messages[messages.length - 1].content;

  // CASE 1: user nói "invoice" nhưng không có dữ liệu
  if (/invoice/i.test(lastUser)) {
    const parsed = parseInvoiceFromText(lastUser);
    return NextResponse.json({
      content: "Here is your invoice.",
      preview: parsed ?? randomInvoice(),
    });
  }

  // NORMAL CHAT
  const completion = await openai.chat.completions.create({
    model,
    messages,
  });

  return NextResponse.json({
    content: completion.choices[0].message.content,
  });
}
