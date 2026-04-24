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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://omo-what-now.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "OmOCon · What now?",
  description: "자원봉사자 시프트 조회 — 이름 입력하면 시간별 할 일을 알려드립니다.",
  openGraph: {
    title: "OmOCon · What now?",
    description: "자원봉사자 시프트 조회 — 이름 입력하면 시간별 할 일을 알려드립니다.",
    type: "website",
    locale: "ko_KR",
    siteName: "OmOCon",
  },
  twitter: {
    card: "summary_large_image",
    title: "OmOCon · What now?",
    description: "자원봉사자 시프트 조회 — 이름 입력하면 시간별 할 일을 알려드립니다.",
  },
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
