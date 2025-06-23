import type { Metadata } from "next";
import "./globals.css";
import ClientProvider from "@/lib/ClientProvider"; // ✅ adjust path if needed

import Script from "next/script";

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://accounts.google.com/gsi/client"
          async
          defer
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
