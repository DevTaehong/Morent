import FetchCarCard from "@/components/FetchCarCard";
import PickUpDropOffCard from "@/components/PickUpDropOffCard";
import SearchWithFiltering from "@/components/searchFormComponents/SearchWithFiltering";
import { getCarsByLocation } from "@/lib/actions/car.actions";
import { userFromDB } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs";

const SearchPage = async ({
  searchParams,
}: {
  searchParams: { location: string; from: string; to: string };
}) => {
  const location = searchParams.location;
  const availabilityFrom = new Date(searchParams.from);
  const availabilityTo = new Date(searchParams.to);
  const carData = await getCarsByLocation(location);
  // NOTE: https://github.com/vercel/next.js/issues/47447,
  // Warning: Only plain objects can be passed to Client Components from Server Components.
  const cars = JSON.parse(JSON.stringify(carData));
  const { userId } = auth();
  const user = await userFromDB({
    userClerkId: userId,
  });

  return (
    <div className="flex flex-col pt-[5.75rem] lg:flex-row min-[1440px]:mx-auto min-[1440px]:max-w-[86rem]">
      <SearchWithFiltering />
      <div className="flex grow flex-col bg-white200 px-6 pb-[3.75rem] pt-6 dark:bg-gray950 sm:pb-0">
        <PickUpDropOffCard />
        <FetchCarCard
          cars={cars}
          availabilityFrom={availabilityFrom}
          availabilityTo={availabilityTo}
          userObjId={user?._id}
        />
      </div>
    </div>
  );
};

export default SearchPage;
