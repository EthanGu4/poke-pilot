"use client";

export default function SpriteCard({ label, src }: { label: string; src: string | null }) {
  return (
    <div
      className="w-40 rounded-2xl border-2 border-[#2B2B2B] bg-[#FFFDF4]
                 p-3 text-center
                 shadow-[3px_3px_0_#2B2B2B]"
    >
      <div className="mb-2 text-xs font-bold tracking-wide text-[#374151]">
        {label.toUpperCase()}
      </div>

      {src ? (
        <img
          src={src}
          alt={label}
          width={120}
          height={120}
          className="mx-auto image-pixelated"
        />
      ) : (
        <div
          className="mx-auto flex h-[120px] w-[120px] items-center justify-center
                     rounded-xl border-2 border-dashed border-[#2B2B2B]
                     bg-[#F3F4F6] text-xs font-semibold text-[#6B7280]"
        >
          Not Found
        </div>
      )}
    </div>
  );
}