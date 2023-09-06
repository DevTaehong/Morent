'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';

import ProfileHeading from '@/components/ProfileHeading';
import RentedCars from '@/components/profilePageComponents/RentedCars';
import UsersCarsForRent from '@/components/profilePageComponents/UsersCarsForRent';
import { UserParams } from '@/lib/interfaces';
import {
  fetchUserData,
  fetchRentedCars,
  fetchAddedCars,
  fetchUserReviews,
} from '@/components/profilePageComponents/profile.utils';
import { useToast } from '@/components/ui/use-toast';
import Loader from '@/components/transitionPages/Loader';

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<UserParams | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [carsRented, setCarsRented] = useState<string | null>(null);
  const [addedCars, setAddedCars] = useState<string | null>(null);
  const [reviews, setReviews] = useState<string | null>(null);
  const { userId, isLoaded } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    async function fetchData() {
      if (isLoaded && userId) {
        const mongoUserId = await fetchUserData(userId, setUserData, toast);
        if (mongoUserId) {
          await fetchRentedCars(userId, setCarsRented, toast);
          await fetchAddedCars(mongoUserId, setAddedCars, toast);
          await fetchUserReviews(mongoUserId, setReviews, toast);
        }
      }
      setIsLoading(false);
    }

    fetchData();
  }, [userId, isLoaded, toast]);

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <div className="flex w-full justify-center self-center bg-white200 dark:bg-gray900">
        <div className="mt-20 flex w-full max-w-[90rem] flex-col p-6 md:mt-40">
          <ProfileHeading
            userData={JSON.stringify(userData)}
            reviews={reviews || '{}'}
          />

          <RentedCars rentedCars={carsRented || ''} />
          <UsersCarsForRent carsForRent={addedCars || ''} />
        </div>
      </div>
    );
  }
};

export default ProfilePage;
