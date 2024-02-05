"use client";

import { useEffect, useState } from "react";
import { Types } from "mongoose";

import CarCard from "../carCardComponents/CarCard";

interface RentedCarsProps {
  rentedCars: string;
  userObjId: Types.ObjectId | undefined;
}

const RentedCars: React.FC<RentedCarsProps> = ({ rentedCars, userObjId }) => {
  const [showMore, setShowMore] = useState(false);
  const [parsedRentedCars, setParsedRentedCars] = useState<any[]>([]);

  useEffect(() => {
    if (rentedCars) {
      setParsedRentedCars(JSON.parse(rentedCars));
    }
  }, [rentedCars]);

  return (
    <>
      <div className="flex w-full justify-between">
        <p className="mt-10 font-medium text-gray400">Rented Cars</p>
        {parsedRentedCars?.length > 4 && (
          <button
            className="mt-10 cursor-pointer font-medium text-gray400"
            onClick={() => setShowMore((prev) => !prev)}
          >
            {showMore ? "See Less" : "See More"}
          </button>
        )}
      </div>
      <section className="mt-7 flex flex-col items-center gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {showMore && parsedRentedCars?.length > 0
          ? parsedRentedCars.map((car) => (
              <CarCard
                carData={car}
                key={car._id}
                canReview={true}
                availabilityFrom={car.availabilityFrom}
                availabilityTo={car.availabilityTo}
                hasLiked={car.likes?.some(
                  (like: Types.ObjectId) => like === userObjId
                )}
              />
            ))
          : parsedRentedCars
              ?.slice(0, 4)
              .map((car) => (
                <CarCard
                  carData={car}
                  key={car._id}
                  canReview={true}
                  availabilityFrom={car.availabilityFrom}
                  availabilityTo={car.availabilityTo}
                  hasLiked={car.likes?.some(
                    (like: Types.ObjectId) => like === userObjId
                  )}
                />
              ))}
      </section>
    </>
  );
};

export default RentedCars;
