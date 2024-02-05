import Advert from "./Advert";

const adverts = [
  {
    title: "The Best Platform for Car Rental",
    description:
      "Ease of doing a car rental safely and reliably. Of course at a low price.",
    imageSrc: "/pngs/advertWhiteCar.svg",
    additionalStyles: "white_car_ad",
    whiteCar: true,
    width: 406,
    height: 116,
  },
  {
    title: "Easy way to rent a car at a low price",
    description:
      "Providing cheap car rental services and safe and comfortable facilities.",
    imageSrc: "/pngs//advertSilverCar.svg",
    additionalStyles: "black_car_ad hidden lg:flex",
    whiteCar: false,
    width: 340,
    height: 108,
  },
];

const AdvertsDisplay = () => {
  return (
    <section className="flex w-full max-w-[90rem] px-6 xl:px-[3.75rem]">
      <div className="flex w-full gap-8">
        {adverts.map((advert) => (
          <Advert
            key={advert.title}
            title={advert.title}
            description={advert.description}
            imageSrc={advert.imageSrc}
            additionalStyles={advert.additionalStyles}
            whiteCar={advert.whiteCar}
            width={advert.width}
            height={advert.height}
          />
        ))}
      </div>
    </section>
  );
};

export default AdvertsDisplay;
