import clsx from "clsx";
import { Link, usePath } from "raviger";
import { useState } from "react";

const MENU_TAGS: { [key: string]: string } = {
  activities: "Activities",
  home: "Home",
  users: "Users",
};

const capitalize = (string: string) => {
  return string
    .replace(/[_-]/g, " ")
    .split(" ")
    .reduce(
      (acc, word) => `${acc + (word[0]?.toUpperCase() || "") + word.slice(1)} `,
      ""
    )
    .trim();
};

export default function Breadcrumbs(props: any) {
  const { replacements } = props;
  const path = usePath();
  const crumbs = path
    ?.slice(1)
    .split("/")
    .map((field, i) => {
      return {
        name:
          replacements[field]?.name || MENU_TAGS[field] || capitalize(field),
        style: replacements[field]?.style || "",
        uri:
          replacements[field]?.uri ||
          path
            .split("/")
            .slice(0, i + 2)
            .join("/"),
      };
    });

  const [showFullPath, setShowFullPath] = useState(false);

  return (
    <div className="w-full">
      <nav aria-label="Breadcrumb" className="flex">
        <ol className="flex flex-wrap items-center space-x-1">
          <li>
            <div>
              <Link className="text-gray-500 hover:text-gray-700" href="/">
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  x-description="Heroicon name: solid/home"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span className="sr-only">Home</span>
              </Link>
            </div>
          </li>
          {!showFullPath && crumbs && crumbs.length > 2 && (
            <li>
              <div className="flex cursor-pointer items-center">
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <span
                  className="ml-1 mt-0.5 inline-flex items-center rounded-full bg-gray-500 px-2.5 py-1 text-xs font-medium hover:bg-gray-700"
                  onClick={() => setShowFullPath(true)}
                >
                  <svg
                    className="mx-0.25 h-1.5 w-1.5 text-white"
                    fill="currentColor"
                    viewBox="0 0 8 8"
                  >
                    <circle cx="4" cy="4" r="3" />
                  </svg>
                  <svg
                    className="mx-0.25 h-1.5 w-1.5 text-white"
                    fill="currentColor"
                    viewBox="0 0 8 8"
                  >
                    <circle cx="4" cy="4" r="3" />
                  </svg>
                  <svg
                    className="mx-0.25 h-1.5 w-1.5 text-white"
                    fill="currentColor"
                    viewBox="0 0 8 8"
                  >
                    <circle cx="4" cy="4" r="3" />
                  </svg>
                </span>
              </div>
            </li>
          )}
          {crumbs?.slice(showFullPath ? 0 : -2).map((crumb: any) => {
            return (
              crumb.name && (
                <li
                  key={crumb.name}
                  className={clsx(
                    "cursor-pointer text-sm font-medium text-gray-500 hover:text-gray-700",
                    crumb.style
                  )}
                >
                  <div className="flex items-center">
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5 shrink-0 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                    </svg>
                    <Link
                      className="ml-1 block text-gray-500 hover:text-gray-700"
                      href={crumb.uri}
                    >
                      {crumb.name.match(/^\w{8}-(\w{4}-){3}\w{12}$/) ? (
                        <div>
                          <i className="fas fa-hashtag fa-lg mr-1" />
                          <span>{`${crumb.name.slice(0, 13)}...`}</span>
                        </div>
                      ) : (
                        <div className="w-20 truncate md:w-full">
                          <span>{crumb.name}</span>
                        </div>
                      )}
                    </Link>
                  </div>
                </li>
              )
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
