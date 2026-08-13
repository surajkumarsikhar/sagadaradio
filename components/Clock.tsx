"use client";

import { useEffect, useState } from "react";

export default function Clock() {
    const [time, setTime] = useState("");

    useEffect(() => {
        const update = () => {
            const now = new Date();

            setTime(
                now.toLocaleTimeString("en-IN", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                })
            );
        };

        update();

        const interval = setInterval(update, 1000);

        return () => clearInterval(interval);
    }, []);

    const [hourMinute, period] =
        time.split(" ");

    const [hour, minute] =
        hourMinute?.split(":") ?? [];

    return (
        <div className="fixed left-5 top-5 z-20 text-sm font-medium tabular-nums text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">

            {hour}

            <span className="animate-[blink_1s_step-end_infinite]">
                :
            </span>

            {minute}

            <span className="ml-1.5 text-white/70">
                {period}
            </span>

        </div>
    );
}