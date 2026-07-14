// src/app/layout.tsx
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/Header";
import { CursorProvider } from "@/components/CursorProvider";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "SARA CSE - STUCOR",
  description:
    "The Digital Heart of the CSE Department — Stay Updated, Showcase Skills, and Engage with the Community.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/TAB.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${nunito.variable} font-sans bg-[#EAEBEE] dark:bg-[#18181B] text-[#1E293B] dark:text-[#FAFAFA]`}
      >
        <Providers>
          {/* Cursor wrapper — client-only, ssr:false lives in CursorProvider */}
          <CursorProvider />
          {/* Header lives here so it appears on every page */}
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}