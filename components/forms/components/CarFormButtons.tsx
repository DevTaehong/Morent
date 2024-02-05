"use client";

import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { CarFormButtonsProps } from "@/lib/interfaces";

const DeleteConfirmation = ({
  isLoading,
  carIdFromPath,
  handleDelete,
  setIsConfirmingDelete,
  setIsLoading,
}: Pick<
  CarFormButtonsProps,
  | "carIdFromPath"
  | "handleDelete"
  | "setIsConfirmingDelete"
  | "setIsLoading"
  | "isLoading"
>) => {
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isDeleting) {
      const deleteCar = async () => {
        try {
          setIsDeleting(true);
          setIsLoading(true);
          await handleDelete(carIdFromPath!);
          setIsConfirmingDelete(false);
        } catch (error) {
          console.error("Error deleting car:", error);
        } finally {
          setIsLoading(false);
          setIsDeleting(false);
        }
      };

      deleteCar();
    }
  }, [
    isDeleting,
    setIsLoading,
    handleDelete,
    carIdFromPath,
    setIsConfirmingDelete,
  ]);

  return (
    <div className="flex space-x-4">
      <Button
        disabled={isLoading}
        className="hover-effect flex h-14 self-end rounded-[0.625rem] bg-red-500 p-5
        text-white
        sm:w-auto"
        onClick={() => setIsDeleting(true)}
        type="button"
      >
        Confirm Delete
      </Button>
      <Button
        disabled={isLoading}
        className="hover-effect flex h-14 w-full self-end rounded-[0.625rem] bg-gray-500 p-5
        text-white
        md:w-auto"
        onClick={() => setIsConfirmingDelete(false)}
        type="button"
      >
        Cancel Delete
      </Button>
    </div>
  );
};

const CarFormButtons: React.FC<CarFormButtonsProps> = ({
  pathname,
  carIdFromPath,
  handleDelete,
  setIsConfirmingDelete,
  isConfirmingDelete,
  setIsLoading,
  isLoading,
}) => {
  return (
    <div className="flex w-full justify-end space-x-4 self-end">
      {pathname === `/cars/${carIdFromPath}` && carIdFromPath && (
        <>
          {isConfirmingDelete ? (
            <DeleteConfirmation
              carIdFromPath={carIdFromPath}
              handleDelete={handleDelete}
              setIsConfirmingDelete={setIsConfirmingDelete}
              setIsLoading={setIsLoading}
              isLoading={isLoading}
            />
          ) : (
            <Button
              disabled={isLoading}
              className="hover-effect flex h-14 w-full self-end rounded-[0.625rem] bg-red-500 px-5 text-white md:w-auto"
              onClick={() => setIsConfirmingDelete(true)}
              type="button"
            >
              Remove Car
            </Button>
          )}
          <Button
            className="hover-effect flex h-14 w-full rounded-[0.625rem] bg-blue500 px-5 text-white md:w-auto"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Editing..." : "Edit Car"}
          </Button>
        </>
      )}
      {pathname === `/cars/new` && (
        <Button
          className="hover-effect flex h-14 w-full rounded-[0.625rem] bg-blue500 px-5 text-white md:w-auto"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "Register Car"}
        </Button>
      )}
    </div>
  );
};

export default CarFormButtons;
