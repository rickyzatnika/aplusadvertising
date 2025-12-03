// Using JS runtime (no TS types)
import { Sen } from "next/font/google";
import "./globals.css";
import Footer from "./components/section/footer";
import Navbar from "./components/navbar/navbar";

const sen = Sen({
  variable: "--font-sen",
  subsets: ["latin"],
});



export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Aplus Advertising',
    template: '%s | Aplus Advertising',
  },
  description:
    'APlus Advertising adalah perusahaan periklanan dan komunikasi visual yang membantu brand Anda tampil menonjol melalui solusi signage, neon box, digital printing, dan layanan kreatif lainnya.',
  applicationName: 'Aplus Advertising',
  keywords: [
    'Aplus Advertising',
    'periklanan',
    'komunikasi visual',
    'neon box',
    'digital printing',
    'signage',
    'branding',
    'jakarta',
    'indonesia',
  ],
  authors: [{ name: 'Aplus Advertising' }],
  creator: 'Aplus Advertising',
  publisher: 'Aplus Advertising',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: '/',
    siteName: 'Aplus Advertising',
    title: 'Aplus Advertising',
    description:
      'APlus Advertising adalah perusahaan periklanan dan komunikasi visual yang membantu brand Anda tampil menonjol melalui solusi signage, neon box, digital printing, dan layanan kreatif lainnya.',
    images: [
      {
        url: '/hero.png',
        width: 1200,
        height: 630,
        alt: 'Aplus Advertising',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@aplus_advertising',
    creator: '@aplus_advertising',
    title: 'Aplus Advertising',
    description:
      'APlus Advertising adalah perusahaan periklanan dan komunikasi visual yang membantu brand Anda tampil menonjol melalui solusi signage, neon box, digital printing, dan layanan kreatif lainnya.',
    images: ['/hero.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      maxSnippet: -1,
      maxImagePreview: 'large',
      maxVideoPreview: -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body
        className={`${sen.variable}  antialiased`}
      >
        <Navbar />
        <div className="">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
