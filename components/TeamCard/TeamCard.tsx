"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TeamCardProps } from "@/types/schema";

export default function TeamCard({ team, showModify }: TeamCardProps) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  async function handleDeleteConfirmed() {
    try {
      await fetch(`/api/teams/${team.id}`, { method: "DELETE" });
      setShowDeleteModal(false);
      router.refresh();
    } catch {
      setShowDeleteModal(false);
    }
  }

  async function handleEdit() {
    router.push(`/teams/${team.id}`)
  }

  return (
    <article
      style={{
        position: "relative",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 20,
        padding: 24,
        background: "white",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        maxWidth: 760,
      }}
    >
      {showModify && (
        <div
          className="absolute right-3 top-3 z-20 flex items-center gap-1 rounded-full bg-white/80 p-1 shadow"
        >
          <button
            onClick={handleEdit}
            type="button"
            className="rounded-full p-2 text-black/70 transition hover:bg-blue-100 hover:text-blue-600"
            aria-label="Edit team"
            title="Edit team"
          >
            ✏️
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            type="button"
            className="rounded-full p-2 text-black/70 transition hover:bg-red-100 hover:text-red-600"
            aria-label="Delete team"
            title="Delete team"
          >
            🗑️
          </button>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-[1000]">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowDeleteModal(false)}
          />

          <div className="relative mx-auto mt-12 w-[min(520px,92vw)] rounded-2xl bg-white p-5 shadow-xl">
            <h3 className="text-lg font-semibold">Delete team?</h3>
            <p className="mt-1 text-sm text-black/70">
              This will permanently delete <strong>{team.name}</strong>.
            </p>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-lg px-3 py-2 text-sm hover:bg-black/5"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteConfirmed}
                className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 22 }}>{team.name}</h2>
        <span style={{ fontSize: 14, opacity: 0.65 }}>
          {team.pokemon.length} / 6 Pokémon
        </span>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: 16,
        }}
      >
        {Array.from({ length: 6 }, (_, i) => i + 1).map((slot) => {
          const p = team.pokemon.find((x) => x.slot === slot);

          return (
            <div
              key={slot}
              style={{
                borderRadius: 16,
                border: "1px solid rgba(0,0,0,0.08)",
                background: "rgba(0,0,0,0.02)",
                padding: 14,
                minHeight: 140,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              {p?.sprite ? (
                <>
                  <Image
                    src={p.sprite}
                    alt={p.name}
                    width={96}
                    height={96}
                    style={{ imageRendering: "pixelated" }}
                  />
                  <div
                    style={{
                      fontSize: 14,
                      textTransform: "capitalize",
                      textAlign: "center",
                      lineHeight: 1.15,
                      fontWeight: 500,
                    }}
                  >
                    {p.name}
                  </div>
                </>
              ) : (
                <div style={{ fontSize: 14, opacity: 0.5 }}>Empty slot</div>
              )}
            </div>
          );
        })}
      </div>
    </article>
  );
}