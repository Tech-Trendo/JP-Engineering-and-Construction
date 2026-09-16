"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function TopLoadingBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger loading completion and scroll-to-top whenever pathname or searchParams change
  useEffect(() => {
    // 1. Scroll window to top immediately on new page load
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (!hash) {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        // Double check on next animation frame after DOM mount
        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        });
      } else {
        // If there is a target hash anchor (e.g. #contact or #category), scroll to it
        setTimeout(() => {
          const el = document.querySelector(hash);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    }

    // 2. Animate top loading bar to 100% and fade out
    setProgress(100);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 300);

    return () => {
      clearTimeout(hideTimer);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [pathname, searchParams]);

  // Intercept click on internal links to start top loading bar instantly
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      const targetAttr = target.getAttribute("target");

      // Only handle internal navigation links
      if (
        href &&
        !href.startsWith("#") &&
        !href.startsWith("tel:") &&
        !href.startsWith("mailto:") &&
        !href.startsWith("javascript:") &&
        targetAttr !== "_blank" &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        // If link points to same origin and different URL
        try {
          const url = new URL(href, window.location.origin);
          if (
            url.origin === window.location.origin &&
            (url.pathname !== window.location.pathname || url.search !== window.location.search)
          ) {
            // Start top progress bar animation
            setVisible(true);
            setProgress(25);

            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = setInterval(() => {
              setProgress((prev) => {
                if (prev >= 85) {
                  if (timerRef.current) clearInterval(timerRef.current);
                  return prev;
                }
                const increment = Math.max(1, (85 - prev) * 0.2);
                return prev + increment;
              });
            }, 120);
          }
        } catch {
          // Invalid URL, ignore
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!visible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none transition-opacity duration-300"
      style={{ opacity: visible || progress > 0 ? 1 : 0 }}
    >
      {/* Progress Track */}
      <div
        className="h-[3.5px] w-full bg-gradient-to-r from-[#1b3a6e] via-[#c8391a] to-[#f97316] transition-all duration-300 ease-out relative"
        style={{
          width: `${progress}%`,
          boxShadow: "0 0 10px rgba(200, 57, 26, 0.7), 0 0 4px rgba(27, 58, 110, 0.5)",
        }}
      >
        {/* Glow peg at leading edge */}
        <div
          className="absolute right-0 top-0 bottom-0 w-24 h-full"
          style={{
            boxShadow: "0 0 12px #f97316, 0 0 6px #c8391a",
            transform: "rotate(3deg) translate(0px, -2px)",
          }}
        />
      </div>
    </div>
  );
}
