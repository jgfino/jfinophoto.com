import type { Metadata } from "next";
import { Hind_Vadodara } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { updateThumbnailLinks } from "@/lib/db/supabase";

const hindVadodara = Hind_Vadodara({
  subsets: ["latin"],
  weight: "500",
});

export const metadata: Metadata = {
  title: "Julia Finocchiaro | Photographer",
  description:
    "Julia Finocchiaro is a Boston and NYC based photographer specializing in concert, festival, and portrait photography.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await updateThumbnailLinks();
  return (
    <html lang="en">
      <body className={`${hindVadodara.className} antialiased flex flex-row`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
