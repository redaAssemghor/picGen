import Particles from "@/components/ui/particles";
import Image from "next/image";
import Link from "next/link";
import { FaWandMagicSparkles } from "react-icons/fa6";

const PromptsBanner = () => {
  return (
    <div className="lg:mx-40 overflow-hidden lg:rounded-3xl bg-black bg-opacity-90 shadow-black">
      <div className="relative h-full w-full text-[--light]">
        <Particles
          className="absolute inset-0"
          quantity={100}
          ease={80}
          refresh
        />
        <div className="flex justify-between items-center h-full">
          <Image
            className="hidden lg:block"
            src="/footer/03.webp"
            width={300}
            height={300}
            alt="footer astro"
          />

          <div className="h-full w-full flex flex-col justify-center items-center gap-4 p-5">
            <h1 className="lg:text-3xl text-xl font-bold">
              Let AI Craft your prompts
            </h1>
            <p className="text-sm text-gray-600">
              Get the best propts with one click
            </p>

            <div className="flex justify-center z-50">
              <Link
                href="/generatepage"
                className="rounded-full transition duration-500 ease-in-out shadow-lg hover:bg-[--light-blue] hover:shadow-neon"
              >
                <h1 className="bg-gray-700 px-8 py-3 flex gap-2 items-center rounded-full font-bold border border-[--voilet] text-lg">
                  <FaWandMagicSparkles />
                  Get Started with AI
                </h1>
              </Link>
            </div>
          </div>
          <Image
            className="hidden lg:block"
            src="/footer/01.webp"
            width={300}
            height={300}
            alt="footer astro"
          />
        </div>
      </div>
    </div>
  );
};

export default PromptsBanner;
