'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';

import ProfileHeading from '@/components/ProfileHeading';
import RentedCars from '@/components/profilePageComponents/RentedCars';
import UsersCarsForRent from '@/components/profilePageComponents/UsersCarsForRent';
import { userFromDB } from '@/lib/actions/user.actions';
import {
  fetchCarsAddedByUser,
  fetchCarsRentedByUser,
} from '@/lib/actions/car.actions';
import { getAllReviewsByUser } from '@/lib/actions/review.actions';
import { UserParams } from '@/lib/interfaces';

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<UserParams | null>(null);
  const [carsRented, setCarsRented] = useState<string | null>(null);
  const [addedCars, setAddedCars] = useState<string | null>(null);
  const [reviews, setReviews] = useState<string | null>(null);
  const { userId, isLoaded } = useAuth();

  useEffect(() => {
    async function fetchData() {
      if (isLoaded && userId) {
        try {
          const userDataFetched = await userFromDB({
            userName: userId,
            isClientFetch: true,
          });
          setUserData(userDataFetched);
          const mongoUserId = userDataFetched?._id?.toString();
          const rentedCars = await fetchCarsRentedByUser(userId);
          setCarsRented(JSON.stringify(rentedCars));
          const userAddedCars = await fetchCarsAddedByUser(mongoUserId);
          setAddedCars(JSON.stringify(userAddedCars));
          const userReviews = await getAllReviewsByUser({
            userId: mongoUserId,
            isClientFetch: true,
          });
          setReviews(JSON.stringify(userReviews));
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    }

    fetchData();
  }, [userId, isLoaded]);

  return (
    <div className="flex w-full justify-center self-center bg-white200 dark:bg-gray900">
      <div className="mt-20 flex w-full max-w-[90rem] flex-col p-6 md:mt-40">
        <ProfileHeading
          userData={JSON.stringify(userData)}
          reviews={reviews || ''}
        />
        <RentedCars rentedCars={carsRented || ''} />
        <UsersCarsForRent carsForRent={addedCars || ''} />
      </div>
    </div>
  );
};

export default ProfilePage;
