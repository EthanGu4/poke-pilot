export default function MoveCard({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <p style={{ opacity: 0.6 }}>None</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((name) => (
        <span
          key={name}
          className="rounded-lg border-2 border-[#2B2B2B]
                     bg-[#FFFDF4]
                     px-3 py-1.5
                     text-xs font-semibold
                     capitalize text-[#374151]
                     shadow-[2px_2px_0_#2B2B2B]"
        >
          {name}
        </span>
      ))}
    </div>
  );
}