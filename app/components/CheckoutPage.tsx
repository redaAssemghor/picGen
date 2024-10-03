"use client";
import { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import convertTosubCurency from "../lib/convertTosubCurency";
import { useAuth } from "@clerk/nextjs";

const CheckoutPage = ({ amount }: { amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { userId } = useAuth();

  useEffect(() => {
    fetch("/api/stripe/payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: convertTosubCurency(amount),
        id: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      });
  }, [amount, userId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
    } else {
      setErrorMessage("");
      setLoading(false);
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `http://localhost:3000/success-page?amount=${amount}`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
    }

    setLoading(false);
  };

  if (!stripe || !elements || !clientSecret) {
    return <div className="text-[--light]">Loading...</div>;
  }
  return (
    <div className="text-[--light]">
      <form onSubmit={handleSubmit}>
        {clientSecret && <PaymentElement />}

        {errorMessage && <div>{errorMessage}</div>}
        <button>pay</button>
      </form>
    </div>
  );
};

export default CheckoutPage;
