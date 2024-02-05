"use client";

import { useAuth } from "@clerk/nextjs";
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";

import { calculateOrderAmount } from "@/utils/utility.functions";

interface CheckoutFormProps {
  price: number;
  totalDays: number;
  date: string;
  carId: string;
}

export default function CheckoutForm({
  price,
  totalDays,
  date,
  carId,
}: CheckoutFormProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const { userId } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!stripe || !elements) {
        return;
      }

      setIsLoading(true);

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `https://morent-zeta.vercel.app/checkout/Success?userId=${userId}&carId=${carId}&date=${date}`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
          setMessage(error.message || "An error occurred.");
        } else {
          setMessage("An unexpected error occurred.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <LinkAuthenticationElement />
      <PaymentElement />
      <button
        className={`${isLoading ? "opacity-80" : "hover-effect"} w-full rounded-lg bg-blue500 py-4 text-white`}
        disabled={isLoading}
        type="submit"
      >
        {isLoading
          ? "Processing..."
          : `Pay $${calculateOrderAmount(totalDays, price) / 100}`}
      </button>
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
