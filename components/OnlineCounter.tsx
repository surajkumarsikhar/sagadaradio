"use client";

import { useEffect, useState } from "react";

export default function OnlineCounter() {
    const [online, setOnline] =
        useState(36);

    useEffect(() => {
        const interval = setInterval(() => {
            setOnline((current) => {
                const change =
                    Math.floor(Math.random() * 3) - 1;

                return Math.max(
                    1,
                    current + change
                );
            });
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="
        fixed left-1/2 top-5 z-20
        -translate-x-1/2
        inline-flex items-center gap-2
        rounded-full
        py-1.5 pl-3 pr-4
        text-sm font-medium
        text-white
        drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]
      "
        >

            <span className="relative flex h-2.5 w-2.5">

                <span
                    className="
            absolute inline-flex
            h-full w-full
            animate-ping
            rounded-full
            bg-green-400
            opacity-75
          "
                />

                <span
                    className="
            relative inline-flex
            h-2.5 w-2.5
            rounded-full
            bg-green-400
            shadow-[0_0_8px_rgba(74,222,128,0.9)]
          "
                />

            </span>

            <span className="tabular-nums">
                {online}
            </span>

            <span className="text-white/70">
                online
            </span>

        </div>
    );
}