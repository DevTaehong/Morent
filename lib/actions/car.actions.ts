"use server";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";
import User from "../models/user.model";
import Car from "../models/car.model";
import Review from "../models/review.model";
import { CarParams, ReviewDocument } from "../interfaces";

export async function deleteCarRevalidate(
  carId: string
): Promise<{ message: string }> {
  try {
    await deleteCar(carId);
    revalidatePath("/profile");
    return { message: "Success" };
  } catch (event: any) {
    return { message: `There was an error: ${event.message}` };
  }
}

export async function createCar(carData: CarParams): Promise<CarParams> {
  try {
    await connectToDB();
    const car = new Car(carData);
    await car.save();

    await User.findByIdAndUpdate(carData.userId, {
      $push: { carsAdded: { car: car._id } },
    });

    return car.toObject();
  } catch (error: any) {
    throw new Error(`Failed to create car: ${error.message}`);
  }
}

export async function editCar(carData: CarParams): Promise<CarParams> {
  if (!carData._id) {
    throw new Error("Car ID is required to edit.");
  }

  try {
    await connectToDB();
    const updatedCar = await Car.findByIdAndUpdate(carData._id!, carData, {
      new: true,
    });

    if (!updatedCar) {
      throw new Error("Failed to find and update the car.");
    }

    return updatedCar.toObject();
  } catch (error: any) {
    throw new Error(`Failed to edit car: ${error.message}`);
  }
}

export async function deleteCar(carId: string): Promise<void> {
  try {
    await connectToDB();
    const car = await Car.findById(carId);
    if (!car) {
      throw new Error("Car not found.");
    }

    await User.findByIdAndUpdate(car.userId, {
      $pull: {
        carsAdded: { car: car._id },
        carsRented: { car: car._id },
      },
    });

    await Car.findByIdAndRemove(carId);
  } catch (error: any) {
    throw new Error(
      `Failed to delete car and its associated reviews: ${error.message}`
    );
  }
}

export async function editCarDisabledDates(
  carId: string,
  dateRange: { from: Date; to: Date }
): Promise<void> {
  try {
    await connectToDB();

    const car = await Car.findById(carId).exec();

    if (!car) {
      console.error("Car not found.");
    }

    car.disabledDates.dateRanges.some(
      // @ts-ignore
      (range) => range.from === dateRange.from && range.to === dateRange.to
    );

    // Add the dateRange to the car's disabledDates.dateRanges array
    car.disabledDates.dateRanges.push(dateRange);

    await car.save();
  } catch (error) {
    console.error(`Failed to edit car's disabled dates: ${error}`);
  }
}

export async function likeCar(
  carId: string,
  userId: string
): Promise<boolean | void> {
  try {
    await connectToDB();
    const userFromDB = await User.findOne({ id: userId });

    const car = await Car.findById(carId);
    if (!car) {
      throw new Error("Car not found.");
    }

    // Check if the user has already liked the car
    const userHasLiked = car.likes.includes(userFromDB._id);

    if (userHasLiked) {
      // If the user has already liked the car, remove it from favoriteCars
      const updateUserFavoriteCars = await User.findByIdAndUpdate(
        userFromDB._id,
        {
          $pull: { favoriteCars: car._id },
        },
        {
          new: true,
        }
      );

      const updatedCar = await Car.findByIdAndUpdate(
        carId,
        {
          $pull: { likes: userFromDB._id },
        },
        {
          new: true,
        }
      );

      if (!updateUserFavoriteCars || !updatedCar) {
        throw new Error("Failed to remove a favorite car.");
      }
      return true;
    } else {
      // If the user has not liked the car, add it to likes and favoriteCars
      const updatedCar = await Car.findByIdAndUpdate(
        carId,
        {
          $addToSet: { likes: userFromDB._id },
        },
        {
          new: true,
        }
      );

      if (!updatedCar) {
        throw new Error("Failed to like the car.");
      }

      const updateUserFavoriteCars = await User.findByIdAndUpdate(
        userFromDB._id,
        {
          $addToSet: { favoriteCars: car._id },
        },
        {
          new: true,
        }
      );

      if (!updateUserFavoriteCars) {
        throw new Error("Failed to add a favorite car.");
      }
    }
  } catch (error) {
    console.error(`Failed to like car: ${error}`);
  }
}

export async function fetchRecommendedCars(): Promise<CarParams[] | null> {
  try {
    connectToDB();

    const cars = await Car.aggregate([
      {
        $lookup: {
          from: "reviews",
          localField: "reviews",
          foreignField: "_id",
          as: "reviewsData",
        },
      },
      {
        $unwind: {
          path: "$reviewsData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "reviewsData.userId",
          foreignField: "_id",
          as: "reviewsData.user",
        },
      },
      {
        $unwind: {
          path: "$reviewsData.user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          carDoc: { $first: "$$ROOT" },
          averageRating: { $avg: "$reviewsData.rating" },
          reviews: {
            $push: {
              _id: "$reviewsData._id",
              userId: {
                _id: "$reviewsData.user._id",
                image: "$reviewsData.user.image",
                username: "$reviewsData.user.username",
              },
              carId: "$reviewsData.carId",
              rating: "$reviewsData.rating",
              title: "$reviewsData.title",
              content: "$reviewsData.content",
              createdAt: "$reviewsData.createdAt",
              updatedAt: "$reviewsData.updatedAt",
              __v: "$reviewsData.__v",
            },
          },
        },
      },
      {
        $match: {
          averageRating: { $gte: 3.75 },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              "$carDoc",
              { averageRating: "$averageRating", reviews: "$reviews" },
            ],
          },
        },
      },
      {
        $project: {
          "carDoc.reviews": 0,
          "carDoc.reviewsData": 0,
        },
      },
    ]).exec();

    return cars;
  } catch (error: any) {
    throw new Error(
      `Failed to fetch cars with average rating of 3.75 and above: ${error.message}`
    );
  }
}

