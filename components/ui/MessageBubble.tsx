export default function MessageBubble({ role, content }: any) {
  return (
    <div className={`bubble ${role}`}>
      {content}
    </div>
  );
}
