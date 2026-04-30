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
      <body>{children}</body>
    </html>
  );
}
