import PageBanner from "@/components/PageBanner";
import { getPublicClients, getPublicSiteSettings, getMediaUrl, PublicClient, PublicSiteSettings } from "@/lib/public-api";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getPublicSiteSettings();
    return {
      title: `Our Valued Clients - ${settings.company_short_name}`,
      description: `Government, NGO/INGO, and commercial clients served by ${settings.company_name}.`,
    };
  } catch {
    return {
      title: "Our Valued Clients - JP Engineering & Construction Pvt. Ltd.",
      description: "Government, NGO/INGO, and commercial clients served by JP Engineering & Construction Pvt. Ltd.",
    };
  }
}

export default async function OurClientsPage() {
  let apiClients: PublicClient[] = [];
  let siteSettings: PublicSiteSettings | null = null;
  let hasError = false;

  const [clientsRes, settingsRes] = await Promise.allSettled([
    getPublicClients(),
    getPublicSiteSettings(),
  ]);

  if (clientsRes.status === "fulfilled") {
    apiClients = clientsRes.value;
  } else {
    hasError = true;
    console.error("[OurClientsPage] getPublicClients failed:", clientsRes.reason);
  }

  if (settingsRes.status === "fulfilled") {
    siteSettings = settingsRes.value;
  }

  return (
    <>
      <PageBanner
        title="Our Valued Clients"
        breadcrumbs={[{ label: "About Us" }, { label: "Our Clients" }]}
      />

      <section className="py-12 bg-white">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[#c8391a] text-xs font-semibold uppercase tracking-widest">
              Trusted By
            </span>
            <h2 className="text-[#1b3a6e] text-2xl md:text-3xl font-bold mt-2 mb-3">
              Industry Leaders &amp; Public Institutions
            </h2>
            <p className="text-gray-500 text-[14px] max-w-[620px] mx-auto">
              {siteSettings
                ? `${siteSettings.company_name} takes pride in having delivered successful machinery and turnkey engineering projects to clients across Nepal.`
                : "Delivering industrial machinery and turnkey processing installations across Nepal."}
            </p>
          </div>

          {hasError ? (
            <div className="p-12 border border-red-200 bg-red-50 text-center rounded-lg max-w-lg mx-auto my-8">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3 font-bold text-xl">
                !
              </div>
              <h3 className="text-red-800 font-bold text-lg mb-1">Unable to load clients</h3>
              <p className="text-red-700 text-sm leading-relaxed">
                Unable to load client organizations — please ensure the backend server is running and try again later.
              </p>
            </div>
          ) : apiClients.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {apiClients.map((client) => (
                <div
                  key={client.id}
                  className="bg-[#f8f9fb] border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center min-h-[140px] text-center hover:border-[#1b3a6e] hover:shadow-md transition-all group"
                >
                  {client.logo ? (
                    <div className="w-full h-16 mb-3 flex items-center justify-center">
                      <img
                        src={getMediaUrl(client.logo)}
                        alt={client.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  ) : null}
                  <h3 className="text-[#1b3a6e] font-bold text-sm leading-snug group-hover:text-[#c8391a] transition-colors">
                    {client.name}
                  </h3>
                  {client.website_url && (
                    <a
                      href={client.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-500 hover:text-[#c8391a] mt-2 underline"
                    >
                      Visit Website &rarr;
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded border border-gray-200 p-8">
              <p className="text-gray-500 text-sm">
                Client listings are currently being updated in the CMS.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
