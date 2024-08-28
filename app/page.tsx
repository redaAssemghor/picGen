import Image from "next/image";
import PdfReader from "./components/PdfReader";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2">
      main
      <PdfReader />
    </main>
  );
}
