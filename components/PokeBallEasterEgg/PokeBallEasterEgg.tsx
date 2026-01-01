"use client";

import { useEffect, useRef, useState } from "react";

export default function PokeBallEasterEgg() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  async function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (playing) {
        audio.pause();
        setPlaying(false);
      } else {
        audio.volume = 0.18;
        await audio.play(); 
        setPlaying(true);
      }
    } catch {
      setPlaying(false);
    }
  }

  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio) audio.pause();
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <audio ref={audioRef} src="/audio/pokemon-theme.mp3" preload="none" />

      <button
        type="button"
        onClick={toggleMusic}
        aria-label="Pokémon theme easter egg"
        className="relative h-16 w-16 rounded-full transition-transform hover:scale-[1.03] active:scale-95"
      >

        <div
          className={`h-full w-full animate-spin ${
            playing ? "[animation-duration:1.2s]" : "[animation-duration:6s]"
          }`}
        >
          <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-xl">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="white"
              strokeWidth="2"
              opacity="0.9"
            />
            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="#ef4444" opacity="0.95" />
            <path d="M 10 50 A 40 40 0 0 0 90 50" fill="#ffffffff" opacity="0.95" />
            <rect x="10" y="46.5" width="80" height="7" fill="black" opacity="0.9" />
            <circle cx="50" cy="50" r="12" fill="#0b0b0f" stroke="black" strokeWidth="6" />
            <circle cx="50" cy="50" r="6" fill="white" opacity="0.95" />
          </svg>
        </div>
      </button>
    </div>
  );
}