import { userFromDB, getFavoriteCars } from "@/lib/actions/user.actions";
import {
  fetchCarsAddedByUser,
  fetchCarsRentedByUser,
} from "@/lib/actions/car.actions";
import { getAllReviewsByUser } from "@/lib/actions/review.actions";
import { showError } from "@/lib/toastHandler";
import { ToastFunction } from "@/lib/interfaces";

export async function fetchUserData(
  userId: string,
  setUserData: Function,
  toast: ToastFunction
): Promise<string | null> {
  try {
    const userDataFetched = await userFromDB({
      userClerkId: userId,
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

export async function fetchFavoriteCars(
  userId: string,
  setFavoriteCars: Function
): Promise<string | undefined> {
  try {
    const favoriteCars = await getFavoriteCars(userId);

    setFavoriteCars(JSON.stringify(favoriteCars));

    return JSON.stringify(favoriteCars);
  } catch (error: any) {
    console.error(`Error fetching favorite cars: ${error}`);
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
  setReviews: Function
): Promise<string | undefined> {
  try {
    const userReviews = await getAllReviewsByUser({
      userId: mongoUserId,
      isClientFetch: true,
    });
    setReviews(JSON.stringify(userReviews));
    return JSON.stringify(userReviews);
  } catch (error) {
    console.error("Error fetching user reviews", error);
  }
}
