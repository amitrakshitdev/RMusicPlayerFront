import type { Metadata } from "next";
import "./globals.css";
import clsx from "clsx";
import App from "./App";
import BottomArea from "@/components/common/BottomArea/BottomArea";

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
         <BottomArea />
        </App>
      </body>

    </html>
  );
}
