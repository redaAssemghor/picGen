"use client";
import { useState } from "react";
import { TiArrowSortedDown } from "react-icons/ti";

const FAQ = () => {
  const [isOpen, setIsOpen] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setIsOpen((prev) => (prev === index ? null : index));
  };
  const faqs = [
    {
      question: "What is an AI text-to-image app?",
      answer:
        "Our AI text-to-image app allows users to input text descriptions, and the app will generate an image based on that description using models like DALL·E 3 and Stable Diffusion.",
    },
    {
      question: "How do I generate images using DALL·E 3 or Stable Diffusion?",
      answer:
        "Simply enter a detailed text prompt describing the image you want. You can choose which model to use, and the app will generate the corresponding image.",
    },
    {
      question:
        "What are the differences between DALL·E 3 and Stable Diffusion?",
      answer:
        "DALL·E 3 tends to generate more creative and artistic images, while Stable Diffusion is often faster and excels at generating more photorealistic results. You can experiment with both to see which fits your needs.",
    },
    {
      question: "Are there limits to how many images I can generate?",
      answer:
        "Currently, the app allows users to generate a limited number of images per day. Premium users can enjoy additional image generations and faster processing times.",
    },
  ];

  return (
    <div className="flex p-40 gap-5 text-[--light]">
      <div className="flex-1">
        <h1 className="text-4xl font-bold mb-8">
          Have questions? We have answers!
        </h1>
      </div>
      <div className="space-y-6 flex-1">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-black rounded-3xl p-5">
            <div
              onClick={() => toggleFAQ(index)}
              className="cursor-pointer flex justify-between mb-5"
            >
              <h2 className="text-base font-semibold">{faq.question}</h2>
              <TiArrowSortedDown />
            </div>
            <p
              className={`text-gray-600 transition-all duration-500 ${
                isOpen === index
                  ? "max-h-[100px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
