import type { Metadata } from "next";
import "./globals.css";
import clsx from "clsx";
import App from "./App";
import BottomArea from "@/components/BottomArea/BottomArea";
import Header from "@/components/Header/Header";

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
        <body className={clsx(`antialiased`, ["flex flex-col"])}
      >
        <App >
          <Header />
          {children}
         <BottomArea />
        </App>
      </body>

    </html>
  );
}
