export default function InvoicePreview({ items }: { items: any[] }) {
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, marginTop: 12 }}>
      <h3>Invoice</h3>
      {items.map((i, idx) => (
        <p key={idx}>
          {i.qty} × {i.name} = {i.qty * i.price}
        </p>
      ))}
      <strong>Total: {total}</strong>
    </div>
  );
}
