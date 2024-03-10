/* eslint-disable react/display-name */
import { forwardRef } from "react";

import FormField from "./FormField";
import { FormFieldBaseProps, useFormFieldPropsResolver } from "./Utils";

export type TextAreaFormFieldProps = FormFieldBaseProps<string> & {
  placeholder?: string;
  value?: string | number;
  rows?: number;
  // prefixIcon?: React.ReactNode;
  // suffixIcon?: React.ReactNode;
  onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
};

const TextAreaFormField = forwardRef(
  (
    { rows = 3, ...props }: TextAreaFormFieldProps,
    ref?: React.Ref<HTMLTextAreaElement>
  ) => {
    const field = useFormFieldPropsResolver(props as any);

    return (
      <FormField field={field}>
        <textarea
          ref={ref}
          className={`cui-input-base resize-none ${
            field.error && "border-red-500"
          }`}
          disabled={field.disabled}
          id={field.id}
          name={field.name}
          placeholder={props.placeholder}
          required={field.required}
          rows={rows}
          value={field.value}
          onBlur={props.onBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          onFocus={props.onFocus}
        />
      </FormField>
    );
  }
);

export default TextAreaFormField;
