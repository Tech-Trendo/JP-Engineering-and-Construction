import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "editorial" | "interactive" | "ghost";
}

export function Card({
  className = "",
  variant = "default",
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    // Default: Architectural clean surface with hairline border
    default:
      "bg-white dark:bg-stone-900/60 border border-stone-200/90 dark:border-stone-800 text-stone-900 dark:text-stone-100",
    // Editorial: Deep monolithic graphite for featured/showcase blocks
    editorial:
      "bg-stone-900 dark:bg-stone-950 border border-stone-800 text-stone-100 shadow-md",
    // Interactive: Precision hover border transition for catalog items
    interactive:
      "bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 hover:border-stone-400 dark:hover:border-stone-600 transition-all duration-200 group cursor-pointer",
    // Ghost: Minimal technical border for specs and engineering data points
    ghost:
      "bg-transparent border border-stone-200/80 dark:border-stone-800/80 text-stone-900 dark:text-stone-100",
  };

  return (
    <div
      className={`rounded-xl overflow-hidden ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 pb-3 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`text-lg font-bold tracking-tight text-stone-950 dark:text-white leading-snug ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={`text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 pt-2 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`px-6 py-4 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between bg-stone-50/50 dark:bg-stone-900/20 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
