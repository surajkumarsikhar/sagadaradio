import { NextResponse } from "next/server";

type YouTubePlaylistItem = {
    snippet: {
        title: string;
        position: number;
        thumbnails?: {
            maxres?: { url: string };
            high?: { url: string };
            medium?: { url: string };
        };
        resourceId?: {
            videoId?: string;
        };
    };
};

export async function GET() {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const playlistId = process.env.YOUTUBE_PLAYLIST_ID;

    if (!apiKey || !playlistId) {
        return NextResponse.json(
            {
                error:
                    "Missing YOUTUBE_API_KEY or YOUTUBE_PLAYLIST_ID",
            },
            { status: 500 }
        );
    }

    try {
        const songs = [];
        let nextPageToken = "";

        do {
            const url = new URL(
                "https://www.googleapis.com/youtube/v3/playlistItems"
            );

            url.searchParams.set(
                "part",
                "snippet,contentDetails"
            );

            url.searchParams.set(
                "playlistId",
                playlistId
            );

            url.searchParams.set(
                "maxResults",
                "50"
            );

            url.searchParams.set(
                "key",
                apiKey
            );

            if (nextPageToken) {
                url.searchParams.set(
                    "pageToken",
                    nextPageToken
                );
            }

            const response = await fetch(url.toString(), {
                next: {
                    revalidate: 300,
                },
            });

            if (!response.ok) {
                const error = await response.text();

                return NextResponse.json(
                    {
                        error: "YouTube API request failed",
                        details: error,
                    },
                    { status: response.status }
                );
            }

            const data = await response.json();

            for (const item of data.items as YouTubePlaylistItem[]) {
                const videoId =
                    item.snippet.resourceId?.videoId;

                if (!videoId) continue;

                const thumbnail =
                    item.snippet.thumbnails?.maxres?.url ??
                    item.snippet.thumbnails?.high?.url ??
                    item.snippet.thumbnails?.medium?.url ??
                    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

                songs.push({
                    id: videoId,
                    title: item.snippet.title,
                    thumbnail,
                    position: item.snippet.position,
                });
            }

            nextPageToken =
                data.nextPageToken ?? "";

        } while (nextPageToken);

        return NextResponse.json({
            songs,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error: "Something went wrong",
            },
            { status: 500 }
        );
    }
}