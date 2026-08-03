import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.midwellbeing.com"),
  title: "MID Wellbeing – Moderni tekoälypohjainen työhyvinvointiratkaisu",
  description: "Tekoälyä työhyvinvoinnin tueksi.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: "MID Wellbeing",
    title: "MID Wellbeing – Moderni tekoälypohjainen työhyvinvointiratkaisu",
    description: "Tekoälyä työhyvinvoinnin tueksi.",
    images: [{ url: "/mid-wellbeing-og.png", width: 1200, height: 630, alt: "MID Wellbeing" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MID Wellbeing – Moderni tekoälypohjainen työhyvinvointiratkaisu",
    description: "Tekoälyä työhyvinvoinnin tueksi.",
    images: ["/mid-wellbeing-og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fi"><body>{children}</body></html>;
}
