export default function PreviewPanel({ html }: { html: string }) {
  return (
    <aside className="preview">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </aside>
  );
}
