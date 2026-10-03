import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "./store/StoreProvider";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Picgen — Your imagination, beautifully rendered",
  description: "Turn your ideas into images with Picgen, a creative studio powered by Z-Image Turbo and FLUX.1 Schnell.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <StoreProvider>
        <html lang="en">
          <body className={inter.className}>{children}</body>
        </html>
      </StoreProvider>
    </ClerkProvider>
  );
}
