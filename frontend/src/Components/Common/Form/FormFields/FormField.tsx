import clsx from "clsx";

import { FieldError } from "../FieldValidators";

import { FormFieldBaseProps } from "./Utils";

type LabelProps = {
  id?: string | undefined;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string | undefined;
  noPadding?: boolean;
};

export const FieldLabel = (props: LabelProps) => {
  return (
    <label
      className={clsx(
        "block text-base font-normal text-gray-900",
        !props.noPadding && "mb-2",
        props.className
      )}
      htmlFor={props.htmlFor}
      id={props.id}
    >
      {props.children}
      {props.required && <span className="text-red-500">{" *"}</span>}
    </label>
  );
};

type ErrorProps = {
  error: FieldError;
  className?: string | undefined;
};
export const FieldErrorText = ({ error, className }: ErrorProps) => {
  return (
    <span
      className={clsx(
        "ml-1 mt-2 text-xs font-medium tracking-wide text-red-500 transition-opacity duration-300",
        error ? "opacity-100" : "opacity-0",
        className
      )}
    >
      {error}
    </span>
  );
};

const FormField = ({
  field,
  children,
}: {
  field?: FormFieldBaseProps<any>;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={field?.className}>
      <div className="flex items-center justify-between">
        {field?.label && (
          <FieldLabel
            className={field?.labelClassName}
            htmlFor={field?.id}
            required={field?.required}
          >
            {field?.label}
          </FieldLabel>
        )}
        {field?.labelSuffix && (
          <span className="mb-2 text-xs">{field?.labelSuffix}</span>
        )}
      </div>
      <div className={field?.className}>{children}</div>
      <FieldErrorText className={field?.errorClassName} error={field?.error} />
    </div>
  );
};

export default FormField;
