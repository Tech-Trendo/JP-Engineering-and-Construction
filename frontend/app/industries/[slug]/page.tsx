import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getPublicIndustryDetail,
  getPublicIndustries,
  getPublicSiteSettings,
  getMediaUrl,
} from "@/lib/public-api";
import PageBanner from "@/components/PageBanner";
import IndustryProductCatalog from "@/components/IndustryProductCatalog";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface IndustryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: IndustryPageProps) {
  const { slug } = await params;
  try {
    const industry = await getPublicIndustryDetail(slug);
    if (!industry) return { title: "Industry Not Found - JP Engineering & Construction Pvt. Ltd." };
    return {
      title: `${industry.name} Machinery & Turnkey Plants - JP Engineering & Construction Pvt. Ltd.`,
      description:
        industry.description ||
        `Engineered machinery, processing plants, and equipment for ${industry.name}.`,
    };
  } catch {
    return { title: "Industry Machinery - JP Engineering & Construction Pvt. Ltd." };
  }
}

export default async function DedicatedIndustryPage({ params }: IndustryPageProps) {
  const { slug } = await params;

  let industry = null;
  let allIndustries: Awaited<ReturnType<typeof getPublicIndustries>> = [];
  let siteSettings: Awaited<ReturnType<typeof getPublicSiteSettings>> | null = null;

  try {
    const [detailRes, listRes, settingsRes] = await Promise.allSettled([
      getPublicIndustryDetail(slug),
      getPublicIndustries(),
      getPublicSiteSettings(),
    ]);

    if (detailRes.status === "fulfilled") {
      industry = detailRes.value;
    }
    if (listRes.status === "fulfilled") {
      allIndustries = listRes.value;
    }
    if (settingsRes.status === "fulfilled") {
      siteSettings = settingsRes.value;
    }
  } catch (err) {
    console.error(`[DedicatedIndustryPage] Error loading industry ${slug}:`, err);
  }

  if (!industry) {
    notFound();
  }

  const otherIndustries = allIndustries.filter((i) => i.slug !== industry.slug);
  const products = industry.products || [];
  const categories = industry.categories || [];

  return (
    <>
      {/* Hero Page Banner */}
      <PageBanner
        title={`${industry.name}`}
        subtitle={
          industry.description ||
          `Specialized processing machinery, turnkey industrial plants, and stainless steel fabrication engineered for ${industry.name}.`
        }
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Industries", href: "/industries" },
          { label: industry.name, href: `/industries/${industry.slug}` },
        ]}
      />

      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-[1280px] mx-auto px-4">
          {/* Executive Overview & Key Technical Capabilities */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-10 mb-12 shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
                  Tailored Engineering for {industry.name}
                </h2>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
                  {industry.description}
                </p>

                {/* Technical Standards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-gray-400 block">Sanitation Standard:</span>
                    <span className="text-white font-semibold">AISI 304 / 316L Food Grade</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Automation Architecture:</span>
                    <span className="text-white font-semibold">Siemens PLC / Touch HMI</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Field Support:</span>
                    <span className="text-white font-semibold">24/7 On-Site Nepal Support</span>
                  </div>
                </div>
              </div>

              {/* Stats Highlight Card */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 flex flex-col gap-4">
                <div className="border-b border-slate-700 pb-3">
                  <div className="text-3xl font-extrabold text-[#c8391a]">{products.length}</div>
                  <div className="text-xs text-gray-300 font-medium">Available Machinery &amp; Equipment Models</div>
                </div>
                <div className="border-b border-slate-700 pb-3">
                  <div className="text-3xl font-extrabold text-white">{categories.length}</div>
                  <div className="text-xs text-gray-300 font-medium">Processing &amp; Utility Categories</div>
                </div>
                <Link
                  href={`/contact-us?industry=${encodeURIComponent(industry.name)}#quote`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#c8391a] hover:bg-[#a62d14] text-white text-xs font-bold uppercase tracking-wider py-3 px-4 rounded transition-colors shadow-sm mt-1"
                >
                  Request Proposal for {industry.name}
                </Link>
              </div>
            </div>
          </div>

          {/* Dedicated Machinery Products Catalog */}
          <div className="mb-16">
            <div className="mb-6">
              <span className="text-[#c8391a] text-xs font-bold uppercase tracking-widest">
                Machinery Catalog
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1b3a6e] mt-1">
                Equipment &amp; Plants for {industry.name}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Explore all verified industrial machinery, processing units, and storage infrastructure engineered for this sector.
              </p>
            </div>

            <IndustryProductCatalog
              products={products}
              categories={categories}
              industryName={industry.name}
            />
          </div>

          {/* Turnkey Project Execution Process */}
          <div className="my-16 py-12 px-6 sm:px-10 bg-gray-50 rounded-2xl border border-gray-200">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-[#c8391a] text-xs font-bold uppercase tracking-widest">
                Project Execution
              </span>
              <h3 className="text-2xl font-bold text-[#1b3a6e] mt-1 mb-2">
                How We Deliver {industry.name} Turnkey Plants
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                From concept and capacity sizing to installation, commissioning, and operational training.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: "01",
                  title: "Technical Consultation",
                  desc: "Site inspection, production throughput calculations, utility sizing, and layout planning.",
                },
                {
                  step: "02",
                  title: "Precision SS Fabrication",
                  desc: "Certified TIG welding, mirror-polished food contact surfaces, and pressure vessel testing.",
                },
                {
                  step: "03",
                  title: "SCADA & PLC Automation",
                  desc: "Siemens/Schneider control panel wiring, temperature data logging, and telemetry setup.",
                },
                {
                  step: "04",
                  title: "Commissioning & Training",
                  desc: "Hydrostatic testing, Clean-In-Place verification, and operator machinery certification.",
                },
              ].map((s) => (
                <div key={s.step} className="bg-white p-6 rounded-xl border border-gray-200 relative shadow-2xs">
                  <div className="text-3xl font-black text-[#1b3a6e]/20 mb-2">{s.step}</div>
                  <h4 className="font-bold text-sm text-[#1b3a6e] mb-1.5">{s.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Consultation / Quote Callout */}
          <div className="my-12 bg-gradient-to-r from-[#1b3a6e] to-[#0f2347] text-white rounded-2xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
            <div>
              <span className="text-[#c8391a] text-xs font-bold uppercase tracking-widest">
                Start Your Project
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold mt-1 mb-2">
                Need a Custom Proposal for {industry.name}?
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm max-w-xl">
                Speak directly with Er. Ramesh Adhikari and our mechanical engineering specialists for complete technical specifications and budget estimates.
              </p>
            </div>
            <Link
              href={`/contact-us?industry=${encodeURIComponent(industry.name)}#quote`}
              className="inline-flex items-center justify-center gap-2 bg-[#c8391a] hover:bg-[#a62d14] text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded shadow-sm hover:shadow transition-all shrink-0"
            >
              Request Technical Consultation
            </Link>
          </div>

          {/* Explore Other Industries */}
          {otherIndustries.length > 0 && (
            <div className="mt-16 pt-12 border-t border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-[#c8391a] text-xs font-bold uppercase tracking-widest">
                    Other Sectors
                  </span>
                  <h3 className="text-xl font-bold text-[#1b3a6e] mt-1">
                    Explore Other Industrial Disciplines
                  </h3>
                </div>
                <Link
                  href="/industries"
                  className="text-xs font-bold text-[#1b3a6e] hover:text-[#c8391a] transition-colors"
                >
                  View All ({allIndustries.length}) →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {otherIndustries.map((other) => (
                  <Link
                    key={other.id}
                    href={`/industries/${other.slug}`}
                    className="p-5 rounded-xl border border-gray-200 hover:border-[#1b3a6e] hover:shadow-md transition-all group bg-white"
                  >
                    <h4 className="font-bold text-sm text-gray-900 group-hover:text-[#1b3a6e] transition-colors">
                      {other.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{other.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
