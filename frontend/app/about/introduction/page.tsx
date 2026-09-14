import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import { getPublicSiteContent, getPublicSiteSettings, getMediaUrl, PublicSiteContent, PublicSiteSettings } from "@/lib/public-api";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getPublicSiteSettings();
    return {
      title: `Introduction - ${settings.company_short_name}`,
      description: `About ${settings.company_name} - industrial machinery manufacturer and turnkey engineering partner.`,
    };
  } catch {
    return {
      title: "Introduction - JP Engineering & Construction Pvt. Ltd.",
      description: "Corporate introduction and manufacturing capabilities.",
    };
  }
}

export default async function IntroductionPage() {
  let siteContent: PublicSiteContent | null = null;
  let siteSettings: PublicSiteSettings | null = null;
  let hasError = false;

  const [contentRes, settingsRes] = await Promise.allSettled([
    getPublicSiteContent(),
    getPublicSiteSettings(),
  ]);

  if (contentRes.status === "fulfilled") {
    siteContent = contentRes.value;
  } else {
    hasError = true;
    console.error("[IntroductionPage] getPublicSiteContent failed:", contentRes.reason);
  }

  if (settingsRes.status === "fulfilled") {
    siteSettings = settingsRes.value;
  } else {
    hasError = true;
    console.error("[IntroductionPage] getPublicSiteSettings failed:", settingsRes.reason);
  }

  const paragraphs = siteContent?.full_intro
    ? siteContent.full_intro.split("\n\n").filter(Boolean)
    : [];

  return (
    <>
      <PageBanner
        title="Corporate Introduction"
        breadcrumbs={[{ label: "About Us" }, { label: "Introduction" }]}
      />

      <section className="py-12 bg-white">
        <div className="max-w-[1280px] mx-auto px-4">
          {hasError ? (
            <div className="p-12 border border-red-200 bg-red-50 text-center rounded-lg max-w-lg mx-auto my-8">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3 font-bold text-xl">
                !
              </div>
              <h3 className="text-red-800 font-bold text-lg mb-1">Unable to load introduction</h3>
              <p className="text-red-700 text-sm leading-relaxed">
                Unable to load corporate introduction — please ensure the backend server is running and try again later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Main content */}
              <div className="lg:col-span-2">
                <span className="text-[#c8391a] text-xs font-semibold uppercase tracking-widest">
                  Who We Are
                </span>
                <h2 className="text-[#1b3a6e] text-2xl md:text-3xl font-bold mt-2 mb-5">
                  About {siteSettings?.company_name}
                </h2>
                {(siteSettings?.hero_image || siteSettings?.hero_image_url) ? (
                  <div className="relative h-[320px] mb-6 bg-gray-100 rounded overflow-hidden shadow-sm">
                    <img
                      src={getMediaUrl(siteSettings.hero_image || siteSettings.hero_image_url)}
                      alt={siteSettings?.company_name || "Factory Overview"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : null}
                <div className="prose max-w-none text-gray-700 text-[14px] leading-relaxed space-y-4">
                  {paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {siteSettings && (
                  <div className="bg-[#1b3a6e] text-white p-6 rounded-lg shadow-md">
                    <h4 className="font-bold text-base mb-4 pb-2 border-b border-white/20">
                      Company Facts
                    </h4>
                    <ul className="space-y-3 text-xs">
                      {siteSettings.founding_year && (
                        <li className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="text-gray-300">Established</span>
                          <span className="font-semibold">{siteSettings.founding_year}</span>
                        </li>
                      )}
                      {siteSettings.address && (
                        <li className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="text-gray-300">Headquarters</span>
                          <span className="font-semibold text-right max-w-[180px]">{siteSettings.address}</span>
                        </li>
                      )}
                      {siteSettings.company_type && (
                        <li className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="text-gray-300">Company Type</span>
                          <span className="font-semibold">{siteSettings.company_type}</span>
                        </li>
                      )}
                      {siteSettings.employee_count && (
                        <li className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="text-gray-300">Workforce</span>
                          <span className="font-semibold">{siteSettings.employee_count}</span>
                        </li>
                      )}
                      {siteSettings.stat_projects_completed && (
                        <li className="flex items-center justify-between">
                          <span className="text-gray-300">Completed Projects</span>
                          <span className="font-bold text-[#c8391a] text-sm">{siteSettings.stat_projects_completed}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="bg-[#f8f9fb] border border-gray-200 p-6 rounded-lg">
                  <h4 className="text-[#1b3a6e] font-bold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
                    Quick Navigation
                  </h4>
                  <ul className="space-y-2 text-xs">
                    <li>
                      <Link href="/about/our-team" className="flex items-center gap-2 text-gray-700 hover:text-[#c8391a] py-1 transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c8391a]" />
                        <span>Our Team</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/about/our-clients" className="flex items-center gap-2 text-gray-700 hover:text-[#c8391a] py-1 transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c8391a]" />
                        <span>Our Clients</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/about/our-partners" className="flex items-center gap-2 text-gray-700 hover:text-[#c8391a] py-1 transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c8391a]" />
                        <span>Our Partners</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/products" className="flex items-center gap-2 text-gray-700 hover:text-[#c8391a] py-1 transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c8391a]" />
                        <span>Machinery Catalog</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact-us" className="flex items-center gap-2 text-gray-700 hover:text-[#c8391a] py-1 transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c8391a]" />
                        <span>Contact Us</span>
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="bg-[#c8391a] text-white p-6 rounded-lg shadow-md">
                  <h4 className="font-bold text-base mb-2">Need an Industrial Quote?</h4>
                  <p className="text-red-100 text-xs mb-4 leading-relaxed">
                    Send us your plant capacity, dimensions, and specifications for a detailed technical estimate.
                  </p>
                  <Link
                    href="/contact-us#quote"
                    className="block text-center bg-white text-[#c8391a] font-bold text-xs uppercase tracking-wider py-3 rounded hover:bg-gray-100 transition-colors"
                  >
                    Request a Quote
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
