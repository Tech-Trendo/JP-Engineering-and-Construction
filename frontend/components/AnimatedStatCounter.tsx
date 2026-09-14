"use client";

import { useState, useEffect, useRef } from "react";

interface StatItem {
  value: string;
  label: string;
}

interface AnimatedStatCounterProps {
  stats: StatItem[];
}

function parseStatValue(raw: string): { target: number; prefix: string; suffix: string } {
  const match = raw.match(/^([^\d]*)(\d+)([^\d]*)$/);
  if (!match) {
    return { target: 0, prefix: "", suffix: raw };
  }
  return {
    prefix: match[1] || "",
    target: parseInt(match[2], 10),
    suffix: match[3] || "",
  };
}

function SingleCounter({ value, label }: StatItem) {
  const { target, prefix, suffix } = parseStatValue(value);
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated || target === 0) {
      if (target === 0) setCount(0);
      return;
    }

    const duration = 1800; // 1.8 seconds
    const startTime = performance.now();

    function updateCount(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic calculation for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(easeOut * target);

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(target);
      }
    }

    const frameId = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(frameId);
  }, [hasAnimated, target]);

  return (
    <div ref={elementRef} className="py-6 px-6 text-center text-white select-none">
      <div className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight font-display">
        {prefix}
        {count}
        {suffix}
      </div>
      <div className="text-xs md:text-sm text-red-100 mt-1 font-medium tracking-wide">
        {label}
      </div>
    </div>
  );
}

export default function AnimatedStatCounter({ stats }: AnimatedStatCounterProps) {
  if (!stats || stats.length === 0) return null;

  return (
    <section className="bg-[#c8391a] shadow-inner relative z-20">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-red-700/60">
          {stats.map((s) => (
            <SingleCounter key={s.label} value={s.value} label={s.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
