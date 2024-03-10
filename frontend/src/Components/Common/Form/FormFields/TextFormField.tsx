/* eslint-disable react/display-name */
import clsx from "clsx";
import { HTMLInputTypeAttribute, forwardRef, useState } from "react";

import Icon from "../../../../Utils/Icons";

import FormField from "./FormField";
import { FormFieldBaseProps, useFormFieldPropsResolver } from "./Utils";

export type TextFormFieldProps = FormFieldBaseProps<string> & {
  placeholder?: string;
  value?: string | number;
  autoComplete?: string;
  type?: HTMLInputTypeAttribute;
  className?: string | undefined;
  inputClassName?: string | undefined;
  removeDefaultClasses?: true | undefined;
  leading?: React.ReactNode | undefined;
  trailing?: React.ReactNode | undefined;
  leadingFocused?: React.ReactNode | undefined;
  trailingFocused?: React.ReactNode | undefined;
  trailingPadding?: string | undefined;
  leadingPadding?: string | undefined;
  min?: string | number;
  max?: string | number;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
};

const TextFormField = forwardRef((props: TextFormFieldProps, ref) => {
  const field = useFormFieldPropsResolver(props as any);
  const { leading, trailing } = props;
  const leadingFocused = props.leadingFocused || props.leading;
  const trailingFocused = props.trailingFocused || props.trailing;
  const hasLeading = !!(leading || leadingFocused);
  const hasTrailing = !!(trailing || trailingFocused);
  const hasIcon = hasLeading || hasTrailing;
  const [showPassword, setShowPassword] = useState(false);

  const getPasswordFieldType = () => {
    return showPassword ? "text" : "password";
  };

  let child = (
    <input
      ref={ref as any}
      autoComplete={props.autoComplete}
      className={clsx(
        "cui-input-base peer",
        hasLeading && (props.leadingPadding || "pl-10"),
        hasTrailing && (props.trailingPadding || "pr-10"),
        field.error && "border-red-500",
        field.className
      )}
      disabled={field.disabled}
      id={field.id}
      max={props.max}
      min={props.min}
      name={field.name}
      placeholder={props.placeholder}
      required={field.required}
      type={props.type === "password" ? getPasswordFieldType() : props.type}
      value={field.value}
      onBlur={props.onBlur}
      onChange={(e) => field.handleChange(e.target.value)}
      onFocus={props.onFocus}
      onKeyDown={props.onKeyDown}
    />
  );

  if (props.type === "password") {
    child = (
      <div className="relative">
        {child}
        <button
          className="z-[5] absolute right-0 top-0 flex h-full items-center px-3 text-xl"
          type="button"
          onClick={() => setShowPassword(!showPassword)}
        >
          <Icon className={`k-l-eye${showPassword ? "" : "-slash"}`} />
        </button>
      </div>
    );
  }

  if (hasIcon) {
    const _leading =
      leading === leadingFocused ? (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          {leading}
        </div>
      ) : (
        <>
          <div className="absolute inset-y-0 left-0 flex translate-y-0 items-center pl-3 opacity-100 transition-all delay-300 duration-500 ease-in-out peer-focus:translate-y-1 peer-focus:opacity-0">
            {leading}
          </div>
          <div className="absolute inset-y-0 left-0 flex -translate-y-1 items-center pl-3 opacity-0 transition-all delay-300 duration-500 ease-in-out peer-focus:translate-y-0 peer-focus:opacity-100">
            {leadingFocused}
          </div>
        </>
      );
    const _trailing =
      trailing === trailingFocused ? (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {trailing}
        </div>
      ) : (
        <>
          <div className="absolute inset-y-0 right-0 flex translate-y-0 items-center pr-3 opacity-100 transition-all delay-300 duration-500 ease-in-out peer-focus:translate-y-1 peer-focus:opacity-0">
            {trailing}
          </div>
          <div className="absolute inset-y-0 right-0 flex -translate-y-1 items-center pr-3 opacity-0 transition-all delay-300 duration-500 ease-in-out peer-focus:translate-y-0 peer-focus:opacity-100">
            {trailingFocused}
          </div>
        </>
      );

    child = (
      <div className="relative">
        {(leading || leadingFocused) && _leading}
        {child}
        {(trailing || trailingFocused) && _trailing}
      </div>
    );
  }

  return <FormField field={field}>{child}</FormField>;
});

export default TextFormField;
