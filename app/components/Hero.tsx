import Link from "next/link";
import { FaWandMagicSparkles } from "react-icons/fa6";

const Hero = () => {
  return (
    <div className="h-screen flex justify-center items-center px-4">
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-extrabold tracking-widest text-gray-700">
          Unlock Your Creativity
        </h1>
        <h2 className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-wide text-indigo-600">
          Image Editor
        </h2>
        <h3 className="text-lg sm:text-xl font-extrabold tracking-wider text-gray-600">
          Effortless Design and Stunning Visuals with AI
        </h3>
        <p className="text-base sm:text-lg md:text-xl font-medium tracking-wide text-gray-500">
          Create, enhance, and edit your images in seconds with our powerful AI
          tools. Whether you`&apos;`re at home or on the go, our free,
          browser-based editor empowers your creativity with ease.
        </p>

        <div className="flex justify-center">
          <Link
            href="/generatepage"
            className="px-8 py-3 flex gap-2 items-center hover:bg-base-200 rounded-full font-bold text-lg transition duration-500 ease-in-out shadow-lg"
          >
            <FaWandMagicSparkles />
            Get Started with AI
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
