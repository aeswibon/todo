import clsx from "clsx";
import React, { useEffect, useRef } from "react";

import { goBack } from "../../Utils/utils";

import Breadcrumbs from "./BreadCrumbs";
import PageHeadTitle from "./PageHeadTitle";

interface PageTitleProps {
  title: string;
  hideBack?: boolean;
  backUrl?: string;
  backButtonCB?: () => number | void;
  className?: string;
  componentRight?: React.ReactNode;
  justifyContents?:
    | "justify-center"
    | "justify-start"
    | "justify-end"
    | "justify-between";
  breadcrumbs?: boolean;
  crumbsReplacements?: {
    [key: string]: { name?: string; uri?: string; style?: string };
  };
  focusOnLoad?: boolean;
}

export default function PageTitle(props: PageTitleProps) {
  const {
    title,
    hideBack,
    backUrl,
    backButtonCB,
    className = "",
    componentRight = <></>,
    breadcrumbs = true,
    crumbsReplacements = {},
    justifyContents = "justify-start",
    focusOnLoad = false,
  } = props;

  const divRef = useRef<any>();

  useEffect(() => {
    if (divRef.current && focusOnLoad) {
      divRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [divRef, focusOnLoad]);

  const onBackButtonClick = () =>
    goBack((backButtonCB && backButtonCB()) || backUrl);

  return (
    <div ref={divRef} className={`mb-4 pt-4 ${className}`}>
      <PageHeadTitle title={title} />
      <div
        className={clsx({
          "flex items-center": true,
          [justifyContents]: true,
        })}
      >
        <div className="flex items-center">
          {!hideBack && (
            <button onClick={onBackButtonClick}>
              <i className="fas fa-chevron-left mr-1 rounded-md p-2 text-2xl hover:bg-gray-200">
                {" "}
              </i>
            </button>
          )}
          <h2 className="ml-0 text-2xl font-semibold leading-tight">{title}</h2>
        </div>
        {componentRight}
      </div>
      <div className={hideBack ? "my-2" : "my-2 ml-8"}>
        {breadcrumbs && <Breadcrumbs replacements={crumbsReplacements} />}
      </div>
    </div>
  );
}
