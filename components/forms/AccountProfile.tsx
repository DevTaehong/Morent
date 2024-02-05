"use client";

import { ChangeEvent, useState, useTransition } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { EditUserFormFieldsValidation } from "@/lib/validations/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import ImageWithFallback from "@/utils/ImageWithFallback";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { updateUser } from "@/lib/actions/user.actions";
import { EditUserFormFields } from "@/lib/interfaces";

interface Props {
  user: string;
}

const AccountProfile: React.FC<Props> = ({ user }) => {
  const [isPending, startTransition] = useTransition();
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("media");

  const router = useRouter();
  const pathname = usePathname();

  const userData = JSON.parse(user);

  const form = useForm<EditUserFormFields>({
    resolver: zodResolver(EditUserFormFieldsValidation),
    defaultValues: {
      username: userData?.username || "",
      bio: userData?.bio || "",
      image: userData?.image || "",
      email: userData?.email || "",
    },
  });

  const onSubmit = async (values: EditUserFormFields) => {
    startTransition(async () => {
      const blob = values.image;
      const hasImageChanged = isBase64Image(blob);

      if (hasImageChanged) {
        const imgRes = await startUpload(files);
        if (imgRes && imgRes[0].url) {
          values.image = imgRes[0].url;
        }
      }

      await updateUser({
        ...userData,
        username: values.username,
        bio: values.bio || "",
        image: values.image,
        path: pathname,
      });

      if (pathname === "/profile/edit") {
        router.back();
      } else {
        router.push("/");
      }
    });
  };

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes("image")) return;

      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        fieldChange((fileReader.result as string) || "");
      };
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-5 self-center "
      >
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="flex flex-col justify-start">
              <FormLabel className="ml-1 p-4 pl-0">
                {field.value ? (
                  <div className="flex size-24">
                    <ImageWithFallback
                      src={field.value}
                      alt="profile photo"
                      width={96}
                      height={96}
                      priority
                      className=" rounded-full"
                    />
                  </div>
                ) : (
                  <Image
                    src="/profile.svg"
                    alt="profile photo"
                    width={96}
                    height={96}
                    className="object-contain"
                  />
                )}
              </FormLabel>
              <FormControl className="bg-white200 placeholder:text-gray400 dark:bg-gray800">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Upload an Image"
                  className="cursor-pointer"
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col justify-start">
              <FormLabel className="ml-1 pl-0 text-lg">Username</FormLabel>
              <FormControl className="bg-white200 dark:bg-gray800">
                <Input type="text" className="" {...field} />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex flex-col justify-start">
              <FormLabel className="ml-1 pl-0 text-lg">Bio</FormLabel>
              <FormControl className="bg-white200 dark:bg-gray800">
                <Textarea rows={10} className="rounded-[0.625rem]" {...field} />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button
          disabled={isPending}
          className="hover-effect mt-4 bg-blue500 text-white"
          type="submit"
        >
          {isPending ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AccountProfile;
