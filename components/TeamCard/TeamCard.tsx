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

  function handleEdit() {
    router.push(`/teams/${team.id}`);
  }

  return (
    <article className="relative rounded-2xl border border-orange-200 bg-white p-5 shadow-sm">
      {showModify && (
        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-xl border border-orange-200 bg-white p-1 shadow-sm">
          <button
            onClick={handleEdit}
            type="button"
            className="grid h-9 w-9 place-items-center rounded-lg text-zinc-700 hover:bg-orange-50 active:translate-y-[1px]"
            aria-label="Edit team"
            title="Edit team"
          >
            ✏️
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            type="button"
            className="grid h-9 w-9 place-items-center rounded-lg text-zinc-700 hover:bg-rose-50 hover:text-rose-700 active:translate-y-[1px]"
            aria-label="Delete team"
            title="Delete team"
          >
            🗑️
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
            {team.name}
          </h2>
        </div>

        <div className="w-fit rounded-xl border border-orange-200 bg-orange-50 px-3 py-1 text-sm text-zinc-700">
          {team.pokemon.length} / 6
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }, (_, i) => i + 1).map((slot) => {
          const p = team.pokemon.find((x) => x.slot === slot);

          return (
            <div
              key={slot}
              className={[
                "relative rounded-xl border p-3 text-center",
                p?.sprite
                  ? "border-orange-200 bg-orange-50/60"
                  : "border-orange-200 border-dashed bg-white",
              ].join(" ")}
            >
              <div className="absolute left-2 top-2 rounded-md border border-orange-200 bg-white px-2 py-0.5 text-[11px] text-zinc-600">
                #{slot}
              </div>

              <div className="mt-4 flex min-h-[110px] flex-col items-center justify-center gap-2">
                {p?.sprite ? (
                  <>
                    <Image
                      src={p.sprite}
                      alt={p.name}
                      width={88}
                      height={88}
                      style={{ imageRendering: "pixelated" }}
                      className="select-none"
                    />
                    <div className="text-sm font-medium capitalize text-zinc-800">
                      {p.name}
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-zinc-500">empty</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-[1000] p-6 sm:p-10">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowDeleteModal(false)}
          />

          <div className="relative mx-auto w-full max-w-md rounded-2xl border border-orange-200 bg-white p-5 shadow-xl">
            <div className="text-lg font-semibold text-zinc-900">Delete team?</div>
            <div className="mt-2 text-sm text-zinc-600">
              This will permanently delete{" "}
              <span className="font-semibold text-zinc-900">{team.name}</span>.
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-xl border border-orange-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm hover:bg-orange-50 active:translate-y-[1px]"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteConfirmed}
                className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 shadow-sm hover:bg-rose-100 active:translate-y-[1px]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
