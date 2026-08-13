"use client";

import {
    Pause,
    Play,
    SkipBack,
    SkipForward,
} from "lucide-react";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import YouTubePlayer from "./YouTubePlayer";

type Song = {
    id: string;
    title: string;
    thumbnail: string;
    position: number;
};

type Props = {
    songs: Song[];
};

export default function MusicPlayer({
    songs,
}: Props) {
    const [index, setIndex] =
        useState(0);

    const [playing, setPlaying] =
        useState(false);

    const [progress, setProgress] =
        useState(0);

    const [duration, setDuration] =
        useState(0);

    const playerRef =
        useRef<any>(null);

    const song = songs[index];

    useEffect(() => {
        const timer = setInterval(() => {
            if (!playerRef.current) return;

            const current =
                playerRef.current.getCurrentTime();

            const total =
                playerRef.current.getDuration();

            setProgress(current || 0);
            setDuration(total || 0);
        }, 500);

        return () => clearInterval(timer);
    }, []);

    const playSong = (songIndex: number) => {
        if (!songs[songIndex]) return;

        const selected = songs[songIndex];

        setIndex(songIndex);
        setProgress(0);

        playerRef.current?.loadVideoById(
            selected.id
        );

        playerRef.current?.playVideo();
    };

    const next = () => {
        if (!songs.length) return;

        setIndex((currentIndex) => {
            const nextIndex =
                (currentIndex + 1) % songs.length;

            const nextSong = songs[nextIndex];

            setProgress(0);

            setTimeout(() => {
                playerRef.current?.loadVideoById(
                    nextSong.id
                );

                playerRef.current?.playVideo();
            }, 0);

            return nextIndex;
        });
    };

    const previous = () => {
        if (!songs.length) return;

        setIndex((currentIndex) => {
            const previousIndex =
                currentIndex === 0
                    ? songs.length - 1
                    : currentIndex - 1;

            const previousSong =
                songs[previousIndex];

            setProgress(0);

            setTimeout(() => {
                playerRef.current?.loadVideoById(
                    previousSong.id
                );

                playerRef.current?.playVideo();
            }, 0);

            return previousIndex;
        });
    };

    const togglePlay = () => {
        if (!playerRef.current) return;

        if (playing) {
            playerRef.current.pauseVideo();
        } else {
            playerRef.current.playVideo();
        }
    };

    const seek = (
        e: React.MouseEvent<HTMLDivElement>
    ) => {
        if (!duration) return;

        const rect =
            e.currentTarget.getBoundingClientRect();

        const percent =
            (e.clientX - rect.left) /
            rect.width;

        const time =
            percent * duration;

        setProgress(time);

        playerRef.current?.seekTo(
            time,
            true
        );
    };

    const formatTime = (
        seconds: number
    ) => {
        if (!Number.isFinite(seconds)) {
            return "0:00";
        }

        const minutes =
            Math.floor(seconds / 60);

        const secs =
            Math.floor(seconds % 60);

        return `${minutes}:${secs
            .toString()
            .padStart(2, "0")}`;
    };

    if (!song) {
        return null;
    }

    return (
        <div className="relative w-full max-w-xl">

            {/* Invisible YouTube player */}

            <YouTubePlayer
                videoId={song.id}
                onReady={(player) => {
                    playerRef.current = player;
                }}
                onStateChange={(state) => {

                    if (
                        typeof window !== "undefined" &&
                        state ===
                        window.YT?.PlayerState
                            ?.PLAYING
                    ) {
                        setPlaying(true);
                    }

                    if (
                        typeof window !== "undefined" &&
                        state ===
                        window.YT?.PlayerState
                            ?.PAUSED
                    ) {
                        setPlaying(false);
                    }

                    if (
                        typeof window !== "undefined" &&
                        state ===
                        window.YT?.PlayerState
                            ?.ENDED
                    ) {
                        next();
                    }

                }}
            />

            {/* Player */}

            <div
                className="
          group relative flex
          items-center gap-4
          rounded-full p-3 pr-5

          bg-white/10
          backdrop-blur-2xl
          backdrop-saturate-150

          border border-white/20

          shadow-[0_8px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.25)]
        "
            >

                {/* Album */}

                <div className="relative h-20 w-20 shrink-0">

                    <div
                        className={`
              h-full w-full
              overflow-hidden
              rounded-full
              shadow-lg
              ring-1 ring-white/20

              ${playing
                                ? "animate-[spin_8s_linear_infinite]"
                                : ""
                            }
            `}
                    >

                        <img
                            src={song.thumbnail}
                            alt={`${song.title} artwork`}
                            className="h-full w-full object-cover"
                        />

                    </div>

                    {/* Center hole */}

                    <div
                        className="
              pointer-events-none
              absolute left-1/2 top-1/2
              h-3 w-3
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-black/70
              ring-2 ring-white/40
            "
                    />

                </div>

                {/* Song information */}

                <div className="min-w-0 flex-1">

                    <p className="truncate text-[15px] font-semibold text-white drop-shadow-sm">
                        {song.title}
                    </p>

                    <p className="truncate text-[13px] text-white/70">
                        Jhankara
                    </p>

                    {/* Progress */}

                    <div className="mt-2">

                        <div
                            className="
                group/bar
                relative
                h-2
                w-full
                cursor-pointer
              "
                            onClick={seek}
                        >

                            <div
                                className="
                  absolute inset-x-0 top-1/2
                  h-1
                  -translate-y-1/2
                  overflow-hidden
                  rounded-full
                  bg-white/20
                "
                            >

                                <div
                                    className="
                    h-full
                    rounded-full
                    bg-white/90
                  "
                                    style={{
                                        width:
                                            duration
                                                ? `${(progress / duration) * 100}%`
                                                : "0%",
                                    }}
                                />

                            </div>

                            <div
                                className="
                  absolute top-1/2
                  h-3 w-3
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-full
                  bg-white
                  opacity-0
                  shadow
                  transition-opacity
                  group-hover/bar:opacity-100
                "
                                style={{
                                    left:
                                        duration
                                            ? `${(progress / duration) * 100}%`
                                            : "0%",
                                }}
                            />

                        </div>

                        <div className="mt-1.5 text-left text-[11px] tabular-nums text-white/60">

                            {formatTime(progress)}

                            <span className="mx-1">
                                /
                            </span>

                            {formatTime(duration)}

                        </div>

                    </div>

                </div>

                {/* Controls */}

                <div className="flex items-center gap-1">

                    <button
                        type="button"
                        aria-label="Previous track"
                        onClick={previous}
                        className="
              grid h-9 w-9
              place-items-center
              rounded-full
              text-white/80
              transition
              hover:bg-white/15
              hover:text-white
              active:scale-95
            "
                    >
                        <SkipBack
                            size={18}
                            fill="currentColor"
                        />
                    </button>

                    <button
                        type="button"
                        aria-label={
                            playing
                                ? "Pause"
                                : "Play"
                        }
                        onClick={togglePlay}
                        className="
              grid h-11 w-11
              place-items-center
              rounded-full
              bg-white
              text-black
              shadow-lg
              transition
              hover:scale-105
              active:scale-95
            "
                    >

                        {playing ? (
                            <Pause
                                size={20}
                                fill="currentColor"
                            />
                        ) : (
                            <Play
                                size={20}
                                fill="currentColor"
                            />
                        )}

                    </button>

                    <button
                        type="button"
                        aria-label="Next track"
                        onClick={next}
                        className="
              grid h-9 w-9
              place-items-center
              rounded-full
              text-white/80
              transition
              hover:bg-white/15
              hover:text-white
              active:scale-95
            "
                    >
                        <SkipForward
                            size={18}
                            fill="currentColor"
                        />
                    </button>

                </div>

            </div>

        </div>
    );
}