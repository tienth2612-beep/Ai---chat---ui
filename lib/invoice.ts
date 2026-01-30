export function parseInvoice(text: string) {
  const items: any[] = [];
  const regex = /(\d+)\s*(.*?)\s*giá\s*(\d+)/gi;

  let match;
  while ((match = regex.exec(text))) {
    items.push({
      name: match[2],
      qty: Number(match[1]),
      price: Number(match[3]),
    });
  }

  return items;
}
