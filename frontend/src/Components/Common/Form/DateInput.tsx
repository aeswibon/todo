import { Popover } from "@headlessui/react";
import clsx from "clsx";
import { MutableRefObject, useEffect, useState } from "react";

import Icon from "../../../Utils/Icons";
import * as Notification from "../../../Utils/Notification";
import dayjs from "../../../Utils/dayjs";

type DatePickerType = "date" | "month" | "year";
export type DatePickerPosition = "LEFT" | "RIGHT" | "CENTER" | "TOP";

interface IProps {
  id?: string;
  name?: string;
  className?: string;
  containerClassName?: string;
  value: Date | undefined;
  min?: Date;
  max?: Date;
  outOfLimitsErrorMessage?: string;
  onChange: (date: Date) => void;
  position?: DatePickerPosition;
  disabled?: boolean;
  placeholder?: string;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const DateInput: React.FC<IProps> = (props: IProps) => {
  const {
    id,
    name,
    className,
    containerClassName,
    value,
    min,
    max,
    outOfLimitsErrorMessage,
    onChange,
    position,
    disabled,
    placeholder,
    isOpen,
    setIsOpen,
  } = props;
  const [dayCount, setDayCount] = useState<Array<number>>([]);
  const [blankDays, setBlankDays] = useState<Array<number>>([]);

  const [datePickerHeaderDate, setDatePickerHeaderDate] = useState(new Date());
  const [type, setType] = useState<DatePickerType>("date");
  const [year, setYear] = useState(new Date());
  const [displayValue, setDisplayValue] = useState<string>(
    value ? dayjs(value).format("DDMMYYYY") : ""
  );

  const decrement = () => {
    switch (type) {
      case "date":
        setDatePickerHeaderDate((prev) =>
          dayjs(prev).subtract(1, "month").toDate()
        );
        break;
      case "month":
        setDatePickerHeaderDate((prev) =>
          dayjs(prev).subtract(1, "year").toDate()
        );
        break;
      case "year":
        setDatePickerHeaderDate((prev) =>
          dayjs(prev).subtract(1, "year").toDate()
        );
        setYear((prev) => dayjs(prev).subtract(10, "year").toDate());
        break;
    }
  };

  const increment = () => {
    switch (type) {
      case "date":
        setDatePickerHeaderDate((prev) => dayjs(prev).add(1, "month").toDate());
        break;
      case "month":
        setDatePickerHeaderDate((prev) => dayjs(prev).add(1, "year").toDate());
        break;
      case "year":
        setDatePickerHeaderDate((prev) => dayjs(prev).add(1, "year").toDate());
        setYear((prev) => dayjs(prev).add(10, "year").toDate());
        break;
    }
  };

  const isSelectedDate = (date: number) => {
    if (value) {
      return dayjs(
        new Date(value.getFullYear(), value.getMonth(), date)
      ).isSame(dayjs(value));
    }
  };

  type CloseFunction = (
    focusableElement?: HTMLElement | MutableRefObject<HTMLElement | null>
  ) => void;

  const setDateValue = (date: number, close: CloseFunction) => () => {
    isDateWithinConstraints(date)
      ? (() => {
          onChange(
            new Date(
              datePickerHeaderDate.getFullYear(),
              datePickerHeaderDate.getMonth(),
              date
            )
          );
          close();
          setIsOpen?.(false);
        })()
      : Notification.Error({
          msg: outOfLimitsErrorMessage ?? "Cannot select date out of range",
        });
  };

  const getDayCount = (date: Date) => {
    const daysInMonth = dayjs(date).daysInMonth();

    const dayOfWeek = dayjs(
      new Date(date.getFullYear(), date.getMonth(), 1)
    ).day();
    const blankDaysArray = [];

    for (let i = 1; i <= dayOfWeek; i++) {
      blankDaysArray.push(i);
    }

    const daysArray = [];

    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }

    setBlankDays(blankDaysArray);
    setDayCount(daysArray);
  };

