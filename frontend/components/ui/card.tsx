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
    // Default: Architectural clean surface with multi-layer subtle shadow & border
    default:
      "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] rounded-2xl",
    // Editorial: Deep midnight navy for featured/showcase blocks
    editorial:
      "bg-[#0a0f1d] border border-slate-800 text-slate-100 shadow-[0_8px_30px_-4px_rgba(10,15,29,0.3)] rounded-2xl",
    // Interactive: Precision hover elevation transition for catalog/team cards
    interactive:
      "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] hover:shadow-[0_16px_32px_-4px_rgba(15,23,42,0.1)] hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-1 transition-all duration-200 rounded-2xl group cursor-pointer",
    // Ghost: Minimal technical border for specs and engineering data points
    ghost:
      "bg-transparent border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl",
  };

  return (
    <div
      className={`overflow-hidden ${variantStyles[variant]} ${className}`}
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
