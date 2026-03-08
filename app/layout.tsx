import type { Metadata } from "next";
import { Cormorant_Garamond, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "../styles/globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CalSpaces — Your time, restructured.",
  description:
    "Voice-dump everything on your plate. CalSpaces intelligently organizes your calendar around your life, learns how you work, and optimizes your schedule over time.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "CalSpaces",
    description:
      "Speak freely. Schedule intelligently. AI that turns your voice into a perfectly organized week.",
    url: "https://calspaces.com",
    images: [{ url: "https://calspaces.com/og-image.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${instrument.variable} ${jetbrains.variable}`}
    >
      <body className="font-body text-foreground antialiased">{children}</body>
    </html>
  );
}
