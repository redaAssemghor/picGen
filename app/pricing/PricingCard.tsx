"use client";
import React from "react";
import { Plan } from "../data/plans";
import Link from "next/link";
import { RedirectToSignIn, SignInButton, useAuth } from "@clerk/nextjs";

const PricingCard = ({ plan }: { plan: Plan }) => {
  const { isSignedIn } = useAuth();
  const IconComponent = plan.icon;

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return (
    <div className="relative m-10">
      {plan.isPrimuim && (
        <span className="bg-[--dark] text-[--light] p-1 font-semibold text-lg absolute top-0 right-10 z-50">
          Popular
        </span>
      )}
      {/* <span className="absolute w-full h-full bg-[--dark] z-10 blur"></span> */}
      <div className="relative z-50 lg:w-[400px] flex flex-col gap-10 p-10 text-white bg-transparent border border-white rounded-3xl shadow-2xl">
        <div className="space-y-3 z-50">
          <h1 className="text-3xl font-bold flex gap-2">
            <IconComponent className="text-yellow-500" /> {plan.name}
          </h1>
          <p>{plan.description}</p>
          <div>
            {plan.features.map((feature, i) => (
              <p key={i} className="flex gap-2 text-sm">
                <span className="text-[--dark-blue]">✓</span> {feature}
              </p>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center space-y-10">
          <Link
            href={plan.paymentLink}
            className={`text-center text-white font-semibold w-full rounded-full py-2 shadow-xl border border-[--dark-blue] ${
              plan.isPrimuim ? "bg-[--dark-blue] hover:text-" : ""
            }`}
          >
            Subscribe Now!
          </Link>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-400 line-through">
                {plan.prevPrice}
              </span>
              <span className="bg-red-500 rounded-full py-1 px-2 text-sm">
                save {plan.discount}
              </span>
            </div>
            <h1 className="text-[--dark-blue] text-5xl font-[900] text-center">
              {plan.price}
            </h1>
            <h1 className="text-gray-400-500 text-xl font-bold text-center">
              per month
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
