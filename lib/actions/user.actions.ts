"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "../mongoose";
import User from "../models/user.model";
import Car from "../models/car.model";
import Review from "../models/review.model";
import { UserParams } from "../interfaces";

export async function userFromDB(
  userName: string | undefined
): Promise<UserParams | null> {
  connectToDB();
  const userDocument = await User.findOne({ id: userName });
  if (!userDocument) {
    console.warn("User not found.");
    return null;
  }
  return userDocument;
}

export async function addRentedCarToUser(
  userId: string,
  carId: string
): Promise<UserParams | null> {
  console.log("Starting addRentedCarToUser function...");

  await connectToDB();
  console.log("Connected to the database.");

  // Find the user with the provided id
  console.log(`Looking for user with id: ${userId}`);
  const user = await User.findOne({ id: userId }).exec();
  console.log(user);
  if (!user) {
    console.log("User not found.");
    return null;
  }
  console.log(user + "- User found.");

  // Check if the car is already in the user's carsRented array
  if (user.carsRented.includes(carId)) {
    console.warn("Car already added to the user's rented cars.");
    return user.toObject();
  }
  console.log(
    "Car not yet added to the user's rented cars. Proceeding to add..."
  );

  // Add the car to the user's carsRented array
  user.carsRented.push({ car: carId });
  console.log(`Car with id ${carId} added to the user's carsRented array.`);

  await user.save();
  console.log("User updated successfully.");

  return user.toObject();
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
  const { id, username, name, bio, image, onboarded, path, email } = params;
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
