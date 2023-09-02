'use server';

import Car from '@/lib/models/car.model';
import Review from '@/lib/models/review.model';
import { connectToDB } from '@/lib/mongoose';
import { fetchAllUsers } from '@/lib/actions/user.actions';
import { fetchAllCars } from '@/lib/actions/car.actions';
import { getRandomItemFromArray } from './utility.serverFunctions';
import { reviews, reviewTitles } from '@/constants';

export async function seedCarReviews(): Promise<void> {
  await connectToDB();

  const users = await fetchAllUsers();
  const cars = await fetchAllCars();

  if (!users.length) {
    console.error('No users found to write reviews.');
    return;
  }

  if (!cars) {
    console.error('No cars found to generate reviews for.');
    return;
  }

  for (const car of cars) {
    const numReviews = getRandomItemFromArray([1, 2, 3, 4, 5]);

    for (let j = 0; j < numReviews; j++) {
      const randomUserId = getRandomItemFromArray(users)._id;

      const reviewDetails = {
        userId: randomUserId,
        carId: car._id,
        rating: getRandomItemFromArray([1, 2, 3, 4, 5]),
        title: getRandomItemFromArray(reviewTitles),
        content: getRandomItemFromArray(reviews),
      };

      const review = new Review(reviewDetails);
      try {
        await review.save();

        await Car.findByIdAndUpdate(car._id, {
          $push: { reviews: review._id },
        });
      } catch (error) {
        console.error(
          `Error while saving review for Car ID: ${car._id}`,
          error
        );
      }
    }
  }
  console.log('Completed the seedCarReviews function.');
}
