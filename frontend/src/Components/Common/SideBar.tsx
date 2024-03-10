import { Close } from "@mui/icons-material";
import { Drawer, IconButton } from "@mui/material";
import clsx from "clsx";
import { Link, navigate, usePath } from "raviger";
import React, { useEffect, useState } from "react";
import { PREFERENCE_SIDEBAR_KEY, SIDEBAR } from "../../Common/constants";
import { useAuthContext } from "../../Common/hooks/useAuthUser";
import useWindowDimensions from "../../Common/hooks/useWindowDimensions";
import kanbex from "../../assets/images/kanbex.png";
import logo from "../../assets/images/logo.jpg";

const menus = [
  {
    icon: "fas fa-history",
    link: "/",
    title: "Tasks",
  },
];

interface SideBarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const SideBar: React.FC<SideBarProps> = ({ isOpen, setIsOpen }) => {
  const authUser = useAuthContext();
  const loginUser = authUser?.user?.username;
  const path = usePath();
  const url = path?.replaceAll("/", "");

  const active = menus.reduce((acc, menu) => {
    const tag = menu.link.replaceAll("/", "");

    return url?.includes(tag) ? tag : acc;
  }, "");

  const { width } = useWindowDimensions();
  const mobileBreakpoint = 768;
  const isMobile = width <= mobileBreakpoint ? true : false;
  const [enableCollapse, setEnableCollapse] = useState(
    localStorage.getItem(PREFERENCE_SIDEBAR_KEY) === SIDEBAR.COLLAPSED
  );
  const [expanded, setExpanded] = useState(!enableCollapse);
  const handleSignOut = () => {
    localStorage.removeItem("kanbex_access_token");
    localStorage.removeItem("kanbex_refresh_token");
    localStorage.removeItem("preferenceSidebar");
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    window.addEventListener("storage", () => {
      setEnableCollapse(
        localStorage.getItem(PREFERENCE_SIDEBAR_KEY) === SIDEBAR.COLLAPSED
      );
    });
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setExpanded(isMobile);

    return () => {
      setIsOpen(false);
    };
  }, [isMobile, setIsOpen]);

  useEffect(() => {
    setExpanded(isMobile || !enableCollapse);
  }, [isMobile, enableCollapse, setExpanded]);

  const open = isOpen || !isMobile;

  return (
    <Drawer
      PaperProps={{
        className: "bg-zinc-500",
      }}
      anchor="left"
      className={clsx(
        "transition-all duration-300",
        expanded ? "w-64" : "w-14"
      )}
      open={open}
      variant={isMobile ? "temporary" : "persistent"}
      onClose={() => setIsOpen(false)}
      onMouseEnter={() => !isMobile && enableCollapse && setExpanded(true)}
      onMouseLeave={() => !isMobile && enableCollapse && setExpanded(false)}
    >
      <div
        className={clsx(
          "flex h-full flex-col overflow-hidden bg-zinc-800 transition-all duration-300",
          expanded ? "w-64" : "w-14"
        )}
      >
        <div className="flex items-center justify-between">
          <Link className="block w-28 shrink-0" href="/">
            <img
              alt="kanbex logo"
              className="m-2 h-auto w-auto p-2 transition"
              src={expanded ? kanbex : logo}
            />
          </Link>
          <IconButton
            aria-label="Close Sidebar"
            className="fill-current px-4 text-white md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <Close style={{ color: "#fff" }} />
          </IconButton>
        </div>
        <nav className="flex-1 overflow-x-hidden px-2">
          {menus.map((item) => {
            return (
              <Link
                key={item.title}
                className={clsx(
                  "my-1 flex w-10 items-center justify-items-start overflow-hidden rounded py-1 transition-all duration-300 hover:bg-zinc-500 hover:text-white",
                  active === item.link.replaceAll("/", "")
                    ? "text-zinc-300 hover:bg-gray-900"
                    : "text-zinc-400",
                  expanded && "w-60"
                )}
                href={item.link}
                onClick={() => isMobile && setIsOpen(false)}
              >
                <div className="flex h-8 w-10 shrink-0 items-center justify-center">
                  <i className={clsx(item.icon, "text-lg")} />
                </div>
                {
                  <div
                    className={clsx(
                      "whitespace-nowrap transition-all duration-300",
                      expanded ? "w-60" : "w-0"
                    )}
                  >
                    {item.title}
                  </div>
                }
              </Link>
            );
          })}
        </nav>

        <div
          className={clsx(
            "ml-2 flex flex-nowrap items-center overflow-hidden py-4 transition-all duration-300",
            expanded ? "w-60" : "w-10"
          )}
        >
          <div className="flex w-10 shrink-0 items-center justify-center">
            <Link
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white"
              href=""
              // href="/user/profile"
            >
              <i className="fas fa-user block text-base text-zinc-900" />
            </Link>
          </div>
          <div className="ml-3 overflow-hidden whitespace-nowrap">
            <Link
              className="mb-1 text-base font-medium leading-5 text-white"
              href="/user/profile"
            >
              {loginUser}
            </Link>
            <p
              className="cursor-pointer text-sm font-medium leading-4 text-white transition duration-150 ease-in-out group-hover:text-zinc-100"
              onClick={handleSignOut}
            >
              Sign Out
            </p>
          </div>
        </div>
      </div>
    </Drawer>
  );
};
