'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useToast } from '@/components/ui/use-toast';
import { Form, FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { CarValidation } from '@/lib/validations/car';
import { isBase64Image } from '@/lib/utils';
import { useUploadThing } from '@/lib/uploadthing';
import { createCar, deleteCar, editCar } from '@/lib/actions/car.actions';
import DragDrop from './DragDrop';
import { Props, FileWithPreview } from '@/lib/interfaces';

import {
  carTypes,
  capacities,
  transmissionOptions,
  fuelCapacityOptions,
} from '@/constants';

import Location from '../Location';
import SelectInput from './components/SelectInput';
import InputController from './components/InputController';
import CarFormButtons from './components/CarFormButtons';
import CarFormHeader from './components/CarFormHeader';

const CarForm: React.FC<Props> = ({ userId, car }) => {
  const { startUpload } = useUploadThing('media');
  const router = useRouter();
  const pathname = usePathname();
  const [dragDropFiles, setDragDropFiles] = useState<FileWithPreview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const carIdPattern = /^\/cars\/(?!new$)([a-zA-Z0-9]+)$/;
  const match = pathname.match(carIdPattern);
  const carIdFromPath = match ? match[1] : null;

  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(CarValidation),
    defaultValues: {
      carTitle: car?.carTitle || '',
      carType: car?.carType || '',
      rentPrice: car?.rentPrice || '',
      capacity: car?.capacity || 1,
      transmission: car?.transmission || '',
      location: car?.location || '',
      fuelCapacity: car?.fuelCapacity || 0,
      shortDescription: car?.shortDescription || '',
      carImageMain: car?.carImageMain || '',
      path: car?.path || '',
    },
  });

  const uploadImages = async (
    imagePreviews: string[],
    files: FileWithPreview[]
  ): Promise<string[]> => {
    const uploadPromises = imagePreviews.map(async (blob, index) => {
      const isImage = isBase64Image(blob);
      if (!isImage) return null;

      const imgRes = await startUpload([files[index]]);
      return imgRes?.[0]?.fileUrl || null;
    });

    const uploadedUrls: (string | null)[] = await Promise.all(uploadPromises);
    return uploadedUrls.filter((url) => url !== null) as string[];
  };

  const onSubmit = async (values: z.infer<typeof CarValidation>) => {
    setIsLoading(true);
    setError(null);

    if (Object.keys(form.formState.errors).length > 0) {
      const errorFields = Object.keys(form.formState.errors);
      const errorMessage = `Errors in: ${errorFields.join(', ')}`;
      toast({
        title: 'Validation Error',
        description: errorMessage,
      });
      setIsLoading(false);
      return;
    }

    if (dragDropFiles.length === 0 && pathname === '/cars/new') {
      toast({
        variant: 'destructive',
        title: 'Not so quick!',
        description: 'Please add an image before submitting the form.',
      });
      setIsLoading(false);
      return;
    }

    try {
      const uploadedUrls = await uploadImages(imagePreviews, dragDropFiles);
      if (!uploadedUrls) {
        throw new Error('Failed to upload image.');
      }

      if (uploadedUrls.length > 0) {
        values.carImageMain = uploadedUrls[0];
      }
      const carData = {
        userId,
        carTitle: values.carTitle || '',
        carType: values.carType || '',
        rentPrice: values.rentPrice || '',
        capacity: values.capacity || 1,
        transmission: values.transmission || '',
        location: values.location || '',
        fuelCapacity: values.fuelCapacity || 1,
        shortDescription: values.shortDescription || '',
        carImageMain: values.carImageMain,
      };

      if (car?._id) {
        await editCar({
          ...carData,
          _id: car?._id,
        });
        setSuccess(true);
      } else {
        await createCar(carData);
        setSuccess(true);
      }

      toast({
        variant: 'success',
        title: 'Success',
        description: 'Car registered successfully',
      });

      if (pathname === '/cars/new') {
        router.back();
      } else {
        router.push('/');
      }
    } catch (error) {
      let errorMessage = car?._id
        ? 'There was an issue while updating the car.'
        : 'There was an issue while creating the car.';

      if (error instanceof Error) {
        errorMessage += ` Detail: ${error.message}`;
        console.error({ error, message: error.message });
      } else {
        console.error({ error, message: 'An unknown error occurred' });
      }

      setError(errorMessage);
    } finally {
      setSuccess(false);
      setIsLoading(false);
    }
  };

  const handleFilesChange = (files: FileWithPreview[]) => {
    setDragDropFiles(files);

    const fileReadPromises = files.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
          const result = fileReader.result as string;
          resolve(result);
        };
        fileReader.onerror = () => {
          reject(fileReader.error);
        };
      });
    });

    Promise.all(fileReadPromises)
      .then((allFileData) => {
        setImagePreviews(allFileData);
        if (allFileData.length > 0) {
          form.setValue('carImageMain', allFileData[0] || '');
        }
      })
      .catch((error) => {
        console.error('Error reading one or more files:', error);
      });
  };

  const handleLocationSelected = (location: string) => {
    form.setValue('location', location);
  };

  const handleDelete = async (carId: string) => {
    try {
      setIsLoading(true);
      await deleteCar(carId);

      toast({
        title: 'Success',
        description: 'Car deleted successfully.',
      });

      router.push('/');
    } catch (error) {
      console.error('Failed to delete car:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete car. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full max-w-4xl flex-col items-center gap-5 rounded-xl bg-white px-6 py-12 dark:bg-gray850"
      >
        {isLoading && <div>Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {success && (
          <div className="text-green-500">Car registered successfully!</div>
        )}

        <CarFormHeader
          pathname={pathname}
          car={car || undefined}
          imagePreviews={imagePreviews}
        />

        <div className="flex w-full flex-col gap-8 md:flex-row ">
          <InputController
            control={form.control}
            name="carTitle"
            label="Car Title"
            placeholder="Your title"
          />
          <SelectInput
            control={form.control}
            name="carType"
            label="Car Type"
            placeholder="Car Type"
            items={carTypes}
            isNumeric={false}
          />
        </div>
        <div className="flex w-full flex-col gap-8 md:flex-row">
          <InputController
            control={form.control}
            name="rentPrice"
            label="Rent Price"
            placeholder="Price"
          />

          <SelectInput
            control={form.control}
            name="capacity"
            label="Capacity"
            placeholder="Capacity in persons"
            items={capacities}
            isNumeric={true}
          />
        </div>

        <div className="flex w-full flex-col gap-8 md:flex-row">
          <SelectInput
            control={form.control}
            name="transmission"
            label="Transmission"
            placeholder="Transmission Type"
            items={transmissionOptions}
            isNumeric={false}
          />

          <FormItem className=" flex w-full flex-col justify-start">
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Location handleLocationSelected={handleLocationSelected} />
            </FormControl>
          </FormItem>
        </div>
        <div className="flex w-full flex-col gap-8 md:flex-row">
          <SelectInput
            control={form.control}
            name="fuelCapacity"
            label="Fuel Capacity"
            placeholder="Fuel Capacity"
            items={fuelCapacityOptions}
            isNumeric={true}
          />
          <InputController
            control={form.control}
            name="shortDescription"
            label="Short Description"
            placeholder="Enter a short description"
          />
        </div>

        <p className="self-start font-semibold text-gray900 dark:text-white">
          Upload Images
        </p>

        <DragDrop handleFilesChange={handleFilesChange} />

        <CarFormButtons
          pathname={pathname}
          carIdFromPath={carIdFromPath}
          isConfirmingDelete={isConfirmingDelete}
          setIsConfirmingDelete={setIsConfirmingDelete}
          handleDelete={handleDelete}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </form>
    </Form>
  );
};

export default CarForm;
