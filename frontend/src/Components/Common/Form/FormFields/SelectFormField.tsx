import SelectMenuV2 from "../SelectMenu";

import FormField from "./FormField";
import { FormFieldBaseProps, useFormFieldPropsResolver } from "./Utils";

type OptionCallback<T, R> = (option: T) => R;

type SelectFormFieldProps<T, V = T> = FormFieldBaseProps<V> & {
  placeholder?: React.ReactNode;
  options: readonly T[];
  position?: "above" | "below";
  optionLabel: OptionCallback<T, React.ReactNode>;
  optionSelectedLabel?: OptionCallback<T, React.ReactNode>;
  optionDescription?: OptionCallback<T, React.ReactNode>;
  optionIcon?: OptionCallback<T, React.ReactNode>;
  optionValue?: OptionCallback<T, V>;
};

export const SelectFormField = <T, V>(props: SelectFormFieldProps<T, V>) => {
  const field = useFormFieldPropsResolver<V>(props);

  return (
    <FormField field={field}>
      <SelectMenuV2
        disabled={field.disabled}
        id={field.id}
        optionDescription={props.optionDescription}
        optionIcon={props.optionIcon}
        optionLabel={props.optionLabel}
        optionSelectedLabel={props.optionSelectedLabel}
        optionValue={props.optionValue}
        options={props.options}
        placeholder={props.placeholder}
        position={props.position}
        required={field.required}
        requiredError={field.error ? props.required : false}
        value={field.value}
        onChange={(value: any) => field.handleChange(value)}
      />
    </FormField>
  );
};
