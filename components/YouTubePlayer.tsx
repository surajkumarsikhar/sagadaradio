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
    const containerRef =
        useRef<HTMLDivElement>(null);

    const playerRef =
        useRef<any>(null);

    const onReadyRef =
        useRef(onReady);

    const onStateChangeRef =
        useRef(onStateChange);

    useEffect(() => {
        onReadyRef.current = onReady;
        onStateChangeRef.current =
            onStateChange;
    }, [onReady, onStateChange]);

    useEffect(() => {
        let target: HTMLDivElement | null = null;

        const createPlayer = () => {
            if (
                !containerRef.current ||
                playerRef.current
            ) {
                return;
            }

            // Create a DOM node that React does NOT manage.
            target =
                document.createElement("div");

            containerRef.current.appendChild(
                target
            );

            playerRef.current =
                new window.YT.Player(
                    target,
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
                                onReadyRef.current(
                                    event.target
                                );
                            },

                            onStateChange: (
                                event: any
                            ) => {
                                onStateChangeRef.current(
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
            const previous =
                window.onYouTubeIframeAPIReady;

            window.onYouTubeIframeAPIReady =
                () => {
                    previous?.();
                    createPlayer();
                };

            const existingScript =
                document.querySelector(
                    'script[src="https://www.youtube.com/iframe_api"]'
                );

            if (!existingScript) {
                const script =
                    document.createElement(
                        "script"
                    );

                script.src =
                    "https://www.youtube.com/iframe_api";

                script.async = true;

                document.body.appendChild(
                    script
                );
            }
        }

        return () => {
            /*
             * Don't let React and YouTube
             * fight over the same DOM node.
             */

            if (playerRef.current) {
                try {
                    playerRef.current.stopVideo();
                    playerRef.current.destroy();
                } catch {
                    // YouTube may already have
                    // removed its iframe.
                }

                playerRef.current = null;
            }

            if (
                target &&
                target.parentNode
            ) {
                target.parentNode.removeChild(
                    target
                );
            }

            target = null;
        };
    }, []);

    return (
        <div
            ref={containerRef}
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