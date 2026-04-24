import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { ThemeScript } from "@/components/ThemeScript";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "OmOCon · What now?",
  description: "자원봉사자 시프트 조회 — 이름 입력하면 시간별 할 일을 알려드립니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body
        className={`${inter.variable} ${instrumentSerif.variable} antialiased min-h-dvh`}
      >
        {children}
      </body>
    </html>
  );
}
