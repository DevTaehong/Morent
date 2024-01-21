import { userFromDB } from "@/lib/actions/user.actions";
import {
  fetchCarsAddedByUser,
  fetchCarsRentedByUser,
} from "@/lib/actions/car.actions";
import { getAllReviewsByUser } from "@/lib/actions/review.actions";
import { showError, showInformation } from "@/lib/toastHandler";
import { ToastFunction } from "@/lib/interfaces";

export async function fetchUserData(
  userId: string,
  setUserData: Function,
  toast: ToastFunction
): Promise<string | null> {
  try {
    const userDataFetched = await userFromDB({
      userName: userId,
      isClientFetch: true,
    });
    setUserData(userDataFetched);
    return userDataFetched?._id ? userDataFetched?._id?.toString() : null;
  } catch (error: any) {
    showError(toast, "Error", "Error fetching user data.");
    return error;
  }
}

export async function fetchRentedCars(
  userId: string,
  setCarsRented: Function,
  toast: ToastFunction
): Promise<string> {
  try {
    const rentedCars = await fetchCarsRentedByUser(userId);
    setCarsRented(JSON.stringify(rentedCars));
    return JSON.stringify(rentedCars);
  } catch (error: any) {
    showError(toast, "Error", "Error fetching rented cars.");
    return error;
  }
}

export async function fetchAddedCars(
  mongoUserId: string,
  setAddedCars: Function,
  toast: ToastFunction
): Promise<string> {
  try {
    const userAddedCars = await fetchCarsAddedByUser(mongoUserId);
    setAddedCars(JSON.stringify(userAddedCars));
    return JSON.stringify(userAddedCars);
  } catch (error: any) {
    showError(toast, "Error", "Error fetching added cars.");
    return error;
  }
}

export async function fetchUserReviews(
  mongoUserId: string,
  setReviews: Function,
  toast: ToastFunction
): Promise<string> {
  try {
    const userReviews = await getAllReviewsByUser({
      userId: mongoUserId,
      isClientFetch: true,
    });
    setReviews(JSON.stringify(userReviews));
    return JSON.stringify(userReviews);
  } catch (error: any) {
    showInformation(toast, "Alert !", "You have not reviewed any cars yet.");
    return error;
  }
}
