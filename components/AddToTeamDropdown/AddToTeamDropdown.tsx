"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { EligibleTeam } from "@/types/schema";
import { useRouter } from 'next/navigation';

type Mode = "teams" | "slots";

export default function AddToTeamDropdown({ pokemonId }: { pokemonId: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [mode, setMode] = useState<Mode>("teams");
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [teams, setTeams] = useState<EligibleTeam[]>([]);
  const [teamsError, setTeamsError] = useState<string | null>(null);

  const [selectedTeam, setSelectedTeam] = useState<EligibleTeam | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [openSlots, setOpenSlots] = useState<number[]>([]);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    if (open) {
      window.addEventListener("mousedown", onMouseDown);
      window.addEventListener("keydown", onKeyDown);
    }
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setMode("teams");
      setSelectedTeam(null);
      setOpenSlots([]);
      setSlotsError(null);
      setLoadingSlots(false);
    }
  }, [open]);

  async function ensureTeamsLoaded() {
    if (teams.length > 0) return;

    setLoadingTeams(true);
    setTeamsError(null);

    try {
      const res = await fetch("/api/teams/eligible", { method: "GET" });
      if (!res.ok) throw new Error(await res.text());

      const data = (await res.json()) as { teams: EligibleTeam[] };
      setTeams(data.teams ?? []);
    } catch (e) {
      setTeamsError(e instanceof Error ? e.message : "Failed to load teams");
    } finally {
      setLoadingTeams(false);
    }
  }

  async function toggleOpen() {
    const next = !open;
    setOpen(next);
    if (!next) return;

    await ensureTeamsLoaded();
  }

  async function selectTeam(t: EligibleTeam) {
    setSelectedTeam(t);
    setMode("slots");
    setLoadingSlots(true);
    setSlotsError(null);
    setOpenSlots([]);

    try {
      const res = await fetch(`/api/teams/${t.id}/open-slots`, { method: "GET" });
      if (!res.ok) throw new Error(await res.text());

      const data = (await res.json()) as { 
        slots: { slot: number }[]; 
      };

      setOpenSlots(data.slots.map(s => s.slot) ?? []);

    } catch (e) {
      setSlotsError(e instanceof Error ? e.message : "Failed to load open slots");
    } finally {
      setLoadingSlots(false);
    }
  }

  function backToTeams() {
    setMode("teams");
    setSelectedTeam(null);
    setOpenSlots([]);
    setSlotsError(null);
    setLoadingSlots(false);
  }

  async function handleAddPokemon(
    pokemonId: number,
    teamId: string,
    slotNumber: number
  ) {

    const res = await fetch("/api/pokemon/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pokemonId, teamId, slotNumber }),
    });

    if (!res.ok) throw new Error(await res.text());
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={toggleOpen}
        className="inline-flex items-center gap-2 rounded-lg border-2 border-[#2B2B2B] bg-white px-3 py-2 text-sm font-semibold shadow-[3px_3px_0_#2B2B2B] transition hover:bg-[#FFF3B0] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0_#2B2B2B]"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span aria-hidden>➕</span>
        Add to Team
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-[min(420px,92vw)] overflow-hidden rounded-2xl border-2 border-[#2B2B2B] bg-white shadow-[6px_6px_0_#2B2B2B]"
          role="menu"
        >
          <div className="border-b-2 border-[#2B2B2B] bg-[#FFF3B0] px-4 py-3">
            {mode === "teams" ? (
              <div className="text-sm font-extrabold tracking-wide">Choose a team</div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-extrabold tracking-wide">Choose a slot</div>
                  {selectedTeam && (
                    <div className="mt-1 truncate text-xs font-semibold text-black/70">
                      {selectedTeam.name} • {selectedTeam.team_size}/6
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={backToTeams}
                  className="rounded-lg border border-black/20 bg-white px-2 py-1 text-xs font-extrabold text-black/70 hover:bg-black/5"
                >
                  ← Back
                </button>
              </div>
            )}
          </div>

          <div className="max-h-[320px] overflow-auto p-2">
            {mode === "teams" && (
              <>
                {loadingTeams && (
                  <div className="px-3 py-4 text-sm font-semibold text-black/70">
                    Loading teams…
                  </div>
                )}

                {!loadingTeams && teamsError && (
                  <div className="px-3 py-4 text-sm font-semibold text-red-700">
                    {teamsError}
                  </div>
                )}

                {!loadingTeams && !teamsError && teams.length === 0 && (
                  <div className="px-3 py-4 text-sm font-semibold text-black/70">
                    No eligible teams yet.{" "}
                    <Link href="/teams" className="underline">
                      Go to Teams
                    </Link>
                  </div>
                )}

                {!loadingTeams &&
                  !teamsError &&
                  teams.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        void selectTeam(t);
                      }}
                      className="group flex w-full items-center justify-between rounded-xl border border-black/10 bg-[#FFFDF4] px-3 py-3 text-left transition hover:border-black/20 hover:bg-[#F7F5E8]"
                      role="menuitem"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-extrabold text-black/80">
                          {t.name}
                        </div>
                        <div className="mt-1 text-xs font-semibold text-black/60">
                          Team ID:{" "}
                          <span className="font-mono">{t.id.slice(0, 8)}…</span>
                        </div>
                      </div>

                      <div className="ml-3 shrink-0 rounded-full border border-black/20 bg-white px-2 py-1 text-xs font-extrabold text-black/70">
                        {t.team_size}/6
                      </div>
                    </button>
                  ))}
              </>
            )}

            {mode === "slots" && (
              <>
                {loadingSlots && (
                  <div className="px-3 py-4 text-sm font-semibold text-black/70">
                    Loading open slots…
                  </div>
                )}

                {!loadingSlots && slotsError && (
                  <div className="px-3 py-4 text-sm font-semibold text-red-700">
                    {slotsError}
                  </div>
                )}

                {!loadingSlots && !slotsError && selectedTeam && openSlots.length === 0 && (
                  <div className="px-3 py-4 text-sm font-semibold text-black/70">
                    This team is full (6/6). Pick another team or edit it.
                    <div className="mt-2">
                      <Link href="/teams" className="underline">
                        Manage teams →
                      </Link>
                    </div>
                  </div>
                )}

                {!loadingSlots &&
                  !slotsError &&
                  selectedTeam &&
                  openSlots.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 p-1">
                      {openSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"

                          onClick={() => {
                            handleAddPokemon(pokemonId, selectedTeam.id, slot);
                            setOpen(false);
                            router.push(`/teams/${selectedTeam.id}`);
                          }}
                          className="rounded-xl border border-black/10 bg-[#FFFDF4] px-3 py-3 text-left transition hover:border-black/20 hover:bg-[#F7F5E8]"
                          role="menuitem"
                        >
                          <div className="text-xs font-extrabold text-black/70">
                            Slot
                          </div>
                          <div className="text-lg font-black text-black/80">
                            {slot}
                          </div>
                          <div className="mt-1 text-[11px] font-semibold text-black/60">
                            Empty
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
              </>
            )}
          </div>

          <div className="border-t-2 border-[#2B2B2B] bg-white px-4 py-3 text-right">
            <Link href="/teams" className="text-sm font-semibold underline">
              Manage teams →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
