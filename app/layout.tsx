import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://yourdomain.com"),

  title: {
    default: "Sagada Radio",
    template: "%s | Sagada Radio",
  },

  description:
    "Sagada Radio — a nostalgic collection of old Odia songs, music, and memories from Odisha.",

  applicationName: "Sagada Radio",

  keywords: [
    "Sagada Radio",
    "Odia songs",
    "old Odia songs",
    "Odia music",
    "Odia old songs",
    "Odia classics",
    "Odisha music",
    "90s Odia songs",
    "retro Odia songs",
  ],

  authors: [
    {
      name: "Suraj Kumar Sikhar",
    },
  ],

  creator: "Suraj Kumar Sikhar",

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.sagadaradio.fun/",
    siteName: "Sagada Radio",

    title: "Sagada Radio",

    description:
      "A nostalgic collection of old Odia songs and timeless music from Odisha.",

    images: [
      {
        url: "/opengraph.png",
        width: 1200,
        height: 675,
        alt: "Sagada Radio — Old Odia Songs",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Sagada Radio",

    description:
      "A nostalgic collection of old Odia songs and timeless music from Odisha.",

    images: ["/opengraph.png"],
  },

  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/favicon-32x32.png",
        type: "image/png",
        sizes: "32x32",
      },
      {
        url: "/favicon-16x16.png",
        type: "image/png",
        sizes: "16x16",
      },
    ],

    apple: "/apple-touch-icon.png",
  },

  manifest: "/site.webmanifest",

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}