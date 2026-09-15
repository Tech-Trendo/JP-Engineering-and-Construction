import Link from "next/link";
import { getMediaUrl, type PublicSiteSettings, type PublicCategory, type PublicIndustry } from "@/lib/public-api";

export default function Footer({
  siteSettings,
  categories = [],
  industries = [],
}: {
  siteSettings?: PublicSiteSettings;
  categories?: PublicCategory[];
  industries?: PublicIndustry[];
}) {
  const companyName = siteSettings?.company_name || "";
  const tagline = siteSettings?.tagline || "";
  const description = siteSettings?.company_description || "";
  const address = siteSettings?.address || "";
  const phone = siteSettings?.primary_phone;
  const email = siteSettings?.primary_email;
  const hours = siteSettings?.business_hours || "";

  const socials = [
    {
      name: "Facebook",
      url: siteSettings?.facebook_url,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: "X",
      url: siteSettings?.twitter_url,
      icon: (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      url: siteSettings?.linkedin_url,
      icon: (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      url: siteSettings?.youtube_url,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418zM15.194 12 10 15V9l5.194 3z" clipRule="evenodd" />
        </svg>
      ),
    },
  ].filter((s) => Boolean(s.url));

  return (
    <footer className="bg-[#0f1b33] text-white">
      {/* Main footer */}
      <div className="max-w-[1280px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-[46px] h-[46px] rounded flex items-center justify-center shrink-0 overflow-hidden bg-white/10 p-1 border border-white/10">
                <img
                  src={getMediaUrl(siteSettings?.logo_url) || "/assets/logo.webp"}
                  alt={companyName}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="font-bold text-white text-sm leading-tight">
                  {companyName}
                </div>
                {tagline ? (
                  <div className="text-[10px] text-gray-400 leading-tight mt-0.5">
                    {tagline}
                  </div>
                ) : null}
              </div>
            </div>
            <p className="text-gray-400 text-[13px] leading-relaxed mb-3">
              {description}
            </p>
            {siteSettings?.iso_certified !== false && (
              <Link
                href="/#iso-certified"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-emerald-500/30 text-emerald-400 rounded text-xs font-semibold mb-3 transition-colors"
                title="View ISO 9001:2015 Registration Certificate"
              >
                <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{siteSettings?.iso_standard ? `${siteSettings.iso_standard} Certified Organization` : "ISO 9001:2015 Certified Organization"}</span>
              </Link>
            )}
            {socials.length > 0 && (
              <div className="flex items-center gap-2 mt-4">
                {socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-white/10 hover:bg-[#c8391a] text-gray-300 hover:text-white rounded flex items-center justify-center transition-all duration-200"
                    title={s.name}
                    aria-label={s.name}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-white/10">
              Navigation
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Home", href: "/" },
                { label: "About Introduction", href: "/about/introduction" },
                { label: "Our Team", href: "/about/our-team" },
                { label: "Our Clients", href: "/about/our-clients" },
                { label: "Our Partners", href: "/about/our-partners" },
                { label: "All Industries", href: "/industries" },
                { label: "All Machinery", href: "/products" },
                { label: "Request Quote", href: "/contact-us#quote" },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-gray-400 text-[13px] hover:text-[#c8391a] transition-colors flex items-center gap-2"
                  >
                    <svg className="w-2.5 h-2.5 text-[#c8391a]" fill="currentColor" viewBox="0 0 6 10">
                      <path d="M1 1l4 4-4 4" stroke="currentColor" fill="none" strokeWidth={1.5} />
                    </svg>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industrial Sectors (Dynamic) */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-white/10">
              Industries
            </h4>
            <ul className="space-y-2">
              {industries.length > 0 ? (
                industries.map((ind) => (
                  <li key={ind.id}>
                    <Link
                      href={`/industries/${ind.slug}`}
                      className="text-gray-400 text-[13px] hover:text-[#c8391a] transition-colors flex items-center gap-2"
                    >
                      <svg className="w-2.5 h-2.5 text-[#c8391a]" fill="currentColor" viewBox="0 0 6 10">
                        <path d="M1 1l4 4-4 4" stroke="currentColor" fill="none" strokeWidth={1.5} />
                      </svg>
                      <span className="truncate">{ind.name}</span>
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link href="/industries" className="text-gray-400 text-[13px] hover:text-[#c8391a]">
                    View All Industries
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Machinery Categories (Dynamic from Backend) */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-white/10">
              Machinery Lines
            </h4>
            <ul className="space-y-2">
              {categories.length > 0 ? (
                categories.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/products#${c.slug}`}
                      className="text-gray-400 text-[13px] hover:text-[#c8391a] transition-colors flex items-center gap-2"
                    >
                      <svg className="w-2.5 h-2.5 text-[#c8391a]" fill="currentColor" viewBox="0 0 6 10">
                        <path d="M1 1l4 4-4 4" stroke="currentColor" fill="none" strokeWidth={1.5} />
                      </svg>
                      <span className="truncate">{c.name}</span>
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link
                    href="/products"
                    className="text-gray-400 text-[13px] hover:text-[#c8391a]"
                  >
                    View Machinery Catalog
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-white/10">
              Contact Info
            </h4>
            <ul className="space-y-3 text-[13px] text-gray-400">
              {address ? (
                <li className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-[#c8391a] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{address}</span>
                </li>
              ) : null}
              {(phone || siteSettings?.secondary_phone) ? (
                <li className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-[#c8391a] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div className="flex flex-col gap-1">
                    {phone && (
                      <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="hover:text-white transition-colors">
                        {phone}
                      </a>
                    )}
                    {siteSettings?.secondary_phone &&
                      siteSettings.secondary_phone.split(",").map((num, idx) => {
                        const clean = num.trim();
                        return (
                          <a
                            key={idx}
                            href={`tel:${clean.replace(/[^\d+]/g, "")}`}
                            className="hover:text-white transition-colors"
                          >
                            {clean}
                          </a>
                        );
                      })}
                  </div>
                </li>
              ) : null}
              {email ? (
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[#c8391a] shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                    {email}
                  </a>
                </li>
              ) : null}
              {hours ? (
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[#c8391a] shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{hours}</span>
                </li>
              ) : null}
              {!address && !phone && !email && (
                <li className="text-gray-500 italic">Contact details currently offline.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-4 bg-[#091122]">
        <div className="max-w-[1280px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
          <div>
            &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
          </div>
          <div className="flex gap-4">
            <Link href="/about/company-profile" className="hover:text-gray-300 transition-colors">
              Company Profile
            </Link>
            <Link href="/contact-us" className="hover:text-gray-300 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
