import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/section/footer";
import Navbar from "./components/navbar/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aplus Advertising",
  description: "APlus Advertising adalah perusahaan yang bergerak di bidang periklanan dan komunikasi visual, hadir untuk membantu brand Anda tampil menonjol di tengah persaingan pasar yang semakin dinamis. Berdiri sejak tahun 2015, kami telah menjadi mitra terpercaya berbagai perusahaan, instansi, dan pelaku usaha dalam membangun citra serta menjangkau audiens yang tepat.",
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
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
