"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Types } from "mongoose";

import CarCard from "../carCardComponents/CarCard";
import { addDays } from "date-fns";
import { CarParamsExtended } from "@/lib/interfaces";

interface RecommendedCarsProps {
  recommendedCars: string;
  userObjId: Types.ObjectId | undefined;
}

const RecommendedCars: React.FC<RecommendedCarsProps> = ({
  recommendedCars,
  userObjId,
}) => {
  const twoDaysFromNow = addDays(new Date(), 2);
  const fiveDaysFromNow = addDays(new Date(), 5);

  const parsedCars = (recommendedCars = JSON.parse(recommendedCars));

  const [showAll, setShowAll] = useState(false);
  return (
    <motion.div
      animate={{ scale: 1 }}
      initial={{ scale: 0 }}
      className="flex w-full flex-col"
    >
      <p className="ml-6 mt-5 self-start font-medium text-gray400 xs:mt-0 xl:ml-[4.94rem]">
        Recommended cars
      </p>
      <div className="mt-5 flex w-full flex-col items-center justify-center gap-5 px-6 sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4 xl:px-[3.75rem]">
        {showAll
          ? parsedCars?.map((car: CarParamsExtended) => (
              <CarCard
                carData={car}
                key={car._id}
                availabilityFrom={twoDaysFromNow}
                availabilityTo={fiveDaysFromNow}
                hasLiked={car.likes?.some((like) => like === userObjId)}
              />
            ))
          : parsedCars
              ?.slice(0, 4)
              .map((car: CarParamsExtended) => (
                <CarCard
                  carData={car}
                  key={car._id}
                  availabilityFrom={twoDaysFromNow}
                  availabilityTo={fiveDaysFromNow}
                  hasLiked={car.likes?.some((like) => like === userObjId)}
                />
              ))}
      </div>
      <button
        className="hover-effect my-10 max-w-[14.25rem] self-center rounded-[0.625rem] bg-blue500 px-10 py-4 text-sm font-medium text-white"
        onClick={() => setShowAll((prev) => !prev)}
      >
        {showAll ? "Show Less Cars" : "Show More Cars"}
      </button>
    </motion.div>
  );
};

export default RecommendedCars;
