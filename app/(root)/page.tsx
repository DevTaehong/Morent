import { auth } from "@clerk/nextjs";

import PickUpDropOffCard from "@/components/PickUpDropOffCard";
import AdvertsDisplay from "@/components/advertsComponents/AdvertsDisplay";
import PopularCars from "@/components/homepageComponents/PopularCars";
import RecommendedCars from "@/components/homepageComponents/RecommendedCars";
import {
  fetchPopularCars,
  fetchRecommendedCars,
} from "@/lib/actions/car.actions";
import { userFromDB } from "@/lib/actions/user.actions";

const Home = async () => {
  const popularCars = await fetchPopularCars();
  const recommendedCars = await fetchRecommendedCars();
  const parsedPopularCars = JSON.stringify(popularCars);
  const parsedRecommendedCars = JSON.stringify(recommendedCars);
  const { userId } = auth();
  const user = await userFromDB({ userClerkId: userId });
  const userObjId = user?._id;

  return (
    <main className="flex flex-col items-center bg-white200 dark:bg-gray900">
      <div className="mt-24 flex w-full max-w-[90rem] flex-col items-center pt-5">
        <AdvertsDisplay />
        <div className="mt-7 flex w-full px-6 xl:px-[3.75rem]">
          <PickUpDropOffCard />
        </div>
        <PopularCars popularCars={parsedPopularCars} userObjId={userObjId} />
        <RecommendedCars
          recommendedCars={parsedRecommendedCars}
          userObjId={userObjId}
        />
      </div>
    </main>
  );
};

export default Home;
