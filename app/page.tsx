import Image from "next/image";
import ImageOutput from "./components/ImageOutput";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2">
      <ImageOutput />
    </main>
  );
}
