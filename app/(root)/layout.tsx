import "../globals.css";
import type { Metadata } from "next";
// eslint-disable-next-line camelcase
import { Plus_Jakarta_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import Provider from "../providers/Provider";
import NavBar from "@/components/navBarComponents/NavBar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { MY_URL } from "@/constants";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--plus-jakarta-sans",
  display: "optional",
  fallback: ["sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(MY_URL),
  title: "Morent",
  description: "The best platform for car rental",
  openGraph: {
    title: "Morent",
    description: "The best platform for car rental",
    url: MY_URL,
    siteName: "Morent",
    images: [
      {
        url: "/metadata_image.png",
        width: 1200,
        height: 630,
        alt: "Morent - Discover, Reserve, and Rent a Car with Morent Effortlessly",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${plusJakartaSans.className} bg-white200 dark:bg-gray900`}
        >
          <Provider>
            <NavBar />
            {children}
            <Footer />
            <Toaster />
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
