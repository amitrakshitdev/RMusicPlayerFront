import type { Metadata } from "next";
import "./globals.css";
import clsx from "clsx";
import MiniMusicPlayer from "@/components/YoutubeMusicPlayer/MiniMusicPlayer";
import App from "./App";

export const metadata: Metadata = {
  title: "RMusic",
  description: "Created by Amit Rakshit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className={clsx(["bg-bgDark"])}>
        <body
        className={`antialiased`}
      >
        <App>
          {children}
          <MiniMusicPlayer />
        </App>
      </body>

    </html>
  );
}
