import "./icon.css";
import iconData from "./UniconPaths.json";

const xmlns = "http://www.w3.org/2000/svg";

const findIconName = (className: string) => {
  const iconName = className.match(/care-([a-zA-Z0-9-]+)/);

  return iconName ? iconName[1] : "default";
};

interface IconData {
  [key: string]: (string | number | boolean)[];
}

const getIconData = (className: string) => {
  const data: IconData = iconData;
  const iconName = findIconName(className);
  const icon = data[iconName];

  return typeof icon === "undefined" ? data["default"] : icon;
};

const createSvg = (className: string) => {
  const icon = getIconData(className);
  const el = document.createElementNS(xmlns, "svg");

  el.setAttribute(
    "class",
    className.replace("care", "care-svg-icon__baseline")
  );
  el.setAttribute("role", "img");
  el.setAttribute("xmlns", xmlns);
  el.setAttribute("viewBox", `0 0 ${icon[0]} ${icon[0]}`);

  const path = document.createElementNS(xmlns, "path");

  if (icon[2] === false) {
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", `${icon[3]}`);
  }
  path.setAttribute("fill", icon[2] === false ? "none" : "currentColor");
  path.setAttribute("d", String(icon[1]));
  el.appendChild(path);

  return el;
};

export const transformIcons = () => {
  const elements = Array.from(document.getElementsByClassName("care"));

  elements.forEach((element) => {
    if (element.tagName == "I") {
      element.parentNode?.replaceChild(createSvg(element.className), element);
    }
  });
};

export const addListener = () => {
  window.addEventListener("load", transformIcons);
};
