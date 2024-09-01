import Header from "./components/Header";
import Container from "./components/Container";

export default async function Home() {
  return (
    <main className="w-screen overflow-hidden">
      <Header />
      <Container />
    </main>
  );
}