export async function fetchPopularCars(): Promise<CarParams[] | null> {
  try {
    connectToDB();

    // Find cars with a carRented of over 4 and populate their reviews
    const cars = await Car.find({ carRented: { $gt: 4 } })
      .populate({
        path: "reviews", // First, populate the reviews
        populate: {
          path: "userId", // Then, within each review, populate the userId
          select: "image username", // Only select the 'image' and 'username' fields from the User document
        },
      })
      .exec();

    // Convert each car document to a plain JavaScript object
    return cars.map((car) => car.toObject());
  } catch (error: any) {
    throw new Error(`Failed to fetch recommended cars: ${error.message}`);
  }
}

export async function fetchCarsAddedByUser(
  userId: string | undefined
): Promise<CarParams[] | null> {
  try {
    connectToDB();

    // Find cars with the matching userId
    const cars = await Car.find({ userId }).exec();

    // Convert each car document to a plain JavaScript object
    return cars.map((car) => car.toObject()).reverse();
  } catch (error: any) {
    throw new Error(
      `Failed to fetch cars added by user with ID ${userId}: ${error.message}`
    );
  }
}

export async function fetchCarsRentedByUser(
  userId: string | undefined
): Promise<CarParams[] | null> {
  try {
    const user = await User.findOne({ id: userId })
      .populate({
        path: "carsRented.car",
        populate: {
          path: "reviews",
          model: "Review",
        },
      })
      .exec();

    if (!user || !user.carsRented || user.carsRented.length === 0) {
      return null;
    }

    return user.carsRented.map((rented: any) => {
      const car = rented.car.toObject();

      // Compute average rating for each car
      if (car.reviews && car.reviews.length > 0) {
        const totalRatings = car.reviews.reduce(
          (acc: number, review: ReviewDocument) => acc + review.rating,
          0
        );
        car.averageRating = totalRatings / car.reviews.length;
      } else {
        car.averageRating = null;
      }

      return car;
    });
  } catch (error: any) {
    throw new Error(
      `Failed to fetch cars rented by user with ID ${userId}: ${error.message}`
    );
  }
}

export async function fetchCarById(carId: string): Promise<CarParams | null> {
  try {
    await connectToDB();
    const car = await Car.findById(carId).exec();
    if (!car) {
      throw new Error("Car not found.");
    }
    return car.toObject();
  } catch (error: any) {
    throw new Error(`Failed to fetch car by ID: ${error.message}`);
  }
}

export async function fetchAllCars(): Promise<CarParams[] | null> {
  try {
    await connectToDB();
    const cars = await Car.find().exec();
    if (!cars || cars.length === 0) {
      throw new Error("No cars found.");
    }
    return cars.map((car) => car.toObject());
  } catch (error: any) {
    throw new Error(`Failed to fetch all cars: ${error.message}`);
  }
}

export async function deleteAllCars(): Promise<void> {
  try {
    await connectToDB();

    const cars = await Car.find().exec();

    // First, delete all reviews associated with these cars
    const carIds = cars.map((car) => car._id);
    const deleteReviewsResult = await Review.deleteMany({
      carId: { $in: carIds },
    });
    console.log(
      `Deleted ${deleteReviewsResult.deletedCount} reviews for cars.`
    );

    // Then, pull the cars from the users' carsAdded and carsRented arrays
    await User.updateMany(
      {},
      {
        $pull: {
          carsAdded: { car: { $in: carIds } },
          carsRented: { car: { $in: carIds } },
        },
      }
    );

    // Finally, delete the cars
    const deleteCarsResult = await Car.deleteMany({});
    console.log(`Deleted ${deleteCarsResult.deletedCount} cars.`);
  } catch (error: any) {
    throw new Error(
      `Failed to delete all cars and their associated reviews: ${error.message}`
    );
  }
}

export async function getAllReviewsForCar(
  carId: mongoose.Types.ObjectId
): Promise<ReviewDocument[]> {
  try {
    await connectToDB();

    const reviews = await Review.find({ carId })
      .populate({
        path: "userId",
        select: "username image",
      })
      .exec();

    if (!reviews) {
      throw new Error("No reviews found for the specified car.");
    }

    return reviews as ReviewDocument[];
  } catch (error: any) {
    throw new Error(`Failed to fetch reviews for the car: ${error.message}`);
  }
}

export async function getCarsByLocation(
  location: string = ""
): Promise<CarParams[] | null> {
  try {
    await connectToDB();

    const cars = await Car.find({
      location: { $regex: location, $options: "i" },
    }).exec();

    if (!cars) {
      throw new Error("Cars not found.");
    }
    return cars.map((car) => car.toObject() as CarParams);
  } catch (error: any) {
    throw new Error(`Failed to get cars by location: ${error.message}`);
  }
}
