import { navigate } from "raviger";

import * as Notifications from "../Notification";

import { RequestResult } from "./types";

export default function handleResponse(
  { res, error }: RequestResult<unknown>,
  silent?: boolean
) {
  const notify = silent ? undefined : Notifications;

  if (res === undefined) {
    return;
  }

  // 400/406 Bad Request
  if (res.status === 400 || res.status === 406) {
    notify?.BadRequest({ errs: error });

    return;
  }

  // Other Errors between 400-599 (inclusive)
  if (res.status >= 400 && res.status < 600) {
    // Invalid token
    if (!silent && error?.code === "token_not_valid") {
      navigate(`/login?redirect=${window.location.href}`);
    }

    notify?.Error({ msg: error?.detail || "Something went wrong...!" });

    return;
  }
}
