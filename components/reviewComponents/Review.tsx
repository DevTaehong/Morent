"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

import UserReviewStarRating from "./UserReviewStarRating";
import ReviewForm from "./ReviewForm";
import { ReviewData } from "@/lib/interfaces";
import { profilePic } from "@/public/svg-icons";
import { deleteReview } from "@/lib/actions/review.actions";
import { advertSilverCar } from "@/public/pngs";

interface ReviewProps {
  reviewData: ReviewData;
  canEdit?: boolean;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

const Review: React.FC<ReviewProps> = ({ reviewData, canEdit = false }) => {
  const pathname = usePathname();
  const [showEditReview, setShowEditReview] = useState(false);
  const [showDeleteScreen, setShowDeleteScreen] = useState(false);
  const [reloadPage, setReloadPage] = useState(false);

  useEffect(() => {
    if (reloadPage) {
      window.location.href = "/profile";
    }
  }, [reloadPage]);

  return (
    <>
      <div className="flex w-full flex-col items-center gap-3 rounded-xl bg-white p-4 dark:bg-gray850 xs:items-start">
        <div className="flex w-full items-center justify-between">
          <div
            className={`flex items-center ${
              pathname === "/profile" && "hidden"
            }`}
          >
            <Image
              src={reviewData?.userId?.image || profilePic}
              height={50}
              width={50}
              alt="reviewer picture"
              className="mr-2 h-10 w-10 rounded-full"
            />
            <p className="font-semibold">
              {reviewData?.userId?.username || "user"}
            </p>
          </div>
          {pathname === "/profile" ? (
            <div className="flex w-full items-center justify-between">
              <p className="font-semibold">
                {reviewData.createdAt ? formatDate(reviewData?.createdAt) : ""}
              </p>
              <button
                className={`${
                  !canEdit && "hidden"
                } rounded bg-blue500 px-2 py-1.5 text-white ${
                  showDeleteScreen && "hidden"
                }`}
                onClick={() => setShowDeleteScreen(true)}
              >
                Edit Review
              </button>
              {showDeleteScreen && (
                <div className="flex gap-2">
                  <button
                    className="rounded bg-blue500 px-2 py-1.5 text-white"
                    onClick={() => setShowEditReview(true)}
                  >
                    Edit
                  </button>
                  <button
                    className="rounded bg-red-500 px-2 py-1.5 text-white"
                    onClick={() => {
                      deleteReview(reviewData._id);
                      setReloadPage(true);
                    }}
                  >
                    Delete
                  </button>
                  <button
                    className="rounded bg-gray-500 px-2 py-1.5 text-white"
                    onClick={() => setShowDeleteScreen(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="font-semibold">
              {reviewData.createdAt ? formatDate(reviewData?.createdAt) : ""}
            </p>
          )}
        </div>
        <div className="flex w-full justify-between">
          <p className="text-2xl text-gray900 dark:text-white200">
            {reviewData.title}
          </p>
        </div>
        <button
          className="hidden rounded border border-gray300 bg-white200 px-3 py-2 font-light hover:bg-blue500 hover:text-white dark:bg-white/50"
          onClick={() => setShowEditReview(true)}
        >
          Edit Review
        </button>
        {reviewData.carId?.carImages && (
          <Image
            src={reviewData.carId?.carImages[0] || advertSilverCar}
            alt="review-car-image"
            height={400}
            width={400}
            className={`mb-2 h-full rounded-lg ${
              pathname !== "/profile" && "hidden"
            }`}
          />
        )}
        {reviewData.rating && (
          <UserReviewStarRating rating={reviewData.rating} />
        )}
        <p className="text-lg font-light leading-8">{reviewData.content}</p>
      </div>
      {showEditReview && (
        <ReviewForm
          data={reviewData}
          setShowReviewScreen={setShowEditReview}
          editScreen={canEdit}
        />
      )}
    </>
  );
};

export default Review;
