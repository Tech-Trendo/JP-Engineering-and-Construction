"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[App Error Boundary caught error]:", error);
  }, [error]);

  return (
    <>
      <head>
        <title>Server Error | JP Engineering &amp; Construction</title>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <div className="min-h-[55vh] flex flex-col items-center justify-center p-8 text-center bg-gray-50">
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 text-2xl font-bold shadow-sm">
        !
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        Unable to load — please try again later
      </h2>
      <p className="text-gray-600 max-w-md mb-6 text-sm leading-relaxed">
        The application is unable to connect to the backend service. Please ensure the backend server is running and try refreshing the page.
      </p>
      <button
        onClick={() => reset()}
        className="inline-flex items-center justify-center gap-2 bg-[#c8391a] hover:bg-[#a62d14] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded shadow-sm hover:shadow transition-all cursor-pointer"
      >
        Retry Connection
      </button>
    </div>
    </>
  );
}
