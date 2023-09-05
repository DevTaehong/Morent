import { currentUser } from '@clerk/nextjs';

import CarForm from '@/components/forms/CarForm';
import { userFromDB } from '@/lib/actions/user.actions';
import { objectToStringId } from '@/utils/utility.serverFunctions';

const Page = async () => {
  let user;
  let userMongo;
  let userIdString;

  try {
    user = await currentUser();
    userMongo = await userFromDB({ userName: user?.id });
    userIdString = objectToStringId(userMongo?._id);
  } catch (err) {
    console.error(err);
  }

  return (
    <div className="flex w-screen items-center justify-center bg-white200 dark:bg-gray900">
      <div className="mb-12 mt-[7.6rem] flex w-screen max-w-4xl items-center justify-center px-5 md:mt-[9.4rem]">
        <CarForm userId={userIdString as string} />
      </div>
    </div>
  );
};

export default Page;
