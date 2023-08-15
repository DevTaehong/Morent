import Image from "next/image";
import Link from "next/link";

import CarCard from "@/components/CarCard";
import { dummyUserData } from "@/utils/dummyUserData";

const page = () => {
  return (
    <div className="flex w-full justify-center self-center bg-white200 p-6">
      <div className="flex w-full max-w-7xl flex-col">
        <p className="text-xl font-semibold text-gray900">My Profile</p>
        <section className="mt-6 flex h-auto w-full flex-col rounded-xl bg-white">
          <div className="relative flex h-40 md:h-48">
            <Image
              src={dummyUserData.coverImage}
              alt="cover-picture"
              layout="fill"
              objectFit="cover"
              className="rounded-t-xl"
            />
            <button className="absolute bottom-2.5 right-2.5 rounded bg-white/40 px-2.5 py-1.5 text-[10px] text-white md:bottom-6 md:right-14 md:rounded-md md:px-5 md:py-3 md:text-sm">
              Edit Cover
            </button>
          </div>
          <div className="ml-3.5 flex flex-col justify-between md:ml-8 md:flex-row">
            <div className="flex flex-col md:flex-row">
              <Image
                src={dummyUserData.profileImage}
                alt="profile pic"
                height={70}
                width={70}
                className="absolute translate-y-[-35px] md:h-[10rem] md:w-[10rem] md:translate-y-[-63px]"
              />
              <div className="mt-10 flex flex-col md:mb-8 md:ml-48 md:mt-4">
                <p className="mt-2.5 text-xl font-semibold">
                  {dummyUserData.name}
                </p>
                <p className="mt-2 w-3/5 text-sm text-gray400 sm:w-full">
                  {dummyUserData.bio}
                </p>
              </div>
            </div>
            <button className="mb-5 mr-2.5 self-end rounded-lg bg-blue500 px-6 py-3 text-xs font-semibold text-white md:mb-8 md:mr-12 md:text-sm">
              Edit Profile
            </button>
          </div>
        </section>
        <p className="mt-10 font-medium text-gray400">Rented Cars</p>
        <section className="mt-7 flex flex-col items-center gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {dummyUserData.carsHired.map((id) => (
            <CarCard key={id} id={id} />
          ))}
        </section>
        <p className="mt-10 font-medium text-gray400">My Cars for Rent</p>
        <section className="mt-7 flex flex-col items-center gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {dummyUserData.cars.map((id) => (
            <CarCard key={id} canEdit={true} id={id} />
          ))}
        </section>
        <Link href="/cars/new" className="self-center">
          <button className="mt-14 w-[14.25rem] self-center rounded-lg bg-blue500 p-5 font-semibold text-white">
            Add More Cars for Rent
          </button>
        </Link>
      </div>
    </div>
  );
};

export default page;
