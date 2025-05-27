import type { Metadata } from "next";
import { Sen } from "next/font/google";
import "./globals.css";
import Footer from "./components/section/footer";
import Navbar from "./components/navbar/navbar";

const sen = Sen({
  variable: "--font-sen",
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
        className={`${sen.variable}  antialiased`}
      >
        <Navbar />
        <div className="px-4 md:px-24 lg:px-32 xl:px-40">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
