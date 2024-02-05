"use client";

import { useEffect, useState, useTransition } from "react";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useTheme } from "next-themes";
import { useUser } from "@clerk/nextjs";

import CheckoutForm from "@/components/CheckoutForm";
import { Skeleton } from "@/components/ui/skeleton";

type PageProps = {
  searchParams: {
    price: number;
    totalDays: number;
    date: string;
    id: string;
  };
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const Page: React.FC<PageProps> = ({ searchParams }) => {
  const { price, totalDays, date, id: carId } = searchParams;
  const [clientSecret, setClientSecret] = useState("");
  const [isPending, startTransition] = useTransition();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { user } = useUser();

  useEffect(() => {
    startTransition(() => {
      fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            price,
            totalDays,
          },
          user,
        }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
    });
  }, [price, totalDays, user]);

  const appearance = {
    theme: "flat",
    variables: {
      colorBackground: isDark ? "#424B5C" : "#f6f7f9",
      colorText: isDark ? "#ffffff" : "#1A202C",
      fontFamily: "Plus Jakarta Sans, Inter, sans-serif",
      fontSizeBase: "14px",
      borderRadius: "10px",
    },
    rules: {
      ".Label": {
        fontWeight: "600",
        marginBottom: "10px",
        marginTop: "10px",
        fontSize: "14px",
        letterSpacing: "0.4px",
        lineHeight: "20px",
        textTransform: "Capitalize",
      },
      ".Input": {
        paddingLeft: "24px",
        fontSize: "14px",
        paddingTop: "18px",
        paddingBottom: "18px",
      },
    },
  };

  const options = {
    clientSecret,
    appearance,
  } as StripeElementsOptions;

  return isPending || !clientSecret ? (
    <main className="container flex min-h-[61.5rem] flex-col items-center justify-center gap-8 px-2 py-5 md:flex-row md:py-10">
      <div className="mt-24 flex w-full max-w-[32.5rem] shrink-0 flex-col rounded-[10px] bg-white px-4 py-10 shadow-lg dark:bg-gray850 md:p-[50px]">
        <Skeleton className="h-[16px] w-[100px] rounded-lg bg-blue500" />
        <div className="mt-8 flex flex-col gap-2">
          <Skeleton className="mt-8 h-[14px] w-[80px] rounded-lg bg-gray-400 dark:bg-white200" />
          <Skeleton className="h-[57px] w-full rounded-lg bg-white200 dark:bg-gray-800" />
        </div>
        <div className="flex flex-row gap-2">
          <div className="flex w-1/2 flex-col gap-2">
            <Skeleton className="mt-8 h-[14px] w-[80px] rounded-lg bg-gray-400 dark:bg-white200" />
            <Skeleton className="h-[57px] w-full rounded-lg bg-white200 dark:bg-gray-800" />
          </div>
          <div className="flex w-1/2 flex-col gap-2">
            <Skeleton className="mt-8 h-[14px] w-[80px] rounded-lg bg-gray-400 dark:bg-white200" />
            <Skeleton className="h-[57px] w-full rounded-lg bg-white200 dark:bg-gray-800" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="mt-8 h-[14px] w-[80px] rounded-lg bg-gray-400 dark:bg-white200" />
          <Skeleton className="h-[57px] w-full rounded-lg bg-white200 dark:bg-gray-800" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="mt-8 h-[14px] w-[80px] rounded-lg bg-gray-400 dark:bg-white200" />
          <Skeleton className="h-[57px] w-full rounded-lg bg-white200 dark:bg-gray-800" />
        </div>
        <div className="mt-3 flex flex-col gap-2">
          <Skeleton className="h-[8px] w-full rounded-lg bg-white200 dark:bg-gray-800" />
          <Skeleton className="h-[8px] w-full rounded-lg bg-white200 dark:bg-gray-800" />
        </div>
        <div className="mt-8 flex flex-col gap-2">
          <Skeleton className="h-[56px] w-full rounded-lg bg-blue500" />
        </div>
      </div>
    </main>
  ) : (
    <main className="container flex min-h-[61.5rem] flex-col items-center justify-center gap-8 px-2 py-5 pt-10 md:flex-row md:py-10">
      <div className="flex w-full shrink-0 flex-col gap-[34px] rounded-[10px] bg-white px-4 py-10 shadow-lg dark:bg-gray850 md:mt-20 md:max-w-[520px] md:p-[50px]">
        {clientSecret && (
          <>
            <h1 className="text-lg font-extrabold text-blue500">
              Card Details
            </h1>
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm
                price={price}
                totalDays={totalDays}
                date={date}
                carId={carId}
              />
            </Elements>
          </>
        )}
      </div>
    </main>
  );
};

export default Page;
