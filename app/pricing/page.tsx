"use client";
import React from "react";
import Pricing from "./Pricing";
import Footer from "../components/Footer";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import convertTosubCurency from "../lib/convertTosubCurency";
import CheckoutPage from "../components/CheckoutPage";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

const amount = 9.99;

const page = () => {
  return (
    <div className="bg-[--black]">
      <Elements
        stripe={stripePromise}
        options={{
          currency: "usd",
          mode: "payment",
          amount: convertTosubCurency(9.99),
        }}
      >
        <CheckoutPage amount={amount} />
      </Elements>
      {/* <Pricing />
      <Footer /> */}
    </div>
  );
};

export default page;
