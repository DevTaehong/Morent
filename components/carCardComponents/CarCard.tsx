'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

import CarDetailsModalOne from './CarDetailsModalOne';
import CarCardMainContent from './CarCardMainContent';
import { CarParamsExtended } from '@/lib/interfaces';
import { likeCar } from '@/lib/actions/car.actions';

interface CarCardProps {
  carData: CarParamsExtended;
  isPopularCar?: boolean;
  canEdit?: boolean;
  canReview?: boolean;
  availabilityFrom: Date;
  availabilityTo: Date;
}

const CarCard: React.FC<CarCardProps> = ({
  carData,
  isPopularCar = false,
  canEdit = false,
  canReview = false,
  availabilityFrom,
  availabilityTo,
}) => {
  const { userId } = useAuth();
  const pathname = usePathname();
  const { theme } = useTheme();
  const [isFavourited, setIsFavourited] = useState(carData.liked);
  const [showModal, setShowModal] = useState(false);
  const [motionKey, setMotionKey] = useState(0);

  const handleButtonClick = () => {
    setIsFavourited((prev) => !prev);
    likeCar(carData._id || '', userId || '');
    setMotionKey((prevKey) => prevKey + 1);
  };

  // Check if the car is available from database and user input by single date
  const carAvailabilityBySingleDate =
    (carData?.disabledDates?.singleDates as Date[])?.every((singleDate) => {
      const newSingleDate = new Date(singleDate);
      return availabilityFrom > newSingleDate || newSingleDate > availabilityTo;
    }) ?? true;

  // Check if the car is available from database and user input by range date
  const carAvailabilityByRangeDate =
    carData?.disabledDates?.dateRanges?.every((dateRange) => {
      const { from, to } = dateRange;
      return availabilityFrom > new Date(to) || availabilityTo < new Date(from);
    }) ?? true;

  const carAvailability = () => {
    if (!carAvailabilityByRangeDate || !carAvailabilityBySingleDate)
      return false;
    return true;
  };

  return (
    <>
      <motion.div
        animate={{ scale: 1, y: 0 }}
        initial={{ scale: 0, y: 500, opacity: 0 }}
        whileHover={{ scale: 1.1 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className={`flex w-full flex-col rounded-lg bg-white
        p-4 shadow hover:shadow-xl dark:bg-gray850 ${
          isPopularCar ? 'min-w-[18rem]' : 'xs:max-w-[28rem]'
        } sm:w-auto sm:max-w-full`}
      >
        <CarCardMainContent
          carData={carData}
          canEdit={canEdit}
          motionKey={motionKey}
          isFavourited={isFavourited}
          theme={theme}
          isPopularCar={isPopularCar}
          handleButtonClick={handleButtonClick}
        />
        <div className="mt-6 flex w-full justify-between">
          <p className="self-center font-medium">
            ${carData.rentPrice}/
            <span className="text-xs text-gray400">day</span>
          </p>
          <button
            className={`rounded-md bg-blue500 px-5 py-2 text-sm font-medium text-white ${
              canEdit && 'hidden'
            }`}
            onClick={() => setShowModal(true)}
          >
            More Info
          </button>
        </div>
      </motion.div>
      {showModal && (
        <div
          className={`absolute flex ${
            pathname === '/search'
              ? 'h-screen w-screen lg:left-5 xl:left-0'
              : 'w-screen max-w-7xl'
          } w-screen items-center justify-center xs:pr-14 xl:justify-self-center xl:pr-0`}
        >
          <CarDetailsModalOne
            carData={carData}
            setShowModal={setShowModal}
            isPopular={isPopularCar}
            canReview={canReview}
            carAvailability={carAvailability()}
          />
        </div>
      )}
    </>
  );
};

export default CarCard;
