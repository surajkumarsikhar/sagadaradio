"use client";

import { useEffect, useRef } from "react";

declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady?: () => void;
    }
}

type Props = {
    videoId: string;
    onReady: (player: any) => void;
    onStateChange: (state: number) => void;
};

export default function YouTubePlayer({
    videoId,
    onReady,
    onStateChange,
}: Props) {
    const container =
        useRef<HTMLDivElement>(null);

    const player =
        useRef<any>(null);

    useEffect(() => {
        const createPlayer = () => {
            if (!container.current) return;

            player.current =
                new window.YT.Player(
                    container.current,
                    {
                        videoId,

                        playerVars: {
                            autoplay: 0,
                            controls: 0,
                            disablekb: 1,
                            fs: 0,
                            playsinline: 1,
                            rel: 0,
                            modestbranding: 1,
                        },

                        events: {
                            onReady: (event: any) => {
                                onReady(event.target);
                            },

                            onStateChange: (
                                event: any
                            ) => {
                                onStateChange(
                                    event.data
                                );
                            },
                        },
                    }
                );
        };

        if (window.YT?.Player) {
            createPlayer();
        } else {
            window.onYouTubeIframeAPIReady =
                createPlayer;

            const script =
                document.createElement("script");

            script.src =
                "https://www.youtube.com/iframe_api";

            document.body.appendChild(
                script
            );
        }

        return () => {
            if (player.current) {
                player.current.destroy();
            }
        };
    }, []);

    return (
        <div
            ref={container}
            className="
        pointer-events-none
        absolute
        h-px
        w-px
        overflow-hidden
        opacity-0
      "
        />
    );
}