  const getLastDay = (
    year = datePickerHeaderDate.getFullYear(),
    month = datePickerHeaderDate.getMonth()
  ) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const isDateWithinConstraints = (
    day = datePickerHeaderDate.getDate(),
    month = datePickerHeaderDate.getMonth(),
    year = datePickerHeaderDate.getFullYear()
  ) => {
    const date = new Date(year, month, day);

    if (min) if (date < min) return false;
    if (max) if (date > max) return false;

    return true;
  };

  const isSelectedMonth = (month: number) =>
    month === datePickerHeaderDate.getMonth();

  const isSelectedYear = (year: number) =>
    year === datePickerHeaderDate.getFullYear();

  const setMonthValue = (month: number) => () => {
    setDatePickerHeaderDate(
      new Date(
        datePickerHeaderDate.getFullYear(),
        month,
        datePickerHeaderDate.getDate()
      )
    );
    setType("date");
  };

  const setYearValue = (year: number) => () => {
    setDatePickerHeaderDate(
      new Date(
        year,
        datePickerHeaderDate.getMonth(),
        datePickerHeaderDate.getDate()
      )
    );
    setType("date");
  };

  const showMonthPicker = () => setType("month");

  const showYearPicker = () => setType("year");

  useEffect(() => {
    getDayCount(datePickerHeaderDate);
  }, [datePickerHeaderDate]);

  useEffect(() => {
    value && setDatePickerHeaderDate(new Date(value));
  }, [value]);

  const getPosition = () => {
    switch (position) {
      case "LEFT":
        return "left-0";
      case "RIGHT":
        return "right-0 transform translate-x-1/2";
      case "CENTER":
        return "transform -translate-x-1/2";
      case "TOP":
        return "top-0 transform -translate-y-full";
      default:
        return "left-0";
    }
  };

