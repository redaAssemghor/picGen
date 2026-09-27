import { Suspense } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Studio from "../components/Studio";
export default function GeneratePage() {
  return <><Header /><Suspense fallback={<main className="shell studio-page">Loading studio…</main>}><Studio /></Suspense><Footer /></>;
}
