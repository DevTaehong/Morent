import { Controller } from "react-hook-form";

import { FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { SelectInputProps } from "@/lib/interfaces";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "@/components/ui/select";

const SelectInput: React.FC<SelectInputProps> = ({
  control,
  name,
  label,
  placeholder,
  items,
  errorMessage,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        return (
          <FormItem className="flex w-full flex-col justify-start">
            <FormLabel>{label}</FormLabel>
            <Select
              value={String(field.value)}
              onValueChange={(value) => {
                field.onChange(value);
              }}
            >
              <FormControl>
                <SelectTrigger className="h-11 rounded-[7px] border-0 bg-white200 dark:bg-gray800 md:h-14">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  {items.map((item) => {
                    return (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
            {fieldState.invalid && (
              <span className="text-red-500">{errorMessage}</span>
            )}
          </FormItem>
        );
      }}
    />
  );
};

export default SelectInput;
