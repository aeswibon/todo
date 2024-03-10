import type { MutableRefObject } from "react";

import { useEffect, useRef, useState } from "react";

export default function useVisibility<Element extends HTMLElement>(
  offset = 0
): [boolean, MutableRefObject<Element | undefined>] {
  const [isVisible, setIsVisible] = useState(false);
  const currentElement = useRef<Element>();

  const onScroll = () => {
    if (!currentElement.current) {
      setIsVisible(false);

      return;
    }
    const { top } = currentElement.current.getBoundingClientRect();

    setIsVisible(top + offset >= 0 && top - offset <= window.innerHeight);
  };

  useEffect(() => {
    document.addEventListener("scroll", onScroll, true);

    return () => document.removeEventListener("scroll", onScroll, true);
  });

  return [isVisible, currentElement];
}
