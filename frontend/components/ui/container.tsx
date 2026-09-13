import React from "react";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "narrow" | "wide" | "full";
  as?: "div" | "section" | "main" | "article";
}

export function Container({
  className = "",
  size = "default",
  as: Component = "div",
  children,
  ...props
}: ContainerProps) {
  const sizeStyles = {
    default: "max-w-7xl",
    narrow: "max-w-5xl",
    wide: "max-w-screen-2xl",
    full: "w-full",
  };

  return (
    <Component
      className={`mx-auto px-4 sm:px-6 lg:px-8 ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
