import type { Metadata } from "next";
import Head from 'next/head';
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DANCHI Peer",
  description: "だんちぴあで想いを送ろう。",
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <title>DANCHI Peer</title>
        <meta name="description" content="だんちぴあで想いを送ろう。" />
        <link rel="icon" href="/icon.png" />
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
