import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Combat Collection",
  description: "Curated combat descriptions for tabletop RPGs"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
