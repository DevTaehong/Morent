import { SignUp } from "@clerk/nextjs";

const Page = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp redirectUrl="/" />
    </div>
  );
};

export default Page;
