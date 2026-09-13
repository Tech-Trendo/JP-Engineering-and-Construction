import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "accent" | "neutral" | "outline" | "success";
  size?: "sm" | "md";
  dot?: boolean;
}

export function Badge({
  className = "",
  variant = "neutral",
  size = "sm",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center font-medium font-mono uppercase tracking-wider rounded-md transition-colors select-none";

  const sizeStyles = {
    sm: "text-[10px] px-2 py-0.5 gap-1.5",
    md: "text-xs px-2.5 py-1 gap-2",
  };

  const variantStyles = {
    accent:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30",
    neutral:
      "bg-stone-100 dark:bg-stone-800/80 text-stone-800 dark:text-stone-300 border border-stone-200 dark:border-stone-700",
    outline:
      "border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 bg-transparent",
    success:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30",
  };

  const dotColors = {
    accent: "bg-amber-500",
    neutral: "bg-stone-500",
    outline: "bg-stone-400",
    success: "bg-emerald-500",
  };

  return (
    <span
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]} shrink-0`}
        />
      )}
      <span>{children}</span>
    </span>
  );
}
