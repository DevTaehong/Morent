"use client";

import { useEffect, useState } from "react";
import { Types } from "mongoose";

import CarCard from "../carCardComponents/CarCard";

interface CarsForRentProps {
  carsForRent: string;
  userObjId: Types.ObjectId | undefined;
}

const UsersCarsForRent: React.FC<CarsForRentProps> = ({
  carsForRent,
  userObjId,
}) => {
  const [showMore, setShowMore] = useState(false);
  const [parsedCarsForRent, setParsedCarsForRent] = useState<any[]>([]);

  useEffect(() => {
    if (carsForRent) {
      setParsedCarsForRent(JSON.parse(carsForRent));
    }
  }, [carsForRent]);

  return (
    <>
      <div className="flex w-full justify-between">
        <p className="mt-10 font-medium text-gray400">My Cars for Rent</p>
        {parsedCarsForRent?.length > 4 && (
          <button
            className="mt-10 cursor-pointer font-medium text-gray400"
            onClick={() => setShowMore((prev) => !prev)}
          >
            {showMore ? "See Less" : "See More"}
          </button>
        )}
      </div>

      <section className="mt-7 flex flex-col items-center gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {showMore && parsedCarsForRent?.length > 0
          ? parsedCarsForRent.map((car) => (
              // @ts-ignore
              <CarCard
                carData={car}
                key={car._id}
                canEdit={true}
                hasLiked={car.likes?.some(
                  (like: Types.ObjectId) => like === userObjId
                )}
              />
            ))
          : parsedCarsForRent?.slice(0, 4).map((car) => (
              // @ts-ignore
              <CarCard
                carData={car}
                key={car._id}
                canEdit={true}
                hasLiked={car.likes?.some(
                  (like: Types.ObjectId) => like === userObjId
                )}
              />
            ))}
      </section>
    </>
  );
};

export default UsersCarsForRent;
