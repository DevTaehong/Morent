import PaymentResult from "@/components/transitionPages/PaymentResult";
import { editCarDisabledDates } from "@/lib/actions/car.actions";
import { addRentedCarToUser } from "@/lib/actions/user.actions";

const Page = async ({
  params,
  searchParams,
}: {
  params: { result: string };
  searchParams: { carId: string; userId: string; date: string };
}) => {
  const { result } = params;
  const carId = searchParams.carId;
  const userId = searchParams.userId;
  const parsedDate = JSON.parse(searchParams.date);
  const dateObject = {
    from: new Date(parsedDate.from),
    to: new Date(parsedDate.to),
  };

  await editCarDisabledDates(carId, dateObject);
  await addRentedCarToUser(userId, carId);

  return <PaymentResult result={result} />;
};

export default Page;
