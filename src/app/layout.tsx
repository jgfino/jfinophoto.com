import type { Metadata } from "next";
import { Hind_Vadodara } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";

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
  return (
    <html lang="en" className="h-full">
      <body className={`${hindVadodara.className} antialiased flex flex-col`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
