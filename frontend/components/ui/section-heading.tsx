import React from "react";

export interface SectionHeadingProps {
  eyebrow?: string;
  dot?: boolean;
  title: string;
  description?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  layout?: "split" | "left" | "center";
  className?: string;
  descriptionClassName?: string;
  rightColumnClassName?: string;
}

export function SectionHeading({
  eyebrow,
  dot = false,
  title,
  description,
  badge,
  action,
  layout = "split",
  className = "",
  descriptionClassName = "",
  rightColumnClassName = "",
}: SectionHeadingProps) {
  const renderEyebrow = () => {
    if (!eyebrow) return null;
    return (
      <div className={`flex items-center gap-2 mb-2 ${layout === "center" ? "justify-center" : ""}`}>
        {dot && <span className="h-1.5 w-1.5 rounded-full bg-[#1e40af] shrink-0"></span>}
        <span className="text-xs font-semibold uppercase tracking-wider text-[#1e40af] dark:text-[#93c5fd]">
          {eyebrow}
        </span>
      </div>
    );
  };

  if (layout === "split") {
    return (
      <div
        className={`flex flex-col lg:flex-row lg:items-end justify-between gap-4 lg:gap-8 pb-8 border-b border-slate-200 dark:border-slate-800 ${className}`}
      >
        <div className="w-full lg:w-auto lg:max-w-md xl:max-w-lg shrink-0">
          {badge && <div className="mb-3">{badge}</div>}
          {renderEyebrow()}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[40px] font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            {title}
          </h2>
        </div>

        {(description || action) && (
          <div className={`flex-1 min-w-0 lg:text-right space-y-2.5 ${rightColumnClassName}`}>
            {description && (
              <p className={`text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal ${descriptionClassName}`}>
                {description}
              </p>
            )}
            {action && <div>{action}</div>}
          </div>
        )}
      </div>
    );
  }

  if (layout === "center") {
    return (
      <div className={`text-center max-w-3xl mx-auto space-y-3 pb-8 ${className}`}>
        {badge && <div className="inline-block mb-1">{badge}</div>}
        {renderEyebrow()}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          {title}
        </h2>
        {description && (
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
            {description}
          </p>
        )}
        {action && <div className="pt-2">{action}</div>}
      </div>
    );
  }

  // Layout: "left"
  return (
    <div className={`space-y-3 pb-6 max-w-2xl ${className}`}>
      {badge && <div>{badge}</div>}
      {renderEyebrow()}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
        {title}
      </h2>
      {description && (
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
          {description}
        </p>
      )}
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
