"use client";

import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import ReviewList from "./reviewComponents/ReviewList";
import { profileDefaultCover } from "@/public/pngs";
import { UploadButton } from "@/lib/uploadthing";
import { showImageError } from "@/lib/toastHandler";
import { useToast } from "./ui/use-toast";
import { updateUser } from "@/lib/actions/user.actions";

type ProfileHeadingProps = {
  userData: string;
  reviews: string;
};

const ProfileHeading: React.FC<ProfileHeadingProps> = ({
  userData,
  reviews,
}) => {
  const parsedReviews = reviews ? JSON.parse(reviews) : null;
  const parsedUserData = JSON.parse(userData);
  const [cover, setCover] = useState(
    parsedUserData?.coverImage || profileDefaultCover
  );
  const { toast } = useToast();

  const [showReviews, setShowReviews] = useState(false);
  return (
    <motion.div animate={{ scale: 1 }} initial={{ scale: 0 }}>
      <div className="flex justify-between">
        <p className="text-xl font-semibold text-gray900 dark:text-white200">
          My Profile
        </p>
        {!!parsedReviews.length && (
          <button
            onClick={() => setShowReviews((prev) => !prev)}
            className="hover-effect cursor-pointer text-xl font-semibold text-gray900 dark:text-white200"
          >
            Show Reviews
          </button>
        )}
        {showReviews && (
          <ReviewList
            reviews={parsedReviews}
            setShowReviews={setShowReviews}
            canEdit={true}
          />
        )}
      </div>
      <section className="mt-6 flex h-auto w-full flex-col rounded-xl bg-white dark:bg-gray850">
        <div className="relative flex h-40 md:h-48">
          <Image
            src={cover}
            alt="cover-picture"
            layout="fill"
            style={{
              objectFit: "cover",
              objectPosition: "center 80%",
            }}
            className="rounded-t-xl"
          />

          <UploadButton
            content={{
              button({ ready, isUploading }) {
                if (ready) {
                  if (isUploading)
                    return <Loader2 className="size-4 animate-spin" />;
                  return "Edit Cover";
                }
              },
            }}
            appearance={{ allowedContent: { display: "none" } }}
            className="ut-button:hover-effect ut-button:absolute ut-button:bottom-2.5 ut-button:right-2.5 ut-button:h-[1.625rem] ut-button:w-[4.25rem] 
              ut-button:rounded ut-button:bg-white/40 ut-button:py-1.5 ut-button:text-[10px] ut-button:text-white
              ut-button:sm:h-10 ut-button:sm:w-[6.56rem] ut-button:sm:text-sm ut-button:md:bottom-6 ut-button:md:right-14 ut-button:md:rounded-md ut-button:md:py-3"
            endpoint="media"
            onClientUploadComplete={async (res) => {
              setCover(res && res[0]?.url);
              await updateUser({
                ...parsedUserData,
                coverImage: res && res[0]?.url,
              });
            }}
            onUploadError={(error: Error) => {
              console.error(error);
              showImageError(
                toast,
                "",
                "Something went wrong, please try again."
              );
            }}
          />
        </div>
        <div className="ml-3.5 flex flex-col justify-between md:ml-8 md:h-[7.375rem] md:flex-row">
          <div className="flex flex-col md:flex-row">
            {parsedUserData?.image && (
              <Image
                src={parsedUserData?.image}
                alt="profile pic"
                height={70}
                width={70}
                className="absolute size-[4.38rem] shrink-0 translate-y-[-35px] rounded-full md:size-[10rem] md:translate-y-[-63px]"
              />
            )}
            <div className="mt-10 flex flex-col md:mb-8 md:ml-48 md:mt-4">
              <p className="mt-2.5 text-xl font-semibold">
                {parsedUserData?.username}
              </p>
              <p className="mt-2 w-3/5 text-sm text-gray400 sm:w-full">
                {parsedUserData?.bio}
              </p>
            </div>
          </div>
          <Link href="/profile/edit" className="flex">
            <button className="hover-effect mb-5 mr-2.5 mt-3 self-end rounded-lg bg-blue500 px-6 py-3 text-xs font-semibold text-white md:mb-8 md:mr-12 md:mt-0 md:text-sm">
              Edit Profile
            </button>
          </Link>
        </div>
      </section>
    </motion.div>
  );
};

export default ProfileHeading;
