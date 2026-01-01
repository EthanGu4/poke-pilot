export default function AbilityCard({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <p style={{ opacity: 0.6 }}>None</p>;
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {items.map((name) => (
        <span
          key={name}
          style={{
            border: "1px solid #ddd",
            borderRadius: 999,
            padding: "6px 10px",
            fontSize: 13,
            background: "#fafafa",
            textTransform: "capitalize",
          }}
        >
          {name}
        </span>
      ))}
    </div>
  );
}