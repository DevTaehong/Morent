"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import CarCard from "../carCardComponents/CarCard";
import { CarParams } from "@/lib/interfaces";

interface CarsForRentProps {
  carsForRent: string;
}

const UsersCarsForRent: React.FC<CarsForRentProps> = ({ carsForRent }) => {
  const [showMore, setShowMore] = useState(false);
  const [parsedCarsForRent, setParsedCarsForRent] = useState<CarParams[]>([]);

  useEffect(() => {
    if (carsForRent) {
      setParsedCarsForRent(JSON.parse(carsForRent));
    }
  }, [carsForRent]);

  return (
    <>
      <div className="flex w-full justify-between">
        <p className="mt-10 font-medium text-gray400">My Cars for Rent</p>
        <p
          className="mt-10 cursor-pointer font-medium text-gray400"
          onClick={() => setShowMore((prev) => !prev)}
        >
          {showMore ? "See Less" : "See More"}
        </p>
      </div>

      <section className="mt-7 flex flex-col items-center gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {showMore && parsedCarsForRent?.length > 0
          ? parsedCarsForRent.map((car) => (
              // @ts-ignore
              <CarCard carData={car} key={car._id} canEdit={true} />
            ))
          : parsedCarsForRent?.slice(0, 4).map((car) => (
              // @ts-ignore
              <CarCard carData={car} key={car._id} canEdit={true} />
            ))}
        <div>
          {parsedCarsForRent?.length === 0 && (
            <h3>You have not rented any cars. Yet.</h3>
          )}
        </div>
      </section>

      {parsedCarsForRent?.length === 0 && (
        <h3 className="p-5 font-medium text-gray400">
          You have not added any cars to rent out.
        </h3>
      )}

      <Link href="/cars/new">
        <button className="mt-14 w-[14.25rem] self-center rounded-lg bg-blue500 p-5 font-semibold text-white">
          Add More Cars for Rent
        </button>
      </Link>
    </>
  );
};

export default UsersCarsForRent;
