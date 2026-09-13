"use client";

import React, { useState, useEffect, useRef } from "react";

export interface StatCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number; // duration in ms, defaults to 1200ms
  className?: string;
}

export function StatCounter({
  target,
  suffix = "",
  prefix = "",
  duration = 1200,
  className = "",
}: StatCounterProps) {
  const [count, setCount] = useState(0);
  const containerRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          observer.disconnect();

          const startTime = performance.now();

          const updateCounter = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentCount = Math.floor(easeOutProgress * target);

            setCount(currentCount);

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              setCount(target);
            }
          };

          requestAnimationFrame(updateCounter);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [target, duration]);

  return (
    <span ref={containerRef} className={`inline-flex items-baseline ${className}`}>
      <span>{prefix}</span>
      <span>{count}</span>
      {suffix && <span className="select-none">{suffix}</span>}
    </span>
  );
}
