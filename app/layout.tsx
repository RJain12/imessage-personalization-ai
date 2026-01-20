import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "iMessage Context Builder | Create Personalized AI Context",
  description: "Transform your iMessage history into a personalized AI context profile. Extract communication patterns, relationships, and personality traits to help AI assistants understand you better.",
  keywords: ["iMessage", "AI", "personalization", "context", "ChatGPT", "Claude", "messaging", "personality"],
  authors: [{ name: "iMessage Context Builder" }],
  openGraph: {
    title: "iMessage Context Builder",
    description: "Create personalized AI context from your iMessage history",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
