import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <head>
        <title>404: Page Not Found | JP Engineering &amp; Construction</title>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <div className="min-h-[60vh] flex items-center justify-center bg-[#f5f6f8]">
      <div className="text-center px-4">
        <div className="text-[120px] font-bold text-[#1b3a6e] leading-none mb-4 opacity-10">404</div>
        <div className="-mt-16 relative z-10">
          <h1 className="text-[#1b3a6e] text-2xl font-bold mb-3">Page Not Found</h1>
          <p className="text-gray-500 text-[14px] mb-8 max-w-[380px] mx-auto">
            The page you are looking for may have been moved or removed. Please use the navigation to find what you need.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-[#c8391a] hover:bg-[#a62d14] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded shadow-sm hover:shadow transition-all"
            >
              Go to Home
            </Link>
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center gap-2 bg-[#c8391a] hover:bg-[#a62d14] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded shadow-sm hover:shadow transition-all"
            >
              Contact Us
            </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
