import clsx from "clsx";

interface IProps {
  className?: string;
  path?: {
    fill?: string;
    className?: string;
  };
  circle?: {
    fill?: string;
    className?: string;
    stroke?: string;
    cx?: string;
    cy?: string;
    r?: string;
    strokeWidth?: string;
  };
}

const Spinner = (props: IProps) => {
  const {
    className = "",
    path: { fill: pathFill = "white", className: pathClassName = "" } = {},
    circle: {
      fill: circleFill = "white",
      className: circleClassName = "opacity-75",
      stroke: circleStroke = "#f1edf7",
      cx = "12",
      cy = "12",
      r = "10",
      strokeWidth: circleStrokeWidth = "4",
    } = {},
  } = props;
  return (
    <svg
      className={clsx("z-40 mr-3 h-5 w-5 animate-spin", className)}
      viewBox="0 0 24 24"
    >
      <circle
        className={circleClassName}
        cx={cx}
        cy={cy}
        fill={circleFill}
        r={r}
        stroke={circleStroke}
        strokeWidth={circleStrokeWidth}
      />
      <path
        className={pathClassName}
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        fill={pathFill}
      />
    </svg>
  );
};

export default Spinner;
