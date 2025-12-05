import type { Metadata } from "next";
import {
  Geist_Mono,
  Stack_Sans_Headline,
  Stack_Sans_Text,
} from "next/font/google";
import "../globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const stackSansNotch = Stack_Sans_Headline({
  variable: "--font-stack-sans-headline",
  subsets: ["latin"],
});

const stackSansText = Stack_Sans_Text({
  variable: "--font-stack-sans-text",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "prompt2coin | AI-Powered Coin Launcher",
  description: "Generate AI images and launch Zora coins in one flow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistMono.variable} ${stackSansNotch.variable} ${stackSansText.variable} antialiased bg-foreground-tertiary/40`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
