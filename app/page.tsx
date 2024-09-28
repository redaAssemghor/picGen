import Carousel from "./components/Carousel";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";

export default function Home() {
  return (
    <main className="overflow-hidden bg">
      <Header />
      <Hero />
      <Carousel />
      <Footer />
    </main>
  );
}
