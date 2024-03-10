import { useRedirect, useRoutes } from "raviger";
import { useState } from "react";

import { SideBar } from "../Components/Common/SideBar";
import Error404 from "../Components/ErrorPages/404";
import kanbex from "../assets/images/kanbex.png";

import TaskRoutes from "./routes/TaskRoutes";

const Routes = {
  ...TaskRoutes,
};

export default function AppRouter() {
  const routes = Routes;

  useRedirect("/user", "/users");
  const pages = useRoutes(routes) || <Error404 />;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex w-full flex-1 flex-col overflow-hidden">
        <div className="relative z-10 flex h-16 shrink-0 bg-white shadow md:hidden">
          <button
            aria-label="Open sidebar"
            className="border-r border-gray-200 px-4 text-gray-500 focus:bg-gray-100 focus:text-gray-600 focus:outline-none md:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M4 6h16M4 12h16M4 18h7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>
          <a
            className="flex h-full w-full items-center bg-zinc-800 px-4 md:hidden"
            href="/"
          >
            <img alt="kanbex logo" className="mx-4 h-1/2 w-1/4" src={kanbex} />
          </a>
        </div>

        <main
          className="flex-1 overflow-y-scroll pb-4 focus:outline-none md:py-0"
          id="pages"
        >
          <div className="mx-auto max-w-[1408px] p-3">{pages}</div>
        </main>
      </div>
    </div>
  );
}
