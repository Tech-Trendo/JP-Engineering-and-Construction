import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "accent" | "neutral" | "outline" | "success";
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
    primary:
      "bg-[#eff6ff] text-[#1e40af] dark:bg-[#1e40af]/20 dark:text-[#93c5fd] border border-[#bfdbfe] dark:border-[#1e40af]/40",
    accent:
      "bg-[#fef3c7] text-[#92400e] dark:bg-amber-950/40 dark:text-amber-300 border border-[#fde68a] dark:border-amber-800",
    neutral:
      "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
    outline:
      "border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 bg-transparent",
    success:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800",
  };

  const dotColors = {
    primary: "bg-[#1e40af]",
    accent: "bg-[#d97706]",
    neutral: "bg-slate-500",
    outline: "bg-slate-400",
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
