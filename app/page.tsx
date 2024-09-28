import Carousel from "./components/Carousel";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Info from "./components/Info";
import PromptsBanner from "./components/PromptsBanner";

export default function Home() {
  return (
    <main className="overflow-hidden bg-[--black]">
      <Header />
      <Hero />
      <Carousel />
      <Info />
      <PromptsBanner />
      <FAQ />
      <Footer />
    </main>
  );
}
