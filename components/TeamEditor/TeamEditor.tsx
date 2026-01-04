"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { TeamEditorProps } from "@/types/schema";

export default function TeamEditor({ team, pokemon }: TeamEditorProps) {
  const router = useRouter();
  const [name, setName] = useState(team.name);

  const slots = useMemo(() => {
    const map = new Map<number, (typeof pokemon)[number]>();
    for (const p of pokemon) map.set(p.slot, p);
    return map;
  }, [pokemon]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name === team.name) return;

    await fetch(`/api/teams/${team.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    router.refresh();
  }

  async function clearSlot(slot: number) {
    const res = await fetch(`/api/teams/${team.id}/${slot}`, {
      method: "DELETE",
    });
    if (res.ok) router.refresh();
  }

  return (
    <section className="rounded-2xl border border-orange-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <form onSubmit={handleSubmit} className="flex flex-1 gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-zinc-700">
              Team name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-orange-200 bg-white px-3 py-2 text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>

          <button
            type="submit"
            className="self-end rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-zinc-800 shadow-sm hover:bg-orange-100 active:translate-y-[1px]"
          >
            Save
          </button>
        </form>

        <Link href="/teams">
        <button
            type="button"
            className="rounded-xl border border-orange-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-orange-50 active:translate-y-[1px]"
        >
            ← Back
        </button>
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }, (_, i) => i + 1).map((slot) => {
          const p = slots.get(slot);

          return (
            <div
              key={slot}
              className={[
                "relative rounded-xl border p-3 text-center",
                p
                  ? "border-orange-200 bg-orange-50/60"
                  : "border-orange-200 border-dashed bg-white",
              ].join(" ")}
            >
              <div className="absolute left-2 top-2 rounded-md border border-orange-200 bg-white px-2 py-0.5 text-[11px] text-zinc-600">
                #{slot}
              </div>

              <div className="mt-4 flex min-h-[120px] flex-col items-center justify-center gap-2">
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
                    <div className="text-xs text-zinc-500">
                      #{p.pokemon_id}
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-zinc-500">empty</div>
                )}
              </div>

              <div className="mt-3 flex gap-2">
                {!p && (
                  <Link
                    href={`/catalog`}
                    className="flex-1"
                  >
                    <button
                      type="button"
                      className="w-full rounded-lg border border-orange-200 bg-white px-2 py-1.5 text-xs font-medium text-zinc-700 shadow-sm hover:bg-orange-50 active:translate-y-[1px]"
                    >
                      Add
                    </button>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => clearSlot(slot)}
                  disabled={!p}
                  className={[
                    "rounded-lg px-2 py-1.5 text-xs font-medium shadow-sm",
                    p
                      ? "w-full border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 active:translate-y-[1px]"
                      : "w-auto cursor-not-allowed border border-zinc-200 bg-zinc-100 text-zinc-400",
                  ].join(" ")}
                >
                  Clear
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
