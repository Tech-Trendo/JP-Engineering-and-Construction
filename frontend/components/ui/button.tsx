import React from "react";
import Link from "next/link";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "outline" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      href,
      icon,
      iconPosition = "right",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium tracking-tight transition-all duration-150 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-500/50 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer";

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 rounded-md gap-1.5",
      md: "text-sm px-4 py-2 rounded-lg gap-2",
      lg: "text-base px-6 py-3 rounded-lg gap-2.5 font-semibold",
    };

    const variantStyles = {
      // Primary: Deep authoritative Indigo-Blue
      primary:
        "bg-[#1e40af] text-white hover:bg-[#1d4ed8] shadow-sm font-semibold active:translate-y-px",
      // Accent: Warm Amber / Copper (strictly for Quote CTAs & highlights)
      accent:
        "bg-[#d97706] text-white hover:bg-[#b45309] shadow-sm font-semibold active:translate-y-px",
      // Outline: Architectural precision border
      outline:
        "border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-transparent text-slate-900 dark:text-slate-100 hover:bg-slate-100 hover:text-[#1e40af] dark:hover:bg-slate-800/80 active:translate-y-px",
      // Secondary: Soft cool slate tone
      secondary:
        "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 active:translate-y-px",
      // Ghost: Understated minimal
      ghost:
        "text-slate-700 dark:text-slate-300 hover:text-[#1e40af] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60",
    };

    const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

    const content = (
      <>
        {isLoading && (
          <svg
            className="animate-spin -ml-0.5 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && icon && iconPosition === "left" && (
          <span className="shrink-0">{icon}</span>
        )}
        <span>{children}</span>
        {!isLoading && icon && iconPosition === "right" && (
          <span className="shrink-0">{icon}</span>
        )}
      </>
    );

    if (href) {
      return (
        <Link href={href} className={combinedClassName}>
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={combinedClassName}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";
