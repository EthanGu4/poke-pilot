"use client";

export default function SpriteCard({ label, src }: { label: string; src: string | null }) {
  return (
    <div
      style={{
        width: 160,
        border: "1px solid #e5e5e5",
        borderRadius: 12,
        padding: 12,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 13, opacity: 0.75, marginBottom: 8 }}>{label}</div>
      {src ? (
        <img src={src} alt={label} width={120} height={120} />
      ) : (
        <div
          style={{
            width: 120,
            height: 120,
            margin: "0 auto",
            display: "grid",
            placeItems: "center",
            border: "1px dashed #ccc",
            borderRadius: 12,
            fontSize: 12,
            opacity: 0.7,
          }}
        >
          No sprite
        </div>
      )}
    </div>
  );
}