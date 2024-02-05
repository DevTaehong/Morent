"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";
import User from "../models/user.model";
import Car from "../models/car.model";
import Review from "../models/review.model";
import { CarParamsExtended, UserParams } from "../interfaces";

export async function userFromDB({
  userClerkId,
  isClientFetch = false,
}: {
  userClerkId: string | undefined | null;
  isClientFetch?: boolean;
}): Promise<UserParams | null> {
  await connectToDB();

  const userDocument = await User.findOne({ id: userClerkId });

  if (userDocument && isClientFetch) {
    return userDocument.toObject();
  }

  if (!userDocument) {
    console.warn("User not found.");
    return null;
  }

  return userDocument;
}

export async function addRentedCarToUser(
  userId: string,
  carId: string
): Promise<void> {
  try {
    await connectToDB();

    const user = await User.findOne({ id: userId }).exec();
    if (!user) {
      console.error("User not found.");
    }

    // Check if the car is already in the user's carsRented array
    if (user.carsRented.includes(carId)) {
      console.warn("Car already added to the user's rented cars.");
      return user.toObject();
    }

    // Add the car to the user's carsRented array
    user.carsRented.push({ car: carId });

    await user.save();
  } catch (error) {
    console.error(`Failed to add rented car to user: ${error}`);
  }
}

export async function fetchUserCars(
  userId: string
): Promise<UserParams | null> {
  await connectToDB();
  const userWithCars = await User.findOne({ id: userId })
    .populate("cars")
    .exec();

  if (!userWithCars) {
    console.warn("User not found.");
    return null;
  }

  return userWithCars.toObject();
}

export async function updateUser(params: UserParams): Promise<void> {
  const { id, username, name, bio, image, onboarded, path, email, coverImage } =
    params;
  try {
    await connectToDB();

    await User.findOneAndUpdate(
      { id },
      {
        username,
        name,
        bio,
        image,
        onboarded,
        email,
        coverImage,
      },
      { upsert: true }
    );

    if (path === `/profile/edit`) {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function deleteUserAndCars(id: string): Promise<void> {
  try {
    await connectToDB();

    const user = await User.findOne({ id });
    if (!user) {
      throw new Error("User not found.");
    }

    await Car.deleteMany({ userId: user._id });

    await User.findOneAndDelete({ id });
  } catch (error: any) {
    throw new Error(`Failed to delete user and their cars: ${error.message}`);
  }
}

export async function fetchReviewsByUser(id: string): Promise<any[] | null> {
  await connectToDB();

  try {
    const userReviews = await Review.find({ id })
      .populate("carId", "carTitle", "carImages")
      .exec();

    if (!userReviews || userReviews.length === 0) {
      console.warn("No reviews found for this user.");
      return null;
    }

    return userReviews.map((review) => review.toObject());
  } catch (error: any) {
    throw new Error(`Failed to fetch reviews by user: ${error.message}`);
  }
}

export async function fetchAllUsers(): Promise<UserParams[]> {
  await connectToDB();

  const userDocuments = await User.find();
  if (userDocuments.length === 0) {
    console.log("No user documents retrieved from the DB.");
  } else {
    console.log(`Retrieved ${userDocuments.length} user(s) from the DB.`);
  }

  const usersArray = userDocuments.map((userDoc) => userDoc.toObject());
  return usersArray;
}

export async function getFavoriteCars(
  userId: string
): Promise<CarParamsExtended[]> {
  await connectToDB();

  const user = await User.findById(userId).populate("favoriteCars");
  if (!user) {
    throw new Error(`User with id ${userId} not found`);
  }

  return user.favoriteCars.map((car: any) => car.toObject());
}
