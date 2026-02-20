import type { Metadata } from "next";
import Link from "next/link";
import { Playfair_Display, Space_Grotesk } from "next/font/google";
import { CommandPalette } from "@/components/CommandPalette";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ReducedMotionProvider } from "@/components/ReducedMotionProvider";
import "./globals.css";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const sans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "Construction Animation Studio",
  description:
    "Premium cinematic construction storytelling with gallery, timeline, exhibition mode, and video export.",
  metadataBase: new URL("http://127.0.0.1:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable} bg-ink text-zinc-100 antialiased`}>
        <ReducedMotionProvider>
          <ErrorBoundary>
            <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/90 backdrop-blur">
              <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
                <Link href="/" className="font-display text-lg tracking-wide text-white">
                  Art Construction Studio
                </Link>
                <nav className="flex items-center gap-3 text-sm text-zinc-300">
                  <Link href="/gallery" className="hover:text-white">Gallery</Link>
                  <Link href="/exhibition" className="hover:text-white">Exhibition</Link>
                </nav>
              </div>
            </header>
            <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
            <CommandPalette />
          </ErrorBoundary>
        </ReducedMotionProvider>
      </body>
    </html>
  );
}