  return (
    <div>
      <div
        className={`${containerClassName ?? "container mx-auto text-black"}`}
      >
        <Popover className="relative">
          {({ open, close }) => (
            <div>
              <Popover.Button className="w-full" disabled={disabled}>
                <input name="date" type="hidden" />
                <input
                  readOnly
                  className={`cui-input-base cursor-pointer disabled:cursor-not-allowed ${className}`}
                  disabled={disabled}
                  id={id}
                  name={name}
                  placeholder={placeholder ?? "select_date"}
                  type="text"
                  value={value && dayjs(value).format("DD/MM/YYYY")}
                />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 p-2">
                  <Icon className="k-l-calendar-alt text-lg text-gray-600" />
                </div>
              </Popover.Button>

              {(open || isOpen) && (
                <Popover.Panel
                  static
                  className={clsx(
                    "cui-dropdown-base absolute mt-0.5 w-72 divide-y-0 p-4",
                    getPosition()
                  )}
                >
                  <div className="mb-4 flex w-full flex-col items-center justify-between">
                    <input
                      autoFocus
                      className="cui-input-base bg-gray-50"
                      id="date-input"
                      placeholder={"DD/MM/YYYY"} // Display the value in DD/MM/YYYY format
                      value={
                        displayValue.replace(
                          /^(\d{2})(\d{0,2})(\d{0,4}).*/,
                          (_, dd, mm, yyyy) =>
                            [dd, mm, yyyy].filter(Boolean).join("/")
                        ) || ""
                      }
                      onChange={(e) => {
                        setDisplayValue(e.target.value.replaceAll("/", ""));
                        const value = dayjs(e.target.value, "DD/MM/YYYY", true);

                        if (value.isValid()) {
                          onChange(value.toDate());
                          close();
                          setIsOpen?.(false);
                        }
                      }}
                    />
                    <div className="mt-4 flex">
                      <button
                        className="inline-flex aspect-square cursor-pointer items-center justify-center rounded p-2 transition duration-100 ease-in-out hover:bg-gray-300"
                        disabled={
                          !isDateWithinConstraints(
                            getLastDay(),
                            datePickerHeaderDate.getMonth() - 1
                          )
                        }
                        type="button"
                        onClick={decrement}
                      >
                        <Icon className="k-l-angle-left-b text-lg" />
                      </button>

                      <div className="flex items-center justify-center text-sm">
                        {type === "date" && (
                          <div
                            className="cursor-pointer rounded px-3 py-1 text-center font-medium text-black hover:bg-gray-300"
                            onClick={showMonthPicker}
                          >
                            {dayjs(datePickerHeaderDate).format("MMMM")}
                          </div>
                        )}
                        <div
                          className="cursor-pointer rounded px-3 py-1 font-medium text-black hover:bg-gray-300"
                          onClick={showYearPicker}
                        >
                          <p className="text-center">
                            {type == "year"
                              ? year.getFullYear()
                              : dayjs(datePickerHeaderDate).format("YYYY")}
                          </p>
                        </div>
                      </div>
                      <button
                        className="inline-flex aspect-square cursor-pointer items-center justify-center rounded p-2 transition duration-100 ease-in-out hover:bg-gray-300"
                        disabled={
                          (type === "year" &&
                            new Date().getFullYear() === year.getFullYear()) ||
                          !isDateWithinConstraints(getLastDay())
                        }
                        type="button"
                        onClick={increment}
                      >
                        <Icon className="k-l-angle-right-b text-lg" />
                      </button>
                    </div>
                  </div>
                  {type === "date" && (
                    <>
                      <div className="mb-3 flex flex-wrap">
                        {DAYS.map((day, i) => (
                          <div
                            key={day}
                            className="aspect-square w-[14.26%]"
                            id={`day-${i}`}
                          >
                            <div className="text-center text-sm font-medium text-gray-800">
                              {day}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap">
                        {blankDays.map((_, i) => (
                          <div
                            key={i}
                            className="aspect-square w-[14.26%] border border-transparent p-1 text-center text-sm"
                          />
                        ))}
                        {dayCount.map((d, i) => {
                          const withinConstraints = isDateWithinConstraints(d);
                          const selected = value && isSelectedDate(d);

                          const baseClasses =
                            "flex h-full items-center justify-center rounded text-center text-sm leading-loose transition duration-100 ease-in-out";
                          let conditionalClasses = "";

                          if (withinConstraints) {
                            if (selected) {
                              conditionalClasses =
                                "bg-primary-500 font-bold text-white";
                            } else {
                              conditionalClasses =
                                "hover:bg-gray-300 cursor-pointer";
                            }
                          } else {
                            conditionalClasses =
                              "!cursor-not-allowed !text-gray-400";
                          }

                          return (
                            <div
                              key={i}
                              className="aspect-square w-[14.26%]"
                              id={`date-${d}`}
                            >
                              <div
                                className={`${baseClasses} ${conditionalClasses}`}
                                onClick={setDateValue(d, close)}
                              >
                                {d}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                  {type === "month" && (
                    <div className="flex flex-wrap">
                      {Array(12)
                        .fill(null)
                        .map((_, i) => (
                          <div
                            key={i}
                            className={clsx(
                              "w-1/4 cursor-pointer rounded-lg px-2 py-4 text-center text-sm font-semibold",
                              value && isSelectedMonth(i)
                                ? "bg-green-500 text-white"
                                : "text-gray-700 hover:bg-gray-300"
                            )}
                            id={`month-${i}`}
                            onClick={setMonthValue(i)}
                          >
                            {dayjs(
                              new Date(datePickerHeaderDate.getFullYear(), i, 1)
                            ).format("MMM")}
                          </div>
                        ))}
                    </div>
                  )}
                  {type === "year" && (
                    <div className="flex flex-wrap">
                      {Array(12)
                        .fill(null)
                        .map((_, i) => {
                          const y = year.getFullYear() - 11 + i;

                          return (
                            <div
                              key={i}
                              className={clsx(
                                "w-1/4 cursor-pointer rounded-lg px-2 py-4 text-center text-sm font-semibold",
                                value && isSelectedYear(y)
                                  ? "bg-green-500 text-white"
                                  : "text-gray-700 hover:bg-gray-300"
                              )}
                              id={`year-${i}`}
                              onClick={setYearValue(y)}
                            >
                              {y}
                            </div>
                          );
                        })}
                    </div>
                  )}
                </Popover.Panel>
              )}
            </div>
          )}
        </Popover>
      </div>
    </div>
  );
};

DateInput.defaultProps = {
  position: "CENTER",
};

export default DateInput;
