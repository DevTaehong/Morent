import * as z from "zod";

export const CarValidation = z.object({
  carTitle: z.string().min(3, "Title should be at least 3 characters long"),
  carType: z.string().min(3, "Type should be at least 3 characters long"),
  rentPrice: z.string().min(1, "Rent price is required").optional(),
  carRented: z.number().optional(),
  starRating: z.number().optional(),
  capacity: z.string().min(1).optional(),
  transmission: z.string().min(1).optional(),
  location: z.string().optional(),
  fuelCapacity: z.string().min(1).optional(),
  shortDescription: z.string().min(1).optional(),
  carImages: z.array(z.string()).optional(),
  path: z.string().optional(),
  disabledDates: z
    .object({
      singleDates: z.array(z.date()).optional(),
      dateRanges: z
        .array(
          z.object({
            from: z.date().optional(),
            to: z.date().optional(),
          })
        )
        .optional(),
    })
    .optional(),
});
