import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PipelinePulse | Data Pipeline Monitoring",
  description: "A simple, business-friendly dashboard to monitor pipeline health, data freshness, and SLA compliance across your stack.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased bg-[#05050f] text-white min-h-screen selection:bg-purple-500/30`}>
        {children}
      </body>
    </html>
  );
}
