import { createElement, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ContainerElement = "div" | "section" | "article" | "main" | "header" | "footer" | "nav";

type ContainerProps = HTMLAttributes<HTMLElement> & {
  as?: ContainerElement;
  children: ReactNode;
};

export default function Container({
  as,
  children,
  className,
  ...props
}: ContainerProps) {
  const Component = as ?? "div";

  return createElement(
    Component,
    {
      ...props,
      className: cn("mx-auto w-full max-w-[76rem] px-5 sm:px-8 lg:px-10", className),
    },
    children,
  );
}
