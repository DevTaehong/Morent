import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CarParams } from "@/lib/interfaces";
import { advertSilverCar } from "@/public/pngs";

interface ModalImageGalleryProps {
  carData: CarParams;
  displayPicture: number;
  setDisplayPicture: (value: number) => void;
}

const ModalImageGallery: React.FC<ModalImageGalleryProps> = ({
  carData,
  displayPicture,
  setDisplayPicture,
}) => {
  return (
    <div className="flex flex-col justify-between md:w-full">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="flex h-[15rem] w-full max-w-full items-center justify-center rounded-lg md:max-w-full lg:min-h-[18rem]"
      >
        <Image
          src={carData?.carImages[displayPicture] || advertSilverCar}
          alt="main display picture"
          width={300}
          height={225}
          style={{
            objectFit: "cover",
          }}
          className="size-full rounded-lg"
        />
      </motion.div>
      <div className="no_scrollbar mt-5 flex gap-5 overflow-x-auto">
        {carData?.carImages.map((image: string, i) => {
          return (
            <div className="w-1/3 rounded-lg" key={image}>
              <Image
                src={image}
                width={100}
                height={100}
                alt="car pictures"
                className={`h-full w-auto cursor-pointer rounded-lg p-[3px] ${
                  displayPicture === i && "border border-blue-600 p-[1px]"
                }`}
                onClick={() => {
                  setDisplayPicture(i);
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModalImageGallery;
