import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppLayoutClient } from "@/components/layout/AppLayoutClient";
import { LogoCacheProvider } from "@/components/LogoCacheProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ITWrapped",
  description: "Your Internship Wrapped",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LogoCacheProvider>
          <AppLayoutClient>{children}</AppLayoutClient>
        </LogoCacheProvider>
      </body>
    </html>
  );
}
