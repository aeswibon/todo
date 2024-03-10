import { useRoutes } from "raviger";

import { Login } from "../Components/Auth/Login";
import { Register } from "../Components/Auth/Register";

const routes = {
  "/": () => <Login />,
  "/login": () => <Login />,
  "/register": () => <Register />,
};

export default function SessionRouter() {
  return useRoutes(routes) || <Login />;
}
