import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { CircularProgress } from "@mui/material";
import { FormEvent, useEffect, useState } from "react";

import kanbex from "../../assets/images/kanbex.png";
import { useAuthContext } from "../../Common/hooks/useAuthUser";
import TextFormField from "../Common/Form/FormFields/TextFormField";
import {
  FieldChangeEvent,
  FieldChangeEventHandler,
} from "../Common/Form/FormFields/Utils";

export const Login = () => {
  const { signIn } = useAuthContext();

  const initForm: any = {
    password: "",
    username: "",
  };

  const initErr: any = {};
  const [form, setForm] = useState(initForm);
  const [errors, setErrors] = useState(initErr);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleChange: FieldChangeEventHandler<string> = (
    event: FieldChangeEvent<string>
  ) => setForm({ ...form, [event.name]: event.value });

  const validateData = () => {
    let hasError = false;
    const err = Object.assign({}, errors);

    Object.keys(form).forEach((key) => {
      if (
        typeof form[key] === "string" &&
        key !== "password" &&
        key !== "confirm"
      ) {
        if (!form[key].match(/\w/)) {
          hasError = true;
          err[key] = "field_required";
        }
      }
      if (!form[key]) {
        hasError = true;
        err[key] = "field_required";
      }
    });
    if (hasError) {
      setErrors(err);

      return false;
    }

    return form;
  };

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validated = validateData();

    setLoading(true);
    if (!validated) {
      setLoading(false);

      return;
    }
    await signIn(validated);
    setLoading(false);
  };

  return (
    <div className="relative flex flex-col md:h-screen md:flex-row">
      <div className="top-2 right-2 bg-zinc-500 p-2 md:absolute md:bg-white md:p-0" />
      <div className="flex flex-col justify-center border-black bg-black md:h-full md:w-1/2">
        <div className="">
          <a href={"/"}>
            <img alt="kanbex logo" className=" h-auto w-auto" src={kanbex} />{" "}
          </a>
        </div>
      </div>

      <div className="my-4 flex w-full items-center justify-center md:mt-0 md:h-full md:w-1/2">
        <div className="mt-4 bg-white p-4 md:mt-20">
          <div className="pt-4 text-center text-2xl font-bold text-zinc-900">
            Authorized Login
          </div>
          <form onSubmit={handleSubmit}>
            <div className="my-2">
              <TextFormField
                error={errors.username}
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
              />
              <div className="relative w-full">
                {showPassword ? (
                  <VisibilityIcon
                    className="absolute right-2 top-11"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                ) : (
                  <VisibilityOffIcon
                    className="absolute right-2 top-11"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                )}
                <TextFormField
                  className="w-full"
                  error={errors.password}
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
              {loading ? (
                <div className="flex items-center justify-center">
                  <CircularProgress className="text-zinc-900" />
                </div>
              ) : (
                <button
                  className="mt-3 inline-flex w-full cursor-pointer items-center justify-center rounded bg-zinc-800 px-4 py-2 text-sm font-semibold text-white"
                  type="submit"
                >
                  Login
                </button>
              )}
            </div>
          </form>
          <div className="mt-4 flex w-full items-center justify-center pb-4">
            <a
              className="text-sm text-zinc-800 underline underline-offset-4 hover:text-zinc-900"
              href="/register"
            >
              Don&apos;t have an account? Register
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
