export const metadata = {
  title: 'Beranda',
  description:
    'Aplus Advertising: Solusi periklanan dan komunikasi visual. Neon box, signage, digital printing, dan layanan kreatif untuk kebutuhan brand Anda.',
  alternates: { canonical: '/' },
}

import AboutUs from "./components/section/aboutUs";
import Contact from "./components/section/contact";
import Header from "./components/section/header";
import OurServices from "./components/section/ourServices";
import ErrorHandler from "./components/ErrorHandler";
import { Suspense } from 'react';

export default function Home() {
  return (
    <>
      <Suspense>
        <ErrorHandler />
      </Suspense>
      <Header />
      {/* Our Services */}
      <OurServices />
      {/* AboutUs */}
      <AboutUs />
      {/* Contact */}
      <Contact />
    </>
  );
}
