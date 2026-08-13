"use client";

import { useEffect, useState } from "react";
import MusicPlayer from "@/components/MusicPlayer";
import Clock from "@/components/Clock";
import OnlineCounter from "@/components/OnlineCounter";

type Song = {
  id: string;
  title: string;
  thumbnail: string;
  position: number;
};

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    async function fetchSongs() {
      try {
        const response = await fetch("/api/playlist");

        if (!response.ok) {
          throw new Error("Failed to fetch playlist");
        }

        const data = await response.json();

        setSongs(data.songs);
      } catch (error) {
        console.error(
          "Failed to load playlist:",
          error
        );
      }
    }

    fetchSongs();
  }, []);

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-between overflow-hidden">

      {/* Background */}

      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/background.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
      </div>

      {/* Clock */}

      <Clock />

      {/* Online counter */}

      <OnlineCounter />

      {/* Top links */}

      <div className="fixed right-5 z-20">
        <a
          href="https://www.instagram.com/kor8.in"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="
      block
      rounded-full
      transition
      hover:bg-white/10
      hover:scale-105
      active:scale-95
    "
        >
          <img
            src="/kor8Logo.svg"
            alt="Instagram"
            className="
        h-20
        w-20
        object-contain
        drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]
      "
          />
        </a>
      </div>

      {/* Logo */}

      <div className="mt-[14vh] flex flex-col items-center px-6">
        <h1 className="relative">

          {/* Pulsing glow */}
          <div
            className="
        absolute
        inset-0
        rounded-full
        bg-white/30
        blur-3xl
        animate-logo-glow
      "
          />

          {/* Logo */}
          <img
            src="/logo.svg"
            alt="Sagada Radio - Relive Old Days"
            className="
        relative
        h-auto
        w-[60vw]
        max-w-md
        animate-logo-pulse
      "
          />

        </h1>
      </div>

      {/* Player */}

      <div className="mb-[8vh] flex w-full justify-center px-6">

        {songs.length > 0 ? (
          <MusicPlayer songs={songs} />
        ) : (
          <div className="rounded-full bg-white/10 px-6 py-3 text-sm text-white/70 backdrop-blur-xl">
            Loading music...
          </div>
        )}

      </div>

    </main>
  );
}