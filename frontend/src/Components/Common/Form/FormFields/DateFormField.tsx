import clsx from "clsx";

import DateInput, { type DatePickerPosition } from "../DateInput";

import FormField from "./FormField";
import { FormFieldBaseProps, useFormFieldPropsResolver } from "./Utils";

type Props = FormFieldBaseProps<Date> & {
  containerClassName?: string;
  placeholder?: string;
  max?: Date;
  min?: Date;
  position?: DatePickerPosition;
  disableFuture?: boolean;
  disablePast?: boolean;
};

/**
 * A FormField to pick date.
 *
 * Example usage:
 *
 * ```jsx
 * <DateFormField
 *   {...field("user_date_of_birth")}
 *   label="Date of birth"
 *   required
 *   disableFuture // equivalent to max={new Date()}
 * />
 * ```
 */
const DateFormField = (props: Props) => {
  const field = useFormFieldPropsResolver(props as any);

  return (
    <FormField field={field}>
      <DateInput
        className={clsx(field.error && "border-red-500")}
        containerClassName={props.containerClassName}
        disabled={field.disabled}
        id={field.id}
        max={props.max ?? (props.disableFuture ? new Date() : undefined)}
        min={props.min ?? (props.disablePast ? yesterday() : undefined)}
        name={field.name}
        placeholder={props.placeholder}
        position={props.position ?? "RIGHT"}
        value={
          field.value && typeof field.value === "string"
            ? new Date(field.value)
            : field.value
        }
        onChange={field.handleChange}
      />
    </FormField>
  );
};

export default DateFormField;

const yesterday = () => {
  const date = new Date();

  date.setDate(date.getDate() - 1);

  return date;
};
