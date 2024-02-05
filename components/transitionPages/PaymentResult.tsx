import Image from "next/image";
import Link from "next/link";

import {
  StripeSuccessImage,
  StripeErrorImage,
  StripeCancelImage,
} from "@/public/pngs";
import GenerateReceiptButton from "../GenerateReceiptButton";

interface PaymentResultProps {
  result: string;
}

const PaymentResult: React.FC<PaymentResultProps> = ({ result }) => {
  let imageSrc = StripeSuccessImage;
  if (result === "Error") {
    imageSrc = StripeErrorImage;
  } else if (result === "Cancel") {
    imageSrc = StripeCancelImage;
  }
  return (
    <div className="flex h-screen w-full items-center justify-center bg-white200 px-2 dark:bg-gray900 sm:px-0">
      <section className="flex w-full flex-col items-center justify-center rounded-xl bg-white px-4 py-10 dark:bg-gray850 sm:w-[31.25rem] sm:p-12">
        <p className="font-medium text-gray400 sm:text-lg">
          {result === "Success" && "Thank You For Your Purchase"}
          {result === "Error" && "There was an error making payment"}
          {result === "Cancel" && "You cancelled the payment"}
        </p>
        <Image
          src={imageSrc}
          alt="payment result image"
          className="mt-12 size-[7rem] sm:size-[7.5rem]"
        />
        <p className="mt-12 text-2xl font-semibold sm:text-4xl">
          {result === "Success" && "Payment Successful"}
          {result === "Error" && "Payment Unsuccessful"}
          {result === "Cancel" && "Payment Cancelled"}
        </p>
        <Link
          href="/profile"
          className="hover-effect mt-12 w-full rounded-lg bg-blue500 py-4 text-center font-semibold text-white sm:w-[25rem]"
        >
          {result === "Success" && "View Rented Car"}
          {result === "Error" && "Try Again"}
          {result === "Cancel" && "Back To Homepage"}
        </Link>
        <GenerateReceiptButton result={result} />
      </section>
    </div>
  );
};

export default PaymentResult;
