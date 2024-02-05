"use client";

import { useEffect, useState } from "react";
import { Types } from "mongoose";

import CarCard from "../carCardComponents/CarCard";

interface FavoriteCarsProps {
  favoriteCars: string | null;
  userObjId: Types.ObjectId | undefined;
}

const FavoriteCars = ({ favoriteCars, userObjId }: FavoriteCarsProps) => {
  const [showMore, setShowMore] = useState(false);
  const [parsedFavoriteCars, setParsedFavoriteCars] = useState<any[]>([]);

  useEffect(() => {
    if (favoriteCars) {
      setParsedFavoriteCars(JSON.parse(favoriteCars));
    }
  }, [favoriteCars]);

  const removeCar = (carId: string | null) => {
    setParsedFavoriteCars((prevCars) =>
      prevCars.filter((car) => car._id !== carId)
    );
  };

  return (
    <>
      <div className="flex w-full justify-between">
        <p className="mt-10 font-medium text-gray400">My Favorite Cars</p>
        {parsedFavoriteCars?.length > 4 && (
          <button
            className="mt-10 cursor-pointer font-medium text-gray400"
            onClick={() => setShowMore((prev) => !prev)}
          >
            {showMore ? "See Less" : "See More"}
          </button>
        )}
      </div>

      <section className="mt-7 flex flex-col items-center gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {showMore && parsedFavoriteCars?.length > 0
          ? parsedFavoriteCars.map((car) => (
              <CarCard
                carData={car}
                key={car._id}
                canReview={false}
                availabilityFrom={car.availabilityFrom}
                availabilityTo={car.availabilityTo}
                hasLiked={car.likes?.some(
                  (like: Types.ObjectId) => like === userObjId
                )}
                onUnlink={removeCar}
              />
            ))
          : parsedFavoriteCars
              ?.slice(0, 4)
              .map((car) => (
                <CarCard
                  carData={car}
                  key={car._id}
                  canReview={false}
                  availabilityFrom={car.availabilityFrom}
                  availabilityTo={car.availabilityTo}
                  hasLiked={car.likes?.some(
                    (like: Types.ObjectId) => like === userObjId
                  )}
                  onUnlink={removeCar}
                />
              ))}
      </section>
    </>
  );
};

export default FavoriteCars;
