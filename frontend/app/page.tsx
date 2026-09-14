import Link from "next/link";
import ProductCarousel from "@/components/ProductCarousel";
import HeroSlider from "@/components/HeroSlider";
import AnimatedStatCounter from "@/components/AnimatedStatCounter";
import MapSection from "@/components/MapSection";
import {
  getPublicSiteSettings,
  getPublicSiteContent,
  getPublicCategories,
  getPublicProducts,
  getPublicClients,
  getPublicHeroSlides,
  getPublicIndustries,
  getMediaUrl,
  PublicSiteSettings,
  PublicSiteContent,
  PublicCategory,
  PublicProductListItem,
  PublicClient,
  PublicHeroSlide,
  PublicIndustry,
} from "@/lib/public-api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  let siteSettings: PublicSiteSettings | null = null;
  let siteContent: PublicSiteContent | null = null;
  let categories: PublicCategory[] = [];
  let apiProducts: PublicProductListItem[] = [];
  let apiClients: PublicClient[] = [];
  let heroSlides: PublicHeroSlide[] = [];
  let industries: PublicIndustry[] = [];

  let siteSettingsError = false;
  let siteContentError = false;
  let categoriesError = false;
  let productsError = false;
  let clientsError = false;

  const results = await Promise.allSettled([
    getPublicSiteSettings(),
    getPublicSiteContent(),
    getPublicCategories(),
    getPublicProducts({ is_featured: true }),
    getPublicClients(),
    getPublicHeroSlides(),
    getPublicIndustries(),
  ]);

  if (results[0].status === "fulfilled") {
    siteSettings = results[0].value;
  } else {
    siteSettingsError = true;
    console.error("[HomePage] siteSettings fetch failed:", results[0].reason);
  }

  if (results[1].status === "fulfilled") {
    siteContent = results[1].value;
  } else {
    siteContentError = true;
    console.error("[HomePage] siteContent fetch failed:", results[1].reason);
  }

  if (results[2].status === "fulfilled") {
    categories = results[2].value;
  } else {
    categoriesError = true;
    console.error("[HomePage] categories fetch failed:", results[2].reason);
  }

  if (results[3].status === "fulfilled") {
    apiProducts = results[3].value;
  } else {
    productsError = true;
    console.error("[HomePage] products fetch failed:", results[3].reason);
  }

  if (results[4].status === "fulfilled") {
    apiClients = results[4].value;
  } else {
    clientsError = true;
    console.error("[HomePage] clients fetch failed:", results[4].reason);
  }

  if (results[5].status === "fulfilled") {
    heroSlides = results[5].value;
  } else {
    console.error("[HomePage] heroSlides fetch failed:", results[5].reason);
  }

  if (results[6].status === "fulfilled") {
    industries = (results[6] as PromiseFulfilledResult<PublicIndustry[]>).value;
  } else {
    console.error("[HomePage] industries fetch failed:", (results[6] as PromiseRejectedResult).reason);
  }

  // If no featured products found and no error, fetch all products
  let displayProducts = apiProducts;
  if (!productsError && apiProducts.length === 0) {
    try {
      displayProducts = await getPublicProducts();
    } catch {
      productsError = true;
    }
  }

  const stats = siteSettings
    ? [
        { value: siteSettings.stat_years_experience, label: "Years of Experience" },
        { value: siteSettings.stat_projects_completed, label: "Projects Completed" },
        { value: siteSettings.stat_happy_clients, label: "Happy Clients" },
        { value: siteSettings.stat_business_sectors, label: "Industrial Sectors" },
      ].filter((s) => Boolean(s.value))
    : [];

  const heroImageSrc =
    (siteSettings && getMediaUrl(siteSettings.hero_image_url || siteSettings.hero_image)) ||
    "/images/hero-machinery.jpg";

  return (
    <>
      {/* Backend connection warning banner if any core data failed */}
      {(siteSettingsError || categoriesError || productsError) && (
        <div className="bg-amber-50 border-b border-amber-200 py-3 px-4 text-center">
          <p className="text-amber-800 text-xs md:text-sm font-semibold inline-flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            Unable to connect to live backend services. Some sections may be unavailable.
          </p>
        </div>
      )}

      {/* Hero Auto-Sliding Section with Rich Background Images */}
      <HeroSlider siteSettings={siteSettings} slides={heroSlides} />

      {/* Animated Stats bar (gradually increments: 1+, 2+ ... 10+) */}
      <AnimatedStatCounter stats={stats} />

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-[360px] lg:h-[420px] bg-gray-100 rounded overflow-hidden shadow-md flex items-center justify-center">
            {categories[0]?.icon_or_image ? (
              <img
                src={getMediaUrl(categories[0].icon_or_image)}
                alt={siteSettings?.company_name || "Industrial Facility"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#1b3a6e] to-[#0f2347] flex flex-col items-center justify-center text-white p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4 p-2 shadow-inner border border-white/20">
                  <img
                    src={getMediaUrl(siteSettings?.logo_url) || "/assets/logo.png"}
                    alt={siteSettings?.company_name || "JP Engineering & Construction Pvt. Ltd."}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="font-bold text-lg">{siteSettings?.company_name}</div>
                <div className="text-xs text-gray-300 mt-1">{siteSettings?.tagline}</div>
              </div>
            )}
            {siteSettings?.tagline && (
              <div className="absolute bottom-4 left-4 right-4 bg-[#1b3a6e]/95 text-white p-4 backdrop-blur-sm">
                <div className="text-xs uppercase tracking-widest text-[#c8391a] font-bold">
                  Engineering &amp; Manufacturing
                </div>
                <div className="font-semibold text-sm mt-0.5">
                  {siteSettings.tagline}
                </div>
              </div>
            )}
          </div>
          <div>
            <span className="text-[#c8391a] text-xs font-semibold uppercase tracking-widest">
              Who We Are
            </span>
            {siteContentError ? (
              <div className="mt-3 p-6 bg-red-50 border border-red-200 rounded text-center">
                <p className="text-red-700 text-sm font-semibold">
                  Unable to load corporate introduction — please try again later.
                </p>
              </div>
            ) : siteContent ? (
              <>
                <h2 className="text-[#1b3a6e] text-2xl md:text-3xl font-bold mt-2 mb-4 leading-snug">
                  {siteContent.title}
                </h2>
                <p className="text-gray-600 text-[15px] leading-relaxed mb-6 whitespace-pre-line">
                  {siteContent.short_intro}
                </p>
                {categories.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    {categories.slice(0, 4).map((c) => (
                      <div key={c.id} className="flex items-center gap-2.5 text-sm text-gray-700 font-medium">
                        <span className="w-2 h-2 rounded-full bg-[#c8391a] shrink-0" />
                        <span>{c.name}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href="/about/introduction"
                    className="inline-flex items-center justify-center gap-2 bg-[#c8391a] hover:bg-[#a62d14] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded shadow-sm hover:shadow transition-all"
                  >
                    <span>Learn More About Us</span>
                  </Link>
                  <Link
                    href="/contact-us"
                    className="inline-flex items-center justify-center gap-2 bg-[#c8391a] hover:bg-[#a62d14] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded shadow-sm hover:shadow transition-all"
                  >
                    <span>Get In Touch</span>
                  </Link>
                </div>
              </>
            ) : (
              <div className="mt-3 p-6 bg-gray-50 border border-gray-100 rounded text-center">
                <p className="text-gray-500 text-sm">Company details are currently being updated.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Machinery Categories Grid */}
      <section className="py-16 bg-[#f5f6f8]">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[#c8391a] text-xs font-semibold uppercase tracking-widest">
              Industrial Machinery Sectors
            </span>
            <h2 className="text-[#1b3a6e] text-2xl md:text-3xl font-bold mt-2 mb-3">
              Machinery &amp; Equipment Solutions
            </h2>
            <p className="text-gray-500 text-[14px] max-w-[620px] mx-auto">
              We engineer, manufacture, and commission reliable industrial equipment across diverse industrial and agricultural sectors.
            </p>
          </div>

          {categoriesError ? (
            <div className="p-8 border border-red-200 bg-red-50 text-center rounded-lg max-w-md mx-auto">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-2 font-bold">
                !
              </div>
              <p className="text-red-700 font-semibold text-sm">
                Unable to load categories — please try again later.
              </p>
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col"
                >
                  <div className="relative h-[200px] overflow-hidden bg-gray-100 flex items-center justify-center">
                    {cat.icon_or_image ? (
                      <img
                        src={getMediaUrl(cat.icon_or_image)}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1b3a6e]/10 flex flex-col items-center justify-center text-[#1b3a6e] p-4 text-center">
                        <span className="font-bold text-sm">{cat.name}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-4 text-white font-bold text-sm">
                      {cat.name}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <p className="text-gray-600 text-[13px] leading-relaxed mb-4 line-clamp-3">
                      {cat.description}
                    </p>
                    <Link
                      href={`/products#${cat.slug}`}
                      className="inline-flex items-center justify-center gap-2 bg-[#c8391a] hover:bg-[#a62d14] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded shadow-sm hover:shadow transition-all mt-auto"
                    >
                      <span>Explore Equipment</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white border border-gray-100 p-8 rounded-lg">
              <p className="text-gray-500">Categories are currently being configured.</p>
            </div>
          )}
        </div>
      </section>

      {/* Browse by Industry Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-[#c8391a] text-xs font-semibold uppercase tracking-widest">
              Sectors We Serve
            </span>
            <h2 className="text-[#1b3a6e] text-2xl md:text-3xl font-bold mt-2 mb-3">
              Browse Machinery by Industry
            </h2>
            <p className="text-gray-500 text-[14px] max-w-[560px] mx-auto">
              Select an industrial sector to explore specialized processing machinery, turnkey plant capabilities, and engineering solutions tailored for your field.
            </p>
          </div>

          {industries.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {industries.map((industry) => {
                const imgSrc = industry.icon_or_image_url
                  ? getMediaUrl(industry.icon_or_image_url)
                  : industry.icon_or_image
                  ? getMediaUrl(industry.icon_or_image)
                  : null;
                return (
                  <Link
                    key={industry.id}
                    href={`/industries/${industry.slug}`}
                    className="group relative overflow-hidden rounded-xl bg-[#1b3a6e] aspect-[4/3] flex items-end shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Background image */}
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={industry.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#1b3a6e] to-[#0d2144]" />
                    )}
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    {/* Content */}
                    <div className="relative z-10 p-4 w-full flex items-end justify-between">
                      <div>
                        <div className="text-white font-bold text-[14px] leading-snug drop-shadow">
                          {industry.name}
                        </div>
                        {industry.products_count > 0 && (
                          <div className="text-gray-300 text-[11px] mt-0.5">
                            {industry.products_count} machine{industry.products_count !== 1 ? "s" : ""}
                          </div>
                        )}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#c8391a] flex items-center justify-center shrink-0 ml-2 group-hover:bg-white group-hover:text-[#c8391a] transition-colors shadow">
                        <svg className="w-4 h-4 text-white group-hover:text-[#c8391a] transition-colors" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
              {/* View All card */}
              <Link
                href="/industries"
                className="group relative overflow-hidden rounded-xl aspect-[4/3] flex flex-col items-center justify-center bg-gradient-to-br from-[#c8391a] to-[#a62d14] shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-3 group-hover:bg-white/30 transition-colors">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
                <div className="text-white font-bold text-[14px]">View All Sectors</div>
                <div className="text-white/70 text-[11px] mt-0.5">Explore Every Industry</div>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                "Dairy & Milk",
                "Fruits & Agro",
                "Cold Chain",
                "Water Treatment",
                "Meat & Poultry",
                "Beverages",
                "Solar & Energy",
              ].map((name) => (
                <div
                  key={name}
                  className="relative overflow-hidden rounded-xl aspect-[4/3] bg-gradient-to-br from-[#1b3a6e]/80 to-[#0d2144] flex items-end p-4 animate-pulse"
                >
                  <div className="text-white font-bold text-sm">{name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Machinery Products */}
      <section className="py-16 bg-[#f5f6f8]">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[#c8391a] text-xs font-semibold uppercase tracking-widest">
                Our Catalog
              </span>
              <h2 className="text-[#1b3a6e] text-2xl md:text-3xl font-bold mt-1">
                Featured Industrial Machines
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-[#c8391a] hover:bg-[#a62d14] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded shadow-sm hover:shadow transition-all"
            >
              <span>View All Machinery</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {productsError ? (
            <div className="p-8 border border-red-200 bg-red-50 text-center rounded-lg max-w-md mx-auto">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-2 font-bold">
                !
              </div>
              <p className="text-red-700 font-semibold text-sm">
                Unable to load products — please try again later.
              </p>
            </div>
          ) : displayProducts.length > 0 ? (
            <ProductCarousel products={displayProducts} />
          ) : (
            <div className="text-center py-12 border border-gray-100 p-8 rounded bg-gray-50">
              <p className="text-gray-500">No machinery products listed yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Clients Section */}
      {clientsError ? (
        <section className="py-8 bg-[#f8f9fb] border-t border-gray-100">
          <div className="max-w-[1280px] mx-auto px-4 text-center">
            <p className="text-red-700 text-sm">
              Unable to load client organizations — please try again later.
            </p>
          </div>
        </section>
      ) : apiClients.length > 0 ? (
        <section className="py-14 bg-[#f8f9fb] border-t border-gray-100">
          <div className="max-w-[1280px] mx-auto px-4">
            <div className="text-center mb-8">
              <span className="text-[#c8391a] text-xs font-semibold uppercase tracking-widest">
                Trusted By Industry Leaders
              </span>
              <h2 className="text-[#1b3a6e] text-xl md:text-2xl font-bold mt-1">
                Our Valued Clients &amp; Partners
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 items-center">
              {apiClients.map((client) => (
                <div
                  key={client.id}
                  className="bg-white border border-gray-200 p-4 h-24 flex flex-col items-center justify-center text-center shadow-sm hover:border-[#1b3a6e] transition-colors"
                >
                  {client.logo ? (
                    <img
                      src={getMediaUrl(client.logo)}
                      alt={client.name}
                      className="max-h-12 max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-xs font-bold text-[#1b3a6e]">
                      {client.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Google Map Section */}
      <MapSection />

      {/* Persistent Quote CTA Banner from Backend SiteSettings */}
      {siteSettings && siteSettings.cta_heading && (
        <section className="py-14 bg-[#1b3a6e] text-white">
          <div className="max-w-[1280px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-[700px]">
              <span className="text-[#c8391a] text-xs font-bold uppercase tracking-widest">
                {siteSettings.company_name || "JP Engineering & Construction Pvt. Ltd."}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mt-1 mb-2">
                {siteSettings.cta_heading}
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                {siteSettings.cta_subtext}
              </p>
            </div>
            <Link
              href={siteSettings.cta_button_link || "/contact-us"}
              className="shrink-0 inline-flex items-center justify-center gap-2 bg-[#c8391a] hover:bg-[#a62d14] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded shadow-sm hover:shadow transition-all whitespace-nowrap"
            >
              {siteSettings.cta_button_label || "Get In Touch"}
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
