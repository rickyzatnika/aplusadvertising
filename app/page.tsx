
import AboutUs from "./components/section/aboutUs";
import Header from "./components/section/header";
import OurServices from "./components/section/ourServices";

export default function Home() {
  return (
    <>
      <Header />
      {/* Our Services */}
      <OurServices />
      {/* AboutUs */}
      <AboutUs />
    </>
  );
}
