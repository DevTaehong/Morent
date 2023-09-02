import React from "react";
import Link from "next/link";
import Image from "next/image";

import {
  redHeart,
  heart,
  editSymbol,
  editSymbolDarkMode,
  litres,
  transmission,
  peopleCapacity,
} from "@/public/svg-icons";
import { motion } from "framer-motion";
import { CarParams } from "@/lib/interfaces";
import { advertSilverCar } from "@/public/pngs";

interface CarCardMainContentProps {
  carData: CarParams;
  canEdit: boolean;
  motionKey: number;
  isFavourited?: boolean;
  theme: string | undefined;
  isPopularCar: boolean;
  handleButtonClick: () => void;
}

const CarCardMainContent: React.FC<CarCardMainContentProps> = ({
  carData,
  canEdit,
  motionKey,
  isFavourited,
  theme,
  isPopularCar,
  handleButtonClick,
}) => {
  return (
    <>
      <div className="flex w-full justify-between">
        <div className="flex flex-col">
          <p className="font-medium xs:text-xl">{carData.carTitle}</p>
          <p className="mt-1 text-xs font-semibold text-gray400 xs:text-sm">
            {carData.carType}
          </p>
        </div>
        {!canEdit ? (
          <motion.div
            key={motionKey}
            className="flex"
            animate={{ scale: isFavourited ? [1.6, 1] : [1, 1] }}
            transition={{ duration: 0.7 }}
          >
            <Image
              width={16}
              height={16}
              src={isFavourited ? redHeart : heart}
              alt="heart button"
              className={`h-4 w-4 cursor-pointer self-start xs:h-6 xs:w-6 ${
                isFavourited && "heart_animation"
              }`}
              onClick={handleButtonClick}
            />
          </motion.div>
        ) : (
          <Link href={`/cars/${carData._id}`}>
            <Image
              width={16}
              height={16}
              src={theme === "light" ? editSymbol : editSymbolDarkMode}
              alt="edit button"
              className="h-4 w-4 cursor-pointer self-start xs:h-6 xs:w-6"
            />
          </Link>
        )}
      </div>
      <div
        className={`mt-3 flex justify-between ${
          isPopularCar ? "flex-col" : "sm:flex-col"
        }`}
      >
        <div className="flex w-full justify-center pr-4 sm:px-4 sm:pt-4">
          <Image
            src={carData?.carImages ? carData.carImages[0] : advertSilverCar}
            width={100}
            height={100}
            style={{
              objectFit: "cover",
            }}
            alt="car picture"
            className={`mb-1 ml-0 h-full max-h-[6rem] w-full max-w-[15rem] self-end rounded-xl dark:bg-gray850 sm:max-h-[8rem] sm:max-w-[22rem] sm:self-center ${
              isPopularCar ? "self-center" : "self-end sm:self-center"
            }`}
          />
        </div>
        <div
          className={`flex gap-3 xs:mt-4 sm:mt-6  ${
            isPopularCar
              ? "mt-3 flex-row justify-evenly"
              : "w-1/3 flex-col sm:w-auto sm:flex-row"
          } sm:justify-evenly`}
        >
          <div className="flex">
            <Image
              width={14}
              height={14}
              src={litres}
              alt="engine literage"
              className="h-3.5 w-3.5 xs:h-5 xs:w-5"
            />
            <p className="ml-1 self-center text-xs text-gray400 xs:ml-1.5 xs:text-sm">
              {carData?.fuelCapacity}L
            </p>
          </div>
          <div className="flex max-w-[9rem]">
            <Image
              width={14}
              height={14}
              src={transmission}
              alt="transmission"
              className="h-3.5 w-3.5 xs:h-5 xs:w-5"
            />
            <p className="ml-1 max-w-[5rem] self-center truncate text-xs text-gray400 xs:text-sm sm:ml-1.5">
              {carData?.transmission}
            </p>
          </div>
          <div className="flex">
            <Image
              width={14}
              height={14}
              src={peopleCapacity}
              alt="people capacity"
              className="h-3.5 w-3.5 xs:h-5 xs:w-5"
            />
            <p className="ml-1 self-center truncate text-xs text-gray400 xs:text-sm sm:ml-1.5">
              {carData?.capacity}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CarCardMainContent;
