import type { Metadata } from "next";
import "./globals.css";
import clsx from "clsx";

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
        {children}
      </body>
    </html>
  );
}
