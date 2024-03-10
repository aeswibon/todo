import { Transition, TransitionEvents } from "@headlessui/react";
import { Fragment, ReactNode } from "react";

type DropdownMenuTransitionProps = {
  show?: boolean | undefined;
  children: ReactNode;
} & TransitionEvents;

export const DropdownTransition = ({
  show,
  children,
  ...transitionEvents
}: DropdownMenuTransitionProps) => (
  <Transition
    as={Fragment}
    enter="transition ease-out duration-100"
    enterFrom="opacity-0"
    enterTo="opacity-100"
    leave="transition ease-in duration-200"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
    show={show}
    {...transitionEvents}
  >
    {children}
  </Transition>
);
