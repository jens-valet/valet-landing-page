import type { Metadata, Viewport } from "next";
import { DM_Mono, Outfit, Saira_Extra_Condensed } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-outfit",
  display: "swap",
});

const sairaExtraCondensed = Saira_Extra_Condensed({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-saira",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Valet · Drive more, stress less.",
  description:
    "The modern homebase for collector-car ownership. Value intelligence, maintenance planning, and enthusiast community, all driven by your VIN.",
  openGraph: {
    title: "Valet",
    description:
      "Drive more, stress less. The modern homebase for collector-car ownership.",
  },
};

export const viewport: Viewport = {
  themeColor: "#1e332b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${sairaExtraCondensed.variable} ${dmMono.variable}`}
    >
      <head>
        {/* Tab icon: `app/icon.svg` → `/icon.svg`; explicit link helps browsers that skip metadata injection. */}
        <link rel="icon" href="/icon.svg" type="image/svg+xml" sizes="any" />
        {/* Pitch deck uses inline fontFamily names (Outfit, Saira, …); one stylesheet for all routes. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- app Router root layout; next/font doesn't map string names used in copied deck */}
        <link
          href="https://fonts.googleapis.com/css2?family=Saira+Extra+Condensed:ital,wght@0,100;0,800;1,100;1,800&family=Saira:ital,wght@0,100;0,400;0,700;1,100;1,400&family=Outfit:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
