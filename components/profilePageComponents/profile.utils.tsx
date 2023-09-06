import { userFromDB } from '@/lib/actions/user.actions';
import {
  fetchCarsAddedByUser,
  fetchCarsRentedByUser,
} from '@/lib/actions/car.actions';
import { getAllReviewsByUser } from '@/lib/actions/review.actions';
import { showError } from '@/lib/toastHandler';

export async function fetchUserData(
  userId: string,
  setUserData: Function,
  toast: any
): Promise<string | null> {
  try {
    const userDataFetched = await userFromDB({
      userName: userId,
      isClientFetch: true,
    });
    setUserData(userDataFetched);
    return userDataFetched?._id ? userDataFetched?._id?.toString() : null;
  } catch (error) {
    showError(toast, 'Error', 'Error fetching user data.');
    return null;
  }
}

export async function fetchRentedCars(
  userId: string,
  setCarsRented: Function,
  toast: any
): Promise<void> {
  try {
    const rentedCars = await fetchCarsRentedByUser(userId);
    setCarsRented(JSON.stringify(rentedCars));
  } catch (error) {
    showError(toast, 'Error', 'Error fetching rented cars.');
  }
}

export async function fetchAddedCars(
  mongoUserId: string,
  setAddedCars: Function,
  toast: any
): Promise<void> {
  try {
    const userAddedCars = await fetchCarsAddedByUser(mongoUserId);
    setAddedCars(JSON.stringify(userAddedCars));
  } catch (error) {
    showError(toast, 'Error', 'Error fetching added cars.');
  }
}

export async function fetchUserReviews(
  mongoUserId: string,
  setReviews: Function,
  toast: any
): Promise<void> {
  try {
    const userReviews = await getAllReviewsByUser({
      userId: mongoUserId,
      isClientFetch: true,
    });
    setReviews(JSON.stringify(userReviews));
  } catch (error) {
    showError(toast, 'Error', 'Error fetching user reviews.');
  }
}
