import Link from "next/link";

type Crumb = { label: string; href?: string };

interface PageBannerProps {
  title: string;
  subtitle?: string;
  badge?: string;
  breadcrumbs?: Crumb[];
  bgImage?: string;
}

export default function PageBanner({ title, subtitle, badge, breadcrumbs, bgImage }: PageBannerProps) {
  return (
    <section
      className="relative py-12 bg-[#1b3a6e]"
      style={
        bgImage
          ? {
              backgroundImage: `linear-gradient(to right, rgba(15,35,71,0.88) 0%, rgba(15,35,71,0.6) 100%), url(${bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <div className="max-w-[1280px] mx-auto px-4">
        <h1 className="text-white text-2xl md:text-3xl font-bold mb-2">{title}</h1>
        {subtitle && <p className="text-gray-200 text-sm max-w-2xl mb-4 leading-relaxed">{subtitle}</p>}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-2 text-xs sm:text-[13px] leading-relaxed">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                <svg className="w-3 h-3 text-[#c8391a]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                {crumb.href ? (
                  <Link href={crumb.href} className="text-gray-300 hover:text-white transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-[#c8391a] font-medium">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
      </div>
    </section>
  );
}
