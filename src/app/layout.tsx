import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import "./globals.css";
import "./soft-theme.css";

export const metadata: Metadata = {
  title: "BiogasFit — A clearer first step for biogas",
  description: "A concept prototype that helps Nigerian households prepare for a professional biogas site survey.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
