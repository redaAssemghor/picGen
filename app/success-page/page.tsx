"use client";
import { useSearchParams } from "next/navigation";

const PaymentSuccss = () => {
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount");
  return (
    <main>
      <h1>Payment Success</h1>
      <p>Amount: {amount}</p>
    </main>
  );
};

export default PaymentSuccss;
