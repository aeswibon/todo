/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { Stack, alert, defaultModules } from "@pnotify/core";
import * as PNotifyMobile from "@pnotify/mobile";
import _ from "lodash";

defaultModules.set(PNotifyMobile, {});

const notifyStack = new Stack({
  dir1: "down",
  dir2: "left",
  firstpos1: 25,
  firstpos2: 25,
  maxClosureCausesWait: false,
  maxOpen: 3,
  maxStrategy: "close",
  modal: false,
  push: "top",
});

const notify = (text, type) => {
  const notification = alert({
    buttons: {
      closer: false,
      sticker: false,
    },
    mode: "light",
    stack: notifyStack,
    sticker: false,
    styling: "brighttheme",
    text,
    type,
  });

  notification.refs.elem.addEventListener("click", () => {
    notification.close();
  });
};

const notifyError = (error) => {
  let errorMsg = "";

  if (typeof error === "string" || !error) {
    errorMsg =
      !error || error.length > 100 ? "Something went wrong...!" : error;
  } else if (error.response.data.detail) {
    errorMsg = error.response.data.detail;
  } else {
    for (const [key, value] of Object.entries(error)) {
      const keyName = _.startCase(_.camelCase(key));

      if (Array.isArray(value)) {
        const uniques = [...new Set(value)];

        errorMsg += `${keyName} - ${uniques.splice(0, 5).join(", ")}`;
      } else if (typeof value === "string") {
        errorMsg += `${keyName} - ${value}`;
      } else {
        errorMsg += `${keyName} - Bad Request`;
      }
      errorMsg += "\n";
    }
  }
  notify(errorMsg, "error");
};

/** Close all Notifications **/
export const closeAllNotifications = () => {
  notifyStack.close();
};

/** Success message handler */
export const Success = ({ msg }) => {
  notify(msg, "success");
};

/** Error message handler */
export const Error = ({ msg }) => {
  notify(msg, "error");
};

/** 400 Bad Request handler */
export const BadRequest = ({ errs }) => {
  if (Array.isArray(errs)) {
    errs.forEach((error) => notifyError(error));
  } else {
    notifyError(errs);
  }
};
