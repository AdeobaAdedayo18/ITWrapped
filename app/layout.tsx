import type { Metadata } from "next";
import { Geist, Geist_Mono, MuseoModerno } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/NavBar";
import { LogoCacheProvider } from "@/components/LogoCacheProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const museoModerno = MuseoModerno({
  variable: "--font-museo-moderno",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
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
      <head>
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="7cec2d00-3a82-42f7-9c00-a521f34367f9"
        ></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${museoModerno.variable} antialiased`}
      >
        <LogoCacheProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            {children}
          </div>
        </LogoCacheProvider>
      </body>
    </html>
  );
}
