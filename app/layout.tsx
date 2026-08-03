import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MID Wellbeing – Moderni tekoälypohjainen työhyvinvointiratkaisu",
  description: "Tekoälyä työhyvinvoinnin tueksi.",
  icons: { icon: "/webflow-logo.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fi"><body>{children}</body></html>;
}
